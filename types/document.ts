export interface CaseDocument {
  id: string
  case_id: string
  doc_key: string
  file_path?: string
  file_name?: string
  file_type?: string
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
  ai_extracted_data: Record<string, unknown>
  ai_validation_notes?: string
  uploaded_at?: string
  created_at: string
}

export interface GeneratedLetter {
  id: string
  case_id: string
  letter_type: string
  content: string
  is_finalized: boolean
  generated_at: string
  updated_at: string
}

export interface ConsistencyCheck {
  id: string
  case_id: string
  check_key: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  checked_at: string
}
