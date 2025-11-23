# 🚀 Render Deployment Guide

This guide walks you through deploying the Article Analyzer to Render.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **n8n Webhook URL** - Your n8n webhook endpoint

---

## 🎯 Deployment Methods

### Method 1: Using render.yaml (Recommended - Blueprint)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy from Render Dashboard:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Set environment variable:
     - `N8N_WEBHOOK_URL`: Your n8n webhook URL
   - Click **"Apply"**

3. **Access your app:**
   - Backend: `https://article-analyzer-backend.onrender.com`
   - Frontend: `https://article-analyzer-frontend.onrender.com`

---

### Method 2: Manual Deployment

#### Deploy Backend

1. **Create Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect GitHub repository
   - Configure:
     - **Name**: `article-analyzer-backend`
     - **Region**: Singapore (or closest to you)
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: Docker
     - **Dockerfile Path**: `./Dockerfile`
     - **Plan**: Free
   
2. **Add Environment Variables:**
   - Go to **Environment** tab
   - Add:
     - `N8N_WEBHOOK_URL`: Your webhook URL
     - `PORT`: 8000 (auto-set by Render)

3. **Deploy:**
   - Click **"Create Web Service"**
   - Wait for deployment (2-5 minutes)

#### Deploy Frontend

1. **Create Static Site:**
   - Click **"New +"** → **"Static Site"**
   - Connect same GitHub repository
   - Configure:
     - **Name**: `article-analyzer-frontend`
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Build Command**: `echo "No build needed"`
     - **Publish Directory**: `frontend`
   
2. **Update Frontend API URL:**
   - Edit `frontend/script.js`
   - Change:
     ```javascript
     const API_URL = 'https://article-analyzer-backend.onrender.com';
     ```

3. **Deploy:**
   - Click **"Create Static Site"**
   - Push changes to trigger redeploy

---

## ⚙️ Configuration

### Environment Variables (Backend)

| Variable | Description | Required |
|----------|-------------|----------|
| N8N_WEBHOOK_URL | Your n8n webhook endpoint | Yes |
| PORT | Server port (auto-set by Render) | No |

### Update Frontend API URL

In `frontend/script.js`, update:
```javascript
const API_URL = 'https://your-backend-url.onrender.com';
```

---

## 🔄 Auto-Deploy Setup

Render automatically deploys when you push to GitHub:

1. **Enable Auto-Deploy:**
   - In Render service settings
   - Go to **"Settings"** → **"Build & Deploy"**
   - Enable **"Auto-Deploy"**

2. **Push changes:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

---

## 🎛️ Render Dashboard Features

### Health Checks
- Backend health: `https://your-backend.onrender.com/`
- Returns: `{"status": "online", "service": "Article Analyzer API"}`

### Logs
- View real-time logs in Render Dashboard
- Click on service → **"Logs"** tab

### Metrics
- Monitor CPU, Memory, Bandwidth
- Available in **"Metrics"** tab

---

## 🆓 Free Tier Limitations

- **Backend (Web Service):**
  - Spins down after 15 minutes of inactivity
  - First request may take 30-60 seconds (cold start)
  - 750 hours/month free

- **Frontend (Static Site):**
  - 100GB bandwidth/month
  - Always active, no cold starts

### Keeping Service Warm
Add a cron job to ping your backend every 14 minutes:
```bash
# Use services like cron-job.org or UptimeRobot
curl https://your-backend.onrender.com/
```

---

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` to GitHub
   - Set sensitive data in Render Dashboard

2. **CORS Configuration:**
   - Update `main.py` CORS origins:
     ```python
     allow_origins=[
         "https://article-analyzer-frontend.onrender.com",
         "http://localhost:3000"  # for local development
     ]
     ```

3. **HTTPS:**
   - Render provides free SSL certificates
   - Always use HTTPS URLs

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Render Dashboard
- Verify `requirements.txt` includes all dependencies
- Ensure Dockerfile is in `backend/` directory

### Frontend can't connect to backend
- Update `API_URL` in `script.js`
- Check CORS settings in `main.py`
- Verify backend is running (check health endpoint)

### Cold start delays
- First request may take 30-60s on free tier
- Consider upgrading to paid plan for instant response
- Use UptimeRobot to keep service warm

### Deployment fails
- Check build logs in Render Dashboard
- Verify all files are committed to GitHub
- Ensure `render.yaml` syntax is correct

---

## 📊 Monitoring

### Health Check
```bash
curl https://your-backend.onrender.com/
```

### Test Endpoint
```bash
curl -X POST https://your-backend.onrender.com/submit \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","article_url":"https://example.com"}'
```

---

## 💰 Upgrading to Paid Plan

Benefits:
- No cold starts (instant response)
- More resources (CPU/RAM)
- Custom domains
- Priority support

Plans start at $7/month for web services.

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Deploy Docker Apps](https://render.com/docs/docker)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Render Free Tier](https://render.com/docs/free)

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] Frontend API_URL updated
- [ ] CORS configured correctly
- [ ] Health check endpoint working
- [ ] Test article submission
- [ ] Set up monitoring/uptime checks

---

**🎉 Your Article Analyzer is now live on Render!**
