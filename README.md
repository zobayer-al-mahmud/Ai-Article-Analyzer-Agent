# 📰 AI Article Analyzer

An automated article analysis system that extracts insights from web articles and delivers them to your email. Users submit an article URL through a beautiful web interface, and AI processes it in the background to generate summaries, key insights, and actionable information.

## 🚀 Live Demo

- **Frontend**: [https://ai-article-analyzer-agent-frontend.onrender.com](https://ai-article-analyzer-agent-frontend.onrender.com)
- **Backend API**: [https://ai-article-analyzer-agent-backend.onrender.com](https://ai-article-analyzer-agent-backend.onrender.com)

## 📖 How It Works

1. **User Input**: Enter your email and article URL on the website
2. **Backend Processing**: FastAPI backend receives the request and generates a unique session ID
3. **n8n Workflow**: Automatically forwards the data to n8n webhook which:
   - Scrapes the article content using Firecrawl
   - Sends content to AI (Gemini/OpenAI) for analysis
   - Generates summary, key insights, and actionable recommendations
   - Saves results to Google Sheets for tracking
   - Sends formatted analysis via Gmail to your email
4. **Email Delivery**: Receive comprehensive article insights in your inbox within seconds

## ✨ Features

- 🎨 **Modern Dark UI** - Futuristic gradient design with smooth animations
- ✅ **Form Validation** - Real-time email and URL validation
- 🔐 **Session Tracking** - Unique session ID for each submission
- ⚡ **Fast Processing** - Immediate response with background processing
- 📧 **Email Delivery** - Results sent directly to your inbox
- 🐳 **Dockerized** - Easy deployment with Docker and docker-compose
- ☁️ **Cloud Deployed** - Live on Render.com (free tier)

---

## 🔗 n8n Workflow

The automation workflow is built in n8n and includes the following nodes:

1. **Webhook** - Receives POST requests with email, article URL, and session ID
2. **HTTP Request** - Scrapes article content using Firecrawl API
3. **Code (Parser)** - Extracts and cleans the article content
4. **Gemini - Summarize** - AI generates a concise summary (15-20 sentences)
5. **Gemini - Insights** - AI extracts 3-5 key insights with context
6. **Code (Formatter)** - Formats output for email and sheets
7. **Google Sheets** - Logs analysis results with timestamp
8. **Gmail** - Sends beautifully formatted email with results
9. **Respond to Webhook** - Confirms completion

### Import Workflow

You can import this workflow directly into your n8n instance:

<details>
<summary>Click to view n8n workflow JSON</summary>

```json
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "article-analyzer",
        "options": {}
      },
      "id": "d0d4569b-47e3-4820-aa1a-8f13b2968667",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [-688, 112],
      "webhookId": "article-analyzer"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.firecrawl.dev/v1/scrape",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"url\": \"{{ $json.body.article_url }}\"\n}\n",
        "options": {}
      },
      "id": "d7607ba4-5c7b-49c0-8f47-d7cb7a9748dd",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [-496, 112]
    },
    {
      "parameters": {
        "jsCode": "const items = $input.all();\nconst output = [];\n\nfor (const item of items) {\n  const articleContent = item.json.data?.markdown || item.json.markdown || item.json.content || item.json.data?.content || \"No content found\";\n  const webhookData = $('Webhook').first().json;\n  \n  output.push({\n    json: {\n      article_url: webhookData.article_url,\n      email: webhookData.email,\n      session_id: webhookData.session_id,\n      article_content: articleContent,\n      content_length: articleContent.length\n    }\n  });\n}\n\nreturn output;"
      },
      "id": "64bfce52-94a8-445e-bf7f-dc8666ff446f",
      "name": "Code",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-288, 112]
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "models/gemini-2.5-flash",
          "mode": "list"
        },
        "messages": {
          "values": [
            {
              "content": "You are an expert content summarizer. Summarize articles into 15–20 clear, concise sentences.",
              "role": "model"
            },
            {
              "content": "=Summarize the following article:\n\n{{$json[\"article_content\"]}}"
            }
          ]
        },
        "jsonOutput": true,
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.googleGemini",
      "typeVersion": 1,
      "position": [-128, 112],
      "id": "22b14919-6270-4ddc-b479-10327dd3f1e2",
      "name": "Gemini - Summarize Article"
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "models/gemini-2.5-flash",
          "mode": "list"
        },
        "messages": {
          "values": [
            {
              "content": "You are an expert content analyst. Extract 3–5 key insights from the article. Make each insight 1–2 sentences explaining why it matters.",
              "role": "model"
            },
            {
              "content": "=Extract 3–5 key insights from the following article:\n\n{{ $json.content.parts[0].text }}"
            }
          ]
        },
        "simplify": false,
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.googleGemini",
      "typeVersion": 1,
      "position": [160, 112],
      "id": "ebfb9cb1-4c19-4d68-b137-8db25a67e872",
      "name": "Gemini - Insights"
    },
    {
      "parameters": {
        "jsCode": "function clean(text) {\n  if (!text) return \"\";\n  return String(text).replace(/[*_`#>-]/g, \"\").replace(/\\s+/g, \" \").trim();\n}\n\nconst webhook = $('Webhook').first().json.body || {};\n\nfunction getGemini(nodeName) {\n  const node = $(nodeName).first().json;\n  if (!node) return \"\";\n  if (node.content?.parts?.[0]?.text) return clean(node.content.parts[0].text);\n  if (node.candidates?.[0]?.content?.parts?.[0]?.text) return clean(node.candidates[0].content.parts[0].text);\n  return \"\";\n}\n\nlet rawSummary = getGemini(\"Gemini - Summarize Article\");\nlet rawInsights = getGemini(\"Gemini - Insights\");\n\nlet summary = rawSummary.replace(/^{/, \"\").replace(/}$/, \"\").replace(/\"summary\":/i, \"\").replace(/\"/g, \"\").trim();\nlet insights = rawInsights.replace(/^Here are.*?:/i, \"\").replace(/\\s*1\\.\\s*/g, \"\\n• \").replace(/\\s*2\\.\\s*/g, \"\\n• \").replace(/\\s*3\\.\\s*/g, \"\\n• \").replace(/\\s*4\\.\\s*/g, \"\\n• \").trim();\n\nreturn [{\n  json: {\n    session_id: String(webhook.session_id || \"\").trim(),\n    article_url: String(webhook.article_url || \"\").trim(),\n    email: String(webhook.email || \"\").trim(),\n    summary,\n    insights,\n    timestamp: new Date().toISOString(),\n    date: new Date().toLocaleString(\"en-US\", {\n      timeZone: \"Asia/Dhaka\",\n      year: \"numeric\",\n      month: \"long\",\n      day: \"numeric\",\n      hour: \"2-digit\",\n      minute: \"2-digit\"\n    })\n  }\n}];"
      },
      "id": "8d50ba07-b8be-4e96-b3c5-5d4ad31f47d9",
      "name": "Code1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [464, 112]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "1n6nYmQ9UtJxhJJn23pEUAHyF5GzF9FwNMqiZ60K_KhE",
          "mode": "list"
        },
        "sheetName": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1n6nYmQ9UtJxhJJn23pEUAHyF5GzF9FwNMqiZ60K_KhE/edit?gid=0#gid=0",
          "mode": "url"
        },
        "columns": {
          "mappingMode": "autoMapInputData"
        },
        "options": {}
      },
      "id": "a243604e-832b-4bd5-9527-f417115ac9e8",
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.4,
      "position": [656, 112]
    },
    {
      "parameters": {
        "sendTo": "={{ $('Webhook').item.json.body.email }}",
        "subject": "🎉 Your Article Analysis is Ready!",
        "message": "=<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\" />\n  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }\n    .container { max-width: 650px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }\n    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }\n    .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 700; }\n    .content { padding: 30px; }\n    .section { background: #fff; padding: 25px; margin: 20px 0; border-radius: 10px; border-left: 5px solid #667eea; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }\n    .section h2 { margin: 0 0 15px 0; color: #667eea; font-size: 20px; font-weight: 600; }\n    .footer { background: #2d3748; color: #a0aec0; padding: 25px; text-align: center; font-size: 13px; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <h1>🤖 AI Article Analysis Ready!</h1>\n      <p>Your article has been successfully analyzed & summarized.</p>\n    </div>\n    <div class=\"content\">\n      <p><strong>📄 Source:</strong> <a href=\"{{ $json.article_url }}\">{{ $json.article_url }}</a></p>\n      <div class=\"section\">\n        <h2>📝 Executive Summary</h2>\n        <p>{{ $json.summary }}</p>\n      </div>\n      <div class=\"section\">\n        <h2>💡 Key Insights</h2>\n        <p>{{ $json.insights }}</p>\n      </div>\n    </div>\n    <div class=\"footer\">\n      <p>Session ID: <code>{{ $json.session_id }}</code></p>\n      <p>Generated: {{ $json.date }}</p>\n    </div>\n  </div>\n</body>\n</html>",
        "options": {
          "appendAttribution": false
        }
      },
      "id": "913b1be3-204d-49f8-9e59-acef3314fb99",
      "name": "Gmail",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [848, 112]
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.4,
      "position": [1072, 112],
      "id": "60875a92-8632-4393-a60f-969605ebd573",
      "name": "Respond to Webhook"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "HTTP Request", "type": "main", "index": 0 }]]
    },
    "HTTP Request": {
      "main": [[{ "node": "Code", "type": "main", "index": 0 }]]
    },
    "Code": {
      "main": [[{ "node": "Gemini - Summarize Article", "type": "main", "index": 0 }]]
    },
    "Gemini - Summarize Article": {
      "main": [[{ "node": "Gemini - Insights", "type": "main", "index": 0 }]]
    },
    "Gemini - Insights": {
      "main": [[{ "node": "Code1", "type": "main", "index": 0 }]]
    },
    "Code1": {
      "main": [[{ "node": "Google Sheets", "type": "main", "index": 0 }]]
    },
    "Google Sheets": {
      "main": [[{ "node": "Gmail", "type": "main", "index": 0 }]]
    },
    "Gmail": {
      "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]]
    }
  }
}
```

</details>

**Required Credentials:**
- Firecrawl API key (for web scraping)
- Google Gemini API key (for AI analysis)
- Google Sheets OAuth (for logging)
- Gmail OAuth (for email delivery)

---

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Gradient animations and glass morphism design
- Real-time form validation

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation with email/URL validators
- **httpx** - Async HTTP client for webhook forwarding
- **python-dotenv** - Environment variable management

### Automation
- **n8n** - Workflow automation
- **Firecrawl** - Web scraping
- **AI (Gemini/OpenAI)** - Content analysis
- **Google Sheets** - Data storage
- **Gmail** - Email delivery

### Deployment
- **Docker** - Containerization
- **Render.com** - Cloud hosting (Frontend + Backend)

---

## 🚀 Quick Start

### Option 1: Use the Live Website
Just visit [https://ai-article-analyzer-agent-frontend.onrender.com](https://ai-article-analyzer-agent-frontend.onrender.com) and start analyzing articles!

### Option 2: Run Locally with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/zobayer-al-mahmud/Ai-Article-Analyzer-Agent.git
   cd Ai-Article-Analyzer-Agent
   ```

2. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your n8n webhook URL
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

---

## 📋 Project Structure

```
Ai-Article-Analyzer-Agent/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Data validation models
│   ├── utils.py             # Helper functions
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container config
│   └── .env                 # Environment variables (ignored in git)
├── frontend/
│   ├── index.html           # Main page
│   ├── script.js            # Form handling & API calls
│   ├── style.css            # Styling & animations
│   └── requirements.txt     # Placeholder for Render
├── docker-compose.yml       # Multi-container orchestration
├── render.yaml              # Render deployment config
└── README.md
```

---

## 👨‍💻 Developer

**Zobayer Al Mahmud**
- GitHub: [@zobayer-al-mahmud](https://github.com/zobayer-al-mahmud)

---

**Built with ❤️ using FastAPI, modern web technologies, and Docker**


### Endpoint: `POST /submit`

**Request Body:**
```json
{
  "email": "user@example.com",
  "article_url": "https://example.com/article"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "forwarded": true
}
```

**Error Response (400/502/500):**
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Health Check: `GET /`

**Response:**
```json
{
  "status": "online",
  "service": "Article Analyzer API"
}
```

---

## 🐳 Docker Commands

### Build and Run
```bash
# Build and start containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild specific service
docker-compose build backend
```

### Development
```bash
# Restart backend only
docker-compose restart backend

# View backend logs
docker-compose logs -f backend

# Access backend container
docker exec -it article-analyzer-backend bash
```

---

## 🧪 Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
curl -X POST http://localhost:8000/submit \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","article_url":"https://example.com/article"}'
```

Windows PowerShell:
```powershell
curl -X POST http://localhost:8000/submit `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"article_url\":\"https://example.com/article\"}'
```

---

## 🎨 Frontend Features

- **Futuristic Dark Theme** - Glass morphism with gradient animations
- **Animated Gradient Borders** - Input fields with flowing gradients
- **Loading Bar Animation** - Smooth gradient loading with shimmer effect
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Form Validation** - Real-time validation with error messages
- **Success Messages** - Clear confirmation with session ID on one line
- **Error Handling** - User-friendly error messages
- **Floating Icon** - Animated newspaper icon with glow effect

---

## ⚙️ Backend Features

- **FastAPI Framework** - Modern, fast, async Python web framework
- **CORS Enabled** - Configured for all localhost ports
- **Pydantic Validation** - Automatic email and URL validation
- **UUID Session IDs** - Unique tracking for each request
- **Async HTTP Client** - Non-blocking webhook forwarding with httpx
- **Error Handling** - Comprehensive exception handling with detailed logging
- **Environment Variables** - Secure configuration management with .env

---

## 🔒 Security Notes

- Email validation prevents invalid email formats
- URL validation ensures proper URL format
- CORS configured for development (restrict in production)
- Environment variables keep sensitive URLs out of code
- .env file excluded from git via .gitignore
- Docker secrets support for production deployments

---

## 🐛 Troubleshooting

### Docker Issues
- **Port already in use**: Change ports in `docker-compose.yml`
- **Container won't start**: Check logs with `docker-compose logs backend`
- **Changes not reflected**: Rebuild with `docker-compose up --build`

### Backend Issues
- **Import errors**: Ensure all dependencies in `requirements.txt`
- **Import errors**: Ensure all dependencies in `requirements.txt`
- **Webhook fails**: Verify n8n webhook URL in `.env` is correct and accessible

### Frontend Issues
- **Can't connect to backend**: Ensure backend is running on port 8000
- **CORS errors**: Check browser console and backend CORS configuration

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| N8N_WEBHOOK_URL | URL of the n8n webhook endpoint | https://your-n8n.com/webhook/article-analyzer |

---

## 🚀 Production Deployment

### Docker Production Setup

1. **Update docker-compose for production:**
   ```yaml
   services:
     backend:
       restart: always
       environment:
         - N8N_WEBHOOK_URL=${N8N_WEBHOOK_URL}
   ```

2. **Use environment variables:**
   ```bash
   export N8N_WEBHOOK_URL="your-production-webhook"
   docker-compose up -d
   ```

3. **Enable HTTPS:**
   - Use nginx or traefik as reverse proxy
   - Configure SSL certificates
   - Update CORS origins in `main.py`

### Cloud Deployment Options
- **AWS**: ECS with ECR
- **Azure**: Container Instances or App Service
- **Google Cloud**: Cloud Run
- **DigitalOcean**: App Platform
- **Heroku**: Container Registry

---

## � Dependencies

### Backend
- `fastapi==0.115.5` - Web framework
- `uvicorn[standard]==0.32.1` - ASGI server
- `pydantic[email]==2.10.3` - Data validation with email support
- `httpx==0.28.1` - Async HTTP client
- `python-dotenv==1.0.1` - Environment variable management

### Frontend
- Vanilla JavaScript (no dependencies)
- Modern CSS with gradient animations
- Fetch API for HTTP requests

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## ‍💻 Developer

**Zobayer Al Mahmud**
- GitHub: [@zobayer-al-mahmud](https://github.com/zobayer-al-mahmud)

---

## 🙏 Acknowledgments

- FastAPI for the amazing web framework
- n8n for workflow automation
- Docker for containerization

---

**Built with ❤️ using FastAPI, modern web technologies, and Docker**
