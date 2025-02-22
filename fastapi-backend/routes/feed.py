from fastapi import APIRouter, HTTPException
from typing import List, Dict
from database.config import db
from models.post import PostModel
from bson import ObjectId
from datetime import datetime
import copy

router = APIRouter()

def convert_objectids_to_strings(post: Dict) -> Dict:
    """Convert ObjectId fields to strings in a post dict"""
    # Make a deep copy to avoid modifying the original
    post_copy = copy.deepcopy(post)
    post_copy["_id"] = str(post_copy["_id"])
    post_copy["author_id"] = str(post_copy["author_id"])
    if post_copy.get("topia_id"):
        post_copy["topia_id"] = str(post_copy["topia_id"])
    return post_copy

@router.get("/feed", response_model=List[PostModel])
async def get_feed():
    """Get user's feed items"""
    try:
        cursor = db.posts_collection.find().sort("created_at", -1)
        posts = await cursor.to_list(length=20)

        # Convert each post's ObjectIds to strings
        converted_posts = [convert_objectids_to_strings(post) for post in posts]
        return [PostModel.parse_obj(post) for post in converted_posts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feed/post", response_model=PostModel)
async def create_post(post: PostModel):
    """Create a new post"""
    try:
        post_dict = post.dict(by_alias=True)
        post_dict["_id"] = ObjectId(post_dict["_id"])
        post_dict["author_id"] = ObjectId(post_dict["author_id"])
        if post_dict.get("topia_id"):
            post_dict["topia_id"] = ObjectId(post_dict["topia_id"])

        post_dict["created_at"] = datetime.utcnow()
        result = await db.posts_collection.insert_one(post_dict)

        created_post = await db.posts_collection.find_one({"_id": result.inserted_id})
        if created_post:
            converted_post = convert_objectids_to_strings(created_post)
            return PostModel.parse_obj(converted_post)
        raise HTTPException(status_code=404, detail="Post creation failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/feed/{post_id}")
async def delete_post(post_id: str):
    """Delete a post"""
    try:
        result = await db.posts_collection.delete_one({"_id": ObjectId(post_id)})
        if result.deleted_count:
            return {"message": f"Post {post_id} deleted"}
        raise HTTPException(status_code=404, detail="Post not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/feed/{post_id}", response_model=PostModel)
async def get_post(post_id: str):
    """Get a specific post"""
    try:
        post = await db.posts_collection.find_one({"_id": ObjectId(post_id)})
        if post:
            converted_post = convert_objectids_to_strings(post)
            return PostModel.parse_obj(converted_post)
        raise HTTPException(status_code=404, detail="Post not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/feed/{post_id}/like")
async def like_post(post_id: str):
    """Increment like count for a post"""
    try:
        post_object_id = ObjectId(post_id)

        # Check if post exists
        post = await db.posts_collection.find_one({"_id": post_object_id})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Increment like count
        result = await db.posts_collection.update_one(
            {"_id": post_object_id}, {"$inc": {"likes": 1}}
        )

        if result.modified_count:
            return {"message": "Post liked successfully"}
        raise HTTPException(status_code=400, detail="Like operation failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/feed/{post_id}/unlike")
async def unlike_post(post_id: str):
    """Decrement like count for a post"""
    try:
        post_object_id = ObjectId(post_id)

        # Check if post exists and has likes > 0
        post = await db.posts_collection.find_one({"_id": post_object_id})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if post.get("likes", 0) <= 0:
            raise HTTPException(status_code=400, detail="Post has no likes to remove")

        # Decrement like count
        result = await db.posts_collection.update_one(
            {"_id": post_object_id}, {"$inc": {"likes": -1}}
        )

        if result.modified_count:
            return {"message": "Post unliked successfully"}
        raise HTTPException(status_code=400, detail="Unlike operation failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
