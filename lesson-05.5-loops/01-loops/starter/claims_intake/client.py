"""Anthropic client factory and model config."""

import os
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv

# Load .env from classroom repo root (4 levels up)
root_env = Path(__file__).resolve().parents[4] / ".env"
load_dotenv(dotenv_path=root_env)


def make_client() -> Anthropic:
    """Construct an Anthropic client from env. Fails fast if API key is missing."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not set. Export it before running, e.g.:\n"
            "    export ANTHROPIC_API_KEY=sk-ant-..."
        )
    return Anthropic(api_key=api_key)


DEFAULT_MODEL = "claude-haiku-4-5-20251001"
