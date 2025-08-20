# Docker Setup - MiAbogada

This project has been fully dockerized with multi-stage builds, PostgreSQL database, and production-ready configuration.

## Quick Start

1. **Environment Setup** (Optional):
   ```bash
   cp .env.docker .env
   # Edit .env with your SMTP credentials for email functionality
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432 (PostgreSQL)

## Services

### Frontend (Port 3000)
- **Technology**: React 19 + Vite
- **Server**: Nginx Alpine
- **Features**: 
  - Production-optimized build
  - Static file caching
  - Security headers
  - API proxy to backend

### Backend (Port 3001)  
- **Technology**: Node.js 18 + Express
- **Database**: PostgreSQL with Prisma ORM
- **Features**:
  - Health checks
  - Automatic database migrations
  - JWT authentication
  - Email services
  - File upload support

### Database (Port 5432)
- **Technology**: PostgreSQL 15 Alpine
- **Features**:
  - Persistent data volumes
  - Health checks
  - Production-ready configuration

## Available Commands

```bash
# Start all services
docker-compose up -d

# Build and start (rebuilds images)
docker-compose up -d --build

# View logs
docker-compose logs
docker-compose logs backend
docker-compose logs frontend

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# Check service status
docker-compose ps

# Execute commands in containers
docker-compose exec backend npm run dev
docker-compose exec backend npx prisma studio
```

## Environment Variables

Create a `.env` file in the root directory with:

```env
# Email Configuration (Required for production)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Override default admin credentials
ADMIN_EMAIL=admin@miabogada.com
ADMIN_PASSWORD=admin123

# Optional: Custom database credentials
POSTGRES_DB=miabogada_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# Optional: Custom ports
FRONTEND_PORT=3000
BACKEND_PORT=3001
POSTGRES_PORT=5432
```

## Database Management

The database runs PostgreSQL with automatic migration deployment on startup.

### Access Database
```bash
# Via container
docker-compose exec postgres psql -U postgres -d miabogada_db

# Via local client (if installed)
psql -h localhost -U postgres -d miabogada_db
```

### Prisma Commands
```bash
# Open Prisma Studio
docker-compose exec backend npx prisma studio

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
docker-compose exec backend npx prisma migrate reset
```

## Production Deployment

For production deployment:

1. **Set production environment variables** in `.env`
2. **Enable SSL/TLS** by uncommenting the nginx service and providing SSL certificates
3. **Use external PostgreSQL** for better performance and reliability
4. **Set up monitoring** and log aggregation

### Production with SSL (Optional)
```bash
# Start with nginx reverse proxy
docker-compose --profile production up -d
```

## Health Checks

All services include health checks:

- **Backend**: GET /api/health
- **Database**: pg_isready command
- **Frontend**: Nginx status

## Volumes

- `postgres_data`: Database files (persistent)
- `backend_uploads`: File uploads (persistent)

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml if 3000/3001/5432 are in use
2. **Permission errors**: Ensure Docker has proper permissions
3. **Database connection**: Wait for PostgreSQL to be healthy before backend starts
4. **Build failures**: Clear Docker cache with `docker system prune -a`

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v --remove-orphans

# Remove all images
docker rmi $(docker images "miabogada*" -q)

# Rebuild from scratch
docker-compose up -d --build
```

## API Endpoints

With the backend running, you can access:

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `POST /api/contacts` - Contact form submission

Complete API documentation available at backend startup logs.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (nginx)       │────│   (Node.js)     │────│   (PostgreSQL)  │
│   Port 3000     │    │   Port 3001     │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

The application is fully containerized with proper service orchestration, health checks, and production optimizations.