"""
Ingest raw documents into the Chroma vector store.

Usage (from project root):
    python -m backend.ingest.run_ingest --mode applet
    python -m backend.ingest.run_ingest --mode applet --reset
"""
import argparse
import hashlib
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Add project root to sys.path so relative imports work when run as __main__
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from tqdm import tqdm

from backend.ingest.loaders import load_dir
from backend.ingest.chunker import chunk_documents
from backend.rag.embedder import embed
from backend.rag.vectorstore import upsert, collection_count, get_client

BATCH_SIZE = 32  # embed this many chunks at once


def _chunk_id(text: str, source: str, index: int) -> str:
    key = f"{source}::{index}::{text[:64]}"
    return hashlib.md5(key.encode()).hexdigest()


def ingest(mode: str, reset: bool = False) -> None:
    raw_base = Path(os.getenv("RAW_DATA_PATH", "data/raw"))
    data_dir = raw_base / mode

    if not data_dir.exists():
        print(f"[ingest] Directory not found: {data_dir}")
        sys.exit(1)

    if reset:
        print(f"[ingest] Resetting collection '{mode}' ...")
        client = get_client()
        try:
            client.delete_collection(mode)
        except Exception:
            pass

    print(f"[ingest] Loading documents from {data_dir} ...")
    docs = load_dir(data_dir)
    print(f"[ingest] Loaded {len(docs)} raw documents")

    chunk_size = int(os.getenv("CHUNK_SIZE", "1500"))
    chunk_overlap = int(os.getenv("CHUNK_OVERLAP", "150"))
    chunks = chunk_documents(docs, chunk_size=chunk_size, overlap=chunk_overlap)
    print(f"[ingest] Produced {len(chunks)} chunks")

    # Embed and upsert in batches
    ids, embeddings, documents, metadatas = [], [], [], []

    for i, chunk in enumerate(tqdm(chunks, desc="Embedding")):
        ids.append(_chunk_id(chunk.content, chunk.metadata.get("source", ""), i))
        documents.append(chunk.content)
        # Chroma metadata values must be str/int/float/bool
        clean_meta = {
            k: (str(v) if not isinstance(v, (str, int, float, bool)) else v)
            for k, v in chunk.metadata.items()
        }
        metadatas.append(clean_meta)

        if len(ids) == BATCH_SIZE:
            batch_embeddings = embed(documents[-BATCH_SIZE:])
            upsert(mode, ids, batch_embeddings, documents[-BATCH_SIZE:], metadatas[-BATCH_SIZE:])
            ids, embeddings, documents, metadatas = [], [], [], []

    # Flush remaining
    if ids:
        batch_embeddings = embed(documents)
        upsert(mode, ids, batch_embeddings, documents, metadatas)

    total = collection_count(mode)
    print(f"[ingest] Done. Collection '{mode}' now has {total} chunks.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest raw data into vector store")
    parser.add_argument(
        "--mode", choices=["applet", "cos", "usim"], required=True,
        help="Which agent collection to populate",
    )
    parser.add_argument(
        "--reset", action="store_true",
        help="Delete existing collection before ingesting",
    )
    args = parser.parse_args()
    ingest(args.mode, reset=args.reset)


if __name__ == "__main__":
    main()
