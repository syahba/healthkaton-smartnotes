from transformers import pipeline
import sys
import json
import os
import re

asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")

def correct_special_terms(text):
    if not text:
        return text
    
    corrected = text

    patterns = [
        r"\b[bv]p[ij1]s\b",
        r"\b[bv]p\s?[ij1]\s?s\b",
        r"\bgpjs\b",
    ]

    for pattern in patterns:
        corrected = re.sub(pattern, "BPJS", corrected, flags=re.IGNORECASE)

    return corrected

def transcribe(audio_path):
    print(f"Transcribing: {audio_path}", flush=True)
    result = asr(audio_path)
    
    text = result.get("text", "")
    text = correct_special_terms(text)
    
    return text

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    transcript = transcribe(audio_file)

    output = {"transcript": transcript}
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "transcript.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"[SUCCESS] Saved transcript to {output_path}")
