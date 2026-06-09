from dataclasses import dataclass, field
from pathlib import Path
import pdfplumber

TEXT_EXTENSIONS = {".java", ".c", ".h", ".js", ".txt"}
PDF_EXTENSION = ".pdf"
SUPPORTED = TEXT_EXTENSIONS | {PDF_EXTENSION}


@dataclass
class Document:
    content: str
    metadata: dict = field(default_factory=dict)


def load_file(path: Path) -> list[Document]:
    suffix = path.suffix.lower()
    if suffix == PDF_EXTENSION:
        return _load_pdf(path)
    if suffix in TEXT_EXTENSIONS:
        return _load_text(path)
    return []


def load_dir(directory: Path) -> list[Document]:
    docs: list[Document] = []
    for path in sorted(directory.rglob("*")):
        if path.is_file() and path.suffix.lower() in SUPPORTED:
            docs.extend(load_file(path))
    return docs


def _load_pdf(path: Path) -> list[Document]:
    docs: list[Document] = []
    try:
        with pdfplumber.open(path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text and text.strip():
                    docs.append(Document(
                        content=text.strip(),
                        metadata={
                            "source": str(path),
                            "page": i + 1,
                            "type": "pdf",
                            "filename": path.name,
                        },
                    ))
    except Exception as e:
        print(f"[loader] Failed to read PDF {path}: {e}")
    return docs


def _load_text(path: Path) -> list[Document]:
    try:
        content = path.read_text(encoding="utf-8", errors="ignore").strip()
    except Exception as e:
        print(f"[loader] Failed to read {path}: {e}")
        return []
    if not content:
        return []
    return [Document(
        content=content,
        metadata={
            "source": str(path),
            "type": path.suffix.lstrip("."),
            "filename": path.name,
        },
    )]
