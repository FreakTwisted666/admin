/**
 * Email Client - Gmail API Integration
 */

const GOOGLE_API_URL = 'https://www.googleapis.com/gmail/v1/users';

export interface Email {
  id: string;
  threadId?: string;
  historyId?: string;
  labelIds?: string[];
  snippet?: string;
  payload?: any;
  internalDate?: string;
}

export interface EmailResponse {
  emails: Email[];
  total: number;
  unreadCount: number;
}

/**
 * Get Gmail API access token (from environment or OAuth)
 * In production, this should be obtained via OAuth flow
 */
const getAccessToken = (): string | null => {
  // For MVP, use environment variable
  // In production, implement OAuth token refresh
  return process.env.GOOGLE_ACCESS_TOKEN || process.env.GOOGLE_CLIENT_EMAIL || null;
};

/**
 * Fetch emails from Gmail
 */
export const fetchEmails = async (maxResults: number = 50): Promise<EmailResponse> => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      console.warn('GOOGLE_ACCESS_TOKEN not configured. Using mock data for demo.');
      return getMockEmails();
    }

    const response = await fetch(
      `${GOOGLE_API_URL}/me/messages?maxResults=${maxResults}&format=metadata&metadataHeaders=FROM,SUBJECT,DATETIME`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Google API token expired or invalid');
        return getMockEmails(); // Fall back to mock data for demo
      }
      throw new Error(`Gmail API request failed: ${response.status}`);
    }

    const data = await response.json();
    const emails = data.messages || [];

    // Fetch full email details
    const emailDetails = await Promise.all(
      emails.map(async (email: Email) => {
        try {
          const detailResponse = await fetch(
            `${GOOGLE_API_URL}/me/messages/${email.id}?format=full`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );

          if (!detailResponse.ok) {
            console.warn(`Failed to fetch email ${email.id}`);
            return null;
          }

          return await detailResponse.json();
        } catch (error) {
          console.error(`Error fetching email ${email.id}:`, error);
          return null;
        }
      })
    ).then((results) => results.filter(Boolean));

    return {
      emails: emailDetails,
      total: emailDetails.length,
      unreadCount: emailDetails.filter((email) => email.labelIds?.includes('UNREAD')).length,
    };
  } catch (error) {
    console.error('Error fetching emails:', error);
    return getMockEmails();
  }
};

/**
 * Send an email
 */
export const sendEmail = async (
  to: string,
  subject: string,
  body: string,
  html: boolean = true
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return { success: false, error: 'Google API token not configured' };
    }

    const response = await fetch(
      `${GOOGLE_API_URL}/me/messages/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: Buffer.from(
            `From: me\n` +
            `To: ${to}\n` +
            `Subject: ${subject}\n\n` +
            (html ? `<html><body>${body}</body></html>` : body)
          ).toString('base64'),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Failed to send email' };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

/**
 * Generate AI response to an email
 */
export const generateEmailResponse = async (emailContent: string): Promise<string> => {
  const prompt = `Analyze this email and write a professional, helpful response:

Email Content:
${emailContent}

Provide a clear, professional response. If you need more information, ask specific questions.`;

  return generateAIResponse(prompt, "You are a professional administrative assistant responding to business emails. Write concise, professional responses.");
};

/**
 * Mark email as read
 */
export const markEmailAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) return false;

    await fetch(
      `${GOOGLE_API_URL}/me/messages/${messageId}/modify`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          removeLabelIds: ['UNREAD'],
        }),
      }
    );

    return true;
  } catch (error) {
    console.error('Error marking email as read:', error);
    return false;
  }
};

/**
 * Get mock emails for demo purposes
 */
const getMockEmails = (): EmailResponse => {
  return {
    emails: [
      {
        id: '1',
        threadId: '1',
        historyId: '1',
        labelIds: ['INBOX', 'UNREAD'],
        snippet: 'Urgent: Contract - Please review and sign ASAP',
        internalDate: '1732359200000',
      },
      {
        id: '2',
        threadId: '2',
        historyId: '2',
        labelIds: ['INBOX'],
        snippet: 'Meeting request for next week - Need to confirm availability',
        internalDate: '1732272800000',
      },
      {
        id: '3',
        threadId: '3',
        historyId: '3',
        labelIds: ['INBOX', 'STARRED'],
        snippet: 'Invoice #1234 - Payment due in 5 days',
        internalDate: '1732186400000',
      },
      {
        id: '4',
        threadId: '4',
        historyId: '4',
        labelIds: ['INBOX'],
        snippet: 'Question about the project timeline - Can you clarify?',
        internalDate: '1732100000000',
      },
      {
        id: '5',
        threadId: '5',
        historyId: '5',
        labelIds: ['INBOX', 'UNREAD'],
        snippet: 'Important: Client feedback received - Need to address',
        internalDate: '1732013600000',
      },
    ],
    total: 5,
    unreadCount: 2,
  };
};

/**
 * Get email content from full payload
 */
export const getEmailContent = async (messageId: string): Promise<string> => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return `Mock email content for ${messageId}`;
    }

    const response = await fetch(
      `${GOOGLE_API_URL}/me/messages/${messageId}?format=full`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return `Failed to fetch email content: ${response.status}`;
    }

    const message = await response.json();
    const parts = message.payload?.parts || [];

    // Simple extraction - in production, would properly parse MIME parts
    const textParts = parts
      .filter((part: any) => part.mimeType === 'text/plain' && part.body?.data)
      .map((part: any) => {
        const decoded = Buffer.from(part.body.data, 'base64').toString('utf-8');
        return decoded.replace(/\r\n/g, '\n');
      });

    if (textParts.length > 0) {
      return textParts[0];
    }

    return message.snippet || 'No content available';
  } catch (error) {
    console.error('Error getting email content:', error);
    return `Error fetching email content`;
  }
};
