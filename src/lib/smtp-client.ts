/**
 * Outlook SMTP Client - Send emails via SMTP
 * Uses Microsoft's SMTP servers for sending emails
 */

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure?: boolean;
}

const SMTP_CONFIG: SmtpConfig = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  user: process.env.OUTLOOK_SMTP_USER || process.env.OUTLOOK_EMAIL || '',
  password: process.env.OUTLOOK_SMTP_PASSWORD || process.env.OUTLOOK_APP_PASSWORD || '',
  secure: false, // TLS on port 587
};

/**
 * Send email via Outlook SMTP
 */
export const sendEmailViaSmtp = async (
  to: string,
  subject: string,
  body: string,
  html: boolean = true
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const config = SMTP_CONFIG;

    if (!config.user || !config.password) {
      return {
        success: false,
        error: 'Outlook SMTP credentials not configured. Add OUTLOOK_SMTP_USER and OUTLOOK_SMTP_PASSWORD to .env',
      };
    }

    // Import nodemailer dynamically
    const nodemailer = await import('nodemailer');

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    // Verify transporter connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: config.user,
      to,
      subject,
      text: html ? body.replace(/<[^>]*>/g, ' ') : body, // Convert HTML to text
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Error sending email via Outlook SMTP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
};

/**
 * Send HTML email via Outlook SMTP
 */
export const sendHtmlEmail = async (
  to: string,
  subject: string,
  htmlBody: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  return sendEmailViaSmtp(to, subject, htmlBody, true);
};

/**
 * Send plain text email via Outlook SMTP
 */
export const sendPlainTextEmail = async (
  to: string,
  subject: string,
  textBody: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  return sendEmailViaSmtp(to, subject, textBody, false);
};

/**
 * Send email from configured provider (Gmail or Outlook)
 */
export const sendEmailFromProvider = async (
  to: string,
  subject: string,
  body: string,
  html: boolean = true
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase();

  if (provider === 'gmail') {
    // Use Gmail SMTP
    const nodemailer = await import('nodemailer');
    const gmailConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_SMTP_USER || process.env.EMAIL_USER || '',
        pass: process.env.GOOGLE_APP_PASSWORD || process.env.EMAIL_PASSWORD || '',
      },
    };

    if (!gmailConfig.auth.user || !gmailConfig.auth.pass) {
      return {
        success: false,
        error: 'Gmail SMTP credentials not configured',
      };
    }

    const transporter = nodemailer.createTransport(gmailConfig);
    await transporter.verify();

    const info = await transporter.sendMail({
      from: gmailConfig.auth.user,
      to,
      subject,
      text: html ? body.replace(/<[^>]*>/g, ' ') : body,
      html,
    });

    return { success: true, messageId: info.messageId };
  } else {
    // Use Outlook SMTP (default)
    return sendEmailViaSmtp(to, subject, body, html);
  }
};

/**
 * Get SMTP configuration status
 */
export const getSmtpStatus = (): { status: 'configured' | 'not-configured' | 'error'; provider: 'gmail' | 'outlook' | 'both' } => {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase() || 'gmail';

  if (provider === 'gmail') {
    const gmailUser = process.env.GOOGLE_SMTP_USER || process.env.EMAIL_USER || '';
    const gmailPass = process.env.GOOGLE_APP_PASSWORD || process.env.EMAIL_PASSWORD || '';
    const status = gmailUser && gmailPass ? 'configured' : 'not-configured';
    return { status, provider: 'gmail' };
  } else {
    const outlookUser = process.env.OUTLOOK_SMTP_USER || process.env.OUTLOOK_EMAIL || '';
    const outlookPass = process.env.OUTLOOK_SMTP_PASSWORD || process.env.OUTLOOK_APP_PASSWORD || '';
    const smtpStatus = outlookUser && outlookPass ? 'configured' : 'not-configured';
    return { status: smtpStatus, provider: 'outlook' };
  }
};

/**
 * Test SMTP connection
 */
export const testSmtpConnection = async (): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> => {
  try {
    const config = SMTP_CONFIG;

    if (!config.user || !config.password) {
      return {
        success: false,
        error: 'SMTP credentials not configured. Add OUTLOOK_SMTP_USER and OUTLOOK_SMTP_PASSWORD to .env',
      };
    }

    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    const verification = await transporter.verify();
    return {
      success: true,
      details: {
        host: config.host,
        port: config.port,
        verified: verification === true,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SMTP connection failed',
    };
  }
};
