import sys
import json
import os

from faster_whisper import WhisperModel


MODEL_SIZE = "tiny"


print("====================================", flush=True)
print("VELINO STT WORKER", flush=True)
print("Loading faster-whisper...", flush=True)
print("Model:", MODEL_SIZE, flush=True)
print("====================================", flush=True)


try:
    model = WhisperModel(
        MODEL_SIZE,
        device="cpu",
        compute_type="int8"
    )

    print("VELINO STT MODEL READY", flush=True)

except Exception as error:

    print(
        json.dumps({
            "success": False,
            "type": "startup_error",
            "error": str(error)
        }),
        flush=True
    )

    sys.exit(1)


def transcribe(audio_file):

    try:

        if not audio_file:
            return {
                "success": False,
                "text": "",
                "error": "Audio file path is missing."
            }

        if not os.path.exists(audio_file):
            return {
                "success": False,
                "text": "",
                "error": "Audio file does not exist."
            }

        segments, info = model.transcribe(
            audio_file,
            beam_size=5
        )

        text = ""

        for segment in segments:
            text += segment.text

        text = text.strip()

        return {
            "success": True,
            "text": text,
            "language": getattr(
                info,
                "language",
                ""
            )
        }

    except Exception as error:

        return {
            "success": False,
            "text": "",
            "error": str(error)
        }


for line in sys.stdin:

    line = line.strip()

    if not line:
        continue

    try:

        request = json.loads(line)

        command = request.get("command")

        if command == "transcribe":

            audio_file = request.get("file")

            result = transcribe(
                audio_file
            )

            print(
                json.dumps(result),
                flush=True
            )

        elif command == "ping":

            print(
                json.dumps({
                    "success": True,
                    "message": "VELINO STT READY"
                }),
                flush=True
            )

        elif command == "exit":

            print(
                json.dumps({
                    "success": True,
                    "message": "VELINO STT STOPPING"
                }),
                flush=True
            )

            break

        else:

            print(
                json.dumps({
                    "success": False,
                    "error": "Unknown command."
                }),
                flush=True
            )

    except Exception as error:

        print(
            json.dumps({
                "success": False,
                "error": str(error)
            }),
            flush=True
        )