import base64


def decode_base64(data: str) -> str:
    return base64.b64decode(data).decode("utf-8")


def get_word_count(text: str) -> int:
    return len(text.strip().split())
