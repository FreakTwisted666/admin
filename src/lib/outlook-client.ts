/**
 * Outlook Client - Microsoft Graph API Integration
 */

const OUTLOOK_API_URL = 'https://graph.microsoft.com/v1.0';

export interface OutlookEmail {
  id: string;
  subject: string;
  sender: string;
  from: string;
  to: string;
  body: string;
  preview: string;
  receivedDateTime: string;
  hasAttachments: boolean;
  isRead: boolean;
  category?: string;
}

export interface OutlookEmailResponse {
  emails: OutlookEmail[];
  total: number;
  unreadCount: number;
}

/**
 * Get Microsoft Graph API access token
 */
const getAccessToken = (): string | null => {
  // For MVP, use environment variable
  // In production, implement OAuth token refresh
  return process.env.OUTLOOK_ACCESS_TOKEN || process.env.OUTLOOK_CLIENT_SECRET || null;
};

/**
 * Fetch emails from Outlook
 */
export const fetchOutlookEmails = async (maxResults: number = 50): Promise<OutlookEmailResponse> => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      console.warn('OUTLOOK_ACCESS_TOKEN not configured. Using mock data for demo.');
      return getMockOutlookEmails();
    }

    // Get inbox messages
    const response = await fetch(
      `${OUTLOOK_API_URL}/me/mailFolders/inbox/messages?` +
      `$top=${maxResults}&` +
      `$select=id,subject,from,receivedDateTime,hasAttachments,isRead,preview,body&` +
      `$orderby=receivedDateTime desc`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Outlook API token expired or invalid');
        return getMockOutlookEmails(); // Fall back to mock data
      }
      throw new Error(`Outlook API request failed: ${response.status}`);
    }

    const data = await response.json();
    const emails = (data.value || []).map((email: any) => ({
      id: email.id,
      subject: email.subject,
      sender: email.from?.emailAddress?.name || email.from?.name || 'Unknown',
      from: email.from?.emailAddress?.address || email.from?.address || 'unknown@example.com',
      to: email.toRecipients?.map((r: any) => r.emailAddress?.address).join(', ') || '',
      body: email.body?.content || email.body?.preview || '',
      preview: email.preview || '',
      receivedDateTime: email.receivedDateTime,
      hasAttachments: email.hasAttachments || false,
      isRead: email.isRead || false,
    }));

    return {
      emails,
      total: emails.length,
      unreadCount: emails.filter((email) => !email.isRead).length,
    };
  } catch (error) {
    console.error('Error fetching Outlook emails:', error);
    return getMockOutlookEmails();
  }
};

/**
 * Send an email via Outlook
 */
export const sendOutlookEmail = async (
  to: string,
  subject: string,
  body: string,
  html: boolean = true
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return { success: false, error: 'Outlook API token not configured' };
    }

    const response = await fetch(`${OUTLOOK_API_URL}/me/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        body: {
          contentType: html ? 'HTML' : 'Text',
          content: body,
        },
        toRecipients: [
          {
            emailAddress: {
              address: to,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Failed to send email' };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending email via Outlook:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

/**
 * Mark email as read
 */
export const markOutlookEmailAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) return false;

    await fetch(`${OUTLOOK_API_URL}/me/messages/${messageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isRead: true,
      }),
    });

    return true;
  } catch (error) {
    console.error('Error marking email as read:', error);
    return false;
  }
};

/**
 * Generate AI response to an Outlook email
 */
export const generateOutlookResponse = async (emailContent: string): Promise<string> => {
  const prompt = `Analyze this email and write a professional, helpful response:

Email Content:
${emailContent}

Provide a clear, professional response. If you need more information, ask specific questions.`;

  return generateAIResponse(prompt, "You are a professional administrative assistant responding to business emails. Write concise, professional responses.");
};

/**
 * Get mock Outlook emails for demo purposes
 */
const getMockOutlookEmails = (): OutlookEmailResponse => {
  return {
    emails: [
      {
        id: 'outlook-1',
        subject: 'Urgent: Contract - Please review and sign ASAP',
        sender: 'Sarah Johnson',
        from: 'sarah.johnson@client.com',
        to: 'me@company.com',
        body: 'We need to finalize the contract by end of week. Please review and let me know if you have any questions.',
        preview: 'We need to finalize the contract by end of week. Please review and let me know if you have any questions.',
        receivedDateTime: new Date().toISOString(),
        hasAttachments: true,
        isRead: false,
        category: 'Urgent',
      },
      {
        id: 'outlook-2',
        subject: 'Meeting Request for Next Week',
        sender: 'Michael Chen',
        from: 'michael.chen@partner.com',
        to: 'me@company.com',
        body: 'Hi, would like to schedule a meeting to discuss the project timeline. Can we meet on Thursday at 2pm?',
        preview: 'Hi, would like to schedule a meeting to discuss the project timeline. Can we meet on Thursday at 2pm?',
        receivedDateTime: new Date(Date.now() - 86400000).toISOString(),
        hasAttachments: false,
        isRead: false,
        category: 'Meeting',
      },
      {
        id: 'outlook-3',
        subject: 'Invoice #1234 - Payment Due',
        sender: 'Office Supplies Inc.',
        from: 'billing@officesupplies.com',
        to: 'me@company.com',
        body: 'Thank you for your business! Invoice #1234 for $500.00 is due within 5 days.',
        preview: 'Thank you for your business! Invoice #1234 for $500.00 is due within 5 days.',
        receivedDateTime: new Date(Date.now() - 172800000).toISOString(),
        hasAttachments: true,
        isRead: true,
        category: 'Finance',
      },
      {
        id: 'outlook-4',
        subject: 'Project Update - Week 3',
        sender: 'Jennifer Williams',
        from: 'jennifer.w@company.com',
        to: 'me@company.com',
        body: 'Attached is the weekly project update. Key achievements: completed API integration, deployed to staging, fixed 3 critical bugs.',
        preview: 'Attached is the weekly project update. Key achievements: completed API integration, deployed to staging, fixed 3 critical bugs.',
        receivedDateTime: new Date(Date.now() - 259200000).toISOString(),
        hasAttachments: true,
        isRead: true,
        category: 'Work',
      },
      {
        id: 'outlook-5',
        subject: 'Question About Project Timeline',
        sender: 'Alex Thompson',
        from: 'alex.thompson@client.com',
        to: 'me@company.com',
        body: 'Hi, quick question - can we move the deadline to next month? There might be some delays on our end.',
        preview: 'Hi, quick question - can we move the deadline to next month? There might be some delays on our end.',
        receivedDateTime: new Date(Date.now() - 345600000).toISOString(),
        hasAttachments: false,
        isRead: true,
        category: 'Question',
      },
    ],
    total: 5,
    unreadCount: 2,
  };
};

/**
 * Categorize Outlook email by priority
 */
export const categorizeOutlookPriority = async (emailContent: string): Promise<string> => {
  const prompt = `Analyze this email and determine its priority:

${emailContent}

Respond with one word only: HIGH, MEDIUM, or LOW.`;

  return generateAIResponse(prompt, "You are an email priority categorizer. Respond with only 'HIGH', 'MEDIUM', or 'LOW'.");
};

/**
 * Extract email metadata from content
 */
export const extractEmailMetadata = async (emailContent: string): Promise<{
  sender: string;
  subject: string;
  urgency: string;
  nextSteps: string[];
}> => {
  const prompt = `Extract the following information from this email:

Email Content:
${emailContent}

Provide in JSON format:
{
  "sender": "Name or company",
  "subject": "Email subject",
  "urgency": "HIGH/MEDIUM/LOW",
  "nextSteps": ["step1", "step2", ...]
}

Respond with only the JSON object.`;

  const response = await generateAIResponse(prompt, "You are an email metadata extractor. Respond with only valid JSON.");
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse metadata:', error);
    return {
      sender: 'Unknown',
      subject: 'N/A',
      urgency: 'MEDIUM',
      nextSteps: [],
    };
  }
};
