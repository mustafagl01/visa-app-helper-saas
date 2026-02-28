export interface ConsistencyResult {
  key: string
  status: 'pass' | 'fail' | 'warning'
  message: string
}

export function runConsistencyChecks(
  caseProfile: Record<string, unknown>,
  extractedData: Record<string, unknown>
): ConsistencyResult[] {
  const checks: ConsistencyResult[] = []
  const today = new Date()

  const applicant = caseProfile.applicant as Record<string, unknown> | undefined
  const sponsor = caseProfile.sponsor as Record<string, unknown> | undefined
  const trip = caseProfile.trip as Record<string, unknown> | undefined

  // 1. Sponsor name consistency
  const sponsorName = sponsor?.full_name as string | undefined
  if (sponsorName) {
    const bankName = extractedData.sponsor_bank_statement_account_holder_name as string | undefined
    const mortgageName = extractedData.sponsor_mortgage_statement_account_holder_name as string | undefined

    if (bankName && !namesMatch(sponsorName, bankName)) {
      checks.push({ key: 'sponsor_name_bank', status: 'fail',
        message: `Sponsor name "${sponsorName}" doesn't match bank statement "${bankName}"` })
    } else if (bankName) {
      checks.push({ key: 'sponsor_name_bank', status: 'pass', message: 'Sponsor name matches bank statement ✓' })
    }

    if (mortgageName && !namesMatch(sponsorName, mortgageName)) {
      checks.push({ key: 'sponsor_name_mortgage', status: 'fail',
        message: `Sponsor name "${sponsorName}" doesn't match mortgage statement "${mortgageName}"` })
    }
  }

  // 2. Address consistency
  const sponsorAddress = sponsor?.address as string | undefined
  if (sponsorAddress) {
    const mortgageAddr = extractedData.sponsor_mortgage_statement_property_address as string | undefined
    const utilityAddr = extractedData.sponsor_utility_bill_service_address as string | undefined

    if (mortgageAddr && !addressesMatch(sponsorAddress, mortgageAddr)) {
      checks.push({ key: 'address_mortgage', status: 'fail',
        message: `Sponsor address doesn't match mortgage statement address` })
    } else if (mortgageAddr) {
      checks.push({ key: 'address_mortgage', status: 'pass', message: 'Address matches mortgage statement ✓' })
    }

    if (utilityAddr && !addressesMatch(sponsorAddress, utilityAddr)) {
      checks.push({ key: 'address_utility', status: 'fail',
        message: `Sponsor address doesn't match utility bill address` })
    } else if (utilityAddr) {
      checks.push({ key: 'address_utility', status: 'pass', message: 'Address matches utility bill ✓' })
    }
  }

  // 3. Trip duration vs ticket dates
  const durationDays = trip?.duration_days as number | undefined
  const departureDate = trip?.departure_date as string | undefined
  const returnDate = trip?.return_date as string | undefined

  if (departureDate && returnDate && durationDays) {
    const dep = new Date(departureDate)
    const ret = new Date(returnDate)
    const actualDays = Math.round((ret.getTime() - dep.getTime()) / 86400000)
    if (Math.abs(actualDays - durationDays) > 2) {
      checks.push({ key: 'trip_duration', status: 'fail',
        message: `Stated duration (${durationDays} days) doesn't match ticket dates (${actualDays} days)` })
    } else {
      checks.push({ key: 'trip_duration', status: 'pass', message: 'Trip duration matches ticket dates ✓' })
    }
  }

  // 4. Passport expiry
  const passportExpiry = applicant?.passport_expiry as string | undefined
  if (passportExpiry && returnDate) {
    const expiry = new Date(passportExpiry)
    const retDate = new Date(returnDate)
    retDate.setMonth(retDate.getMonth() + 6)
    if (expiry < retDate) {
      checks.push({ key: 'passport_expiry', status: 'fail',
        message: `Passport expires ${passportExpiry} — must be valid 6+ months after return date` })
    } else {
      checks.push({ key: 'passport_expiry', status: 'pass', message: 'Passport validity OK ✓' })
    }
  }

  // 5. Bank statement recency (must be within 3 months)
  const bankEnd = extractedData.sponsor_bank_statement_statement_period_end as string | undefined
  if (bankEnd) {
    const statementDate = new Date(bankEnd)
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    if (statementDate < threeMonthsAgo) {
      checks.push({ key: 'bank_statement_recency', status: 'fail',
        message: `Bank statement from ${bankEnd} is older than 3 months — get a fresh one` })
    } else {
      checks.push({ key: 'bank_statement_recency', status: 'pass', message: 'Bank statement is recent ✓' })
    }
  }

  // 6. Financial sufficiency
  const balance = extractedData.sponsor_bank_statement_closing_balance as number | undefined
  const tripDays = durationDays || 30
  const minRequired = tripDays * 100
  if (balance !== undefined) {
    if (balance < minRequired) {
      checks.push({ key: 'financial_sufficiency', status: 'warning',
        message: `Sponsor balance (£${balance}) may be low for ${tripDays} day trip (recommended min £${minRequired})` })
    } else {
      checks.push({ key: 'financial_sufficiency', status: 'pass',
        message: `Sponsor balance (£${balance}) sufficient for trip ✓` })
    }
  }

  // 7. Previous refusals declared
  const refusals = (applicant?.previous_refusals as unknown[]) || []
  if (refusals.length > 0) {
    checks.push({ key: 'refusals_acknowledged', status: 'warning',
      message: `${refusals.length} previous refusal(s) MUST be declared in application form and addressed in cover letter` })
  }

  return checks
}

function namesMatch(a: string, b: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
  return normalize(a).includes(normalize(b.split(' ')[0])) ||
         normalize(b).includes(normalize(a.split(' ')[0]))
}

function addressesMatch(a: string, b: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
  const aWords = normalize(a).split(' ')
  const bNorm = normalize(b)
  const matchingWords = aWords.filter(w => w.length > 3 && bNorm.includes(w))
  return matchingWords.length >= 2
}
