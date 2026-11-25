from fastapi import APIRouter, Depends
from app.models.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.viewmodels.project_vm import ProjectViewModel
from app.core.security import get_current_user
from typing import List

router = APIRouter()

@router.post("/", response_model=dict)
def create_project(project_in: ProjectCreate, current_user = Depends(get_current_user)):
    """Create a new project."""
    return ProjectViewModel.create_project(project_in)

@router.get("/", response_model=List[dict])
def list_projects(current_user = Depends(get_current_user)):
    """List all projects."""
    return ProjectViewModel.get_projects()

@router.put("/{project_id}", response_model=dict)
def update_project(project_id: str, project_in: ProjectUpdate, current_user = Depends(get_current_user)):
    """Update a project."""
    return ProjectViewModel.update_project(project_id, project_in)
