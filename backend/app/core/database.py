from supabase import create_client, Client
from app.core.config import settings

# Supabase Client setup
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

