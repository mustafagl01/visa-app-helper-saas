// lib/consistency/checker.ts

export function runConsistencyChecks(profile: any, extracted: any, requirements: any) {
  const checks = [];

  // Passport consistency
  if (profile.personal?.passport_number && extracted.passport_number && profile.personal.passport_number !== extracted.passport_number) {
    checks.push({
      check_key: 'passport_number_mismatch',
      status: 'failed',
      message: 'Pasaport numarası profil ile belgede uyuşmuyor',
      severity: 'high'
    });
  }

  // Name consistency
  if (profile.personal?.full_name && extracted.full_name && profile.personal.full_name !== extracted.full_name) {
    checks.push({
      check_key: 'name_mismatch',
      status: 'warning',
      message: 'İsim profil ile belgede ufak farklılık var',
      severity: 'medium'
    });
  }

  // Bank balance consistency
  if (profile.financial?.monthly_income && extracted.bank_balance) {
    const monthlyIncome = parseFloat(profile.financial.monthly_income);
    const bankBalance = parseFloat(extracted.bank_balance);
    if (bankBalance < monthlyIncome * 3) {
      checks.push({
        check_key: 'low_bank_balance',
        status: 'warning',
        message: 'Banka bakiyesi 3 aylık gelirden düşük',
        severity: 'medium'
      });
    }
  }

  return checks;
}
