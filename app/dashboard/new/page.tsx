
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Country, VisaType } from '@/types/visa'
import ProgressBar from '@/components/wizard/ProgressBar'
import CountrySelect from '@/components/wizard/CountrySelect'
import VisaTypeSelect from '@/components/wizard/VisaTypeSelect'
import ChatWindow from '@/components/chat/ChatWindow'
import { ArrowLeft } from 'lucide-react'

const WIZARD_STEPS = ['Ülke Seç', 'Vize Türü', 'AI Danışman']

export default function NewCasePage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [countries, setCountries] = useState<Country[]>([])
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tempCaseId, setTempCaseId] = useState<string | null>(null)

  useEffect(() => {
    loadCountries()
  }, [])

  async function loadCountries() {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('is_active', true)
        .order('name')
      if (error) throw error
      setCountries(data || [])
    } catch (e) {
      setError('Ülkeler yüklenemedi.')
      console.error(e)
    }
  }

  async function handleCountrySelect(country: Country) {
    setSelectedCountry(country)
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('visa_types')
        .select('*')
        .eq('country_id', country.id)
        .eq('is_active', true)
        .order('name')
      if (error) throw error
      setVisaTypes(data || [])
      setStep(2)
    } catch (e) {
      setError('Vize türleri yüklenemedi.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleVisaTypeSelect(visaType: VisaType) {
    setSelectedVisaType(visaType)
    await createCase(visaType.id)
  }

  async function handleDontKnow() {
    // Create a temp case without visa type, go to AI chat
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get first visa type as placeholder (will be updated by AI)
      const firstVt = visaTypes[0]
      if (!firstVt) { setStep(3); setLoading(false); return }

      const { data, error } = await supabase
        .from('cases')
        .insert({
          user_id: session.user.id,
          visa_type_id: firstVt.id,
          status: 'intake',
          case_profile: {
            applicant: { previous_refusals: [], travel_history: [], home_ties: {} },
            trip: {},
            extracted: {},
          },
        })
        .select()
        .single()

      if (error) throw error
      setTempCaseId(data.id)
      setStep(3)
    } catch (e) {
      setError('Oturum başlatılamadı.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function createCase(visaTypeId: string) {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('cases')
        .insert({
          user_id: session.user.id,
          visa_type_id: visaTypeId,
          status: 'intake',
          case_profile: {
            applicant: { previous_refusals: [], travel_history: [], home_ties: {} },
            trip: {},
            extracted: {},
          },
        })
        .select()
        .single()

      if (error) throw error
      router.push(`/dashboard/cases/${data.id}`)
    } catch (e) {
      setError('Başvuru oluşturulamadı.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleVisaTypeFromAI(visaTypeId: string) {
    if (!tempCaseId) return
    // Update the case with the AI-determined visa type
    await supabase.from('cases').update({ visa_type_id: visaTypeId }).eq('id', tempCaseId)
    router.push(`/dashboard/cases/${tempCaseId}`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {step > 1 ? 'Geri' : 'Dashboard\'a Dön'}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Başvuru</h1>
        <p className="text-gray-500 mt-1">Vize başvurunuzu adım adım oluşturun</p>
      </div>

      <div className="mb-8">
        <ProgressBar currentStep={step} steps={WIZARD_STEPS} />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && step !== 3 && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 mt-3">Yükleniyor...</p>
        </div>
      )}

      {!loading && step === 1 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hangi ülkeye başvuruyorsunuz?</h2>
          <CountrySelect
            countries={countries}
            selected={selectedCountry?.id}
            onSelect={handleCountrySelect}
          />
        </div>
      )}

      {!loading && step === 2 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedCountry?.flag_emoji} {selectedCountry?.name} — Vize Türünü Seçin
          </h2>
          <VisaTypeSelect
            visaTypes={visaTypes}
            selected={selectedVisaType?.id}
            onSelect={handleVisaTypeSelect}
            onDontKnow={handleDontKnow}
          />
        </div>
      )}

      {step === 3 && tempCaseId && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🤖 AI Vize Danışmanı
          </h2>
          <p className="text-gray-500 mb-6">Seyahat amacınızı ve planınızı anlatın, doğru vize türünü belirleyelim.</p>
          <ChatWindow
            caseId={tempCaseId}
            onVisaTypeSelected={handleVisaTypeFromAI}
          />
        </div>
      )}
    </div>
  )
}
