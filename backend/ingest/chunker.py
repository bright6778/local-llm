"""
Document chunking with awareness of structure.

Key concern (section 十-1): PDF spec files contain APDU tables, TLV bit-field tables,
and status-word (SW1 SW2) tables. Fixed-size splitting tears these apart.
Strategy:
  - PDF pages: split on numbered section headings; keep table-like blocks together.
  - Java / C source: split on method/function boundaries.
  - Other text: fixed-size with overlap.
"""
import re
from .loaders import Document

# Matches numbered section headings: "4.1 ", "A.2.3 ", "第4章", "第三节"
_HEADING_RE = re.compile(
    r"(?:^|\n)(?=(?:\d+\.)+\s+\S|[A-Z][A-Z ]{3,}\n|第[一二三四五六七八九十百千]+[章节部分])",
    re.MULTILINE,
)

# Java / C method/function start: "public void foo(" or "static byte[] bar("
_JAVA_METHOD_RE = re.compile(
    r"\n(?=\s*(?:(?:public|private|protected|static|final|synchronized|native)\s+)*"
    r"(?:void|byte|short|int|boolean|[A-Z]\w*)\s+\w+\s*\()",
)

# C function start: "static void foo(" on a new line
_C_FUNC_RE = re.compile(
    r"\n(?=\s*(?:static\s+|extern\s+)?(?:void|int|short|byte|char|unsigned)\s+\w+\s*\()",
)


def chunk_documents(
    docs: list[Document],
    chunk_size: int = 1500,
    overlap: int = 150,
) -> list[Document]:
    result: list[Document] = []
    for doc in docs:
        result.extend(_chunk_one(doc, chunk_size, overlap))
    return result


def _chunk_one(doc: Document, chunk_size: int, overlap: int) -> list[Document]:
    doc_type = doc.metadata.get("type", "")

    if doc_type == "pdf":
        return _chunk_by_heading(doc, chunk_size, overlap)
    if doc_type == "java":
        return _chunk_by_pattern(doc, _JAVA_METHOD_RE, chunk_size, overlap)
    if doc_type in ("c", "h"):
        return _chunk_by_pattern(doc, _C_FUNC_RE, chunk_size, overlap)
    return _chunk_fixed(doc, chunk_size, overlap)


def _chunk_by_heading(doc: Document, chunk_size: int, overlap: int) -> list[Document]:
    """Split on section headings; keep blocks <= chunk_size; merge short ones."""
    sections = _HEADING_RE.split(doc.content)
    sections = [s.strip() for s in sections if s.strip()]

    chunks: list[Document] = []
    buffer = ""

    for section in sections:
        # If adding this section would exceed chunk_size, flush buffer first
        if buffer and len(buffer) + len(section) > chunk_size:
            chunks.append(_make_chunk(buffer, doc.metadata, len(chunks)))
            buffer = buffer[-overlap:] if overlap else ""

        if len(section) > chunk_size:
            # Section itself is too long — fall back to fixed chunking
            if buffer:
                chunks.append(_make_chunk(buffer, doc.metadata, len(chunks)))
                buffer = ""
            chunks.extend(_chunk_fixed(
                Document(content=section, metadata=doc.metadata),
                chunk_size, overlap,
            ))
        else:
            buffer = (buffer + "\n\n" + section).strip() if buffer else section

    if buffer:
        chunks.append(_make_chunk(buffer, doc.metadata, len(chunks)))

    return chunks or [_make_chunk(doc.content, doc.metadata, 0)]


def _chunk_by_pattern(
    doc: Document, pattern: re.Pattern, chunk_size: int, overlap: int
) -> list[Document]:
    parts = pattern.split(doc.content)
    parts = [p.strip() for p in parts if p.strip()]

    chunks: list[Document] = []
    for part in parts:
        if len(part) <= chunk_size:
            chunks.append(_make_chunk(part, doc.metadata, len(chunks)))
        else:
            chunks.extend(_chunk_fixed(
                Document(content=part, metadata=doc.metadata),
                chunk_size, overlap,
            ))
    return chunks or [_make_chunk(doc.content, doc.metadata, 0)]


def _chunk_fixed(doc: Document, chunk_size: int, overlap: int) -> list[Document]:
    text = doc.content
    chunks: list[Document] = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk_text = text[start:end].strip()
        if chunk_text:
            chunks.append(_make_chunk(chunk_text, doc.metadata, len(chunks)))
        start = end - overlap
    return chunks or [_make_chunk(text, doc.metadata, 0)]


def _make_chunk(text: str, base_meta: dict, index: int) -> Document:
    meta = {**base_meta, "chunk_index": index}
    return Document(content=text, metadata=meta)
