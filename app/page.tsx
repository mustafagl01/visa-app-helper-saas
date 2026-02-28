import Link from 'next/link'
import { CheckCircle, FileText, MessageSquare, Globe, Send } from 'lucide-react'

const steps = [
  { icon: Globe, title: 'Ülke Seç', desc: 'Ziyaret etmek istediğin ülkeyi seç' },
  { icon: MessageSquare, title: 'Vize Belirle', desc: 'AI yardımıyla doğru vize türünü bul' },
  { icon: FileText, title: 'Belge Topla', desc: 'Gerekli belgeleri yükle, AI doğrulasın' },
  { icon: CheckCircle, title: 'Mektup Üret', desc: 'Profesyonel destek mektupları oluştur' },
  { icon: Send, title: 'Başvur', desc: 'Hazır formla başvurunu tamamla' },
]

const plans = [
  {
    name: 'DIY',
    price: '£49',
    desc: 'Kendin yap',
    features: ['AI vize belirleme', 'Belge kontrol listesi', 'Form rehberi', 'E-posta destek'],
    highlight: false,
  },
  {
    name: 'Assisted',
    price: '£149',
    desc: 'Uzman destekli',
    features: ['DIY\'deki her şey', 'Otomatik mektup üretimi', 'Tutarlılık kontrolü', '1 uzman incelemesi'],
    highlight: true,
  },
  {
    name: 'Managed',
    price: '£299',
    desc: 'Tam hizmet',
    features: ['Assisted\'daki her şey', 'Sınırsız revizyon', 'Öncelikli destek', 'Başvuru takibi'],
    highlight: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-xl font-bold text-blue-600">VisaFlow</span>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Teste Başla
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-24">
        <div className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          🇬🇧 UK & Schengen Vize Asistanı
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          UK &amp; Schengen Vize Başvurunuzu{' '}
          <span className="text-blue-600">Kolaylaştırın</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Yapay zeka destekli asistanımız, doğru vizeyi bulmanızdan belge hazırlamaya,
          destek mektuplarından başvuru takibine kadar tüm süreci sizin için yönetir.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 font-medium"
          >
            Dashboard'a Git
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-3 border border-gray-300 text-gray-700 text-lg rounded-lg hover:bg-gray-50 font-medium"
          >
            Nasıl Çalışır?
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Nasıl Çalışır?</h2>
          <p className="text-center text-gray-500 mb-12">5 adımda vize başvurunuzu tamamlayın</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-xs font-bold text-blue-600 mb-1">AD{i < 3 ? 'I' : 'I'}M {i + 1}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Fiyatlar</h2>
          <p className="text-center text-gray-500 mb-12">İhtiyacınıza uygun planı seçin</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 ${
                  plan.highlight
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                    En Popüler
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
                <div className="text-4xl font-bold text-gray-900 mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-center text-gray-400 text-sm">
        <p>© 2025 VisaFlow. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}
