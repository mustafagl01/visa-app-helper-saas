-- VisaFlow Initial Schema

CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  flag_emoji VARCHAR(10),
  visa_system VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE visa_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  processing_time_days INT,
  fee_amount DECIMAL(10,2),
  fee_currency VARCHAR(3) DEFAULT 'GBP',
  gov_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE document_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_type_id UUID REFERENCES visa_types(id),
  doc_key VARCHAR(100) NOT NULL,
  doc_name VARCHAR(200) NOT NULL,
  description TEXT,
  source_url VARCHAR(500),
  source_instructions TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  requires_translation BOOLEAN DEFAULT false,
  requires_notarization BOOLEAN DEFAULT false,
  accepted_formats VARCHAR(100),
  condition_field VARCHAR(100),
  condition_value VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  visa_type_id UUID REFERENCES visa_types(id),
  status VARCHAR(50) DEFAULT 'intake',
  case_profile JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE case_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  doc_requirement_id UUID REFERENCES document_requirements(id),
  doc_key VARCHAR(100) NOT NULL,
  file_path VARCHAR(500),
  file_name VARCHAR(200),
  file_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  ai_extracted_data JSONB DEFAULT '{}',
  ai_validation_notes TEXT,
  uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE generated_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  letter_type VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  is_finalized BOOLEAN DEFAULT false,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE consistency_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  check_key VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  price_gbp DECIMAL(10,2) NOT NULL,
  price_try DECIMAL(10,2),
  stripe_price_id VARCHAR(200),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  case_id UUID REFERENCES cases(id),
  plan_id UUID REFERENCES plans(id),
  stripe_session_id VARCHAR(200),
  stripe_payment_intent VARCHAR(200),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_case_documents_case_id ON case_documents(case_id);
CREATE INDEX idx_chat_messages_case_id ON chat_messages(case_id);
CREATE INDEX idx_document_requirements_visa_type ON document_requirements(visa_type_id);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see own cases" ON cases
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see own documents" ON case_documents
  FOR ALL USING (
    case_id IN (SELECT id FROM cases WHERE user_id = auth.uid())
  );

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see own messages" ON chat_messages
  FOR ALL USING (
    case_id IN (SELECT id FROM cases WHERE user_id = auth.uid())
  );

ALTER TABLE generated_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see own letters" ON generated_letters
  FOR ALL USING (
    case_id IN (SELECT id FROM cases WHERE user_id = auth.uid())
  );
