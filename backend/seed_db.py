import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in backend/.env")

supabase = create_client(supabase_url, supabase_key)

# 1. Clean existing database records
print("Cleaning existing public records...")
try:
    # Delete dependent quotations first
    supabase.table("quotations").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    # Then projects
    supabase.table("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    # Finally users
    supabase.table("users").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    print("Database tables cleared successfully.")
except Exception as e:
    print(f"Warning clearing public tables: {e}")

# 2. Clean existing auth users that match our seed list
seed_emails = [
    "admin@estimatec.com", "admin2@estimatec.com", "admin3@estimatec.com",
    "estimator@estimatec.com", "estimator2@estimatec.com", "estimator3@estimatec.com", "estimator4@estimatec.com",
    "agent@estimatec.com", "agent2@estimatec.com", "agent3@estimatec.com"
]

print("Cleaning existing auth users...")
try:
    users_list = supabase.auth.admin.list_users()
    for user in users_list:
        if user.email in seed_emails:
            print(f"Deleting existing auth user: {user.email}")
            supabase.auth.admin.delete_user(user.id)
    print("Auth seed users cleared successfully.")
except Exception as e:
    print(f"Warning cleaning auth users: {e}")

# 3. Define users to seed
seeded_users = [
    {"mock_id": "u1", "name": "Sarah Chen", "email": "admin@estimatec.com", "role": "admin", "password": "admin123", "status": "Active", "avatar": "SC"},
    {"mock_id": "u2", "name": "Michael Rivera", "email": "admin2@estimatec.com", "role": "admin", "password": "password123", "status": "Active", "avatar": "MR"},
    {"mock_id": "u3", "name": "Priya Anand", "email": "admin3@estimatec.com", "role": "admin", "password": "password123", "status": "Inactive", "avatar": "PA"},
    {"mock_id": "u4", "name": "James Foster", "email": "estimator@estimatec.com", "role": "estimator", "password": "est123", "status": "Active", "avatar": "JF"},
    {"mock_id": "u5", "name": "Elena Park", "email": "estimator2@estimatec.com", "role": "estimator", "password": "password123", "status": "Active", "avatar": "EP"},
    {"mock_id": "u6", "name": "David Kumar", "email": "estimator3@estimatec.com", "role": "estimator", "password": "password123", "status": "Active", "avatar": "DK"},
    {"mock_id": "u7", "name": "Hannah Wells", "email": "estimator4@estimatec.com", "role": "estimator", "password": "password123", "status": "Active", "avatar": "HW"},
    {"mock_id": "u8", "name": "Marcus Bell", "email": "agent@estimatec.com", "role": "agent", "password": "agt123", "status": "Active", "avatar": "MB"},
    {"mock_id": "u9", "name": "Aisha Khan", "email": "agent2@estimatec.com", "role": "agent", "password": "password123", "status": "Active", "avatar": "AK"},
    {"mock_id": "u10", "name": "Carlos Nieto", "email": "agent3@estimatec.com", "role": "agent", "password": "password123", "status": "Active", "avatar": "CN"},
]

mock_id_to_uuid = {}

print("\nCreating auth and profile users...")
for u in seeded_users:
    try:
        # Create Auth User using service role
        auth_res = supabase.auth.admin.create_user({
            "email": u["email"],
            "password": u["password"],
            "email_confirm": True,
            "user_metadata": {
                "name": u["name"],
                "role": u["role"]
            }
        })
        uuid = auth_res.user.id
        mock_id_to_uuid[u["mock_id"]] = uuid
        print(f"Created Auth User: {u['email']} -> {uuid}")
        
        # Insert Profile in public.users
        supabase.table("users").insert({
            "id": uuid,
            "email": u["email"],
            "name": u["name"],
            "role": u["role"],
            "status": u["status"],
            "avatar": u["avatar"]
        }).execute()
        print(f"Created Public Profile for {u['name']}")
    except Exception as e:
        print(f"Failed to create user {u['email']}: {e}")

# 4. Define projects to seed
seeded_projects = [
    { "mock_id": "p1", "name": "Riverside Office Tower", "client": "Hartwell Group", "zip": "10001", "estimatorId": "u4", "agentId": "u8", "status": "Completed", "drawing": "riverside_floor3.pdf", "estValue": 202303, "createdAt": "2025-04-10T10:00:00Z", "updatedAt": "2025-05-12T09:00:00Z", "description": "12-story office build, downtown." },
    { "mock_id": "p2", "name": "Maple Street Residences", "client": "Beacon Homes", "zip": "60601", "estimatorId": "u4", "agentId": "u9", "status": "Approved", "drawing": "maple_block.pdf", "estValue": 487120, "createdAt": "2025-03-22T10:00:00Z", "updatedAt": "2025-05-10T09:00:00Z", "description": "8-unit townhome cluster." },
    { "mock_id": "p3", "name": "Atlas Warehouse Expansion", "client": "Atlas Logistics", "zip": "77001", "estimatorId": "u5", "agentId": "u8", "status": "Processing", "drawing": "atlas_addition.pdf", "estValue": 318500, "createdAt": "2025-05-01T10:00:00Z", "updatedAt": "2025-05-15T09:00:00Z", "description": "Tilt-up addition, 24,000 sqft." },
    { "mock_id": "p4", "name": "Cedar Park Library", "client": "Cedar Park ISD", "zip": "75201", "estimatorId": "u4", "agentId": None, "status": "Uploaded", "drawing": "library_a1.pdf", "estValue": 0, "createdAt": "2025-05-08T10:00:00Z", "updatedAt": "2025-05-14T09:00:00Z", "description": "Public library, 18,000 sqft." },
    { "mock_id": "p5", "name": "Harbor View Retail", "client": "Sundial Retail", "zip": "33101", "estimatorId": "u6", "agentId": "u10", "status": "Completed", "drawing": "harbor_retail.pdf", "estValue": 156400, "createdAt": "2025-04-18T10:00:00Z", "updatedAt": "2025-05-11T09:00:00Z", "description": "Strip mall facade renovation." },
    { "mock_id": "p6", "name": "Northgate Clinic", "client": "Northgate Health", "zip": "90001", "estimatorId": "u7", "agentId": "u9", "status": "Draft", "drawing": None, "estValue": 0, "createdAt": "2025-05-14T10:00:00Z", "updatedAt": "2025-05-14T10:00:00Z", "description": "Outpatient clinic build-out." },
    { "mock_id": "p7", "name": "Summit Hotel Refresh", "client": "Summit Hospitality", "zip": "10001", "estimatorId": "u5", "agentId": "u8", "status": "Completed", "drawing": "summit_hotel.pdf", "estValue": 412800, "createdAt": "2025-04-02T10:00:00Z", "updatedAt": "2025-05-09T09:00:00Z", "description": "Lobby + 120 room refresh." },
    { "mock_id": "p8", "name": "Pine Hollow School", "client": "Pine Hollow ISD", "zip": "75201", "estimatorId": "u4", "agentId": "u10", "status": "Processing", "drawing": "pinehollow.pdf", "estValue": 0, "createdAt": "2025-05-05T10:00:00Z", "updatedAt": "2025-05-15T09:00:00Z", "description": "Elementary classroom wing." },
    { "mock_id": "p9", "name": "Bayside Condo Phase II", "client": "Bayside Devco", "zip": "33101", "estimatorId": "u6", "agentId": None, "status": "Uploaded", "drawing": "bayside_2.pdf", "estValue": 0, "createdAt": "2025-05-09T10:00:00Z", "updatedAt": "2025-05-13T09:00:00Z", "description": "Phase II — 40 units." },
    { "mock_id": "p10", "name": "Greenfield Plant Annex", "client": "Greenfield Mfg", "zip": "60601", "estimatorId": "u7", "agentId": "u9", "status": "Approved", "drawing": "greenfield.pdf", "estValue": 689230, "createdAt": "2025-03-12T10:00:00Z", "updatedAt": "2025-05-08T09:00:00Z", "description": "Light industrial annex." },
]

mock_proj_id_to_uuid = {}

print("\nCreating projects...")
for p in seeded_projects:
    try:
        est_uuid = mock_id_to_uuid.get(p["estimatorId"])
        agent_uuid = mock_id_to_uuid.get(p["agentId"]) if p["agentId"] else None
        
        proj_res = supabase.table("projects").insert({
            "name": p["name"],
            "client": p["client"],
            "zip": p["zip"],
            "description": p["description"],
            "estimatorid": est_uuid,
            "agentid": agent_uuid,
            "status": p["status"],
            "drawing": p["drawing"],
            "estvalue": p["estValue"],
            "createdat": p["createdAt"],
            "updatedat": p["updatedAt"]
        }).execute()
        
        uuid = proj_res.data[0]["id"]
        mock_proj_id_to_uuid[p["mock_id"]] = uuid
        print(f"Created Project: {p['name']} -> {uuid}")
    except Exception as e:
        print(f"Failed to create project {p['name']}: {e}")

# 5. Define quotations to seed
seeded_quotations = [
    { "projectId": "p1", "totalValue": 202303, "margin": 15.0, "agentStatus": "Approved", "adminStatus": "Approved" },
    { "projectId": "p2", "totalValue": 487120, "margin": 18.0, "agentStatus": "Approved", "adminStatus": "Approved" },
    { "projectId": "p5", "totalValue": 156400, "margin": 12.0, "agentStatus": "Approved", "adminStatus": "Pending" },
    { "projectId": "p7", "totalValue": 412800, "margin": 14.5, "agentStatus": "Pending", "adminStatus": "Pending" },
    { "projectId": "p10", "totalValue": 689230, "margin": 16.0, "agentStatus": "Approved", "adminStatus": "Approved" },
    { "projectId": "p3", "totalValue": 318500, "margin": 15.0, "agentStatus": "Flagged", "adminStatus": "Pending" },
    { "projectId": "p8", "totalValue": 224100, "margin": 13.0, "agentStatus": "Pending", "adminStatus": "Pending" },
    { "projectId": "p9", "totalValue": 0, "margin": 10.0, "agentStatus": "Pending", "adminStatus": "Pending" },
]

print("\nCreating quotations...")
for q in seeded_quotations:
    try:
        proj_uuid = mock_proj_id_to_uuid.get(q["projectId"])
        if not proj_uuid:
            print(f"Skipping quotation for missing project mock ID: {q['projectId']}")
            continue
            
        supabase.table("quotations").insert({
            "projectid": proj_uuid,
            "totalvalue": q["totalValue"],
            "margin": q["margin"],
            "agentstatus": q["agentStatus"],
            "adminstatus": q["adminStatus"]
        }).execute()
        print(f"Created Quotation for project mock ID: {q['projectId']}")
    except Exception as e:
        print(f"Failed to create quotation: {e}")

print("\nSeeding completed successfully!")
