import os
from openai import OpenAI

_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1"),
            api_key=os.getenv("OLLAMA_API_KEY", "ollama"),
        )
    return _client


def chat(messages: list[dict], stream: bool = False):
    model = os.getenv("LLM_MODEL", "deepseek-coder-v2:16b-lite-instruct")
    return get_client().chat.completions.create(
        model=model,
        messages=messages,
        stream=stream,
    )
