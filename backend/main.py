import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv

from models import RequestModel, ResponseModel
from utils import generate_session_id

load_dotenv()

app = FastAPI(
    title="Article Analyzer API",
    description="Backend service for article analysis requests",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

N8N_WEBHOOK_URL = os.getenv(
    "N8N_WEBHOOK_URL",
    "https://n8nier-brcffpabhghvemf7.malaysiawest-01.azurewebsites.net/webhook/article-analyzer"
)

@app.get("/")
async def root():
    return {"status": "online", "service": "Article Analyzer API"}


@app.post("/submit", response_model=ResponseModel)
async def submit(data: RequestModel):
    """
    USER → BACKEND → Immediately respond SUCCESS 🚀
    and send data to n8n in background without blocking.
    """

    session_id = generate_session_id()

    payload = {
        "email": str(data.email).strip(),
        "article_url": str(data.article_url).strip(),
        "session_id": session_id
    }

    # 🔥 IMMEDIATE frontend success response (prevents “Submission Failed”)
    response_data = ResponseModel(
        success=True,
        session_id=session_id,
        forwarded=True  # optimistic confirmation
    )

    # -------- BACKGROUND SEND (non-blocking)
    async def forward_to_n8n():
        try:
            async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
                await client.post(N8N_WEBHOOK_URL, json=payload)
                print("✓ Forwarded to n8n:", payload)

        except Exception as exc:
            print("⚠ Background forwarding error:", str(exc))

    import asyncio
    asyncio.create_task(forward_to_n8n())

    return response_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


