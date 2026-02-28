-- Seed Data

INSERT INTO countries (name, code, flag_emoji, visa_system) VALUES
('United Kingdom', 'GBR', '🇬🇧', 'UK'),
('France', 'FRA', '🇫🇷', 'Schengen'),
('Germany', 'DEU', '🇩🇪', 'Schengen'),
('Netherlands', 'NLD', '🇳🇱', 'Schengen'),
('Spain', 'ESP', '🇪🇸', 'Schengen'),
('Italy', 'ITA', '🇮🇹', 'Schengen');

INSERT INTO visa_types (country_id, name, slug, description, processing_time_days, fee_amount, gov_url)
VALUES (
  (SELECT id FROM countries WHERE code = 'GBR'),
  'Standard Visitor Visa',
  'uk-standard-visitor',
  'For tourism, family visits, or short business trips to the UK (up to 6 months)',
  21,
  115.00,
  'https://www.gov.uk/standard-visitor'
);

INSERT INTO visa_types (country_id, name, slug, description, processing_time_days, fee_amount, gov_url)
VALUES (
  (SELECT id FROM countries WHERE code = 'GBR'),
  'UK Student Visa',
  'uk-student-visa',
  'For studying in the UK for more than 6 months',
  15,
  490.00,
  'https://www.gov.uk/student-visa'
);

INSERT INTO visa_types (country_id, name, slug, description, processing_time_days, fee_amount, gov_url)
VALUES (
  (SELECT id FROM countries WHERE code = 'FRA'),
  'Schengen Tourist Visa (France)',
  'schengen-tourist-fra',
  'Short stay visa for tourism or family visit in France / Schengen area',
  15,
  80.00,
  'https://france-visas.gouv.fr'
);

-- Document requirements for UK Standard Visitor
INSERT INTO document_requirements (visa_type_id, doc_key, doc_name, description, source_url, source_instructions, is_mandatory, requires_translation, display_order, condition_field, condition_value) VALUES

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'applicant_passport', 'Valid Passport',
'Passport must be valid for the entire trip plus 6 months after return date',
NULL, 'Photograph the photo page and all pages with previous visas and entry/exit stamps',
true, false, 1, NULL, NULL),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'applicant_bank_statement', 'Applicant Bank Statement (3 months)',
'Shows your personal financial situation in your home country',
NULL, 'Download from your online banking portal. Must show last 3 months of all transactions.',
true, true, 2, NULL, NULL),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'travel_itinerary', 'Flight Booking Confirmation (Return)',
'Return flight booking showing both your entry and exit dates from the UK',
NULL, 'Book a flexible or refundable ticket. Must clearly show both departure date and return date.',
true, false, 3, NULL, NULL),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'property_deed', 'Property Ownership Document (Tapu)',
'Proves you own property in Turkey — strong tie showing you will return home',
NULL, 'Obtain from Tapu ve Kadastro Müdürlüğü or your bank if mortgaged. Must be notarized and translated into English.',
false, true, 4, NULL, NULL),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'sgk_document', 'SGK / Pension Record',
'Social security or pension document showing employment ties to Turkey',
'https://www.turkiye.gov.tr',
'Log in to e-Devlet at turkiye.gov.tr → Search for "SGK Hizmet Dökümü" → Download PDF. Must be translated into English.',
false, true, 5, NULL, NULL),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'family_registry', 'Family Registry (Nüfus Kayıt Örneği)',
'Shows family members remaining in Turkey — spouse, children etc.',
'https://www.turkiye.gov.tr',
'Log in to e-Devlet at turkiye.gov.tr → Search for "Nüfus Kayıt Örneği" → Download PDF. Must be translated into English.',
false, true, 6, NULL, NULL),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'sponsor_passport', 'Sponsor Passport or BRP Card',
'Proves the sponsor identity and their UK immigration status',
NULL, 'Photocopy all pages of passport including photo page. If BRP holder, photocopy front and back of BRP card.',
true, false, 10, 'sponsor.relation', 'NOT_NULL'),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'sponsor_bank_statement', 'Sponsor Bank Statement (6 months)',
'Shows the sponsor has sufficient funds to support your visit',
NULL, 'Download from online banking. Must cover last 6 full months. All transactions must be clearly visible.',
true, false, 11, 'sponsor.relation', 'NOT_NULL'),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'sponsor_payslip', 'Sponsor Payslips (3 months)',
'Confirms the sponsor has regular employment income',
NULL, 'Obtain from employer or payroll system. Must show name, employer company, and salary amount.',
true, false, 12, 'sponsor.employment_type', 'employed'),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'sponsor_sa302', 'SA302 Tax Calculation (Self-Employed Sponsor)',
'Official income proof from HMRC for self-employed or company director sponsors',
'https://www.gov.uk/self-assessment-tax-returns',
'Log in at tax.service.gov.uk → Self Assessment → Tax Return → SA302 → Download PDF. Also download the Tax Year Overview from the same page. Both documents are required.',
true, false, 13, 'sponsor.employment_type', 'self_employed'),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'sponsor_companies_house', 'Companies House Registration',
'Proves the sponsor company exists and is active in the UK',
'https://find-and-update.company-information.service.gov.uk',
'Go to find-and-update.company-information.service.gov.uk → Search your company name → Download Certificate of Incorporation and latest annual filing.',
true, false, 14, 'sponsor.employment_type', 'self_employed'),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'sponsor_mortgage_statement', 'Mortgage Statement',
'Proves sponsor owns the UK property where you will stay',
NULL, 'Download from your mortgage provider online portal. Must show property address and account holder name.',
false, false, 15, 'sponsor.has_mortgage', 'true'),

((SELECT id FROM visa_types WHERE slug = 'uk-standard-visitor'),
'sponsor_utility_bill', 'Utility Bill or Council Tax (max 3 months old)',
'Confirms the sponsor current UK address',
NULL, 'Download from your energy, water, or council tax provider portal. Must be dated within last 3 months and show your name and address.',
true, false, 16, 'sponsor.relation', 'NOT_NULL');

-- Pricing plans
INSERT INTO plans (name, price_gbp, price_try, features) VALUES
('DIY', 49.00, 1600.00, '["AI visa type detection", "Personalised document checklist", "Letter templates", "Consistency checker", "Application form guide"]'),
('Assisted', 149.00, 5000.00, '["Everything in DIY", "Human advisor review", "Letter corrections", "Priority support"]'),
('Managed', 299.00, 10000.00, '["Everything in Assisted", "VFS appointment guidance", "Free revision if refused", "Dedicated case manager"]');
