export const genAI = {
  getGenerativeModel: () => ({
    generateContent: async () => ({ response: { text: () => 'LLM API servisi devre dışı bırakılmıştır.' } }),
    startChat: () => ({ sendMessage: async () => ({ response: { text: () => 'LLM API servisi devre dışı bırakılmıştır.' } }) })
  })
}
export const geminiModel = genAI.getGenerativeModel()
export const geminiProModel = genAI.getGenerativeModel()
