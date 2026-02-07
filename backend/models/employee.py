# File: backend/models/employee.py
# Purpose: Pydantic model for Employee with STRICT validation

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
import re

class EmployeeSchema(BaseModel):
    # ID must be alphanumeric (e.g., EMP001), no spaces or special chars
    employee_id: str = Field(..., pattern="^[a-zA-Z0-9]+$", description="Alphanumeric ID only")
    
    # Name must be alphabets and spaces only
    full_name: str = Field(..., pattern="^[a-zA-Z\s]+$", description="Alphabets only")
    
    email: EmailStr = Field(..., description="Valid Email Address")
    
    department: str = Field(..., min_length=1, description="Department Name")

    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "john@example.com",
                "department": "Engineering"
            }
        }

class UpdateEmployeeSchema(BaseModel):
    full_name: Optional[str]
    email: Optional[EmailStr]
    department: Optional[str]

    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "John Doe",
                "email": "john_new@example.com",
                "department": "HR"
            }
        }

def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }

def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}