# 🔐 Sistema de Usuarios, Roles y Permisos

## 📋 Resumen de la Implementación

He implementado un **sistema completo de gestión de usuarios con roles y permisos** para tu portafolio:

### ✅ Lo Implementado

1. **Sistema de Roles** (4 niveles):
   - `SUPER_ADMIN`: Control total del sistema
   - `ADMIN`: Gestión completa (proyectos, CV, usuarios)
   - `EDITOR`: Solo edición de contenido (proyectos, CV)
   - `VIEWER`: Solo lectura

2. **Sistema de Permisos Granulares**:
   - Permisos de usuarios (CREATE_USER, READ_USER, UPDATE_USER, DELETE_USER, MANAGE_ROLES)
   - Permisos de proyectos (CREATE_PROJECT, READ_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, PUBLISH_PROJECT)
   - Permisos de CV, archivos, analytics y configuración

3. **CRUD Completo de Usuarios**:
   - Crear usuarios con diferentes roles
   - Editar usuarios y cambiar roles
   - Eliminar usuarios (con protecciones)
   - Listar usuarios con sus permisos

4. **Protecciones de Seguridad**:
   - Solo SUPER_ADMIN puede crear otros SUPER_ADMIN
   - Solo ADMIN+ puede crear ADMIN
   - No se puede eliminar a sí mismo
   - No se puede modificar el propio rol
   - No se pueden eliminar SUPER_ADMIN

5. **Credenciales desde .env**:
   - Super Admin se crea desde variables de entorno
   - Email, contraseña y nombre configurables
   - Compatible con variables antiguas (ADMIN_*)

---

## 🚀 Instrucciones de Uso

### Paso 1: Configurar Variables de Entorno

Edita tu archivo `backend/.env` (o créalo desde `backend/env.example`):

```env
# Super Admin (Credenciales desde .env)
SUPER_ADMIN_EMAIL=tu-email@ejemplo.com
SUPER_ADMIN_PASSWORD=tu-contraseña-super-segura
SUPER_ADMIN_NAME=Tu Nombre
```

**IMPORTANTE**: Usa credenciales seguras en producción.

### Paso 2: Migrar la Base de Datos

```bash
# Asegúrate de que PostgreSQL esté corriendo
# Si usas Docker:
docker-compose -f docker/docker-compose.dev.yml up -d postgres

# Aplicar migración
cd backend
pipenv shell
pipenv run alembic upgrade head
```

### Paso 3: Crear Super Admin

#### Opción A: Desde el frontend (Recomendado)
```
1. Abre: http://localhost:3000/admin/setup
2. Click en "Crear Super Administrador"
3. Login con las credenciales del .env
```

#### Opción B: Desde la API
```bash
curl -X POST http://localhost:8000/api/v1/auth/create-super-admin
```

### Paso 4: Iniciar Sesión

```
1. http://localhost:3000/admin/login
2. Email: el que pusiste en SUPER_ADMIN_EMAIL
3. Password: el que pusiste en SUPER_ADMIN_PASSWORD
```

---

## 📊 Estructura de Roles y Permisos

### SUPER_ADMIN (Control Total)
```
✅ Todos los permisos del sistema
✅ Crear/editar/eliminar usuarios
✅ Asignar cualquier rol (incluso SUPER_ADMIN)
✅ Gestionar configuración del sistema
✅ No puede ser eliminado
```

### ADMIN (Gestión Completa)
```
✅ Crear/editar usuarios (excepto SUPER_ADMIN)
✅ Asignar roles (excepto SUPER_ADMIN)
✅ CRUD completo de proyectos
✅ Editar CV y generar PDF
✅ Gestionar archivos
✅ Ver analytics
❌ No puede crear otros SUPER_ADMIN
❌ No puede modificar SUPER_ADMIN
```

### EDITOR (Solo Contenido)
```
✅ Ver usuarios
✅ CRUD de proyectos
✅ Editar CV y generar PDF
✅ Subir archivos
❌ No puede gestionar usuarios
❌ No puede eliminar proyectos
❌ No puede cambiar permisos
```

### VIEWER (Solo Lectura)
```
✅ Ver usuarios
✅ Ver proyectos
✅ Ver analytics
❌ No puede editar nada
❌ Solo lectura
```

---

## 🔌 Endpoints de la API

### Autenticación
```http
POST /api/v1/auth/login
POST /api/v1/auth/create-super-admin
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

### Gestión de Usuarios (Nuevos)
```http
GET    /api/v1/users/               # Listar usuarios
GET    /api/v1/users/me             # Usuario actual con permisos
GET    /api/v1/users/{id}           # Obtener usuario
POST   /api/v1/users/               # Crear usuario
PUT    /api/v1/users/{id}           # Actualizar usuario
DELETE /api/v1/users/{id}           # Eliminar usuario
GET    /api/v1/users/roles/available  # Roles disponibles
POST   /api/v1/users/check-permission # Verificar permiso
```

### Proyectos (Ahora con permisos)
```http
GET    /api/v1/projects/            # Ver proyectos (READ_PROJECT)
POST   /api/v1/projects/            # Crear proyecto (CREATE_PROJECT)
PUT    /api/v1/projects/{id}        # Editar proyecto (UPDATE_PROJECT)
DELETE /api/v1/projects/{id}        # Eliminar proyecto (DELETE_PROJECT)
```

---

## 💻 Ejemplo de Uso en el Frontend

### Verificar Permisos
```typescript
// En cualquier componente
import { useAuthStore } from '@/store/auth';

const { user } = useAuthStore();

// Verificar si puede crear usuarios
if (user?.permissions?.includes('create_user')) {
  // Mostrar botón "Crear Usuario"
}

// Verificar si es admin
if (user?.role === 'super_admin' || user?.role === 'admin') {
  // Mostrar panel de administración avanzado
}
```

### Crear Usuario
```typescript
const createUser = async (userData) => {
  try {
    const response = await api.post('/users/', {
      email: 'nuevo@ejemplo.com',
      name: 'Nuevo Usuario',
      password: 'password123',
      role: 'editor' // o 'admin', 'viewer'
    });
    
    console.log('Usuario creado:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎨 Frontend - Próximos Pasos

### Necesitas crear estas páginas:

1. **Página de Gestión de Usuarios**
   ```
   frontend/src/app/admin/users/page.tsx
   ```
   - Lista de todos los usuarios
   - Botón "Crear Usuario"
   - Editar/Eliminar usuarios
   - Filtrar por rol

2. **Componentes**
   ```
   frontend/src/components/admin/UserForm.tsx     # Formulario crear/editar
   frontend/src/components/admin/UserList.tsx     # Lista de usuarios
   frontend/src/components/admin/UserCard.tsx     # Tarjeta de usuario
   frontend/src/components/admin/RoleSelect.tsx   # Selector de roles
   ```

3. **Actualizar Store de Auth**
   ```typescript
   // frontend/src/store/auth.ts
   interface User {
     id: number;
     email: string;
     name: string;
     role: 'super_admin' | 'admin' | 'editor' | 'viewer';
     permissions: string[];
     is_active: boolean;
   }
   ```

---

## 🔒 Migración de Usuarios Existentes

Si ya tenías usuarios en la base de datos:

```sql
-- Los usuarios con is_admin=true → se convierten en SUPER_ADMIN
-- Los usuarios con is_admin=false → se convierten en EDITOR

-- Verificar:
SELECT id, email, name, role, is_admin, is_active FROM users;
```

---

## 📝 Archivos Modificados/Creados

### Backend
```
✅ backend/app/models/enums.py (NUEVO)
✅ backend/app/models/user.py (ACTUALIZADO con roles)
✅ backend/app/schemas/user.py (ACTUALIZADO con roles)
✅ backend/app/services/auth_service.py (ACTUALIZADO)
✅ backend/app/core/deps.py (ACTUALIZADO con permisos)
✅ backend/app/core/config.py (ACTUALIZADO - super admin desde .env)
✅ backend/app/api/v1/users.py (NUEVO - CRUD usuarios)
✅ backend/app/api/v1/auth.py (ACTUALIZADO)
✅ backend/app/api/v1/__init__.py (ACTUALIZADO)
✅ backend/alembic/versions/add_user_roles_permissions.py (NUEVO)
✅ backend/env.example (ACTUALIZADO)
```

### Frontend (Por Implementar)
```
⏳ frontend/src/app/admin/users/page.tsx
⏳ frontend/src/components/admin/UserForm.tsx
⏳ frontend/src/components/admin/UserList.tsx
⏳ frontend/src/store/auth.ts (actualizar interface)
```

---

## 🧪 Testing

### Probar el Sistema

```bash
# 1. Crear super admin
curl -X POST http://localhost:8000/api/v1/auth/create-super-admin

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=tu-email@ejemplo.com&password=tu-contraseña"

# 3. Obtener info del usuario (con token)
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer {tu-token}"

# 4. Crear usuario nuevo
curl -X POST http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer {tu-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "editor@ejemplo.com",
    "name": "Editor Usuario",
    "password": "password123",
    "role": "editor"
  }'

# 5. Listar usuarios
curl -X GET http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer {tu-token}"
```

---

## 🚨 Errores Comunes

### "Extra inputs are not permitted"
→ Tienes variables `ADMIN_*` viejas en tu `.env`
→ Cámbialas a `SUPER_ADMIN_*` o el código las usa automáticamente

### "Connection refused"  
→ PostgreSQL no está corriendo
→ Ejecuta: `docker-compose -f docker/docker-compose.dev.yml up -d postgres`

### "El usuario super administrador ya existe"
→ Ya creaste el super admin, ve directo al login

### "No tienes permisos"
→ El usuario no tiene el rol/permiso necesario
→ Verifica el rol en `/api/v1/users/me`

---

## 📚 Documentación de la API

Cuando el backend esté corriendo:

```
http://localhost:8000/docs      # Swagger UI
http://localhost:8000/redoc      # ReDoc
```

Ahí verás todos los endpoints con sus permisos requeridos.

---

## 🎯 Resumen Ejecutivo

**Lo que tienes ahora**:
- ✅ Sistema completo de roles y permisos
- ✅ CRUD de usuarios con validaciones
- ✅ Super Admin desde .env (seguro)
- ✅ API REST completa con autorizaciones
- ✅ Migraciones de base de datos
- ✅ Protecciones de seguridad

**Lo que falta (Frontend)**:
- ⏳ Página de gestión de usuarios en el admin
- ⏳ Componentes de formularios
- ⏳ Actualizar el store de autenticación
- ⏳ Interfaz para asignar roles

**Próximos pasos**:
1. Configura tu `.env` con credenciales seguras
2. Migra la base de datos
3. Crea el super admin
4. Implementa la UI de gestión de usuarios (puedo ayudarte con esto)

---

¿Quieres que te ayude a implementar el frontend para la gestión de usuarios?
