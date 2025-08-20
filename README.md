# 🏛️ MiAbogada - Sistema Integral

Sistema web completo para la abogada **Dra. Angy Tatiana Garzón Fierro** especializada en Derecho Laboral y Seguridad Social.

## 📁 Estructura del Proyecto

```
MIABOGADA/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Node.js + Express + Prisma
├── README.md          # Este archivo
└── .gitignore         # Archivos ignorados
```

## 🚀 Inicio Rápido

### **Frontend** (Puerto 5176)
```bash
cd frontend
npm install
npm run dev
```

### **Backend** (Puerto 3001)
```bash
cd backend
npm install
npm run dev
```

### **Crear Usuario Admin**
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

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS v4**
- **Lucide React** (iconos)
- **ESLint** (linting)

### Backend
- **Node.js** + **Express 4**
- **Prisma ORM** + **SQLite**
- **JWT** (autenticación)
- **Zod** (validaciones)
- **Nodemailer** (emails)
- **Bcrypt** (encriptación)

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

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:5176
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📋 Scripts Disponibles

### Frontend
```bash
npm run dev      # Desarrollo
npm run build    # Construcción
npm run lint     # Linting
npm run preview  # Preview de build
```

### Backend
```bash
npm run dev              # Desarrollo
npm start               # Producción
npm run seed:admin      # Crear admin
npm run prisma:studio   # Ver base de datos
npm run prisma:migrate  # Migrar DB
```

## 🗄️ Base de Datos

### Modelos
- **User** - Usuarios (admin/cliente)
- **Appointment** - Citas agendadas
- **Contact** - Mensajes de contacto
- **Schedule** - Horarios disponibles

### Cambiar a PostgreSQL
1. Instalar PostgreSQL
2. Cambiar `DATABASE_URL` en `backend/.env`
3. Cambiar `provider = "postgresql"` en `backend/prisma/schema.prisma`
4. Ejecutar `npm run prisma:migrate`

## 📧 Configuración de Email

Para envío automático de emails:
1. Configurar Gmail con 2FA
2. Generar contraseña de aplicación
3. Actualizar variables en `backend/.env`:
```env
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

## 🚀 Despliegue

### Frontend
- **Vercel**, **Netlify**, o cualquier hosting estático
- Build: `npm run build`
- Carpeta de salida: `dist/`

### Backend
- **Railway**, **Render**, **Heroku**
- Configurar PostgreSQL en producción
- Variables de entorno requeridas

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

## 📝 Licencia

Proyecto privado para **Dra. Angy Tatiana Garzón Fierro**

