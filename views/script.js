const translations = {
  en: {
    page_title: 'PictureWise AI | Purpose-aware image generation', brand_aria: 'PictureWise AI home', menu_toggle: 'Toggle navigation menu', menu_navigation: 'Main navigation', menu_home: 'Home', menu_create: 'Create an image', menu_plan: 'AI work guide', menu_cost: 'Constraint 1: Cost & savings', menu_how: 'How it works', mode_checking: 'Checking mode…', mode_live: 'Live AI connected', mode_demo: 'Demo mode available', language_label: 'Language', edition: 'EDUCATION EDITION',
    hero_eyebrow: 'SMARTER GENERATION, LESS WASTE', hero_title: 'Every picture deserves the right amount of AI.', hero_copy: 'Purpose-aware image generation for schools. Match image quality to the task, avoid over-processing simple visuals, and make compute use visible.', stat_schools: 'schools in the scenario', stat_profiles: 'purpose-based profiles', stat_effort: 'right-sized effort',
    create_heading: 'Create an image', routing_label: 'PURPOSE ROUTING', purpose_label: 'What is this picture for?', purpose_colouring: 'Colouring sheet', purpose_colouring_desc: 'Bold outlines · black and white', purpose_worksheet: 'Worksheet', purpose_worksheet_desc: 'Simple learning visual', purpose_flashcard: 'Flashcard', purpose_flashcard_desc: 'Clear and memorable', purpose_poster: 'Full-colour poster', purpose_poster_desc: 'More detail for display',
    prompt_label: 'Describe the image', prompt_placeholder: 'Example: A friendly butterfly sitting on a flower, with large simple shapes…', quality_label: 'Generation effort', tier_economy: 'Economy (SD-style)', tier_detail: 'Higher detail (HD-style)', audience_label: 'Age group', age_5_7: '5–7 years', age_8_10: '8–10 years', age_11_14: '11–14 years', age_general: 'General audience', tip_title: 'Purpose-aware generation', tip_body: 'Choose an SD-style or HD-style effort level. The live resource estimate appears after generation starts.', generate_button: 'Generate image', generating_button: 'Generating image…',
    plan_heading: 'Resource plan', auto_tag: 'LIVE PLAN', plan_subtitle: 'See the model settings before generation.', selected_profile: 'SELECTED PROFILE', style_colouring: 'Bold outlines and no shading', style_worksheet: 'A simple educational illustration', style_flashcard: 'A bright, uncluttered learning visual', style_poster: 'A detailed, full-colour display image',
    metric_quality: 'Quality tier', metric_steps: 'Provider inference steps', metric_units: 'Relative step units', units: 'units', steps_word: 'steps', savings_title: 'Fewer steps than highest tier', baseline_note: 'Compared with the 8-step higher-detail tier.', compare_max: 'Highest-detail tier', compare_selected: 'Selected tier', estimate_disclaimer: 'Step-based relative compute estimate; not measured energy use or total cloud billing.',
    result_heading: 'Generated image', summary_label: 'GENERATION SUMMARY', summary_quality: 'Quality tier', summary_steps: 'Inference steps used', summary_units: 'Estimated compute cost (relative units)', summary_reduction: 'Saving vs maximum setting', result_estimate_note: 'Calculation: requested inference steps are the compute units; saving is 8 maximum steps minus the requested steps. This is not measured energy or billing.', download_button: 'Download image', demo_preview: 'DEMO PREVIEW', live_generation: 'LIVE AI IMAGE', image_alt: 'Generated image preview',
    how_eyebrow: 'HOW IT WORKS', how_heading: 'A useful image, with a visible effort choice.', how_one_title: 'Choose the purpose', how_one_body: 'Select a colouring sheet, worksheet, flashcard, or poster.', how_two_title: 'Choose the effort', how_two_body: 'Choose Economy for a simple visual or Higher detail for a richer composition.', how_three_title: 'See the estimate', how_three_body: 'The live step-based estimate appears once image generation starts.', footer_note: 'Purpose-aware image generation · Prototype',
    alert_short_prompt: 'Please enter a description with at least 3 characters.', alert_short_prompt_hint: 'Describe what you want the image to show.', alert_demo_cf: 'Demo preview only. Add your Cloudflare account ID and API token to .env for live generation.', alert_demo_hf: 'Demo preview only. Add your Hugging Face token to .env for live generation.', alert_success: 'Image generated. The estimate below uses the step count sent to the provider.', alert_local_server: 'Could not reach the local app. Check that the server is running.',
    error_short_prompt: 'Please enter a short image description.', hint_short_prompt: 'Use at least 3 characters.', error_unknown_provider: 'The configured AI provider is not recognized.', hint_unknown_provider: 'Set AI_PROVIDER to cloudflare or huggingface in .env.', error_cf_daily_limit: 'Cloudflare Workers AI has reached its free daily allocation.', hint_cf_daily_limit: 'Check the Cloudflare dashboard or try again after the daily reset.', error_provider_auth: 'The AI provider rejected the credentials or account.', hint_cf_auth: 'Check the Cloudflare account ID and Workers AI token permissions.', hint_hf_auth: 'Check your Hugging Face token and model access.', error_provider_busy: 'The AI provider is temporarily busy or unavailable.', hint_provider_busy: 'Check provider status and try again later.', error_provider_failed: 'The AI provider could not complete this request.', hint_provider_failed: 'Check the account, model configuration, and provider status.', error_hf_model: 'The selected Hugging Face model is not available for image generation.', hint_hf_model: 'Choose a supported text-to-image model.', error_hf_credits: 'The Hugging Face account has no remaining inference credits.', hint_hf_credits: 'Check your provider usage and billing settings.', error_timeout: 'The image request timed out.', hint_timeout: 'Check provider usage before retrying; it may have received the request.', error_connection: 'The connection to the AI provider was interrupted.', hint_connection: 'Check your internet connection and provider usage before retrying.', error_request: 'The AI provider request failed.', hint_request: 'Check your internet connection and provider status.'
  },
  ta: {
    page_title: 'PictureWise AI | பயன்பாட்டிற்கேற்ற பட உருவாக்கம்', brand_aria: 'PictureWise AI முகப்பு', menu_toggle: 'வழிசெலுத்தல் பட்டியை மாற்று', menu_navigation: 'முதன்மை வழிசெலுத்தல்', menu_home: 'முகப்பு', menu_create: 'படம் உருவாக்குங்கள்', menu_plan: 'AI வேலை வழிகாட்டி', menu_cost: 'கட்டுப்பாடு 1: செலவும் சேமிப்பும்', menu_how: 'இது எவ்வாறு செயல்படுகிறது', mode_checking: 'நிலையைச் சரிபார்க்கிறது…', mode_live: 'நேரடி AI இணைப்பு உள்ளது', mode_demo: 'டெமோ முறை தயார்', language_label: 'மொழி', edition: 'கல்விக்கான பதிப்பு',
    hero_eyebrow: 'சிறந்த உருவாக்கம் · குறைந்த வீணாக்கம்', hero_title: 'ஒவ்வொரு படத்திற்கும் தேவையான அளவு AI முயற்சி.', hero_copy: 'பள்ளிகளுக்கான பயன்பாட்டை அடிப்படையாகக் கொண்ட பட உருவாக்கம். படத்தின் தேவைக்கேற்ப தரத்தைத் தேர்வு செய்து, கணினி முயற்சியைப் பயனருக்குக் காட்டுகிறது.', stat_schools: 'scenario-வில் உள்ள பள்ளிகள்', stat_profiles: 'பயன்பாட்டு வகைகள்', stat_effort: 'தேவைக்கேற்ற முயற்சி',
    create_heading: 'படம் உருவாக்குங்கள்', routing_label: 'பயன்பாட்டைத் தேர்வு செய்யுங்கள்', purpose_label: 'இந்தப் படம் எதற்காக?', purpose_colouring: 'வண்ணம் தீட்டும் படம்', purpose_colouring_desc: 'தடித்த கோடுகள் · கருப்பு வெள்ளை', purpose_worksheet: 'பயிற்சித்தாள்', purpose_worksheet_desc: 'எளிய கற்றல் படம்', purpose_flashcard: 'கற்றல் அட்டை', purpose_flashcard_desc: 'தெளிவான, நினைவில் நிற்கும் படம்', purpose_poster: 'முழு வண்ணச் சுவரொட்டி', purpose_poster_desc: 'காட்சிக்கான கூடுதல் விவரம்',
    prompt_label: 'படத்தை விவரிக்கவும்', prompt_placeholder: 'உதாரணம்: பெரிய எளிய வடிவங்களுடன் பூவில் அமர்ந்திருக்கும் வண்ணத்துப்பூச்சி…', quality_label: 'படத் தர நிலை', tier_economy: 'சிக்கன நிலை', tier_detail: 'கூடுதல் விவரம்', audience_label: 'வயது குழு', age_5_7: '5–7 வயது', age_8_10: '8–10 வயது', age_11_14: '11–14 வயது', age_general: 'பொதுப் பார்வையாளர்கள்', tip_title: 'பயன்பாட்டை உணரும் உருவாக்கம்', tip_body: 'பயன்பாடு படத்தின் பாணியைத் தேர்வு செய்கிறது. படம் உருவாகத் தொடங்கியதும் வள மதிப்பீடு காட்டப்படும்.', generate_button: 'படத்தை உருவாக்கு', generating_button: 'படம் உருவாகிறது…',
    plan_heading: 'வளப் பயன்பாட்டுத் திட்டம்', auto_tag: 'நேரடி திட்டம்', plan_subtitle: 'உருவாக்கத்திற்கு முன் model அமைப்புகளைப் பாருங்கள்.', selected_profile: 'தேர்ந்தெடுத்த வகை', style_colouring: 'தடித்த வெளிக்கோடுகள்; நிழல் இல்லை', style_worksheet: 'எளிய கல்வி விளக்கப்படம்', style_flashcard: 'பிரகாசமான, குழப்பமில்லாத கற்றல் படம்', style_poster: 'விவரமான முழு வண்ணக் காட்சி படம்',
    metric_quality: 'தர நிலை', metric_steps: 'Provider inference படிகள்', metric_units: 'ஒப்பீட்டு படி அலகுகள்', units: 'அலகுகள்', steps_word: 'படிகள்', savings_title: 'அதிகபட்ச நிலையைவிடக் குறைந்த படிகள்', baseline_note: '8 படிகள் கொண்ட உயர்தர நிலையுடன் ஒப்பிடுகிறது.', compare_max: 'அதிகபட்ச தர நிலை', compare_selected: 'தேர்ந்தெடுத்த நிலை', estimate_disclaimer: 'படிகளின் அடிப்படையிலான ஒப்பீட்டு கணிப்பு மட்டுமே; உண்மையான ஆற்றல் பயன்பாடோ cloud கட்டணமோ அல்ல.',
    result_heading: 'உருவாக்கிய படம்', summary_label: 'உருவாக்கச் சுருக்கம்', summary_quality: 'தர நிலை', summary_steps: 'பயன்படுத்திய inference படிகள்', summary_units: 'ஒப்பீட்டு step units', summary_reduction: 'அதிகபட்ச நிலையைவிடக் குறைந்த படிகள்', download_button: 'படத்தைப் பதிவிறக்கு', demo_preview: 'டெமோ முன்னோட்டம்', live_generation: 'நேரடி AI படம்', image_alt: 'உருவாக்கிய படத்தின் முன்னோட்டம்',
    how_eyebrow: 'செயல்முறை', how_heading: 'பயனுள்ள படம்; முயற்சியையும் நீங்களே தேர்வு செய்யலாம்.', how_one_title: 'பயன்பாட்டைத் தேர்வு செய்யுங்கள்', how_one_body: 'வண்ணம் தீட்டும் படம், பயிற்சித்தாள், கற்றல் அட்டை அல்லது சுவரொட்டியைத் தேர்வு செய்யுங்கள்.', how_two_title: 'முயற்சி அளவைத் தேர்வு செய்யுங்கள்', how_two_body: 'எளிய படத்திற்கு சிக்கன நிலையையும், கூடுதல் விவரமுள்ள படத்திற்கு உயர்ந்த நிலையையும் தேர்வு செய்யுங்கள்.', how_three_title: 'கணிப்பைப் பாருங்கள்', how_three_body: 'படம் உருவாகத் தொடங்கியதும் நேரடி படி மதிப்பீடு காட்டப்படும்.', footer_note: 'பயன்பாட்டிற்கேற்ற AI பட உருவாக்கம் · Prototype',
    alert_short_prompt: 'குறைந்தது 3 எழுத்துகள் கொண்ட பட விளக்கத்தை எழுதுங்கள்.', alert_short_prompt_hint: 'படத்தில் என்ன இருக்க வேண்டும் என்று விவரிக்கவும்.', alert_demo_cf: 'இது டெமோ முன்னோட்டம் மட்டுமே. நேரடி உருவாக்கத்திற்கு Cloudflare Account ID மற்றும் API token-ஐ .env-ல் சேர்க்கவும்.', alert_demo_hf: 'இது டெமோ முன்னோட்டம் மட்டுமே. நேரடி உருவாக்கத்திற்கு Hugging Face token-ஐ .env-ல் சேர்க்கவும்.', alert_success: 'படம் உருவாக்கப்பட்டது. கீழே உள்ள கணிப்பு provider-க்கு அனுப்பிய படிகளின் எண்ணிக்கையை அடிப்படையாகக் கொண்டது.', alert_local_server: 'உள்ளூர் app-ஐ அணுக முடியவில்லை. Server இயங்குகிறதா என்று சரிபார்க்கவும்.',
    error_short_prompt: 'சிறிய பட விளக்கத்தை எழுதுங்கள்.', hint_short_prompt: 'குறைந்தது 3 எழுத்துகள் இருக்க வேண்டும்.', error_unknown_provider: 'அமைக்கப்பட்ட AI provider அறியப்படவில்லை.', hint_unknown_provider: '.env-ல் AI_PROVIDER-ஐ cloudflare அல்லது huggingface என அமைக்கவும்.', error_cf_daily_limit: 'Cloudflare Workers AI-யின் தினசரி இலவச வரம்பு முடிந்துவிட்டது.', hint_cf_daily_limit: 'Cloudflare dashboard-ல் usage-ஐ பாருங்கள் அல்லது தினசரி reset-க்குப் பிறகு முயற்சிக்கவும்.', error_provider_auth: 'AI provider credentials அல்லது account-ஐ ஏற்கவில்லை.', hint_cf_auth: 'Cloudflare Account ID மற்றும் Workers AI token permissions-ஐச் சரிபார்க்கவும்.', hint_hf_auth: 'Hugging Face token மற்றும் model access-ஐச் சரிபார்க்கவும்.', error_provider_busy: 'AI provider தற்காலிகமாக busy-யாக உள்ளது அல்லது கிடைக்கவில்லை.', hint_provider_busy: 'Provider status-ஐப் பார்த்து சிறிது நேரம் கழித்து முயற்சிக்கவும்.', error_provider_failed: 'AI provider இந்த request-ஐ முடிக்க முடியவில்லை.', hint_provider_failed: 'Account, model அமைப்பு, provider status ஆகியவற்றைச் சரிபார்க்கவும்.', error_hf_model: 'தேர்ந்தெடுத்த Hugging Face model பட உருவாக்கத்திற்கு கிடைக்கவில்லை.', hint_hf_model: 'பட உருவாக்கத்தை ஆதரிக்கும் model-ஐத் தேர்வு செய்யவும்.', error_hf_credits: 'Hugging Face inference credits மீதமில்லை.', hint_hf_credits: 'Provider usage மற்றும் billing அமைப்புகளைப் பாருங்கள்.', error_timeout: 'பட request-க்கு நேரம் முடிந்துவிட்டது.', hint_timeout: 'மீண்டும் முயற்சிக்கும் முன் provider usage-ஐப் பாருங்கள்; request ஏற்கனவே சென்றிருக்கலாம்.', error_connection: 'AI provider-க்கான இணைப்பு துண்டிக்கப்பட்டது.', hint_connection: 'மீண்டும் முயற்சிக்கும் முன் internet மற்றும் provider usage-ஐச் சரிபார்க்கவும்.', error_request: 'AI provider request தோல்வியடைந்தது.', hint_request: 'Internet இணைப்பு மற்றும் provider status-ஐச் சரிபார்க்கவும்.'
  },
  hi: {
    page_title: 'PictureWise AI | उपयोग के अनुसार चित्र निर्माण', brand_aria: 'PictureWise AI मुख्य पृष्ठ', menu_toggle: 'नेविगेशन मेनू खोलें या बंद करें', menu_navigation: 'मुख्य नेविगेशन', menu_home: 'होम', menu_create: 'चित्र बनाएँ', menu_plan: 'AI कार्य मार्गदर्शिका', menu_cost: 'शर्त 1: लागत और बचत', menu_how: 'यह कैसे काम करता है', mode_checking: 'स्थिति जाँची जा रही है…', mode_live: 'लाइव AI जुड़ा है', mode_demo: 'डेमो मोड उपलब्ध', language_label: 'भाषा', edition: 'शिक्षा संस्करण',
    hero_eyebrow: 'बेहतर निर्माण · कम संसाधन व्यर्थ', hero_title: 'हर चित्र को उतनी ही AI मेहनत चाहिए जितनी ज़रूरी है।', hero_copy: 'स्कूलों के लिए उपयोग के अनुसार चित्र निर्माण। काम के अनुसार गुणवत्ता चुनें और संसाधन उपयोग को स्पष्ट देखें।', stat_schools: 'scenario में स्कूल', stat_profiles: 'उपयोग प्रोफ़ाइल', stat_effort: 'ज़रूरत के अनुसार प्रयास',
    create_heading: 'चित्र बनाएँ', routing_label: 'उपयोग चुनें', purpose_label: 'यह चित्र किस काम के लिए है?', purpose_colouring: 'रंग भरने की शीट', purpose_colouring_desc: 'मोटी रेखाएँ · श्वेत-श्याम', purpose_worksheet: 'वर्कशीट', purpose_worksheet_desc: 'सरल शिक्षण चित्र', purpose_flashcard: 'फ्लैशकार्ड', purpose_flashcard_desc: 'स्पष्ट और याद रखने योग्य', purpose_poster: 'रंगीन पोस्टर', purpose_poster_desc: 'प्रदर्शन के लिए अधिक विवरण',
    prompt_label: 'चित्र का वर्णन करें', prompt_placeholder: 'उदाहरण: बड़े सरल आकारों वाला फूल पर बैठा एक दोस्ताना तितली…', quality_label: 'गुणवत्ता स्तर', tier_economy: 'कम संसाधन', tier_detail: 'अधिक विवरण', audience_label: 'आयु समूह', age_5_7: '5–7 वर्ष', age_8_10: '8–10 वर्ष', age_11_14: '11–14 वर्ष', age_general: 'सामान्य दर्शक', tip_title: 'उपयोग के अनुसार निर्माण', tip_body: 'उपयोग चित्र की शैली चुनता है। चित्र बनना शुरू होने पर संसाधन अनुमान दिखेगा।', generate_button: 'चित्र बनाएँ', generating_button: 'चित्र बन रहा है…',
    plan_heading: 'संसाधन योजना', auto_tag: 'लाइव योजना', plan_subtitle: 'चित्र बनाने से पहले model सेटिंग देखें।', selected_profile: 'चुनी गई प्रोफ़ाइल', style_colouring: 'मोटी बाहरी रेखाएँ, बिना छाया', style_worksheet: 'सरल शैक्षिक चित्र', style_flashcard: 'चमकीला और साफ़ शिक्षण चित्र', style_poster: 'विस्तृत रंगीन प्रदर्शन चित्र',
    metric_quality: 'गुणवत्ता स्तर', metric_steps: 'Provider inference चरण', metric_units: 'तुलनात्मक चरण इकाइयाँ', units: 'इकाइयाँ', steps_word: 'चरण', savings_title: 'सबसे ऊँचे स्तर से कम चरण', baseline_note: '8-चरण वाले अधिक-विवरण स्तर से तुलना।', compare_max: 'सबसे अधिक विवरण', compare_selected: 'चुना गया स्तर', estimate_disclaimer: 'यह चरणों पर आधारित तुलनात्मक अनुमान है; मापी गई ऊर्जा या कुल cloud बिल नहीं।',
    result_heading: 'बनाया गया चित्र', summary_label: 'निर्माण सारांश', summary_quality: 'गुणवत्ता स्तर', summary_steps: 'इस्तेमाल किए गए inference चरण', summary_units: 'तुलनात्मक चरण इकाइयाँ', summary_reduction: 'सबसे ऊँचे स्तर से कम चरण', download_button: 'चित्र डाउनलोड करें', demo_preview: 'डेमो पूर्वावलोकन', live_generation: 'लाइव AI चित्र', image_alt: 'बनाए गए चित्र का पूर्वावलोकन',
    how_eyebrow: 'यह कैसे काम करता है', how_heading: 'काम का चित्र और प्रयास का स्पष्ट विकल्प।', how_one_title: 'उपयोग चुनें', how_one_body: 'रंग भरने की शीट, वर्कशीट, फ्लैशकार्ड या पोस्टर चुनें।', how_two_title: 'प्रयास चुनें', how_two_body: 'सरल चित्रों के लिए कम संसाधन और अधिक बारीक चित्रों के लिए अधिक विवरण चुनें।', how_three_title: 'अनुमान देखें', how_three_body: 'चित्र बनना शुरू होने पर लाइव चरण-आधारित अनुमान दिखेगा।', footer_note: 'उपयोग के अनुसार AI चित्र निर्माण · Prototype',
    alert_short_prompt: 'कम से कम 3 अक्षरों में चित्र का वर्णन लिखें।', alert_short_prompt_hint: 'बताएँ कि चित्र में क्या दिखना चाहिए।', alert_demo_cf: 'यह केवल डेमो पूर्वावलोकन है। लाइव निर्माण के लिए Cloudflare Account ID और API token को .env में जोड़ें।', alert_demo_hf: 'यह केवल डेमो पूर्वावलोकन है। लाइव निर्माण के लिए Hugging Face token को .env में जोड़ें।', alert_success: 'चित्र बन गया। नीचे का अनुमान provider को भेजे गए चरणों पर आधारित है।', alert_local_server: 'स्थानीय app से संपर्क नहीं हो पाया। जाँचें कि server चल रहा है।',
    error_short_prompt: 'कृपया चित्र का छोटा वर्णन लिखें।', hint_short_prompt: 'कम से कम 3 अक्षर लिखें।', error_unknown_provider: 'सेट किया गया AI provider पहचाना नहीं गया।', hint_unknown_provider: '.env में AI_PROVIDER को cloudflare या huggingface रखें।', error_cf_daily_limit: 'Cloudflare Workers AI की दैनिक मुफ्त सीमा पूरी हो गई है।', hint_cf_daily_limit: 'Cloudflare dashboard में उपयोग देखें या अगले दैनिक reset के बाद प्रयास करें।', error_provider_auth: 'AI provider ने credentials या account स्वीकार नहीं किया।', hint_cf_auth: 'Cloudflare Account ID और Workers AI token permissions जाँचें।', hint_hf_auth: 'Hugging Face token और model access जाँचें।', error_provider_busy: 'AI provider अभी व्यस्त है या उपलब्ध नहीं है।', hint_provider_busy: 'Provider स्थिति देखें और कुछ देर बाद फिर प्रयास करें।', error_provider_failed: 'AI provider यह request पूरी नहीं कर पाया।', hint_provider_failed: 'Account, model सेटिंग और provider स्थिति जाँचें।', error_hf_model: 'चुना गया Hugging Face model चित्र निर्माण के लिए उपलब्ध नहीं है।', hint_hf_model: 'Text-to-image समर्थित model चुनें।', error_hf_credits: 'Hugging Face inference credits बाकी नहीं हैं।', hint_hf_credits: 'Provider उपयोग और billing सेटिंग देखें।', error_timeout: 'चित्र request का समय समाप्त हो गया।', hint_timeout: 'फिर से प्रयास से पहले provider उपयोग देखें; request पहुँच चुकी हो सकती है।', error_connection: 'AI provider से connection टूट गया।', hint_connection: 'फिर से प्रयास से पहले internet और provider उपयोग जाँचें।', error_request: 'AI provider request विफल रही।', hint_request: 'Internet connection और provider स्थिति जाँचें।'
  }
};

const simpleWords = {
  en: {
    cost_eyebrow: 'CONSTRAINT 1', cost_heading: 'Estimated cost and savings, explained',
    cost_intro: 'Every generated result shows estimated compute work alongside the savings versus the maximum-detail setting.',
    cost_unit_heading: 'What the estimate means',
    cost_unit_body: 'One compute unit equals one requested model inference step. It is a consistent estimate of relative AI work, not a measured energy or provider-billing amount.',
    cost_formula_heading: 'How it is calculated',
    cost_formula_body: 'Total estimated units = selected steps per image × number of generated choices. Savings = (8 maximum steps − selected steps) × number of choices. Savings percent = saved units ÷ maximum possible units × 100.',
    cost_example_heading: 'Example: 2 economy choices',
    cost_example_body: '4 steps × 2 choices = 8 estimated units. Maximum: 8 × 2 = 16 units. Saved: 16 − 8 = 8 units, or 50% less compute work.',
    cost_disclaimer: 'Actual energy use and cloud costs vary by model, hardware, provider, and runtime. The app displays this estimate with each generation result.',
    simple_estimated_cost: 'Estimated compute cost', simple_savings_vs_max: 'Savings vs maximum setting',
    recommend_panel_title: 'Purpose and effort suggestion',
    recommend_neutral: 'Waiting for your description',
    recommend_neutral_hint: 'Describe the image to get a recommendation.',
    recommend_checking: 'Checking your description…',
    recommend_unavailable: 'The recommendation could not be loaded. Your choices have not been changed.',
    recommend_ready: 'Suggestion ready',
    recommend_unclear: 'Purpose unclear',
    recommend_purpose_label: 'Suggested purpose',
    recommend_tier_label: 'Suggested tier',
    recommend_confidence_high: 'Clear clue',
    recommend_confidence_medium: 'Likely',
    recommend_confidence_low: 'Unclear',
    recommend_ambiguity: 'We could not confidently infer the purpose. Choose a purpose or add a clue such as colouring page, worksheet, flashcard, or poster.',
    recommend_language_uncertain: 'The prompt language could not be identified confidently. The suggestion uses recognizable English, Tamil, or Hindi purpose clues only.',
    recommend_clues_label: 'Matched clues',
    recommend_reason_detail: 'You asked for a detailed or complex image, so Higher detail is suggested.',
    recommend_reason_simple: 'You asked for a simple image or clear outline, so Economy is suggested.',
    recommend_reason_poster: 'Display posters and banners benefit from richer visual detail.',
    recommend_reason_default: 'When the purpose is unclear or the request is straightforward, Economy is a conservative starting point.',
    recommend_purpose_override: 'Your selected purpose differs from the suggestion; your choice is being kept.',
    recommend_tier_override: 'Your selected tier differs from the suggestion; your choice is being kept.',
    recommend_use: 'Use recommendation',
    recommend_choose_purpose: 'Choose a purpose before generating.',
    recommend_choose_purpose_hint: 'The request did not make the intended use clear enough to select one automatically.',
    simple_prompt_note: 'You can write in English, Tamil, or Hindi. PictureWise sends an English version to the image AI.',
    simple_plan_heading: 'Before you create', simple_plan_tag: 'AI WORK GUIDE',
    simple_plan_subtitle: 'See how much work the AI will use. New requests show two choices.',
    simple_your_choice: 'YOUR CHOICE', simple_picture_detail: 'Picture detail',
    simple_ai_work_one: 'AI work for one picture', simple_ai_work_choices: 'AI work for two choices',
    simple_less_work: 'Less AI work than high detail', simple_less_work_note: 'For each picture, compared with high detail.',
    simple_more_detail: 'More detail', simple_your_setting: 'Your setting',
    simple_choices_note: 'A new description makes two picture choices. A matching saved description makes one choice.',
    simple_result_heading: 'Choose a picture', simple_result_summary: 'ABOUT THESE PICTURES',
    simple_choices_made: 'Choices made', simple_ai_work_total: 'Total AI work',
    simple_result_note: 'This is a guide based on AI steps. It is not your exact cloud bill.',
    simple_option: 'Option', simple_choose_option: 'Choose this picture',
    simple_translated_prompt: 'English prompt sent to the image AI',
    simple_memory_same: 'We found the same saved request. It uses the saved picture detail and gives one choice.',
    simple_memory_related: 'We found a similar saved request. It uses the saved picture detail and gives one choice.',
    simple_two_choices: 'Two picture choices are ready.', simple_one_choice: 'One matching picture choice is ready.',
    simple_live_estimate_label: 'LIVE ESTIMATE', simple_live_estimate_heading: 'Calculation for this generation', simple_live_ready: 'Ready', simple_live_generating: 'Generating', simple_live_complete: 'Complete', simple_live_failed: 'Not completed', simple_live_requested: 'Requested work', simple_live_maximum: 'Maximum baseline', simple_live_saved: 'Saved work', simple_live_progress: 'Generation progress', simple_live_relative_note: 'Relative step units only — not measured energy or billed cost.', simple_live_elapsed: 'Elapsed', simple_live_choices_complete: 'choices complete',
    history_menu: 'History', history_eyebrow: 'YOUR LIBRARY', history_title: 'Generation history', history_intro: 'Images generated on this device appear here.', history_open_hint: 'Choose History to see your saved images.', history_loading: 'Loading your image history…', history_empty: 'No saved images yet. Generated images will appear here.', history_failed: 'Could not load image history.', history_image_count: 'saved images', history_open_image: 'Open full-size image', history_live: 'Live AI', history_demo: 'Demo preview', history_steps: 'steps'
  },
  ta: {
    cost_eyebrow: 'கட்டுப்பாடு 1', cost_heading: 'மதிப்பிடப்பட்ட செலவும் சேமிப்பும்',
    cost_intro: 'ஒவ்வொரு உருவாக்கப்பட்ட முடிவிலும் மதிப்பிடப்பட்ட கணினிச் செயல்பாடும் அதிகபட்ச விவர அமைப்புடன் ஒப்பிடும் சேமிப்பும் காட்டப்படும்.',
    cost_unit_heading: 'மதிப்பீட்டின் பொருள்',
    cost_unit_body: 'ஒரு கணினி அலகு என்பது மாதிரிக்குக் கோரப்பட்ட ஒரு inference படியைக் குறிக்கும். இது ஒப்பீட்டுக்கான AI செயல்பாட்டு மதிப்பீடு; அளவிடப்பட்ட ஆற்றல் பயன்பாடோ வழங்குநர் கட்டணமோ அல்ல.',
    cost_formula_heading: 'கணக்கிடும் முறை',
    cost_formula_body: 'மொத்த மதிப்பிடப்பட்ட அலகுகள் = ஒரு படத்திற்கான தேர்ந்தெடுத்த படிகள் × உருவாக்கிய படத் தேர்வுகளின் எண்ணிக்கை. சேமிப்பு = (அதிகபட்சம் 8 படிகள் − தேர்ந்தெடுத்த படிகள்) × தேர்வுகளின் எண்ணிக்கை. சேமிப்பு சதவீதம் = சேமித்த அலகுகள் ÷ அதிகபட்ச அலகுகள் × 100.',
    cost_example_heading: 'எடுத்துக்காட்டு: 2 எளிய தேர்வுகள்',
    cost_example_body: '4 படிகள் × 2 தேர்வுகள் = 8 மதிப்பிடப்பட்ட அலகுகள். அதிகபட்சம்: 8 × 2 = 16 அலகுகள். சேமிப்பு: 16 − 8 = 8 அலகுகள்; அதாவது 50% குறைந்த கணினிச் செயல்பாடு.',
    cost_disclaimer: 'உண்மையான ஆற்றல் பயன்பாடும் மேகக் கட்டணமும் மாதிரி, வன்பொருள், வழங்குநர் மற்றும் இயங்கும் நேரத்தைப் பொறுத்து மாறும். ஒவ்வொரு முடிவுடனும் இந்த மதிப்பீடு காட்டப்படும்.',
    simple_estimated_cost: 'மதிப்பிடப்பட்ட கணினிச் செலவு', simple_savings_vs_max: 'அதிகபட்ச அமைப்புடன் ஒப்பிடும் சேமிப்பு',
    recommend_panel_title: 'பயன்பாடு மற்றும் முயற்சி பரிந்துரை',
    recommend_neutral: 'உங்கள் விளக்கத்திற்காக காத்திருக்கிறது',
    recommend_neutral_hint: 'பரிந்துரை பெற படத்தை விவரிக்கவும்.',
    recommend_checking: 'விளக்கத்தைச் சரிபார்க்கிறது…',
    recommend_unavailable: 'பரிந்துரையைப் பெற முடியவில்லை. உங்கள் தேர்வுகள் மாற்றப்படவில்லை.',
    recommend_ready: 'பரிந்துரை தயார்',
    recommend_unclear: 'பயன்பாடு தெளிவில்லை',
    recommend_purpose_label: 'பரிந்துரைக்கப்படும் பயன்பாடு',
    recommend_tier_label: 'பரிந்துரைக்கப்படும் தரம்',
    recommend_confidence_high: 'தெளிவான குறிப்பு',
    recommend_confidence_medium: 'சாத்தியம்',
    recommend_confidence_low: 'தெளிவில்லை',
    recommend_ambiguity: 'பயன்பாட்டை நம்பகமாக ஊகிக்க முடியவில்லை. பயன்பாட்டைத் தேர்ந்தெடுக்கவும் அல்லது வண்ணம் தீட்டும் பக்கம், பயிற்சித்தாள், கற்றல் அட்டை அல்லது சுவரொட்டி போன்ற குறிப்பைச் சேர்க்கவும்.',
    recommend_language_uncertain: 'விளக்கத்தின் மொழியை உறுதியாக அடையாளம் காண முடியவில்லை. அறியப்பட்ட ஆங்கிலம், தமிழ் அல்லது இந்தி பயன்பாட்டுக் குறிப்புகள் மட்டுமே பரிந்துரைக்கப் பயன்படுத்தப்பட்டன.',
    recommend_clues_label: 'பொருந்திய குறிப்புகள்',
    recommend_reason_detail: 'விவரமான அல்லது சிக்கலான படம் கேட்டுள்ளீர்கள்; கூடுதல் விவரம் பரிந்துரைக்கப்படுகிறது.',
    recommend_reason_simple: 'எளிய படம் அல்லது தெளிவான வெளிக்கோடு கேட்டுள்ளீர்கள்; சிக்கனமான தரம் பரிந்துரைக்கப்படுகிறது.',
    recommend_reason_poster: 'காட்சிக்கான சுவரொட்டிகளுக்கு கூடுதல் காட்சி விவரம் உதவும்.',
    recommend_reason_default: 'பயன்பாடு தெளிவில்லாதபோது அல்லது கோரிக்கை எளிமையாக இருக்கும்போது, சிக்கனமான தரம் பாதுகாப்பான தொடக்கமாகும்.',
    recommend_purpose_override: 'உங்கள் பயன்பாட்டுத் தேர்வு பரிந்துரையிலிருந்து மாறுபடுகிறது; உங்கள் தேர்வே வைக்கப்பட்டுள்ளது.',
    recommend_tier_override: 'உங்கள் தரத் தேர்வு பரிந்துரையிலிருந்து மாறுபடுகிறது; உங்கள் தேர்வே வைக்கப்பட்டுள்ளது.',
    recommend_use: 'பரிந்துரையைப் பயன்படுத்து',
    recommend_choose_purpose: 'உருவாக்கும் முன் பயன்பாட்டைத் தேர்ந்தெடுக்கவும்.',
    recommend_choose_purpose_hint: 'தானாகத் தேர்வு செய்யும் அளவுக்கு இந்தக் கோரிக்கையின் பயன்பாடு தெளிவாக இல்லை.',
    simple_prompt_note: 'ஆங்கிலம், தமிழ் அல்லது இந்தியில் எழுதலாம். பட AI-க்கு ஆங்கில வடிவம் அனுப்பப்படும்.',
    simple_plan_heading: 'உருவாக்கும் முன்', simple_plan_tag: 'AI வேலை வழிகாட்டி',
    simple_plan_subtitle: 'AI எவ்வளவு வேலை செய்கிறது என்பதைப் பாருங்கள். புதிய கோரிக்கைக்கு இரண்டு தேர்வுகள் வரும்.',
    simple_your_choice: 'உங்கள் தேர்வு', simple_picture_detail: 'பட விவரம்',
    simple_ai_work_one: 'ஒரு படத்திற்கான AI வேலை', simple_ai_work_choices: 'இரண்டு தேர்வுகளுக்கான AI வேலை',
    simple_less_work: 'அதிக விவரத்தை விட குறைந்த AI வேலை', simple_less_work_note: 'ஒவ்வொரு படத்திற்கும் அதிக விவரத்துடன் ஒப்பிடப்பட்டது.',
    simple_more_detail: 'அதிக விவரம்', simple_your_setting: 'உங்கள் அமைப்பு',
    simple_choices_note: 'புதிய விளக்கம் இரண்டு படத் தேர்வுகளை உருவாக்கும். பொருந்தும் சேமித்த விளக்கம் ஒரு தேர்வை உருவாக்கும்.',
    simple_result_heading: 'ஒரு படத்தைத் தேர்ந்தெடுக்கவும்', simple_result_summary: 'இந்தப் படங்கள் பற்றி',
    simple_choices_made: 'உருவாக்கிய தேர்வுகள்', simple_ai_work_total: 'மொத்த AI வேலை',
    simple_result_note: 'இது AI படிகளின் அடிப்படையிலான வழிகாட்டி. இது சரியான cloud கட்டணம் அல்ல.',
    simple_option: 'தேர்வு', simple_choose_option: 'இந்தப் படத்தைத் தேர்ந்தெடுக்கவும்',
    simple_translated_prompt: 'பட AI-க்கு அனுப்பிய ஆங்கில விளக்கம்',
    simple_memory_same: 'இதே சேமித்த கோரிக்கை கிடைத்தது. சேமித்த பட விவரம் பயன்படுத்தப்பட்டு ஒரு தேர்வு தரப்பட்டது.',
    simple_memory_related: 'ஒத்த சேமித்த கோரிக்கை கிடைத்தது. சேமித்த பட விவரம் பயன்படுத்தப்பட்டு ஒரு தேர்வு தரப்பட்டது.',
    simple_two_choices: 'இரண்டு படத் தேர்வுகள் தயார்.', simple_one_choice: 'பொருந்தும் ஒரு படத் தேர்வு தயார்.'
  },
  hi: {
    cost_eyebrow: 'शर्त 1', cost_heading: 'अनुमानित लागत और बचत की जानकारी',
    cost_intro: 'हर तैयार परिणाम के साथ अनुमानित कंप्यूट कार्य और अधिकतम-विवरण सेटिंग की तुलना में बचत दिखाई जाती है।',
    cost_unit_heading: 'अनुमान का अर्थ',
    cost_unit_body: 'एक कंप्यूट यूनिट, मॉडल के एक अनुरोधित inference चरण के बराबर है। यह सापेक्ष AI कार्य का अनुमान है, मापी गई ऊर्जा खपत या प्रदाता का बिल नहीं।',
    cost_formula_heading: 'गणना कैसे होती है',
    cost_formula_body: 'कुल अनुमानित यूनिट = प्रति चित्र चुने गए चरण × बनाए गए विकल्पों की संख्या। बचत = (अधिकतम 8 चरण − चुने गए चरण) × विकल्पों की संख्या। बचत प्रतिशत = बचाई गई यूनिट ÷ अधिकतम संभावित यूनिट × 100।',
    cost_example_heading: 'उदाहरण: 2 इकॉनमी विकल्प',
    cost_example_body: '4 चरण × 2 विकल्प = 8 अनुमानित यूनिट। अधिकतम: 8 × 2 = 16 यूनिट। बचत: 16 − 8 = 8 यूनिट, यानी 50% कम कंप्यूट कार्य।',
    cost_disclaimer: 'वास्तविक ऊर्जा उपयोग और क्लाउड लागत मॉडल, हार्डवेयर, प्रदाता और रनटाइम के अनुसार बदलते हैं। हर जनरेशन परिणाम के साथ यह अनुमान दिखाया जाता है।',
    simple_estimated_cost: 'अनुमानित कंप्यूट लागत', simple_savings_vs_max: 'अधिकतम सेटिंग की तुलना में बचत',
    recommend_panel_title: 'उद्देश्य और प्रयास का सुझाव',
    recommend_neutral: 'आपके विवरण की प्रतीक्षा है',
    recommend_neutral_hint: 'सुझाव पाने के लिए चित्र का वर्णन करें।',
    recommend_checking: 'विवरण जाँचा जा रहा है…',
    recommend_unavailable: 'सुझाव नहीं मिल सका। आपकी पसंद नहीं बदली गई है।',
    recommend_ready: 'सुझाव तैयार',
    recommend_unclear: 'उद्देश्य स्पष्ट नहीं',
    recommend_purpose_label: 'सुझाया गया उद्देश्य',
    recommend_tier_label: 'सुझाया गया स्तर',
    recommend_confidence_high: 'स्पष्ट संकेत',
    recommend_confidence_medium: 'संभावित',
    recommend_confidence_low: 'स्पष्ट नहीं',
    recommend_ambiguity: 'उद्देश्य का भरोसे से अनुमान नहीं लगाया जा सका। कोई उद्देश्य चुनें या रंग भरने वाला पेज, वर्कशीट, फ्लैशकार्ड या पोस्टर जैसा संकेत जोड़ें।',
    recommend_language_uncertain: 'विवरण की भाषा की भरोसे से पहचान नहीं हो सकी। सुझाव केवल पहचाने गए अंग्रेज़ी, तमिल या हिंदी उद्देश्य-संकेतों का उपयोग करता है।',
    recommend_clues_label: 'मिले हुए संकेत',
    recommend_reason_detail: 'आपने विस्तृत या जटिल चित्र माँगा है, इसलिए अधिक विवरण सुझाया गया है।',
    recommend_reason_simple: 'आपने सरल चित्र या स्पष्ट रूपरेखा माँगी है, इसलिए इकॉनमी सुझाया गया है।',
    recommend_reason_poster: 'प्रदर्शन पोस्टर और बैनर में अधिक दृश्य विवरण उपयोगी होता है।',
    recommend_reason_default: 'उद्देश्य स्पष्ट न हो या अनुरोध सरल हो, तो इकॉनमी एक सावधानीपूर्ण शुरुआत है।',
    recommend_purpose_override: 'आपका चुना उद्देश्य सुझाव से अलग है; आपकी पसंद बरकरार है।',
    recommend_tier_override: 'आपका चुना स्तर सुझाव से अलग है; आपकी पसंद बरकरार है।',
    recommend_use: 'सुझाव लागू करें',
    recommend_choose_purpose: 'चित्र बनाने से पहले उद्देश्य चुनें।',
    recommend_choose_purpose_hint: 'अनुरोध में उद्देश्य इतना स्पष्ट नहीं था कि उसे अपने-आप चुना जा सके।',
    simple_prompt_note: 'आप अंग्रेज़ी, तमिल या हिंदी में लिख सकते हैं। इमेज AI को अंग्रेज़ी रूप भेजा जाएगा।',
    simple_plan_heading: 'बनाने से पहले', simple_plan_tag: 'AI कार्य मार्गदर्शक',
    simple_plan_subtitle: 'देखें कि AI कितना काम करेगा। नए अनुरोध में दो विकल्प मिलेंगे।',
    simple_your_choice: 'आपकी पसंद', simple_picture_detail: 'चित्र का विवरण',
    simple_ai_work_one: 'एक चित्र के लिए AI कार्य', simple_ai_work_choices: 'दो विकल्पों के लिए AI कार्य',
    simple_less_work: 'अधिक विवरण से कम AI कार्य', simple_less_work_note: 'हर चित्र के लिए अधिक विवरण से तुलना।',
    simple_more_detail: 'अधिक विवरण', simple_your_setting: 'आपकी सेटिंग',
    simple_choices_note: 'नया विवरण दो चित्र विकल्प बनाता है। मिलता-जुलता सहेजा विवरण एक विकल्प बनाता है।',
    simple_result_heading: 'एक चित्र चुनें', simple_result_summary: 'इन चित्रों के बारे में',
    simple_choices_made: 'बनाए गए विकल्प', simple_ai_work_total: 'कुल AI कार्य',
    simple_result_note: 'यह AI चरणों पर आधारित मार्गदर्शक है। यह आपका सही cloud bill नहीं है।',
    simple_option: 'विकल्प', simple_choose_option: 'यह चित्र चुनें',
    simple_translated_prompt: 'इमेज AI को भेजा गया अंग्रेज़ी विवरण',
    simple_memory_same: 'वही सहेजा अनुरोध मिला। सहेजी गई चित्र गुणवत्ता से एक विकल्प दिया गया।',
    simple_memory_related: 'मिलता-जुलता सहेजा अनुरोध मिला। सहेजी गई चित्र गुणवत्ता से एक विकल्प दिया गया।',
    simple_two_choices: 'दो चित्र विकल्प तैयार हैं।', simple_one_choice: 'मिलता हुआ एक चित्र विकल्प तैयार है।'
  }
};

const purposes = {
  colouring: { label: 'purpose_colouring', style: 'style_colouring', description: 'purpose_colouring_desc', symbol: '✎' },
  worksheet: { label: 'purpose_worksheet', style: 'style_worksheet', description: 'purpose_worksheet_desc', symbol: '▤' },
  flashcard: { label: 'purpose_flashcard', style: 'style_flashcard', description: 'purpose_flashcard_desc', symbol: '▣' },
  poster: { label: 'purpose_poster', style: 'style_poster', description: 'purpose_poster_desc', symbol: '▧' }
};
const tiers = {
  economy: { label: 'tier_economy', shortLabel: 'tier_economy', steps: 4 },
  detail: { label: 'tier_detail', shortLabel: 'tier_detail', steps: 8 }
};

const $ = id => document.getElementById(id);
let selectedPurpose = null;
let selectedLanguage = 'en';
let purposeOverridden = false;
let tierOverridden = false;
let recommendation = null;
let recommendationStatus = 'idle';
let recommendationTimerId = null;
let recommendationRequestId = 0;
let recommendationController = null;
let currentImage = '';
let lastResult = null;
let lastAlert = null;
let liveMode = null;
let userId = '';
let liveEstimate = {
  steps: 4,
  maximumSteps: 8,
  optionCount: 2,
  completedOptions: 0,
  status: 'ready',
  isGenerating: false,
  startedAt: 0,
  elapsedMs: 0
};
let estimateTimerId = null;
let historyLoaded = false;
let historyLoading = false;

try {
  const savedLanguage = localStorage.getItem('picturewise-language');
  if (savedLanguage && translations[savedLanguage]) selectedLanguage = savedLanguage;
  userId = localStorage.getItem('picturewise-user-id') || '';
} catch (_) {}

if (!userId) {
  const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  userId = `pw-${randomPart}`;
  try { localStorage.setItem('picturewise-user-id', userId); } catch (_) {}
}

function t(key) {
  return translations[selectedLanguage][key]
    || simpleWords[selectedLanguage]?.[key]
    || translations.en[key]
    || simpleWords.en[key]
    || key;
}

function updatePurposeCards() {
  document.querySelectorAll('.purpose-card').forEach(card => {
    const isSelected = card.dataset.purpose === selectedPurpose;
    const isRecommended = card.dataset.purpose === recommendation?.purpose;
    card.classList.toggle('selected', isSelected);
    card.classList.toggle('recommended', isRecommended);
    card.classList.toggle('manual-override', isSelected && purposeOverridden && !isRecommended);
    card.setAttribute('aria-pressed', String(isSelected));
  });
}

function renderRecommendationPanel() {
  const message = $('recommendationMessage');
  const content = $('recommendationContent');
  const status = $('recommendationStatus');
  content.hidden = true;
  message.hidden = false;

  if (recommendationStatus === 'idle') {
    status.textContent = t('recommend_neutral');
    message.textContent = t('recommend_neutral_hint');
    return;
  }
  if (recommendationStatus === 'pending') {
    status.textContent = t('recommend_checking');
    message.textContent = t('recommend_checking');
    return;
  }
  if (recommendationStatus === 'error') {
    status.textContent = t('recommend_unavailable');
    message.textContent = t('recommend_unavailable');
    return;
  }
  if (!recommendation) return;

  const inferredPurpose = recommendation.purpose;
  const purposeRow = $('recommendedPurposeRow');
  const ambiguity = !inferredPurpose || recommendation.ambiguous;
  status.textContent = ambiguity ? t('recommend_unclear') : t('recommend_ready');
  message.hidden = true;
  content.hidden = false;
  purposeRow.hidden = ambiguity;
  if (inferredPurpose) {
    $('recommendedPurpose').textContent = t(purposes[inferredPurpose].label);
    $('purposeConfidence').textContent = t(`recommend_confidence_${recommendation.purpose_confidence}`);
  }
  $('recommendedTier').textContent = t(tiers[recommendation.suggested_tier].label);

  const reasonKeys = {
    recommend_detail_explicit: 'recommend_reason_detail',
    recommend_economy_explicit: 'recommend_reason_simple',
    recommend_detail_poster: 'recommend_reason_poster',
    recommend_economy_default: 'recommend_reason_default'
  };
  $('recommendationReason').textContent = t(reasonKeys[recommendation.reason_key] || 'recommend_reason_default');

  const clues = $('recommendationClues');
  clues.hidden = !recommendation.matched_clues?.length;
  clues.textContent = clues.hidden
    ? ''
    : `${t('recommend_clues_label')}: ${recommendation.matched_clues.join(', ')}`;
  const ambiguityMessage = $('recommendationAmbiguity');
  ambiguityMessage.hidden = !ambiguity;
  ambiguityMessage.textContent = ambiguity ? t('recommend_ambiguity') : '';
  const languageWarning = $('recommendationLanguage');
  languageWarning.hidden = !recommendation.language_uncertain;
  languageWarning.textContent = recommendation.language_uncertain ? t('recommend_language_uncertain') : '';

  const purposeDiffers = Boolean(inferredPurpose && selectedPurpose !== inferredPurpose);
  const tierDiffers = $('qualityTier').value !== recommendation.suggested_tier;
  const override = $('recommendationOverride');
  const overrideMessages = [];
  if (purposeDiffers) overrideMessages.push(t('recommend_purpose_override'));
  if (tierDiffers) overrideMessages.push(t('recommend_tier_override'));
  override.hidden = overrideMessages.length === 0;
  override.textContent = overrideMessages.join(' ');
  $('useRecommendation').hidden = overrideMessages.length === 0;
}

function applyRecommendation() {
  if (!recommendation) return;
  // An ambiguous recommendation has no purpose to apply. Keep a manual
  // purpose selection intact and only restore the conservative tier.
  if (recommendation.purpose) {
    selectedPurpose = recommendation.purpose;
    purposeOverridden = false;
  }
  tierOverridden = false;
  $('qualityTier').value = recommendation.suggested_tier;
  updatePurposeCards();
  renderRecommendationPanel();
  renderPlan();
}

function scheduleRecommendation(delay = 450) {
  if (recommendationTimerId) clearTimeout(recommendationTimerId);
  if (recommendationController) recommendationController.abort();
  const requestId = ++recommendationRequestId;
  const prompt = $('prompt').value.trim();
  recommendation = null;

  if (prompt.length < 3) {
    recommendationStatus = 'idle';
    if (!purposeOverridden) selectedPurpose = null;
    if (!tierOverridden) $('qualityTier').value = 'economy';
    updatePurposeCards();
    renderRecommendationPanel();
    renderPlan();
    return;
  }

  recommendationStatus = 'pending';
  if (!purposeOverridden) selectedPurpose = null;
  if (!tierOverridden) $('qualityTier').value = 'economy';
  updatePurposeCards();
  renderRecommendationPanel();

  recommendationTimerId = setTimeout(async () => {
    const controller = new AbortController();
    recommendationController = controller;
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language: selectedLanguage }),
        signal: controller.signal
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Recommendation request failed.');
      if (requestId !== recommendationRequestId) return;
      if (
        !data
        || !tiers[data.suggested_tier]
        || (data.purpose !== null && !purposes[data.purpose])
        || !['high', 'medium', 'low'].includes(data.purpose_confidence)
      ) throw new Error('Recommendation response was invalid.');

      recommendation = data;
      recommendationStatus = 'ready';
      if (!purposeOverridden) selectedPurpose = data.purpose || null;
      if (!tierOverridden) $('qualityTier').value = data.suggested_tier;
      updatePurposeCards();
      renderRecommendationPanel();
      renderPlan();
    } catch (error) {
      if (error.name === 'AbortError' || requestId !== recommendationRequestId) return;
      recommendationStatus = 'error';
      renderRecommendationPanel();
    }
  }, delay);
}

function applyLanguage() {
  document.documentElement.lang = selectedLanguage;
  document.title = t('page_title');
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });
  $('languageSelect').value = selectedLanguage;
  $('languageSelect').setAttribute('aria-label', t('language_label'));
  if (liveMode !== null) $('modeLabel').textContent = t(liveMode ? 'mode_live' : 'mode_demo');
  if (lastAlert) {
    if (lastAlert.text) showAlertText(lastAlert.text);
    else showAlert(lastAlert.message, lastAlert.hint);
  }
  renderPlan();
  renderLiveEstimate();
  updatePurposeCards();
  renderRecommendationPanel();
  if (lastResult) renderResult(lastResult);
}

const menuToggle = $('menuToggle');
const siteMenu = $('siteMenu');
function closeMenu() {
  siteMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}

function renderHistory(items) {
  const historyGrid = $('historyGrid');
  const historyStatus = $('historyStatus');
  const historyCount = $('historyCount');
  const savedItems = items.filter(item => item.image_url);
  historyGrid.replaceChildren();
  historyCount.hidden = savedItems.length === 0;
  historyCount.textContent = `${savedItems.length} ${t('history_image_count')}`;

  if (savedItems.length === 0) {
    historyStatus.hidden = false;
    historyStatus.textContent = t('history_empty');
    return;
  }

  historyStatus.hidden = true;
  savedItems.forEach(item => {
    const card = document.createElement('article');
    card.className = 'history-card';

    const imageLink = document.createElement('a');
    imageLink.className = 'history-image-link';
    imageLink.href = item.image_url;
    imageLink.target = '_blank';
    imageLink.rel = 'noopener noreferrer';
    imageLink.setAttribute('aria-label', t('history_open_image'));

    const image = document.createElement('img');
    image.className = 'history-image';
    image.src = item.image_url;
    image.alt = item.prompt || t('history_title');
    image.loading = 'lazy';
    imageLink.appendChild(image);

    const info = document.createElement('div');
    info.className = 'history-card-info';
    const prompt = document.createElement('p');
    prompt.className = 'history-prompt';
    prompt.textContent = item.prompt || t('history_title');
    const meta = document.createElement('div');
    meta.className = 'history-meta';

    const purpose = purposes[item.purpose] || purposes.colouring;
    const tier = tiers[item.quality_tier] || tiers.economy;
    const typeLabel = document.createElement('span');
    typeLabel.textContent = `${t(purpose.label)} · ${t(tier.label)}`;
    const stepsLabel = document.createElement('span');
    stepsLabel.textContent = `${item.steps} ${t('history_steps')}`;
    const modeLabel = document.createElement('span');
    modeLabel.textContent = t(item.mode === 'live' ? 'history_live' : 'history_demo');
    const dateLabel = document.createElement('span');
    const createdAt = new Date(item.created_at);
    dateLabel.textContent = Number.isNaN(createdAt.getTime()) ? '' : createdAt.toLocaleString();

    meta.append(typeLabel, stepsLabel, modeLabel, dateLabel);
    info.append(prompt, meta);
    card.append(imageLink, info);
    historyGrid.appendChild(card);
  });
}

async function loadHistory({ refresh = false } = {}) {
  $('history').hidden = false;
  if (historyLoading || (historyLoaded && !refresh)) return;
  historyLoading = true;
  $('historyStatus').hidden = false;
  $('historyStatus').textContent = t('history_loading');

  try {
    const response = await fetch('/api/history?limit=60', {
      headers: { 'X-PictureWise-User': userId }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'history_request_failed');
    renderHistory(Array.isArray(data.items) ? data.items : []);
    historyLoaded = true;
  } catch (_) {
    $('historyCount').hidden = true;
    $('historyStatus').hidden = false;
    $('historyStatus').textContent = t('history_failed');
  } finally {
    historyLoading = false;
  }
}

menuToggle.addEventListener('click', () => {
  siteMenu.hidden = !siteMenu.hidden;
  menuToggle.setAttribute('aria-expanded', String(!siteMenu.hidden));
});
siteMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
$('historyLink').addEventListener('click', () => loadHistory());
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#history') loadHistory();
});
document.addEventListener('click', event => {
  if (!siteMenu.hidden && !siteMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !siteMenu.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});

function currentSettings() {
  const tierKey = $('qualityTier').value;
  const tier = tiers[tierKey] || tiers.economy;
  return {
    purpose: selectedPurpose,
    tierKey,
    tier,
    profile: purposes[selectedPurpose] || purposes.colouring
  };
}

function numberOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatElapsed(milliseconds) {
  return `${Math.max(0, milliseconds / 1000).toFixed(1)}s`;
}

function liveStatusText(status) {
  return t({
    ready: 'simple_live_ready',
    generating: 'simple_live_generating',
    complete: 'simple_live_complete',
    error: 'simple_live_failed'
  }[status] || 'simple_live_ready');
}

function renderLiveEstimate() {
  const state = liveEstimate;
  const steps = numberOr(state.steps, 4);
  const maximumSteps = numberOr(state.maximumSteps, 8);
  const optionCount = Math.max(1, numberOr(state.optionCount, 2));
  const completedOptions = Math.max(0, Math.min(optionCount, numberOr(state.completedOptions, 0)));
  const estimatedUnits = steps * optionCount;
  const maximumUnits = maximumSteps * optionCount;
  const savedUnits = Math.max(0, maximumUnits - estimatedUnits);
  const savingsPercent = maximumUnits ? Math.round(savedUnits * 100 / maximumUnits) : 0;
  const elapsedMs = state.isGenerating ? Date.now() - state.startedAt : state.elapsedMs;

  $('liveEstimateStatus').textContent = liveStatusText(state.status);
  $('liveEstimateStatus').className = `estimate-status ${state.status}`;
  $('liveRequestedWork').textContent = `${steps} ${t('steps_word')} × ${optionCount} = ${estimatedUnits} ${t('units')}`;
  $('liveMaximumWork').textContent = `${maximumSteps} ${t('steps_word')} × ${optionCount} = ${maximumUnits} ${t('units')}`;
  $('liveSavedWork').textContent = `${maximumUnits} − ${estimatedUnits} = ${savedUnits} ${t('units')} (${savingsPercent}%)`;
  $('liveGenerationProgress').textContent = `${completedOptions} / ${optionCount} ${t('simple_live_choices_complete')}`;
  $('liveElapsed').textContent = `${t('simple_live_elapsed')}: ${formatElapsed(elapsedMs)}`;
}

function setLiveEstimateFromServer(estimate = {}, updates = {}) {
  liveEstimate = {
    ...liveEstimate,
    steps: numberOr(estimate.steps, liveEstimate.steps),
    maximumSteps: numberOr(estimate.maximum_steps, liveEstimate.maximumSteps),
    optionCount: numberOr(estimate.option_count, liveEstimate.optionCount),
    completedOptions: numberOr(estimate.completed_option_count, liveEstimate.completedOptions),
    ...updates
  };
  renderLiveEstimate();
}

function prepareLiveEstimate() {
  const { tier } = currentSettings();
  liveEstimate = {
    steps: tier.steps,
    maximumSteps: 8,
    optionCount: 2,
    completedOptions: 0,
    status: 'ready',
    isGenerating: false,
    startedAt: 0,
    elapsedMs: 0
  };
  renderLiveEstimate();
}

function beginLiveEstimate() {
  prepareLiveEstimate();
  $('workspace').classList.add('has-plan');
  $('plan').hidden = false;
  $('cost-savings').hidden = false;
  liveEstimate.status = 'generating';
  liveEstimate.isGenerating = true;
  liveEstimate.startedAt = Date.now();
  if (estimateTimerId) clearInterval(estimateTimerId);
  estimateTimerId = setInterval(renderLiveEstimate, 100);
  renderLiveEstimate();
  $('cost-savings').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function finishLiveEstimate(status, latencyMs = null) {
  if (estimateTimerId) clearInterval(estimateTimerId);
  estimateTimerId = null;
  const elapsedMs = latencyMs === null
    ? (liveEstimate.isGenerating ? Date.now() - liveEstimate.startedAt : liveEstimate.elapsedMs)
    : numberOr(latencyMs, liveEstimate.elapsedMs);
  liveEstimate = { ...liveEstimate, status, isGenerating: false, elapsedMs };
  renderLiveEstimate();
}

function renderPlan() {
  const { tier, profile } = currentSettings();
  const fewerPercent = Math.round((1 - tier.steps / 8) * 100);
  $('profileSymbol').textContent = profile.symbol;
  $('profileName').textContent = `${t(profile.label)} · ${t(tier.shortLabel)}`;
  $('profileStyle').textContent = t(profile.style);
  $('estimateTier').textContent = t(tier.label);
  $('estimateSteps').textContent = `${tier.steps} / 8`;
  $('estimateUnits').innerHTML = `${tier.steps * 2} <small>${t('units')}</small>`;
  $('savings').textContent = `${fewerPercent}%`;
  $('savingsBar').style.width = `${fewerPercent}%`;
  $('compareSteps').textContent = `${tier.steps} ${t('steps_word')}`;
  $('compareMaxSteps').textContent = `8 ${t('steps_word')}`;
  $('choicesNote').textContent = t('simple_choices_note');
}

function showAlert(messageKey, hintKey = null) {
  lastAlert = { message: messageKey, hint: hintKey };
  $('alert').textContent = [t(messageKey), hintKey ? t(hintKey) : ''].filter(Boolean).join(' ');
  $('alert').classList.add('show');
}

function showAlertText(message) {
  lastAlert = { text: message };
  $('alert').textContent = message;
  $('alert').classList.add('show');
}

function clearAlert() {
  lastAlert = null;
  $('alert').textContent = '';
  $('alert').classList.remove('show');
}

function legacyRenderResult(data) {
  const purpose = purposes[data.purpose] || purposes.colouring;
  const tierKey = tiers[data.quality_tier] ? data.quality_tier : 'economy';
  const tier = tiers[tierKey];
  const estimate = data.resource_estimate || {};
  const steps = Number(estimate.steps || tier.steps);
  const maxSteps = Number(estimate.maximum_steps || 8);
  const units = Number(estimate.relative_step_units || steps);
  const savings = Number(estimate.percent_fewer_steps_vs_max ?? Math.round((1 - steps / maxSteps) * 100));

  currentImage = data.image;
  $('resultImage').src = currentImage;
  $('resultTitle').textContent = `${t(purpose.label)} · ${t(tier.shortLabel)}`;
  $('resultDescription').textContent = t(purpose.style);
  $('resultMode').textContent = data.mode === 'demo' ? t('demo_preview') : t('live_generation');
  $('previewBadge').textContent = data.mode === 'demo' ? t('demo_preview') : t('live_generation');
  $('summaryTier').textContent = t(tier.label);
  $('summarySteps').textContent = `${steps} / ${maxSteps}`;
  const savedUnits = Number(estimate.saved_compute_units_vs_max ?? maxSteps - steps);
  $('summaryUnits').textContent = `${units} ${t('units')}`;
  $('summarySavings').textContent = `${savings}% · ${savedUnits} ${t('units')}`;
  $('resultPanel').classList.add('show');
}

function selectResultOption(option) {
  currentImage = option.image || '';
  document.querySelectorAll('.image-option').forEach(card => {
    const selected = Number(card.dataset.optionNumber) === Number(option.number);
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });
}

function renderResult(data) {
  const purpose = purposes[data.purpose] || purposes.colouring;
  const tierKey = tiers[data.quality_tier] ? data.quality_tier : 'economy';
  const tier = tiers[tierKey];
  const estimate = data.resource_estimate || {};
  const optionList = Array.isArray(data.options) && data.options.length
    ? data.options
    : [{ number: 1, image: data.image, image_url: data.image_url }];
  const steps = Number(estimate.steps || tier.steps);
  const maxSteps = Number(estimate.maximum_steps || 8);
  const totalUnits = Number(estimate.total_compute_units ?? steps * optionList.length);
  const savedUnits = Number(
    estimate.total_saved_compute_units_vs_max ?? (maxSteps - steps) * optionList.length
  );
  const savings = Number(estimate.percent_fewer_steps_vs_max ?? Math.round((1 - steps / maxSteps) * 100));

  const optionsContainer = $('resultOptions');
  optionsContainer.replaceChildren();
  optionList.forEach(option => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'image-option';
    card.dataset.optionNumber = String(option.number);
    card.setAttribute('aria-pressed', 'false');
    const label = document.createElement('span');
    label.className = 'option-label';
    label.textContent = `${t('simple_option')} ${option.number}`;
    const image = document.createElement('img');
    image.src = option.image || option.image_url;
    image.alt = `${t('simple_option')} ${option.number}`;
    const choose = document.createElement('span');
    choose.className = 'option-choose';
    choose.textContent = t('simple_choose_option');
    card.append(label, image, choose);
    card.addEventListener('click', () => selectResultOption(option));
    optionsContainer.appendChild(card);
  });
  selectResultOption(optionList[0]);

  $('resultTitle').textContent = `${t(purpose.label)} · ${t(tier.shortLabel)}`;
  $('resultDescription').textContent = t(purpose.style);
  $('resultMode').textContent = data.mode === 'demo' ? t('demo_preview') : t('live_generation');
  $('summaryTier').textContent = t(tier.label);
  $('summaryChoices').textContent = String(optionList.length);
  $('summaryUnits').textContent = `${totalUnits} ${t('units')}`;
  $('summarySavings').textContent = `${savings}% · ${savedUnits} ${t('units')}`;

  const translation = data.prompt_translation || {};
  const translationNote = $('translationNote');
  translationNote.textContent = translation.translated
    ? `${t('simple_translated_prompt')}: ${translation.english_prompt}`
    : (translation.note || '');
  translationNote.hidden = !translationNote.textContent;

  const memoryNote = $('memoryNote');
  memoryNote.textContent = data.memory_match
    ? (data.memory_match.match_type === 'same' ? t('simple_memory_same') : t('simple_memory_related'))
    : '';
  memoryNote.hidden = !memoryNote.textContent;
  $('resultPanel').classList.add('show');
}

document.querySelectorAll('.purpose-card').forEach(button => {
  button.addEventListener('click', () => {
    selectedPurpose = button.dataset.purpose;
    purposeOverridden = true;
    updatePurposeCards();
    renderRecommendationPanel();
    if (!liveEstimate.isGenerating) prepareLiveEstimate();
    renderPlan();
  });
});

$('prompt').addEventListener('input', () => scheduleRecommendation());
$('useRecommendation').addEventListener('click', applyRecommendation);
$('qualityTier').addEventListener('change', () => {
  tierOverridden = true;
  renderRecommendationPanel();
  if (!liveEstimate.isGenerating) prepareLiveEstimate();
  renderPlan();
});
$('languageSelect').addEventListener('change', event => {
  selectedLanguage = translations[event.target.value] ? event.target.value : 'en';
  try { localStorage.setItem('picturewise-language', selectedLanguage); } catch (_) {}
  applyLanguage();
  scheduleRecommendation(0);
});

async function consumeGenerationStream(response) {
  if (!response.body) throw new Error('This browser cannot read generation progress.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  let completedResult = null;
  let streamedError = null;

  function processEvent(event) {
    if (event.event === 'plan') {
      setLiveEstimateFromServer(event.resource_estimate, {
        status: 'generating',
        isGenerating: true,
        completedOptions: 0
      });
    } else if (event.event === 'option_started') {
      setLiveEstimateFromServer(event.resource_estimate, {
        status: 'generating',
        isGenerating: true
      });
    } else if (event.event === 'option_completed') {
      setLiveEstimateFromServer(event.resource_estimate, {
        status: 'generating',
        isGenerating: true
      });
    } else if (event.event === 'error') {
      streamedError = event;
    } else if (event.event === 'complete') {
      completedResult = event.result;
    }
  }

  while (true) {
    const { value, done } = await reader.read();
    pending += decoder.decode(value || new Uint8Array(), { stream: !done });
    const lines = pending.split('\n');
    pending = lines.pop();
    lines.filter(Boolean).forEach(line => processEvent(JSON.parse(line)));
    if (done) break;
  }
  if (pending.trim()) processEvent(JSON.parse(pending));
  if (streamedError) {
    const error = new Error(streamedError.error_key || 'generation_stream_failed');
    error.errorKey = streamedError.error_key;
    error.hintKey = streamedError.hint_key;
    throw error;
  }
  if (!completedResult) throw new Error('The generation finished without a result.');
  return completedResult;
}

async function generate() {
  const prompt = $('prompt').value.trim();
  clearAlert();
  if (prompt.length < 3) {
    showAlert('alert_short_prompt', 'alert_short_prompt_hint');
    $('prompt').focus();
    return;
  }
  if (!selectedPurpose) {
    showAlert('recommend_choose_purpose', 'recommend_choose_purpose_hint');
    document.querySelector('.purpose-card').focus();
    return;
  }

  const button = $('generateBtn');
  button.disabled = true;
  button.querySelector('[data-i18n]').textContent = t('generating_button');
  const { tierKey } = currentSettings();
  beginLiveEstimate();

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        purpose: selectedPurpose,
        quality_tier: tierKey,
        quality_tier_override: tierOverridden,
        audience: $('audience').value,
        language: selectedLanguage,
        user_id: userId,
        stream: true
      })
    });
    if (!response.ok) {
      const data = await response.json();
      if (data.quota_message || data.message) showAlertText(data.quota_message || data.message);
      else showAlert(data.error_key || 'error_request', data.hint_key || 'hint_request');
      finishLiveEstimate('error');
      return;
    }
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/x-ndjson')
      ? await consumeGenerationStream(response)
      : await response.json();

    lastResult = data;
    renderResult(data);
    setLiveEstimateFromServer(data.resource_estimate, {
      completedOptions: data.option_count,
      status: 'complete',
      isGenerating: false
    });
    finishLiveEstimate('complete', data.latency_ms);
    if (historyLoaded) loadHistory({ refresh: true });
    const modeMessage = data.mode === 'demo'
      ? t(data.message_key === 'missing_hf_credentials' ? 'alert_demo_hf' : 'alert_demo_cf')
      : t('alert_success');
    const choiceMessage = data.option_count === 1 ? t('simple_one_choice') : t('simple_two_choices');
    showAlertText([modeMessage, choiceMessage, data.quota_message].filter(Boolean).join(' '));
    $('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    finishLiveEstimate('error');
    if (error?.errorKey) showAlert(error.errorKey, error.hintKey || 'hint_request');
    else showAlert('alert_local_server');
  } finally {
    button.disabled = false;
    button.querySelector('[data-i18n]').textContent = t('generate_button');
  }
}

$('generateBtn').addEventListener('click', generate);
$('downloadBtn').addEventListener('click', () => {
  if (!currentImage) return;
  const extension = currentImage.startsWith('data:image/svg') ? 'svg' : currentImage.startsWith('data:image/jpeg') ? 'jpg' : 'png';
  const anchor = document.createElement('a');
  anchor.href = currentImage;
  anchor.download = `picturewise-${selectedPurpose}-${Date.now()}.${extension}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
});

applyLanguage();
scheduleRecommendation(0);
if (window.location.hash === '#history') {
  loadHistory();
  $('history').scrollIntoView({ behavior: 'auto', block: 'start' });
}
fetch('/api/health')
  .then(response => response.json())
  .then(data => {
    liveMode = Boolean(data.ai_configured);
    $('modeLabel').textContent = t(liveMode ? 'mode_live' : 'mode_demo');
  })
  .catch(() => {
    liveMode = false;
    $('modeLabel').textContent = t('mode_demo');
  });
