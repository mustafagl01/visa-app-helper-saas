'use client'

import { Country } from '@/types/visa'

interface CountrySelectProps {
  countries: Country[]
  selected?: string
  onSelect: (country: Country) => void
}

export default function CountrySelect({ countries, selected, onSelect }: CountrySelectProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {countries.map((country) => (
        <button
          key={country.id}
          onClick={() => onSelect(country)}
          className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:shadow-md ${
            selected === country.id
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-blue-200'
          }`}
        >
          <span className="text-4xl">{country.flag_emoji}</span>
          <div className="text-center">
            <p className="font-semibold text-gray-900 text-sm">{country.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{country.visa_system}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
