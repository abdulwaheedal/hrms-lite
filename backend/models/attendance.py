# File: backend/models/attendance.py
# Purpose: Pydantic model for Attendance with validation

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class AttendanceSchema(BaseModel):
    employee_id: str = Field(..., description="ID of the employee")
    date: str = Field(..., description="Date of attendance (YYYY-MM-DD)")
    status: str = Field(..., pattern="^(Present|Absent)$", description="Status: Present or Absent")

    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "date": "2026-02-07",
                "status": "Present"
            }
        }