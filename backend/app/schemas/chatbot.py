"""
Chatbot schemas for NikoiDev assistant
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ChatMessage(BaseModel):
    """Single chat message"""
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    """Request to chatbot"""
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    conversation_history: Optional[List[ChatMessage]] = Field(
        default=[], 
        description="Previous messages for context"
    )
    session_id: Optional[str] = Field(None, description="Session identifier")


class ChatResponse(BaseModel):
    """Response from chatbot"""
    message: str = Field(..., description="Assistant response")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    tokens_used: Optional[int] = None
    session_id: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "¡Hola! Soy NikoiDev, el asistente de Nicolás. ¿En qué puedo ayudarte?",
                "timestamp": "2024-01-01T12:00:00",
                "tokens_used": 150,
                "session_id": "abc123"
            }
        }

