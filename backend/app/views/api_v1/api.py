from fastapi import APIRouter
from app.views.api_v1 import projects, websockets, quotations, users

api_router = APIRouter()
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(websockets.router, tags=["websockets"])
api_router.include_router(quotations.router, prefix="/quotations", tags=["quotations"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
