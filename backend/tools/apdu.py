"""
APDU / BER-TLV utilities — Phase 2 placeholder.

These will be called by the agent's tool-use loop once jCardSim integration
is added. For now they provide standalone encode/decode helpers useful
for testing and prompt construction.
"""


def encode_apdu(cla: int, ins: int, p1: int, p2: int,
                data: bytes = b"", le: int | None = None) -> bytes:
    """Build a command APDU byte string."""
    header = bytes([cla & 0xFF, ins & 0xFF, p1 & 0xFF, p2 & 0xFF])
    if data:
        lc = bytes([len(data) & 0xFF])
        body = lc + data
    else:
        body = b""
    trailer = bytes([le & 0xFF]) if le is not None else b""
    return header + body + trailer


def decode_apdu(raw: bytes) -> dict:
    """Parse a command APDU into a dict."""
    if len(raw) < 4:
        raise ValueError("APDU too short")
    result = {"CLA": raw[0], "INS": raw[1], "P1": raw[2], "P2": raw[3]}
    if len(raw) == 4:
        return result
    lc = raw[4]
    result["Lc"] = lc
    if len(raw) >= 5 + lc:
        result["data"] = raw[5: 5 + lc].hex().upper()
    if len(raw) == 5 + lc + 1:
        result["Le"] = raw[5 + lc]
    return result


def decode_tlv(data: bytes) -> list[dict]:
    """Decode BER-TLV encoded bytes into a list of {tag, length, value} dicts."""
    result = []
    i = 0
    while i < len(data):
        # Tag
        tag = data[i]
        i += 1
        if tag & 0x1F == 0x1F:  # multi-byte tag
            while i < len(data) and data[i] & 0x80:
                tag = (tag << 8) | data[i]
                i += 1
            if i < len(data):
                tag = (tag << 8) | data[i]
                i += 1

        if i >= len(data):
            break

        # Length
        length = data[i]
        i += 1
        if length == 0x81:
            length = data[i]
            i += 1
        elif length == 0x82:
            length = (data[i] << 8) | data[i + 1]
            i += 2

        value = data[i: i + length]
        i += length
        result.append({
            "tag": f"{tag:02X}",
            "length": length,
            "value": value.hex().upper(),
        })
    return result


def encode_tlv(tag: int, value: bytes) -> bytes:
    """Encode a single TLV element."""
    length = len(value)
    if length <= 0x7F:
        len_bytes = bytes([length])
    elif length <= 0xFF:
        len_bytes = bytes([0x81, length])
    else:
        len_bytes = bytes([0x82, (length >> 8) & 0xFF, length & 0xFF])

    tag_bytes = tag.to_bytes((tag.bit_length() + 7) // 8, "big")
    return tag_bytes + len_bytes + value
