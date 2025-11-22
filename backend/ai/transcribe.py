from transformers import pipeline
import sys
import json
import os

asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")

def transcribe(audio_path):
    print(f"Transcribing: {audio_path}", flush=True)
    result = asr(audio_path)
    return result.get("text", "")

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
    print(transcript)