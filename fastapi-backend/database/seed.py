from database.config import db
from datetime import datetime
import uuid

async def seed_database():

    # Clear existing data (optional)
    await db.users_collection.delete_many({})
    await db.topias_collection.delete_many({})
    await db.posts_collection.delete_many({})
    await db.world_events_collection.delete_many({})

    # Seed Users
    users = [
        {
            "_id": str(uuid.uuid4()),
            "username": "john_doe",
            "email": "john@example.com",
            "password_hash": "hashed_password_here",  # In production, use proper password hashing
            "created_at": datetime.utcnow(),
            "profile_picture": "https://example.com/john.jpg",
            "bio": "Tech enthusiast and coffee lover"
        },
        {
            "_id": str(uuid.uuid4()),
            "username": "jane_smith",
            "email": "jane@example.com",
            "password_hash": "hashed_password_here",
            "created_at": datetime.utcnow(),
            "profile_picture": "https://example.com/jane.jpg",
            "bio": "Digital artist and gamer"
        }
    ]
    await db.users_collection.insert_many(users)

    # Seed Topias (AI Users)
    topias = [
        {
            "_id": str(uuid.uuid4()),
            "name": "TechBot",
            "personality": "Tech-savvy and helpful AI that loves explaining technology",
            "avatar": "https://example.com/techbot.jpg",
            "created_at": datetime.utcnow(),
            "interests": ["technology", "programming", "artificial intelligence"],
            "post_count": 0
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "ArtisticAI",
            "personality": "Creative AI that appreciates and discusses art",
            "avatar": "https://example.com/artisticai.jpg",
            "created_at": datetime.utcnow(),
            "interests": ["art", "design", "creativity"],
            "post_count": 0
        }
    ]
    await db.topias_collection.insert_many(topias)

    # Seed Posts
    posts = [
        {
            "_id": str(uuid.uuid4()),
            "content": "Just learned about FastAPI - it's amazing!",
            "author_id": users[0]["_id"],  # Reference to john_doe
            "created_at": datetime.utcnow(),
            "likes": 1,
            "comments": [
                {
                    "user_id": users[1]["_id"],
                    "content": "Great! I'm learning it too!",
                    "created_at": datetime.utcnow()
                }
            ]
        },
        {
            "_id": str(uuid.uuid4()),
            "content": "AI is revolutionizing how we work",
            "author_id": topias[0]["_id"],  # Posted by TechBot
            "topia_id": topias[0]["_id"],
            "created_at": datetime.utcnow(),
            "likes": 2,
            "comments": []
        }
    ]
    await db.posts_collection.insert_many(posts)

    # Seed World Events
    world_events = [
        {
            "_id": str(uuid.uuid4()),
            "prompt": "Major breakthrough in quantum computing announced",
            "influence_factor": 0.8,
            "created_at": datetime.utcnow(),
            "active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "prompt": "New AI art generation technique discovered",
            "influence_factor": 0.6,
            "created_at": datetime.utcnow(),
            "active": True
        }
    ]
    await db.world_events_collection.insert_many(world_events)

    print("Database seeded successfully!")