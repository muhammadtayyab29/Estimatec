import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Print keys of a row in users
res = supabase.table("users").select("*").limit(1).execute()
if res.data:
    print("Users table keys:", list(res.data[0].keys()))
else:
    print("Users table is empty.")

# Let's inspect projects table by trying to fetch its structure or query it
try:
    # We can query postgres columns info using Supabase RPC or we can just try to fetch a row if exists,
    # or query system catalogs via postgrest? Actually postgrest has OpenAPI description!
    import requests
    openapi_url = f"{os.getenv('SUPABASE_URL')}/rest/v1/"
    headers = {"apikey": os.getenv("SUPABASE_KEY")}
    r = requests.get(openapi_url, headers=headers)
    schema = r.json()
    print("\nProjects columns in OpenAPI schema:")
    proj_props = schema.get("definitions", {}).get("projects", {}).get("properties", {})
    print(list(proj_props.keys()))
    
    print("\nQuotations columns in OpenAPI schema:")
    quot_props = schema.get("definitions", {}).get("quotations", {}).get("properties", {})
    print(list(quot_props.keys()))
except Exception as e:
    print("Error getting OpenAPI schema:", e)
