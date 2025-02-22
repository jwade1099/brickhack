from fastapi import FastAPI, HTTPException, Query, Path
from routes import feed, profile, notifications
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from picture_generator import generate_picture
from post_generator import generate_post

# Initialize FastAPI app
app = FastAPI(title="Social API")

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)