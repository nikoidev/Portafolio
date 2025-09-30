# ⚡ Comandos Rápidos - Referencia

## 🚀 Iniciar Proyecto

### Primera Vez
```bash
# Backend
cd backend
pipenv install
cp env.example .env
pipenv shell
pipenv run dev

# Frontend (nueva terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### Días Siguientes
```bash
# Backend
cd backend
pipenv shell
pipenv run dev

# Frontend
cd frontend
npm run dev
```

---

## 🔑 Login por Primera Vez

### 1. Setup (Solo Primera Vez)
```
http://localhost:3000/admin/setup
```
→ Click "Crear Usuario Administrador"

### 2. Login
```
http://localhost:3000/admin/login

Email: admin@portfolio.com
Password: admin123
```

---

## 📂 URLs Importantes

### Admin (Requiere Login)
```bash
http://localhost:3000/admin/login      # Login
http://localhost:3000/admin            # Dashboard  
http://localhost:3000/admin/projects   # CRUD Proyectos ⭐
http://localhost:3000/admin/uploads    # Subir imágenes
http://localhost:3000/admin/cv         # Editor CV
```

### Público
```bash
http://localhost:3000                  # Inicio
http://localhost:3000/projects         # Lista proyectos
http://localhost:3000/about            # Sobre mí
http://localhost:3000/contact          # Contacto
```

### API (Backend)
```bash
http://localhost:8000/docs             # Swagger UI
http://localhost:8000/redoc            # ReDoc
http://localhost:8000/health           # Health check
```

---

## 📦 Crear Proyecto Rápido

### Mínimo Viable
```javascript
Título: Mi Proyecto
Descripción: Descripción del proyecto
Tecnologías: Next.js, React, TypeScript
☑️ Publicado
```

### Con Demo Interactivo
```javascript
Título: Sistema de Almacén
Descripción: Sistema completo para gestión de inventario
Tecnologías: Next.js, FastAPI, PostgreSQL
URL Demo: https://tu-proyecto.vercel.app
Tipo Demo: Iframe (Interactivo) ⭐
☑️ Publicado
☑️ Destacado
```

---

## 🛠️ Comandos de Desarrollo

### Backend
```bash
# Activar entorno
pipenv shell

# Instalar dependencias
pipenv install

# Correr servidor desarrollo
pipenv run dev

# Migrar base de datos
alembic upgrade head

# Crear migración
alembic revision --autogenerate -m "descripcion"

# Shell de Python
pipenv run python
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Linting
npm run lint
```

---

## 🗄️ Base de Datos

### PostgreSQL Local (Docker)
```bash
# Iniciar DB
docker-compose -f docker/docker-compose.dev.yml up -d postgres

# Ver logs
docker-compose -f docker/docker-compose.dev.yml logs -f postgres

# Parar DB
docker-compose -f docker/docker-compose.dev.yml down
```

### Conectar a DB
```bash
# Credenciales por defecto:
Host: localhost
Port: 5440
User: portfolio_user
Password: portfolio_pass
Database: portfolio_db
```

---

## 📁 Gestión de Archivos

### Subir Imágenes
```
Admin → Uploads
→ Drag & Drop imágenes
→ Quedan disponibles automáticamente en selector
```

### Rutas de Archivos
```bash
backend/uploads/images/     # Imágenes de proyectos
backend/uploads/files/      # Archivos varios
backend/uploads/cv_pdfs/    # PDFs de CV
```

---

## 🔐 Seguridad

### Cambiar Contraseña Admin
```bash
# Editar: backend/.env
ADMIN_EMAIL=tu-email@ejemplo.com
ADMIN_PASSWORD=tu-contraseña-segura

# O editar: backend/app/core/config.py
ADMIN_EMAIL: str = "tu-email@ejemplo.com"
ADMIN_PASSWORD: str = "tu-contraseña-segura"

# Luego recrear usuario:
# Borrar .env y volver a hacer setup
```

### Generar Secret Key
```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# O usar:
openssl rand -hex 32
```

---

## 🚢 Deployment

### Railway (Backend)
```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up

# Ver logs
railway logs

# Variables
railway variables
```

### Vercel (Frontend)
```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Ver logs
vercel logs
```

---

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar puerto 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Matar proceso
kill -9 PID  # Mac/Linux
taskkill /PID pid /F  # Windows
```

### Frontend no inicia
```bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run dev
```

### Base de datos no conecta
```bash
# Verificar que PostgreSQL esté corriendo
docker ps

# Reiniciar
docker-compose -f docker/docker-compose.dev.yml restart postgres

# Ver logs
docker-compose -f docker/docker-compose.dev.yml logs postgres
```

### Error CORS
```bash
# Verificar en backend/.env:
ALLOWED_ORIGINS=["http://localhost:3000"]

# O en backend/app/core/config.py
```

---

## 📊 Testing

### Backend
```bash
cd backend
pipenv shell
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## 🔍 Logs

### Ver Logs Backend
```bash
# Los logs aparecen en la terminal donde corre
pipenv run dev
```

### Ver Logs Frontend
```bash
# Los logs aparecen en la terminal donde corre
npm run dev

# También en el navegador (F12 → Console)
```

---

## 📝 Git

### Commits Recomendados
```bash
git add .
git commit -m "feat: agregar sistema de demos interactivos"
git push origin main

# Otros ejemplos:
git commit -m "fix: corregir error de CORS"
git commit -m "docs: actualizar README"
git commit -m "style: mejorar diseño de navbar"
git commit -m "refactor: optimizar componentes"
```

---

## 🎯 Atajos Útiles

### Reiniciar Todo
```bash
# Ctrl+C en ambas terminales
# Luego:
cd backend && pipenv shell && pipenv run dev
cd frontend && npm run dev
```

### Limpiar Todo
```bash
# Backend
cd backend
rm -rf __pycache__
pipenv --rm
pipenv install

# Frontend  
cd frontend
rm -rf .next node_modules
npm install
```

### Ver Todo Funcionando
```bash
# Después de levantar backend y frontend:
# 1. http://localhost:8000/docs  (API)
# 2. http://localhost:3000  (Frontend)
# 3. http://localhost:3000/admin/login  (Admin)
```

---

## 📚 Documentación Rápida

| Archivo | Para Qué |
|---------|----------|
| [COMO_EMPEZAR.md](./COMO_EMPEZAR.md) | Inicio rápido 3 pasos |
| [RESUMEN_FINAL.md](./RESUMEN_FINAL.md) | Resumen completo |
| [docs/INICIO_RAPIDO.md](./docs/INICIO_RAPIDO.md) | Guía detallada |
| [docs/DEMO_SYSTEM.md](./docs/DEMO_SYSTEM.md) | Sistema de demos |
| [docs/RAILWAY_DEPLOYMENT.md](./docs/RAILWAY_DEPLOYMENT.md) | Deploy Railway |

---

## ⚡ ONE-LINERS

### Inicio completo
```bash
(cd backend && pipenv shell && pipenv run dev) & (cd frontend && npm run dev)
```

### Crear admin
```bash
curl -X POST http://localhost:8000/api/v1/auth/create-admin
```

### Verificar que todo funcione
```bash
curl http://localhost:8000/health && curl http://localhost:3000
```

---

**Guarda este archivo como referencia rápida! 📌**
