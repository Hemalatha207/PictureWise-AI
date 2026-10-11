# PictureWise AI — Judge Presentation Notes

## Four-member Tamil presentation

### Member 1 — Scenario

“வணக்கம். எங்கள் project-ன் பெயர் PictureWise AI. ஒரு மாவட்டக் கல்வி அலுவலகம் 300 பள்ளிகளுக்காக worksheets, flashcards, posters மற்றும் colouring sheets உருவாக்க AI image tool பயன்படுத்தியது. ஆனால் எல்லாப் படங்களும் ஒரே settings-ல் உருவாக்கப்பட்டதால், ஒரு மாதத்திற்குள் cloud bill மூன்று மடங்காக அதிகரித்தது.”

### Member 2 — Problem statement

“பிரச்சனை AI தவறாகப் படம் உருவாக்கியது இல்லை. அது படம் எதற்காகப் பயன்படும் என்று கேட்கவில்லை. எளிய colouring sheet-க்கும் விரிவான poster-க்கும் ஒரே அளவு generation effort பயன்படுத்தப்பட்டது. இதனால் தேவைக்கு அதிகமான computing resources செலவானது; அந்த resource பயன்பாடும் பயனருக்குத் தெரியவில்லை.”

### Member 3 — Solution

“PictureWise-ல், பயனர் முதலில் படத்தின் பயன்பாட்டைத் தேர்வு செய்கிறார்: colouring sheet, worksheet, flashcard அல்லது poster. அதன் பிறகு Economy அல்லது Higher detail என்ற quality tier-ஐத் தேர்வு செய்கிறார். Economy tier model-க்கு 4 inference steps அனுப்புகிறது; Higher detail tier 8 steps அனுப்புகிறது. Generate செய்வதற்கு முன்பும், படம் உருவான பிறகும், தேர்ந்தெடுத்த படிகளையும் 8-step tier-உடனான ஒப்பீட்டையும் app காட்டுகிறது. Purpose-க்கு ஏற்ற visual style-யும் prompt-ல் சேர்க்கப்படுகிறது.”

### Member 4 — Technologies and honest measurement

“Frontend-க்கு HTML, CSS, JavaScript பயன்படுத்தியுள்ளோம்; backend Python Flask-ல் உள்ளது. Live image generation-க்கு Cloudflare Workers AI-யின் FLUX.1 Schnell model-ஐ API வழியாக இணைத்துள்ளோம். Interface-ஐ English, தமிழ், हिन्दी ஆகிய மொழிகளில் பயன்படுத்தலாம். 4 steps என்பது 8-step tier-ஐவிட 50% குறைவான inference steps என்பதைக் காட்டுகிறோம். இது step-based relative compute estimate மட்டுமே; 50% energy அல்லது cloud bill savings என்று நாங்கள் claim செய்யவில்லை. உண்மையான energy மற்றும் billing savings-ஐ benchmark செய்வது அடுத்த கட்டப் பணி. நன்றி.”

## Demo flow

1. Header-இல் language selector-ஐக் காட்டி English, தமிழ், हिन्दी-க்கு மாற்றுங்கள்.
2. Purpose-ஐத் தேர்வு செய்து prompt எழுதுங்கள்.
3. Economy (4 steps) மற்றும் Higher detail (8 steps) tier-களை மாற்றி, provider step count மற்றும் estimate மாறுவதைக் காட்டுங்கள்.
4. Generate செய்து result summary-யில் பயன்படுத்திய tier, steps, relative units, 8-step comparison ஆகியவற்றைக் காட்டுங்கள்.
5. Estimate-ஐச் சுட்டிக்காட்டும்போது, அது step count அடிப்படையிலானது; measured energy அல்லது invoice savings அல்ல என்று தெளிவுபடுத்துங்கள்.

## One-sentence project summary

PictureWise AI asks what an educational image is for, lets the user choose a real inference-step tier, and makes the resulting step-based resource estimate visible.

## Likely judge questions

**Q: Does Economy really reduce the model work?**  
For the configured Cloudflare path, the app sends 4 inference steps for Economy and 8 for Higher detail. The step count is different in the actual API request.

**Q: Does 4 steps mean 50% less energy or 50% lower cost?**  
No. It means 50% fewer inference steps than the 8-step tier. Energy and total provider billing need provider or hardware measurements; the interface labels its figure as a relative estimate.

**Q: Does purpose change the image size?**  
No. Purpose changes the prompt's visual style. The Cloudflare FLUX.1 Schnell API integration does not expose width and height in its documented input, so the app does not show resolution as a controllable setting.

**Q: Who decides the quality?**  
The requester selects the purpose and quality tier. In this prototype, the profile rules are fixed in the app; a district could configure approved policies in a future version.

**Q: What technologies did you use?**  
HTML, CSS, and JavaScript for the interface; Python Flask for the API; Cloudflare Workers AI with FLUX.1 Schnell for live image generation; and browser-side language dictionaries for English, Tamil, and Hindi.

## Validation still needed

The displayed estimate tracks inference steps, not measured energy, carbon emissions, total Neurons, or invoice cost. Before claiming real savings, benchmark prompts at both tiers, compare output quality, and record provider usage, latency, and billing. The purpose profiles are deterministic rules, not a trained classifier.
