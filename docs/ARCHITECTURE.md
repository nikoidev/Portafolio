# 🏗️ Arquitectura del Sistema - Portfolio CMS

## 📊 Diagrama de Arquitectura en Capas

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (Next.js 14 + React + TypeScript)                                         │
│ Next.js SSR/SSG  │  React Components  │  Zustand Store  │  API Client  │  Hooks   │
└─────────────────────────────────┬──────────────────────────────────────────────────┘
                                  │ HTTP/REST API (JWT Auth)
┌─────────────────────────────────▼──────────────────────────────────────────────────┐
│ API LAYER (FastAPI - v1)                                                            │
│ /auth  │  /projects  │  /cms  │  /cv  │  /settings  │  /users  │  /uploads        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ MIDDLEWARE: CORS Handler │ JWT Validation │ Error Handler │ Rate Limiting          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ SERVICE LAYER (Business Logic)                                                      │
│ AuthService │ ProjectService │ CMSService │ UploadService │ SettingsService         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ORM LAYER (SQLAlchemy Models)                                                       │
│ User │ Role │ Permission │ Project │ PageContent │ CV │ Settings │ Analytics        │
└─────────────────────────────────┬──────────────────────────────────────────────────┘
                                  │ SQL Queries
┌─────────────────────────────────▼──────────────────────────────────────────────────┐
│ DATABASE (PostgreSQL - Supabase)                                                    │
│ users │ roles │ projects │ page_content │ cv │ settings │ analytics                 │
│ 🔒 Row Level Security (RLS) Enabled  │  Alembic Migrations (Version Control)       │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│ STORAGE (Railway Persistent Volume)                                                 │
│ /uploads/images/  │  /uploads/files/  │  /uploads/projects/  │  /uploads/temp/     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Flujo de Autenticación

```
Cliente                                Backend
   │                                      │
   │  1. POST /api/v1/auth/login         │
   │     {email, password}               │
   ├────────────────────────────────────>│
   │                                      │ 2. Validate (bcrypt)
   │                                      │
   │  3. {access_token, user}            │
   │<────────────────────────────────────┤
   │                                      │
   │  4. Store in Zustand + localStorage │
   │                                      │
   │  5. GET /api/v1/projects            │
   │     Authorization: Bearer <token>   │
   ├────────────────────────────────────>│
   │                                      │ 6. Validate JWT + perms
   │                                      │
   │  7. Projects data                   │
   │<────────────────────────────────────┤
```

---

## 🛡️ Sistema de Permisos

```
┌────────────────────────────────────────────────────────┐
│  ADMIN: view, edit, delete, manage_users, settings    │
│  EDITOR: view, edit (no delete, no users)             │
│  VIEWER: view only                                     │
│                                                        │
│  Implementación: @requires_permission("edit_content") │
│  Relaciones: User ←→ Role ←→ Permission               │
└────────────────────────────────────────────────────────┘
```

---

## 📦 Estructura de Directorios

```
backend/
├── app/
│   ├── api/v1/              # Endpoints (auth, projects, cms, cv, settings, users)
│   ├── core/                # Config, database, security, deps
│   ├── models/              # SQLAlchemy models (user, project, cv, page_content)
│   ├── schemas/             # Pydantic schemas (validation)
│   ├── services/            # Business logic
│   └── main.py              # FastAPI app
├── alembic/                 # Database migrations
├── uploads/                 # Persistent storage
├── Dockerfile
├── Pipfile
└── railway.toml             # Railway config
```

---

## 🔄 Flujo de Datos CMS (Ejemplo)

```
1. Click "Edit Section" → 2. SectionEditor opens modal
   ↓
3. GET /api/v1/cms/home/hero (fetch current content)
   ↓
4. User modifies content → 5. Click "Save"
   ↓
6. PUT /api/v1/cms/home/hero {content, styles}
   ↓
7. Backend validates JWT + @requires_permission("edit_content")
   ↓
8. cms_service.py updates database → 9. Return updated data
   ↓
10. Frontend updates cache + re-renders (no deployment needed)
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
