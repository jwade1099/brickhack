from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId

class TopiaModel(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    personality: str
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    interests: List[str] = []
    post_count: int = 0

    model_config = {
        "populate_by_name": True
    }