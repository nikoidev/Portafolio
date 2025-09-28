# 🚀 Guía de Deployment

## Stack de Producción Recomendado

### Infraestructura
- **Dominio**: Cloudflare Registrar + DNS
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (FastAPI)
- **Base de Datos**: Supabase (PostgreSQL)
- **CDN/Security**: Cloudflare

### Costo Estimado: ~$68/año ($5.67/mes)

## Configuración de Cloudflare

### 1. Registro de Dominio
1. Crear cuenta en Cloudflare
2. Registrar dominio (ej: tuportafolio.com)
3. Configurar DNS automáticamente

### 2. Configuración DNS
```
A record: tuportafolio.com → Vercel
CNAME: api.tuportafolio.com → Railway
```

## Deployment del Frontend (Vercel)

### 1. Configuración Inicial
1. Conectar repositorio GitHub a Vercel
2. Configurar variables de entorno:

```env
NEXT_PUBLIC_API_URL=https://api.tuportafolio.com
NEXTAUTH_SECRET=tu-secret-super-seguro
NEXTAUTH_URL=https://tuportafolio.com
```

### 2. Configuración de Build
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### 3. Dominio Personalizado
1. Ir a Settings → Domains
2. Añadir `tuportafolio.com`
3. Configurar DNS en Cloudflare

## Deployment del Backend (Railway)

### 1. Configuración Inicial
1. Conectar repositorio a Railway
2. Seleccionar carpeta `backend`
3. Configurar variables de entorno:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/db
SECRET_KEY=tu-secret-key-super-seguro
ENVIRONMENT=production
DEBUG=False
ALLOWED_ORIGINS=["https://tuportafolio.com"]
```

### 2. Configuración de Build
Railway detecta automáticamente el Dockerfile.

### 3. Dominio Personalizado
1. Ir a Settings → Networking
2. Configurar dominio: `api.tuportafolio.com`

## Base de Datos (Supabase)

### 1. Configuración Inicial
1. Crear proyecto en Supabase
2. Obtener URL de conexión
3. Configurar en Railway:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### 2. Migraciones
```bash
# Desde local, apuntando a Supabase
DATABASE_URL=tu-url-supabase pipenv run alembic upgrade head
```

## CI/CD con GitHub Actions

### 1. Crear Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Portfolio

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

### 2. Configurar Secrets
En GitHub → Settings → Secrets:
- `VERCEL_TOKEN`
- `RAILWAY_TOKEN`
- `ORG_ID`
- `PROJECT_ID`
- `RAILWAY_SERVICE`

## Configuración de Producción

### Variables de Entorno Seguras

**Frontend (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://api.tuportafolio.com
NEXTAUTH_SECRET=secret-super-seguro-64-caracteres-minimo
NEXTAUTH_URL=https://tuportafolio.com
```

**Backend (Railway):**
```env
DATABASE_URL=postgresql://...
SECRET_KEY=secret-jwt-super-seguro-64-caracteres-minimo
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
ALLOWED_HOSTS=["api.tuportafolio.com"]
ALLOWED_ORIGINS=["https://tuportafolio.com"]
```

### SSL/HTTPS
- Cloudflare: SSL automático
- Vercel: HTTPS automático
- Railway: HTTPS automático

## Monitoreo y Analytics

### 1. Cloudflare Analytics
- Tráfico web
- Performance metrics
- Security insights

### 2. Vercel Analytics
- Core Web Vitals
- Page views
- Performance monitoring

### 3. Railway Metrics
- CPU/Memory usage
- Response times
- Error rates

## Backup y Seguridad

### 1. Base de Datos
- Supabase: Backups automáticos
- Configurar retención de backups

### 2. Archivos Estáticos
- Cloudflare: Cache automático
- Vercel: CDN global

### 3. Seguridad
- CORS configurado correctamente
- Rate limiting en FastAPI
- Validación de entrada con Pydantic
- JWT tokens seguros

## Comandos de Deployment

### Deploy Manual
```bash
# Frontend
vercel --prod

# Backend (si usas Railway CLI)
railway up
```

### Rollback
```bash
# Vercel
vercel rollback [deployment-url]

# Railway
railway rollback [deployment-id]
```

## Troubleshooting

### Problemas Comunes

**Error 500 en producción:**
- Verificar variables de entorno
- Revisar logs en Railway
- Comprobar conexión a base de datos

**CORS errors:**
- Verificar ALLOWED_ORIGINS
- Comprobar URLs en frontend

**Build failures:**
- Verificar dependencias en package.json/Pipfile
- Revisar logs de build
- Comprobar versiones de Node/Python

### Logs
```bash
# Railway
railway logs

# Vercel
vercel logs [deployment-url]
```
