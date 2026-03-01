
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'

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

export default function DashboardPage() {
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
    } catch (error) {
      console.error('Error fetching cases:', error)
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
      if (data.case) {
        window.location.href = `/dashboard/cases/${data.case.id}`
      }
    } catch (error) {
      console.error('Error creating case:', error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hoş geldiniz 👋</h1>
            <p className="text-gray-500 mt-1">Vize başvurularınızı AI ile kolaylaştırın</p>
          </div>
          <button
            onClick={createCase}
            disabled={creating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Oluşturuluyor...' : 'Yeni Başvuru'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Toplam Başvuru</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{cases.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Devam Eden</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {cases.filter(c => c.status !== 'complete').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Tamamlanan</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {cases.filter(c => c.status === 'complete').length}
            </p>
          </div>
        </div>

        {/* Cases List */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Başvurularım</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Henüz başvuru yok</p>
              <button
                onClick={createCase}
                className="mt-3 text-blue-600 text-sm font-medium hover:underline"
              >
                İlk başvuruyu oluştur →
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cases.map((c) => {
                const status = statusConfig[c.status] || statusConfig.chat
                const Icon = status.icon
                return (
                  <li key={c.id}>
                    <Link
                      href={`/dashboard/cases/${c.id}`}
                      className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.title}</p>
                          <p className="text-sm text-gray-500">
                            {c.visa_types?.name || 'Vize türü belirleniyor...'} •{' '}
                            {new Date(c.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <Icon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
