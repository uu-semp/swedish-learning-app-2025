## Vad sägs?

Start the development server from the repository root (the folder containing
`words.csv` and `scripts/`):

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/game07/index.html. Serving only the `game07` folder
prevents the shared vocabulary scripts and assets from loading and leaves the
category page on its loading screen.

## Swedish pronunciation

Game 7 plays generated WAV recordings from `audio/`, including each noun's
`en` or `ett` article when provided in the vocabulary. Words without an article
are spoken on their own. `pronunciations.js` maps complete phrases to files.
No browser speech voice or running Python service is needed during gameplay.
New or changed phrases without a generated recording use the original vocabulary
audio until the recordings are regenerated.

The voice is KBLab's Swedish NST medium model, described in Faton Rekathati's
[Swedish Speech Synthesis (2023)](https://kb-labb.github.io/posts/2023-05-24-swedish-text-to-speech/).
The [model card](https://huggingface.co/rhasspy/piper-voices/blob/main/sv/sv_SE/nst/medium/MODEL_CARD)
credits KBLab at the National Library of Sweden and lists the dataset as CC0.
Audio is synthesized speech, not a human recording; pronunciations should be
reviewed when adding vocabulary.

To regenerate from `words.csv`, run these commands from the repository root
(Python 3.9+; generation uses `piper-tts` 1.8.0):

```sh
python3 -m venv /tmp/game07-piper-env
/tmp/game07-piper-env/bin/pip install piper-tts==1.8.0
mkdir -p /tmp/game07-piper-model
curl -fL -o /tmp/game07-piper-model/sv_SE-nst-medium.onnx https://huggingface.co/rhasspy/piper-voices/resolve/main/sv/sv_SE/nst/medium/sv_SE-nst-medium.onnx
curl -fL -o /tmp/game07-piper-model/sv_SE-nst-medium.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/sv/sv_SE/nst/medium/sv_SE-nst-medium.onnx.json
/tmp/game07-piper-env/bin/python game07/generate_audio.py --model /tmp/game07-piper-model/sv_SE-nst-medium.onnx
```

Use `--csv /path/to/export.csv` to generate from a newer vocabulary export.
Commit `audio/` and `pronunciations.js` together with any vocabulary updates.
The model and Python environment are generation tools and are not deployed.

Model SHA-256 used for the included audio:
`df011f56825a59dd1efc080c38a65a1ef70407e60f63050e9246f43a3d7e471e`.
Config SHA-256:
`d45dd74cbb4eca58694bf04a97e243044092476f28a55ae26424f0653086980a`.
