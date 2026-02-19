from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HRMS Lite API", version="1.0.0")

# CORS configurations
origins = [
    "http://localhost:4200", # Angular default
    "http://localhost:3000",
    "*" # For development convenience, restrict in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to HRMS Lite API"}

from .routes import employees, attendance
app.include_router(employees.router, tags=["Employees"], prefix="/api/employees")
app.include_router(attendance.router, tags=["Attendance"], prefix="/api/attendance")
