# Super Animal

A warm Expo companion app: a fox you can talk to when you want comfort. Chat, profile, and explore are already in the app. Voice is now wired in as a same-day demo.

Private source: [github.com/charliewwww/super-animal](https://github.com/charliewwww/super-animal)

## What works now

- Home, chat, profile, and explore screens
- A talking fox whose mouth opens and closes while it speaks
- Hold-to-talk (Chrome / Edge) plus typed chat
- Browser speech for today’s demo (no GPU needed)
- Optional local FastAPI server for the home GPU PC

The fox replies in English or Cantonese based on what you say. Replies are a comfort dictionary until a chat model is plugged in.

## Run the app

```bash
npm install
npm run web
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127). Use a phone-sized window or Chrome device toolbar.

Hold the orange mic to speak. If the browser blocks the microphone, type instead — the fox still talks and the mouth still moves.

## Voice architecture

```
You speak  →  App records
           →  Browser speech  or  home PC server
           →  Comfort reply (or later a chat model)
           →  App plays voice + mouth animation
```

Those three models do **not** run inside Expo:

| Job | Model | Notes |
|---|---|---|
| Hear you | `Qwen/Qwen3-ASR-1.7B` | Speech to text, including Cantonese |
| Think | small chat model (optional) | Not required for the demo |
| Speak | `ASLP-lab/Cosyvoice2-Yue` **or** `ASLP-lab/LLasa-1B-Yue-Updated` | Load **one** TTS model |

CosyVoice2-Yue and Llasa-1B-Yue are both text-to-speech. They do not hold a conversation.

## Home GPU PC (later)

Need roughly 8GB+ VRAM and 20GB+ disk. Do this on the GPU machine, not a laptop.

1. Create a Hugging Face account and accept the model licenses.
2. Install Python 3.11+, CUDA PyTorch, then:

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Then install the official packages from:
# https://github.com/QwenLM/Qwen3-ASR
# https://github.com/ASLP-lab/WenetSpeech-Yue
```

3. Fill in `load_gpu_models()` in `server/voice_server.py`.
4. Start the server:

```bash
VOICE_MODE=gpu TTS_ENGINE=cosyvoice2 python3 server/voice_server.py
```

5. Point the app at it:

```bash
EXPO_PUBLIC_VOICE_URL=http://YOUR-PC:8765 npm run web
```

Until those models are loaded, `npm run voice` starts a mock server on port 8765 that returns the same comfort replies the app already uses.

## GitHub CLI

This repo is private. In a new machine:

```bash
gh auth login --hostname github.com --git-protocol https --web
gh repo clone charliewwww/super-animal
```
