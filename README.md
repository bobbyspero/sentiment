# Brand Sentiment Tracker

A real-time brand sentiment monitoring dashboard that tracks company reputation across news, social media, and job postings using **100% FREE APIs**.

## ✨ Features

- **Real News Articles** - Live news from NewsAPI with sentiment analysis
- **Reddit Sentiment** - Community sentiment from Reddit discussions
- **Job Postings** - Real job listings from RemoteOK
- **Sentiment Trends** - Interactive charts showing sentiment over time
- **Company Comparison** - Compare up to 4 companies side-by-side
- **Data Export** - Download sentiment data as JSON
- **Demo/Live Toggle** - Switch between mock data and real API data

## 🆓 100% Free APIs Used

- **Reddit API** - Free (requires registration)
- **NewsAPI** - 100 requests/day free
- **RemoteOK** - Completely free, no API key needed

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/bobbyspero/sentiment.git
cd sentiment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up API Keys (FREE)

#### Get Reddit API Credentials (FREE):
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in:
   - **Name**: Brand Sentiment Tracker
   - **App type**: Select "script"
   - **Redirect URI**: http://localhost:8080
4. Click "Create app"
5. Copy your `client_id` (under the app name) and `client_secret`

#### Get NewsAPI Key (FREE):
1. Go to https://newsapi.org/register
2. Sign up (free account gives 100 requests/day)
3. Copy your API key

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=BrandSentimentTracker/1.0

NEWS_API_KEY=your_newsapi_key
```

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

## 🌐 Deploy to Netlify (FREE)

### Option 1: Deploy via GitHub

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Build settings (auto-detected):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in Netlify:
   - Go to **Site settings** → **Environment variables**
   - Add the same variables from your `.env` file
7. Click "Deploy site"

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## 📊 How It Works

### Architecture

```
Frontend (React + TypeScript + Vite)
    ↓
Netlify Functions (Serverless)
    ↓
Free APIs:
├── Reddit API → Community Sentiment
├── NewsAPI → Real News + Sentiment
└── RemoteOK → Job Postings
```

### Data Flow

1. **User selects company** → Frontend sends request
2. **Netlify Function** → Fetches data from free APIs
3. **Sentiment Analysis** → Uses `sentiment` library to analyze text
4. **Response** → Returns structured data to frontend
5. **Display** → React renders charts and cards

## 🔧 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Netlify Functions (Serverless)
- **APIs**: Reddit, NewsAPI, RemoteOK
- **Sentiment Analysis**: sentiment.js

## 📁 Project Structure

```
sentiment/
├── src/
│   ├── BrandSentimentTracker.tsx  # Main component
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── netlify/
│   └── functions/
│       ├── reddit-sentiment.js    # Reddit API handler
│       ├── news.js                # NewsAPI handler
│       └── jobs.js                # RemoteOK handler
├── package.json
├── netlify.toml
├── vite.config.ts
└── README.md
```

## 🎯 Usage

### Demo Mode
- Click "Demo Data" button in the header
- Uses pre-loaded mock data
- Instant, no API calls

### Live Mode
1. Click "Live Data" button in the header
2. Real data fetched from APIs
3. Loading indicator shows while fetching
4. Falls back to demo data if APIs fail

### Features

- **Select Company**: Choose from dropdown or add custom companies
- **Compare Mode**: Toggle to compare up to 4 companies
- **Time Ranges**: 1W, 1M, 3M, 6M, 1Y
- **Job Filters**: All, SWE, ENG, Design, Product
- **Export Data**: Download sentiment data as JSON

## 🔒 Security

- API keys stored in environment variables
- Never exposed to frontend
- Netlify Functions run server-side
- CORS configured for security

## 💰 Cost Breakdown

| Service | Free Tier | Used For |
|---------|-----------|----------|
| Reddit API | Unlimited | Community sentiment |
| NewsAPI | 100 req/day | Real news articles |
| RemoteOK | Unlimited | Job postings |
| Netlify | 100GB bandwidth | Hosting + Functions |
| **Total** | **$0/month** | Everything! |

## 🐛 Troubleshooting

### APIs not working?

1. Check environment variables are set in Netlify
2. Verify API keys are correct
3. Check Netlify Functions logs
4. Reddit API: Make sure app type is "script"
5. NewsAPI: Check you haven't exceeded 100 requests/day

### Build failing?

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 License

MIT

## 🙏 Credits

- Reddit API
- NewsAPI
- RemoteOK
- Sentiment.js
- Netlify

---

**Made with ❤️ using 100% free APIs**
