from fastapi import APIRouter, Depends, HTTPException
from app.viewmodels.user_vm import UserViewModel
from app.core.security import get_current_user
from typing import List
from pydantic import BaseModel

class UserCreate(BaseModel):
    id: str
    email: str
    name: str
    role: str

router = APIRouter()

@router.get("/", response_model=List[dict])
def list_users(current_user = Depends(get_current_user)):
    """List all users."""
    return UserViewModel.get_users()

@router.post("/", response_model=dict)
def create_user(user_in: UserCreate, current_user = Depends(get_current_user)):
    """Create a new user profile."""
    # Safety check: Ensure the creating user matches the token's user id
    if current_user.id != user_in.id:
        raise HTTPException(status_code=403, detail="Not authorized to create this profile")

    # Limit check: Enforce a maximum of 3 Admin accounts in the system
    if user_in.role == "admin":
        from app.core.database import supabase
        response = supabase.table("users").select("id").eq("role", "admin").execute()
        existing_admins = response.data
        if len(existing_admins) >= 3:
            raise HTTPException(
                status_code=400,
                detail="Maximum limit of 3 Admin accounts has been reached."
            )

    return UserViewModel.create_user(user_in.model_dump())

@router.get("/{user_id}", response_model=dict)
def get_user(user_id: str, current_user = Depends(get_current_user)):
    """Get a specific user."""
    return UserViewModel.get_user_by_id(user_id)
