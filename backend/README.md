# Backend - MiAbogada API

Backend API para la landing page de la abogada Dra. Angy Tatiana Garzón Fierro.

## 🚀 Tecnologías

- **Node.js** + **Express.js**
- **Prisma ORM** + **SQLite** (desarrollo) / **PostgreSQL** (producción)
- **JWT** para autenticación
- **Zod** para validaciones
- **Nodemailer** para emails
- **Bcrypt** para encriptación

## 📦 Instalación

```bash
cd backend
npm install
```

## 🔧 Configuración

1. **Variables de entorno** (`.env`):
```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite para desarrollo
# DATABASE_URL="postgresql://username:password@localhost:5432/miabogada_db?schema=public"  # PostgreSQL para producción

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=miabogada-super-secret-jwt-key-2024
JWT_EXPIRES_IN=24h

# Email (Configurar con tu Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin por defecto
ADMIN_EMAIL=admin@miabogada.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Administrador

# URLs
FRONTEND_URL=http://localhost:5174
BUSINESS_EMAIL=angytatianagarzonfierrolaboral@gmail.com
BUSINESS_PHONE=+573177154643
BUSINESS_NAME=Dra. Angy Tatiana Garzón Fierro
```

2. **Base de datos**:
```bash
# Generar Prisma client
npx prisma generate

# Crear/migrar base de datos
npx prisma migrate dev --name init

# (Opcional) Ver base de datos
npx prisma studio
```

## 🏃‍♂️ Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

### Públicos
- `GET /api/health` - Health check
- `POST /api/appointments` - Crear cita
- `GET /api/appointments/available-dates` - Fechas disponibles
- `POST /api/contacts` - Enviar mensaje de contacto
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Protegidos (requieren autenticación)
- `GET /api/appointments` - Listar citas (admin)
- `PATCH /api/appointments/:id/status` - Actualizar estado de cita
- `GET /api/contacts` - Listar contactos (admin)
- `PATCH /api/contacts/:id/status` - Actualizar estado de contacto
- `GET /api/auth/profile` - Perfil del usuario
- `GET /api/auth/verify` - Verificar token

## 📧 Configuración de Email

Para configurar Gmail:

1. Habilitar autenticación de 2 factores
2. Generar contraseña de aplicación
3. Usar esa contraseña en `SMTP_PASS`

## 🗄️ Base de Datos

### Modelos:
- **User**: Usuarios del sistema (admin/cliente)
- **Appointment**: Citas agendadas
- **Contact**: Mensajes de contacto
- **Schedule**: Horarios disponibles

### Para usar PostgreSQL:

1. Instalar PostgreSQL
2. Crear base de datos: `createdb miabogada_db`
3. Cambiar `DATABASE_URL` en `.env`
4. Cambiar `provider = "postgresql"` en `prisma/schema.prisma`
5. Ejecutar `npx prisma migrate dev`

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configurado para el frontend
- **JWT**: Tokens con expiración
- **Bcrypt**: Passwords hasheados
- **Zod**: Validación de entrada

## 📝 Estructura

```
src/
├── controllers/     # Lógica de negocio
├── routes/         # Rutas de la API
├── middleware/     # Middleware personalizado
├── services/       # Servicios (email, etc.)
└── utils/          # Utilidades (DB, validaciones)
```

## 🔍 Testing

```bash
# Health check
curl http://localhost:3001/api/health

# Crear cita
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-25T10:00:00Z",
    "time": "10:00",
    "consultationType": "Consulta General",
    "clientName": "Juan Pérez",
    "clientEmail": "juan@example.com",
    "clientPhone": "3001234567",
    "message": "Consulta sobre despido"
  }'
```

## 🚀 Producción

Para producción, considera:

1. Usar PostgreSQL en lugar de SQLite
2. Configurar variables de entorno seguras
3. Usar un servidor SMTP dedicado
4. Implementar rate limiting
5. Configurar logs estructurados
6. Usar un reverse proxy (Nginx)
7. Implementar monitoreo