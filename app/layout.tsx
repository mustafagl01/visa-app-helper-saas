import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VisaFlow — AI Destekli Vize Başvuru Asistanı',
  description: 'UK ve Schengen vize başvurularınızı yapay zeka ile kolaylaştırın.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
