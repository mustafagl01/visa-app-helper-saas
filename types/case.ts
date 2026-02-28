export interface PreviousRefusal {
  country: string
  date: string
  visa_type: string
  reason: string
  applied_with?: string
}

export interface TravelRecord {
  country: string
  year: number
  returned: boolean
}

export interface HomeTies {
  spouse_in_home_country?: boolean
  property_owned?: boolean
  employment?: boolean
  pension?: boolean
  children_in_home_country?: boolean
  other?: string[]
}

export interface CaseProfile {
  applicant: {
    full_name?: string
    nationality?: string
    date_of_birth?: string
    passport_number?: string
    passport_expiry?: string
    current_country?: string
    email?: string
    phone?: string
    previous_refusals: PreviousRefusal[]
    travel_history: TravelRecord[]
    home_ties: HomeTies
  }
  sponsor?: {
    full_name?: string
    relation?: string
    uk_status?: string
    address?: string
    employment_type?: string
    company_name?: string
    companies_house_number?: string
    annual_income?: number
    has_mortgage?: boolean
    mortgage_address?: string
  }
  trip: {
    purpose?: string
    duration_days?: number
    departure_date?: string
    return_date?: string
    accommodation_type?: string
    is_first_visit?: boolean
  }
  extracted: Record<string, unknown>
  risk?: {
    score?: number
    flags?: string[]
    recommendations?: string[]
  }
}

export interface Case {
  id: string
  user_id: string
  visa_type_id: string
  status: 'intake' | 'documents' | 'letters' | 'review' | 'submitted' | 'approved' | 'refused'
  case_profile: CaseProfile
  created_at: string
  updated_at: string
}
