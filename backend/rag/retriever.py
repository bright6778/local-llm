import os
from .embedder import embed_one
from .vectorstore import query


def retrieve(text: str, mode: str, top_k: int | None = None) -> list[dict]:
    """
    Return top-k chunks from the collection that matches `mode`.
    Domain isolation is enforced here — applet queries never touch cos/usim collections.
    """
    k = top_k or int(os.getenv("TOP_K", "5"))
    embedding = embed_one(text)
    results = query(collection_name=mode, query_embedding=embedding, n_results=k)

    chunks = []
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    for doc, meta, dist in zip(docs, metas, distances):
        chunks.append({"text": doc, "meta": meta, "score": round(1.0 - dist, 4)})
    return chunks
