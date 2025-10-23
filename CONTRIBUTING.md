# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto! Esta guía te ayudará a entender el proceso y las mejores prácticas.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Contribuir?](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [CI/CD Pipeline](#cicd-pipeline)
- [Convención de Commits](#convención-de-commits)
- [Estándares de Código](#estándares-de-código)
- [Pull Request](#pull-request)

---

## 📜 Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas este código:

- 🤝 Sé respetuoso y considerado
- 💬 Usa lenguaje inclusivo
- 🎯 Acepta críticas constructivas
- 🚀 Enfócate en lo que es mejor para la comunidad

---

## 🚀 ¿Cómo Contribuir?

### 1. Fork del Repositorio

```bash
# Clona tu fork
git clone https://github.com/nikoidev/Portafolio.git
cd Portafolio

# Agrega el repositorio original como upstream
git remote add upstream https://github.com/nikoidev/Portafolio.git
```

### 2. Crea una Rama

```bash
# Actualiza main
git checkout main
git pull upstream main

# Crea una nueva rama para tu feature/fix
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 3. Realiza tus Cambios

- Escribe código limpio y documentado
- Sigue los estándares de código del proyecto
- Agrega tests si es posible
- Actualiza la documentación si es necesario

### 4. Commit tus Cambios

```bash
git add .
git commit -m "feat: descripción breve del cambio"
```

### 5. Push y Pull Request

```bash
git push origin feature/nombre-descriptivo
```

Luego abre un Pull Request en GitHub desde tu fork hacia el repositorio original.

---

## 🔄 Proceso de Desarrollo

### Configuración del Entorno

1. **Requisitos**:
   - Node.js 18+
   - Python 3.11+
   - PostgreSQL 14+
   - Docker (opcional pero recomendado)

2. **Instalación**:
   ```bash
   # Backend
   cd backend
   pipenv install --dev
   pipenv shell
   
   # Frontend
   cd frontend
   npm install
   ```

3. **Variables de Entorno**:
   - Copia `backend/env.example` a `backend/.env`
   - Copia `frontend/env.local.example` a `frontend/.env.local`
   - Configura las variables según tu entorno

### Ejecutar en Desarrollo

```bash
# Terminal 1 - Backend
cd backend
pipenv run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Ejecutar Tests

```bash
# Backend
cd backend
pipenv run pytest

# Frontend
cd frontend
npm run test
```

---

## 🔧 CI/CD Pipeline

El proyecto utiliza **GitHub Actions** para automatizar el proceso de integración y deployment.

### 🎯 Workflows Automáticos

#### Backend CI/CD (`.github/workflows/backend-ci-cd.yml`)

**Triggers:**
- Push a `main` con cambios en `backend/**`
- Pull Request a `main` con cambios en `backend/**`

**Jobs:**

1. **Lint and Test**:
   ```yaml
   - Checkout code
   - Setup Python 3.11
   - Cache pip dependencies
   - Install pipenv + dependencies
   - Lint with flake8 (syntax errors)
   - Type checking with mypy
   - Run tests with pytest
   ```

2. **Deploy** (solo en push a `main`):
   ```yaml
   - Checkout code
   - Install Railway CLI
   - Deploy to Railway
   ```

#### Frontend CI/CD (`.github/workflows/frontend-ci-cd.yml`)

**Triggers:**
- Push a `main` con cambios en `frontend/**`
- Pull Request a `main` con cambios en `frontend/**`

**Jobs:**

1. **Lint and Build**:
   ```yaml
   - Checkout code
   - Setup Node.js 18
   - Cache npm dependencies
   - Install dependencies (npm ci)
   - Lint with ESLint
   - Type check with TypeScript
   - Build Next.js
   - Upload build artifacts
   ```

2. **Deploy** (solo en push a `main`):
   ```yaml
   - Checkout code
   - Install Railway CLI
   - Deploy to Railway
   ```

### 📊 Status Badges

Los badges en el README muestran el estado de los pipelines:

- 🟢 **Passing**: Todo funcionó correctamente
- 🔴 **Failing**: Hay errores que necesitan atención
- 🟡 **Running**: El pipeline está ejecutándose

### 🔐 Secrets Requeridos

Para que los workflows funcionen en tu fork, necesitas configurar estos secrets en GitHub:

1. Ve a: `Settings` → `Secrets and variables` → `Actions`

2. Agrega los siguientes secrets:

| Secret | Descripción | Requerido para |
|--------|-------------|----------------|
| `RAILWAY_TOKEN` | Token de Railway CLI | Deploy automático |
| `NEXT_PUBLIC_API_URL` | URL del backend | Build del frontend |

### 🚦 Proceso de CI/CD

```
┌─────────────┐
│  Git Push   │
└─────┬───────┘
      │
      ▼
┌─────────────────────┐
│  GitHub Actions     │
│  Trigger Workflow   │
└─────┬───────────────┘
      │
      ├─────────────────────┐
      │                     │
      ▼                     ▼
┌─────────────┐      ┌─────────────┐
│   Backend   │      │  Frontend   │
│   CI/CD     │      │   CI/CD     │
└─────┬───────┘      └─────┬───────┘
      │                     │
      ▼                     ▼
┌─────────────┐      ┌─────────────┐
│ Lint + Test │      │ Lint + Build│
└─────┬───────┘      └─────┬───────┘
      │                     │
      │   Success?          │   Success?
      ├─────────────────────┤
      │                     │
      ▼                     ▼
┌─────────────────────────────┐
│  Deploy to Railway          │
│  (solo si push a main)      │
└─────────────────────────────┘
```

### 🛠️ Ejecutar CI Localmente

Para validar antes de hacer push:

```bash
# Backend
cd backend
pipenv run flake8 app
pipenv run mypy app --ignore-missing-imports
pipenv run pytest

# Frontend
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

---

## 💬 Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial claro:

### Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, espacios en blanco, etc (sin cambios en lógica)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Agregar o actualizar tests
- `chore`: Tareas de mantenimiento, actualización de dependencias
- `ci`: Cambios en configuración de CI/CD
- `build`: Cambios en sistema de build o dependencias

### Ejemplos

```bash
# Nueva funcionalidad
git commit -m "feat(auth): add password reset functionality"

# Corrección de bug
git commit -m "fix(api): resolve CORS issue in production"

# Documentación
git commit -m "docs(readme): update installation instructions"

# Refactorización
git commit -m "refactor(components): simplify ProjectCard component"

# CI/CD
git commit -m "ci(workflows): add automated testing for PRs"
```

### Scope (Opcional)

Indica el área afectada:

- `auth` - Autenticación
- `api` - Endpoints de la API
- `ui` - Interfaz de usuario
- `db` - Base de datos
- `config` - Configuración
- `deps` - Dependencias

---

## 📝 Estándares de Código

### Backend (Python)

- **PEP 8**: Seguir la guía de estilo de Python
- **Type Hints**: Usar anotaciones de tipos
- **Docstrings**: Documentar funciones y clases
- **Longitud de línea**: Máximo 120 caracteres
- **Imports**: Usar orden absoluto, agrupados

```python
# Bueno
def get_user_by_email(email: str) -> User | None:
    """
    Retrieve a user by their email address.
    
    Args:
        email: The user's email address
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.email == email).first()
```

### Frontend (TypeScript)

- **ESLint**: Seguir las reglas configuradas
- **TypeScript**: Usar tipos estrictos
- **Componentes**: Preferir funciones sobre clases
- **Props**: Usar interfaces para definir props
- **Naming**: camelCase para variables, PascalCase para componentes

```typescript
// Bueno
interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  // ...
}
```

### Tests

- **Nombrado**: Descriptivo y claro
- **AAA Pattern**: Arrange, Act, Assert
- **Coverage**: Apuntar a >80% de cobertura

```python
# Backend test example
def test_create_user_success():
    # Arrange
    user_data = {"email": "test@example.com", "password": "secure123"}
    
    # Act
    response = client.post("/api/v1/users", json=user_data)
    
    # Assert
    assert response.status_code == 201
    assert response.json()["email"] == user_data["email"]
```

---

## 🔍 Pull Request

### Checklist

Antes de abrir un PR, verifica:

- [ ] El código sigue los estándares del proyecto
- [ ] Todos los tests pasan localmente
- [ ] Agregaste tests para nuevo código (si aplica)
- [ ] Actualizaste la documentación (si aplica)
- [ ] Los commits siguen la convención establecida
- [ ] El PR tiene una descripción clara
- [ ] Los cambios fueron probados manualmente

### Template de PR

```markdown
## 📝 Descripción

Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio

- [ ] 🐛 Bug fix
- [ ] ✨ Nueva funcionalidad
- [ ] 💥 Breaking change
- [ ] 📝 Documentación
- [ ] 🎨 Estilo/UI

## 🧪 ¿Cómo se ha probado?

Describe las pruebas realizadas.

## 📸 Screenshots (si aplica)

Agrega capturas de pantalla.

## ✅ Checklist

- [ ] Mi código sigue el estilo del proyecto
- [ ] He realizado una auto-revisión
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He agregado tests
- [ ] Los tests existentes pasan
```

### Proceso de Revisión

1. **Automated Checks**: Los workflows de CI/CD correrán automáticamente
2. **Code Review**: Un mantenedor revisará tu código
3. **Feedback**: Puede haber solicitudes de cambios
4. **Merge**: Una vez aprobado, se hará merge a `main`

### Tiempo de Respuesta

- Reviews iniciales: 1-3 días
- Cambios solicitados: según complejidad
- Merge: después de aprobación y CI passing

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifica que no exista un issue similar
2. Reproduce el bug en la última versión
3. Recopila información relevante

### Template de Bug Report

```markdown
## 🐛 Descripción del Bug

Descripción clara y concisa del bug.

## 📋 Pasos para Reproducir

1. Ve a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Observa el error

## 🎯 Comportamiento Esperado

Qué debería ocurrir.

## 📸 Screenshots

Si aplica, agrega capturas.

## 🖥️ Entorno

- OS: [ej: Windows 11]
- Browser: [ej: Chrome 120]
- Versión: [ej: v1.2.3]

## 📝 Información Adicional

Cualquier otro contexto relevante.
```

---

## 💡 Solicitar Features

### Template de Feature Request

```markdown
## 🚀 Feature Request

Descripción clara de la funcionalidad solicitada.

## 🎯 Problema que Resuelve

¿Qué problema o necesidad aborda?

## 💡 Solución Propuesta

¿Cómo te gustaría que funcionara?

## 🔀 Alternativas Consideradas

¿Hay otras formas de resolver esto?

## 📝 Contexto Adicional

Cualquier información adicional.
```

---

## 📞 Contacto

Si tienes preguntas sobre cómo contribuir:

- **Issues**: [GitHub Issues](https://github.com/nikoidev/Portafolio/issues)
- **Email**: aran.nick15@gmail.com
- **Discussions**: [GitHub Discussions](https://github.com/nikoidev/Portafolio/discussions)

---

## 🙏 Agradecimientos

¡Gracias por contribuir! Cada contribución, grande o pequeña, es valiosa para el proyecto.

---

<div align="center">

**¡Feliz Coding! 🚀**

</div>
