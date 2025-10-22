# 🔧 Configuración de CI/CD con GitHub Actions

Esta guía te ayudará a configurar el pipeline de CI/CD completo para deployment automático a Railway.

---

## 📋 Requisitos Previos

- ✅ Cuenta de GitHub (repositorio público o privado)
- ✅ Cuenta de Railway ([railway.app](https://railway.app))
- ✅ Proyecto desplegado en Railway (backend y frontend)

---

## 🚀 Paso 1: Obtener Railway Token

### 1.1. Iniciar Sesión en Railway

Ve a [railway.app](https://railway.app) e inicia sesión.

### 1.2. Generar Token de API

1. Click en tu **avatar** (esquina superior derecha)
2. Ve a **Account Settings**
3. Selecciona **Tokens** en el menú lateral
4. Click en **Create a New Token**
5. Dale un nombre descriptivo: `GitHub Actions CI/CD`
6. **Copia el token** (solo se muestra una vez)

```
Ejemplo de token:
railway_token_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

⚠️ **Importante**: Guarda este token en un lugar seguro, no lo compartas públicamente.

---

## 🔐 Paso 2: Configurar Secrets en GitHub

### 2.1. Ir a Configuración del Repositorio

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (pestaña superior)
3. En el menú lateral, ve a **Secrets and variables** → **Actions**

### 2.2. Agregar Secrets

Click en **New repository secret** y agrega los siguientes secrets:

#### Secret 1: RAILWAY_TOKEN

- **Name**: `RAILWAY_TOKEN`
- **Value**: El token que copiaste de Railway
- Click en **Add secret**

#### Secret 2: NEXT_PUBLIC_API_URL (opcional para build)

- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: URL de tu backend en producción (ej: `https://tu-backend.railway.app`)
- Click en **Add secret**

### 2.3. Verificar Secrets

Deberías ver algo como:

```
RAILWAY_TOKEN         ******************** (Updated X minutes ago)
NEXT_PUBLIC_API_URL   ******************** (Updated X minutes ago)
```

---

## 📦 Paso 3: Configurar Railway para Deployment

### 3.1. Conectar Railway con GitHub

1. Ve a tu proyecto en Railway
2. Para cada servicio (backend y frontend):
   - Click en el servicio
   - Ve a **Settings**
   - En **Source**, verifica que esté conectado a tu repositorio de GitHub
   - Configura el **Root Directory**:
     - Backend: `backend`
     - Frontend: `frontend`

### 3.2. Configurar Build Commands (si es necesario)

#### Para el Backend:

**Build Command:**
```bash
pipenv install --deploy
```

**Start Command:**
```bash
pipenv run gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

#### Para el Frontend:

**Build Command:**
```bash
npm ci && npm run build
```

**Start Command:**
```bash
npm start
```

### 3.3. Variables de Entorno en Railway

Asegúrate de tener configuradas todas las variables de entorno necesarias en Railway:

#### Backend:
- `DATABASE_URL`
- `SECRET_KEY`
- `ALLOWED_ORIGINS`
- `SUPER_ADMIN_EMAIL`
- `SUPER_ADMIN_PASSWORD`
- etc.

#### Frontend:
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

---

## ✅ Paso 4: Probar el CI/CD

### 4.1. Hacer un Cambio de Prueba

```bash
# Crear una rama de prueba
git checkout -b test/ci-cd

# Hacer un cambio pequeño (ej: actualizar README)
echo "# Test CI/CD" >> README.md

# Commit y push
git add README.md
git commit -m "ci: test CI/CD pipeline"
git push origin test/ci-cd
```

### 4.2. Crear Pull Request

1. Ve a tu repositorio en GitHub
2. Verás un banner para crear un Pull Request
3. Click en **Compare & pull request**
4. Completa la descripción y click en **Create pull request**

### 4.3. Ver Workflows en Acción

1. Ve a la pestaña **Actions** de tu repositorio
2. Verás los workflows ejecutándose:
   - 🟡 **In Progress**: El workflow está corriendo
   - 🟢 **Success**: Todo pasó correctamente
   - 🔴 **Failed**: Algo falló (revisa los logs)

3. Click en un workflow para ver detalles y logs

### 4.4. Hacer Merge a Main

Si todo está 🟢 **verde**:

1. Ve al Pull Request
2. Click en **Merge pull request**
3. Confirma el merge
4. ¡El deployment automático empezará!

---

## 🔍 Paso 5: Verificar Deployment

### 5.1. Ver Logs de Railway

1. Ve a Railway
2. Click en tu servicio (backend o frontend)
3. Ve a la pestaña **Deployments**
4. Click en el último deployment
5. Verás los logs del deployment

### 5.2. Verificar que la App Funciona

1. **Backend**: Ve a `https://tu-backend.railway.app/docs`
   - Deberías ver la documentación de Swagger
   
2. **Frontend**: Ve a `https://tu-frontend.railway.app`
   - Verifica que la app carga correctamente

---

## 🐛 Troubleshooting

### Problema: Workflow falla en "Install dependencies"

**Solución**:
- Verifica que los archivos de dependencias estén actualizados:
  - Backend: `Pipfile.lock`
  - Frontend: `package-lock.json`
- Haz un commit con las dependencias actualizadas

### Problema: Workflow falla en "Lint"

**Solución**:
- Ejecuta el linter localmente:
  ```bash
  # Backend
  cd backend
  pipenv run flake8 app
  
  # Frontend
  cd frontend
  npm run lint
  ```
- Corrige los errores y haz commit

### Problema: Deployment falla en Railway

**Solución**:
- Verifica que el `RAILWAY_TOKEN` sea correcto
- Verifica que Railway CLI pueda acceder a tu proyecto
- Revisa los logs en Railway para ver el error específico

### Problema: Badge muestra "Unknown"

**Solución**:
- Asegúrate de que el nombre del workflow en el badge coincida con el nombre en el archivo `.yml`
- Espera a que se ejecute el workflow al menos una vez
- Verifica que el repositorio sea público (o que tengas permisos si es privado)

---

## 📊 Entender los Badges

### Badge Verde (Passing)

```
✅ Backend CI/CD: Passing
```

Significa:
- ✅ Linting pasó sin errores críticos
- ✅ Type checking pasó (o se ignoraron warnings)
- ✅ Build fue exitoso
- ✅ Deployment a Railway completado (si aplica)

### Badge Rojo (Failing)

```
❌ Backend CI/CD: Failing
```

Significa:
- ❌ Hay errores de sintaxis o linting críticos
- ❌ El build falló
- ❌ El deployment falló

**Acción**: Click en el badge → Ver logs → Corregir errores

### Badge Amarillo (Running)

```
🟡 Backend CI/CD: Running
```

El workflow está ejecutándose en este momento.

---

## 🎯 Mejores Prácticas

### 1. Revisar Logs Regularmente

- Revisa los logs de workflows fallidos
- Aprende de los errores para mejorar el código

### 2. Mantener Dependencies Actualizadas

```bash
# Backend
cd backend
pipenv update

# Frontend
cd frontend
npm update
```

### 3. Ejecutar CI Localmente

Antes de hacer push, ejecuta:

```bash
# Backend
cd backend
pipenv run flake8 app
pipenv run mypy app --ignore-missing-imports

# Frontend
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

### 4. Proteger la Rama Main

En GitHub, ve a **Settings** → **Branches** → **Branch protection rules**:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

### 5. Usar Pre-commit Hooks (opcional)

Instala pre-commit para validar antes de commit:

```bash
pip install pre-commit
pre-commit install
```

---

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Documentation](https://docs.railway.app/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🙋 ¿Necesitas Ayuda?

Si tienes problemas configurando CI/CD:

1. Revisa los logs de GitHub Actions
2. Revisa los logs de Railway
3. Abre un issue en el repositorio
4. Contacta: aran.nick15@gmail.com

---

<div align="center">

**¡CI/CD configurado exitosamente! 🎉**

Ahora cada push a `main` desplegará automáticamente tu app.

</div>

