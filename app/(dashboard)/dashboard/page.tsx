import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowRight, Clock } from 'lucide-react'
import { Case } from '@/types/case'

const statusLabels: Record<string, { label: string; color: string }> = {
  intake: { label: 'Devam Ediyor', color: 'bg-yellow-100 text-yellow-700' },
  documents: { label: 'Belgeler', color: 'bg-blue-100 text-blue-700' },
  letters: { label: 'Mektuplar', color: 'bg-purple-100 text-purple-700' },
  review: { label: 'İnceleme', color: 'bg-orange-100 text-orange-700' },
  submitted: { label: 'Gönderildi', color: 'bg-gray-100 text-gray-700' },
  approved: { label: 'Onaylandı', color: 'bg-green-100 text-green-700' },
  refused: { label: 'Reddedildi', color: 'bg-red-100 text-red-700' },
}

export default async function DashboardPage() {
  const supabase = await createClient()

  let cases: (Case & { visa_types: { name: string; countries: { name: string; flag_emoji: string } } })[] = []
  let error: string | null = null

  try {
    const { data, error: fetchError } = await supabase
      .from('cases')
      .select(`
        *,
        visa_types (
          name,
          countries (
            name,
            flag_emoji
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError
    cases = data || []
  } catch (e) {
    error = 'Başvurular yüklenemedi.'
    console.error(e)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Başvurularınız ve son durum</p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Yeni Başvuru
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      {cases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <div className="text-5xl mb-4">🛫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz başvurunuz yok</h3>
          <p className="text-gray-500 mb-6">İlk vize başvurunuzu oluşturmak için aşağıya tıklayın</p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Yeni Başvuru Oluştur
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => {
            const status = statusLabels[c.status] || { label: c.status, color: 'bg-gray-100 text-gray-700' }
            const country = c.visa_types?.countries
            return (
              <div key={c.id} className="bg-white rounded-xl border p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{country?.flag_emoji || '🏳️'}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {country?.name || 'Bilinmiyor'} — {c.visa_types?.name || 'Vize Türü'}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(c.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/dashboard/case/${c.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                >
                  Devam Et
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
