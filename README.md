# PictureWise AI

PictureWise AI is a purpose-aware image-generation prototype for school materials. It infers a likely use from the prompt when there are clear clues, recommends a quality tier with an explanation, and lets the user override either choice before generation.

## Features

- Four use profiles: colouring sheet, worksheet, flashcard, and poster.
- In the browser UI, local, prompt-based purpose inference recognizes English, Tamil, and Hindi clues for those four profiles. Unclear or conflicting clues are reported as ambiguous instead of being presented as a confident inference.
- A short tier recommendation explains its reason; Economy is suggested for simple requests and Higher detail for posters or explicit requests for more detail. The user can override both the inferred purpose and suggested tier or restore the recommendation.
- An inferred purpose or tier is only a suggestion. A manual purpose or tier choice is retained when later prompt recommendations arrive; restoring an ambiguous recommendation changes only its suggested tier and keeps the chosen purpose.
- Recommendations are computed locally with explainable keyword rules. They do not call an external language model, image provider, or paid translation service while typing. They are suggestions, not a trained classifier.
- New prompts return two clearly labelled image choices (Option 1 and Option 2); a matching or closely related prompt for the same purpose returns one choice.
- The chosen purpose and the prompt decide the image style. Tamil and Hindi prompts are translated to English before the image request when Cloudflare translation credentials are available.
- Prompt text, purpose, and the selected detail tier are retained in local SQLite prompt memory, so later matching requests use the same detail tier.
- Two real inference-step tiers for supported providers: Economy (4 steps) and Higher detail (8 steps).
- Per-generation display of estimated relative compute cost, saved compute units, and percentage saving against the 8-step maximum tier.
- English, Tamil, and Hindi interface languages; the choice is saved in the browser.
- Cloudflare Workers AI with FLUX.1 Schnell by default, plus optional Hugging Face support.
- Image preview and download, with a clearly labelled demo preview when credentials are missing.

## Run on Windows

1. Install Python 3.10 or newer.
2. Open a terminal in this folder and install dependencies:

   ```bat
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Start the app with `python app.py` and open http://127.0.0.1:5000. If that port is already in use, set `PICTUREWISE_PORT=5001` in `.env` and restart.

## Configure Cloudflare Workers AI

Create a Workers AI API token and copy the Cloudflare Account ID from the dashboard. Add the following values to `.env`:

```ini
AI_PROVIDER=cloudflare
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_workers_ai_token
CLOUDFLARE_MODEL=@cf/black-forest-labs/flux-1-schnell
# Optional translation model used for Tamil/Hindi prompts:
CLOUDFLARE_TRANSLATION_MODEL=@cf/meta/m2m100-1.2b
```

Keep the token in `.env`, not in `.env.example`, browser code, screenshots, or source control. `.env` is ignored by Git. Restart the app after changing configuration.

## Resource estimate and limitations

### Calculation

One compute unit is one requested inference step. For a request, `estimated units = selected steps per image × generated choices`; `saved units = (8 maximum steps − selected steps) × generated choices`; `saving percentage = saved units ÷ (8 × generated choices) × 100`. A new Economy request with two choices is `4 × 2 = 8 units`; its maximum baseline is `8 × 2 = 16`, so it saves 8 units (50%). A remembered prompt can produce one choice instead of two.

The Economy tier sends 4 inference steps; Higher detail sends 8. The UI reports the step count and compares it with the 8-step tier, so Economy is shown as 50% fewer inference steps. This is a step-based relative compute estimate—not measured energy, carbon emissions, total provider Neurons, or a guaranteed 50% cost reduction. Provider fixed costs and actual energy use can differ. Benchmark model quality, provider usage, latency, and cost before making a real savings claim.

The browser keeps all compute-unit, cost-estimate, and savings figures hidden until the user clicks **Generate**. The pre-generation recommendation is separate and does not display compute totals or savings. While generation runs, the live estimate shows the effective tier (including any memory match or quota downgrade), planned and completed choices, elapsed time, and the request calculation. The History menu opens this device's saved generated images.

The Cloudflare FLUX.1 Schnell integration sends the selected prompt and step count. Its documented input does not expose width or height, so the app does not display resolution as a controllable setting. The chosen purpose adjusts prompt style; the chosen quality tier controls the actual step budget. The browser suggestion rules are local and explainable, not a trained classifier. If the request has no recognizable purpose clue (for example, “a butterfly sitting on a flower”), the app asks the user to choose a purpose. The recommendation endpoint retains its purpose-only form for existing mobile callers and also accepts `prompt` and `language` for browser inference.

The interface uses familiar **SD-style** and **HD-style** labels for Economy and Higher detail. They describe relative generation effort only; they do not claim a particular image resolution, megapixel count, or video-quality output.

## Per-user daily allowance

Each browser or installed mobile app receives an anonymous device ID and may create **two picture requests per day**. A new request can contain two image choices, but it counts as one request. The limit resets at midnight in `PICTUREWISE_TIMEZONE` (default: `Asia/Kolkata`). The allowance also has a fixed 32-step ceiling: if a Higher detail (8-step) request would exceed that allowance, PictureWise generates the request in Economy (4-step) mode when possible and explains the downgrade. After two requests, no further image is generated until the next day.

This is a device-level quota, not user authentication. For a tamper-resistant account-level limit, connect the app to a real sign-in system and derive the quota key from the authenticated account instead of the browser/app ID.

## Interface languages

Choose English, Tamil, or Hindi from the header. The selection is stored in the browser and applies to the interface, plan, result summary, demo notice, and app-generated error messages. Prompts may be written in English, Tamil, or Hindi. Tamil/Hindi script is translated to English before it is sent to the image provider, with the English text shown in the result. If translation is unavailable, the original prompt is used and the UI says so.

## Prompt memory

PictureWise keeps prompt text and a compact, purpose-scoped prompt key in `picturewise.sqlite3`. For the same purpose, an exact prompt match or a sufficiently related prompt reuses the saved detail tier and creates one option unless the user explicitly overrides the tier. This is a transparent local similarity rule, not a trained machine-learning model; it does not send one user's prompt history to another user's browser.

## Architecture

React Native mobile app (Expo) or browser UI -> Flask API -> translate prompt to English when needed -> purpose style + remembered or user-selected detail tier -> Cloudflare Workers AI or optional Hugging Face -> one or two selectable image previews/downloads. If provider credentials are missing, the API returns labelled SVG demo previews.

## Advanced React Native app

The `mobile/` directory contains the Expo React Native app. It connects to the Flask API and includes:

- Purpose-based quality recommendations that users can override.
- A live step estimate plus a fixed two-request, 32-step daily allowance per anonymous user/device.
- A local SQLite generation history and usage dashboard with counts, latency, and seven-day activity.
- Optional Tamil plant-part labels drawn as a clear overlay after generation.
- Option 1 / Option 2 image selection for new prompts; the selected image is the one shared or downloaded.
- English, Tamil, and Hindi controls, translation and saved-prompt notices, prompt templates, image sharing, and an animated 3D-style lilac hero.

The history database is stored as `picturewise.sqlite3`; generated image files are stored under `generated_images/`. Both are local and ignored by Git. Prompts and image files therefore remain on the machine running Flask.

### Run the mobile app on Windows

1. Start the Flask backend in the project root. It reads the port from `.env` (`PICTUREWISE_PORT`, currently 5001 in this setup):

   ```bat
   python app.py
   ```

2. In another terminal, install and launch the Expo app:

   ```bat
   cd mobile
   npm install
   npx expo install react-native-svg expo-file-system expo-sharing @react-native-async-storage/async-storage react-dom react-native-web @expo/metro-runtime
   npm run web
   ```

   For Android, use `npm run android`. The Android emulator uses `http://10.0.2.2:5001`; iOS simulator and Expo web use `http://127.0.0.1:5001`. You can edit the API address in **Settings**.

For a physical phone on a trusted local network, set `PICTUREWISE_HOST=0.0.0.0` before starting Flask and enter the computer's local IP address in the app's API setting. Avoid exposing this development server to public networks.

## Advanced feature notes

Tier recommendations use purpose rules: the app suggests Economy for colouring sheets, worksheets, and flashcards, and Higher detail for posters. The user can override the suggestion. Usage analytics reflect successful live generations recorded locally; provider-reported energy or billing is not available in this prototype. The dashboard measures inference steps and response time only, so do not describe its estimate as measured energy, carbon, or invoice savings.
