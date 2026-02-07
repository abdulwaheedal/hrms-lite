# File: backend/main.py
# Purpose: Main FastAPI application entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.employees import router as EmployeeRouter
from routes.attendance import router as AttendanceRouter

app = FastAPI()

# Origins that are allowed to make requests to this API
# In production, replace ["*"] with your actual frontend domain
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routes
app.include_router(EmployeeRouter, tags=["Employees"], prefix="/employees")
app.include_router(AttendanceRouter, tags=["Attendance"], prefix="/attendance")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the HRMS Lite API"}