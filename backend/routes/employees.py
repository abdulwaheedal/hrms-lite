# File: backend/routes/employees.py
# Purpose: Employee API endpoints with database logic

from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from models.employee import (    #removed backend.
    EmployeeSchema,
    ResponseModel,
    ErrorResponseModel,
)
from database import employee_collection, attendance_collection

router = APIRouter()

# --- Helper Functions ---

async def retrieve_employees():
    employees = []
    async for employee in employee_collection.find():
        # Convert ObjectId to string if needed, or just return the dict
        # We exclude the internal MongoDB _id for cleaner frontend response
        employee["_id"] = str(employee["_id"]) 
        employees.append(employee)
    return employees

async def add_employee(employee_data: dict) -> dict:
    employee = await employee_collection.insert_one(employee_data)
    new_employee = await employee_collection.find_one({"_id": employee.inserted_id})
    new_employee["_id"] = str(new_employee["_id"])
    return new_employee

async def delete_employee(id: str):
    # Find employee by our business logic ID (employee_id), not MongoDB _id
    employee = await employee_collection.find_one({"employee_id": id})
    if employee:
        await employee_collection.delete_one({"employee_id": id})
        # Also delete associated attendance records
        await attendance_collection.delete_many({"employee_id": id})
        return True
    return False

# --- Routes ---

@router.post("/", response_description="Employee data added into the database")
async def add_employee_data(employee: EmployeeSchema = Body(...)):
    employee = jsonable_encoder(employee)
    
    # Check for duplicates
    existing_id = await employee_collection.find_one({"employee_id": employee["employee_id"]})
    if existing_id:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
        
    existing_email = await employee_collection.find_one({"email": employee["email"]})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_employee = await add_employee(employee)
    return ResponseModel(new_employee, "Employee added successfully.")

@router.get("/", response_description="Employees retrieved")
async def get_employees():
    employees = await retrieve_employees()
    if employees:
        return ResponseModel(employees, "Employees data retrieved successfully")
    return ResponseModel(employees, "Empty list returned")

@router.delete("/{id}", response_description="Employee data deleted from the database")
async def delete_employee_data(id: str):
    deleted = await delete_employee(id)
    if deleted:
        return ResponseModel("Employee with ID: {} removed".format(id), "Employee deleted successfully")
    return ErrorResponseModel("An error occurred", 404, "Employee with id {0} doesn't exist".format(id))