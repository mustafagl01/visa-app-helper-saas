import { CaseProfile } from '@/types/case'

export function buildLetterPrompt(
  letterType: string,
  caseProfile: CaseProfile,
  extractedData: Record<string, unknown>
): string {
  const profileJson = JSON.stringify(caseProfile, null, 2)
  const extractedJson = JSON.stringify(extractedData, null, 2)

  const prompts: Record<string, string> = {
    sponsor_letter: `Write a formal UK Standard Visitor Visa sponsor letter.

SPONSOR: ${JSON.stringify(caseProfile.sponsor, null, 2)}
APPLICANT: ${JSON.stringify(caseProfile.applicant, null, 2)}
TRIP: ${JSON.stringify(caseProfile.trip, null, 2)}
FINANCIAL DATA: ${extractedJson}

REQUIREMENTS:
1. Formal business letter format, today's date
2. Sponsor's full address at top, addressed to UKVI
3. State: relationship, accommodation offer, full financial support
4. Address each previous refusal directly — what has changed
5. Confirm applicant will return to home country, mention their ties (spouse, property)
6. If first visit: frame as long-awaited family reunion, NOT emotional need
7. End: "I confirm the above information is true and accurate to the best of my knowledge"
8. Signature line: [Name], [British Citizen / ILR Holder]
9. Factual, formal, confident tone

Return complete letter text only.`,

    cover_letter: `Write a UK Standard Visitor Visa cover letter FROM THE APPLICANT.

CASE DATA: ${profileJson}

REQUIREMENTS:
1. First person ("I"), formal but personal
2. State purpose: first family visit (NOT "emotional support" or "psychological need")
3. For EACH previous refusal: acknowledge it, state reason given, explain what changed
4. Emphasize home ties: spouse, property, pension, etc.
5. State exact trip duration and dates
6. Final line must be: "I will return to [country] on [date] to be with my [husband/family/etc]"
7. Maximum 1 page (400-500 words)

Return complete letter text only.`,

    daughter_support_letter: `Write a brief support letter from the daughter (UK resident) supporting her mother's visa application.

CASE DATA: ${profileJson}

REQUIREMENTS:
1. Short (200-250 words max)
2. State her UK status
3. Confirm mother-daughter relationship
4. State this is FIRST visit since daughter moved to UK (if is_first_visit=true)
5. Confirm mother will stay at family home at [sponsor address]
6. Confirm mother will return to husband in home country
7. DO NOT mention emotional support, psychological needs, or that mother is "needed"
8. Warm but factual tone

Return complete letter text only.`,

    travel_itinerary: `Create a formal travel itinerary document for a UK visa application.

TRIP: ${JSON.stringify(caseProfile.trip, null, 2)}
APPLICANT: ${caseProfile.applicant?.full_name}
ACCOMMODATION: ${caseProfile.sponsor?.address}

Create a week-by-week itinerary that:
1. Shows arrival and departure dates clearly
2. Lists planned activities (family time, sightseeing, etc)
3. Shows accommodation at sponsor's address throughout
4. Shows return flight date prominently

Return complete itinerary text only.`
  }

  return prompts[letterType] || `Generate a ${letterType} letter for this visa application: ${profileJson}`
}
