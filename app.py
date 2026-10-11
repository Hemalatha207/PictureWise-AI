from flask import Flask, Response, jsonify, request, send_from_directory, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
import base64
import html
import json
import os
import re
import sqlite3
import time
import uuid
from contextlib import contextmanager
from datetime import datetime, time as datetime_time, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import requests

load_dotenv()

app = Flask(__name__, static_folder="views", static_url_path="")
CORS(app)

AI_PROVIDER = os.getenv("AI_PROVIDER", "cloudflare").strip().lower()
CF_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
CF_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
CF_MODEL = os.getenv("CLOUDFLARE_MODEL", "@cf/black-forest-labs/flux-1-schnell").strip()
CF_API = os.getenv(
    "CLOUDFLARE_API_URL",
    f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/{CF_MODEL}",
).strip()
CF_TRANSLATION_MODEL = os.getenv("CLOUDFLARE_TRANSLATION_MODEL", "@cf/meta/m2m100-1.2b").strip()
CF_TRANSLATION_API = os.getenv(
    "CLOUDFLARE_TRANSLATION_API_URL",
    f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/{CF_TRANSLATION_MODEL}",
).strip()

HF_TOKEN = os.getenv("HF_TOKEN", "").strip()
HF_MODEL = os.getenv("HF_MODEL", "stabilityai/stable-diffusion-3-medium-diffusers").strip()
HF_API = os.getenv(
    "HF_API_URL",
    f"https://router.huggingface.co/hf-inference/models/{HF_MODEL}",
).strip()

MAX_STEPS = 8
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("PICTUREWISE_DB_PATH", str(BASE_DIR / "picturewise.sqlite3")))
GENERATED_DIR = BASE_DIR / "generated_images"
# These limits are enforced for each anonymous user/device and cannot be
# changed by the client. One request can contain two image choices.
DAILY_IMAGE_LIMIT = int(os.getenv("PICTUREWISE_DAILY_REQUEST_LIMIT", "2"))
DAILY_USER_STEP_LIMIT = int(os.getenv("PICTUREWISE_DAILY_STEP_LIMIT", "32"))
APP_TIMEZONE_NAME = os.getenv("PICTUREWISE_TIMEZONE", "Asia/Kolkata").strip()
try:
    APP_TIMEZONE = ZoneInfo(APP_TIMEZONE_NAME)
except ZoneInfoNotFoundError:
    APP_TIMEZONE = timezone.utc
USER_ID_PATTERN = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]{7,127}")
QUALITY_TIERS = {
    "economy": {"label": "Economy", "steps": 4},
    "detail": {"label": "Higher detail", "steps": 8},
}

PROFILES = {
    "colouring": {
        "label": "Colouring sheet",
        "width": 512,
        "height": 512,
        "style": "clean black-and-white line art, bold outlines, no shading, white background",
    },
    "worksheet": {
        "label": "Worksheet illustration",
        "width": 640,
        "height": 640,
        "style": "clear educational illustration, simple composition",
    },
    "flashcard": {
        "label": "Flashcard",
        "width": 640,
        "height": 640,
        "style": "bright, simple educational illustration, uncluttered background",
    },
    "poster": {
        "label": "Full-colour poster",
        "width": 1024,
        "height": 1024,
        "style": "polished full-colour poster artwork, rich detail, print-ready composition",
    },
}

DEMO_LABELS = {
    "en": "DEMO PREVIEW — NOT AI OUTPUT",
    "ta": "டெமோ முன்னோட்டம் — AI படம் அல்ல",
    "hi": "डेमो पूर्वावलोकन — AI चित्र नहीं",
}

PROMPT_LANGUAGE_CODES = {"en": "en", "ta": "ta", "hi": "hi"}
PROMPT_STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "for", "from", "in", "is", "of",
    "on", "or", "the", "to", "with", "your", "picture", "image", "show", "create",
}
SIMILARITY_THRESHOLD = 0.58


def choose_profile(purpose, quality_tier):
    profile = PROFILES.get(purpose, PROFILES["colouring"]).copy()
    tier_key = quality_tier if quality_tier in QUALITY_TIERS else "economy"
    tier = QUALITY_TIERS[tier_key]
    profile.update(
        purpose=purpose if purpose in PROFILES else "colouring",
        quality_tier=tier_key,
        quality_label=tier["label"],
        steps=tier["steps"],
        relative_step_units=tier["steps"],
        percent_fewer_steps=round((1 - tier["steps"] / MAX_STEPS) * 100),
    )
    return profile


def recommend_tier(purpose):
    """Offer a purpose-based default while allowing the user to override it."""
    if purpose == "poster":
        return {
            "quality_tier": "detail",
            "steps": QUALITY_TIERS["detail"]["steps"],
            "reason": "Posters benefit from more visual detail.",
        }
    return {
        "quality_tier": "economy",
        "steps": QUALITY_TIERS["economy"]["steps"],
        "reason": "Simple educational visuals can start with fewer inference steps.",
    }


PURPOSE_CLUES = {
    "colouring": {
        "explicit": (
            "colouring page", "coloring page", "colouring sheet", "coloring sheet",
            "colouring outline", "coloring outline", "colouring book", "coloring book",
            "வண்ணம் தீட்டும் பக்கம்", "வண்ணம் தீட்டும் தாள்",
            "रंग भरने वाला पेज", "रंग भरने की शीट",
        ),
        "supporting": (
            "black and white", "black-and-white", "outline", "outlines", "line art",
            "கருப்பு வெள்ளை", "கருப்பு-வெள்ளை", "வெளிக்கோடு", "கருப்பு கோட்டு படம்",
            "ब्लैक एंड व्हाइट", "काला सफेद", "रूपरेखा", "रेखाचित्र",
        ),
    },
    "worksheet": {
        "explicit": (
            "worksheet", "activity sheet", "exercise sheet", "பயிற்சித்தாள்",
            "செயல்பாட்டுத் தாள்", "பயிற்சி தாள்", "कार्यपत्रक", "अभ्यास पत्र",
            "गतिविधि पत्रक",
        ),
        "supporting": (),
    },
    "flashcard": {
        "explicit": (
            "flashcard", "flash card", "vocabulary card", "word card",
            "கற்றல் அட்டை", "சொல் அட்டை", "சொற்களஞ்சிய அட்டை",
            "फ्लैशकार्ड", "शब्दावली कार्ड", "शब्द कार्ड",
        ),
        "supporting": (),
    },
    "poster": {
        "explicit": (
            "poster", "banner", "சுவரொட்டி", "சுவரொட்டிகள்", "பதாகை", "பதாகா",
            "पोस्टर", "बैनर",
        ),
        "supporting": (
            "display", "for display", "காட்சிக்காக", "காட்சிக்கு", "காட்சி",
            "प्रदर्शन", "प्रदर्शनी",
        ),
    },
}
SIMPLE_DETAIL_CLUES = {
    "simple": (
        "simple", "basic", "minimal", "black and white", "black-and-white",
        "outline", "outlines", "line art", "bold outlines", "large simple shapes",
        "எளிய", "அடிப்படை", "எளிமையான", "கருப்பு வெள்ளை", "கருப்பு-வெள்ளை",
        "வெளிக்கோடு", "கருப்பு கோட்டு படம்", "सरल", "सादा", "बुनियादी",
        "ब्लैक एंड व्हाइट", "काला सफेद", "रूपरेखा", "रेखाचित्र",
    ),
    "detailed": (
        "detailed", "high detail", "rich detail", "intricate", "complex composition",
        "விரிவான", "நுணுக்கமான", "அதிக விவரம்", "विस्तृत", "बारीक", "अधिक विवरण",
    ),
}


def infer_prompt_recommendation(prompt, language):
    normalized_prompt = prompt.casefold()
    purpose_scores = {}
    matched_clues = []
    explicit_matches = {}
    for purpose, groups in PURPOSE_CLUES.items():
        explicit = [
            clue for clue in groups["explicit"]
            if clue.casefold() in normalized_prompt
        ]
        supporting = [
            clue for clue in groups["supporting"]
            if clue.casefold() in normalized_prompt
        ]
        explicit_matches[purpose] = len(explicit)
        purpose_scores[purpose] = len(explicit) * 3 + len(supporting)
        matched_clues.extend(explicit + supporting)

    maximum_explicit = max(explicit_matches.values(), default=0)
    if maximum_explicit:
        strongest = [
            purpose for purpose, count in explicit_matches.items()
            if count == maximum_explicit
        ]
        inferred_purpose = strongest[0] if len(strongest) == 1 else None
        purpose_confidence = "high" if inferred_purpose else "low"
    else:
        maximum_score = max(purpose_scores.values(), default=0)
        strongest = [
            purpose for purpose, score in purpose_scores.items()
            if score == maximum_score and score > 0
        ]
        inferred_purpose = strongest[0] if len(strongest) == 1 else None
        purpose_confidence = "medium" if inferred_purpose else "low"
    ambiguous = inferred_purpose is None

    simple_matches = [
        clue for clue in SIMPLE_DETAIL_CLUES["simple"]
        if clue.casefold() in normalized_prompt
    ]
    detail_matches = [
        clue for clue in SIMPLE_DETAIL_CLUES["detailed"]
        if clue.casefold() in normalized_prompt
    ]
    matched_clues.extend(simple_matches + detail_matches)

    if detail_matches and len(detail_matches) >= len(simple_matches):
        suggested_tier = "detail"
        reason_key = "recommend_detail_explicit"
        reason = "You asked for a detailed or complex image, so Higher detail is suggested."
    elif simple_matches:
        suggested_tier = "economy"
        reason_key = "recommend_economy_explicit"
        reason = "You asked for a simple image or clear outline, so Economy is suggested."
    elif inferred_purpose == "poster":
        suggested_tier = "detail"
        reason_key = "recommend_detail_poster"
        reason = "Display posters and banners benefit from richer visual detail."
    else:
        suggested_tier = "economy"
        reason_key = "recommend_economy_default"
        reason = (
            "The purpose is unclear, so Economy is a conservative starting point."
            if ambiguous else
            "A straightforward educational image can start with modest generation effort."
        )

    has_tamil = bool(re.search(r"[\u0b80-\u0bff]", prompt))
    has_devanagari = bool(re.search(r"[\u0900-\u097f]", prompt))
    has_latin = bool(re.search(r"[A-Za-z]", prompt))
    scripts = sum((has_tamil, has_devanagari, has_latin))
    if scripts == 1 and has_tamil:
        language_detected = "ta"
        language_confidence = "high"
    elif scripts == 1 and has_devanagari:
        language_detected = "hi"
        language_confidence = "high"
    elif scripts == 1 and has_latin and language == "en":
        language_detected = "en"
        language_confidence = "medium"
    elif scripts == 0:
        language_detected = None
        language_confidence = "low"
    else:
        language_detected = None
        language_confidence = "low"
    language_uncertain = language_detected is None or language_confidence == "low"

    return {
        "purpose": inferred_purpose,
        "inferred_purpose": inferred_purpose,
        "purpose_confidence": purpose_confidence,
        "suggested_tier": suggested_tier,
        "quality_tier": suggested_tier,
        "reason": reason,
        "reason_key": reason_key,
        "matched_clues": list(dict.fromkeys(matched_clues)),
        "ambiguous": ambiguous,
        "ambiguity_message": (
            "The purpose is unclear from this description. Choose a purpose or add a clue such as colouring page, worksheet, flashcard, or poster."
            if ambiguous else None
        ),
        "language_detected": language_detected,
        "language_confidence": language_confidence,
        "language_uncertain": language_uncertain,
    }


@contextmanager
def database():
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def init_store():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    with database() as connection:
        connection.execute(
            """CREATE TABLE IF NOT EXISTS generations (
                id TEXT PRIMARY KEY,
                prompt TEXT NOT NULL,
                purpose TEXT NOT NULL,
                quality_tier TEXT NOT NULL,
                steps INTEGER NOT NULL,
                mode TEXT NOT NULL,
                latency_ms INTEGER NOT NULL,
                image_file TEXT,
                user_id TEXT NOT NULL DEFAULT 'legacy',
                created_at TEXT NOT NULL
            )"""
        )
        columns = {
            row["name"]
            for row in connection.execute("PRAGMA table_info(generations)").fetchall()
        }
        if "user_id" not in columns:
            connection.execute(
                "ALTER TABLE generations ADD COLUMN user_id TEXT NOT NULL DEFAULT 'legacy'"
            )
        if "request_id" not in columns:
            connection.execute("ALTER TABLE generations ADD COLUMN request_id TEXT")
        if "option_number" not in columns:
            connection.execute("ALTER TABLE generations ADD COLUMN option_number INTEGER")
        if "prompt_english" not in columns:
            connection.execute("ALTER TABLE generations ADD COLUMN prompt_english TEXT")
        connection.execute(
            """CREATE TABLE IF NOT EXISTS prompt_memory (
                purpose TEXT NOT NULL,
                normalized_prompt TEXT NOT NULL,
                quality_tier TEXT NOT NULL,
                use_count INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (purpose, normalized_prompt)
            )"""
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_generations_user_created "
            "ON generations (user_id, created_at)"
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_generations_request ON generations (request_id)"
        )
def request_user_id(data=None):
    """Return the browser/app's anonymous device identifier, if valid."""
    candidate = request.headers.get("X-PictureWise-User", "").strip()
    if not candidate and isinstance(data, dict):
        candidate = str(data.get("user_id", "")).strip()
    return candidate if USER_ID_PATTERN.fullmatch(candidate) else None


def user_id_error():
    return (
        jsonify(
            error_key="user_id_required",
            hint_key="user_id_required",
            message="A local user identifier is required to apply the daily image limit.",
        ),
        400,
    )


def local_day_bounds():
    """Return UTC ISO timestamps for the current calendar day in app timezone."""
    now = datetime.now(APP_TIMEZONE)
    start = datetime.combine(now.date(), datetime_time.min, tzinfo=APP_TIMEZONE)
    end = start + timedelta(days=1)
    return (
        start.astimezone(timezone.utc).isoformat(timespec="seconds"),
        end.astimezone(timezone.utc).isoformat(timespec="seconds"),
    )


def get_user_daily_usage(user_id):
    start, end = local_day_bounds()
    with database() as connection:
        row = connection.execute(
            """SELECT COALESCE(SUM(steps), 0) AS steps,
                      COUNT(DISTINCT COALESCE(request_id, id)) AS requests
               FROM generations
               WHERE user_id = ? AND created_at >= ? AND created_at < ?""",
            (user_id, start, end),
        ).fetchone()
    return {"steps": int(row["steps"]), "requests": int(row["requests"])}


def daily_quota(user_id):
    usage = get_user_daily_usage(user_id)
    remaining_images = max(0, DAILY_IMAGE_LIMIT - usage["requests"])
    remaining_steps = max(0, DAILY_USER_STEP_LIMIT - usage["steps"])
    return {
        "images_used": usage["requests"],
        "image_limit": DAILY_IMAGE_LIMIT,
        "images_remaining": remaining_images,
        "steps_used": usage["steps"],
        "step_limit": DAILY_USER_STEP_LIMIT,
        "steps_remaining": remaining_steps,
        "percent_images_used": round(usage["requests"] * 100 / DAILY_IMAGE_LIMIT),
    }


def quota_message(quota, downgraded=False):
    remaining = quota["images_remaining"]
    if downgraded:
        return (
            "Your higher-detail choice would exceed today's AI-work allowance, so PictureWise "
            "used the Economy setting instead. "
            f"You have {remaining} of {DAILY_IMAGE_LIMIT} picture requests remaining today."
        )
    if quota["images_used"] == 1:
        return (
            f"You have used 1 of your {DAILY_IMAGE_LIMIT} picture requests today. "
            "One request remains today."
        )
    if remaining == 0:
        return "You have used both picture requests for today. Your allowance resets tomorrow."
    return f"You have {remaining} of {DAILY_IMAGE_LIMIT} picture requests remaining today."


def legacy_quota_message(quota, downgraded=False):
    remaining = quota["images_remaining"]
    if downgraded:
        return (
            "Your Higher-detail request would exceed today's 12-step allowance, so an "
            "Economy (4-step) image was generated instead. "
            f"You have {remaining} of {DAILY_IMAGE_LIMIT} daily images remaining; use them carefully."
        )
    if quota["images_used"] == 1:
        return (
            "You have used 1 of your 2 daily images (50%). "
            "One image remains today—use it carefully."
        )
    if remaining == 0:
        return "You have used both of your 2 daily images. Your allowance resets tomorrow."
    return f"You have {remaining} of {DAILY_IMAGE_LIMIT} daily images remaining."


def save_generation(image, prompt, profile, mode, latency_ms, user_id):
    generation_id = uuid.uuid4().hex
    image_file = None
    try:
        header, encoded = image.split(",", 1)
        mime = header.split(";", 1)[0].replace("data:", "")
        extension = {"image/jpeg": "jpg", "image/png": "png", "image/svg+xml": "svg"}.get(mime, "img")
        image_file = f"{generation_id}.{extension}"
        (GENERATED_DIR / image_file).write_bytes(base64.b64decode(encoded))
    except (ValueError, OSError):
        image_file = None

    created_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with database() as connection:
        connection.execute(
            """INSERT INTO generations
               (id, prompt, purpose, quality_tier, steps, mode, latency_ms, image_file, user_id, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                generation_id,
                prompt[:1000],
                profile["purpose"],
                profile["quality_tier"],
                profile["steps"],
                mode,
                max(0, int(latency_ms)),
                image_file,
                user_id,
                created_at,
            ),
        )
    return generation_id


def resource_estimate(profile, option_count=1):
    """Return an auditable, step-based estimate for one or more image choices.

    The provider does not expose measured energy or billed cost for a request.  A
    compute unit is therefore deliberately defined as one requested inference
    step.  Keeping both the per-image and request totals makes the display
    useful while preserving that distinction.
    """
    steps = profile["steps"]
    option_count = max(1, int(option_count))
    avoided_steps = MAX_STEPS - steps
    total_compute_units = steps * option_count
    maximum_compute_units = MAX_STEPS * option_count
    total_saved_units = avoided_steps * option_count
    return {
        "metric": "relative_inference_step_units",
        "steps": steps,
        "maximum_steps": MAX_STEPS,
        "estimated_compute_units": steps,
        "relative_step_units": steps,
        "saved_compute_units_vs_max": avoided_steps,
        "percent_fewer_steps_vs_max": profile["percent_fewer_steps"],
        "option_count": option_count,
        "total_inference_steps": total_compute_units,
        "total_compute_units": total_compute_units,
        "maximum_compute_units": maximum_compute_units,
        "total_saved_compute_units_vs_max": total_saved_units,
        "calculation": (
            f"{steps} requested steps x {option_count} choice(s) = {total_compute_units} estimated units; "
            f"{MAX_STEPS} maximum steps x {option_count} choice(s) = {maximum_compute_units} units; "
            f"savings = {maximum_compute_units} - {total_compute_units} = {total_saved_units} units "
            f"({profile['percent_fewer_steps']}% fewer steps)."
        ),
        "note": "Step-based relative compute estimate; not measured energy use, carbon, or provider billing.",
    }


def demo_svg(prompt, profile, language="en"):
    is_colouring = profile["purpose"] == "colouring"
    stroke = "#55408f" if is_colouring else "#7558b7"
    fill = "#ffffff" if is_colouring else "#f2edff"
    safe_prompt = html.escape(prompt[:75])
    demo_label = DEMO_LABELS.get(language, DEMO_LABELS["en"])
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" rx="24" fill="{fill}"/><g stroke="{stroke}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="320" cy="205" r="82"/><path d="M240 205q80-100 160 0M280 210h2m78 0h2M285 240q35 30 70 0M180 425q25-95 100-70h80q75-25 100 70zM260 425v65m120-65v65M165 500h310"/></g><text x="320" y="555" text-anchor="middle" font-family="Arial" font-size="18" fill="#334155">{demo_label}</text><text x="320" y="585" text-anchor="middle" font-family="Arial" font-size="14" fill="#64748b">{safe_prompt}</text></svg>'''
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode("ascii")


def generated_response(
    image,
    mode,
    profile,
    user_id,
    message_key=None,
    prompt="",
    latency_ms=0,
    requested_tier=None,
    downgraded=False,
):
    generation_id = save_generation(image, prompt, profile, mode, latency_ms, user_id)
    quota = daily_quota(user_id)
    payload = dict(
        success=True,
        image=image,
        mode=mode,
        provider=AI_PROVIDER,
        purpose=profile["purpose"],
        quality_tier=profile["quality_tier"],
        requested_quality_tier=requested_tier or profile["quality_tier"],
        quality_downgraded=downgraded,
        resource_estimate=resource_estimate(profile),
        quota=quota,
        quota_message=quota_message(quota, downgraded),
        history_id=generation_id,
        image_url=f"/api/images/{generation_id}?user_id={user_id}",
        latency_ms=max(0, int(latency_ms)),
    )
    if message_key:
        payload["message_key"] = message_key
    return jsonify(payload)


def normalize_prompt(prompt):
    """Create a small, explainable search key for local prompt memory."""
    words = re.findall(r"[a-z0-9]+", prompt.lower())
    useful_words = [word for word in words if word not in PROMPT_STOPWORDS]
    return " ".join(useful_words[:80])


def prompt_similarity(left, right):
    left_words = set(left.split())
    right_words = set(right.split())
    if not left_words or not right_words:
        return 0.0
    return len(left_words & right_words) / len(left_words | right_words)


def find_prompt_memory(purpose, english_prompt):
    normalized_prompt = normalize_prompt(english_prompt)
    if not normalized_prompt:
        return None
    with database() as connection:
        rows = connection.execute(
            """SELECT normalized_prompt, quality_tier, use_count
               FROM prompt_memory WHERE purpose = ?""",
            (purpose,),
        ).fetchall()

    best_match = None
    best_score = 0.0
    for row in rows:
        candidate = row["normalized_prompt"]
        if candidate == normalized_prompt:
            return {
                "match_type": "same",
                "quality_tier": row["quality_tier"],
                "score": 1.0,
                "use_count": int(row["use_count"]),
            }
        score = prompt_similarity(normalized_prompt, candidate)
        if score > best_score:
            best_score = score
            best_match = row

    if best_match and best_score >= SIMILARITY_THRESHOLD:
        return {
            "match_type": "related",
            "quality_tier": best_match["quality_tier"],
            "score": round(best_score, 2),
            "use_count": int(best_match["use_count"]),
        }
    return None


def remember_prompt_quality(purpose, english_prompt, quality_tier):
    normalized_prompt = normalize_prompt(english_prompt)
    if not normalized_prompt:
        return
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with database() as connection:
        connection.execute(
            """INSERT INTO prompt_memory
               (purpose, normalized_prompt, quality_tier, use_count, created_at, updated_at)
               VALUES (?, ?, ?, 1, ?, ?)
               ON CONFLICT(purpose, normalized_prompt) DO UPDATE SET
                 quality_tier = excluded.quality_tier,
                 use_count = prompt_memory.use_count + 1,
                 updated_at = excluded.updated_at""",
            (purpose, normalized_prompt, quality_tier, now, now),
        )


def should_translate_prompt(prompt, language):
    if language not in ("ta", "hi"):
        return False
    # Do not translate a prompt that is already written with Latin characters.
    return bool(re.search(r"[\u0900-\u097f\u0b80-\u0bff]", prompt))


def translate_prompt_to_english(prompt, language):
    """Translate Tamil/Hindi prompts with Workers AI and keep a safe local fallback."""
    if not should_translate_prompt(prompt, language):
        return prompt, False, None
    if not (CF_ACCOUNT_ID and CF_TOKEN):
        return prompt, False, "Translation is unavailable, so the original prompt was used."
    try:
        response = requests.post(
            CF_TRANSLATION_API,
            headers={"Authorization": f"Bearer {CF_TOKEN}"},
            json={
                "text": prompt,
                "source_lang": PROMPT_LANGUAGE_CODES.get(language, "en"),
                "target_lang": "en",
            },
            timeout=30,
        )
        body = response.json() if response.content else {}
        result = body.get("result", body) if isinstance(body, dict) else {}
        translated = result.get("translated_text") if isinstance(result, dict) else None
        if response.ok and isinstance(translated, str) and translated.strip():
            return translated.strip(), True, None
    except (requests.RequestException, ValueError):
        pass
    return prompt, False, "Translation could not be completed, so the original prompt was used."


def provider_is_configured():
    if AI_PROVIDER == "cloudflare":
        return bool(CF_ACCOUNT_ID and CF_TOKEN)
    if AI_PROVIDER == "huggingface":
        return bool(HF_TOKEN)
    return False


def provider_failure(response, body, provider):
    if provider == "cloudflare":
        errors = body.get("errors") or [] if isinstance(body, dict) else []
        provider_message = "; ".join(
            str(item.get("message", ""))
            for item in errors
            if isinstance(item, dict) and item.get("message")
        )
        provider_message = provider_message or str(body.get("message", "") if isinstance(body, dict) else "")
        low_message = provider_message.lower()
        if "daily free allocation" in low_message or "neurons" in low_message:
            return {"error_key": "error_cf_daily_limit", "hint_key": "hint_cf_daily_limit", "status": 502}
    else:
        provider_message = str(body.get("error") or body.get("message") or "").lower() if isinstance(body, dict) else ""
        if "deprecated" in provider_message or "not supported by provider" in provider_message:
            return {"error_key": "error_hf_model", "hint_key": "hint_hf_model", "status": 502}
        if "no remaining credits" in provider_message or "pre-paid credits" in provider_message:
            return {"error_key": "error_hf_credits", "hint_key": "hint_hf_credits", "status": 502}
    if response.status_code in (401, 403):
        return {"error_key": "error_provider_auth", "hint_key": "hint_cf_auth" if provider == "cloudflare" else "hint_hf_auth", "status": 502}
    if response.status_code in (429, 503):
        return {"error_key": "error_provider_busy", "hint_key": "hint_provider_busy", "status": 502}
    return {"error_key": "error_provider_failed", "hint_key": "hint_provider_failed", "status": 502}


def generate_option(styled_prompt, profile, language, option_number):
    """Generate one visual option, or a labelled demo preview without credentials."""
    if not provider_is_configured():
        return demo_svg(f"Option {option_number}: {styled_prompt}", profile, language), "demo", None
    try:
        if AI_PROVIDER == "cloudflare":
            response = requests.post(
                CF_API,
                headers={"Authorization": f"Bearer {CF_TOKEN}"},
                json={"prompt": styled_prompt, "steps": profile["steps"]},
                timeout=180,
            )
            try:
                body = response.json()
            except ValueError:
                body = {}
            body = body if isinstance(body, dict) else {}
            result = body.get("result") or {}
            image_b64 = result.get("image") if isinstance(result, dict) else None
            if response.ok and isinstance(image_b64, str) and image_b64:
                return "data:image/jpeg;base64," + image_b64, "live", None
            content_type = response.headers.get("content-type", "").lower()
            if response.ok and content_type.startswith("image/"):
                mime = content_type.split(";", 1)[0]
                return "data:" + mime + ";base64," + base64.b64encode(response.content).decode("ascii"), "live", None
            return None, None, provider_failure(response, body, "cloudflare")

        response = requests.post(
            HF_API,
            headers={"Authorization": f"Bearer {HF_TOKEN}"},
            json={
                "inputs": styled_prompt,
                "parameters": {
                    "width": profile["width"],
                    "height": profile["height"],
                    "num_inference_steps": profile["steps"],
                },
            },
            timeout=180,
        )
        content_type = response.headers.get("content-type", "").lower()
        if response.ok and content_type.startswith("image/"):
            return "data:image/png;base64," + base64.b64encode(response.content).decode("ascii"), "live", None
        try:
            body = response.json()
        except ValueError:
            body = {}
        return None, None, provider_failure(response, body, "huggingface")
    except requests.exceptions.Timeout:
        return None, None, {"error_key": "error_timeout", "hint_key": "hint_timeout", "status": 504}
    except requests.exceptions.ConnectionError:
        return None, None, {"error_key": "error_connection", "hint_key": "hint_connection", "status": 502}
    except requests.RequestException:
        return None, None, {"error_key": "error_request", "hint_key": "hint_request", "status": 502}


def save_generation_option(image, prompt, english_prompt, profile, mode, latency_ms, user_id, request_id, option_number):
    generation_id = uuid.uuid4().hex
    image_file = None
    try:
        header, encoded = image.split(",", 1)
        mime = header.split(";", 1)[0].replace("data:", "")
        extension = {"image/jpeg": "jpg", "image/png": "png", "image/svg+xml": "svg"}.get(mime, "img")
        image_file = f"{generation_id}.{extension}"
        (GENERATED_DIR / image_file).write_bytes(base64.b64decode(encoded))
    except (ValueError, OSError):
        image_file = None

    created_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with database() as connection:
        connection.execute(
            """INSERT INTO generations
               (id, prompt, purpose, quality_tier, steps, mode, latency_ms, image_file, user_id,
                created_at, request_id, option_number, prompt_english)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                generation_id, prompt[:1000], profile["purpose"], profile["quality_tier"],
                profile["steps"], mode, max(0, int(latency_ms)), image_file, user_id,
                created_at, request_id, option_number, english_prompt[:1000],
            ),
        )
    return generation_id, image_file


def multi_option_payload(
    images, mode, profile, user_id, prompt, english_prompt, requested_tier, latency_ms,
    memory_match=None, translated=False, translation_note=None, downgraded=False,
):
    request_id = uuid.uuid4().hex
    options = []
    per_option_latency = round(latency_ms / max(1, len(images)))
    for option_number, image in enumerate(images, start=1):
        generation_id, image_file = save_generation_option(
            image, prompt, english_prompt, profile, mode, per_option_latency, user_id,
            request_id, option_number,
        )
        options.append(
            {
                "number": option_number,
                "image": image,
                "history_id": generation_id,
                "image_url": f"/api/images/{generation_id}?user_id={user_id}",
                "image_type": image_file.rsplit(".", 1)[-1] if image_file else None,
            }
        )
    remember_prompt_quality(profile["purpose"], english_prompt, profile["quality_tier"])
    quota = daily_quota(user_id)
    estimate = resource_estimate(profile, len(options))
    estimate.update(
        note=(
            "Step-based relative compute estimate for every option; not measured energy use, "
            "carbon, or provider billing."
        ),
    )
    return dict(
        success=True,
        image=options[0]["image"],
        image_url=options[0]["image_url"],
        history_id=options[0]["history_id"],
        options=options,
        option_count=len(options),
        mode=mode,
        provider=AI_PROVIDER,
        purpose=profile["purpose"],
        quality_tier=profile["quality_tier"],
        requested_quality_tier=requested_tier,
        quality_downgraded=downgraded,
        quality_from_memory=bool(memory_match),
        memory_match=memory_match,
        prompt_translation={
            "translated": translated,
            "english_prompt": english_prompt,
            "note": translation_note,
        },
        resource_estimate=estimate,
        quota=quota,
        quota_message=quota_message(quota, downgraded),
        latency_ms=max(0, int(latency_ms)),
    )


def multi_option_response(*args, **kwargs):
    """Keep the JSON API response used by the mobile client and older callers."""
    return jsonify(multi_option_payload(*args, **kwargs))


def stream_event(event, **data):
    """Encode one newline-delimited progress event for the browser client."""
    return json.dumps({"event": event, **data}, separators=(",", ":")) + "\n"


def progress_estimate(profile, option_count, completed_options):
    estimate = resource_estimate(profile, option_count)
    estimate.update(
        completed_option_count=max(0, min(int(completed_options), int(option_count))),
        completed_compute_units=profile["steps"] * max(0, min(int(completed_options), int(option_count))),
    )
    return estimate


def streamed_generation(
    profile, option_count, prompt, english_prompt, language, audience, user_id,
    requested_tier, memory_match, translated, translation_note, downgraded, started_at,
):
    """Yield the plan and per-choice estimate while provider calls are in progress."""
    yield stream_event(
        "plan",
        quality_tier=profile["quality_tier"],
        requested_quality_tier=requested_tier,
        quality_downgraded=downgraded,
        resource_estimate=progress_estimate(profile, option_count, 0),
    )

    variation_notes = (
        "Use a centered, balanced composition with the main subject clearly visible.",
        "Use a different simple composition while keeping the same subject and learning goal.",
    )
    images = []
    mode = "demo"
    for option_number in range(1, option_count + 1):
        yield stream_event(
            "option_started",
            option_number=option_number,
            option_count=option_count,
            resource_estimate=progress_estimate(profile, option_count, len(images)),
        )
        styled_prompt = (
            f"{english_prompt}. Intended use: {profile['label']}. "
            f"Style: {profile['style']}. Suitable for children aged {audience}. "
            f"Option {option_number}: {variation_notes[option_number - 1]}"
        )
        image, option_mode, failure = generate_option(
            styled_prompt, profile, language, option_number,
        )
        if failure:
            yield stream_event(
                "error",
                error_key=failure["error_key"],
                hint_key=failure["hint_key"],
                status=failure["status"],
            )
            return
        images.append(image)
        mode = option_mode
        yield stream_event(
            "option_completed",
            option_number=option_number,
            option_count=option_count,
            mode=mode,
            resource_estimate=progress_estimate(profile, option_count, len(images)),
        )

    result = multi_option_payload(
        images=images,
        mode=mode,
        profile=profile,
        user_id=user_id,
        prompt=prompt,
        english_prompt=english_prompt,
        requested_tier=requested_tier,
        latency_ms=round((time.perf_counter() - started_at) * 1000),
        memory_match=memory_match,
        translated=translated,
        translation_note=translation_note,
        downgraded=downgraded,
    )
    yield stream_event("complete", result=result)


def provider_error(error_key, hint_key, status=502):
    return jsonify(error_key=error_key, hint_key=hint_key), status


@app.get("/")
def home():
    return send_from_directory("views", "index.html")


@app.get("/api/health")
def health():
    configured = provider_is_configured()
    return jsonify(
        status="ok",
        ai_configured=configured,
        provider=AI_PROVIDER,
        model=CF_MODEL if AI_PROVIDER == "cloudflare" else HF_MODEL,
        mode="live AI" if configured else "demo preview",
        daily_image_limit=DAILY_IMAGE_LIMIT,
        daily_user_step_limit=DAILY_USER_STEP_LIMIT,
        choices_per_new_prompt=2,
    )


@app.post("/api/plan")
def plan():
    data = request.get_json(silent=True)
    if data is None:
        data = {}
    if not isinstance(data, dict):
        return jsonify(error="Request body must be a JSON object."), 400
    purpose = data.get("purpose", "colouring")
    quality_tier = data.get("quality_tier", "economy")
    if not isinstance(purpose, str) or purpose not in PROFILES:
        return jsonify(error="Invalid purpose. Choose a supported purpose."), 400
    if not isinstance(quality_tier, str) or quality_tier not in QUALITY_TIERS:
        return jsonify(error="Invalid quality tier. Choose economy or detail."), 400
    profile = choose_profile(
        purpose,
        quality_tier,
    )
    return jsonify(
        purpose=profile["purpose"],
        quality_tier=profile["quality_tier"],
        resource_estimate=resource_estimate(profile),
        recommendation=recommend_tier(profile["purpose"]),
    )


@app.post("/api/recommend")
def recommendation():
    data = request.get_json(silent=True)
    if data is None:
        data = {}
    if not isinstance(data, dict):
        return jsonify(error="Request body must be a JSON object."), 400
    if "purpose" in data and (
        not isinstance(data["purpose"], str) or data["purpose"] not in PROFILES
    ):
        return jsonify(error="Invalid purpose. Choose a supported purpose."), 400
    if "quality_tier" in data and (
        not isinstance(data["quality_tier"], str)
        or data["quality_tier"] not in QUALITY_TIERS
    ):
        return jsonify(error="Invalid quality tier. Choose economy or detail."), 400
    if "prompt" in data:
        prompt = data.get("prompt")
        if not isinstance(prompt, str):
            return jsonify(error="Prompt must be text."), 400
        language = data.get("language", "en")
        if not isinstance(language, str) or language not in PROMPT_LANGUAGE_CODES:
            language = "unknown"
        return jsonify(infer_prompt_recommendation(prompt, language))

    purpose = data.get("purpose", "colouring")
    if not isinstance(purpose, str) or purpose not in PROFILES:
        return jsonify(error="Invalid purpose. Choose a supported purpose."), 400
    suggestion = recommend_tier(purpose)
    suggestion["purpose"] = purpose
    return jsonify(suggestion)


@app.get("/api/insights")
def insights():
    user_id = request_user_id()
    if not user_id:
        return user_id_error()
    quota = daily_quota(user_id)
    with database() as connection:
        totals = connection.execute(
            """SELECT COUNT(*) AS generations, COALESCE(SUM(steps), 0) AS steps,
                      COALESCE(AVG(latency_ms), 0) AS average_latency_ms
               FROM generations WHERE mode = 'live' AND user_id = ?""",
            (user_id,),
        ).fetchone()
        by_purpose = connection.execute(
            """SELECT purpose, COUNT(*) AS generations, COALESCE(SUM(steps), 0) AS steps
               FROM generations WHERE mode = 'live' AND user_id = ?
               GROUP BY purpose ORDER BY generations DESC""",
            (user_id,),
        ).fetchall()
        daily = connection.execute(
            """SELECT date(created_at) AS day, COUNT(*) AS generations, COALESCE(SUM(steps), 0) AS steps
               FROM generations WHERE mode = 'live' AND user_id = ?
                 AND date(created_at) >= date('now', '-6 days')
               GROUP BY date(created_at) ORDER BY day""",
            (user_id,),
        ).fetchall()

    total_generations = int(totals["generations"])
    total_steps = int(totals["steps"])
    max_comparison_steps = total_generations * MAX_STEPS
    return jsonify(
        today={
            **quota,
            "budget": DAILY_IMAGE_LIMIT,
            "remaining_steps": quota["steps_remaining"],
            "percent_used": quota["percent_images_used"],
        },
        all_time={
            "generations": total_generations,
            "steps": total_steps,
            "average_latency_ms": round(float(totals["average_latency_ms"])),
            "relative_steps_fewer_than_max": max(0, max_comparison_steps - total_steps),
        },
        by_purpose=[dict(row) for row in by_purpose],
        last_7_days=[dict(row) for row in daily],
        estimate_note=(
            "Each user can generate 2 picture requests per day. New requests may include "
            "two choices. Higher-detail requests that would exceed the 32-step daily "
            "allowance are generated in Economy mode when possible."
        ),
    )


@app.get("/api/history")
def history():
    user_id = request_user_id()
    if not user_id:
        return user_id_error()
    try:
        limit = max(1, min(100, int(request.args.get("limit", "30"))))
    except ValueError:
        limit = 30
    with database() as connection:
        rows = connection.execute(
            """SELECT id, prompt, purpose, quality_tier, steps, mode, latency_ms, created_at, image_file
               FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?""",
            (user_id, limit),
        ).fetchall()
    return jsonify(
        items=[
            {
                **{key: row[key] for key in row.keys() if key != "image_file"},
                "resource_estimate": {
                    "metric": "relative_inference_step_units",
                    "steps": row["steps"],
                    "maximum_steps": MAX_STEPS,
                    "estimated_compute_units": row["steps"],
                    "saved_compute_units_vs_max": MAX_STEPS - row["steps"],
                    "percent_fewer_steps_vs_max": round((1 - row["steps"] / MAX_STEPS) * 100),
                },
                "image_url": f"/api/images/{row['id']}?user_id={user_id}" if row["image_file"] else None,
                "image_type": row["image_file"].rsplit(".", 1)[-1] if row["image_file"] else None,
            }
            for row in rows
        ]
    )


@app.delete("/api/history")
def clear_history():
    user_id = request_user_id()
    if not user_id:
        return user_id_error()
    with database() as connection:
        rows = connection.execute(
            "SELECT image_file FROM generations WHERE user_id = ? AND image_file IS NOT NULL",
            (user_id,),
        ).fetchall()
        connection.execute("DELETE FROM generations WHERE user_id = ?", (user_id,))
    for row in rows:
        filename = row["image_file"]
        if filename and Path(filename).name == filename:
            try:
                (GENERATED_DIR / filename).unlink(missing_ok=True)
            except OSError:
                pass
    return jsonify(cleared=True)


@app.get("/api/images/<generation_id>")
def stored_image(generation_id):
    user_id = request_user_id({"user_id": request.args.get("user_id", "")})
    if not user_id:
        return user_id_error()
    with database() as connection:
        row = connection.execute(
            "SELECT image_file FROM generations WHERE id = ? AND user_id = ?",
            (generation_id, user_id),
        ).fetchone()
    if not row or not row["image_file"]:
        return jsonify(error="Image not found."), 404
    filename = row["image_file"]
    if Path(filename).name != filename:
        return jsonify(error="Image not found."), 404
    return send_from_directory(GENERATED_DIR, filename)


def legacy_generate():
    data = request.get_json(silent=True) or {}
    prompt = str(data.get("prompt", "")).strip()
    if len(prompt) < 3:
        return provider_error("error_short_prompt", "hint_short_prompt", 400)
    started_at = time.perf_counter()

    purpose = data.get("purpose", "colouring")
    requested_tier = data.get("quality_tier")
    if not requested_tier:
        requested_tier = "detail" if data.get("detail") == "high" else "economy"
    profile = choose_profile(purpose, requested_tier)
    user_id = request_user_id(data)
    if not user_id:
        return user_id_error()
    language = data.get("language", "en")
    if language not in DEMO_LABELS:
        language = "en"
    audience = str(data.get("audience", "5-7 years"))[:40]

    quota_before = daily_quota(user_id)
    if quota_before["images_used"] >= DAILY_IMAGE_LIMIT:
        return (
            jsonify(
                error_key="daily_image_limit_reached",
                hint_key="daily_image_limit_reached",
                quota=quota_before,
                quota_message=(
                    "You have reached your daily limit of 2 images. "
                    "Your allowance resets tomorrow."
                ),
            ),
            429,
        )

    downgraded = False
    # Preserve the two-image daily allowance: when a second high-detail image
    # would exceed the per-user step allowance, create an Economy version.
    if (
        profile["quality_tier"] == "detail"
        and quota_before["steps_used"] + profile["steps"] > DAILY_USER_STEP_LIMIT
    ):
        profile = choose_profile(purpose, "economy")
        downgraded = True

    if quota_before["steps_used"] + profile["steps"] > DAILY_USER_STEP_LIMIT:
        return (
            jsonify(
                error_key="daily_user_step_limit_reached",
                hint_key="daily_user_step_limit_reached",
                quota=quota_before,
                quota_message=(
                    f"You have {quota_before['steps_remaining']} of {DAILY_USER_STEP_LIMIT} "
                    "daily step units remaining. Try again tomorrow."
                ),
            ),
            429,
        )

    if AI_PROVIDER == "cloudflare":
        configured = bool(CF_ACCOUNT_ID and CF_TOKEN)
        setup_error = "missing_cloudflare_credentials"
    elif AI_PROVIDER == "huggingface":
        configured = bool(HF_TOKEN)
        setup_error = "missing_hf_credentials"
    else:
        return provider_error("error_unknown_provider", "hint_unknown_provider", 500)

    if not configured:
        return generated_response(
            demo_svg(prompt, profile, language),
            "demo",
            profile,
            user_id,
            setup_error,
            prompt=prompt,
            latency_ms=round((time.perf_counter() - started_at) * 1000),
            requested_tier=requested_tier,
            downgraded=downgraded,
        )

    styled_prompt = (
        f"{prompt}. Intended use: {profile['label']}. "
        f"Style: {profile['style']}. Suitable for children aged {audience}."
    )

    try:
        if AI_PROVIDER == "cloudflare":
            response = requests.post(
                CF_API,
                headers={"Authorization": f"Bearer {CF_TOKEN}"},
                json={"prompt": styled_prompt, "steps": profile["steps"]},
                timeout=180,
            )
            try:
                body = response.json()
            except ValueError:
                body = {}
            if not isinstance(body, dict):
                body = {}

            result = body.get("result") or {}
            image_b64 = result.get("image") if isinstance(result, dict) else None
            if response.ok and isinstance(image_b64, str) and image_b64:
                return generated_response(
                    "data:image/jpeg;base64," + image_b64,
                    "live",
                    profile,
                    user_id,
                    prompt=prompt,
                    latency_ms=round((time.perf_counter() - started_at) * 1000),
                    requested_tier=requested_tier,
                    downgraded=downgraded,
                )

            content_type = response.headers.get("content-type", "").lower()
            if response.ok and content_type.startswith("image/"):
                mime = content_type.split(";", 1)[0]
                image = "data:" + mime + ";base64," + base64.b64encode(response.content).decode("ascii")
                return generated_response(
                    image,
                    "live",
                    profile,
                    user_id,
                    prompt=prompt,
                    latency_ms=round((time.perf_counter() - started_at) * 1000),
                    requested_tier=requested_tier,
                    downgraded=downgraded,
                )

            errors = body.get("errors") or []
            if isinstance(errors, list) and errors:
                provider_message = "; ".join(
                    str(item.get("message", ""))
                    for item in errors
                    if isinstance(item, dict) and item.get("message")
                )
            else:
                provider_message = str(body.get("message", ""))
            low_message = provider_message.lower()
            if "daily free allocation" in low_message or "neurons" in low_message:
                return provider_error("error_cf_daily_limit", "hint_cf_daily_limit")
            if response.status_code in (401, 403):
                return provider_error("error_provider_auth", "hint_cf_auth")
            if response.status_code == 429:
                return provider_error("error_provider_busy", "hint_provider_busy")
            return provider_error("error_provider_failed", "hint_provider_failed")

        response = requests.post(
            HF_API,
            headers={"Authorization": f"Bearer {HF_TOKEN}"},
            json={
                "inputs": styled_prompt,
                "parameters": {
                    "width": profile["width"],
                    "height": profile["height"],
                    "num_inference_steps": profile["steps"],
                },
            },
            timeout=180,
        )
        content_type = response.headers.get("content-type", "").lower()
        if not response.ok or not content_type.startswith("image/"):
            try:
                body = response.json()
            except ValueError:
                body = {}
            if not isinstance(body, dict):
                body = {}
            message = str(body.get("error") or body.get("message") or "").lower()
            if "deprecated" in message or "not supported by provider" in message:
                return provider_error("error_hf_model", "hint_hf_model")
            if "no remaining credits" in message or "pre-paid credits" in message:
                return provider_error("error_hf_credits", "hint_hf_credits")
            if response.status_code in (401, 403):
                return provider_error("error_provider_auth", "hint_hf_auth")
            if response.status_code == 503:
                return provider_error("error_provider_busy", "hint_provider_busy")
            return provider_error("error_provider_failed", "hint_provider_failed")

        image = "data:image/png;base64," + base64.b64encode(response.content).decode("ascii")
        return generated_response(
            image,
            "live",
            profile,
            user_id,
            prompt=prompt,
            latency_ms=round((time.perf_counter() - started_at) * 1000),
            requested_tier=requested_tier,
            downgraded=downgraded,
        )

    except requests.exceptions.Timeout:
        return provider_error("error_timeout", "hint_timeout", 504)
    except requests.exceptions.ConnectionError:
        return provider_error("error_connection", "hint_connection")
    except requests.RequestException:
        return provider_error("error_request", "hint_request")


@app.post("/api/generate")
def generate():
    """Create two choices for a new request, or one for a remembered match."""
    data = request.get_json(silent=True)
    if data is None:
        data = {}
    if not isinstance(data, dict):
        return jsonify(error="Request body must be a JSON object."), 400
    prompt = str(data.get("prompt", "")).strip()
    if len(prompt) < 3:
        return provider_error("error_short_prompt", "hint_short_prompt", 400)

    user_id = request_user_id(data)
    if not user_id:
        return user_id_error()
    purpose = data.get("purpose", "colouring")
    if not isinstance(purpose, str) or purpose not in PROFILES:
        return jsonify(error="Invalid purpose. Choose a supported purpose."), 400
    if "quality_tier" in data:
        requested_tier = data.get("quality_tier")
        if not isinstance(requested_tier, str) or requested_tier not in QUALITY_TIERS:
            return jsonify(error="Invalid quality tier. Choose economy or detail."), 400
    else:
        requested_tier = None
    if requested_tier is None:
        requested_tier = "detail" if data.get("detail") == "high" else "economy"
    if "quality_tier_override" in data and not isinstance(
        data["quality_tier_override"], bool
    ):
        return jsonify(error="quality_tier_override must be true or false."), 400
    language = data.get("language", "en")
    if language not in PROMPT_LANGUAGE_CODES:
        language = "en"
    audience = str(data.get("audience", "5-7 years"))[:40]
    started_at = time.perf_counter()

    english_prompt, translated, translation_note = translate_prompt_to_english(prompt, language)
    memory_match = find_prompt_memory(purpose, english_prompt)
    tier_override = data.get("quality_tier_override") is True
    selected_tier = (
        requested_tier
        if tier_override or not memory_match
        else memory_match["quality_tier"]
    )
    profile = choose_profile(purpose, selected_tier)
    option_count = 1 if memory_match else 2

    quota_before = daily_quota(user_id)
    if quota_before["images_used"] >= DAILY_IMAGE_LIMIT:
        return (
            jsonify(
                error_key="daily_image_limit_reached",
                hint_key="daily_image_limit_reached",
                quota=quota_before,
                quota_message=(
                    f"You have reached your daily limit of {DAILY_IMAGE_LIMIT} picture requests. "
                    "Your allowance resets tomorrow."
                ),
            ),
            429,
        )

    planned_steps = profile["steps"] * option_count
    downgraded = False
    if (
        profile["quality_tier"] == "detail"
        and quota_before["steps_used"] + planned_steps > DAILY_USER_STEP_LIMIT
    ):
        economy_profile = choose_profile(purpose, "economy")
        economy_steps = economy_profile["steps"] * option_count
        if quota_before["steps_used"] + economy_steps <= DAILY_USER_STEP_LIMIT:
            profile = economy_profile
            planned_steps = economy_steps
            downgraded = True

    if quota_before["steps_used"] + planned_steps > DAILY_USER_STEP_LIMIT:
        return (
            jsonify(
                error_key="daily_user_step_limit_reached",
                hint_key="daily_user_step_limit_reached",
                quota=quota_before,
                quota_message=(
                    f"You have {quota_before['steps_remaining']} of {DAILY_USER_STEP_LIMIT} "
                    "AI-work units left today. Try again tomorrow."
                ),
            ),
            429,
        )

    if AI_PROVIDER not in ("cloudflare", "huggingface"):
        return provider_error("error_unknown_provider", "hint_unknown_provider", 500)

    if data.get("stream") is True:
        return Response(
            stream_with_context(
                streamed_generation(
                    profile=profile,
                    option_count=option_count,
                    prompt=prompt,
                    english_prompt=english_prompt,
                    language=language,
                    audience=audience,
                    user_id=user_id,
                    requested_tier=requested_tier,
                    memory_match=memory_match,
                    translated=translated,
                    translation_note=translation_note,
                    downgraded=downgraded,
                    started_at=started_at,
                )
            ),
            mimetype="application/x-ndjson",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )

    variation_notes = (
        "Use a centered, balanced composition with the main subject clearly visible.",
        "Use a different simple composition while keeping the same subject and learning goal.",
    )
    images = []
    mode = "demo"
    for option_number in range(1, option_count + 1):
        styled_prompt = (
            f"{english_prompt}. Intended use: {profile['label']}. "
            f"Style: {profile['style']}. Suitable for children aged {audience}. "
            f"Option {option_number}: {variation_notes[option_number - 1]}"
        )
        image, option_mode, failure = generate_option(
            styled_prompt, profile, language, option_number,
        )
        if failure:
            return provider_error(
                failure["error_key"], failure["hint_key"], failure["status"],
            )
        images.append(image)
        mode = option_mode

    return multi_option_response(
        images=images,
        mode=mode,
        profile=profile,
        user_id=user_id,
        prompt=prompt,
        english_prompt=english_prompt,
        requested_tier=requested_tier,
        latency_ms=round((time.perf_counter() - started_at) * 1000),
        memory_match=memory_match,
        translated=translated,
        translation_note=translation_note,
        downgraded=downgraded,
    )


init_store()


if __name__ == "__main__":
    port = int(os.getenv("PICTUREWISE_PORT", "5000"))
    host = os.getenv("PICTUREWISE_HOST", "127.0.0.1").strip()
    print(f"PictureWise AI: http://{host}:{port} | provider={AI_PROVIDER}")
    app.run(host=host, port=port, debug=False)
