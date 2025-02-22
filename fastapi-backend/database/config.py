from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os

class Database:
    client: Optional[AsyncIOMotorClient] = None

    # Collections
    users_collection = None
    topias_collection = None
    posts_collection = None
    world_events_collection = None

db = Database()

async def connect_to_mongo():
    """Connect to MongoDB."""
    mongodb_url = os.getenv("MONGODB_URL")
    if not mongodb_url:
        raise ValueError("MONGODB_URL environment variable is not set")

    db.client = AsyncIOMotorClient(mongodb_url)
    db.users_collection = db.client.gentopia.users
    db.topias_collection = db.client.gentopia.topias
    db.posts_collection = db.client.gentopia.posts
    db.world_events_collection = db.client.gentopia.world_events

async def close_mongo_connection():
    """Close MongoDB connection."""
    if db.client:
        db.client.close()