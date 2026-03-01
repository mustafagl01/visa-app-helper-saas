
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

interface Case {
  id: string
  title: string
  status: string
  created_at: string
  visa_types?: { name: string; country: string }
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  chat: { label: 'Görüşme', color: 'bg-blue-100 text-blue-700', icon: Clock },
  documents: { label: 'Belgeler', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  review: { label: 'İnceleme', color: 'bg-purple-100 text-purple-700', icon: Clock },
  complete: { label: 'Tamamlandı', color: 'bg-green-100 text-green-700', icon: CheckCircle },
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchCases()
  }, [])

  async function fetchCases() {
    try {
      const res = await fetch('/api/cases')
      const data = await res.json()
      setCases(data.cases || [])
    } finally {
      setLoading(false)
    }
  }

  async function createCase() {
    setCreating(true)
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Yeni Vize Başvurusu' })
      })
      const data = await res.json()
      if (data.case) window.location.href = `/dashboard/cases/${data.case.id}`
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Başvurularım</h1>
          <button
            onClick={createCase}
            disabled={creating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Oluşturuluyor...' : 'Yeni Başvuru'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        ) : cases.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz başvuru yok</h3>
            <p className="text-gray-500 mb-6">AI asistanınız sizi doğru vize türüne yönlendirecek</p>
            <button onClick={createCase} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Başvuruyu Başlat
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => {
              const status = statusConfig[c.status] || statusConfig.chat
              const Icon = status.icon
              return (
                <Link
                  key={c.id}
                  href={`/dashboard/cases/${c.id}`}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{c.title}</p>
                      <p className="text-sm text-gray-500">
                        {c.visa_types?.name || 'Vize türü belirleniyor'} • {new Date(c.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <Icon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
