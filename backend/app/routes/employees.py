from fastapi import APIRouter, HTTPException, Body
from fastapi.encoders import jsonable_encoder
from app.models import EmployeeModel
from app.database import db
from bson import ObjectId

router = APIRouter()

@router.post("/", response_description="Add new employee", response_model=EmployeeModel)
async def create_employee(employee: EmployeeModel = Body(...)):
    employee_data = employee.model_dump(by_alias=True, exclude=["id"])
    
    # Check for duplicate employee_id
    if await db["employees"].find_one({"employee_id": employee_data["employee_id"]}):
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    new_employee = await db["employees"].insert_one(employee_data)
    created_employee = await db["employees"].find_one({"_id": new_employee.inserted_id})
    return created_employee

@router.get("/", response_description="List all employees", response_model=list[EmployeeModel])
async def list_employees():
    employees = await db["employees"].find().to_list(1000)
    return employees

@router.get("/{id}", response_description="Get a single employee", response_model=EmployeeModel)
async def get_employee(id: str):
    if ObjectId.is_valid(id):
        if (employee := await db["employees"].find_one({"_id": ObjectId(id)})) is not None:
            return employee
    raise HTTPException(status_code=404, detail="Employee not found")

@router.put("/{id}", response_description="Update an employee", response_model=EmployeeModel)
async def update_employee(id: str, employee: EmployeeModel = Body(...)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    # Filter out None values to only update sent fields
    employee_data = {k: v for k, v in employee.model_dump(exclude=["id"]).items() if v is not None}
    
    if len(employee_data) >= 1:
        update_result = await db["employees"].update_one({"_id": ObjectId(id)}, {"$set": employee_data})
        if update_result.modified_count == 1:
            if (updated_employee := await db["employees"].find_one({"_id": ObjectId(id)})) is not None:
                return updated_employee

    if (existing_employee := await db["employees"].find_one({"_id": ObjectId(id)})) is not None:
        return existing_employee

    raise HTTPException(status_code=404, detail="Employee not found")

@router.delete("/{id}", response_description="Delete an employee")
async def delete_employee(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    delete_result = await db["employees"].delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 1:
        return {"message": "Employee deleted successfully"}

    raise HTTPException(status_code=404, detail="Employee not found")
