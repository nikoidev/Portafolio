"""
Script para ejecutar el servidor FastAPI en modo debug
Uso: python debug_server.py
"""
import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8004,
        reload=True,
        log_level="debug"
    )
