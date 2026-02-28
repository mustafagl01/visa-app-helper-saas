export function buildDocumentAnalyzerPrompt(docKey: string, docName: string): string {
  const schemas: Record<string, string> = {
    sponsor_bank_statement: `{
  "account_holder_name": "",
  "bank_name": "",
  "statement_period_start": "YYYY-MM-DD",
  "statement_period_end": "YYYY-MM-DD",
  "closing_balance": 0.00,
  "currency": "",
  "average_monthly_balance": 0.00,
  "has_regular_income": true,
  "large_unexplained_deposits": [],
  "validation_issues": []
}`,
    applicant_bank_statement: `{
  "account_holder_name": "",
  "bank_name": "",
  "statement_period_start": "YYYY-MM-DD",
  "statement_period_end": "YYYY-MM-DD",
  "closing_balance": 0.00,
  "currency": "",
  "validation_issues": []
}`,
    sponsor_sa302: `{
  "taxpayer_name": "",
  "tax_year": "",
  "total_income": 0.00,
  "self_employment_income": 0.00,
  "dividend_income": 0.00,
  "validation_issues": []
}`,
    sponsor_mortgage_statement: `{
  "account_holder_name": "",
  "property_address": "",
  "outstanding_balance": 0.00,
  "monthly_payment": 0.00,
  "lender_name": "",
  "statement_date": "YYYY-MM-DD",
  "validation_issues": []
}`,
    sponsor_utility_bill: `{
  "account_holder_name": "",
  "service_address": "",
  "provider_name": "",
  "bill_date": "YYYY-MM-DD",
  "validation_issues": []
}`,
    employer_letter: `{
  "employee_name": "",
  "employer_company": "",
  "job_title": "",
  "employment_start_date": "YYYY-MM-DD",
  "annual_salary": 0.00,
  "letter_date": "YYYY-MM-DD",
  "is_on_letterhead": true,
  "has_signature": true,
  "validation_issues": []
}`,
    property_deed: `{
  "owner_name": "",
  "property_address": "",
  "registration_date": "YYYY-MM-DD",
  "validation_issues": []
}`
  }

  const schema = schemas[docKey] || `{"key_fields": {}, "validation_issues": []}`

  return `You are analyzing a document for a UK/Schengen visa application.
Document type: ${docName} (key: ${docKey})

Extract ALL relevant information and return ONLY valid JSON matching this schema:
${schema}

validation_issues: List any problems like expired dates, name mismatches, missing signatures, etc.
Return ONLY valid JSON, no explanation text.`
}
