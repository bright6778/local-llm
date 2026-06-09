from dataclasses import dataclass, field
from pathlib import Path

from pypdf import PdfReader

# Source code extensions worth indexing
CODE_EXTENSIONS = {".java", ".c", ".h"}
# Script / text extensions (test scripts included but capped by MAX_TEXT_KB)
TEXT_EXTENSIONS = {".js", ".txt"}
PDF_EXTENSION = ".pdf"
SUPPORTED = CODE_EXTENSIONS | TEXT_EXTENSIONS | {PDF_EXTENSION}

# Skip test-script directories that add noise without domain knowledge
_SKIP_DIRS = {"script", "test_logs", "cap", "PBOC_CA_key"}
# Only ingest English PDFs on first pass; CN/KR adds noise without big gain
# Set INGEST_ALL_LANGS=1 in .env to override
import os
_LANG_DIRS_SKIP = set() if os.getenv("INGEST_ALL_LANGS") else {"UICS2014-KR", "UICS2017-CN", "中国银联IC卡技术规范", "中国银联移动支付技术规范"}

MAX_TEXT_KB = 64  # skip giant JS files that are mostly data blobs


@dataclass
class Document:
    content: str
    metadata: dict = field(default_factory=dict)


def load_file(path: Path) -> list[Document]:
    suffix = path.suffix.lower()
    if suffix == PDF_EXTENSION:
        return _load_pdf(path)
    if suffix in CODE_EXTENSIONS | TEXT_EXTENSIONS:
        return _load_text(path)
    return []


def load_dir(directory: Path) -> list[Document]:
    docs: list[Document] = []
    all_paths = sorted(p for p in directory.rglob("*") if p.is_file() and p.suffix.lower() in SUPPORTED)

    # Apply directory filters
    filtered = []
    for path in all_paths:
        parts = set(path.parts)
        if parts & _SKIP_DIRS:
            continue
        if parts & _LANG_DIRS_SKIP:
            continue
        filtered.append(path)

    print(f"[loader] {len(filtered)} files to load (from {len(all_paths)} total, skipped {len(all_paths)-len(filtered)})")

    for i, path in enumerate(filtered):
        if i % 10 == 0:
            print(f"[loader] {i}/{len(filtered)}: {path.name}")
        docs.extend(load_file(path))

    return docs


def _load_pdf(path: Path) -> list[Document]:
    docs: list[Document] = []
    try:
        reader = PdfReader(str(path))
        for i, page in enumerate(reader.pages):
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
        print(f"[loader] Failed to read PDF {path.name}: {e}")
    return docs


def _load_text(path: Path) -> list[Document]:
    if path.stat().st_size > MAX_TEXT_KB * 1024:
        return []  # skip oversized data-blob scripts
    try:
        content = path.read_text(encoding="utf-8", errors="ignore").strip()
    except Exception as e:
        print(f"[loader] Failed to read {path.name}: {e}")
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
