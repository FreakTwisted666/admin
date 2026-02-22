// Mock database client for MVP
export const db = {
  getStats: async () => ({ unread: 47, highPriority: 12, followUps: 5 }),
  getRecentDocs: async () => [
    { name: 'Contract_Acme.pdf', date: '2026-02-22' },
    { name: 'Invoice_1001.pdf', date: '2026-02-21' }
  ],
};
