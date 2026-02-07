# HRMS Lite

A lightweight Human Resource Management System built with modern web technologies. This application provides essential HR functionality including employee management and attendance tracking with a responsive, intuitive interface.

### NOTE

The backend is hosted on a free tier. Please allow ~1 minute for the initial load if the service has been inactive.

---

## Overview

HRMS Lite is designed to be a minimal yet functional HR management solution suitable for small to medium-sized organizations. The system separates concerns with a robust FastAPI backend and a modern React frontend, providing a seamless experience for HR operations.

### Key Features

- **Employee Management**: Add, view, update, and delete employee records with full data validation
- **Attendance Tracking**: Mark daily attendance with batch processing capabilities and detailed records
- **Dashboard**: Real-time overview of key metrics including employee count and attendance statistics
- **Filtering & Analytics**: Advanced filtering by date range and employee, with attendance percentage calculations
- **Data Validation**: Strict input validation on both frontend and backend for data integrity
- **Responsive Design**: Fully responsive UI that works seamlessly across desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling with user-friendly feedback messages

---

## Technology Stack

### Backend

- **Framework**: FastAPI 0.100.0+
- **Runtime**: Python 3.11
- **Database**: MongoDB with Motor (async driver)
- **Server**: Uvicorn 0.22.0
- **Data Validation**: Pydantic 2.1.1+

### Frontend

- **Framework**: React 19.2.0
- **Language**: TypeScript ~5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **HTTP Client**: Axios 1.13.4
- **Routing**: React Router DOM 7.13.0
- **Icons**: Lucide React 0.563.0

---

## Project Structure

```
abdulwaheedal-hrms-lite/
├── runtime.txt                 # Python version specification
├── .env.local                  # Local environment variables
│
├── backend/
│   ├── main.py                # FastAPI application entry point
│   ├── database.py            # MongoDB connection configuration
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   ├── models/
│   │   ├── employee.py        # Employee schema and validators
│   │   └── attendance.py      # Attendance schema and validators
│   └── routes/
│       ├── employees.py       # Employee API endpoints
│       └── attendance.py      # Attendance API endpoints
│
└── frontend/
    ├── package.json           # JavaScript dependencies
    ├── vite.config.ts         # Vite build configuration
    ├── tsconfig.*.json        # TypeScript configurations
    ├── index.html             # HTML entry point
    ├── eslint.config.js       # ESLint configuration
    │
    └── src/
        ├── main.tsx           # React application entry
        ├── App.tsx            # Main application component
        ├── index.css          # Global styles
        │
        ├── components/
        │   ├── Navbar.tsx     # Navigation bar with routing
        │   ├── EmployeeForm.tsx
        │   ├── EmployeeList.tsx
        │   ├── AttendanceForm.tsx
        │   └── AttendanceList.tsx
        │
        ├── pages/
        │   ├── Dashboard.tsx   # Dashboard with statistics
        │   ├── Employees.tsx   # Employee management page
        │   └── Attendance.tsx  # Attendance management page
        │
        ├── services/
        │   └── api.ts         # Axios-based API client
        │
        └── types/
            └── index.ts       # TypeScript interfaces and types
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 16+ and npm/yarn
- MongoDB (local or Atlas cloud)
- Git

### Backend Setup

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your MongoDB URI:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms_lite
   PORT=8000
   ENVIRONMENT=development
   ```

5. **Start the backend server**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   Create a `.env.local` file if using a non-default API URL:

   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

---

## API Documentation

### Base URL

```
http://localhost:8000
```

### Employee Endpoints

**Create Employee**

```
POST /employees/
Content-Type: application/json

{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

**Get All Employees**

```
GET /employees/
```

**Delete Employee**

```
DELETE /employees/{employee_id}
```

### Attendance Endpoints

**Mark Attendance**

```
POST /attendance/
Content-Type: application/json

{
  "employee_id": "EMP001",
  "date": "2026-02-07",
  "status": "Present"
}
```

**Get All Attendance Records**

```
GET /attendance/
```

**Get Attendance by Employee**

```
GET /attendance/employee/{employee_id}
```

**Delete Attendance Record**

```
DELETE /attendance/{id}
```

---

## Data Validation

### Employee Validation Rules

- **employee_id**: Alphanumeric characters only (e.g., `EMP001`)
- **full_name**: Letters and spaces only (e.g., `John Doe`)
- **email**: Valid email format (validated using EmailStr)
- **department**: Non-empty string

### Attendance Validation Rules

- **employee_id**: Must reference an existing employee
- **date**: YYYY-MM-DD format
- **status**: Either "Present" or "Absent"
- **Duplicate Prevention**: Same employee cannot have multiple attendance records on the same date

---

## Features in Detail

### Dashboard

- View total employee count with quick actions
- View total attendance records
- Navigate to employee management and attendance marking
- Real-time statistics refresh

### Employee Management

- Add new employees with validation feedback
- View all employees in a sortable table
- Delete employees (cascades to attendance records)
- Duplicate prevention for employee IDs and emails

### Attendance Tracking

- Individual attendance marking with form
- Batch attendance marking for all employees at once
- Toggle status (Present/Absent) with visual feedback
- View historical attendance records
- Advanced filtering by date range and employee
- Calculate attendance statistics (total, present, absent, percentage)
- Delete attendance records with confirmation

### User Interface

- Clean, modern design using Tailwind CSS
- Responsive layout for all screen sizes
- Loading states and skeleton screens
- Success and error notifications
- Disabled states for pending operations
- Accessibility considerations with proper labeling

---

## Error Handling

The application implements comprehensive error handling:

**Frontend Error Handling**

- Axios error interceptors for API failures
- User-friendly error messages
- Input validation with real-time feedback
- Loading states to prevent duplicate submissions

**Backend Error Handling**

- Pydantic validation errors with detailed messages
- HTTP exceptions with appropriate status codes
- MongoDB connection error handling
- Duplicate record prevention with 400 status codes
- Not found errors with 404 status codes

---

## Development

### Running Tests

Backend tests (when available):

```bash
cd backend
pytest
```

Frontend linting:

```bash
cd frontend
npm run lint
```

### Building for Production

**Backend**

```bash
# Set environment to production
ENVIRONMENT=production
# The FastAPI server can be deployed with uvicorn or gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

**Frontend**

```bash
cd frontend
npm run build
# Output will be in the dist/ directory
```

---

## Environment Configuration

### Backend Variables

| Variable      | Description               | Example                                                 |
| ------------- | ------------------------- | ------------------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/hrms_lite` |
| `PORT`        | Server port               | `8000`                                                  |
| `ENVIRONMENT` | Deployment environment    | `development` or `production`                           |

### Frontend Variables

| Variable       | Description     | Default                 |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

---

## Deployment

### Vercel (Frontend)

1. Push frontend code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with automatic CI/CD

### Render (Backend)

1. Set environment variables
2. Configure Python buildpack
3. Deploy using Git or container registry
4. MongoDB Atlas for cloud database

---

## Performance Considerations

- Async database operations with Motor for non-blocking I/O
- Batch attendance marking to reduce API calls
- Memoized computed values in React components
- Lazy loading of data with loading states
- Indexed MongoDB collections for faster queries

---

## Security

- CORS middleware configured for trusted origins
- Email validation with EmailStr
- Input pattern validation on both client and server
- HTTP-only cookie support (can be added)
- Environment variables for sensitive data

---

## Troubleshooting

**Backend connection issues**

- Verify MongoDB URI in `.env.local`
- Check MongoDB Atlas IP whitelist
- Ensure Python 3.11 is installed

**Frontend API errors**

- Confirm backend is running on correct port
- Check CORS origin configuration
- Verify `VITE_API_URL` environment variable

**Port conflicts**

- Backend: Change PORT in `.env.local` and update frontend API URL
- Frontend: Vite will use next available port

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Future Enhancements

- User authentication and authorization
- Department management
- Payroll integration
- Leave management
- Performance reviews
- Export attendance reports (PDF/Excel)
- Email notifications
- Mobile app (React Native)
- Advanced analytics dashboard
- Multi-language support

---

## Support

For issues, feature requests, or questions:

- Open an issue on the repository
- Review existing documentation
- Check the API documentation above

---

## Acknowledgments

Built with best practices in modern full-stack web development:

- FastAPI for high-performance async Python
- React for dynamic user interfaces
- TypeScript for type-safe JavaScript
- Tailwind CSS for utility-first styling
- MongoDB for flexible data storage

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: Active Development
