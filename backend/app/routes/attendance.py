from fastapi import APIRouter, HTTPException, Body
from fastapi.encoders import jsonable_encoder
from app.models import AttendanceModel
from app.database import db
from bson import ObjectId

router = APIRouter()

@router.post("/", response_description="Mark attendance", response_model=AttendanceModel)
async def mark_attendance(attendance: AttendanceModel = Body(...)):
    # Use model_dump to get a clean dictionary, excluding the id field
    attendance_data = attendance.model_dump(by_alias=True, exclude=["id"])
    
    # Check if attendance already marked for this employee on this date
    existing_record = await db["attendance"].find_one({
        "employee_id": attendance_data["employee_id"],
        "date": attendance_data["date"]
    })
    
    if existing_record:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    # Verify employee exists
    # Note: We query by 'employee_id' (the string ID e.g., 'E001'), not the MongoDB '_id'
    if not await db["employees"].find_one({"employee_id": attendance_data["employee_id"]}):
         raise HTTPException(status_code=404, detail="Employee not found")

    new_attendance = await db["attendance"].insert_one(attendance_data)
    created_attendance = await db["attendance"].find_one({"_id": new_attendance.inserted_id})
    return created_attendance

@router.get("/", response_description="List all attendance records", response_model=list[AttendanceModel])
async def list_attendance():
    attendance_records = await db["attendance"].find().to_list(1000)
    return attendance_records

@router.get("/{employee_id}", response_description="Get attendance for an employee", response_model=list[AttendanceModel])
async def get_attendance(employee_id: str):
    # Query by the business key 'employee_id', not the MongoDB '_id'
    attendance_records = await db["attendance"].find({"employee_id": employee_id}).to_list(1000)
    return attendance_records
