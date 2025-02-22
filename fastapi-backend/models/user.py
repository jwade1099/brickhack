from pydantic import BaseModel, Field, GetJsonSchemaHandler
from typing import Optional, Any, Annotated
from datetime import datetime
from bson import ObjectId
from pydantic_core import CoreSchema, core_schema

class PyObjectId:
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: GetJsonSchemaHandler,
    ) -> CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.no_info_plain_validator_function(
                    lambda x: ObjectId(x) if not isinstance(x, ObjectId) else x
                )
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x) if isinstance(x, ObjectId) else x,
                info_arg=False,
                return_schema=core_schema.str_schema()
            ),
        )

class UserModel(BaseModel):
    id: Annotated[ObjectId, PyObjectId] = Field(default_factory=ObjectId, alias="_id")
    username: str
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    profile_picture: Optional[str] = None
    bio: Optional[str] = None

    model_config = {
        "arbitrary_types_allowed": True,
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