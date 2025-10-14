# Healthcare Clinic Appointment Scheduler

A modern, professional healthcare clinic appointment scheduling system built with Angular 17 and Node.js.

## Features

- **Modern UI/UX**: Clean, professional design with Material Design components
- **Role-based Authentication**: Admin, Doctor, and Patient roles with JWT security
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Real-time Updates**: Live appointment status and notifications
- **Advanced Filtering**: Smart search and filtering capabilities
- **Dashboard Analytics**: Comprehensive overview with statistics and charts

## Tech Stack

### Frontend
- Angular 17+ (Standalone Components)
- Angular Material UI
- TypeScript
- SCSS
- NgRx (State Management)
- Chart.js (Data Visualization)

### Backend
- Node.js + Express
- PostgreSQL Database
- JWT Authentication
- Bcrypt Password Hashing
- CORS & Helmet Security

## Database Setup

1. Install PostgreSQL
2. Create database: `clinic`
3. Update credentials in `backend/config/database.js`:
   - Username: `postgres`
   - Password: `admin`
   - Database: `clinic`

4. Run the schema:
```sql
psql -U postgres -d clinic -f backend/schema.sql
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development servers:
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run server  # Backend on port 3000
npm start       # Frontend on port 4200
```

## Default Login Credentials

- **Admin**: admin@clinic.com / password
- **Doctor**: dr.smith@clinic.com / password  
- **Patient**: patient@example.com / password

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, guards, interceptors
│   ├── shared/               # Shared components and utilities
│   ├── features/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── dashboard/       # Dashboard
│   │   ├── appointments/    # Appointment management
│   │   ├── patients/        # Patient management
│   │   ├── doctors/         # Doctor management
│   │   └── reports/         # Reports and analytics
│   └── ...
backend/
├── config/                   # Database configuration
├── routes/                   # API routes
├── models/                   # Data models
├── middleware/               # Custom middleware
└── server.js                # Main server file
```

## Key Features

### Authentication & Security
- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- Secure HTTP headers with Helmet

### Dashboard
- Real-time statistics
- Quick action buttons
- Responsive grid layout
- Visual data representation

### Appointment Management
- Create, read, update, delete appointments
- Status tracking (scheduled, confirmed, completed, etc.)
- Doctor and patient association
- Time slot management

### Modern UI/UX
- Material Design components
- Responsive layout
- Loading states and animations
- Error handling with user feedback
- Accessibility compliance (WCAG 2.1 AA)

## Development

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier code formatting
- Component-based architecture

### Testing
- Unit tests with Jasmine/Karma
- E2E tests ready for Cypress
- Test coverage reporting

### Performance
- Lazy loading modules
- OnPush change detection
- Optimized bundle size
- Progressive Web App ready

## Deployment

### Production Build
```bash
ng build --prod
```

### Docker Support
```dockerfile
# Multi-stage build ready
# Environment configuration
# Health checks included
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details