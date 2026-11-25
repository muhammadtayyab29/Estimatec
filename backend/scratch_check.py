import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase = create_client(supabase_url, supabase_key)

print("Checking users table...")
res_users = supabase.table("users").select("*").execute()
print(f"Users found: {len(res_users.data)}")
for u in res_users.data:
    print(f"  - {u['email']} (ID: {u['id']}, Role: {u['role']})")

print("\nChecking projects table...")
res_projs = supabase.table("projects").select("*").execute()
print(f"Projects found: {len(res_projs.data)}")
for p in res_projs.data:
    print(f"  - {p['name']} (ID: {p['id']}, Client: {p['client']})")

print("\nChecking quotations table...")
res_quots = supabase.table("quotations").select("*").execute()
print(f"Quotations found: {len(res_quots.data)}")
