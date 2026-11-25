from app.models.project import ProjectCreate, ProjectUpdate
from app.core.database import supabase
from app.core.mapping import to_db, to_frontend
from typing import List

class ProjectViewModel:
    @staticmethod
    def create_project(project_in: ProjectCreate) -> dict:
        db_data = to_db(project_in.model_dump())
        response = supabase.table("projects").insert(db_data).execute()
        return to_frontend(response.data[0]) if response.data else {}

    @staticmethod
    def get_projects() -> List[dict]:
        response = supabase.table("projects").select("*").execute()
        return to_frontend(response.data)

    @staticmethod
    def update_project(project_id: str, project_in: ProjectUpdate) -> dict:
        db_data = to_db(project_in.model_dump(exclude_unset=True))
        response = supabase.table("projects").update(db_data).eq("id", project_id).execute()
        return to_frontend(response.data[0]) if response.data else {}

