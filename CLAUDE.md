# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MIABOGADA** - Full-stack web application for lawyer services (Dra. Angy Tatiana Garzón Fierro) with appointment booking system, admin panel, and business management features.

## Architecture

### Frontend (`/frontend`)
- **Framework**: React 19.1.1 + Vite 7.1.2
- **Styling**: Tailwind CSS v4.1.12
- **Icons**: Lucide React
- **Routing**: React Router DOM v7.8.1
- **UI Library**: SweetAlert2 for notifications
- **State Management**: React Context API + useState

### Backend (`/backend`)
- **Runtime**: Node.js + Express 4.21.2
- **Database**: SQLite with Prisma ORM 6.14.0
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer 7.0.5
- **Security**: Helmet, CORS
- **Development**: Nodemon

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database Management**: DBeaver integration
- **Development**: Hot reload for both frontend/backend

## Development Workflow

### Git Branches
- **`master`** - Production branch (deployed to Railway)
- **`dev`** - Development branch (active development)

### Development Commands

#### Git Workflow
```bash
git checkout dev                    # Switch to development branch
git pull origin dev                # Get latest changes
# Make your changes...
git add .
git commit -m "feat: your changes"
git push origin dev                # Push to dev branch

# When ready for production:
git checkout master
git merge dev
git push origin master            # Deploy to Railway
```

#### Frontend
```bash
cd frontend
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

#### Backend
```bash
cd backend
npm run dev               # Start with nodemon
npm run start            # Production start
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run seed:admin       # Create admin user
```

#### Docker
```bash
docker-compose up --build    # Build and start all services
docker-compose down         # Stop all services
docker-compose restart backend  # Restart specific service
```

## Key Features Implemented

### 1. Appointment Booking System
- **Components**: `AppointmentBookingSection.jsx`, `BookingModal.jsx`, `Calendar.jsx`
- **Business Rules**: Weekdays only, 09:00-17:00 (lunch break 12:00-14:00), next 30 days
- **Integration**: WhatsApp direct contact, email notifications
- **Validation**: Client-side and server-side with Zod schemas

### 2. Admin Panel
- **Components**: `AdminPanel.jsx`, `AdminLogin.jsx`, `AppointmentManagement.jsx`, `ContactManagement.jsx`, `ScheduleSettings.jsx`
- **Authentication**: JWT-based with protected routes (`ProtectedRoute.jsx`)
- **Features**: Appointment management, contact management, business settings, schedule configuration

### 3. Business Configuration
- **Context**: `BusinessConfigContext.jsx` - Centralized business settings
- **Settings**: Business hours, contact info, consultation types, pricing
- **Integration**: Header, Footer, and booking components use business config

### 4. Core Website Sections
- **Components**: `Header.jsx`, `HeroSection.jsx`, `ServicesSection.jsx`, `AboutSection.jsx`, `TestimonialsSection.jsx`, `ContactSection.jsx`, `Footer.jsx`
- **Features**: Responsive design, WhatsApp integration (`WhatsAppButton.jsx`)

## Database Schema (Prisma)

### Key Models
- **User**: Admin authentication
- **Appointment**: Booking records with client info
- **Contact**: Contact form submissions  
- **Settings**: Business configuration (hours, contact info, etc.)

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - Admin login
- `POST /logout` - Admin logout

### Appointments (`/api/appointments`)
- `GET /` - List appointments (admin only)
- `POST /` - Create appointment
- `PUT /:id` - Update appointment (admin only)
- `DELETE /:id` - Delete appointment (admin only)

### Contacts (`/api/contacts`)
- `GET /` - List contacts (admin only)
- `POST /` - Create contact submission
- `DELETE /:id` - Delete contact (admin only)

### Settings (`/api/settings`)
- `GET /` - Get business settings
- `PUT /` - Update settings (admin only)

### Schedule (`/api/schedule`)
- `GET /available-slots` - Get available time slots

## Recent Major Updates

1. **SweetAlert2 Integration** (`utils/sweetAlert.js`) - Enhanced user notifications
2. **Business Config Context** - Centralized configuration management
3. **Major Booking System Enhancement** - Improved appointment flow and validation
4. **Complete Admin System** - Full CRUD operations for appointments/contacts
5. **Docker Integration** - Complete containerization setup
6. **Testing Suite** - Comprehensive backend testing with documentation

## File Structure Highlights

```
/frontend/src/
├── components/          # All React components
├── contexts/           # React contexts (Auth, BusinessConfig)
├── utils/             # Utility functions (sweetAlert)
├── App.jsx            # Main app with state management
└── main.jsx           # React root

/backend/src/
├── controllers/       # Route handlers
├── middleware/        # Auth middleware
├── routes/           # Express routes
├── services/         # Email service
└── utils/            # Database utilities, validation

/backend/prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations
```

## Important Notes

- **Main App State**: `frontend/src/App.jsx` manages global state for booking system
- **Authentication**: Uses JWT with AuthContext for admin panel access  
- **Business Logic**: Centralized in BusinessConfigContext, consumed by multiple components
- **Database**: SQLite for development, easily configurable for production PostgreSQL
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Docker Ready**: Complete containerization for development and production