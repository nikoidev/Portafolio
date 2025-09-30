# 🚀 Portafolio Personal Profesional

Un portafolio web moderno y completo con sistema de gestión de contenido, autenticación avanzada y demos interactivos.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python 3.11  
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con sistema de roles y permisos
- **Deployment**: Cloudflare (DNS) + Vercel (Frontend) + Railway (Backend)

## 📁 Estructura del Proyecto

```
Portafolio/
├── frontend/          # Next.js + TypeScript
├── backend/           # FastAPI + Python
├── docker/            # Configuraciones Docker
└── docs/              # Documentación
```

## 🔐 Sistema de Usuarios y Roles

El proyecto incluye un **sistema completo de autenticación con 4 niveles de roles**:

### Roles Disponibles:
- **SUPER_ADMIN**: Control total del sistema
- **ADMIN**: Gestión completa (proyectos, CV, usuarios)
- **EDITOR**: Solo edición de contenido
- **VIEWER**: Solo lectura

Ver [SISTEMA_USUARIOS_ROLES.md](SISTEMA_USUARIOS_ROLES.md) para documentación completa.

## 🚀 Inicio Rápido

### Prerrequisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL (o Docker)

### 1. Backend

```bash
cd backend

# Configurar variables de entorno
cp env.example .env

# Editar .env con tus credenciales de super admin:
# SUPER_ADMIN_EMAIL=tu-email@ejemplo.com
# SUPER_ADMIN_PASSWORD=tu-contraseña-segura
# SUPER_ADMIN_NAME=Tu Nombre

# Instalar dependencias
pipenv install

# Activar entorno virtual
pipenv shell

# Migrar base de datos
pipenv run alembic upgrade head

# Iniciar servidor
pipenv run dev
```

### 2. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local

# Editar .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Iniciar servidor
npm run dev
```

### 3. Configuración Inicial

1. **Crear Super Admin** (solo primera vez):
   ```
   http://localhost:3000/admin/setup
   ```
   Click en "Crear Super Administrador"
   
   Las credenciales se toman del archivo `backend/.env`:
   - SUPER_ADMIN_EMAIL
   - SUPER_ADMIN_PASSWORD
   - SUPER_ADMIN_NAME

2. **Iniciar Sesión**:
   ```
   http://localhost:3000/admin/login
   ```
   Usa las credenciales configuradas en el .env

3. **Panel de Administración**:
   ```
   http://localhost:3000/admin
   ```

## 🎯 Características

### ✅ Sistema de Autenticación Avanzado
- Roles y permisos granulares
- Super Admin configurable desde .env
- CRUD completo de usuarios
- Protecciones de seguridad integradas

### ✅ Gestión de Proyectos
- CRUD completo con permisos
- **Sistema de demos interactivos** (Iframe, Video, Enlaces)
- Galería de imágenes
- Filtros y búsqueda avanzada
- Proyectos destacados

### ✅ Editor de CV
- Generación de PDF
- Múltiples templates
- Vista previa en tiempo real

### ✅ Gestión de Archivos
- Upload de imágenes
- Galería de medios
- Gestor de archivos

### ✅ Demo Interactivo
El portafolio incluye un sistema avanzado para mostrar proyectos **en vivo**:
- **Iframe Interactivo**: Los visitantes pueden interactuar con tu proyecto desde el portafolio
- **Video Demo**: Muestra videos de apps móviles o escritorio
- **Enlaces Externos**: Abre proyectos en nuevas pestañas
- **Modal Full-Screen**: Experiencia inmersiva

## 📚 Documentación

- **[SISTEMA_USUARIOS_ROLES.md](SISTEMA_USUARIOS_ROLES.md)** - Sistema de autenticación completo
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Guía de deployment
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Guía de desarrollo

## 🔌 API Endpoints

### Autenticación
```
POST /api/v1/auth/login
POST /api/v1/auth/create-super-admin
GET  /api/v1/auth/me
```

### Usuarios (Nuevo)
```
GET    /api/v1/users/              # Listar usuarios
POST   /api/v1/users/              # Crear usuario
PUT    /api/v1/users/{id}          # Actualizar usuario
DELETE /api/v1/users/{id}          # Eliminar usuario
GET    /api/v1/users/roles/available  # Roles disponibles
```

### Proyectos
```
GET    /api/v1/projects/           # Listar proyectos
POST   /api/v1/projects/           # Crear proyecto
PUT    /api/v1/projects/{id}       # Actualizar proyecto
DELETE /api/v1/projects/{id}       # Eliminar proyecto
```

Ver documentación completa en: `http://localhost:8000/docs`

## 🌐 Deployment

### Stack Recomendado:
- **Dominio**: Cloudflare (DNS + CDN)
- **Frontend**: Vercel
- **Backend**: Railway
- **Base de Datos**: Supabase (PostgreSQL)

**Costo estimado**: ~$5/mes

Ver [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para instrucciones detalladas.

## 🔒 Seguridad

- Autenticación JWT
- Sistema de roles y permisos
- Validación con Pydantic
- CORS configurado
- Protección contra CSRF
- Sanitización de inputs
- Rate limiting (producción)

## 🛡️ Variables de Entorno Importantes

### Backend (`backend/.env`)
```env
# Super Admin (CAMBIAR EN PRODUCCIÓN)
SUPER_ADMIN_EMAIL=admin@portfolio.com
SUPER_ADMIN_PASSWORD=changeme123
SUPER_ADMIN_NAME=Super Admin

# Seguridad
SECRET_KEY=tu-secret-key-super-seguro-64-caracteres
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# CORS
ALLOWED_ORIGINS=["http://localhost:3000"]
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 Testing

```bash
# Backend
cd backend
pipenv run pytest

# Frontend
cd frontend
npm test
```

## 📝 Próximos Pasos

1. Configurar variables de entorno en `backend/.env`
2. Crear super admin desde `/admin/setup`
3. Crear usuarios adicionales con diferentes roles
4. Agregar proyectos con demos interactivos
5. Personalizar tu perfil y CV
6. Deploy a producción

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ usando Next.js y FastAPI**