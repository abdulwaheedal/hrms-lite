# File: backend/routes/attendance.py
# Purpose: Attendance API endpoints

from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from models.attendance import AttendanceSchema #removed backend. from the starting
from models.employee import ResponseModel, ErrorResponseModel #removed backend. from the starting
from database import attendance_collection, employee_collection #removed backend. from the starting
from bson.objectid import ObjectId

router = APIRouter()

# --- Routes ---

@router.post("/", response_description="Attendance marked")
async def mark_attendance(attendance: AttendanceSchema = Body(...)):
    attendance = jsonable_encoder(attendance)
    
    # 1. Validate Employee Exists
    employee = await employee_collection.find_one({"employee_id": attendance["employee_id"]})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # 2. Check for Duplicate Attendance (Same ID + Same Date)
    existing = await attendance_collection.find_one({
        "employee_id": attendance["employee_id"],
        "date": attendance["date"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    # 3. Mark Attendance
    new_attendance = await attendance_collection.insert_one(attendance)
    created_record = await attendance_collection.find_one({"_id": new_attendance.inserted_id})
    created_record["_id"] = str(created_record["_id"])
    
    return ResponseModel(created_record, "Attendance marked successfully.")

@router.get("/", response_description="Retrieve all attendance records")
async def get_attendance():
    records = []
    async for record in attendance_collection.find():
        record["_id"] = str(record["_id"])
        
        # Optional: Enrich with employee name for easier frontend display
        employee = await employee_collection.find_one({"employee_id": record["employee_id"]})
        if employee:
            record["employee_name"] = employee["full_name"]
            
        records.append(record)
        
    return ResponseModel(records, "Attendance records retrieved")

@router.get("/employee/{employee_id}", response_description="Retrieve attendance for specific employee")
async def get_employee_attendance(employee_id: str):
    records = []
    async for record in attendance_collection.find({"employee_id": employee_id}):
        record["_id"] = str(record["_id"])
        records.append(record)
        
    if records:
        return ResponseModel(records, "Attendance records retrieved")
    return ResponseModel(records, "No records found")

# Append to backend/routes/attendance.py


@router.delete("/{id}", response_description="Attendance record deleted")
async def delete_attendance_data(id: str):
    try:
        # Convert string ID to ObjectId
        record = await attendance_collection.find_one({"_id": ObjectId(id)})
        if record:
            await attendance_collection.delete_one({"_id": ObjectId(id)})
            return ResponseModel("Attendance {} removed".format(id), "Attendance deleted successfully")
        return ErrorResponseModel("An error occurred", 404, "Attendance record doesn't exist")
    except Exception as e:
        return ErrorResponseModel("Invalid ID format", 400, "The provided ID is not valid")