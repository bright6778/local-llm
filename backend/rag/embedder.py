import os
from sentence_transformers import SentenceTransformer

_model: SentenceTransformer | None = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        model_name = os.getenv("EMBED_MODEL", "BAAI/bge-m3")
        print(f"[embedder] Loading {model_name} ...")
        _model = SentenceTransformer(model_name)
    return _model


def embed(texts: list[str]) -> list[list[float]]:
    return get_model().encode(texts, normalize_embeddings=True).tolist()


def embed_one(text: str) -> list[float]:
    return embed([text])[0]
