import os
import wave
import subprocess
from faster_whisper import WhisperModel

AUDIO_FILE = "velino_test.wav"

print("====================================")
print("       VELINO VOICE TEST")
print("====================================")
print()
print("Press ENTER to start recording.")
input()

print("🎤 Recording for 5 seconds...")
print("Speak now!")

# Record microphone using macOS built-in audio recorder
subprocess.run([
    "ffmpeg",
    "-y",
    "-f", "avfoundation",
    "-i", ":0",
    "-t", "5",
    "-ar", "16000",
    "-ac", "1",
    AUDIO_FILE
])

print()
print("✅ Recording complete.")
print("🧠 Loading Whisper model...")

# Small model for initial testing
model = WhisperModel(
    "tiny",
    device="cpu",
    compute_type="int8"
)

print("🧠 Transcribing...")

segments, info = model.transcribe(
    AUDIO_FILE,
    beam_size=5
)

text = ""

for segment in segments:
    text += segment.text

print()
print("====================================")
print("VELINO HEARD:")
print(text.strip())
print("====================================")

if os.path.exists(AUDIO_FILE):
    os.remove(AUDIO_FILE)