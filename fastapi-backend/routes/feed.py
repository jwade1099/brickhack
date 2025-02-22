from fastapi import APIRouter, HTTPException
from typing import List
from database.config import db
from models.post import PostModel
from bson import ObjectId
from datetime import datetime

router = APIRouter()


@router.get("/feed", response_model=List[PostModel])
async def get_feed():
    """Get user's feed items"""
    try:
        # Fetch posts from MongoDB, sorted by creation date
        cursor = db.posts_collection.find().sort("created_at", -1)
        posts = await cursor.to_list(length=20)  # Limit to 20 posts
        return [PostModel(**post) for post in posts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feed/post", response_model=PostModel)
async def create_post(post: PostModel):
    """Create a new post"""
    try:
        post_dict = post.dict(by_alias=True)
        post_dict["created_at"] = datetime.utcnow()

        result = await db.posts_collection.insert_one(post_dict)

        # Fetch and return the created post
        created_post = await db.posts_collection.find_one({"_id": result.inserted_id})
        if created_post:
            return PostModel(**created_post)
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
            return PostModel(**post)
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
