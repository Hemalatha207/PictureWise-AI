import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Svg, { Line, Rect, Text as SvgText, SvgUri } from 'react-native-svg';

const COLORS = {
  ink: '#2E2445', muted: '#756B89', purple: '#7657C8', lilac: '#EEE8FF',
  pale: '#F8F6FC', white: '#FFFFFF', green: '#328D6B', amber: '#C17C25',
  border: '#E8E1F1', red: '#B84663', deep: '#413266',
};

const createAnonymousUserId = () => (
  `pw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
);
const PURPOSES = [
  { id: 'colouring', icon: '✎', en: 'Colouring sheet', ta: 'வண்ணம் தீட்டும் படம்', hi: 'रंग भरने की शीट' },
  { id: 'worksheet', icon: '▤', en: 'Worksheet', ta: 'பயிற்சித்தாள்', hi: 'वर्कशीट' },
  { id: 'flashcard', icon: '▣', en: 'Flashcard', ta: 'கற்றல் அட்டை', hi: 'फ्लैशकार्ड' },
  { id: 'poster', icon: '▧', en: 'Poster', ta: 'சுவரொட்டி', hi: 'पोस्टर' },
];
const OPTION_COPY = {
  en: {
    choices: 'Picture choices', option: 'Option', choose: 'Choose this picture',
    selected: 'Selected', oneChoice: 'One matching picture was made.',
    twoChoices: 'Choose the picture you like best.',
    translated: 'English prompt sent to the image AI',
    sameMatch: 'A matching saved request was found, so one picture was made with its saved detail level.',
    relatedMatch: 'A similar saved request was found, so one picture was made with its saved detail level.',
  },
  ta: {
    choices: 'படத் தேர்வுகள்', option: 'தேர்வு', choose: 'இந்தப் படத்தைத் தேர்ந்தெடுக்கவும்',
    selected: 'தேர்ந்தெடுக்கப்பட்டது', oneChoice: 'பொருந்தும் ஒரு படம் உருவாக்கப்பட்டது.',
    twoChoices: 'உங்களுக்கு பிடித்த படத்தைத் தேர்ந்தெடுக்கவும்.',
    translated: 'பட AI-க்கு அனுப்பிய ஆங்கில விளக்கம்',
    sameMatch: 'இதே சேமித்த கோரிக்கை கிடைத்ததால், சேமித்த தரத்தில் ஒரு படம் உருவாக்கப்பட்டது.',
    relatedMatch: 'ஒத்த சேமித்த கோரிக்கை கிடைத்ததால், சேமித்த தரத்தில் ஒரு படம் உருவாக்கப்பட்டது.',
  },
  hi: {
    choices: 'चित्र विकल्प', option: 'विकल्प', choose: 'इस चित्र को चुनें',
    selected: 'चुना गया', oneChoice: 'मिलता हुआ एक चित्र बनाया गया।',
    twoChoices: 'अपनी पसंद का चित्र चुनें।',
    translated: 'इमेज AI को भेजा गया अंग्रेज़ी विवरण',
    sameMatch: 'वही सहेजा अनुरोध मिला, इसलिए उसकी सहेजी गुणवत्ता पर एक चित्र बनाया गया।',
    relatedMatch: 'मिलता-जुलता सहेजा अनुरोध मिला, इसलिए उसकी सहेजी गुणवत्ता पर एक चित्र बनाया गया।',
  },
};

const I18N = {
  en: {
    brandSub: 'EDUCATION IMAGE STUDIO', purposeTag: '01 · PURPOSE', resultTag: '02 · RESULT', activityTag: 'YOUR ACTIVITY', savedLocally: 'SAVED LOCALLY', projectControls: 'PROJECT CONTROLS', suggestionChanged: 'You changed the suggestion', footer: 'PictureWise AI · Purpose-aware generation',
    create: 'Create', insights: 'Insights', history: 'History', settings: 'Settings',
    live: 'AI provider connected', demo: 'Demo mode', offline: 'Server unavailable',
    eyebrow: 'PURPOSE-AWARE IMAGE STUDIO', hero: 'Make every image fit its purpose.',
    intro: 'Choose the use, match the effort, and see the resource estimate.',
    purpose: 'What are you making?', prompt: 'Describe your image', promptHint: 'Example: A friendly butterfly on a flower, clean outlines…',
    tier: 'Generation effort', economy: 'Economy (SD-style)', detail: 'Higher detail (HD-style)', recommend: 'Suggested',
    economyDesc: 'Actual compute: 4 inference steps', detailDesc: 'Actual compute: 8 inference steps', economyQuality: '480p SD', detailQuality: '1080p HD',
    recommendation: 'Smart suggestion', steps: 'inference steps', estimate: 'Resource estimate', computeCost: 'Estimated compute cost', savingVsMax: 'Saving vs maximum', calculation: 'Compute units equal requested inference steps. Savings equal 8 maximum steps minus requested steps.',
    estimateNote: 'Step comparison only; not measured energy or provider billing.',
    age: 'Audience', ageYoung: '5–7 years', ageMiddle: '8–10 years', ageOlder: '11–14 years', ageAll: 'General audience',
    labels: 'Tamil plant labels', labelsHint: 'Add exact Tamil part names over a plant diagram.',
    generate: 'Generate image', generating: 'Creating your image…', result: 'Your image',
    save: 'Save / share image', generated: 'Generated', used: 'Images used today', remaining: 'Images remaining',
    budget: 'Daily picture allowance', budgetHint: 'Each user can create 2 picture requests per day. New requests may show two choices. A Higher-detail request that exceeds the 32-step allowance becomes Economy quality.',
    avgTime: 'Average generation time', allTime: 'Live generations', fewer: 'Fewer steps vs. 8 each',
    week: 'Last 7 days', byPurpose: 'By purpose', emptyHistory: 'Your generated images will appear here.',
    clearHistory: 'Clear history', clearConfirm: 'This deletes saved history and image files from this computer.',
    cancel: 'Cancel', confirm: 'Delete', useSuggestion: 'Use suggestion',
    apiAddress: 'Flask API address', connect: 'Save and connect', connectionOK: 'Connected to PictureWise API',
    connectionFail: 'Could not reach the API. Check the address and start the Flask server.',
    language: 'Language', saved: 'Saved', noPrompt: 'Add a short image description first.',
    budgetBlocked: 'You have reached your 2-image daily limit. Try again tomorrow.',
    generationFailed: 'Image generation failed. Check the server and provider settings.',
    plantLabels: ['மலர்', 'இலைகள்', 'தண்டு', 'வேர்', 'கனி'],
    labelPosition: 'Labels are a visual overlay. Use them only for a plant diagram.',
    templates: 'Quick prompts', plant: 'Plant parts', butterfly: 'Butterfly', solar: 'Solar system',
    privacy: 'Prompts and generated images are saved locally in this project for history.',
  },
  ta: {
    brandSub: 'கல்விப் பட ஸ்டுடியோ', purposeTag: '01 · பயன்பாடு', resultTag: '02 · முடிவு', activityTag: 'உங்கள் பயன்பாடு', savedLocally: 'உள்ளூரில் சேமிக்கப்பட்டவை', projectControls: 'திட்டக் கட்டுப்பாடுகள்', suggestionChanged: 'நீங்கள் பரிந்துரையை மாற்றியுள்ளீர்கள்', footer: 'PictureWise AI · பயன்பாட்டுக்கேற்ற பட உருவாக்கம்',
    create: 'உருவாக்கு', insights: 'பயன்பாடு', history: 'வரலாறு', settings: 'அமைப்புகள்',
    live: 'AI சேவை இணைந்துள்ளது', demo: 'மாதிரி நிலை', offline: 'சேவையகத்தை அணுக முடியவில்லை',
    eyebrow: 'பயன்பாட்டுக்கேற்ற பட ஸ்டுடியோ', hero: 'ஒவ்வொரு படத்தையும் அதன் பயன்பாட்டுக்கேற்ப உருவாக்குங்கள்.',
    intro: 'பயன்பாட்டைத் தேர்வு செய்து, முயற்சியைப் பொருத்தி, resource estimate-ஐப் பாருங்கள்.',
    purpose: 'என்ன உருவாக்குகிறீர்கள்?', prompt: 'படத்தை விவரிக்கவும்', promptHint: 'உதாரணம்: மலர் மீது அமர்ந்த வண்ணத்துப்பூச்சி…',
    tier: 'உருவாக்க முயற்சி', economy: 'சிக்கனம்', detail: 'கூடுதல் விவரம்', recommend: 'பரிந்துரை',
    economyDesc: '4 steps · குறைந்த முயற்சி', detailDesc: '8 steps · கூடுதல் மெருகூட்டல்',
    recommendation: 'சிறந்த பரிந்துரை', steps: 'inference steps', estimate: 'வள மதிப்பீடு',
    estimateNote: 'Steps ஒப்பீடு மட்டுமே; உண்மையான energy அல்லது bill அளவீடு அல்ல.',
    age: 'பார்வையாளர்கள்', ageYoung: '5–7 வயது', ageMiddle: '8–10 வயது', ageOlder: '11–14 வயது', ageAll: 'அனைவருக்கும்',
    labels: 'தமிழ் தாவரப் பெயர்கள்', labelsHint: 'தாவரப் படத்தின் மேல் சரியான தமிழ்ப் பெயர்களைக் காட்டும்.',
    generate: 'படத்தை உருவாக்கு', generating: 'படம் உருவாகிறது…', result: 'உங்கள் படம்',
    save: 'படத்தைச் சேமி / பகிர்', generated: 'உருவாக்கியவை', used: 'இன்று பயன்படுத்தியது', remaining: 'மீதமுள்ள steps',
    budget: 'தினசரி step வரம்பு', budgetHint: 'இது app-க்கான step வரம்பு; பண வரம்பு அல்ல.',
    avgTime: 'சராசரி உருவாக்க நேரம்', allTime: 'நேரடி படங்கள்', fewer: '8 steps ஒப்பீட்டில் குறைவு',
    week: 'கடந்த 7 நாட்கள்', byPurpose: 'பயன்பாட்டின்படி', emptyHistory: 'உங்கள் படங்கள் இங்கே தோன்றும்.',
    clearHistory: 'வரலாற்றை அழி', clearConfirm: 'இந்தக் கணினியில் சேமித்த வரலாறும் படங்களும் நீக்கப்படும்.',
    cancel: 'ரத்து செய்', confirm: 'நீக்கு', useSuggestion: 'பரிந்துரையைப் பயன்படுத்து',
    apiAddress: 'Flask API முகவரி', connect: 'சேமித்து இணை', connectionOK: 'PictureWise API இணைந்தது',
    connectionFail: 'API-ஐ அணுக முடியவில்லை. முகவரியையும் Flask சேவையகத்தையும் சரிபார்க்கவும்.',
    language: 'மொழி', saveBudget: 'வரம்பைச் சேமி', saved: 'சேமிக்கப்பட்டது', noPrompt: 'முதலில் படத்தைச் சுருக்கமாக விவரிக்கவும்.',
    budgetBlocked: 'தினசரி step வரம்பு முடிந்தது. Settings-ல் மாற்றவும் அல்லது நாளை முயற்சிக்கவும்.',
    generationFailed: 'படம் உருவாக்க முடியவில்லை. சேவையக அமைப்பைச் சரிபார்க்கவும்.',
    plantLabels: ['மலர்', 'இலைகள்', 'தண்டு', 'வேர்', 'கனி'],
    labelPosition: 'இவை படத்தின் மேல் காட்டும் பெயர்கள். தாவரப் படத்திற்கு மட்டும் பயன்படுத்தவும்.',
    templates: 'விரைவு prompt-கள்', plant: 'தாவரப் பகுதிகள்', butterfly: 'வண்ணத்துப்பூச்சி', solar: 'சூரியக் குடும்பம்',
    privacy: 'வரலாற்றுக்காக prompts மற்றும் படங்கள் இந்த project-ல் உள்ளூரில் சேமிக்கப்படும்.',
  },
  hi: {
    brandSub: 'शैक्षिक चित्र स्टूडियो', purposeTag: '01 · उद्देश्य', resultTag: '02 · परिणाम', activityTag: 'आपकी गतिविधि', savedLocally: 'स्थानीय रूप से सेव', projectControls: 'प्रोजेक्ट नियंत्रण', suggestionChanged: 'आपने सुझाव बदला है', footer: 'PictureWise AI · उद्देश्य के अनुसार चित्र',
    create: 'बनाएँ', insights: 'उपयोग', history: 'इतिहास', settings: 'सेटिंग्स',
    live: 'AI सेवा जुड़ी है', demo: 'डेमो मोड', offline: 'सर्वर उपलब्ध नहीं',
    eyebrow: 'उद्देश्य के अनुसार इमेज स्टूडियो', hero: 'हर चित्र को उसके उद्देश्य के अनुसार बनाएँ।',
    intro: 'उपयोग चुनें, प्रयास तय करें और संसाधन अनुमान देखें।',
    purpose: 'आप क्या बना रहे हैं?', prompt: 'चित्र का वर्णन करें', promptHint: 'उदाहरण: फूल पर बैठी एक प्यारी तितली…',
    tier: 'जनरेशन प्रयास', economy: 'इकोनॉमी', detail: 'अधिक विवरण', recommend: 'सुझाव',
    economyDesc: '4 स्टेप · कम प्रयास', detailDesc: '8 स्टेप · अधिक सुधार',
    recommendation: 'स्मार्ट सुझाव', steps: 'inference steps', estimate: 'संसाधन अनुमान',
    estimateNote: 'केवल स्टेप तुलना; वास्तविक ऊर्जा या बिल माप नहीं।',
    age: 'उम्र समूह', ageYoung: '5–7 वर्ष', ageMiddle: '8–10 वर्ष', ageOlder: '11–14 वर्ष', ageAll: 'सामान्य दर्शक',
    labels: 'तमिल पौधे के लेबल', labelsHint: 'पौधे के चित्र पर सही तमिल नाम दिखाएँ।',
    generate: 'चित्र बनाएँ', generating: 'चित्र बन रहा है…', result: 'आपका चित्र',
    save: 'चित्र सेव / शेयर करें', generated: 'बनाए गए', used: 'आज उपयोग किए', remaining: 'बाकी स्टेप',
    budget: 'दैनिक स्टेप सीमा', budgetHint: 'यह ऐप की स्टेप सीमा है, पैसे की सीमा नहीं।',
    avgTime: 'औसत जनरेशन समय', allTime: 'लाइव चित्र', fewer: '8 स्टेप तुलना में कम',
    week: 'पिछले 7 दिन', byPurpose: 'उद्देश्य के अनुसार', emptyHistory: 'आपके चित्र यहाँ दिखेंगे।',
    clearHistory: 'इतिहास मिटाएँ', clearConfirm: 'इस कंप्यूटर पर सहेजा इतिहास और चित्र मिट जाएगा।',
    cancel: 'रद्द करें', confirm: 'मिटाएँ', useSuggestion: 'सुझाव अपनाएँ',
    apiAddress: 'Flask API पता', connect: 'सेव करें और जोड़ें', connectionOK: 'PictureWise API जुड़ा है',
    connectionFail: 'API नहीं मिला। पता और Flask सर्वर जाँचें।',
    language: 'भाषा', saveBudget: 'सीमा सेव करें', saved: 'सेव हुआ', noPrompt: 'पहले चित्र का छोटा वर्णन लिखें।',
    budgetBlocked: 'दैनिक स्टेप सीमा पूरी हुई। Settings में बढ़ाएँ या कल फिर कोशिश करें।',
    generationFailed: 'चित्र नहीं बना। सर्वर और provider सेटिंग जाँचें।',
    plantLabels: ['फूल', 'पत्तियाँ', 'तना', 'जड़', 'फल'],
    labelPosition: 'लेबल चित्र के ऊपर दिखेंगे। केवल पौधे के चित्र पर उपयोग करें।',
    templates: 'झटपट prompts', plant: 'पौधे के भाग', butterfly: 'तितली', solar: 'सौर मंडल',
    privacy: 'इतिहास के लिए prompts और चित्र इस project में स्थानीय रूप से सहेजे जाते हैं।',
  },
};

function Pill({ children, active, onPress, compact }) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive, compact && styles.pillCompact]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </Pressable>
  );
}

function ScalePressable({ children, onPress, style, disabled, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = useState(false);
  const animateScale = (toValue) => Animated.spring(scale, { toValue, useNativeDriver: true, speed: 28, bounciness: 5 }).start();
  return (
    <Animated.View style={[style, disabled && styles.buttonDisabled, { transform: [{ scale }] }]}>
      <Pressable
        {...props}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => !disabled && animateScale(0.97)}
        onPressOut={() => animateScale(1)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={[styles.pressableFill, Platform.OS === 'web' && hovered && styles.webHover]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function Shimmer({ opacity, style }) {
  return <Animated.View style={[styles.shimmer, style, { opacity }]} />;
}

function SectionTitle({ kicker, title, right }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={{ flex: 1 }}>
        {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

function OrbArt({ spin }) {
  const reverse = spin.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  return (
    <View style={styles.orbWrap} pointerEvents="none">
      <Animated.View style={[styles.orbitRing, { transform: [{ perspective: 700 }, { rotateX: '63deg' }, { rotateZ: spin }] }]} />
      <Animated.View style={[styles.orbitRing, styles.orbitRingThin, { transform: [{ perspective: 700 }, { rotateY: '62deg' }, { rotateZ: reverse }] }]} />
      <View style={styles.orbCore}><Text style={styles.orbSpark}>✦</Text></View>
      <View style={styles.orbDot} />
    </View>
  );
}

function LabeledPreview({ item, labelsOn, apiBase, labels }) {
  if (!item) return null;
  const isSvg = item.image_type === 'svg' || item.image?.startsWith('data:image/svg+xml');
  const uri = item.image || (item.image_url ? `${apiBase}${item.image_url}` : null);
  if (!uri) return null;
  const labelLayout = [
    { x: 276, y: 36, tx: 45, ty: 98 },
    { x: 276, y: 128, tx: 214, ty: 156 },
    { x: 276, y: 220, tx: 202, ty: 236 },
    { x: 18, y: 342, tx: 166, ty: 300 },
    { x: 18, y: 204, tx: 165, ty: 174 },
  ];
  return (
    <View style={styles.imageFrame}>
      {isSvg ? <SvgUri uri={item.image_url ? `${apiBase}${item.image_url}` : uri} width="100%" height="100%" /> : <Image source={{ uri }} style={styles.generatedImage} resizeMode="contain" />}
      {labelsOn ? (
        <Svg width="100%" height="100%" viewBox="0 0 340 380" style={styles.labelSvg}>
          {labelLayout.map((p, index) => (
            <React.Fragment key={index}>
              <Line x1={p.x + 35} y1={p.y - 4} x2={p.tx} y2={p.ty} stroke="#7657C8" strokeWidth="2" />
              <Rect x={p.x} y={p.y - 20} width="72" height="28" rx="10" fill="#FFFFFF" fillOpacity="0.94" stroke="#7657C8" strokeWidth="1.5" />
              <SvgText x={p.x + 36} y={p.y - 1} textAnchor="middle" fontSize="14" fontWeight="700" fill="#413266">{labels[index]}</SvgText>
            </React.Fragment>
          ))}
        </Svg>
      ) : null}
    </View>
  );
}

function xmlEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function makeLabeledSvg(imageData, labels) {
  const placements = [
    { x: 276, y: 36, tx: 45, ty: 98 }, { x: 276, y: 128, tx: 214, ty: 156 },
    { x: 276, y: 220, tx: 202, ty: 236 }, { x: 18, y: 342, tx: 166, ty: 300 },
    { x: 18, y: 204, tx: 165, ty: 174 },
  ];
  const labelMarkup = placements.map((p, index) =>
    `<line x1="${p.x + 35}" y1="${p.y - 4}" x2="${p.tx}" y2="${p.ty}" stroke="#7657C8" stroke-width="2"/><rect x="${p.x}" y="${p.y - 20}" width="72" height="28" rx="10" fill="#fff" fill-opacity=".94" stroke="#7657C8" stroke-width="1.5"/><text x="${p.x + 36}" y="${p.y - 1}" text-anchor="middle" font-size="14" font-family="Noto Sans Tamil, sans-serif" font-weight="700" fill="#413266">${xmlEscape(labels[index])}</text>`
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1020" height="1140" viewBox="0 0 340 380"><rect width="340" height="380" fill="#fff"/><image x="0" y="20" width="340" height="340" preserveAspectRatio="xMidYMid meet" href="${xmlEscape(imageData)}" xlink:href="${xmlEscape(imageData)}"/>${labelMarkup}</svg>`;
}

export default function App({ screen = 'create', onNavigate = () => {} }) {
  const [language, setLanguage] = useState('en');
  const [apiBase, setApiBase] = useState(Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://127.0.0.1:5001');
  const [apiDraft, setApiDraft] = useState(apiBase);
  const [connected, setConnected] = useState(false);
  const [providerMode, setProviderMode] = useState('');
  const [purpose, setPurpose] = useState('colouring');
  const [tier, setTier] = useState('economy');
  const [manualTier, setManualTier] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [audience, setAudience] = useState('5-7 years');
  const [labelsOn, setLabelsOn] = useState(false);
  const [latest, setLatest] = useState(null);
  const [selectedOptionNumber, setSelectedOptionNumber] = useState(1);
  const [history, setHistory] = useState([]);
  const [insights, setInsights] = useState(null);
  const [userId, setUserId] = useState(createAnonymousUserId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = (key) => I18N[language]?.[key] ?? I18N.en[key] ?? key;
  const orbit = useRef(new Animated.Value(0)).current;
  const usesSidebar = Platform.OS === 'web';
  const sidebarWidth = useRef(new Animated.Value(58)).current;
  const screenTransition = useRef(new Animated.Value(1)).current;
  const estimateProgress = useRef(new Animated.Value(0)).current;
  const resultReveal = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0.35)).current;

  const [recommendation, setRecommendation] = useState('economy');
  const selectedSteps = tier === 'detail' ? 8 : 4;
  const fewerPercent = Math.round((1 - selectedSteps / 8) * 100);
  const base = useCallback((path) => `${apiBase.replace(/\/$/, '')}${path}`, [apiBase]);
  const optionCopy = OPTION_COPY[language] || OPTION_COPY.en;
  const availableOptions = latest
    ? (Array.isArray(latest.options) && latest.options.length ? latest.options : [latest])
    : [];
  const selectedImage = availableOptions.find(option => Number(option.number) === selectedOptionNumber)
    || availableOptions[0]
    || null;

  useEffect(() => {
    const animation = Animated.loop(Animated.timing(orbit, {
      toValue: 1, duration: 19000, easing: Easing.linear, useNativeDriver: false,
    }));
    animation.start();
    return () => animation.stop();
  }, [orbit]);

  useEffect(() => {
    Animated.timing(sidebarWidth, { toValue: sidebarOpen ? 190 : 58, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [sidebarOpen, sidebarWidth]);

  useEffect(() => {
    screenTransition.setValue(0);
    Animated.timing(screenTransition, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [screen, screenTransition]);

  useEffect(() => {
    estimateProgress.setValue(0);
    Animated.timing(estimateProgress, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [selectedSteps, estimateProgress]);

  useEffect(() => {
    if (!latest) return;
    resultReveal.setValue(0);
    Animated.spring(resultReveal, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 7 }).start();
  }, [latest, resultReveal]);

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(shimmer, { toValue: 0.85, duration: 700, useNativeDriver: true }),
      Animated.timing(shimmer, { toValue: 0.35, duration: 700, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const callApi = useCallback(async (path, options = {}) => {
    const response = await fetch(`${apiBase.replace(/\/$/, '')}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-PictureWise-User': userId,
        ...(options.headers || {}),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.error_key || data.error || 'request_failed');
      err.status = response.status;
      err.data = data;
      throw err;
    }
    return data;
  }, [apiBase, userId]);

  const refreshAll = useCallback(async () => {
    setLoadingScreen(true);
    const results = await Promise.allSettled([
      callApi('/api/health'), callApi('/api/insights'), callApi('/api/history?limit=40'),
    ]);
    if (results[0].status === 'fulfilled') {
      const health = results[0].value;
      setConnected(true);
      setProviderMode(health.ai_configured ? 'live' : 'demo');
    } else {
      setConnected(false);
      setProviderMode('offline');
    }
    if (results[1].status === 'fulfilled') setInsights(results[1].value);
    if (results[2].status === 'fulfilled') {
      const items = results[2].value.items || [];
      setHistory(items);
    }
    setLoadingScreen(false);
  }, [callApi]);

  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      try {
        const saved = await AsyncStorage.multiGet(['picturewise-language', 'picturewise-api-base', 'picturewise-selected-history', 'picturewise-user-id']);
        if (!active) return;
        const savedLanguage = saved.find(([key]) => key === 'picturewise-language')?.[1];
        const savedBase = saved.find(([key]) => key === 'picturewise-api-base')?.[1];
        const selectedHistory = saved.find(([key]) => key === 'picturewise-selected-history')?.[1];
        const savedUserId = saved.find(([key]) => key === 'picturewise-user-id')?.[1];
        if (savedLanguage && I18N[savedLanguage]) setLanguage(savedLanguage);
        if (savedBase) { setApiBase(savedBase); setApiDraft(savedBase); }
        if (savedUserId) setUserId(savedUserId);
        else await AsyncStorage.setItem('picturewise-user-id', userId);
        if (selectedHistory && screen === 'create') {
          try {
            const savedImage = JSON.parse(selectedHistory);
            setLatest(savedImage);
            setSelectedOptionNumber(Number(savedImage.number) || 1);
          } catch (_) {}
          await AsyncStorage.removeItem('picturewise-selected-history');
        } else if (screen === 'create') {
          const savedImages = await callApi('/api/history?limit=1').catch(() => ({ items: [] }));
          if (active) {
            const newest = savedImages.items?.[0];
            setLatest(newest ? { ...newest, image_type: newest.image_type || 'raster' } : null);
            setSelectedOptionNumber(1);
          }
        }
      } catch (_) { /* The app still works without persisted preferences. */ }
      if (active) refreshAll();
    })();
    return () => { active = false; };
  }, [callApi, refreshAll, screen, userId]));

  useEffect(() => {
    let active = true;
    callApi('/api/recommend', { method: 'POST', body: JSON.stringify({ purpose }) })
      .then(data => {
        if (!active) return;
        setRecommendation(data.quality_tier);
        if (!manualTier) setTier(data.quality_tier);
      })
      .catch(() => {
        const fallback = purpose === 'poster' ? 'detail' : 'economy';
        setRecommendation(fallback);
        if (!manualTier) setTier(fallback);
      });
    return () => { active = false; };
  }, [purpose, apiBase, manualTier]);

  const choosePurpose = (value) => {
    setPurpose(value);
    setManualTier(false);
    setTier(value === 'poster' ? 'detail' : 'economy');
  };

  const setAppLanguage = async (value) => {
    setLanguage(value);
    try { await AsyncStorage.setItem('picturewise-language', value); } catch (_) {}
  };

  const generate = async () => {
    setError(''); setNotice('');
    if (prompt.trim().length < 3) { setError(t('noPrompt')); return; }
    setBusy(true);
    try {
      const data = await callApi('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: prompt.trim(), purpose, quality_tier: tier, quality_tier_override: manualTier, audience, language, user_id: userId }),
      });
      const options = Array.isArray(data.options) && data.options.length
        ? data.options
        : [{ number: 1, image: data.image, image_url: data.image_url, image_type: data.image?.startsWith('data:image/svg+xml') ? 'svg' : 'raster' }];
      const firstOption = options[0];
      setLatest({
        ...data,
        prompt: prompt.trim(),
        image: firstOption.image,
        image_url: firstOption.image_url,
        image_type: firstOption.image_type || (firstOption.image?.startsWith('data:image/svg+xml') ? 'svg' : 'raster'),
        options,
      });
      setSelectedOptionNumber(Number(firstOption.number) || 1);
      const estimate = data.resource_estimate || {};
      const usedUnits = estimate.estimated_compute_units ?? estimate.steps ?? selectedSteps;
      const savedUnits = estimate.saved_compute_units_vs_max ?? 8 - usedUnits;
      const savedPercent = estimate.percent_fewer_steps_vs_max ?? Math.round(savedUnits * 100 / 8);
      setNotice(data.quota_message || `${t('generated')} · ${t('computeCost')}: ${usedUnits} · ${t('savingVsMax')}: ${savedPercent}% (${savedUnits} units)`);
      refreshAll();
    } catch (e) {
      setError(e.data?.quota_message || (e.message === 'daily_image_limit_reached' ? t('budgetBlocked') : t('generationFailed')));
    } finally { setBusy(false); }
  };

  const saveImage = async () => {
    if (!selectedImage) return;
    try {
      let imageData = selectedImage.image;
      if (labelsOn) {
        if (!imageData?.startsWith('data:')) {
          const imageUrl = `${apiBase}${selectedImage.image_url}`;
          if (Platform.OS === 'web') {
            const remote = await fetch(imageUrl);
            const blob = await remote.blob();
            imageData = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } else {
            const temp = `${FileSystem.cacheDirectory}picturewise-source-${Date.now()}.${selectedImage.image_type || 'png'}`;
            await FileSystem.downloadAsync(imageUrl, temp);
            const encoded = await FileSystem.readAsStringAsync(temp, { encoding: FileSystem.EncodingType.Base64 });
            const mime = selectedImage.image_type === 'svg' ? 'image/svg+xml' : selectedImage.image_type === 'jpg' ? 'image/jpeg' : 'image/png';
            imageData = `data:${mime};base64,${encoded}`;
          }
        }
        const svg = makeLabeledSvg(imageData, t('plantLabels'));
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
          const anchor = document.createElement('a');
          anchor.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
          anchor.download = `picturewise-plant-labels-${Date.now()}.svg`;
          document.body.appendChild(anchor); anchor.click(); anchor.remove();
          return;
        }
        const svgUri = `${FileSystem.cacheDirectory}picturewise-plant-labels-${Date.now()}.svg`;
        await FileSystem.writeAsStringAsync(svgUri, svg, { encoding: FileSystem.EncodingType.UTF8 });
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(svgUri, { mimeType: 'image/svg+xml', dialogTitle: t('save') });
        else setNotice(t('saved'));
        return;
      }
      const extension = selectedImage.image_type === 'svg' ? 'svg' : (imageData?.startsWith('data:image/jpeg') ? 'jpg' : 'png');
      const filename = `picturewise-${Date.now()}.${extension}`;
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const anchor = document.createElement('a');
        anchor.href = imageData || `${apiBase}${selectedImage.image_url}`;
        anchor.download = filename;
        document.body.appendChild(anchor); anchor.click(); anchor.remove();
        return;
      }
      const target = `${FileSystem.cacheDirectory}${filename}`;
      if (imageData?.startsWith('data:')) {
        const encoded = imageData.split(',', 2)[1];
        await FileSystem.writeAsStringAsync(target, encoded, { encoding: FileSystem.EncodingType.Base64 });
      } else {
        await FileSystem.downloadAsync(`${apiBase}${selectedImage.image_url}`, target);
      }
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(target, { dialogTitle: t('save') });
      else setNotice(t('saved'));
    } catch (_) { setError(t('generationFailed')); }
  };

  const applyHistoryItem = async (item) => {
    const selected = { ...item, image_type: item.image_type || (item.image_url?.endsWith('.svg') ? 'svg' : 'raster') };
    await AsyncStorage.setItem('picturewise-selected-history', JSON.stringify(selected)).catch(() => {});
    onNavigate('create');
  };

  const saveConnection = async () => {
    let value = apiDraft.trim().replace(/\/$/, '');
    if (!/^https?:\/\//i.test(value)) value = `http://${value}`;
    setApiBase(value); setApiDraft(value);
    try { await AsyncStorage.setItem('picturewise-api-base', value); } catch (_) {}
    setTimeout(refreshAll, 100);
  };

  const clearHistory = async () => {
    try {
      await callApi('/api/history', { method: 'DELETE' });
      setHistory([]); setLatest(null); setNotice(t('saved')); refreshAll();
    } catch (_) { setError(t('generationFailed')); }
  };

  const askToClearHistory = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(t('clearConfirm'))) clearHistory();
      return;
    }
    Alert.alert(t('clearHistory'), t('clearConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('confirm'), style: 'destructive', onPress: clearHistory },
    ]);
  };

  const screenTabs = ['create', 'insights', 'history', 'settings'];
  const modeText = providerMode === 'live' ? t('live') : providerMode === 'demo' ? t('demo') : t('offline');

  const header = (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>✦</Text></View>
        <View><Text style={styles.brand}>picturewise <Text style={{ color: COLORS.purple }}>AI</Text></Text><Text style={styles.brandSub}>{t('brandSub')}</Text></View>
      </View>
      <View style={[styles.connectionBadge, !connected && styles.connectionBadgeOff]}><View style={[styles.statusDot, connected && styles.statusDotOn]} /><Text style={styles.connectionText}>{modeText}</Text></View>
      <View style={styles.languageRow}>{['en', 'ta', 'hi'].map(code => <Pressable key={code} onPress={() => setAppLanguage(code)} style={[styles.languageChip, language === code && styles.languageChipActive]}><Text style={[styles.languageChipText, language === code && styles.languageChipTextActive]}>{code.toUpperCase()}</Text></Pressable>)}</View>
    </View>
  );

  const nav = (
    <View style={[styles.nav, Platform.OS === 'web' && styles.sidebarNav]}>
      {usesSidebar ? <ScalePressable accessibilityLabel="Open navigation menu" onPress={() => setSidebarOpen(open => !open)} style={styles.menuButton}><Text style={styles.menuButtonText}>☰</Text></ScalePressable> : null}
      {(!usesSidebar || sidebarOpen) && screenTabs.map(key => <ScalePressable key={key} onPress={() => { setError(''); setNotice(''); onNavigate(key); if (usesSidebar) setSidebarOpen(false); }} style={[styles.navItem, Platform.OS === 'web' && styles.sidebarNavItem, screen === key && styles.navItemActive]}><Text style={[styles.navText, screen === key && styles.navTextActive]}>{t(key)}</Text></ScalePressable>)}
    </View>
  );

  const createScreen = (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroText}><Text style={styles.kicker}>{t('eyebrow')}</Text><Text style={styles.heroTitle}>{t('hero')}</Text><Text style={styles.heroBody}>{t('intro')}</Text></View>
        <OrbArt spin={orbit} />
      </View>

      <View style={styles.card}>
        <SectionTitle kicker={t('purposeTag')} title={t('purpose')} />
        <View style={styles.purposeGrid}>
          {PURPOSES.map(item => <ScalePressable key={item.id} onPress={() => choosePurpose(item.id)} style={[styles.purposeCard, purpose === item.id && styles.purposeCardActive]}>
            <Text style={styles.purposeIcon}>{item.icon}</Text><Text style={[styles.purposeName, purpose === item.id && styles.purposeNameActive]}>{item[language]}</Text>
            {purpose === item.id ? <Text style={styles.selectedCheck}>✓</Text> : null}
          </ScalePressable>)}
        </View>

        <Text style={styles.fieldLabel}>{t('prompt')}</Text>
        <TextInput value={prompt} onChangeText={setPrompt} placeholder={t('promptHint')} placeholderTextColor="#9A92A7" multiline textAlignVertical="top" style={styles.promptInput} />

        <View style={styles.fieldRow}><Text style={styles.fieldLabel}>{t('tier')}</Text><Text style={styles.recommendedTag}>{t('recommend')}</Text></View>
        <View style={styles.tierRow}>
          <ScalePressable onPress={() => { setTier('economy'); setManualTier(true); }} style={[styles.tierCard, tier === 'economy' && styles.tierCardActive]}>
            <View style={styles.tierTop}><Text style={styles.tierName}>{t('economy')}</Text>{recommendation === 'economy' ? <Text style={styles.miniRecommended}>✦ {t('recommend')}</Text> : null}</View>
            <Text style={styles.tierSteps}>{t('economyQuality')}</Text><Text style={styles.tierDesc}>{t('economyDesc')}</Text>
          </ScalePressable>
          <ScalePressable onPress={() => { setTier('detail'); setManualTier(true); }} style={[styles.tierCard, tier === 'detail' && styles.tierCardActive]}>
            <View style={styles.tierTop}><Text style={styles.tierName}>{t('detail')}</Text>{recommendation === 'detail' ? <Text style={styles.miniRecommended}>✦ {t('recommend')}</Text> : null}</View>
            <Text style={styles.tierSteps}>{t('detailQuality')}</Text><Text style={styles.tierDesc}>{t('detailDesc')}</Text>
          </ScalePressable>
        </View>
        <View style={styles.fieldRow}><Text style={styles.suggestion}>{t('recommendation')}: {recommendation === 'detail' ? t('detail') : t('economy')}{manualTier && tier !== recommendation ? ` · ${t('suggestionChanged')}` : ''}</Text>{manualTier && tier !== recommendation ? <Pressable onPress={() => { setTier(recommendation); setManualTier(false); }}><Text style={styles.linkText}>{t('useSuggestion')}</Text></Pressable> : null}</View>

        <View style={styles.fieldRow}><Text style={styles.fieldLabel}>{t('age')}</Text></View>
        <View style={styles.templateRow}>{[
          ['5-7 years', 'ageYoung'], ['8-10 years', 'ageMiddle'], ['11-14 years', 'ageOlder'], ['general audience', 'ageAll'],
        ].map(([value, key]) => <Pill compact key={value} active={audience === value} onPress={() => setAudience(value)}>{t(key)}</Pill>)}</View>

        <View style={styles.toggleRow}><View style={{ flex: 1 }}><Text style={styles.fieldLabel}>{t('labels')}</Text><Text style={styles.smallMuted}>{t('labelsHint')}</Text></View><Switch value={labelsOn} onValueChange={setLabelsOn} trackColor={{ false: '#DDD7E7', true: '#BFB0EB' }} thumbColor={labelsOn ? COLORS.purple : '#FFFFFF'} /></View>
        {labelsOn ? <Text style={styles.smallMuted}>{t('labelPosition')}</Text> : null}

        <View style={styles.estimateCard}>
          <View style={styles.estimateTop}><Text style={styles.estimateTitle}>{t('estimate')}</Text><Text style={styles.stepBadge}>{selectedSteps} / 8 {t('steps')}</Text></View>
          <View style={styles.progressTrack}><Animated.View style={[styles.progressFill, { width: estimateProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${selectedSteps / 8 * 100}%`] }) }]} /></View>
          <View style={styles.estimateBottom}><Text style={styles.smallMuted}>{t('estimateNote')}</Text><Text style={styles.fewer}>{fewerPercent}%</Text></View>
          <Text style={styles.smallMuted}>{t('fewer')}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {notice ? <Text style={styles.noticeText}>{notice}</Text> : null}
        <ScalePressable disabled={busy} onPress={generate} style={styles.primaryButton}>
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>✦  {t('generate')}</Text>}
        </ScalePressable>
      </View>

      {latest ? <Animated.View style={[styles.card, { opacity: resultReveal, transform: [{ translateY: resultReveal.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }]}>
        <SectionTitle kicker={t('resultTag')} title={t('result')} right={<Text style={styles.modeChip}>{latest.mode === 'live' ? t('live') : t('demo')}</Text>} />
        <Text style={styles.choiceHeading}>{optionCopy.choices}</Text>
        {availableOptions.length > 1 ? <View style={styles.optionGrid}>
          {availableOptions.map(option => {
            const isSelected = Number(option.number) === Number(selectedImage?.number);
            return <ScalePressable
              key={option.history_id || option.number}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedOptionNumber(Number(option.number) || 1)}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
            >
              <LabeledPreview item={option} labelsOn={false} apiBase={apiBase.replace(/\/$/, '')} labels={t('plantLabels')} />
              <Text style={styles.optionName}>{optionCopy.option} {option.number}</Text>
              <Text style={styles.optionAction}>{isSelected ? optionCopy.selected : optionCopy.choose}</Text>
            </ScalePressable>;
          })}
        </View> : <Text style={styles.matchNote}>{optionCopy.oneChoice}</Text>}
        {latest.prompt_translation?.translated ? <Text style={styles.translationNote}>{optionCopy.translated}: {latest.prompt_translation.english_prompt}</Text> : null}
        {latest.prompt_translation?.note ? <Text style={styles.translationNote}>{latest.prompt_translation.note}</Text> : null}
        {latest.memory_match ? <Text style={styles.matchNote}>{latest.memory_match.match_type === 'same' ? optionCopy.sameMatch : optionCopy.relatedMatch}</Text> : null}
        <LabeledPreview item={selectedImage} labelsOn={labelsOn} apiBase={apiBase.replace(/\/$/, '')} labels={t('plantLabels')} />
        <View style={styles.resultMeta}><Text style={styles.resultPrompt} numberOfLines={2}>{latest.prompt || prompt}</Text><Text style={styles.resultSteps}>{latest.resource_estimate?.steps ?? latest.steps} / 8 {t('steps')}</Text></View>
        <View style={styles.generationEstimate}>
          <Text style={styles.resultEstimateLabel}>{t('computeCost')}</Text>
          <Text style={styles.resultEstimateValue}>{latest.resource_estimate?.estimated_compute_units ?? latest.resource_estimate?.steps ?? latest.steps} {t('steps')}</Text>
          <Text style={styles.resultEstimateLabel}>{t('savingVsMax')}</Text>
          <Text style={styles.resultSaving}>{latest.resource_estimate?.percent_fewer_steps_vs_max ?? 0}% · {latest.resource_estimate?.saved_compute_units_vs_max ?? 0} units</Text>
          <Text style={styles.smallMuted}>{t('calculation')}</Text>
          <Text style={styles.smallMuted}>{latest.resource_estimate?.note || t('estimateNote')}</Text>
        </View>
        <ScalePressable onPress={saveImage} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{t('save')}</Text></ScalePressable>
      </Animated.View> : null}
    </>
  );

  const insightsScreen = (
    <View style={styles.card}>
      <SectionTitle kicker={t('activityTag')} title={t('insights')} right={<Pressable onPress={refreshAll}><Text style={styles.linkText}>↻</Text></Pressable>} />
      {loadingScreen && !insights ? <View style={styles.skeletonGrid}><Shimmer opacity={shimmer} style={styles.skeletonCard} /><Shimmer opacity={shimmer} style={styles.skeletonCard} /><Shimmer opacity={shimmer} style={styles.skeletonCard} /><Shimmer opacity={shimmer} style={styles.skeletonCard} /></View> : null}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}><Text style={styles.statValue}>{insights?.today?.images_used ?? 0}</Text><Text style={styles.statLabel}>{t('used')}</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{insights?.today?.images_remaining ?? 2}</Text><Text style={styles.statLabel}>{t('remaining')}</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{insights?.all_time?.generations ?? 0}</Text><Text style={styles.statLabel}>{t('allTime')}</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{insights?.all_time?.average_latency_ms ? `${(insights.all_time.average_latency_ms / 1000).toFixed(1)}s` : '—'}</Text><Text style={styles.statLabel}>{t('avgTime')}</Text></View>
      </View>
      <View style={styles.budgetPanel}><View style={styles.fieldRow}><Text style={styles.estimateTitle}>{t('budget')}</Text><Text style={styles.stepBadge}>{insights?.today?.images_used ?? 0} / {insights?.today?.image_limit ?? 2}</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${insights?.today?.percent_images_used ?? 0}%` }]} /></View><Text style={styles.smallMuted}>{t('budgetHint')}</Text></View>
      <Text style={styles.fieldLabel}>{t('week')}</Text>
      <View style={styles.chartRow}>
        {(insights?.last_7_days || []).length ? insights.last_7_days.map(day => {
          const max = Math.max(8, ...insights.last_7_days.map(d => d.steps));
          return <View key={day.day} style={styles.chartColumn}><Text style={styles.chartNumber}>{day.steps}</Text><View style={[styles.chartBar, { height: 18 + 92 * day.steps / max }]} /><Text style={styles.chartDay}>{String(day.day).slice(5)}</Text></View>;
        }) : <Text style={styles.smallMuted}>{t('emptyHistory')}</Text>}
      </View>
      <Text style={styles.fieldLabel}>{t('byPurpose')}</Text>
      {(insights?.by_purpose || []).map(row => <View key={row.purpose} style={styles.listRow}><Text style={styles.listName}>{PURPOSES.find(p => p.id === row.purpose)?.[language] || row.purpose}</Text><Text style={styles.listValue}>{row.generations} · {row.steps} {t('steps')}</Text></View>)}
      <Text style={styles.smallMuted}>{insights?.estimate_note || t('estimateNote')}</Text>
    </View>
  );

  const historyScreen = (
    <View style={styles.card}>
      <SectionTitle kicker="SAVED LOCALLY" title={t('history')} right={<Pressable onPress={refreshAll}><Text style={styles.linkText}>↻</Text></Pressable>} />
      {history.length === 0 ? <Text style={styles.emptyText}>{t('emptyHistory')}</Text> : history.map(item => (
        <Pressable key={item.id} onPress={() => applyHistoryItem(item)} style={styles.historyRow}>
          <View style={styles.historyThumb}><Text style={styles.historyThumbText}>{PURPOSES.find(p => p.id === item.purpose)?.icon || '✦'}</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.listName} numberOfLines={1}>{item.prompt}</Text><Text style={styles.smallMuted}>{PURPOSES.find(p => p.id === item.purpose)?.[language] || item.purpose} · {item.quality_tier === 'detail' ? t('detail') : t('economy')} · {item.resource_estimate?.estimated_compute_units ?? item.steps} {t('steps')} · {item.resource_estimate?.percent_fewer_steps_vs_max ?? 0}% {t('savingVsMax')}</Text><Text style={styles.smallMuted}>{new Date(item.created_at).toLocaleString()}</Text></View>
          <Text style={styles.listValue}>›</Text>
        </Pressable>
      ))}
      {history.length ? <Pressable onPress={askToClearHistory} style={styles.dangerButton}><Text style={styles.dangerButtonText}>{t('clearHistory')}</Text></Pressable> : null}
      <Text style={styles.smallMuted}>{t('privacy')}</Text>
    </View>
  );

  const settingsScreen = (
    <View style={styles.card}>
      <SectionTitle kicker={t('projectControls')} title={t('settings')} />
      <Text style={styles.fieldLabel}>{t('apiAddress')}</Text>
      <TextInput value={apiDraft} onChangeText={setApiDraft} autoCapitalize="none" autoCorrect={false} keyboardType="url" style={styles.singleInput} placeholder="http://127.0.0.1:5001" />
      <Pressable onPress={saveConnection} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{t('connect')}</Text></Pressable>
      <View style={styles.connectionInfo}><View style={[styles.statusDot, connected && styles.statusDotOn]} /><Text style={styles.smallMuted}>{connected ? t('connectionOK') : t('connectionFail')}</Text></View>
      <Text style={styles.fieldLabel}>{t('budget')}</Text>
      <Text style={styles.smallMuted}>{t('budgetHint')}</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {notice ? <Text style={styles.noticeText}>{notice}</Text> : null}
      <Text style={styles.fieldLabel}>{t('language')}</Text>
      <View style={styles.templateRow}>{[['en', 'English'], ['ta', 'தமிழ்'], ['hi', 'हिन्दी']].map(([code, name]) => <Pill key={code} active={language === code} onPress={() => setAppLanguage(code)}>{name}</Pill>)}</View>
      <Text style={[styles.smallMuted, { marginTop: 20 }]}>{t('privacy')}</Text>
    </View>
  );

  const content = screen === 'create' ? createScreen : screen === 'insights' ? insightsScreen : screen === 'history' ? historyScreen : settingsScreen;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {header}
      <View style={usesSidebar && styles.dashboardLayout}>
        <Animated.View style={[usesSidebar && styles.sidebar, { width: usesSidebar ? sidebarWidth : undefined }]}>{nav}</Animated.View>
        <ScrollView style={usesSidebar && styles.dashboardContent} contentContainerStyle={[styles.page, usesSidebar && styles.dashboardPage]} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ opacity: screenTransition, transform: [{ translateY: screenTransition.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
            {content}
          </Animated.View>
          <Text style={styles.footer}>{t('footer')}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  safe: { flex: 1, backgroundColor: COLORS.pale },
  header: { paddingHorizontal: 18, paddingTop: Platform.OS === 'web' ? 14 : 7, paddingBottom: 28, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandMark: { width: 38, height: 38, borderRadius: 14, backgroundColor: COLORS.lilac, alignItems: 'center', justifyContent: 'center' }, brandMarkText: { color: COLORS.purple, fontSize: 22 },
  brand: { color: COLORS.ink, fontSize: 18, fontWeight: '800', letterSpacing: -0.4 }, brandSub: { color: COLORS.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1.3, marginTop: 1 },
  connectionBadge: { position: 'absolute', right: 18, top: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1FAF6', paddingVertical: 6, paddingHorizontal: 9, borderRadius: 20 }, connectionBadgeOff: { backgroundColor: '#F8EDF0' },
  connectionText: { fontSize: 9, fontWeight: '700', color: COLORS.ink }, statusDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: '#C1B9CC' }, statusDotOn: { backgroundColor: '#35A47B' },
  languageRow: { position: 'absolute', right: 18, bottom: 7, flexDirection: 'row', gap: 4 }, languageChip: { paddingVertical: 3, paddingHorizontal: 5, borderRadius: 6 }, languageChipActive: { backgroundColor: COLORS.lilac }, languageChipText: { color: COLORS.muted, fontSize: 9, fontWeight: '700' }, languageChipTextActive: { color: COLORS.deep },
  dashboardLayout: { flex: 1, flexDirection: 'row' }, sidebar: { width: 58, overflow: 'hidden', backgroundColor: COLORS.white, borderRightWidth: 1, borderRightColor: COLORS.border }, dashboardContent: { flex: 1 }, nav: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.white, gap: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border }, sidebarNav: { flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 16, gap: 7, borderBottomWidth: 0 }, menuButton: { height: 36, width: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lilac }, menuButtonText: { color: COLORS.deep, fontSize: 20, fontWeight: '800' }, navItem: { flex: 1, paddingVertical: 9, borderRadius: 12, alignItems: 'center' }, sidebarNavItem: { flex: 0, width: '100%', alignItems: 'flex-start', paddingHorizontal: 13, paddingVertical: 12 }, navItemActive: { backgroundColor: COLORS.lilac }, navText: { color: COLORS.muted, fontSize: 11, fontWeight: '700' }, navTextActive: { color: COLORS.deep }, pressableFill: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }, webHover: { opacity: 0.88 },
  page: { padding: 15, paddingBottom: 35, maxWidth: 760, width: '100%', alignSelf: 'center' }, dashboardPage: { maxWidth: 1040, paddingHorizontal: 28 },
  heroCard: { minHeight: 182, backgroundColor: '#ECE5FB', borderRadius: 24, padding: 21, marginBottom: 14, flexDirection: 'row', overflow: 'hidden', alignItems: 'center' }, heroText: { flex: 1, maxWidth: '60%', zIndex: 2 }, kicker: { color: COLORS.purple, fontSize: 9, fontWeight: '900', letterSpacing: 1.3, marginBottom: 7 }, heroTitle: { fontSize: 23, lineHeight: 28, color: COLORS.ink, fontWeight: '800', letterSpacing: -0.6 }, heroBody: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  orbWrap: { position: 'absolute', width: 158, height: 158, right: -4, top: 11, alignItems: 'center', justifyContent: 'center' }, orbCore: { width: 78, height: 78, borderRadius: 50, backgroundColor: '#9D82E6', alignItems: 'center', justifyContent: 'center', shadowColor: '#6750A4', shadowOpacity: 0.25, shadowRadius: 15, elevation: 8 }, orbSpark: { color: COLORS.white, fontSize: 34 }, orbitRing: { position: 'absolute', width: 138, height: 92, borderRadius: 80, borderWidth: 2, borderColor: 'rgba(111,82,186,0.52)' }, orbitRingThin: { width: 150, height: 68, borderColor: 'rgba(255,255,255,0.9)' }, orbDot: { position: 'absolute', right: 15, top: 36, height: 11, width: 11, borderRadius: 6, backgroundColor: '#FFFFFF' },
  card: { backgroundColor: COLORS.white, borderColor: COLORS.border, borderWidth: 1, borderRadius: 22, padding: 17, marginBottom: 14, shadowColor: '#3C2A64', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 13 }, sectionTitle: { fontSize: 19, fontWeight: '800', color: COLORS.ink, letterSpacing: -0.3 },
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 16 }, purposeCard: { width: '48%', minHeight: 82, backgroundColor: '#FBFAFD', borderColor: COLORS.border, borderWidth: 1, borderRadius: 15, padding: 11, justifyContent: 'center' }, purposeCardActive: { borderColor: COLORS.purple, backgroundColor: '#F5F1FF' }, purposeIcon: { color: COLORS.purple, fontSize: 18, marginBottom: 3 }, purposeName: { color: COLORS.muted, fontWeight: '700', fontSize: 11 }, purposeNameActive: { color: COLORS.deep }, selectedCheck: { position: 'absolute', right: 9, top: 8, color: COLORS.purple, fontWeight: '900' },
  fieldLabel: { color: COLORS.ink, fontSize: 12, fontWeight: '800', marginBottom: 7, marginTop: 9 }, promptInput: { minHeight: 90, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#FCFBFE', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 11, fontSize: 13, color: COLORS.ink }, singleInput: { minHeight: 46, borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, paddingHorizontal: 12, color: COLORS.ink, backgroundColor: '#FCFBFE', fontSize: 13 },
  templateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 5 }, pill: { borderWidth: 1, borderColor: COLORS.border, paddingVertical: 7, paddingHorizontal: 11, borderRadius: 20, backgroundColor: COLORS.white }, pillActive: { borderColor: COLORS.purple, backgroundColor: COLORS.lilac }, pillCompact: { paddingVertical: 6, paddingHorizontal: 9 }, pillText: { color: COLORS.muted, fontSize: 10, fontWeight: '700' }, pillTextActive: { color: COLORS.deep },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, recommendedTag: { color: COLORS.purple, fontWeight: '800', fontSize: 9, backgroundColor: COLORS.lilac, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 15 }, tierRow: { flexDirection: 'row', gap: 9 }, tierCard: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 15, padding: 12, backgroundColor: '#FCFBFE' }, tierCardActive: { borderColor: COLORS.purple, backgroundColor: '#F5F1FF' }, tierTop: { minHeight: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }, tierName: { color: COLORS.ink, fontWeight: '800', fontSize: 12 }, miniRecommended: { color: COLORS.purple, fontWeight: '800', fontSize: 8 }, tierSteps: { color: COLORS.purple, fontWeight: '900', fontSize: 17, marginTop: 7 }, tierDesc: { color: COLORS.muted, fontSize: 9, marginTop: 3 }, suggestion: { color: COLORS.muted, fontSize: 10, marginTop: 8 }, smallMuted: { color: COLORS.muted, fontSize: 10, lineHeight: 15 }, toggleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  estimateCard: { borderRadius: 16, backgroundColor: '#F6F3FB', padding: 13, marginTop: 14 }, estimateTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, estimateTitle: { color: COLORS.ink, fontSize: 12, fontWeight: '800' }, stepBadge: { color: COLORS.deep, backgroundColor: '#E9E2FA', overflow: 'hidden', borderRadius: 11, paddingVertical: 5, paddingHorizontal: 8, fontSize: 9, fontWeight: '800' }, progressTrack: { height: 8, backgroundColor: '#E4DEEC', borderRadius: 8, marginTop: 10, overflow: 'hidden' }, progressFill: { height: 8, backgroundColor: COLORS.purple, borderRadius: 8 }, estimateBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 }, fewer: { color: COLORS.green, fontSize: 19, fontWeight: '900' },
  primaryButton: { minHeight: 50, backgroundColor: COLORS.purple, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 14 }, primaryButtonText: { color: COLORS.white, fontSize: 13, fontWeight: '800' }, buttonDisabled: { opacity: 0.65 }, secondaryButton: { minHeight: 44, backgroundColor: '#F2EEFA', borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 11 }, secondaryButtonText: { color: COLORS.deep, fontWeight: '800', fontSize: 12 }, errorText: { color: COLORS.red, fontSize: 11, lineHeight: 16, marginTop: 9 }, noticeText: { color: COLORS.green, fontSize: 11, marginTop: 8 },
  modeChip: { overflow: 'hidden', borderRadius: 12, color: COLORS.green, backgroundColor: '#EAF7F1', paddingVertical: 5, paddingHorizontal: 8, fontSize: 9, fontWeight: '800' }, choiceHeading: { color: COLORS.ink, fontSize: 12, fontWeight: '800', marginBottom: 8 }, optionGrid: { flexDirection: 'row', gap: 9, marginBottom: 13 }, optionCard: { flex: 1, minWidth: 0, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 7, backgroundColor: '#FCFBFE' }, optionCardSelected: { borderColor: COLORS.purple, backgroundColor: '#F5F1FF' }, optionName: { color: COLORS.deep, fontSize: 11, fontWeight: '800', marginTop: 7 }, optionAction: { color: COLORS.muted, fontSize: 9, fontWeight: '700', marginTop: 2 }, matchNote: { color: COLORS.green, backgroundColor: '#EDF8F2', borderRadius: 10, padding: 9, fontSize: 10, lineHeight: 15, marginBottom: 10 }, translationNote: { color: COLORS.deep, backgroundColor: '#F4F0FD', borderRadius: 10, padding: 9, fontSize: 10, lineHeight: 15, marginBottom: 10 }, imageFrame: { aspectRatio: 1, width: '100%', overflow: 'hidden', borderRadius: 16, backgroundColor: '#F9F7FC', borderWidth: 1, borderColor: COLORS.border, position: 'relative' }, generatedImage: { width: '100%', height: '100%' }, labelSvg: { position: 'absolute', top: 0, left: 0 }, resultMeta: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10, alignItems: 'center' }, resultPrompt: { color: COLORS.ink, fontWeight: '600', fontSize: 11, flex: 1 }, resultSteps: { color: COLORS.purple, fontWeight: '800', fontSize: 10 }, generationEstimate: { backgroundColor: '#F6F3FB', borderRadius: 12, padding: 11, marginTop: 10, gap: 3 }, resultEstimateLabel: { color: COLORS.muted, fontSize: 9, fontWeight: '700' }, resultEstimateValue: { color: COLORS.deep, fontSize: 16, fontWeight: '900', marginBottom: 4 }, resultSaving: { color: COLORS.green, fontSize: 15, fontWeight: '900', marginBottom: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 10 }, shimmer: { backgroundColor: '#E9E2FA', borderRadius: 15 }, skeletonCard: { width: '48%', height: 78 }, statCard: { width: '48%', backgroundColor: '#F8F6FC', borderRadius: 15, padding: 13, minHeight: 78, justifyContent: 'center' }, statValue: { color: COLORS.ink, fontSize: 22, fontWeight: '900' }, statLabel: { color: COLORS.muted, fontSize: 9, fontWeight: '700', marginTop: 3 }, budgetPanel: { backgroundColor: '#F8F6FC', borderRadius: 15, padding: 12, marginVertical: 14 }, chartRow: { minHeight: 140, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingVertical: 8 }, chartColumn: { alignItems: 'center', justifyContent: 'flex-end', minWidth: 28 }, chartBar: { width: 19, backgroundColor: '#A994DE', borderRadius: 7, marginTop: 5 }, chartNumber: { color: COLORS.muted, fontSize: 8, fontWeight: '700' }, chartDay: { color: COLORS.muted, fontSize: 8, marginTop: 5 }, listRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0EDF4' }, listName: { color: COLORS.ink, fontSize: 11, fontWeight: '700', flex: 1 }, listValue: { color: COLORS.purple, fontSize: 10, fontWeight: '800' },
  emptyText: { color: COLORS.muted, fontSize: 12, paddingVertical: 25, textAlign: 'center' }, historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0EDF4' }, historyThumb: { height: 40, width: 40, borderRadius: 13, backgroundColor: COLORS.lilac, alignItems: 'center', justifyContent: 'center' }, historyThumbText: { fontSize: 18, color: COLORS.purple }, dangerButton: { backgroundColor: '#FFF3F5', minHeight: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 14, marginBottom: 11 }, dangerButtonText: { color: COLORS.red, fontWeight: '800', fontSize: 11 }, connectionInfo: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10, marginBottom: 12 }, linkText: { color: COLORS.purple, fontSize: 20, fontWeight: '800' }, footer: { color: '#A29AAC', textAlign: 'center', fontSize: 9, paddingVertical: 13 },
};
