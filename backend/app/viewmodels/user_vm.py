from app.core.database import supabase
from app.core.mapping import to_db, to_frontend
from fastapi import HTTPException

class UserViewModel:
    @staticmethod
    def get_users():
        response = supabase.table("users").select("*").execute()
        return to_frontend(response.data)

    @staticmethod
    def get_user_by_id(user_id: str):
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return to_frontend(response.data[0])

    @staticmethod
    def create_user(user_data: dict):
        db_data = to_db(user_data)
        response = supabase.table("users").insert(db_data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create user profile")
        return to_frontend(response.data[0])

