# 🏗️ Arquitectura del Sistema - Portfolio CMS
## 📊 Diagrama General
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Next.js    │  │  React SPA   │  │   Zustand    │               │
│  │  (Frontend)  │  │  Components  │  │    Store     │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
│         │                 │                  │                      │
│         └─────────────────┴──────────────────┘                      │
│                           │                                         │
│                     HTTP/REST API                                   │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     API Layer (v1)                          │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │    │
│  │  │  Auth  │ │Projects│ │  CMS   │ │  CV    │ │Settings│     │    │
│  │  │Endpoint│ │Endpoint│ │Endpoint│ │Endpoint│ │Endpoint│     │    │
│  │  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘     │    │
│  └──────┼──────────┼──────────┼──────────┼──────────┼──────────┘    │
│         │          │          │          │          │               │
│         ▼          ▼          ▼          ▼          ▼               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   Middleware Layer                           │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐              │   │
│  │  │    CORS    │  │ JWT Auth   │  │   Error    │              │   │
│  │  │  Handler   │  │ Validation │  │  Handler   │              │   │
│  │  └────────────┘  └────────────┘  └────────────┘              │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                             │                                       │
│                             ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Service Layer                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │  │   Auth   │ │ Project  │ │   CMS    │ │  Upload  │         │   │
│  │  │  Service │ │  Service │ │  Service │ │  Service │         │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘         │   │
│  └───────┼────────────┼────────────┼────────────┼───────────────┘   │
│          │            │            │            │                   │
│          ▼            ▼            ▼            ▼                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   ORM Layer (SQLAlchemy)                     │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │   │
│  │  │ User │ │Projec│ │ Page │ │  CV  │ │Settin│ │Upload│       │   │
│  │  │Model │ │ Model│ │Conten│ │Model │ │ Model│ │ Model│       │   │
│  │  └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘       │   │
│  └──────┼────────┼────────┼────────┼────────┼────────┼──────────┘   │
└─────────┼────────┼────────┼────────┼────────┼────────┼──────────────┘
          │        │        │        │        │        │
          ▼        ▼        ▼        ▼        ▼        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL (Supabase)                           │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │   │
│  │  │ users  │ │projects│ │  page_ │ │   cv   │ │settings│      │   │
│  │  │        │ │        │ │ content│ │        │ │        │      │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘      │   │
│  │                                                              │   │
│  │   Row Level Security (RLS) Enabled                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Alembic Migrations                              │   │
│  │  Version control para esquema de base de datos               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                                    │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │         Railway Persistent Volume (/uploads)                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                      │   │
│  │  │  images/ │ │  files/  │ │ projects/│                      │   │
│  │  └──────────┘ └──────────┘ └──────────┘                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Flujo de Autenticación

```
┌──────────┐                                                    ┌──────────┐
│  Client  │                                                    │ Backend  │
└────┬─────┘                                                    └────┬─────┘
     │                                                               │
     │  1. POST /api/v1/auth/login                                   │
     │    { email, password }                                        │
     ├──────────────────────────────────────────────────────────────►│
     │                                                               │
     │                     2. Validate credentials                   │
     │                        (bcrypt hash check)                    │
     │                                                               │
     │  3. JWT Token + User Data                                     │
     │     { access_token, user: {id, email, role} }                 │
     │◄──────────────────────────────────────────────────────────────┤
     │                                                               │
     │  4. Store token in Zustand + localStorage                     │
     │                                                               │
     │  5. GET /api/v1/projects                                      │
     │     Authorization: Bearer <JWT_TOKEN>                         │
     ├──────────────────────────────────────────────────────────────►│
     │                                                               │
     │                     6. Validate JWT token                     │
     │                        Extract user from token                │
     │                        Check permissions                      │
     │                                                               │
     │  7. Projects data                                             │
     │◄──────────────────────────────────────────────────────────────┤
     │                                                               │
```

---

## 🛡️ Sistema de Permisos

```
┌────────────────────────────────────────────────────────────┐
│                   Permission System                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Role: ADMIN                                                │
│  ├─ view_content         ✅                                 │
│  ├─ edit_content         ✅                                 │
│  ├─ delete_content       ✅                                 │
│  ├─ manage_users         ✅                                 │
│  └─ manage_settings      ✅                                 │
│                                                             │
│  Role: EDITOR                                               │
│  ├─ view_content         ✅                                 │
│  ├─ edit_content         ✅                                 │
│  ├─ delete_content       ❌                                 │
│  ├─ manage_users         ❌                                 │
│  └─ manage_settings      ❌                                 │
│                                                             │
│  Role: VIEWER                                               │
│  ├─ view_content         ✅                                 │
│  ├─ edit_content         ❌                                 │
│  ├─ delete_content       ❌                                 │
│  ├─ manage_users         ❌                                 │
│  └─ manage_settings      ❌                                 │
│                                                             │
└────────────────────────────────────────────────────────────┘

Implementación:
- Decorador @requires_permission("edit_content")
- Validación a nivel de endpoint
- Cascade en relaciones User ←→ Role ←→ Permission
```

---

## 📦 Estructura de Directorios

```
backend/
├── app/
│   ├── api/
│   │   └── v1/              # Endpoints versionados
│   │       ├── auth.py      # Login, registro, refresh
│   │       ├── projects.py  # CRUD de proyectos
│   │       ├── cms.py       # Gestión de contenido
│   │       ├── cv.py        # Subida/descarga CV
│   │       ├── settings.py  # Configuración del sitio
│   │       └── users.py     # Gestión de usuarios
│   │
│   ├── core/
│   │   ├── config.py        # Variables de entorno
│   │   ├── database.py      # Conexión a PostgreSQL
│   │   ├── security.py      # JWT, bcrypt, permisos
│   │   └── deps.py          # Dependencias inyectables
│   │
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py          # User, Role, Permission
│   │   ├── project.py       # Project, Technology
│   │   ├── cv.py            # CV storage
│   │   └── page_content.py  # CMS content
│   │
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py          # UserCreate, UserResponse
│   │   ├── project.py       # ProjectCreate, ProjectUpdate
│   │   └── cms.py           # SectionCreate, SectionUpdate
│   │
│   ├── services/            # Business logic
│   │   ├── auth_service.py  # Authentication logic
│   │   ├── project_service.py
│   │   ├── cms_service.py
│   │   └── upload_service.py
│   │
│   └── main.py              # FastAPI app initialization
│
├── alembic/                 # Database migrations
│   └── versions/            # Migration files
│
├── uploads/                 # Persistent storage
│   ├── images/
│   ├── files/
│   └── projects/
│
├── Dockerfile
├── Pipfile
└── railway.toml             # Railway deployment config
```

---

## 🔄 Flujo de Datos (CMS Example)

```
1. User clicks "Edit Section" (Frontend)
   ↓
2. SectionEditor.tsx opens modal
   ↓
3. Fetch current content: GET /api/v1/cms/home/hero
   ↓
4. User modifies content in visual editor
   ↓
5. Click "Save" → PUT /api/v1/cms/home/hero
   {
     "content": { "title": "New Title", ... },
     "styles": { "height": "medium", "spacing": "relaxed" }
   }
   ↓
6. Backend validates JWT + permissions (@requires_permission("edit_content"))
   ↓
7. cms_service.py updates database
   ↓
8. Return updated section data
   ↓
9. Frontend updates cache + triggers re-render
   ↓
10. User sees changes immediately (no deployment needed)
```

---

## 🚀 Tecnologías Clave

| Categoría | Tecnología | Propósito |
|-----------|-----------|-----------|
| **Framework** | FastAPI | API REST de alto rendimiento |
| **ORM** | SQLAlchemy | Abstracción de base de datos |
| **Migraciones** | Alembic | Control de versiones de esquema |
| **Database** | PostgreSQL | Base de datos relacional |
| **Hosting DB** | Supabase | Managed PostgreSQL + RLS |
| **Auth** | JWT + bcrypt | Autenticación segura |
| **Validación** | Pydantic | Schemas y validación de datos |
| **Deployment** | Railway | Platform-as-a-Service |
| **Storage** | Railway Volumes | Almacenamiento persistente |
| **Docs** | OpenAPI/Swagger | Documentación automática |

---

## 📈 Métricas de Rendimiento

- **Tiempo de respuesta promedio**: < 100ms
- **Autenticación JWT**: Token válido por 24h
- **Conexiones DB**: Pool de 20 conexiones
- **Upload máximo**: 50MB por archivo
- **Formato imágenes**: JPEG, PNG, WebP
- **Rate limiting**: 100 requests/minuto por IP

---

## 🔒 Seguridad Implementada

✅ **Autenticación**: JWT con expiración configurable  
✅ **Autorización**: Sistema de roles y permisos granular  
✅ **Passwords**: Hashing con bcrypt (12 rounds)  
✅ **CORS**: Configurado para dominio específico  
✅ **SQL Injection**: Protección via ORM (SQLAlchemy)  
✅ **XSS**: Sanitización de inputs (Pydantic)  
✅ **RLS**: Row Level Security en Supabase  
✅ **HTTPS**: Certificado SSL en producción (Railway)  
✅ **Env vars**: Secrets protegidos en Railway  

---

## 📝 Endpoints Principales

### Auth
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Crear cuenta
- `GET /api/v1/auth/me` - Usuario actual

### Projects
- `GET /api/v1/projects` - Listar proyectos
- `POST /api/v1/projects` - Crear proyecto *(admin)*
- `PUT /api/v1/projects/{id}` - Actualizar *(admin/editor)*
- `DELETE /api/v1/projects/{id}` - Eliminar *(admin)*

### CMS
- `GET /api/v1/cms/{page}` - Obtener secciones de página
- `GET /api/v1/cms/{page}/{section}` - Sección específica
- `PUT /api/v1/cms/{page}/{section}` - Actualizar contenido *(admin/editor)*
- `POST /api/v1/cms/{page}/sections` - Crear sección *(admin)*
- `DELETE /api/v1/cms/{page}/{section}` - Eliminar *(admin)*

### Settings
- `GET /api/v1/settings/public` - Configuración pública
- `PUT /api/v1/settings` - Actualizar configuración *(admin)*

---

## 🎯 Ventajas de esta Arquitectura

1. **Escalable**: Separación clara de responsabilidades
2. **Mantenible**: Código modular y organizado
3. **Testeable**: Servicios independientes y inyección de dependencias
4. **Documentado**: OpenAPI/Swagger automático
5. **Seguro**: Múltiples capas de seguridad
6. **Performante**: Queries optimizados y conexiones pool
7. **Versionado**: Endpoints versionados (/v1/), migraciones Alembic
8. **Type-safe**: Pydantic schemas + Python type hints

