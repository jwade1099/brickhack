from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    try:
        # Get MongoDB URL
        mongodb_url = os.getenv("MONGODB_URL")
        if not mongodb_url:
            raise ValueError("MONGODB_URL environment variable is not set")

        logger.info("Attempting to connect to MongoDB...")

        # Create client
        db.client = AsyncIOMotorClient(mongodb_url)

        # Verify connection by making a simple query
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB!")

        # Initialize collections
        db.users_collection = db.client.gentopia.users
        db.topias_collection = db.client.gentopia.topias
        db.posts_collection = db.client.gentopia.posts
        db.world_events_collection = db.client.gentopia.world_events

        # Log collection initialization
        logger.info("Collections initialized:")
        logger.info(f"- Users Collection: {db.users_collection.name}")
        logger.info(f"- Topias Collection: {db.topias_collection.name}")
        logger.info(f"- Posts Collection: {db.posts_collection.name}")
        logger.info(f"- World Events Collection: {db.world_events_collection.name}")

    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection."""
    try:
        if db.client:
            db.client.close()
            logger.info("MongoDB connection closed successfully")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {str(e)}")