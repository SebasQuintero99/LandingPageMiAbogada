# 🏛️ MiAbogada - Sistema Integral

Sistema web completo para la abogada **Dra. Angy Tatiana Garzón Fierro** especializada en Derecho Laboral y Seguridad Social.

**🐳 Completamente Dockerizado** - Listo para desarrollo y producción.

## 📁 Estructura del Proyecto

```
MIABOGADA/
├── frontend/                 # React + Vite + Nginx
│   ├── src/                 # Código fuente React
│   ├── Dockerfile           # Docker multi-stage build
│   ├── nginx.conf           # Configuración Nginx
│   └── package.json         # Dependencias frontend
├── backend/                 # Node.js + Express + Prisma
│   ├── src/                 # API y controladores
│   ├── prisma/              # Schema y migraciones DB
│   ├── scripts/             # Scripts utilitarios
│   ├── Dockerfile           # Docker backend
│   ├── healthcheck.js       # Health checks
│   └── package.json         # Dependencias backend
├── docker-compose.yml       # Orquestación servicios
├── DOCKER.md               # Documentación Docker
├── .env.docker             # Variables de entorno template
└── README.md               # Este archivo
```

## 🚀 Inicio Rápido

### 🐳 **Con Docker (Recomendado)**
```bash
# Clonar el repositorio
git clone <repository-url>
cd MIABOGADA

# Configurar variables de entorno (opcional)
cp .env.docker .env
# Editar .env con tus credenciales SMTP

# Iniciar todos los servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

**URLs:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **Base de datos**: localhost:5432 (PostgreSQL)

### 💻 **Desarrollo Local**

#### **Frontend** (Puerto 5173)
```bash
cd frontend
npm install
npm run dev
```

#### **Backend** (Puerto 3001)
```bash
cd backend
npm install
npm run dev
```

#### **Crear Usuario Admin**
```bash
cd backend
npm run seed:admin
```
**Credenciales:** `admin@miabogada.com` / `admin123`

## 🎯 Características

### **Landing Page (Frontend)**
- ✅ **Diseño responsivo** con Tailwind CSS
- ✅ **Sistema de citas** interactivo
- ✅ **Formulario de contacto**
- ✅ **Sección de abogados aliados**
- ✅ **WhatsApp flotante**
- ✅ **Testimonios de clientes**

### **API Backend**
- ✅ **Sistema de citas** completo
- ✅ **Gestión de contactos**
- ✅ **Autenticación JWT**
- ✅ **Emails automáticos**
- ✅ **Base de datos SQLite/PostgreSQL**
- ✅ **Panel de administración**

## 🔧 Tecnologías

### 🐳 **Docker & DevOps**
- **Docker** + **Docker Compose**
- **Multi-stage builds** (optimización)
- **Nginx** (reverse proxy, static files)
- **PostgreSQL 15** (base de datos)
- **Health checks** y **auto-restart**

### 🎨 **Frontend**
- **React 19** + **Vite 7**
- **Tailwind CSS v4** (styling)
- **Lucide React** (iconos)
- **ESLint** (linting)
- **Nginx Alpine** (servidor web)

### ⚙️ **Backend**
- **Node.js 18** + **Express 4**
- **Prisma ORM** + **PostgreSQL**
- **JWT** (autenticación)
- **Zod** (validaciones)
- **Nodemailer** (emails)
- **Bcrypt** (encriptación)
- **Health checks** integrados

## 📊 Endpoints API

### Públicos
- `POST /api/appointments` - Crear cita
- `GET /api/appointments/available-dates` - Fechas disponibles
- `POST /api/contacts` - Enviar mensaje
- `POST /api/auth/login` - Login

### Protegidos (Admin)
- `GET /api/appointments` - Listar citas
- `PATCH /api/appointments/:id/status` - Actualizar estado
- `GET /api/contacts` - Ver mensajes
- `GET /api/auth/profile` - Perfil

## 🌐 URLs de Acceso

### 🐳 **Docker (Producción)**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **Base de datos**: localhost:5432 (PostgreSQL)
- **Health Check**: http://localhost:3001/api/health

### 💻 **Desarrollo Local**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📋 Scripts Disponibles

### 🐳 **Docker Commands**
```bash
# Iniciar servicios
docker-compose up -d

# Rebuild y restart
docker-compose up -d --build

# Ver logs
docker-compose logs -f
docker-compose logs backend
docker-compose logs frontend

# Parar servicios
docker-compose down

# Acceder a contenedores
docker-compose exec backend npm run prisma:studio
docker-compose exec backend npm run seed:admin
```

### 🎨 **Frontend**
```bash
npm run dev      # Desarrollo (localhost:5173)
npm run build    # Construcción para producción
npm run lint     # Linting ESLint
npm run preview  # Preview de build
```

### ⚙️ **Backend**
```bash
npm run dev              # Desarrollo con auto-reload
npm start               # Producción
npm run seed:admin      # Crear usuario admin
npm run prisma:studio   # Interface visual DB
npm run prisma:migrate  # Aplicar migraciones
```

## 🗄️ Base de Datos

### 🐳 **PostgreSQL (Docker)**
- **Versión**: PostgreSQL 15 Alpine
- **Puerto**: 5432
- **Base de datos**: miabogada_db
- **Volumenes persistentes**: ✅
- **Migraciones automáticas**: ✅

### 📊 **Modelos**
- **User** - Usuarios (admin/cliente)
- **Appointment** - Citas agendadas  
- **Contact** - Mensajes de contacto
- **Schedule** - Horarios disponibles

### 🔄 **Gestión de DB**
```bash
# Con Docker
docker-compose exec backend npx prisma studio
docker-compose exec backend npx prisma migrate deploy
docker-compose exec postgres psql -U postgres -d miabogada_db

# Local
npm run prisma:studio   # Interface visual
npm run prisma:migrate  # Aplicar migraciones
npm run prisma:reset    # Reset completo (⚠️ borra datos)
```

## 📧 Configuración de Email

### Variables de Entorno
```bash
# Copiar template
cp .env.docker .env

# Editar con tus credenciales
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

### Gmail Setup
1. Activar 2FA en Gmail
2. Generar contraseña de aplicación
3. Usar la contraseña de app (no la de tu cuenta)

## 🚀 Despliegue

### 🐳 **Con Docker (Recomendado)**
```bash
# Producción con SSL
docker-compose --profile production up -d

# Usar PostgreSQL externo
# Actualizar DATABASE_URL en .env
```

### ☁️ **Cloud Deployment**

#### **Frontend**
- **Vercel**, **Netlify**
- Build command: `npm run build`
- Output directory: `dist/`
- Node version: 18+

#### **Backend**  
- **Railway**, **Render**, **Heroku**
- Container deployment con Dockerfile
- PostgreSQL addon requerido

#### **Variables Requeridas**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=tu-secret-key
SMTP_USER=email@gmail.com
SMTP_PASS=app-password
NODE_ENV=production
```

## 👩‍💼 Información del Cliente

**Dra. Angy Tatiana Garzón Fierro**
- 📧 angytatianagarzonfierrolaboral@gmail.com
- 📞 +57 317 715 4643
- 📍 Calle 23B sur #29-22 San Jorge 1ra Etapa, Neiva, Huila

### Especialidades
- Derecho Laboral
- Seguridad Social
- Despidos Injustificados
- Pensiones
- Accidentes Laborales

## 🐳 Docker - Guía Completa

### **Arquitectura de Contenedores**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (nginx)       │────│   (Node.js)     │────│   (PostgreSQL)  │
│   Port 3000     │    │   Port 3001     │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Servicios Incluidos**
- 🌐 **Frontend**: React + Vite + Nginx
- ⚙️ **Backend**: Node.js + Express + Prisma
- 🗄️ **Database**: PostgreSQL 15 con volúmenes persistentes
- 🔄 **Health Checks**: Monitoreo automático de servicios
- 🔒 **Security**: Usuarios no-root, configuración segura

### **Comandos Útiles**
```bash
# Estado de contenedores
docker-compose ps

# Reiniciar un servicio específico
docker-compose restart backend

# Ver uso de recursos
docker stats

# Limpiar sistema Docker
docker system prune -a

# Backup de base de datos
docker-compose exec postgres pg_dump -U postgres miabogada_db > backup.sql
```

### **Troubleshooting**
```bash
# Ver logs específicos
docker-compose logs backend -f
docker-compose logs frontend -f

# Acceder a shell de contenedor
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres

# Reset completo
docker-compose down -v --remove-orphans
docker-compose up -d --build
```

### **Documentación Completa**
📖 Ver `DOCKER.md` para documentación detallada de Docker.

## 📝 Licencia

Proyecto privado para **Dra. Angy Tatiana Garzón Fierro**

---

*🐳 Dockerizado y listo para producción | 🚀 Built with love by Claude Code*

