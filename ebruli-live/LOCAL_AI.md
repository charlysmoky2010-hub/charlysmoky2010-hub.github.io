# EBRULİ Local AI Lab

EBRULİ is designed to remain useful without a paid AI subscription.

## Architecture

Browser UI → EBRULİ → local Ollama on Apple Silicon → external 4 TB SSD for model/art/RAG storage → optional cloud frontier model.

The external SSD expands storage. It does **not** increase the Mac's unified memory, so model size must still be chosen according to installed RAM/unified memory.

## Practical local starting points

- 8 GB unified memory: Qwen 3.5 2B or a small Gemma model.
- 16 GB: Qwen 3.5 4B is the default EBRULİ target; 9B may be usable selectively depending on context/workload.
- 24 GB: Qwen 3.5 9B or Gemma 3 12B are stronger local candidates.
- 32 GB+: larger MLX/Ollama models become more realistic, subject to actual memory pressure and context size.

The public app falls back to a deterministic Offline Guide when Ollama is not reachable. No fake AI response is shown as if a model had answered.

## Vision

Qwen 3.5 4B and Gemma 3 4B are useful starting candidates for image-aware Ebru critique on a compatible Mac. Physical Ebru remains the provenance source; model critique is advisory.

## Kimi K3

Kimi K3 is a 2.8T-parameter open-weight native multimodal model with a 1M-token context window. Treat it as cloud/server inference, not as a practical MacBook Air local model. If a cloud API is connected later, credentials must remain server-side and must never be embedded in the public browser application.

## Privacy rule

Sensitive Anatolian Atlas stories should stay in browser storage or be processed by a local model unless the user explicitly chooses a cloud workflow.

References:
- https://github.com/MoonshotAI/Kimi-K3
- https://ollama.com/library/qwen3.5:4b
- https://ollama.com/library/gemma3
- https://ollama.com/blog/mlx
