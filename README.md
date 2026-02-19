# HRMS Lite

A lightweight Human Resource Management System built with **Angular** (Frontend), **FastAPI** (Backend), and **MongoDB**.

## Features

- **Employee Management**:
  - Add new employees (Name, Email, Dept, ID).
  - List all employees.
  - Delete employees.
- **Attendance Management**:
  - Mark daily attendance (Present/Absent).
  - View attendance history by employee.
- **Responsive UI**: Clean, modern interface using TailwindCSS.

## Tech Stack

- **Frontend**: Angular 19+, TailwindCSS
- **Backend**: Python 3.9+, FastAPI, Uvicorn
- **Database**: MongoDB (via Motor async driver)

## Prerequisites

- Python 3.9 or higher
- Node.js & npm
- MongoDB (running locally on port 27017, or update `.env`)

## Installation & Setup

### 1. Backend Setup

Open a terminal in the `backend` folder:

```bash
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
# Note: Use the venv python/uvicorn if global is not found
.\venv\Scripts\uvicorn app.main:app --reload
```

The Backend API will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup

Open a new terminal in the `frontend` folder:

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
ng serve
```

The Application will be available at: `http://localhost:4200`

## API Endpoints

- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Add a new employee
- `DELETE /api/employees/{id}` - Delete an employee
- `POST /api/attendance/` - Mark attendance
- `GET /api/attendance/{employee_id}` - Get attendance history

## Assumptions and Limitations

- **Local MongoDB**: The application assumes a local instance of MongoDB is running on port 27017.
- **No Authentication**: This is a "Lite" version and does not currently implement user authentication or role-based access control. All APIs are open.
- **Network Dependency**: The Frontend assumes the Backend is available at `http://localhost:8000` (default) or the URL specified in environment files.
- **Development Focus**: CORS settings in the backend are currently permissive (`*`) for development convenience and should be restricted for production.

## Project Structure

```
HRMS Lite/
├── backend/
│   ├── app/
│   │   ├── main.py          # App entry point
│   │   ├── database.py      # DB connection
│   │   ├── models.py        # Pydantic models
│   │   └── routes/          # API endpoints
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Angular components
    │   │   ├── services/    # API service
    │   │   └── ...
    └── tailwind.config.js
```
