export const anthropic = {
  messages: {
    create: async () => ({
      content: [{ type: 'text', text: 'Anthropic istemcisi yapılandırılmadı.' }],
    }),
  },
}
