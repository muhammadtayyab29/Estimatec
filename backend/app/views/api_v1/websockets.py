from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.viewmodels.estimation_vm import EstimationViewModel
import asyncio

router = APIRouter()

@router.websocket("/ws/estimation/{project_id}")
async def websocket_estimation(websocket: WebSocket, project_id: str):
    await websocket.accept()
    try:
        # Start the estimation pipeline and stream the yields to the client
        async for message in EstimationViewModel.run_estimation(project_id):
            await websocket.send_text(message)
            
        await websocket.send_text('{"step": "Complete", "progress": 100, "status": "done"}')
    except WebSocketDisconnect:
        print(f"Client disconnected from estimation for project {project_id}")
    except Exception as e:
        print(f"Estimation error: {e}")
        await websocket.send_text(f'{{"error": "{str(e)}"}}')
    finally:
        try:
            await websocket.close()
        except RuntimeError:
            pass # Already closed
