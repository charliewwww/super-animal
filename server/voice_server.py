"""
Local voice server for Super Animal.

This machine can demo without a GPU by returning comfort replies (MODE=mock).
At home, set MODE=gpu and drop in:

  - Qwen/Qwen3-ASR-1.7B for speech-to-text
  - ASLP-lab/Cosyvoice2-Yue or ASLP-lab/LLasa-1B-Yue-Updated for Cantonese TTS
  - A small chat model if you want generated replies instead of the comfort dictionary

Do not load both TTS models at once. Pick one.
"""

from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from replies import pick_comfort_reply

MODE = os.getenv("VOICE_MODE", "mock").lower()
TTS_ENGINE = os.getenv("TTS_ENGINE", "cosyvoice2")
HOST = os.getenv("VOICE_HOST", "0.0.0.0")
PORT = int(os.getenv("VOICE_PORT", "8765"))

app = FastAPI(title="Super Animal voice server", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

gpu_runtime: dict[str, Any] = {}


class ConverseRequest(BaseModel):
    text: str


class ConverseResponse(BaseModel):
    reply: str
    engine: str
    transcript: str | None = None
    audio_base64: str | None = None


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "mode": MODE,
        "tts": TTS_ENGINE if MODE == "gpu" else "none",
    }


@app.post("/v1/converse", response_model=ConverseResponse)
async def converse_text(body: ConverseRequest) -> ConverseResponse:
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    reply = generate_reply(text)
    audio = synthesize(reply) if MODE == "gpu" else None
    return ConverseResponse(reply=reply, engine=MODE, transcript=text, audio_base64=audio)


@app.post("/v1/converse-audio", response_model=ConverseResponse)
async def converse_audio(file: UploadFile = File(...), language: str = Form("yue")) -> ConverseResponse:
    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="audio is required")
    transcript = transcribe(audio_bytes, language)
    reply = generate_reply(transcript)
    spoken = synthesize(reply) if MODE == "gpu" else None
    return ConverseResponse(reply=reply, engine=MODE, transcript=transcript, audio_base64=spoken)


def generate_reply(user_text: str) -> str:
    if MODE == "gpu" and gpu_runtime.get("chat"):
        return gpu_runtime["chat"](user_text)
    return pick_comfort_reply(user_text)


def transcribe(audio_bytes: bytes, language: str) -> str:
    if MODE != "gpu":
        raise HTTPException(
            status_code=501,
            detail="Audio transcription needs MODE=gpu and Qwen3-ASR-1.7B on a home PC.",
        )
    asr = gpu_runtime.get("asr")
    if not asr:
        raise HTTPException(status_code=503, detail="ASR model is not loaded yet.")
    return asr(audio_bytes, language)


def synthesize(text: str) -> str | None:
    tts = gpu_runtime.get("tts")
    if not tts:
        return None
    return tts(text)


def load_gpu_models() -> None:
    """
    Home-PC hook. Keep this function empty in mock mode.

    Suggested wiring:

        from qwen_asr import Qwen3ASRModel
        gpu_runtime["asr"] = lambda audio, lang: ...

        # One TTS only:
        # CosyVoice2-Yue  or  Llasa-1B-Yue
        gpu_runtime["tts"] = lambda text: base64_wav
    """
    if MODE != "gpu":
        return
    raise RuntimeError(
        "MODE=gpu is set, but model loaders are not filled in yet. "
        "See README.md for the download steps on your home GPU PC."
    )


if __name__ == "__main__":
    import uvicorn

    if MODE == "gpu":
        load_gpu_models()
    uvicorn.run(app, host=HOST, port=PORT)
