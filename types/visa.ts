export interface Country {
  id: string
  name: string
  code: string
  flag_emoji: string
  visa_system: 'UK' | 'Schengen' | 'Other'
  is_active: boolean
}

export interface VisaType {
  id: string
  country_id: string
  name: string
  slug: string
  description: string
  processing_time_days: number
  fee_amount: number
  fee_currency: string
  gov_url: string
  is_active: boolean
  country?: Country
}

export interface DocumentRequirement {
  id: string
  visa_type_id: string
  doc_key: string
  doc_name: string
  description: string
  source_url?: string
  source_instructions?: string
  is_mandatory: boolean
  requires_translation: boolean
  requires_notarization: boolean
  accepted_formats: string
  condition_field?: string
  condition_value?: string
  display_order: number
}
