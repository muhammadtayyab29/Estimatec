import os
from dotenv import load_dotenv
from supabase import create_client
import sys

# Load environment
load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Mock mapping
MAP_TO_CAMEL = {
    "estimatorid": "estimatorId",
    "agentid": "agentId",
    "estvalue": "estValue",
    "createdat": "createdAt",
    "updatedat": "updatedAt",
    "projectid": "projectId",
    "totalvalue": "totalValue",
    "agentstatus": "agentStatus",
    "adminstatus": "adminStatus",
    "lastlogin": "lastLogin"
}

def to_frontend(data):
    if not data:
        return data
    if isinstance(data, list):
        return [to_frontend(item) for item in data]
    if isinstance(data, dict):
        out = {}
        for k, v in data.items():
            mapped_k = MAP_TO_CAMEL.get(k.lower(), k)
            out[mapped_k] = to_frontend(v)
        return out
    return data

res = supabase.table("projects").select("*").execute()
projects = to_frontend(res.data)
print("First project keys:", projects[0].keys() if projects else "No projects")
print("First project estValue:", projects[0].get("estValue") if projects else "None")

# Check users table
res_users = supabase.table("users").select("*").execute()
users = to_frontend(res_users.data)
print("First user keys:", users[0].keys() if users else "No users")
