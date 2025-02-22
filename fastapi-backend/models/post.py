from pydantic import BaseModel, Field
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId

class PostModel(BaseModel):
    id: Annotated[ObjectId, PyObjectId] = Field(default_factory=ObjectId, alias="_id")
    content: str
    author_id: Annotated[ObjectId, PyObjectId]
    topia_id: Optional[Annotated[ObjectId, PyObjectId]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    likes: int = 0
    comments: List[dict] = []

    model_config = {
        "json_encoders": {ObjectId: str},
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }