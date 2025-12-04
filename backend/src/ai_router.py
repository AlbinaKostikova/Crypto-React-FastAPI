from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import http

router = APIRouter(prefix="/ai")

class CurrencyPayload(BaseModel):
    currency: dict

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
MODEL = os.getenv("HUGGINGFACE_MODEL", "google/flan-t5-base")
INFERENCE_URL = f"https://api-inference.huggingface.co/models/{MODEL}"

@router.post("/commentary")
async def ai_commentary(payload: CurrencyPayload):
    if not HUGGINGFACE_API_KEY:
        raise HTTPException(status_code=500, detail="HUGGINGFACE_API_KEY is not set on the server")
    
    currency = payload.currency or {}
    name = currency.get("name", "Unknown")
    symbol = currency.get("symbol", "")
    quoteUSD = (currency.get("quote") or {}).get("USD", {})
    price = quoteUSD.get("price") or currency.get("price") or "—"
    percent24 = quoteUSD.get("percent_change_24h") or currency.get("percent_change_24h") or "—"
    market_cap = quoteUSD.get("market_cap") or currency.get("market_cap") or "—"

    prompt = (
        f"Ты — аналитик криптовалют. Кратко (2–3 предложения) прокомментируй текущее состояние {name} ({symbol}) "
        f"и дай три сценария прогноза: пессимистичный (bear), базовый (base) и оптимистичный (bull) с "
        f"примерной оценкой изменения в процентах и одной‑двухстрочной мотивацией для каждого сценария.\n\n"
        f"Текущая цена: {price}\n"
        f"Изменение за 24 часа: {percent24}%\n"
        f"Капитализация: {market_cap}\n\n"
        f"Ответь на русском. Не используй длинных размышлений, только суть."
    )

    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    payload_json = {"inputs": prompt, "parameters": {"max_new_tokens": 200}}

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(INFERENCE_URL, headers=headers, json=payload_json)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"HuggingFace API error: {resp.status_code} {resp.text}")

    data = resp.json()
    ai_text = None

    if isinstance(data, dict):
        ai_text = data.get("generated_text") or data.get("text") or str(data)
    elif isinstance(data, list) and len(data) > 0:
        first = data[0]
        if isinstance(first, dict):
            ai_text = first.get("generated_text") or first.get("text") or str(first)
        else:
            ai_text = str(first)
    else:
        ai_text = str(data)

    return {"ai_text": ai_text}