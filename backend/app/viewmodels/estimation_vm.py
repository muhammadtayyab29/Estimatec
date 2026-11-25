import asyncio
import json
from typing import AsyncGenerator

class EstimationViewModel:
    @staticmethod
    async def run_estimation(project_id: str) -> AsyncGenerator[str, None]:
        """
        Simulate a complex AI estimation pipeline, yielding progress updates as JSON strings.
        """
        steps = [
            ("Initializing AI vision model...", 10),
            ("Analyzing drawing structures...", 30),
            ("Extracting material quantities...", 50),
            ("Cross-referencing CSI master format...", 70),
            ("Calculating labor & overhead costs...", 90),
            ("Finalizing estimation report...", 100),
        ]
        
        for step, progress in steps:
            await asyncio.sleep(1.5)  # Simulate processing delay
            yield json.dumps({"step": step, "progress": progress})
