from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId

class WorldEventModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    prompt: str
    influence_factor: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    active: bool = True

    class Config:
        json_encoders = {ObjectId: str}