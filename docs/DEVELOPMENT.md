# 🛠️ Guía de Desarrollo

## Configuración del Entorno Local

### Prerrequisitos
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git

### Instalación Rápida con Docker

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd Portafolio
```

2. **Iniciar servicios con Docker**
```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

3. **Acceder a los servicios**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs
- PgAdmin: http://localhost:5055

### Instalación Manual

#### Backend (FastAPI)
```bash
cd backend
pip install pipenv
pipenv install
pipenv shell

# Configurar variables de entorno
cp env.example .env

# Ejecutar migraciones
pipenv run alembic upgrade head

# Iniciar servidor de desarrollo
pipenv run dev
```

#### Frontend (Next.js)
```bash
cd frontend
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura del Proyecto

### Backend
```
backend/
├── app/
│   ├── api/v1/          # Endpoints de la API
│   ├── core/            # Configuración y utilidades core
│   ├── models/          # Modelos de SQLAlchemy
│   ├── schemas/         # Esquemas de Pydantic
│   ├── services/        # Lógica de negocio
│   └── utils/           # Utilidades generales
├── alembic/             # Migraciones de base de datos
└── tests/               # Tests automatizados
```

### Frontend
```
frontend/
├── src/
│   ├── app/             # App Router de Next.js
│   ├── components/      # Componentes React
│   ├── lib/             # Utilidades y configuraciones
│   ├── hooks/           # Custom hooks
│   ├── store/           # Estado global (Zustand)
│   └── types/           # Tipos TypeScript
└── public/              # Archivos estáticos
```

## Comandos Útiles

### Backend
```bash
# Formatear código
pipenv run format

# Linting
pipenv run lint

# Tests
pipenv run test

# Crear migración
pipenv run makemigrations -m "descripción"

# Aplicar migraciones
pipenv run migrate
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Verificar tipos
npm run type-check

# Linting
npm run lint
```

### Docker
```bash
# Desarrollo
docker-compose -f docker/docker-compose.dev.yml up

# Producción
docker-compose -f docker/docker-compose.prod.yml up

# Ver logs
docker-compose logs -f [servicio]

# Reconstruir servicios
docker-compose up --build
```

## Base de Datos

### Conexión a PostgreSQL
- Host: localhost
- Puerto: 5440
- Usuario: portfolio_user
- Contraseña: portfolio_pass
- Base de datos: portfolio_db

### PgAdmin
- URL: http://localhost:5055
- Email: admin@portfolio.com
- Contraseña: admin123

## Variables de Entorno

### Backend (.env)
```env
DATABASE_URL=postgresql://portfolio_user:portfolio_pass@localhost:5440/portfolio_db
SECRET_KEY=your-secret-key
DEBUG=True
ENVIRONMENT=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Flujo de Desarrollo

1. **Crear rama para nueva feature**
```bash
git checkout -b feature/nueva-funcionalidad
```

2. **Desarrollar y probar localmente**
```bash
# Backend
pipenv run test
pipenv run lint

# Frontend
npm run type-check
npm run lint
```

3. **Commit y push**
```bash
git add .
git commit -m "feat: descripción de la funcionalidad"
git push origin feature/nueva-funcionalidad
```

4. **Crear Pull Request**

## Troubleshooting

### Problemas Comunes

**Error de conexión a la base de datos:**
- Verificar que PostgreSQL esté ejecutándose
- Comprobar variables de entorno
- Reiniciar contenedores Docker

**Puerto ocupado:**
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000
# Terminar proceso
taskkill /PID <PID> /F
```

**Problemas con dependencias:**
```bash
# Backend
pipenv install --dev
pipenv clean

# Frontend
rm -rf node_modules package-lock.json
npm install
```
