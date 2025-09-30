# 🎬 Sistema de Demos Interactivos

## Descripción

El portafolio incluye un sistema avanzado de demos que permite mostrar tus proyectos en acción directamente desde la web, sin que los reclutadores tengan que salir del sitio.

## Tipos de Demo

### 1. **Iframe (Recomendado)**
- Muestra el proyecto en un modal interactivo
- Los usuarios pueden navegar, hacer clic y probar todas las funcionalidades
- Perfecto para aplicaciones web desplegadas
- **Ejemplo de uso**: Sistema de almacén, Dashboard, E-commerce

```
URL del Demo: https://mi-proyecto.vercel.app
Tipo de Demo: Iframe (Interactivo)
```

### 2. **Enlace Externo**
- Abre el proyecto en una nueva pestaña
- Útil cuando el proyecto no puede mostrarse en iframe
- **Ejemplo de uso**: Proyectos con restricciones CORS

```
URL del Demo: https://mi-proyecto.com
Tipo de Demo: Enlace Externo
```

### 3. **Video**
- Muestra un video demostración del proyecto
- Ideal para proyectos móviles o de escritorio
- **Ejemplo de uso**: Apps móviles, Software de escritorio

```
URL del Demo: https://ejemplo.com/video-demo.mp4
Tipo de Demo: Video
```

### 4. **Solo Imágenes**
- Muestra solo las capturas de pantalla
- Para proyectos que no están desplegados
- **Ejemplo de uso**: Proyectos antiguos, POCs

```
URL del Demo: (vacío o cualquier URL)
Tipo de Demo: Solo Imágenes
```

## Cómo Usar

### 1. Crear un Proyecto

1. Inicia sesión en el panel de administración (`/admin/login`)
2. Ve a **Proyectos** → **Nuevo Proyecto**
3. Completa la información básica:
   - Título del proyecto
   - Descripción
   - Tecnologías utilizadas

### 2. Configurar el Demo

4. En la sección de URLs:
   - **URL del Demo**: Pega la URL de tu proyecto desplegado
   - **Tipo de Demo**: Selecciona el tipo apropiado

#### Ejemplo 1: Sistema de Almacén (Iframe)
```
Título: Sistema de Gestión de Almacén
URL del Demo: https://almacen-app.vercel.app
Tipo de Demo: Iframe (Interactivo)
```

#### Ejemplo 2: App Móvil (Video)
```
Título: App de Delivery
URL del Demo: https://cdn.ejemplo.com/demo-app.mp4
Tipo de Demo: Video
```

### 3. Agregar Imágenes

5. Sube capturas de pantalla del proyecto
6. La primera imagen será la thumbnail principal

### 4. Publicar

7. Marca "Publicado" para que sea visible
8. Opcionalmente marca "Destacado" para aparecer en el inicio
9. Haz clic en **Crear Proyecto**

## Experiencia del Usuario

### En la Lista de Proyectos

Los usuarios verán una tarjeta con:
- Imagen del proyecto
- Título y descripción
- Tecnologías usadas
- Botón **"Ver Demo"** (si está configurado)

### Al Hacer Clic en "Ver Demo"

**Para Iframe:**
- Se abre un modal de pantalla completa
- El proyecto carga en un iframe interactivo
- Controles disponibles:
  - 🔄 Reiniciar: Recarga el iframe
  - 🔗 Abrir en nueva pestaña: Abre el proyecto completo
  - ⛶ Pantalla completa: Maximiza el modal
  - ❌ Cerrar: Cierra el modal

**Para Video:**
- Se abre un modal con el reproductor de video
- Controles de reproducción estándar
- Opción de pantalla completa

**Para Enlace:**
- Abre directamente en una nueva pestaña

## Configuración Técnica

### Seguridad del Iframe

El iframe incluye las siguientes políticas de seguridad:
```html
sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
```

Esto permite:
- ✅ Scripts y funcionalidad normal
- ✅ Formularios y modales
- ✅ Popups necesarios
- ✅ Cookies y localStorage (same-origin)

### Restricciones CORS

Si tu proyecto muestra error al cargarse en iframe, probablemente tiene restricciones CORS. Soluciones:

1. **Agregar headers al proyecto** (Recomendado):
```javascript
// En Next.js (next.config.js)
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'ALLOW-FROM https://tu-portafolio.com' },
      ],
    },
  ]
}
```

2. **Usar "Enlace Externo"** como tipo de demo

### URLs Compatibles

#### ✅ Funcionan bien en Iframe
- Vercel deployments
- Netlify deployments
- Railway apps (si configurado)
- GitHub Pages
- Apps propias con headers correctos

#### ❌ No funcionan en Iframe
- YouTube (usar tipo Video)
- Sitios con X-Frame-Options: DENY
- Algunos servicios de hosting con seguridad estricta

## Ejemplos Completos

### Proyecto de E-commerce

```yaml
Título: "Tienda Online Moderna"
Descripción: "E-commerce completo con carrito de compras, pasarela de pago y panel de administración"
URL del Demo: "https://mi-tienda.vercel.app"
Tipo de Demo: "Iframe (Interactivo)"
Tecnologías: "Next.js, Stripe, PostgreSQL, Tailwind CSS"
Imágenes: 
  - Captura de la página principal
  - Captura del carrito
  - Captura del checkout
  - Captura del dashboard admin
```

### Proyecto Móvil

```yaml
Título: "App de Fitness"
Descripción: "Aplicación móvil para seguimiento de ejercicios y nutrición"
URL del Demo: "https://storage.ejemplo.com/fitness-demo.mp4"
Tipo de Demo: "Video"
Tecnologías: "React Native, Firebase, Redux"
Imágenes:
  - Screenshots de la app
  - Mockups en dispositivos
```

## Mejores Prácticas

### Para Demos en Iframe

1. **Optimiza la carga**: Asegúrate de que tu proyecto carga rápido
2. **Diseño responsive**: El modal se adapta a diferentes tamaños
3. **Manejo de errores**: Implementa fallbacks si algo falla
4. **Datos de prueba**: Pre-carga datos de ejemplo para mejor experiencia

### Para Capturas de Pantalla

1. **Alta calidad**: Usa resolución mínima de 1920x1080
2. **Contexto**: Muestra las funcionalidades principales
3. **Orden lógico**: Primera imagen = vista más importante
4. **Máximo 5 imágenes**: Mantén el foco en lo importante

### Para Descripciones

1. **Problema y solución**: Explica qué problema resuelve
2. **Tecnologías clave**: Destaca las más relevantes
3. **Impacto**: Menciona resultados o métricas si aplica
4. **Call to action**: Invita a probar el demo

## Deployment

### Antes de Subir a Producción

- [ ] Verifica que todos los demos funcionen correctamente
- [ ] Comprueba que las URLs están bien configuradas
- [ ] Revisa que las imágenes cargan correctamente
- [ ] Prueba en diferentes navegadores
- [ ] Verifica el comportamiento responsive

### Variables de Entorno

Asegúrate de configurar en Vercel:
```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
```

## Troubleshooting

### El iframe no carga

**Problema**: Pantalla en blanco en el modal
**Soluciones**:
1. Verifica la URL en el navegador directamente
2. Revisa la consola del navegador (F12) para errores CORS
3. Cambia a tipo "Enlace Externo" temporalmente
4. Configura los headers CORS en tu proyecto

### El video no se reproduce

**Problema**: Video no inicia
**Soluciones**:
1. Verifica que la URL sea accesible
2. Usa formato MP4 (más compatible)
3. Asegúrate de que el servidor permite CORS
4. Considera usar plataformas de video (Vimeo, YouTube)

### Las imágenes no cargan

**Problema**: Imágenes rotas
**Soluciones**:
1. Verifica las URLs en el navegador
2. Sube las imágenes al sistema de archivos del portafolio
3. Usa CDN para mejor rendimiento
4. Comprime las imágenes para carga rápida

## Soporte

Si tienes problemas con el sistema de demos:

1. Revisa esta documentación
2. Verifica los logs del backend (`/admin`)
3. Comprueba la consola del navegador
4. Prueba en modo incógnito (sin extensiones)
