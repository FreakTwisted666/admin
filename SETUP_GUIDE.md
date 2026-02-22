# AdminFlow AI - Complete Project Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Mistral AI account (free at https://mistral.ai/)
- Google Cloud Project with Gmail API enabled
- Vercel account (free at https://vercel.com)

### 1. Clone or Navigate to Project
```bash
cd adminflow-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file in the project root:

```bash
# Mistral AI API Key (Free: https://mistral.ai/)
MISTRAL_API_KEY=your_actual_api_key_here

# Google Gmail API (Free OAuth flow)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_ACCESS_TOKEN=your_google_access_token
```

#### Get Mistral API Key
1. Visit https://mistral.ai/
2. Sign up for free
3. Go to API Keys section
4. Generate your API key
5. Add it to `.env`

#### Get Google Gmail API Credentials
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable Gmail API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure for "Desktop app"
6. Download credentials.json
7. Convert to use in `.env`:
   - CLIENT_ID from credentials
   - CLIENT_SECRET from credentials
   - RUN: `gcloud auth application-default login` and copy refresh token

### 4. Start Development Server
```bash
npm run dev
```

Open http://localhost:4321

### 5. Build for Production
```bash
npm run build
```

### 6. Deploy to Vercel
```bash
npm run vercel
```

Or connect directly to Vercel dashboard.

---

## 📁 Project Structure

```
adminflow-ai/
├── src/
│   ├── components/
│   │   ├── Dashboard.astro        # Main dashboard
│   │   ├── EmailInbox.astro       # Email management
│   │   ├── SmartScheduler.astro   # Calendar booking
│   │   └── DocGenerator.astro     # Document generation
│   ├── lib/
│   │   ├── ai-client.ts           # Mistral AI integration
│   │   ├── email-client.ts        # Gmail API integration
│   │   └── db.ts                  # Database configuration
│   ├── pages/
│   │   ├── dashboard.astro        # Main page
│   │   ├── email.astro            # Email management
│   │   ├── calendar.astro         # Calendar booking
│   │   ├── docs.astro             # Document templates
│   │   ├── settings.astro         # Configuration
│   │   └── index.astro            # Landing page
│   └── styles.css                 # Tailwind CSS
├── templates/                     # Document templates
│   ├── contract.txt
│   ├── invoice.txt
│   ├── proposal.txt
│   ├── email.txt
│   └── meeting-note.txt
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment template
├── astro.config.mjs               # Astro configuration
├── package.json                   # Dependencies
└── vercel.json                    # Vercel deployment config
```

---

## 🔧 Features

### ✅ Phase 1 - Email Automation
- Connect Gmail/Outlook accounts
- AI auto-sorts emails by priority
- One-click AI-generated responses
- Smart follow-up reminders

### ✅ Phase 2 - Smart Scheduling
- Calendar integration
- AI-suggested booking slots
- One-click scheduling pages
- Automatic reminders

### ✅ Phase 3 - Document Generator
- 5 core templates (contracts, invoices, proposals)
- One-click document generation
- Compliance checking
- PDF/Word export

---

## 📊 Dashboard Features

### Email Inbox
- Real-time email fetching
- Priority categorization (High/Medium/Low)
- AI-generated responses
- Quick actions (reply, forward, archive)

### Smart Scheduling
- Calendar view
- Booking availability
- Client scheduling page
- Automated reminders

### Document Templates
- 5 professional templates
- AI-powered generation
- Customizable fields
- Export options

---

## 🌟 Current Status

- ✅ Project structure created
- ✅ Mistral AI integration ready
- ✅ Gmail API integration ready
- ✅ 5 document templates created
- ✅ Environment configuration template
- ⏳ Connect actual API keys
- ⏳ Test email functionality
- ⏳ Deploy to Vercel

---

## 💰 Pricing

### Free Tier (Vercel)
- 100GB bandwidth/month
- Unlimited deployments
- SSL certificates included

### Free Tier (Mistral AI)
- 1,000 requests/day
- Enough for personal/small business use

### Paid Options (when needed)
- Vercel Pro: $20/month
- Mistral Credits: Pay-as-you-go

---

## 🚀 Next Steps

1. ✅ Get Mistral API key
2. ✅ Get Google Gmail credentials
3. ✅ Configure `.env` file
4. ✅ Run `npm run dev`
5. ✅ Test email functionality
6. ✅ Build MVP
7. ✅ Deploy to Vercel
8. ✅ Launch beta to 50 users

---

## 📞 Support

- **Astro docs:** https://docs.astro.build
- **Mistral AI:** https://mistral.ai
- **Gmail API:** https://developers.google.com/gmail/api
- **Vercel:** https://vercel.com/docs

---

## 📄 License

This project is open source and available for personal and commercial use.

---

**Built with Astro + Mistral + Vercel - 100% Free to Start! 🎉**
