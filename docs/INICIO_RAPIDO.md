# 🚀 Inicio Rápido - CRUD de Proyectos

## Paso 1: Levantar el Backend y Frontend

### Terminal 1: Backend
```bash
cd backend
pipenv shell
pipenv run dev

# Debería mostrar:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Application startup complete
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev

# Debería mostrar:
# ▲ Next.js 14.x.x
# - Local:        http://localhost:3000
# - Network:      http://192.168.x.x:3000
```

---

## Paso 2: Configuración Inicial (Solo Primera Vez)

### Opción A: Usando la Interfaz Web (Recomendado)

1. **Ir a Setup**
   ```
   http://localhost:3000/admin/setup
   ```

2. **Crear Usuario Administrador**
   - Verás una página que dice "Configuración Inicial"
   - Click en el botón: **"Crear Usuario Administrador"**
   - Espera unos segundos
   - Te redirigirá automáticamente al login

3. **Credenciales creadas**:
   ```
   Email: admin@portfolio.com
   Contraseña: admin123
   ```

### Opción B: Usando la API (Alternativa)

```bash
# Desde cualquier terminal
curl -X POST http://localhost:8000/api/v1/auth/create-admin

# Respuesta esperada:
{
  "id": 1,
  "email": "admin@portfolio.com",
  "name": "Admin",
  "is_admin": true
}
```

---

## Paso 3: Iniciar Sesión

1. **Ir al Login**
   ```
   http://localhost:3000/admin/login
   ```

2. **Ingresar Credenciales**
   ```
   Email: admin@portfolio.com
   Contraseña: admin123
   ```

3. **Click en "Iniciar Sesión"**
   
4. **¡Listo!** Serás redirigido al Dashboard: `http://localhost:3000/admin`

---

## Paso 4: Usar el CRUD de Proyectos

### Ver Lista de Proyectos

```
http://localhost:3000/admin/projects
```

Verás:
- Lista de todos tus proyectos
- Botones: Nuevo Proyecto, Editar, Eliminar
- Estadísticas

---

### Crear Nuevo Proyecto

1. **Click en "Nuevo Proyecto"**

2. **Completar el Formulario**:

   **Información Básica**:
   ```
   Título: Sistema de Gestión de Almacén
   Slug: (se genera automáticamente, o personalizar: "sistema-almacen")
   Descripción Corta: Sistema completo para control de inventario
   Tecnologías: Next.js, FastAPI, PostgreSQL, Tailwind CSS
   Etiquetas: web, fullstack, erp
   ```

   **URLs**:
   ```
   URL de GitHub: https://github.com/tu-usuario/almacen-app
   URL del Demo: https://almacen-app.vercel.app
   Tipo de Demo: Iframe (Interactivo)  ⭐
   ```

   **Imágenes**:
   - Click en "Seleccionar Imágenes del Proyecto"
   - Sube 3-5 capturas de pantalla
   - La primera será la imagen principal

   **Configuración**:
   - ☑️ Publicado (para que sea visible en el sitio público)
   - ☑️ Destacado (opcional, aparece en el inicio)
   - Orden: 0 (mientras menor, más arriba aparece)

   **Descripción Completa**:
   ```
   Sistema completo de gestión de almacén que incluye:
   
   - Control de inventario en tiempo real
   - Gestión de proveedores y clientes
   - Registro de entradas y salidas
   - Reportes y estadísticas
   - Control de usuarios y permisos
   - Alertas de stock bajo
   
   Desarrollado con arquitectura moderna, separando frontend y backend
   para máxima escalabilidad.
   ```

   **Contenido Detallado** (opcional, markdown):
   ```markdown
   ## Características Principales
   
   - 📦 Control de inventario
   - 👥 Gestión de usuarios
   - 📊 Dashboard con métricas
   - 🔔 Notificaciones automáticas
   
   ## Tecnologías
   
   - **Frontend**: Next.js 14, TypeScript, Tailwind CSS
   - **Backend**: FastAPI, SQLAlchemy, PostgreSQL
   - **Deploy**: Vercel + Railway
   ```

3. **Click en "Crear Proyecto"**

4. **¡Listo!** Serás redirigido a la lista de proyectos

---

### Editar Proyecto

1. En la lista de proyectos, click en **"Editar"** (icono de lápiz)
2. Modifica los campos que necesites
3. Click en **"Actualizar"**

---

### Eliminar Proyecto

1. En la lista de proyectos, click en **"Eliminar"** (icono de basura)
2. Confirma la eliminación
3. El proyecto se eliminará permanentemente

---

### Ver Proyecto en el Sitio Público

1. En la lista de proyectos, click en **"Ver"** (icono de ojo)
2. Te lleva a la página pública del proyecto
3. Verás cómo lo ven los reclutadores

---

## Paso 5: Probar el Demo Interactivo

1. **Ve al sitio público**:
   ```
   http://localhost:3000/projects
   ```

2. **Busca tu proyecto** (ej: "Sistema de Gestión de Almacén")

3. **Click en "Ver Demo"**
   - Se abre un modal full-screen
   - Tu proyecto carga en un iframe
   - Puedes navegar, interactuar, probar funcionalidades

4. **Controles disponibles**:
   - 🔄 **Reiniciar**: Recarga el iframe
   - 🔗 **Abrir en nueva pestaña**: Abre el proyecto completo
   - ⛶ **Pantalla completa**: Maximiza el modal
   - ❌ **Cerrar**: Cierra el modal

---

## Gestión de Archivos

### Subir Imágenes

1. **Ir a Archivos**:
   ```
   http://localhost:3000/admin/uploads
   ```

2. **Drag & Drop o Click para seleccionar**
   - Formatos soportados: JPG, PNG, GIF, WebP
   - Tamaño máximo: 5MB por imagen
   - Se suben a: `backend/uploads/images/`

3. **Copiar URL** de la imagen
   - Click en "Copiar URL"
   - Pegar en el formulario de proyecto

---

## Otras Funcionalidades del Panel Admin

### Dashboard
```
http://localhost:3000/admin
```
Muestra:
- Total de proyectos
- Proyectos publicados
- Proyectos destacados
- Vistas totales

### CV
```
http://localhost:3000/admin/cv
```
- Editor de CV
- Generación de PDF
- Vista previa

### Cerrar Sesión

En cualquier página del admin:
1. Click en tu nombre (arriba a la derecha)
2. Click en **"Cerrar Sesión"**

---

## Rutas Principales

### Públicas (Sin Login)
```
http://localhost:3000              → Inicio
http://localhost:3000/projects     → Lista de proyectos
http://localhost:3000/projects/[slug] → Detalle de proyecto
http://localhost:3000/about        → Sobre mí
http://localhost:3000/contact      → Contacto
```

### Admin (Requiere Login)
```
http://localhost:3000/admin/login     → Login
http://localhost:3000/admin/setup     → Configuración inicial
http://localhost:3000/admin           → Dashboard
http://localhost:3000/admin/projects  → CRUD de proyectos
http://localhost:3000/admin/cv        → Editor de CV
http://localhost:3000/admin/uploads   → Gestión de archivos
```

---

## Credenciales por Defecto

```
Email: admin@portfolio.com
Contraseña: admin123
```

⚠️ **IMPORTANTE**: Cambia estas credenciales antes de subir a producción!

---

## Cambiar Contraseña (Próximamente)

Por ahora, puedes cambiarla directamente en la base de datos:

```bash
# Entrar al shell de Python
cd backend
pipenv shell
python

# Ejecutar:
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
user = db.query(User).filter(User.email == "admin@portfolio.com").first()
user.hashed_password = get_password_hash("tu_nueva_contraseña")
db.commit()
print("Contraseña actualizada!")
```

---

## Troubleshooting

### No puedo acceder al admin

**Problema**: Error al cargar `/admin/login`

**Soluciones**:
1. Verifica que el backend esté corriendo (`http://localhost:8000/docs`)
2. Verifica que el frontend esté corriendo (`http://localhost:3000`)
3. Revisa la consola del navegador (F12)

---

### Error al crear usuario administrador

**Problema**: "El usuario administrador ya existe"

**Solución**: El usuario ya fue creado, ve directamente a login.

---

### Error de autenticación

**Problema**: "Email o contraseña incorrectos"

**Soluciones**:
1. Verifica las credenciales:
   - Email: `admin@portfolio.com`
   - Contraseña: `adminpassword`
2. Asegúrate de haber creado el usuario (Paso 2)
3. Limpia el caché del navegador

---

### Las imágenes no cargan

**Problema**: Imágenes rotas en los proyectos

**Soluciones**:
1. Verifica que las URLs sean correctas
2. Sube las imágenes a `/admin/uploads`
3. Usa URLs completas (con http:// o https://)

---

## Ejemplo Completo: Crear Tu Primer Proyecto

### 1. Prepara tus Recursos

```bash
# Capturas de pantalla de tu proyecto
- captura-inicio.png
- captura-dashboard.png
- captura-lista.png
- captura-formulario.png
```

### 2. Sube las Imágenes

1. Ve a: `http://localhost:3000/admin/uploads`
2. Arrastra las 4 imágenes
3. Espera a que se suban
4. NO necesitas copiar URLs (el selector las encuentra automáticamente)

### 3. Crea el Proyecto

1. Ve a: `http://localhost:3000/admin/projects`
2. Click en **"Nuevo Proyecto"**
3. Completa:
   ```
   Título: Mi Sistema de Almacén
   Descripción: Sistema completo para gestión de inventario...
   Tecnologías: Next.js, FastAPI, PostgreSQL
   URL del Demo: https://tu-proyecto.vercel.app
   Tipo de Demo: Iframe (Interactivo)
   ```
4. En "Imágenes del Proyecto":
   - Click en el selector
   - Verás tus imágenes subidas
   - Selecciona las 4 (máximo 5)
5. Marca:
   - ☑️ Publicado
   - ☑️ Destacado (opcional)
6. Click en **"Crear Proyecto"**

### 4. Verifica

1. Ve a: `http://localhost:3000/projects`
2. Verás tu proyecto en la lista
3. Click en **"Ver Demo"**
4. ¡Tu proyecto se abre en el modal! 🎉

---

## Próximos Pasos

Una vez que domines el CRUD:

1. ✅ Crea 3-5 proyectos de prueba
2. ✅ Prueba el sistema de demos
3. ✅ Completa tu perfil en "Sobre mí"
4. ✅ Personaliza los enlaces sociales
5. ✅ Sube tu CV
6. ✅ ¡Despliega a producción!

---

## ¿Necesitas Ayuda?

- 📚 [Sistema de Demos](./DEMO_SYSTEM.md)
- 🚂 [Deployment Railway](./RAILWAY_DEPLOYMENT.md)
- 📖 [Documentación Completa](./DEPLOYMENT.md)

---

¡Listo! Ya puedes administrar tus proyectos como un pro 🚀
