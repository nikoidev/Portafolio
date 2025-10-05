# 🚀 Portfolio Profesional

Sistema de portafolio web completo con gestión de contenido, autenticación y demos interactivos.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Deployment](#-deployment)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 📖 Descripción

Un sistema completo de portafolio web moderno que incluye:

- **Sistema de Gestión de Contenido (CMS)** - Edita tu portafolio dinámicamente
- **Sistema de Autenticación** - Control de acceso basado en roles (4 niveles)
- **Gestión de Proyectos** - Muestra tus proyectos con demos interactivos
- **Generación de CV** - Crea y descarga tu CV en PDF
- **Gestión de Archivos** - Sube y organiza imágenes, videos y documentos
- **Diseño Responsive** - Funciona perfectamente en todos los dispositivos

---

## ✨ Características

### 🔐 Autenticación y Roles
- **4 Niveles de Rol**: Super Admin, Admin, Editor, Viewer
- **Autenticación JWT** con gestión segura de tokens
- **Permisos granulares** para cada rol
- **Gestión de usuarios** completa desde el panel admin

### 📂 Gestión de Proyectos
- **CRUD completo** con control de permisos
- **Demos Interactivos**:
  - 🖥️ Iframe - Integra aplicaciones web en vivo
  - 🎥 Video - Muestra demos de apps móviles/escritorio
  - 🔗 Enlaces - Links directos a proyectos en vivo
- **Galería de imágenes** múltiples por proyecto
- **Proyectos destacados** en la página principal
- **Búsqueda y filtros** avanzados

### 📄 Sistema de CV
- **Múltiples templates** profesionales
- **Generación de PDF** para descarga
- **Vista previa en tiempo real**
- **Contenido dinámico** desde el panel admin

### 📁 Gestión de Archivos
- **Subida de archivos** con drag and drop
- **Soporte de videos** para demos
- **Organización automática** por categorías
- **Galería de medios** centralizada

---

## 🛠️ Tecnologías

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes UI accesibles
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gestión de estado
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** - Validación de formularios

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Framework Python moderno
- **Python 3.11+** - Lenguaje de programación
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos relacional
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - ORM asíncrono
- **[Alembic](https://alembic.sqlalchemy.org/)** - Migraciones de BD
- **JWT** - Autenticación con tokens
- **[Pydantic v2](https://docs.pydantic.dev/)** - Validación de datos

### DevOps
- **[Docker](https://www.docker.com/)** - Contenedorización
- **[Vercel](https://vercel.com/)** - Hosting del frontend
- **[Railway](https://railway.app/)** - Hosting del backend
- **[Supabase](https://supabase.com/)** - Base de datos PostgreSQL

---

## 🚀 Instalación

### Requisitos Previos

- **Node.js** 18 o superior ([Descargar](https://nodejs.org/))
- **Python** 3.11 o superior ([Descargar](https://www.python.org/))
- **PostgreSQL** 14+ ([Descargar](https://www.postgresql.org/download/)) o Docker
- **Git** ([Descargar](https://git-scm.com/))
- **pipenv** (Instalar: `pip install pipenv`)

### Pasos de Instalación

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/Nikoi18/Portafolio.git
cd Portafolio
```

#### 2. Configurar la Base de Datos

**Opción A: Usar Docker (Recomendado)**

```bash
docker-compose -f docker/docker-compose.dev.yml up -d postgres
```

Accede a PgAdmin en `http://localhost:5055`:
- Email: `admin@portfolio.com`
- Contraseña: `admin123`

**Opción B: PostgreSQL Local**

```sql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'portfolio_pass';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
```

#### 3. Configurar el Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
pipenv install

# Activar entorno virtual
pipenv shell

# Copiar y configurar variables de entorno
cp env.example .env
```

**Editar `backend/.env`:**
```env
# Base de datos
DATABASE_URL=postgresql://portfolio_user:portfolio_pass@localhost:5440/portfolio_db

# Seguridad - ¡CAMBIAR EN PRODUCCIÓN!
SECRET_KEY=tu-clave-secreta-super-segura-minimo-32-caracteres
SUPER_ADMIN_EMAIL=aran.nick15@gmail.com
SUPER_ADMIN_PASSWORD=tu-contraseña-segura
SUPER_ADMIN_NAME=Nicolas A. Urbaez A.

# Entorno
ENVIRONMENT=development
DEBUG=True

# CORS
ALLOWED_ORIGINS=["http://localhost:3004"]
```

```bash
# Ejecutar migraciones de base de datos
alembic upgrade head

# Iniciar el servidor backend
pipenv run dev
```

El backend estará disponible en:
- **API**: `http://localhost:8004`
- **Documentación Swagger**: `http://localhost:8004/docs`

#### 4. Configurar el Frontend

```bash
# Abrir nueva terminal y navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp env.local.example .env.local
```

**Editar `frontend/.env.local`:**
```env
# Configuración API
NEXT_PUBLIC_API_URL=http://localhost:8004

# NextAuth (opcional por ahora)
NEXTAUTH_SECRET=dev-secret-key-cambiar-en-produccion
NEXTAUTH_URL=http://localhost:3004

# Entorno
NODE_ENV=development
```

```bash
# Iniciar el servidor frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:3004`

#### 5. Configuración Inicial

1. **Crear Super Admin** (primera vez):
   - Ir a: `http://localhost:3004/admin/setup`
   - Click en "Crear Super Administrador"
   - Las credenciales se toman del archivo `backend/.env`

2. **Iniciar Sesión**:
   - Ir a: `http://localhost:3004/admin/login`
   - Usar las credenciales configuradas en el `.env`

3. **Acceder al Panel Admin**:
   - `http://localhost:3004/admin`
   - Gestiona proyectos, usuarios, CV y más

---

## 💻 Uso

### Panel de Administración

#### Dashboard (`/admin`)
- Vista general de proyectos y usuarios
- Acceso rápido a todas las funcionalidades

#### Gestión de Proyectos (`/admin/projects`)
- Crear, editar y eliminar proyectos
- Configurar demos interactivos (Iframe, Video, Enlaces)
- Subir imágenes y gestionar galerías
- Marcar proyectos como destacados

#### Gestión de Usuarios (`/admin/users`)
- Crear usuarios con diferentes roles
- Editar permisos y roles
- Eliminar usuarios

#### Gestión de CV (`/admin/cv`)
- Editar secciones del CV
- Seleccionar template
- Generar y descargar PDF

#### Gestión de Archivos (`/admin/uploads`)
- Subir imágenes, videos y documentos
- Organizar archivos por proyecto
- Ver y eliminar archivos

### Páginas Públicas

- **Inicio** (`/`) - Página principal con proyectos destacados
- **Proyectos** (`/projects`) - Lista completa de proyectos
- **Detalle de Proyecto** (`/projects/[slug]`) - Ver proyecto individual
- **Acerca de** (`/about`) - Información sobre ti
- **Contacto** (`/contact`) - Formulario de contacto
- **Descargar CV** (`/cv/download`) - Descargar tu CV en PDF

---

## 📁 Estructura del Proyecto

```
portafolio/
├── frontend/                 # Aplicación Next.js
│   ├── src/
│   │   ├── app/             # Páginas (App Router)
│   │   ├── components/      # Componentes React
│   │   ├── lib/             # Utilidades y clientes API
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Estado global (Zustand)
│   │   └── types/           # Tipos TypeScript
│   ├── public/              # Archivos estáticos
│   └── package.json
│
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/v1/         # Endpoints de la API
│   │   ├── core/           # Configuración core
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Schemas Pydantic
│   │   ├── services/       # Lógica de negocio
│   │   └── utils/          # Utilidades
│   ├── alembic/            # Migraciones de BD
│   └── Pipfile
│
├── docker/                  # Configuraciones Docker
│   ├── docker-compose.dev.yml
│   └── docker-compose.prod.yml
│
└── docs/                    # Documentación
    ├── DEPLOYMENT.md
    └── DEVELOPMENT.md
```

---

## 🌐 Deployment

### Stack Recomendado

- **Frontend**: [Vercel](https://vercel.com/) (gratis)
- **Backend**: [Railway](https://railway.app/) (~$5/mes)
- **Base de Datos**: [Supabase](https://supabase.com/) (gratis)
- **Dominio/CDN**: [Cloudflare](https://cloudflare.com/) (opcional)

### Pasos Rápidos

1. **Desplegar Frontend en Vercel**:
   - Conectar repositorio GitHub
   - Configurar variables de entorno
   - Deploy automático

2. **Desplegar Backend en Railway**:
   - Conectar repositorio
   - Configurar variables de entorno
   - Deploy automático

3. **Base de Datos en Supabase**:
   - Crear proyecto
   - Obtener URL de conexión
   - Configurar en Railway

Ver guía completa en: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer los detalles del proceso.

### Pasos para Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Formato, punto y coma, etc (sin cambios en código)
- `refactor:` - Refactorización de código
- `test:` - Agregar o actualizar tests
- `chore:` - Tareas de mantenimiento

---

## 🔒 Seguridad

- Autenticación JWT segura
- Hashing de contraseñas con bcrypt
- Control de acceso basado en roles
- Validación de datos con Pydantic
- Protección contra SQL injection
- CORS configurado adecuadamente
- Rate limiting en producción

**Reportar vulnerabilidades**: Si encuentras un problema de seguridad, por favor envía un email privado en lugar de crear un issue público.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License - Copyright (c) 2024

Se permite el uso, copia, modificación y distribución de este software
con o sin modificaciones, siempre que se incluya el aviso de copyright.
```

---

## 📧 Contacto

- **Email**: aran.nick15@gmail.com
- **GitHub**: [@Nikoi18](https://github.com/Nikoi18)
- **Repositorio**: [github.com/Nikoi18/Portafolio](https://github.com/Nikoi18/Portafolio)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [FastAPI](https://fastapi.tiangolo.com/) - Framework Python
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes UI

---

<div align="center">

**Hecho con ❤️ usando Next.js y FastAPI**

⭐ Si este proyecto te fue útil, considera darle una estrella

</div>
