"""
Chatbot endpoints for NikoiDev assistant
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Optional
from datetime import datetime, timedelta
from collections import defaultdict

from app.core.database import get_db
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services.chatbot_service import chatbot_service
from app.core.config import settings


router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


# Simple in-memory rate limiter
# For production, consider using Redis
class RateLimiter:
    def __init__(self):
        self.requests: Dict[str, list] = defaultdict(list)
    
    def is_allowed(self, identifier: str) -> tuple[bool, Optional[str]]:
        """Check if request is allowed based on rate limit"""
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=settings.CHATBOT_RATE_WINDOW)
        
        # Clean old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > window_start
        ]
        
        # Check limit
        if len(self.requests[identifier]) >= settings.CHATBOT_RATE_LIMIT:
            wait_time = int((self.requests[identifier][0] - window_start).total_seconds())
            return False, f"Rate limit exceeded. Try again in {wait_time} seconds."
        
        # Add current request
        self.requests[identifier].append(now)
        return True, None


rate_limiter = RateLimiter()


def get_client_ip(request: Request) -> str:
    """Get client IP address"""
    # Check for forwarded IP (behind proxy)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to direct connection IP
    if request.client:
        return request.client.host
    
    return "unknown"


@router.post("/chat", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Send a message to NikoiDev chatbot
    
    - **message**: The user's message (1-1000 characters)
    - **conversation_history**: Optional previous messages for context
    - **session_id**: Optional session identifier
    
    Returns the assistant's response with metadata.
    
    Rate limited to {CHATBOT_RATE_LIMIT} messages per {CHATBOT_RATE_WINDOW} seconds per IP.
    """
    
    # Rate limiting
    client_ip = get_client_ip(request)
    allowed, error_msg = rate_limiter.is_allowed(client_ip)
    
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=error_msg
        )
    
    # Validate message
    is_valid, validation_error = chatbot_service.validate_message(chat_request.message)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=validation_error
        )
    
    try:
        # Process chat
        response = await chatbot_service.chat(chat_request, db)
        return response
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing your message. Please try again later."
        )


@router.get("/info")
async def get_chatbot_info():
    """
    Get information about the chatbot
    """
    return {
        "name": settings.CHATBOT_NAME,
        "version": "1.0.0",
        "model": "gemini-2.0-flash-exp",
        "rate_limit": {
            "max_requests": settings.CHATBOT_RATE_LIMIT,
            "window_seconds": settings.CHATBOT_RATE_WINDOW
        },
        "capabilities": [
            "Answer questions about Nicolás Urbaez",
            "Provide project information",
            "Share contact details",
            "Discuss technical skills and experience"
        ],
        "languages": ["español", "english"]
    }


@router.get("/health")
async def chatbot_health():
    """Health check for chatbot service"""
    try:
        # Simple check if API key is configured
        if not settings.GOOGLE_API_KEY:
            return {
                "status": "unhealthy",
                "message": "Google API key not configured"
            }
        
        return {
            "status": "healthy",
            "chatbot_name": settings.CHATBOT_NAME,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "message": str(e)
        }

