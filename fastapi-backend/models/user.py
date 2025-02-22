from pydantic import BaseModel, Field, GetJsonSchemaHandler
from typing import Optional, Any, Annotated
from datetime import datetime
from bson import ObjectId
from pydantic_core import CoreSchema, core_schema

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, (str, ObjectId)):
            raise TypeError('ObjectId required')
        if isinstance(v, str):
            try:
                ObjectId(v)
            except Exception:
                raise ValueError('Invalid ObjectId')
        return str(v)

    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: GetJsonSchemaHandler
    ) -> CoreSchema:
        return core_schema.str_schema()

class UserModel(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
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