# 🚂 Deployment en Railway - Guía Rápida

## ¿Por qué Railway?

Railway fue recomendado porque:
- ✅ **Fácil de usar**: Deploy con un solo clic
- ✅ **Detecta Python automáticamente**: Reconoce FastAPI
- ✅ **PostgreSQL incluido**: Base de datos integrada
- ✅ **$5/mes**: Plan muy económico
- ✅ **Free tier**: $5 de crédito gratis al mes
- ✅ **Logs en tiempo real**: Fácil debugging
- ✅ **Custom domains**: Conecta tu dominio de Cloudflare

## Paso a Paso

### 1. Preparar el Proyecto

Tu backend ya tiene el `Dockerfile` necesario. Verifica que esté en la raíz de `/backend`:

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY Pipfile Pipfile.lock ./
RUN pip install pipenv && pipenv install --system --deploy
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub
3. Conecta tu repositorio

### 3. Nuevo Proyecto

```bash
# Opción 1: Desde la Web
1. Click en "New Project"
2. Select "Deploy from GitHub repo"
3. Buscar tu repositorio "Portafolio"
4. Seleccionar la carpeta /backend

# Opción 2: Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```

### 4. Configurar PostgreSQL

```bash
# En Railway Dashboard:
1. Click en tu proyecto
2. "+ New" → "Database" → "PostgreSQL"
3. Railway crea la DB automáticamente
4. Copia el DATABASE_URL
```

### 5. Variables de Entorno

En Railway Dashboard → Variables:

```env
# Base de Datos (Railway lo genera automáticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Seguridad
SECRET_KEY=tu-secret-key-super-seguro-minimo-64-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Entorno
ENVIRONMENT=production
DEBUG=False

# CORS - Actualizar cuando tengas el dominio
ALLOWED_ORIGINS=["https://tuportafolio.com","https://www.tuportafolio.com"]
ALLOWED_HOSTS=["api.tuportafolio.com"]

# Puerto
PORT=8000
```

### 6. Configurar Build

Railway detecta el Dockerfile automáticamente, pero puedes configurar:

```toml
# railway.toml (opcional)
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
```

### 7. Migraciones de Base de Datos

```bash
# Opción 1: Desde Railway CLI
railway run alembic upgrade head

# Opción 2: Agregar al Dockerfile
RUN alembic upgrade head

# Opción 3: Crear script de inicio
# start.sh
#!/bin/bash
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 8. Dominio Personalizado

```bash
# En Railway:
1. Settings → Networking
2. "Generate Domain" (Railway te da uno gratis: xxx.railway.app)
3. "Custom Domain" → Agregar: api.tuportafolio.com

# En Cloudflare:
1. DNS → Add Record
2. Type: CNAME
3. Name: api
4. Target: xxx.railway.app (el que te dio Railway)
5. Proxy status: Proxied (naranja)
6. Save
```

### 9. Deploy

```bash
# Railway hace deploy automático en cada push a main
git add .
git commit -m "Deploy to Railway"
git push origin main

# Ver logs en tiempo real:
railway logs

# O desde la web: Dashboard → Deployments → Logs
```

## Verificar el Deploy

### 1. Health Check

```bash
curl https://api.tuportafolio.com/health
# Respuesta esperada: {"status": "healthy"}
```

### 2. API Docs

Abre en el navegador:
```
https://api.tuportafolio.com/docs
```

### 3. Test Endpoint

```bash
curl https://api.tuportafolio.com/api/v1/projects
# Debería devolver lista de proyectos
```

## Conectar Frontend (Vercel)

### En Vercel Dashboard:

```env
# Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://api.tuportafolio.com
```

### Redeploy Frontend:

```bash
# Vercel hace redeploy automático, o forzar:
vercel --prod
```

## Estructura Final

```
tuportafolio.com          → Vercel (Frontend)
api.tuportafolio.com      → Railway (Backend)
Database                  → Railway PostgreSQL
```

## Monitoreo

### Railway Dashboard

```
Dashboard → Metrics
- CPU Usage
- Memory Usage
- Network
- Deployments
- Logs en tiempo real
```

### Logs Útiles

```bash
# Ver logs en vivo
railway logs --follow

# Filtrar errores
railway logs | grep ERROR

# Últimas 100 líneas
railway logs --tail 100
```

## Costos

### Free Tier
- ✅ $5 de crédito gratis/mes
- ✅ 500 horas de ejecución
- ✅ PostgreSQL incluido
- ✅ Suficiente para proyectos pequeños

### Developer Plan ($5/mes)
- ✅ Crédito de $5/mes
- ✅ Ejecución ilimitada
- ✅ Custom domains
- ✅ Prioridad en soporte

### Optimizar Costos

```bash
# Sleep cuando no esté en uso (opcional)
# Railway settings → Sleep after 1 hour

# Usar starter DB (más barato)
# PostgreSQL → Settings → Plan → Starter
```

## Troubleshooting

### Error: Port already in use

```python
# main.py - Asegurar que usa variable PORT
import os
port = int(os.getenv("PORT", 8000))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
```

### Error: Database connection failed

```bash
# Verificar DATABASE_URL
railway variables

# Test conexión
railway run python -c "from app.core.database import engine; print(engine.url)"
```

### Error: Build failed

```bash
# Ver logs de build
railway logs --deployment

# Verificar Pipfile.lock
pipenv lock --clear
git add Pipfile.lock
git commit -m "Update Pipfile.lock"
git push
```

### Error: CORS

```python
# main.py - Verificar CORS
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Comandos Útiles

```bash
# Railway CLI
railway login              # Login
railway link               # Link a proyecto existente
railway status             # Ver status
railway logs               # Ver logs
railway run [command]      # Ejecutar comando
railway open               # Abrir dashboard
railway domain             # Gestionar dominios
railway variables          # Ver variables

# Database
railway run alembic upgrade head    # Migrar DB
railway run python -m app.db.init   # Inicializar DB
railway connect Postgres            # Conectar a DB

# Deploy
git push origin main       # Deploy automático
railway up                 # Deploy manual
```

## Checklist de Deployment

- [ ] Código en GitHub
- [ ] Proyecto creado en Railway
- [ ] PostgreSQL configurado
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Dominio personalizado configurado
- [ ] CORS configurado correctamente
- [ ] Health check funcionando
- [ ] API docs accesible
- [ ] Frontend conectado
- [ ] SSL/HTTPS activo (automático con Railway)

## Siguiente Paso: Frontend en Vercel

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para configurar Vercel.

## Soporte

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Blog](https://blog.railway.app)

---

¡Railway hace el deployment super fácil! En 10 minutos tu backend estará en producción 🚀
