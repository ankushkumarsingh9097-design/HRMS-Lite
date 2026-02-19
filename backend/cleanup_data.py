import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load env vars
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "hrms_lite")

async def delete_corrupted_employee():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Target specific employee by employee_id as _id is null/inaccessible via API
    target_employee_id = "Qui omnis est dolor"
    
    print(f"Attempting to delete employee with employee_id: {target_employee_id}")
    
    result = await db["employees"].delete_one({"employee_id": target_employee_id})
    
    if result.deleted_count > 0:
        print(f"Successfully deleted {result.deleted_count} document(s).")
    else:
        print("No documents found with that employee_id.")

if __name__ == "__main__":
    asyncio.run(delete_corrupted_employee())
