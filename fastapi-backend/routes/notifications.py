from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()

@router.get("/notifications", response_model=List[dict])
async def get_notifications():
    """Get user notifications"""
    return []

@router.post("/notifications/mark-read/{notification_id}")
async def mark_notification_read(notification_id: int):
    """Mark a notification as read"""
    return {"message": f"Notification {notification_id} marked as read"}

@router.delete("/notifications/{notification_id}")
async def delete_notification(notification_id: int):
    """Delete a notification"""
    return {"message": f"Notification {notification_id} deleted"} 