/**
 * Unified Email Client - Supports Both Gmail and Outlook
 * Automatically selects the best provider based on configuration
 */

export { fetchEmails as fetchGmailEmails } from './email-client.ts';
export { fetchOutlookEmails } from './outlook-client.ts';
export { generateEmailResponse } from './ai-client.ts';

import { fetchGmailEmails, generateEmailResponse as generateGmailResponse } from './email-client.ts';
import { fetchOutlookEmails, generateEmailResponse as generateOutlookResponse } from './outlook-client.ts';

// Get email provider from environment or use default
const getEmailProvider = (): 'gmail' | 'outlook' => {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase();
  if (provider === 'outlook') return 'outlook';
  return 'gmail';
};

/**
 * Fetch emails from configured provider
 * Supports both Gmail and Outlook
 */
export const fetchEmails = async (maxResults: number = 50) => {
  const provider = getEmailProvider();

  if (provider === 'gmail') {
    return await fetchGmailEmails(maxResults);
  } else {
    return await fetchOutlookEmails(maxResults);
  }
};

/**
 * Send email from configured provider
 */
export const sendEmail = async (to: string, subject: string, body: string, html: boolean = true) => {
  const provider = getEmailProvider();

  if (provider === 'gmail') {
    return await sendGmailEmail(to, subject, body, html);
  } else {
    return await sendOutlookEmail(to, subject, body, html);
  }
};

/**
 * Mark email as read from configured provider
 */
export const markEmailAsRead = async (messageId: string) => {
  const provider = getEmailProvider();

  if (provider === 'gmail') {
    return await markGmailEmailAsRead(messageId);
  } else {
    return await markOutlookEmailAsRead(messageId);
  }
};

/**
 * Get email content from configured provider
 */
export const getEmailContent = async (messageId: string) => {
  const provider = getEmailProvider();

  if (provider === 'gmail') {
    return await getGmailEmailContent(messageId);
  } else {
    // For Outlook, we'd need to implement fetch by ID
    return `Content from Outlook email: ${messageId}`;
  }
};

/**
 * Gmail-specific functions
 */
export const sendGmailEmail = async (to: string, subject: string, body: string, html: boolean = true) => {
  return await sendEmail(to, subject, body, html);
};

export const markGmailEmailAsRead = async (messageId: string) => {
  return await markEmailAsRead(messageId);
};

export const getGmailEmailContent = async (messageId: string) => {
  return await getEmailContent(messageId);
};

/**
 * Outlook-specific functions
 */
export const sendOutlookEmail = async (to: string, subject: string, body: string, html: boolean = true) => {
  return await sendEmail(to, subject, body, html);
};

export const markOutlookEmailAsRead = async (messageId: string) => {
  return await markEmailAsRead(messageId);
};

/**
 * Generate AI response from email content
 */
export const generateEmailResponse = async (emailContent: string) => {
  const provider = getEmailProvider();

  if (provider === 'gmail') {
    return await generateGmailResponse(emailContent);
  } else {
    return await generateOutlookResponse(emailContent);
  }
};

/**
 * Email provider detection and information
 */
export const getProviderInfo = () => {
  const provider = getEmailProvider();

  return {
    provider,
    displayName: provider === 'gmail' ? 'Gmail' : 'Outlook',
    description: provider === 'gmail'
      ? 'Connect your Gmail account for email automation'
      : 'Connect your Outlook account for email automation',
    requiresAuth: true,
    available: true,
  };
};

// Default provider (Gmail)
getEmailProvider();
