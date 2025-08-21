# 🧪 Guía de Testing - Backend MiAbogada

Esta guía te muestra cómo probar todos los endpoints de tu backend de diferentes maneras.

## 🚀 Quick Start

### 1. Verificar que el backend esté funcionando
```bash
curl http://localhost:3001/api/health
```
**Respuesta esperada:**
```json
{"status":"OK","timestamp":"2025-08-21T...","service":"MiAbogada Backend API"}
```

### 2. Crear usuario admin (si no existe)
```bash
docker-compose exec backend node scripts/createAdmin.js
```

---

## 📋 Endpoints Disponibles

### 🔓 **Públicos (No requieren autenticación)**

#### ✅ Health Check
```bash
curl http://localhost:3001/api/health
```

#### 📅 Obtener fechas disponibles
```bash
curl http://localhost:3001/api/appointments/available-dates
```

#### 📞 Enviar mensaje de contacto
```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+573001234567",
    "message": "Necesito consulta legal"
  }'
```

#### 📋 Crear cita
```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-08-25",
    "time": "10:00",
    "consultationType": "Derecho Laboral",
    "clientName": "María García",
    "clientEmail": "maria@example.com",
    "clientPhone": "+573009876543",
    "message": "Consulta sobre despido"
  }'
```

### 🔐 **Protegidos (Requieren autenticación)**

#### 🔑 Login Admin
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@miabogada.com",
    "password": "admin123"
  }'
```
**Guarda el token de la respuesta para usarlo en las siguientes requests.**

#### 📋 Ver todas las citas (Admin)
```bash
curl -X GET http://localhost:3001/api/appointments \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### 📞 Ver todos los contactos (Admin)
```bash
curl -X GET http://localhost:3001/api/contacts \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### 🔄 Actualizar estado de cita (Admin)
```bash
curl -X PATCH http://localhost:3001/api/appointments/ID_DE_CITA/status \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED"
  }'
```

---

## 🛠️ Métodos de Testing

### 1. 🖥️ **Línea de Comandos (cURL)**

**Ventajas:** Rápido, automatizable, ideal para CI/CD
**Uso:** Ejecuta los comandos de arriba directamente en terminal

### 2. 📜 **Script Automatizado**
```bash
# Ejecutar todas las pruebas
bash test-backend.sh
```

### 3. 🎨 **Postman/Insomnia**

#### Importar colección a Postman:
1. Abre Postman
2. File → Import → Selecciona `postman-examples.json`
3. Configura variables:
   - `base_url`: `http://localhost:3001`
   - `token`: (obtenido del login)

#### Workflow recomendado:
1. **Health Check** - Verificar que el backend funciona
2. **Admin Login** - Obtener token de autorización
3. **Available Dates** - Ver fechas disponibles
4. **Create Appointment** - Crear cita de prueba
5. **Get Appointments** - Ver citas como admin
6. **Send Contact** - Enviar mensaje de contacto
7. **Get Contacts** - Ver mensajes como admin

### 4. 🗄️ **Prisma Studio (Base de datos)**
```bash
# Ver datos directamente en la base de datos
docker-compose exec backend npx prisma studio
```
Abre: http://localhost:5555

---

## 🧪 Casos de Prueba

### ✅ **Pruebas Exitosas**

#### Crear cita válida:
```json
{
  "date": "2025-08-25",
  "time": "10:00", 
  "consultationType": "Derecho Laboral",
  "clientName": "Test User",
  "clientEmail": "test@example.com",
  "clientPhone": "+573001234567",
  "message": "Mensaje de prueba"
}
```

#### Enviar contacto válido:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+573001234567",
  "message": "Mensaje de contacto de prueba"
}
```

### ❌ **Pruebas de Error**

#### Datos faltantes:
```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-08-25"}'
# Respuesta: 400 - Datos inválidos
```

#### Email inválido:
```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "email-invalido",
    "message": "Test"
  }'
# Respuesta: 400 - Email inválido
```

#### Sin autorización:
```bash
curl http://localhost:3001/api/appointments
# Respuesta: 401 - Token requerido
```

#### Token inválido:
```bash
curl -X GET http://localhost:3001/api/appointments \
  -H "Authorization: Bearer token-invalido"
# Respuesta: 401 - Token inválido
```

---

## 🔍 Debugging

### Ver logs del backend:
```bash
docker-compose logs backend -f
```

### Reiniciar backend:
```bash
docker-compose restart backend
```

### Acceder al contenedor:
```bash
docker-compose exec backend sh
```

### Ver estado de la base de datos:
```bash
docker-compose exec postgres psql -U postgres -d miabogada_db -c "SELECT * FROM users;"
```

---

## 📊 Estados de Respuesta

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | Sin autenticación |
| 403 | Forbidden | Sin permisos |
| 404 | Not Found | Endpoint/recurso no encontrado |
| 500 | Server Error | Error interno del servidor |

---

## 🎯 Testing en Producción

### Variables de entorno para testing:
```env
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
JWT_SECRET=test-secret
```

### Comandos de testing:
```bash
# Correr tests unitarios (si existen)
npm test

# Correr tests de integración
npm run test:integration

# Cobertura de código
npm run test:coverage
```

---

## 💡 Tips para Testing

1. **Siempre verifica el health check primero**
2. **Usa datos de prueba válidos pero ficticios**
3. **Guarda los tokens JWT para reutilizar**
4. **Verifica en Prisma Studio que los datos se guarden**
5. **Revisa los logs si algo falla**
6. **Prueba tanto casos exitosos como errores**
7. **Usa nombres descriptivos en datos de prueba**

---

## 🆘 Solución de Problemas

### Backend no responde:
```bash
docker-compose ps
docker-compose logs backend
docker-compose restart backend
```

### Error de base de datos:
```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate
```

### Error de autenticación:
```bash
# Recrear usuario admin
docker-compose exec backend node scripts/createAdmin.js
```

---

¡Con esta guía puedes probar completamente tu backend y asegurarte de que funciona correctamente! 🚀