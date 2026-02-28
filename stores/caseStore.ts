'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CaseProfile } from '@/types/case'

const initialProfile: CaseProfile = {
  applicant: { previous_refusals: [], travel_history: [], home_ties: {} },
  trip: {},
  extracted: {}
}

type Step = 'country' | 'visa_type' | 'chat' | 'documents' | 'letters' | 'guide' | 'tracker'

interface CaseStore {
  caseId: string | null
  visaTypeId: string | null
  visaTypeSlug: string | null
  caseProfile: CaseProfile
  currentStep: Step
  documents: Record<string, { status: string; extractedData: Record<string, unknown> }>
  setCaseId: (id: string) => void
  setVisaType: (id: string, slug: string) => void
  updateCaseProfile: (updates: Partial<CaseProfile>) => void
  updateExtracted: (key: string, value: unknown) => void
  setDocumentStatus: (docKey: string, status: string, extractedData?: Record<string, unknown>) => void
  setStep: (step: Step) => void
  reset: () => void
}

export const useCaseStore = create<CaseStore>()(
  persist(
    (set) => ({
      caseId: null,
      visaTypeId: null,
      visaTypeSlug: null,
      caseProfile: initialProfile,
      currentStep: 'country',
      documents: {},
      setCaseId: (id) => set({ caseId: id }),
      setVisaType: (id, slug) => set({ visaTypeId: id, visaTypeSlug: slug }),
      updateCaseProfile: (updates) =>
        set((state) => ({ caseProfile: { ...state.caseProfile, ...updates } })),
      updateExtracted: (key, value) =>
        set((state) => ({
          caseProfile: {
            ...state.caseProfile,
            extracted: { ...state.caseProfile.extracted, [key]: value }
          }
        })),
      setDocumentStatus: (docKey, status, extractedData = {}) =>
        set((state) => ({
          documents: { ...state.documents, [docKey]: { status, extractedData } }
        })),
      setStep: (step) => set({ currentStep: step }),
      reset: () => set({ caseId: null, visaTypeId: null, visaTypeSlug: null, caseProfile: initialProfile, currentStep: 'country', documents: {} })
    }),
    { name: 'visaflow-case' }
  )
)
