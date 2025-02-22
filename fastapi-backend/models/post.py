from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId

class PostModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    content: str
    author_id: PyObjectId
    topia_id: Optional[PyObjectId] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    likes: List[PyObjectId] = []
    comments: List[dict] = []

    class Config:
        json_encoders = {ObjectId: str}