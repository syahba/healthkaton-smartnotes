import json
import sys
import re
import os

def structure_transcript(transcript):
    text = transcript.lower()
    
    parts = re.split(r"\bya[, ]|baik[, ]|oke[, ]", text)
    speakers = []
    current_speaker = "CS"

    for part in parts:
        part = part.strip().capitalize()
        if not part:
            continue

        if "gimana" in part or "tolong" in part or "bingung" in part:
            current_speaker = "User"
        elif "bpjs" in part or "menu" in part or "otp" in part:
            current_speaker = "CS"

        speakers.append({"speaker": current_speaker, "text": part})

    return {"speakers": speakers}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python structure.py transcript.json")
        sys.exit(1)

    input_path = sys.argv[1]
    with open(input_path, encoding="utf-8") as f:
        data = json.load(f)

    transcript = data.get("transcript", "")
    result = structure_transcript(transcript)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "structured.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"[SUCCESS] Saved structured JSON to {output_path}")
    print(json.dumps(result, ensure_ascii=False, indent=2))