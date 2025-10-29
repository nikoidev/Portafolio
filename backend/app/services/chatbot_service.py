"""
Chatbot service using LangChain and Google Generative AI (Gemini)
"""
from typing import List, Optional, Dict
from datetime import datetime
import uuid
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.core.config import settings
from app.schemas.chatbot import ChatMessage, ChatRequest, ChatResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.project import Project
from app.models.user import User


class ChatbotService:
    """Service for NikoiDev chatbot"""
    
    def __init__(self):
        """Initialize the chatbot with Gemini"""
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is required for chatbot")
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7,
            max_output_tokens=500,
        )
        
        self.system_prompt = self._build_system_prompt()
    
    def _build_system_prompt(self) -> str:
        """Build the system prompt with context about Nicolás"""
        return f"""Eres {settings.CHATBOT_NAME}, el asistente virtual inteligente de Nicolás Urbaez (también conocido como nikoidev).

INFORMACIÓN SOBRE NICOLÁS:
- Nombre completo: Nicolás A. Urbaez A.
- Email: aran.nick15@gmail.com
- GitHub: @nikoidev
- Rol: Full Stack Developer & Software Engineer
- Stack principal: Python (FastAPI), TypeScript (Next.js), PostgreSQL, Docker
- Especialidades: Desarrollo web full-stack, APIs REST, sistemas CMS, autenticación JWT, CI/CD

PERSONALIDAD:
- Profesional pero amigable
- Entusiasta de la tecnología
- Claro y conciso en las respuestas
- Proactivo en ofrecer ayuda
- Usa emojis ocasionalmente (no en exceso)

TU OBJETIVO:
1. Ayudar a los visitantes a conocer más sobre Nicolás
2. Responder preguntas sobre sus proyectos, habilidades y experiencia
3. Proporcionar información de contacto cuando se solicite
4. Ser útil y representar profesionalmente a Nicolás

REGLAS:
- Responde en el mismo idioma que el usuario (español o inglés)
- Mantén respuestas concisas (máximo 3-4 párrafos)
- Si no sabes algo, sé honesto y sugiere contactar directamente
- NO inventes información sobre Nicolás
- Enfócate en sus habilidades técnicas y proyectos cuando sea relevante

INFORMACIÓN DE CONTACTO:
- Para proyectos o colaboraciones: aran.nick15@gmail.com
- GitHub: https://github.com/nikoidev
- El formulario de contacto está disponible en la página de contacto del portafolio"""
    
    async def get_portfolio_context(self, db: AsyncSession) -> str:
        """Get context about projects and info from database"""
        context_parts = []
        
        # Get featured projects
        result = await db.execute(
            select(Project)
            .where(Project.is_featured == True)
            .limit(5)
        )
        projects = result.scalars().all()
        
        if projects:
            context_parts.append("\nPROYECTOS DESTACADOS:")
            for project in projects:
                tech_list = ", ".join([t.name for t in project.technologies]) if project.technologies else "N/A"
                context_parts.append(
                    f"- {project.title}: {project.short_description} "
                    f"(Tecnologías: {tech_list})"
                )
        
        return "\n".join(context_parts) if context_parts else ""
    
    def _convert_history_to_messages(self, history: List[ChatMessage]) -> List:
        """Convert ChatMessage list to LangChain message format"""
        messages = [SystemMessage(content=self.system_prompt)]
        
        for msg in history[-settings.CHATBOT_MAX_HISTORY:]:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                messages.append(AIMessage(content=msg.content))
        
        return messages
    
    async def chat(
        self, 
        request: ChatRequest, 
        db: Optional[AsyncSession] = None
    ) -> ChatResponse:
        """Process a chat message and return response"""
        
        # Get portfolio context if database is available
        portfolio_context = ""
        if db:
            portfolio_context = await self.get_portfolio_context(db)
        
        # Build messages with context
        messages = self._convert_history_to_messages(request.conversation_history)
        
        # Add portfolio context to system message if available
        if portfolio_context:
            messages[0].content += portfolio_context
        
        # Add current user message
        messages.append(HumanMessage(content=request.message))
        
        # Get response from Gemini
        try:
            response = await self.llm.ainvoke(messages)
            assistant_message = response.content
        except Exception as e:
            # Fallback response if AI fails
            assistant_message = (
                f"Disculpa, estoy teniendo problemas técnicos en este momento. "
                f"Por favor, contacta directamente a Nicolás en aran.nick15@gmail.com "
                f"o intenta nuevamente en unos momentos."
            )
            print(f"Chatbot error: {e}")
        
        # Generate or use existing session ID
        session_id = request.session_id or str(uuid.uuid4())
        
        return ChatResponse(
            message=assistant_message,
            timestamp=datetime.utcnow(),
            session_id=session_id,
            tokens_used=None  # Gemini doesn't provide this easily
        )
    
    def validate_message(self, message: str) -> tuple[bool, Optional[str]]:
        """Validate user message"""
        if not message or not message.strip():
            return False, "Message cannot be empty"
        
        if len(message) > 1000:
            return False, "Message is too long (max 1000 characters)"
        
        # Check for spam patterns (optional)
        spam_patterns = ["http://", "https://", "www.", ".com", ".net"]
        spam_count = sum(1 for pattern in spam_patterns if pattern in message.lower())
        if spam_count >= 3:
            return False, "Message appears to be spam"
        
        return True, None


# Singleton instance
chatbot_service = ChatbotService()

