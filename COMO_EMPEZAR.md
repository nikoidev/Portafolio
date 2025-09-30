# 🎯 CÓMO EMPEZAR - 3 PASOS SIMPLES

## 1️⃣ Levantar el Proyecto (2 minutos)

### Terminal 1 - Backend
```bash
cd backend
pipenv shell
pipenv run dev
```
✅ Debería decir: `Uvicorn running on http://127.0.0.1:8000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Debería decir: `Local: http://localhost:3000`

---

## 2️⃣ Crear Usuario Admin (SOLO PRIMERA VEZ)

### Abrir en el navegador:
```
http://localhost:3000/admin/setup
```

### Click en:
```
"Crear Usuario Administrador"
```

### Espera unos segundos y listo! ✅

---

## 3️⃣ Iniciar Sesión

### Abrir en el navegador:
```
http://localhost:3000/admin/login
```

### Ingresar:
```
Email: admin@portfolio.com
Contraseña: admin123
```

### Click en "Iniciar Sesión"

---

## ✅ ¡Ya Estás Dentro!

Ahora verás el Dashboard del Admin. Desde ahí puedes:

### 📦 Gestionar Proyectos
```
Click en "Proyectos" en el menú
→ Click en "Nuevo Proyecto"
→ Completa el formulario
→ Sube imágenes
→ ¡Guarda!
```

### Campos Importantes:
- **Título**: Nombre del proyecto
- **Descripción**: Qué hace tu proyecto
- **Tecnologías**: Next.js, FastAPI, etc (separadas por comas)
- **URL del Demo**: https://tu-proyecto.vercel.app
- **Tipo de Demo**: 
  - ⭐ **Iframe (Interactivo)** ← PARA TU ALMACÉN
  - Enlace Externo
  - Video
  - Solo Imágenes

### ☑️ Importante:
- Marca **"Publicado"** para que se vea en el sitio público
- Marca **"Destacado"** para que aparezca en el inicio

---

## 🎬 Ver el Demo en Acción

1. Abre: `http://localhost:3000/projects`
2. Busca tu proyecto
3. Click en **"Ver Demo"**
4. ¡Se abre un modal con tu proyecto funcionando! 🎉

---

## 📱 Rutas Principales

### Para ti (Admin):
```
http://localhost:3000/admin/login    → Login
http://localhost:3000/admin          → Dashboard
http://localhost:3000/admin/projects → Gestionar proyectos
http://localhost:3000/admin/uploads  → Subir imágenes
http://localhost:3000/admin/cv       → Editor de CV
```

### Para reclutadores (Público):
```
http://localhost:3000                → Inicio
http://localhost:3000/projects       → Tus proyectos
http://localhost:3000/about          → Sobre ti
http://localhost:3000/contact        → Contacto
```

---

## 🆘 Problemas Comunes

### "No puedo crear el usuario"
→ Probablemente ya existe, ve directo al login

### "Error al iniciar sesión"
→ Verifica que el backend esté corriendo (Terminal 1)

### "No veo mis proyectos en el sitio público"
→ Asegúrate de marcar "Publicado" al crear el proyecto

---

## 📚 Documentación Completa

- **[Inicio Rápido Detallado](docs/INICIO_RAPIDO.md)** - Guía completa paso a paso
- **[Sistema de Demos](docs/DEMO_SYSTEM.md)** - Cómo funcionan los demos
- **[Deployment](docs/RAILWAY_DEPLOYMENT.md)** - Subir a producción

---

## 🎯 Ejemplo Rápido: Crear Proyecto de Almacén

```
1. Admin → Proyectos → Nuevo Proyecto

2. Llenar:
   Título: Sistema de Gestión de Almacén
   Descripción: Sistema completo para control de inventario
   Tecnologías: Next.js, FastAPI, PostgreSQL, Tailwind CSS
   URL del Demo: https://almacen-app.vercel.app
   Tipo de Demo: Iframe (Interactivo) ⭐
   
3. Subir imágenes: (Click en el selector, sube 3-5 capturas)

4. Marcar:
   ☑️ Publicado
   ☑️ Destacado
   
5. Guardar

6. Ver en: http://localhost:3000/projects
   Click en "Ver Demo"
   ¡Tu sistema se abre en el modal! 🚀
```

---

## 💡 Tip Pro

Cuando subes imágenes en `/admin/uploads`, quedan disponibles automáticamente en el selector de imágenes. ¡No necesitas copiar URLs manualmente!

---

¡Eso es todo! Ya puedes gestionar tu portafolio como un profesional 🎉
