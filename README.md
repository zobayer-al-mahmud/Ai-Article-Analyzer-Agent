# 📰 Article Analyzer Web App

A modern, containerized web application that allows users to submit articles for AI-powered analysis. The app forwards requests to an n8n webhook for processing, which generates summaries, insights, and sends results via email.

---

## 🎯 Features

- ✅ **Futuristic Dark UI** - Gradient animations with glass morphism design
- ✅ **Input Validation** - Email and URL validation on both frontend and backend
- ✅ **Session Tracking** - Unique session ID generation for each request
- ✅ **Animated Loading** - Beautiful gradient loading bar with shimmer effects
- ✅ **n8n Integration** - Automatic forwarding to n8n webhook for AI processing
- ✅ **Error Handling** - Comprehensive error handling and user feedback
- ✅ **Docker Support** - Fully containerized for easy deployment

---

## 📁 Project Structure

```
article-analyzer/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models for validation
│   ├── utils.py             # Utility functions
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables (not in git)
│   ├── .env.example         # Environment template
│   ├── Dockerfile           # Docker configuration
│   └── .dockerignore        # Docker ignore rules
├── frontend/
│   ├── index.html           # Main HTML with dark theme
│   ├── script.js            # JavaScript for form handling
│   └── style.css            # Modern CSS with animations
├── docker-compose.yml       # Multi-container setup
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

---

## 🌐 Deploy to Render

**Quick Deploy to Render.com (Free):**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Detailed deployment instructions: **[📖 DEPLOY.md](DEPLOY.md)**

### Quick Steps:
1. Fork this repository
2. Sign up on [Render](https://render.com)
3. Create new Blueprint and connect your repo
4. Set `N8N_WEBHOOK_URL` environment variable
5. Deploy! �

Backend will be available at: `https://your-app.onrender.com`

---

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

### Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd article-analyzer
   ```

2. **Configure environment variables:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` and set your n8n webhook URL:
   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/article-analyzer
   ```

3. **Start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

5. **Stop the application:**
   ```bash
   docker-compose down
   ```

---

## 🔧 Manual Setup (Without Docker)

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A modern web browser

### Backend Setup

1. **Navigate to the backend directory:**
   ```powershell
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   - The `.env` file is already created with the n8n webhook URL
   - You can modify it if needed:
   ```
   N8N_WEBHOOK_URL=https://n8nier-brcffpabhghvemf7.malaysiawest-01.azurewebsites.net/webhook/article-analyzer
   ```

5. **Start the FastAPI server:**
   ```powershell
   python main.py
   ```
   
   Or using uvicorn directly:
   ```powershell
   uvicorn main:app --reload
   ```

   The backend will start at `http://localhost:8000`

### Frontend Setup

1. **Open the frontend:**
   - Simply open `frontend/index.html` in your web browser
   - Or use a local server (recommended):
   
   **Using Python's built-in server:**
   ```powershell
   cd frontend
   python -m http.server 3000
   ```
   
   **Using VS Code Live Server:**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

2. **Access the application:**
   - Navigate to `http://localhost:3000` (or the port shown by your server)

---

## 🎮 How to Use

1. **Start the backend server** (see Backend Setup)
2. **Open the frontend** in your browser
3. **Enter your details:**
   - Email address (must be valid format)
   - Article URL (must start with http:// or https://)
4. **Click "Analyze Article"**
5. **Wait for confirmation** - You'll see a success message with your session ID
6. **Check your email** - The analysis will arrive in a few seconds

---

## 🔧 API Documentation

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

## 📦 Dependencies

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

## 👨‍💻 Developer

**Zobayer Al Mahmud**
- GitHub: [@zobayer-al-mahmud](https://github.com/zobayer-al-mahmud)

---

## 🙏 Acknowledgments

- FastAPI for the amazing web framework
- n8n for workflow automation
- Docker for containerization

---

**Built with ❤️ using FastAPI, modern web technologies, and Docker**
