from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class PostModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    content: str
    author_id: str
    topia_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    likes: int = 0
    comments: List[dict] = []

    @classmethod
    def from_mongo(cls, data: dict):
        """Convert MongoDB document to PostModel"""
        if not data:
            return None
        data_copy = data.copy()
        if "_id" in data_copy:
            data_copy["_id"] = str(data_copy["_id"])
        if "author_id" in data_copy:
            data_copy["author_id"] = str(data_copy["author_id"])
        if "topia_id" in data_copy:
            data_copy["topia_id"] = str(data_copy["topia_id"])
        return cls.model_validate(data_copy)

    model_config = {
        "populate_by_name": True
    }