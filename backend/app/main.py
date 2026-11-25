from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.views.api_v1.api import api_router

app = FastAPI(
    title="EstimaTec API",
    description="Backend API for EstimaTec using Supabase.",
    version="1.0.0",
)

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "*"],  # Add frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to EstimaTec API"}

app.include_router(api_router, prefix="/api/v1")
