"""
FastAPI entry point.

Run from project root:
    uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

Swagger UI: http://localhost:8000/docs
"""
import os
from contextlib import asynccontextmanager
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

from backend.agents.applet import AppletAgent
from backend.agents.cos import COSAgent
from backend.agents.usim import USIMAgent
from backend.rag.vectorstore import collection_count

_AGENTS = {
    "applet": AppletAgent(),
    "cos": COSAgent(),
    "usim": USIMAgent(),
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm up embedding model on startup so first request isn't slow
    from backend.rag.embedder import get_model
    get_model()
    yield


app = FastAPI(
    title="JavaCard Local LLM Agent",
    version="0.1.0",
    description="PBOC / COS / USIM domain-specific coding assistant powered by DeepSeek-Coder + RAG",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response schemas ────────────────────────────────

class ChatRequest(BaseModel):
    mode: Literal["applet", "cos", "usim"]
    query: str


class SourceRef(BaseModel):
    source: str
    score: float


class ChatResponse(BaseModel):
    mode: str
    answer: str
    sources: list[SourceRef]


# ── Endpoints ─────────────────────────────────────────────────

@app.get("/health")
def health():
    counts = {m: collection_count(m) for m in _AGENTS}
    return {"status": "ok", "collection_counts": counts}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="query must not be empty")

    agent = _AGENTS[req.mode]
    try:
        result = agent.run(req.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ChatResponse(
        mode=req.mode,
        answer=result["answer"],
        sources=[SourceRef(**s) for s in result["sources"]],
    )
