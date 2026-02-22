# Outlook SMTP Configuration Guide

## Overview

AdminFlow AI uses **Outlook SMTP** to send emails. You have two options for authentication:

### Option 1: Account Password (Easiest)
- Use your regular Outlook password
- **Limitations:** Less secure, blocked by some services
- **Best for:** Personal use, testing

### Option 2: App Password (Recommended)
- Create a 16-character app password
- **Benefits:** More secure, works with Gmail, Microsoft 365
- **Best for:** Production use, business accounts

---

## How to Get Outlook SMTP Credentials

### Step 1: Enable Two-Factor Authentication (Required for App Password)

1. Go to [Microsoft Account Security Page](https://account.microsoft.com/security)
2. Enable **Two-Step Verification** (if not already enabled)
3. You'll need to verify your phone or email

### Step 2: Create App Password

1. Go to [Account Security - Advanced Security Options](https://account.microsoft.com/security?tab=security)
2. Click **How you sign in to Microsoft** → **App passwords**
3. Click **Create a new app password**
4. Give it a name (e.g., "AdminFlow AI")
5. Copy the **16-character app password**
6. Store it securely (you'll need it in .env)

### Step 3: Or Use Account Password (Simpler but Less Secure)

1. Use your **Outlook account password** directly
2. Some providers (like Gmail) may block this
3. Less secure for production use

---

## Configuration in AdminFlow AI

### Option A: Using Outlook SMTP with App Password (Recommended)

Add to your `.env` file:

```bash
# Outlook Configuration
EMAIL_PROVIDER=outlook
OUTLOOK_SMTP_USER=your_email@outlook.com
OUTLOOK_APP_PASSWORD=your_16_char_app_password
```

### Option B: Using Outlook SMTP with Regular Password

Add to your `.env` file:

```bash
# Outlook Configuration
EMAIL_PROVIDER=outlook
OUTLOOK_SMTP_USER=your_email@outlook.com
OUTLOOK_SMTP_PASSWORD=your_regular_password
```

### Option C: Using Gmail SMTP (Alternative)

Add to your `.env` file:

```bash
# Gmail Configuration
EMAIL_PROVIDER=gmail
GOOGLE_SMTP_USER=your_email@gmail.com
GOOGLE_APP_PASSWORD=your_16_char_app_password
```

---

## Testing Your SMTP Configuration

Run this command to test the connection:

```bash
cd adminflow-ai
node -e "
const { testSmtpConnection, sendEmailViaSmtp } = await import('./src/lib/smtp-client.ts');
const status = await testSmtpConnection();
console.log('SMTP Status:', status);
"
```

---

## Troubleshooting

### Error: "SMTP credentials not configured"
- ✅ Make sure you've added the credentials to `.env` file
- ✅ Restart the development server after adding credentials
- ✅ Check that `EMAIL_PROVIDER` is set to `outlook` or `gmail`

### Error: "SMTP connection failed"
- ✅ Verify your email credentials are correct
- ✅ Make sure Two-Factor Authentication is enabled (for app passwords)
- ✅ Check that you're using the correct password type (regular vs app password)
- ✅ Try the other option (app password vs regular password)

### Error: "Access Denied" or "Invalid Login"
- ✅ Verify your email address is correct
- ✅ Check that you're using the app password, not your regular password
- ✅ If using Gmail, make sure you're using an app password (not your login password)
- ✅ Some providers (like Gmail) block third-party apps by default

---

## Recommended Setup

### For Personal Use
```
EMAIL_PROVIDER=outlook
OUTLOOK_SMTP_USER=your_email@outlook.com
OUTLOOK_SMTP_PASSWORD=your_regular_password
```

### For Business/Production
```
EMAIL_PROVIDER=outlook
OUTLOOK_SMTP_USER=your_email@outlook.com
OUTLOOK_APP_PASSWORD=your_16_char_app_password
```

### Using Gmail Instead
```
EMAIL_PROVIDER=gmail
GOOGLE_SMTP_USER=your_email@gmail.com
GOOGLE_APP_PASSWORD=your_16_char_app_password
```

---

## Security Best Practices

1. ✅ **Never commit credentials** to Git
2. ✅ **Use app passwords** instead of regular passwords (for production)
3. ✅ **Use environment variables** (not hardcoded)
4. ✅ **Rotate passwords** periodically
5. ✅ **Test connections** before going live
6. ✅ **Monitor email activity** for suspicious behavior

---

## What to Provide Me

When you're ready to configure Outlook SMTP, provide:

1. ✅ Your **Outlook email address**
2. ✅ Your **password type** (regular password or app password)
3. ✅ If using app password, I'll guide you to create one

Then I'll update the `.env` file with your credentials!

---

## Quick Reference

| Provider | SMTP Host | Port | Auth Method | Recommended |
|----------|-----------|------|-------------|-------------|
| **Outlook** | smtp-mail.outlook.com | 587 | TLS | App Password |
| **Gmail** | smtp.gmail.com | 587 | TLS | App Password |
| **Exchange** | smtp.office365.com | 587 | TLS | App Password |

---

**Need help?** Just provide your email address and I'll guide you through the setup!
