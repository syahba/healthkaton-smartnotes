from transformers import pipeline
import sys
import json

asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")

def transcribe(audio_path):
    print(f"Transcribing: {audio_path}")
    result = asr(audio_path)
    return result.get("text", "")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python 1_transcribe.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    transcript = transcribe(audio_file)

    output = {"transcript": transcript}
    with open("transcript.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("\n✔ Saved transcript to transcript.json\n")
    print(transcript)
