import puppeteer from 'puppeteer'

export async function generateLetterPDF(content: string, letterType: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          color: #000;
        }
        .page {
          width: 210mm;
          min-height: 297mm;
          padding: 25mm 25mm 20mm 25mm;
          box-sizing: border-box;
        }
        p { margin: 0 0 12pt 0; }
        .signature-block { margin-top: 40pt; }
      </style>
    </head>
    <body>
      <div class="page">
        ${content.replace(/\n/g, '<br>')}
      </div>
    </body>
    </html>
  `

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  })

  await browser.close()
  return Buffer.from(pdf)
}

export async function generateDocumentChecklistPDF(checks: any[], caseProfile: any): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()

  const rows = checks.map(c => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${c.doc_name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align:center;">
        ${c.status === 'verified' ? '✅' : c.status === 'uploaded' ? '⏳' : '❌'}
      </td>
      <td style="padding: 8px; border: 1px solid #ddd;">${c.ai_validation_notes || '-'}</td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; padding: 30px; }
        h1 { color: #1a365d; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1a365d; color: white; padding: 10px; text-align: left; }
      </style>
    </head>
    <body>
      <h1>VisaFlow — Document Checklist</h1>
      <p>Applicant: ${caseProfile?.applicant?.full_name || 'N/A'}</p>
      <p>Generated: ${new Date().toLocaleDateString('en-GB')}</p>
      <table>
        <thead>
          <tr>
            <th>Document</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `

  await page.setContent(html, { waitUntil: 'networkidle0' })
  const pdf = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()
  return Buffer.from(pdf)
}
