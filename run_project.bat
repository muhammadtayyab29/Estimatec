@echo off
echo Starting EstimaTec Full Stack Project...

echo Starting FastAPI Backend...
start cmd /k "cd backend && .\venv\Scripts\activate && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting React Frontend...
start cmd /k "cd cost-craft-forge && npm run dev"

echo Both servers are starting up!
echo Your frontend will be available at: http://localhost:8080
echo Your backend API is available at: http://127.0.0.1:8000
pause
