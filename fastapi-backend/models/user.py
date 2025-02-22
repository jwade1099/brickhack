from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class UserModel(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    username: str
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    profile_picture: Optional[str] = None
    bio: Optional[str] = None

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "username": "john_doe",
                "email": "john@example.com",
                "password_hash": "hashed_password",
                "created_at": "2024-03-17T00:00:00",
                "profile_picture": "https://example.com/pic.jpg",
                "bio": "Hello world"
            }
        }
    }