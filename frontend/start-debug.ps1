# Script para iniciar el frontend Next.js en modo debug
# Uso: .\start-debug.ps1

Write-Host "🚀 Iniciando Frontend Next.js en modo debug..." -ForegroundColor Green
Write-Host "Puerto: 3004" -ForegroundColor Yellow
Write-Host "Debug Port: 9229" -ForegroundColor Yellow

# Configurar variables de entorno
$env:NODE_ENV = "development"
$env:NODE_OPTIONS = "--inspect=9229"

# Iniciar Next.js
npm run dev

Write-Host "✅ Frontend iniciado correctamente!" -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:3004" -ForegroundColor Cyan
Write-Host "🔍 Debug: Usar 'Attach to Node.js' en VS Code" -ForegroundColor Cyan
