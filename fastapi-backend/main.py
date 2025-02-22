from fastapi import FastAPI
from routes import feed, profile, notifications

# Initialize FastAPI app
app = FastAPI(title="Social API")

# Include routers
app.include_router(feed.router, prefix="/api/v1", tags=["feed"])
app.include_router(profile.router, prefix="/api/v1", tags=["profile"])
app.include_router(notifications.router, prefix="/api/v1", tags=["notifications"])

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}