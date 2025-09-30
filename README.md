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
# Frontend: http://localhost:3004
# Backend API: http://localhost:8004
# API Docs: http://localhost:8004/docs
# PgAdmin: http://localhost:5055
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
- ✅ **Sistema de demos interactivos** (Iframe, Video, Enlaces)
- ✅ Galería de proyectos con filtros avanzados
- ✅ Sistema de autenticación seguro
- ✅ Responsive design
- ✅ SEO optimizado
- ✅ Analytics integrado

### 🎬 Sistema de Demos

El portafolio incluye un sistema avanzado para mostrar tus proyectos **en vivo**:

- **Iframe Interactivo**: Los reclutadores pueden interactuar con tu proyecto directamente desde el portafolio
- **Video Demo**: Muestra videos demostración de tus apps móviles o de escritorio
- **Enlaces Externos**: Abre proyectos en nuevas pestañas
- **Modal Full-Screen**: Experiencia inmersiva con controles de navegación

Ver [Documentación de Demos](docs/DEMO_SYSTEM.md) para más detalles.

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.
