# Script para iniciar el backend FastAPI en modo debug
# Uso: .\start-debug.ps1

Write-Host "🐍 Iniciando Backend FastAPI en modo debug..." -ForegroundColor Green
Write-Host "Puerto: 8004" -ForegroundColor Yellow

# Activar entorno virtual y ejecutar
pipenv run python -c "
import uvicorn
if __name__ == '__main__':
    uvicorn.run(
        'app.main:app',
        host='0.0.0.0',
        port=8004,
        reload=True,
        log_level='debug'
    )
"

Write-Host "✅ Backend iniciado correctamente!" -ForegroundColor Green
Write-Host "🌐 API: http://localhost:8004" -ForegroundColor Cyan
Write-Host "📚 Docs: http://localhost:8004/docs" -ForegroundColor Cyan
