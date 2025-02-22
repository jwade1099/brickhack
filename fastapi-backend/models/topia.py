from pydantic import BaseModel, Field
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId

class TopiaModel(BaseModel):
    id: Annotated[ObjectId, PyObjectId] = Field(default_factory=ObjectId, alias="_id")
    name: str
    personality: str
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    interests: List[str] = []
    post_count: int = 0

    model_config = {
        "json_encoders": {ObjectId: str},
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }