import json
import sys
import re

def structure_transcript(transcript):
    text = transcript.lower()

    # simple rule-based segmentation: split by common CS/user transition phrases
    # You can refine this later
    parts = re.split(r"\bya[, ]|baik[, ]|oke[, ]", text)
    speakers = []
    current_speaker = "CS"

    for part in parts:
        part = part.strip().capitalize()
        if not part:
            continue

        # heuristic: if asking for help, it's the user
        if "gimana" in part or "tolong" in part or "bingung" in part:
            current_speaker = "User"
        elif "bpjs" in part or "menu" in part or "otp" in part:
            current_speaker = "CS"

        speakers.append({"speaker": current_speaker, "text": part})

    return {"speakers": speakers}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python 2_structure.py transcript.json")
        sys.exit(1)

    with open(sys.argv[1], encoding="utf-8") as f:
        data = json.load(f)

    transcript = data.get("transcript", "")
    result = structure_transcript(transcript)

    with open("structured.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print("\n✔ Saved structured speaker JSON to structured.json\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))
