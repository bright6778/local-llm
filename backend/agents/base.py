from pathlib import Path
from ..rag.retriever import retrieve
from ..llm.client import chat

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


class BaseAgent:
    mode: str  # set by subclass: "applet" | "cos" | "usim"

    def _system_prompt(self) -> str:
        return (PROMPTS_DIR / f"{self.mode}.txt").read_text(encoding="utf-8")

    def _build_user_message(self, query: str, chunks: list[dict]) -> str:
        if not chunks:
            return query

        context_parts = ["### Relevant context from knowledge base:\n"]
        for i, chunk in enumerate(chunks, 1):
            source = chunk["meta"].get("source", "unknown")
            page = chunk["meta"].get("page", "")
            loc = f"{source}" + (f" p.{page}" if page else "")
            context_parts.append(f"[{i}] ({loc})\n{chunk['text']}\n")

        context = "\n".join(context_parts)
        return f"{context}\n---\n\n{query}"

    def run(self, query: str, stream: bool = False) -> dict:
        chunks = retrieve(query, self.mode)

        messages = [
            {"role": "system", "content": self._system_prompt()},
            {"role": "user", "content": self._build_user_message(query, chunks)},
        ]

        response = chat(messages, stream=stream)

        if stream:
            return {"stream": response, "sources": chunks}

        answer = response.choices[0].message.content
        sources = [
            {"source": c["meta"].get("source", ""), "score": c["score"]}
            for c in chunks
        ]
        return {"answer": answer, "sources": sources}
