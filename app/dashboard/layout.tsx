'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/cases', label: 'Başvurularım', icon: FileText },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm lg:hidden"
        aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Menüyü kapat"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">✈️ VisaFlow</h1>
          <p className="text-xs text-gray-500 mt-1">AI Vize Asistanı</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              D
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Demo Kullanıcı</p>
              <p className="text-xs text-gray-500">demo@visaflow.ai</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen overflow-auto w-full pt-16 lg:pt-0 lg:pl-64">
        {children}
      </main>
    </div>
  )
}
