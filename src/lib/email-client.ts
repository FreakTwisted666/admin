export const fetchEmails = async () => {
  // Mock data for initial MVP
  return [
    { id: 1, subject: 'Urgent: Contract', sender: 'Sarah Johnson', priority: 'High' },
    { id: 2, subject: 'Meeting', sender: 'Michael Chen', priority: 'Medium' },
  ];
};

export const sendEmail = async (to: string, body: string) => {
  console.log(`Sending email to ${to}...`);
  return { success: true };
};
