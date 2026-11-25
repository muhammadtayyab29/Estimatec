from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    client: str
    zip: str
    description: Optional[str] = ""
    estimatorId: str
    agentId: Optional[str] = None
    status: str = "Draft"
    drawing: Optional[str] = None
    estValue: float = 0.0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    status: Optional[str] = None
    agentId: Optional[str] = None
    drawing: Optional[str] = None
    estValue: Optional[float] = None

class ProjectResponse(ProjectBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
