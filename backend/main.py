from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import MatchRequest, MatchResponse
from services.vector_engine import VectorEngine

app = FastAPI(title="GeoForge AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = VectorEngine()

@app.post("/api/v1/match", response_model=MatchResponse)
async def match_components(request: MatchRequest):
    return await engine.run_match(request)
