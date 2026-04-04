export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    discover: 'Discover',
    explore: 'Explore',
    navigate: 'Navigate',
    coach: 'AI Coach',
    settings: 'Settings',
    // Landing
    heroTitle: 'Your career is a 30-year journey.',
    heroSubtitle: 'It starts with knowing who you are.',
    imStudent: "I'm a Student",
    imParent: "I'm a Parent",
    // Dashboard
    welcomeBack: 'Welcome back',
    identitySnapshot: 'Identity Snapshot',
    yourJourney: 'Your Journey',
    careerHypotheses: 'Career Hypotheses',
    reflectionPrompt: 'Reflection Prompt',
    // Discovery
    discoverTitle: 'Discover Who You Are',
    interestExplorer: 'Interest Explorer',
    valuesSorter: 'Values Sorter',
    identityJournal: 'Identity Journal',
    thatsMe: "That's me!",
    meh: 'Meh',
    notMe: 'Not my thing',
    // Explore
    exploreCareers: 'Explore Careers',
    bestMatch: 'Best Match',
    highGrowth: 'High Growth',
    aiSafe: 'AI Safe',
    topSalary: 'Top Salary',
    aiRisk: 'AI Risk',
    salaryRange: 'Salary Range',
    addToHypotheses: 'Add to My Hypotheses',
    // Navigate
    navigatePath: 'Navigate Your Path',
    recommendedStreams: 'Recommended Streams',
    roadmap: 'Your Roadmap',
    // Coach
    askAnything: 'Ask me anything about careers...',
    // Settings
    language: 'Language',
    privacyControls: 'Privacy Controls',
    exportData: 'Export My Data',
    clearData: 'Clear All Data',
    logout: 'Log out',
    // Common
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    discover: 'खोजें',
    explore: 'करियर देखें',
    navigate: 'रास्ता चुनें',
    coach: 'AI कोच',
    settings: 'सेटिंग्स',
    heroTitle: 'आपका करियर 30 साल का सफर है।',
    heroSubtitle: 'शुरुआत खुद को जानने से होती है।',
    imStudent: 'मैं स्टूडेंट हूं',
    imParent: 'मैं पैरेंट हूं',
    welcomeBack: 'वापसी पर स्वागत है',
    identitySnapshot: 'पहचान स्नैपशॉट',
    yourJourney: 'आपका सफर',
    careerHypotheses: 'करियर अनुमान',
    reflectionPrompt: 'सोचने का सवाल',
    discoverTitle: 'खुद को जानें',
    interestExplorer: 'रुचि खोजक',
    valuesSorter: 'मूल्य क्रम',
    identityJournal: 'पहचान डायरी',
    thatsMe: 'ये मैं हूं! 🔥',
    meh: 'ठीक है 😐',
    notMe: 'मेरा नहीं 🙅',
    exploreCareers: 'करियर खोजें',
    bestMatch: 'सबसे अच्छा मैच',
    highGrowth: 'तेज़ बढ़ रहा',
    aiSafe: 'AI से सुरक्षित',
    topSalary: 'ज़्यादा सैलरी',
    aiRisk: 'AI जोखिम',
    salaryRange: 'सैलरी रेंज',
    addToHypotheses: 'मेरी लिस्ट में जोड़ें',
    navigatePath: 'अपना रास्ता चुनें',
    recommendedStreams: 'सुझाए गए स्ट्रीम',
    roadmap: 'आपका रोडमैप',
    askAnything: 'करियर के बारे में कुछ भी पूछें...',
    language: 'भाषा',
    privacyControls: 'प्राइवेसी सेटिंग्स',
    exportData: 'डेटा डाउनलोड करें',
    clearData: 'सारा डेटा मिटाएं',
    logout: 'लॉग आउट',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    loading: 'लोड हो रहा है...',
  },
};

export type Language = 'en' | 'hi';
export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, lang: Language = 'en'): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('nexus_language') as Language) || 'en';
}

export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nexus_language', lang);
}
