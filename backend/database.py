# File: backend/database.py
# Purpose: MongoDB database connection using Motor (Async)

from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variables
MONGO_DETAILS = os.getenv("MONGODB_URI")

# Create database client
client = AsyncIOMotorClient(MONGO_DETAILS)

# Connect to the specific database
database = client.hrms_lite

# Collection references
employee_collection = database.get_collection("employees")
attendance_collection = database.get_collection("attendance")

def get_database():
    """
    Return database instance
    """
    return database