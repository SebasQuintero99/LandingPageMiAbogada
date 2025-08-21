# 🗄️ Conectar DBeaver a PostgreSQL (Docker)

Esta guía te muestra cómo conectar DBeaver a la base de datos PostgreSQL que corre en Docker.

## 📋 Datos de Conexión

| Campo | Valor |
|-------|-------|
| **Host** | `localhost` |
| **Puerto** | `5432` |
| **Base de datos** | `miabogada_db` |
| **Usuario** | `postgres` |
| **Contraseña** | `postgres123` |

## 🔧 Configuración en DBeaver

### 1. **Crear Nueva Conexión**
1. Abre DBeaver
2. Click en el ícono **"Nueva Conexión"** (🔌) o `Ctrl+Shift+N`
3. Selecciona **PostgreSQL**
4. Click **"Siguiente"**

### 2. **Configurar Conexión**

#### **Pestaña "Main":**
```
Server Host: localhost
Port: 5432
Database: miabogada_db
Username: postgres
Password: postgres123
```

#### **Configuración Avanzada (Opcional):**
- **Connection Name**: `MiAbogada - Local Docker`
- **Connection Folder**: Crea una carpeta "Docker Projects"

### 3. **Probar Conexión**
1. Click en **"Test Connection"**
2. Si es la primera vez, DBeaver descargará el driver de PostgreSQL
3. Deberías ver: ✅ **"Connected"**

### 4. **Guardar y Conectar**
1. Click **"Finish"**
2. La conexión aparecerá en el panel izquierdo
3. Doble click para conectar

## 🔍 Explorar la Base de Datos

### **Estructura de la Base de Datos:**
```
📁 miabogada_db
├── 📁 Schemas
│   └── 📁 public
│       ├── 📊 Tables
│       │   ├── 👥 users
│       │   ├── 📅 appointments  
│       │   ├── 📞 contacts
│       │   └── 🕐 schedules
│       └── 📈 Sequences
```

### **Tablas Principales:**

#### 👥 **users**
- `id` (String) - ID único
- `email` (String) - Email del usuario  
- `password` (String) - Contraseña encriptada
- `name` (String) - Nombre completo
- `role` (Enum) - ADMIN | CLIENT
- `createdAt` - Fecha de creación
- `updatedAt` - Última actualización

#### 📅 **appointments**
- `id` (String) - ID único
- `date` (DateTime) - Fecha de la cita
- `time` (String) - Hora de la cita
- `consultationType` (String) - Tipo de consulta
- `message` (String) - Mensaje del cliente
- `status` (Enum) - PENDING | CONFIRMED | CANCELLED | COMPLETED
- `clientName` (String) - Nombre del cliente
- `clientEmail` (String) - Email del cliente
- `clientPhone` (String) - Teléfono del cliente
- `userId` (String) - ID del usuario (opcional)

#### 📞 **contacts**
- `id` (String) - ID único
- `name` (String) - Nombre del contacto
- `email` (String) - Email del contacto
- `phone` (String) - Teléfono (opcional)
- `message` (String) - Mensaje
- `status` (Enum) - PENDING | REVIEWED | RESPONDED
- `userId` (String) - ID del usuario (opcional)

## 📊 Consultas Útiles

### **Ver todos los usuarios:**
```sql
SELECT id, name, email, role, "createdAt" 
FROM users 
ORDER BY "createdAt" DESC;
```

### **Ver citas recientes:**
```sql
SELECT 
    id,
    "clientName",
    "clientEmail", 
    date,
    time,
    "consultationType",
    status,
    "createdAt"
FROM appointments 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

### **Ver mensajes de contacto:**
```sql
SELECT 
    id,
    name,
    email,
    phone,
    message,
    status,
    "createdAt"
FROM contacts 
ORDER BY "createdAt" DESC;
```

### **Estadísticas de citas:**
```sql
SELECT 
    status,
    COUNT(*) as total,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as porcentaje
FROM appointments 
GROUP BY status;
```

### **Citas por tipo de consulta:**
```sql
SELECT 
    "consultationType",
    COUNT(*) as total
FROM appointments 
GROUP BY "consultationType"
ORDER BY total DESC;
```

## 🛠️ Operaciones Comunes

### **Crear usuario de prueba:**
```sql
INSERT INTO users (id, email, password, name, role)
VALUES (
    'test-user-' || extract(epoch from now()),
    'test@example.com',
    '$2b$12$encrypted.password.hash',
    'Usuario de Prueba',
    'CLIENT'
);
```

### **Actualizar estado de cita:**
```sql
UPDATE appointments 
SET status = 'CONFIRMED', "updatedAt" = NOW()
WHERE id = 'ID_DE_LA_CITA';
```

### **Buscar citas por email:**
```sql
SELECT * FROM appointments 
WHERE "clientEmail" ILIKE '%email@example.com%';
```

## 🔧 Troubleshooting

### **Error: "Connection refused"**
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Si no está corriendo, iniciarlo
docker-compose up -d postgres
```

### **Error: "Authentication failed"**
- Verificar usuario: `postgres`
- Verificar contraseña: `postgres123`
- Verificar que el contenedor esté healthy

### **Error: "Database does not exist"**
```bash
# Verificar que la base de datos existe
docker-compose exec postgres psql -U postgres -l
```

### **Puerto ocupado:**
```bash
# Ver qué proceso usa el puerto 5432
netstat -ano | findstr :5432

# Cambiar puerto en docker-compose.yml si es necesario
ports:
  - "5433:5432"  # Usar puerto 5433 en lugar de 5432
```

## 🔒 Seguridad

### **Para Producción:**
1. **Cambiar credenciales por defecto**
2. **Usar variables de entorno**
3. **Restringir acceso por IP**
4. **Usar SSL/TLS**

### **Variables de entorno seguras:**
```env
POSTGRES_DB=miabogada_prod
POSTGRES_USER=miabogada_user
POSTGRES_PASSWORD=contraseña_super_segura_123!
```

## 💡 Tips Avanzados

### **Backup desde DBeaver:**
1. Right-click en la database
2. Tools → Dump Database
3. Seleccionar formato y ubicación

### **Import/Export datos:**
1. Right-click en tabla
2. Export Data / Import Data
3. Seleccionar formato (CSV, SQL, etc.)

### **Crear vistas útiles:**
```sql
-- Vista de citas con información completa
CREATE VIEW appointments_detailed AS
SELECT 
    a.id,
    a."clientName",
    a."clientEmail",
    a.date,
    a.time,
    a."consultationType",
    a.status,
    a.message,
    u.name as "assignedAdmin"
FROM appointments a
LEFT JOIN users u ON a."userId" = u.id
ORDER BY a."createdAt" DESC;
```

---

¡Con DBeaver conectado podrás ver, editar y analizar todos los datos de tu aplicación de forma visual y eficiente! 🚀