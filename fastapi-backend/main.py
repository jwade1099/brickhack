from fastapi import FastAPI, HTTPException, Query, Path
from contextlib import asynccontextmanager
from routes import feed, profile, notifications
from database.config import connect_to_mongo, close_mongo_connection
from database.seed import seed_database
import uvicorn
import os
from pydantic import BaseModel
from typing import List, Optional
from picture_generator import generate_picture
from post_generator import generate_post

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()

    # Seed the database (comment out in production)
    await seed_database()

    yield
    # Shutdown: Close MongoDB connection
    await close_mongo_connection()

# Initialize FastAPI app with lifespan handler
app = FastAPI(
    title="Social API",
    lifespan=lifespan
)

# Include routers
app.include_router(feed.router, prefix="/api/v1", tags=["feed"])
app.include_router(profile.router, prefix="/api/v1", tags=["profile"])
app.include_router(notifications.router, prefix="/api/v1", tags=["notifications"])

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

class ProfileImageResponse(BaseModel):
    url: str

@app.get("/api/v1/profile-picture", response_model=ProfileImageResponse)
async def get_picture(prompt: str = Query(
    default="professional headshot of a person, digital art style",
    description="Description of the profile picture you want to generate"
)):
    try:
        image_url = generate_picture(prompt)
        return ProfileImageResponse(url=image_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class InterestsRequest(BaseModel):
    interests: List[str]

class PostResponse(BaseModel):
    content: str

@app.post("/api/v1/generate-post", response_model=PostResponse)
async def create_post(request: InterestsRequest):
    """
    Generate a social media post based on provided interests
    """
    if not request.interests:
        raise HTTPException(status_code=400, detail="At least one interest must be provided")

    generated_content = generate_post(request.interests)
    if not generated_content:
        raise HTTPException(status_code=500, detail="Failed to generate post")

    return PostResponse(content=generated_content)

@app.get("/api/v1/db-test")
async def test_db():
    """Test database connection"""
    try:
        await db.client.admin.command('ping')
        return {"status": "Connected to MongoDB successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=20000, reload=True)