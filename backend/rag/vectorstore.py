import os
import chromadb

_client: chromadb.PersistentClient | None = None

VALID_COLLECTIONS = {"applet", "cos", "usim"}


def get_client() -> chromadb.PersistentClient:
    global _client
    if _client is None:
        path = os.path.abspath(os.getenv("VECTORDB_PATH", "data/vectordb"))
        os.makedirs(path, exist_ok=True)
        _client = chromadb.PersistentClient(path=path)
    return _client


def get_collection(name: str) -> chromadb.Collection:
    if name not in VALID_COLLECTIONS:
        raise ValueError(f"Unknown collection '{name}'. Must be one of {VALID_COLLECTIONS}")
    return get_client().get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"},
    )


def upsert(
    collection_name: str,
    ids: list[str],
    embeddings: list[list[float]],
    documents: list[str],
    metadatas: list[dict],
) -> None:
    get_collection(collection_name).upsert(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )


def query(
    collection_name: str,
    query_embedding: list[float],
    n_results: int = 5,
    where: dict | None = None,
) -> dict:
    col = get_collection(collection_name)
    kwargs: dict = dict(
        query_embeddings=[query_embedding],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )
    if where:
        kwargs["where"] = where
    return col.query(**kwargs)


def collection_count(collection_name: str) -> int:
    return get_collection(collection_name).count()
