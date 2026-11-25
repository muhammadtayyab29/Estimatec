from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class QuotationBase(BaseModel):
    projectId: str
    totalValue: float
    margin: float
    agentStatus: str = "Pending"
    adminStatus: str = "Pending"

class QuotationCreate(QuotationBase):
    pass

class QuotationUpdate(BaseModel):
    agentStatus: Optional[str] = None
    adminStatus: Optional[str] = None

class QuotationResponse(QuotationBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
