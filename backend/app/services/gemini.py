import json
import os
import urllib.request

from ..models import Bag


def _build_prompt(bag: Bag) -> str:
    items = []
    for item in bag.items:
        name = item.product.name if item.product else "Produto"
        sold = max(item.quantity_sent - item.quantity_returned, 0)
        items.append(f"- {name}: enviados {item.quantity_sent}, retornados {item.quantity_returned}, vendidos {sold}")

    items_text = "\n".join(items) if items else "Sem itens informados."
    return (
        "Gere um insight curto (1-2 frases) em português sobre o fechamento da maleta. "
        "Considere mix, itens com maior saída e sugestões para próxima maleta.\n"
        f"Maleta: {bag.code}\n"
        f"Status: {bag.status}\n"
        f"Itens:\n{items_text}"
    )


def generate_closing_summary(bag: Bag, fallback: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return fallback

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": _build_prompt(bag)},
                ]
            }
        ]
    }

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-1.5-flash:generateContent?key={api_key}"
    )

    try:
        request = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return text.strip() if text else fallback
    except Exception:
        return fallback
