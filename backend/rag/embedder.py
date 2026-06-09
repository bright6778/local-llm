import os
import ssl

from sentence_transformers import SentenceTransformer

_model: SentenceTransformer | None = None


def _patch_ssl_if_needed() -> None:
    """
    Corporate networks with SSL inspection (self-signed certs) break HuggingFace Hub downloads.
    Set HF_HUB_DISABLE_SSL=1 in .env to skip verification during the initial model download.
    Remove after the model is cached locally (~/.cache/huggingface).
    """
    if os.getenv("HF_HUB_DISABLE_SSL", "0") != "1":
        return

    ssl._create_default_https_context = ssl._create_unverified_context
    os.environ["CURL_CA_BUNDLE"] = ""
    os.environ["REQUESTS_CA_BUNDLE"] = ""
    os.environ["SSL_CERT_FILE"] = ""

    # huggingface_hub >= 0.20 uses httpx internally.
    # Monkey-patch httpx.Client so every instance created after this point uses verify=False.
    try:
        import httpx
        _orig_init = httpx.Client.__init__

        def _patched_init(self, *args, **kwargs):
            kwargs.setdefault("verify", False)
            _orig_init(self, *args, **kwargs)

        httpx.Client.__init__ = _patched_init

        # Also patch AsyncClient for any async paths
        _orig_async_init = httpx.AsyncClient.__init__

        def _patched_async_init(self, *args, **kwargs):
            kwargs.setdefault("verify", False)
            _orig_async_init(self, *args, **kwargs)

        httpx.AsyncClient.__init__ = _patched_async_init
    except Exception:
        pass


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _patch_ssl_if_needed()
        # Use all available CPU threads for faster inference on CPU-only machines
        try:
            import torch
            torch.set_num_threads(os.cpu_count() or 4)
        except Exception:
            pass
        model_name = os.getenv("EMBED_MODEL", "BAAI/bge-m3")
        print(f"[embedder] Loading {model_name} ...", flush=True)
        _model = SentenceTransformer(model_name)
        print(f"[embedder] Model loaded.", flush=True)
    return _model


def embed(texts: list[str]) -> list[list[float]]:
    return get_model().encode(texts, normalize_embeddings=True).tolist()


def embed_one(text: str) -> list[float]:
    return embed([text])[0]
