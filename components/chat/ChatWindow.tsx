'use client'

import { FormEvent, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type ChatWindowProps = {
  caseId: string
  onVisaTypeSelected: (visaTypeId: string) => void
}

export default function ChatWindow({ caseId, onVisaTypeSelected }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = input.trim()
    if (!value || loading) return

    const nextMessages: Message[] = [...messages, { role: 'user', content: value }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: value,
          history: nextMessages,
          caseId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'AI yanıtı alınamadı')
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message || 'Yanıt alınamadı.' }])

      if (data?.visaTypeSet?.id) {
        onVisaTypeSelected(data.visaTypeSet.id)
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-xl bg-white">
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500">
            Merhaba! Vize amacınızı yazın, size en uygun vize türünü birlikte belirleyelim.
          </p>
        )}
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
              message.role === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Seyahat planınızı yazın..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </form>
    </div>
  )
}
