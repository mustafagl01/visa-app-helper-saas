'use client'

import { VisaType } from '@/types/visa'
import { Clock, HelpCircle } from 'lucide-react'

interface VisaTypeSelectProps {
  visaTypes: VisaType[]
  selected?: string
  onSelect: (visaType: VisaType) => void
  onDontKnow: () => void
}

export default function VisaTypeSelect({ visaTypes, selected, onSelect, onDontKnow }: VisaTypeSelectProps) {
  return (
    <div className="space-y-3">
      {visaTypes.map((vt) => (
        <button
          key={vt.id}
          onClick={() => onSelect(vt)}
          className={`w-full text-left p-5 rounded-xl border-2 transition-all hover:shadow-sm ${
            selected === vt.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{vt.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {vt.fee_amount} {vt.fee_currency}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {vt.processing_time_days} gün
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{vt.description}</p>
        </button>
      ))}

      <button
        onClick={onDontKnow}
        className="w-full p-5 rounded-xl border-2 border-dashed border-gray-300 text-left hover:border-blue-300 hover:bg-blue-50 transition-all"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-medium text-gray-700">Hangisine başvuracağımı bilmiyorum</p>
            <p className="text-sm text-gray-400">AI asistanımız size doğru vize türünü bulmada yardımcı olsun</p>
          </div>
        </div>
      </button>
    </div>
  )
}
