# 🚀 Portafolio Personal

Un portafolio web moderno y editable para desarrolladores, construido con las mejores tecnologías del mercado.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python 3.11
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: JWT + OAuth2
- **Deployment**: Vercel (Frontend) + Railway (Backend)
- **CDN**: Cloudflare
- **Containerización**: Docker + Docker Compose

## 📁 Estructura del Proyecto

```
Portafolio/
├── frontend/          # Next.js + TypeScript
├── backend/           # FastAPI + Python
├── docker/            # Configuraciones Docker
├── .github/           # CI/CD workflows
└── docs/              # Documentación
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git

### Opción 1: Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone <tu-repositorio>
cd Portafolio

# 2. Iniciar todos los servicios
docker-compose -f docker/docker-compose.dev.yml up -d

# 3. Acceder a los servicios
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# PgAdmin: http://localhost:5050
```

### Opción 2: Instalación Manual

#### Backend Setup
```bash
cd backend
pip install pipenv
pipenv install
cp env.example .env
pipenv shell
pipenv run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Credenciales por Defecto
- **PgAdmin**: admin@portfolio.com / admin123
- **Base de Datos**: portfolio_user / portfolio_pass

## 📖 Documentación

- [Guía de Desarrollo](docs/DEVELOPMENT.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🎯 Características

- ✅ Panel de administración completo
- ✅ Editor de CV con generación de PDF
- ✅ Galería de proyectos con demos
- ✅ Sistema de autenticación seguro
- ✅ Responsive design
- ✅ SEO optimizado
- ✅ Analytics integrado

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.
