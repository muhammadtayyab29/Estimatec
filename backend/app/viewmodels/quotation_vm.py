from app.core.database import supabase
from app.core.mapping import to_db, to_frontend
from fastapi import HTTPException

class QuotationViewModel:
    @staticmethod
    def get_quotations():
        response = supabase.table("quotations").select("*").execute()
        return to_frontend(response.data)

    @staticmethod
    def create_quotation(quotation_in):
        db_data = to_db(quotation_in.model_dump())
        response = supabase.table("quotations").insert(db_data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create quotation")
        return to_frontend(response.data[0])

    @staticmethod
    def update_quotation(quotation_id: str, quotation_in):
        db_data = to_db(quotation_in.model_dump(exclude_unset=True))
        response = supabase.table("quotations").update(db_data).eq("id", quotation_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Quotation not found")
        return to_frontend(response.data[0])

