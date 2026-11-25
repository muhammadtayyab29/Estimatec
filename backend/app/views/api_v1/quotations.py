from fastapi import APIRouter, Depends
from app.models.quotation import QuotationCreate, QuotationUpdate
from app.viewmodels.quotation_vm import QuotationViewModel
from app.core.security import get_current_user
from typing import List

router = APIRouter()

@router.post("/", response_model=dict)
def create_quotation(quotation_in: QuotationCreate, current_user = Depends(get_current_user)):
    """Create a new quotation."""
    return QuotationViewModel.create_quotation(quotation_in)

@router.get("/", response_model=List[dict])
def list_quotations(current_user = Depends(get_current_user)):
    """List all quotations."""
    return QuotationViewModel.get_quotations()

@router.put("/{quotation_id}", response_model=dict)
def update_quotation(quotation_id: str, quotation_in: QuotationUpdate, current_user = Depends(get_current_user)):
    """Update a quotation."""
    return QuotationViewModel.update_quotation(quotation_id, quotation_in)
