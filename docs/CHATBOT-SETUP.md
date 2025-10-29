# 🤖 Configuración del Chatbot NikoiDev

## Descripción

NikoiDev es un chatbot inteligente integrado en el portafolio que utiliza Google Gemini Flash 2.5 a través de LangChain para responder preguntas sobre Nicolás Urbaez, sus proyectos y habilidades.

---

## 🚀 Características

- ✅ **Conversaciones naturales** en español e inglés
- ✅ **Contexto del portafolio** automático (proyectos, skills, contacto)
- ✅ **Rate limiting** para prevenir abuso (10 mensajes cada 5 minutos por IP)
- ✅ **Interfaz flotante** elegante y responsive
- ✅ **Persistencia de sesión** para mantener contexto de conversación
- ✅ **Powered by Gemini Flash 2.5** - Rápido y económico

---

## 📦 Componentes

### Backend
- **Servicio**: `backend/app/services/chatbot_service.py`
- **API Endpoints**: `backend/app/api/v1/chatbot.py`
- **Schemas**: `backend/app/schemas/chatbot.py`

### Frontend
- **Componente**: `frontend/src/components/chatbot/ChatWidget.tsx`
- **API Client**: `frontend/src/lib/chatbot-api.ts`
- **Types**: `frontend/src/types/chatbot.ts`

---

## 🔧 Configuración Local

### 1. Instalar Dependencias Backend

```bash
cd backend
pipenv install langchain langchain-google-genai langchain-core
```

### 2. Configurar Variables de Entorno

Agregar al archivo `backend/.env`:

```env
# Chatbot Configuration
GOOGLE_API_KEY=your-google-gemini-api-key
CHATBOT_NAME=NikoiDev
CHATBOT_RATE_LIMIT=10
CHATBOT_RATE_WINDOW=300
CHATBOT_MAX_HISTORY=10
```

### 3. Instalar Dependencias Frontend

```bash
cd frontend
npm install uuid @types/uuid
```

### 4. Iniciar Servidores

```bash
# Backend
cd backend
pipenv run dev

# Frontend (en otra terminal)
cd frontend
npm run dev
```

### 5. Probar el Chatbot

- Ir a `http://localhost:3004`
- Click en el botón flotante de chat en la esquina inferior derecha
- ¡Empieza a chatear!

---

## ☁️ Deployment en Producción

### Railway (Backend)

#### 1. Variables de Entorno Requeridas

Agregar en Railway > Settings > Variables:

```
GOOGLE_API_KEY=AIzaSyBGVtje48zpAb_PSafYlG6NgX4i-Jh8hiU
CHATBOT_NAME=NikoiDev
CHATBOT_RATE_LIMIT=10
CHATBOT_RATE_WINDOW=300
CHATBOT_MAX_HISTORY=10
```

#### 2. Actualizar Pipfile.lock

El deploy automático de Railway detectará las nuevas dependencias:
- `langchain`
- `langchain-google-genai`
- `langchain-core`

#### 3. Reiniciar el Servicio

Railway reiniciará automáticamente después de agregar las variables.

### Vercel (Frontend)

No se requieren cambios en Vercel. El chatbot usa las mismas variables de entorno existentes (`NEXT_PUBLIC_API_URL`).

---

## 📊 API Endpoints

### `POST /api/v1/chatbot/chat`

Enviar un mensaje al chatbot.

**Request Body:**
```json
{
  "message": "Hola, ¿quién eres?",
  "conversation_history": [],
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "message": "¡Hola! Soy NikoiDev, el asistente de Nicolás...",
  "timestamp": "2025-10-29T17:26:16.929148",
  "tokens_used": null,
  "session_id": "abc-123"
}
```

**Rate Limit:** 10 mensajes por 5 minutos por IP

### `GET /api/v1/chatbot/info`

Obtener información sobre el chatbot.

**Response:**
```json
{
  "name": "NikoiDev",
  "version": "1.0.0",
  "model": "gemini-2.0-flash-exp",
  "rate_limit": {
    "max_requests": 10,
    "window_seconds": 300
  },
  "capabilities": [
    "Answer questions about Nicolás Urbaez",
    "Provide project information",
    "Share contact details",
    "Discuss technical skills and experience"
  ],
  "languages": ["español", "english"]
}
```

### `GET /api/v1/chatbot/health`

Verificar estado del chatbot.

**Response:**
```json
{
  "status": "healthy",
  "chatbot_name": "NikoiDev",
  "timestamp": "2025-10-29T17:26:16.929148"
}
```

---

## 🔐 Seguridad

### ✅ Implementado

1. **API Key Protegida**: Solo en backend, nunca expuesta al frontend
2. **Rate Limiting**: 10 mensajes por 5 minutos por IP
3. **Validación de Input**: Máximo 1000 caracteres, filtro anti-spam
4. **CORS**: Solo orígenes permitidos pueden acceder
5. **Error Handling**: Mensajes de error genéricos sin exponer detalles

### 🚨 Consideraciones

- **Costos**: Gemini Flash 2.5 es muy económico pero monitorea el uso
- **Rate Limiting en Producción**: Considerar usar Redis para rate limiting distribuido
- **Logs**: Los errores se imprimen en consola para debugging

---

## 💰 Costos Estimados

### Google Gemini Flash 2.5

**Tier Gratuito:**
- 15 requests por minuto (RPM)
- 1 millón de tokens por minuto (TPM)
- 1,500 requests por día (RPD)

**Estimación para tu portafolio:**
- Promedio: ~200 tokens por conversación
- Rate limit: 10 mensajes por usuario cada 5 min
- **Costo mensual estimado: $0** (dentro del tier gratuito)

Con 100 visitantes diarios haciendo 5 preguntas cada uno:
- 500 conversaciones/día
- ~100,000 tokens/día
- ~3 millones tokens/mes
- **Costo: ~$0.00** con el tier gratuito

---

## 🎨 Personalización

### Modificar la Personalidad

Editar `backend/app/services/chatbot_service.py`:

```python
def _build_system_prompt(self) -> str:
    return f"""Eres {settings.CHATBOT_NAME}...
    
    PERSONALIDAD:
    - [Personaliza aquí]
    """
```

### Cambiar Apariencia

Editar `frontend/src/components/chatbot/ChatWidget.tsx`:

```tsx
// Colores del gradiente
className="bg-gradient-to-r from-blue-600 to-purple-600"

// Posición del botón
className="fixed bottom-6 right-6"
```

### Ajustar Rate Limit

Modificar en `.env`:

```env
CHATBOT_RATE_LIMIT=20        # Aumentar a 20 mensajes
CHATBOT_RATE_WINDOW=600      # Cada 10 minutos
```

---

## 🐛 Troubleshooting

### El chatbot no responde

1. Verificar que la API key esté configurada
2. Check logs del backend: `pipenv run dev`
3. Probar el health endpoint: `curl http://localhost:8004/api/v1/chatbot/health`

### Error 429 (Rate Limit)

- Usuario ha excedido 10 mensajes en 5 minutos
- Esperar o aumentar el rate limit

### Error 500

- Verificar logs del backend
- Comprobar que Gemini API esté funcionando
- Verificar conectividad a Google AI

### El botón no aparece

- Verificar que `ChatWidget` esté en `layout.tsx`
- Check browser console para errores de JavaScript
- Verificar que el frontend esté corriendo

---

## 📈 Monitoreo

### Métricas Recomendadas

- **Conversaciones por día**
- **Tokens usados**
- **Rate limit hits**
- **Errores de AI**
- **Tiempo de respuesta promedio**

### Logs

Los logs del chatbot aparecen en la consola del backend:

```
ChatBot Service Import: OK
Chatbot error: [detalles del error]
```

---

## 🔄 Actualizaciones Futuras

### Mejoras Planificadas

- [ ] **Base de datos de conversaciones**: Guardar historial para analytics
- [ ] **Redis para rate limiting**: Rate limiting distribuido
- [ ] **Queries dinámicas**: Obtener proyectos reales desde la BD
- [ ] **Feedback del usuario**: Thumbs up/down en respuestas
- [ ] **Modo offline**: Respuestas predefinidas si Gemini falla
- [ ] **Integración con Analytics**: Track conversaciones en Google Analytics
- [ ] **Multi-idioma**: Detección automática de idioma

---

## 📞 Soporte

Si tienes problemas con el chatbot:

1. Revisa esta documentación
2. Check los logs del backend
3. Verifica que todas las variables de entorno estén configuradas
4. Contacta a Nicolás: aran.nick15@gmail.com

---

## 📄 Licencia

Este chatbot es parte del proyecto Portfolio Personal bajo licencia MIT.

---

**¡Disfruta de NikoiDev! 🤖✨**

