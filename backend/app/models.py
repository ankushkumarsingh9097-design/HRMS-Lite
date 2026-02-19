from pydantic import BaseModel, EmailStr, Field, BeforeValidator, ConfigDict
from typing import Optional, Annotated
from datetime import datetime
from bson import ObjectId

# Custom type for handling MongoDB ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

class EmployeeModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    employee_id: str = Field(..., description="Unique Employee ID")
    name: str
    email: EmailStr
    department: str
    created_at: datetime = Field(default_factory=datetime.now)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "employee_id": "E001",
                "name": "John Doe",
                "email": "john@example.com",
                "department": "Engineering"
            }
        }
    )

class AttendanceModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    employee_id: str
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    status: str = Field(..., pattern="^(Present|Absent)$") # Only 'Present' or 'Absent'

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "employee_id": "E001",
                "date": "2023-10-27",
                "status": "Present"
            }
        }
    )
