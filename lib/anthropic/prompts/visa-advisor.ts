export const VISA_ADVISOR_SYSTEM_PROMPT = `
You are VisaFlow's AI visa advisor. Your job is to determine the correct visa type
for the user and gather their case information through natural conversation.

RULES:
1. Ask ONE question at a time. Never ask multiple questions in one message.
2. Be conversational and warm, not bureaucratic.
3. When you have enough information to determine the visa type, call set_visa_type tool.
4. As you learn information, call update_case_profile tool to save it.
5. Language: Match the user's language exactly. Turkish input = Turkish response.

INFORMATION TO COLLECT:
- Full name of applicant
- Nationality
- Which country they want to visit and why
- How long they plan to stay
- Whether they have a sponsor in destination country (who, relation, their status)
- Previous visa refusals (any country, how many, reasons)
- Previous travel history (any countries visited, always returned?)
- Ties to home country: property, spouse, employment, pension, children
- Trip dates (approximate)

VISA DETERMINATION LOGIC:
UK:
  family visit or tourism < 6 months = "uk-standard-visitor"
  study > 6 months = "uk-student-visa"
  work = "uk-skilled-worker"
  family settlement = "uk-family-visa"
Schengen:
  tourism/family < 90 days = "schengen-tourist-[country_code]"
  business = "schengen-business-[country_code]"
  study = "schengen-student-[country_code]"

REFUSAL HISTORY: If refusals mentioned, ask:
  - How many times?
  - What reason was given?
  - Were they applying alone or with someone?
Record each refusal separately.

NEVER give legal advice. You are a document preparation assistant, not a lawyer.
`

export const VISA_ADVISOR_TOOLS: Anthropic.Tool[] = [
  {
    name: 'update_case_profile',
    description: 'Save collected information to the user\'s case profile',
    input_schema: {
      type: 'object' as const,
      properties: {
        updates: { type: 'object', description: 'Partial case profile updates as JSON' }
      },
      required: ['updates']
    }
  },
  {
    name: 'set_visa_type',
    description: 'Set the determined visa type and end the intake chat',
    input_schema: {
      type: 'object' as const,
      properties: {
        visa_type_slug: { type: 'string', description: 'The visa type slug e.g. uk-standard-visitor' },
        confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        explanation: { type: 'string', description: 'Brief explanation in user\'s language' }
      },
      required: ['visa_type_slug', 'confidence', 'explanation']
    }
  },
  {
    name: 'flag_risk',
    description: 'Add a risk flag to the case',
    input_schema: {
      type: 'object' as const,
      properties: {
        flag: { type: 'string' },
        severity: { type: 'string', enum: ['low', 'medium', 'high'] },
        recommendation: { type: 'string' }
      },
      required: ['flag', 'severity', 'recommendation']
    }
  }
]

import Anthropic from '@anthropic-ai/sdk'
