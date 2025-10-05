# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Estándares de Código](#estándares-de-código)
- [Convención de Commits](#convención-de-commits)

---

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con la siguiente información:

**Título**: Descripción breve del problema

**Contenido**:
```markdown
**Descripción del bug**
Descripción clara y concisa del problema.

**Pasos para reproducir**
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

**Comportamiento esperado**
Lo que esperabas que sucediera.

**Screenshots**
Si es posible, agrega capturas de pantalla.

**Entorno**:
- OS: [ej. Windows 11, macOS 13]
- Navegador: [ej. Chrome 120]
- Node.js: [ej. 18.17.0]
- Python: [ej. 3.11.5]
```

### Sugerir Mejoras

Para sugerir nuevas funcionalidades:

1. **Verifica** que no exista ya un issue similar
2. **Crea un issue** con:
   - Descripción clara de la funcionalidad
   - Por qué sería útil
   - Ejemplos de uso
   - Posible implementación (opcional)

---

## Proceso de Pull Request

### 1. Fork y Clonar

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/Nikoidev/Portafolio.git
cd Portafolio
```

### 2. Crear Rama

```bash
# Crea una rama desde main
git checkout -b feature/mi-nueva-funcionalidad

# O para un fix
git checkout -b fix/nombre-del-bug
```

**Convención de nombres de rama**:
- `feature/descripcion` - Nueva funcionalidad
- `fix/descripcion` - Corrección de bug
- `docs/descripcion` - Documentación
- `refactor/descripcion` - Refactorización

### 3. Hacer Cambios

- Escribe código limpio y legible
- Sigue los estándares de código (ver abajo)
- Agrega comentarios para lógica compleja
- Actualiza documentación si es necesario

### 4. Probar Cambios

**Backend**:
```bash
cd backend
pipenv run test    # Si hay tests
pipenv run lint    # Verificar estilo
```

**Frontend**:
```bash
cd frontend
npm run type-check # Verificar tipos TypeScript
npm run lint       # Verificar estilo
npm run build      # Asegurar que compila
```

### 5. Commit

```bash
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

Ver [Convención de Commits](#convención-de-commits) abajo.

### 6. Push y Pull Request

```bash
git push origin feature/mi-nueva-funcionalidad
```

Luego en GitHub:
1. Ve a tu fork
2. Click en "Compare & pull request"
3. Describe tus cambios
4. Envía el PR

---

## Estándares de Código

### Python (Backend)

**Estilo**: Seguir [PEP 8](https://pep8.org/)

```python
# ✅ Bien
def get_user_by_email(email: str) -> Optional[User]:
    """
    Obtiene un usuario por su email.
    
    Args:
        email: Email del usuario
        
    Returns:
        Usuario si existe, None en caso contrario
    """
    return db.query(User).filter(User.email == email).first()


# ❌ Mal
def getUserByEmail(e):
    return db.query(User).filter(User.email==e).first()
```

**Puntos clave**:
- Usar type hints
- Escribir docstrings
- Nombres descriptivos
- Funciones pequeñas y enfocadas
- Usar async/await para operaciones de BD

### TypeScript (Frontend)

```typescript
// ✅ Bien
interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};


// ❌ Mal
const getUser = async (id) => {
  return await api.get('/users/' + id);
}
```

**Puntos clave**:
- Usar TypeScript con tipos explícitos
- Componentes funcionales con hooks
- Nombres significativos
- Extraer lógica reutilizable en hooks personalizados
- Componentes pequeños y enfocados

---

## Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[nota al pie opcional]
```

### Tipos

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Formato de código (sin cambios funcionales)
- **refactor**: Refactorización de código
- **perf**: Mejoras de rendimiento
- **test**: Agregar o actualizar tests
- **chore**: Tareas de mantenimiento

### Ejemplos

```bash
# Funcionalidad simple
git commit -m "feat: agregar página de perfil de usuario"

# Bug fix con alcance
git commit -m "fix(auth): resolver problema de expiración de token"

# Breaking change
git commit -m "feat!: rediseñar sistema de autenticación

BREAKING CHANGE: Ahora se requiere verificación de email"

# Con cuerpo
git commit -m "refactor(api): mejorar manejo de errores

- Agregar clases de error personalizadas
- Estandarizar respuestas de error
- Agregar logging de errores"
```

---

## Guías Generales

### Código

1. **DRY (Don't Repeat Yourself)** - Evita duplicación
2. **KISS (Keep It Simple)** - Mantén la simplicidad
3. **SOLID** - Principios de programación orientada a objetos
4. **Separación de responsabilidades** - Cada función/componente hace una cosa

### Documentación

- Comenta el **por qué**, no el **qué**
- Actualiza README si agregas features importantes
- Escribe docstrings para funciones complejas

### Tests

- Escribe tests para nueva funcionalidad
- Asegura que los tests existentes pasen
- Cubre casos edge

---

## Proceso de Revisión

1. **Automático**: Los checks de CI deben pasar (si están configurados)
2. **Revisión de código**: Un maintainer revisará tu código
3. **Cambios solicitados**: Realiza cambios si se solicitan
4. **Aprobación**: Una vez aprobado, se hará merge

---

## Preguntas

Si tienes dudas:
- Crea un issue con la etiqueta `question`
- Revisa issues y PRs existentes
- Lee la documentación en `/docs`

---

## Código de Conducta

- Sé respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en el código, no en las personas
- Ayuda a otros contributors

---

¡Gracias por contribuir! 🎉

Cada contribución, sin importar su tamaño, hace que este proyecto sea mejor.
