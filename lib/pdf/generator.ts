// PDF generation - simple text export for Cloudflare Workers compatibility
// Puppeteer is not supported in edge runtime

export function generateLetterText(content: string, title: string = 'Visa Support Letter'): string {
  return `${title}\n${'='.repeat(title.length)}\n\n${content}`
}

export function letterToBlob(content: string): Uint8Array {
  const text = typeof content === 'string' ? content : JSON.stringify(content)
  return new TextEncoder().encode(text)
}
