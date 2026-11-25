from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # Supabase signs JWTs using the SUPABASE_JWT_SECRET.
        # This secret is usually found in the Supabase project API settings.
        # For this setup, we'll assume SUPABASE_KEY contains the JWT secret for validation,
        # OR we fetch user via Supabase client directly.
        # Validating with jose requires the actual JWT secret.
        
        # A simpler alternative is to let the Supabase client validate it:
        from app.core.database import supabase
        print(f"Validating token: {token[:10]}...")
        user_response = supabase.auth.get_user(token)
        print(f"User response: {user_response}")
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_response.user
    except Exception as e:
        print(f"Auth Exception: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
