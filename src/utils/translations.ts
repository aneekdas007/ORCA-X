import type { Language } from '../types';

export interface LocalizedScenarioInfo {
  titleEn: string;
  titleHi: string;
  headlineHi: string;
  executiveSummaryHi: string;
  recommendationHi: string;
}

export const SCENARIO_TRANSLATIONS: Record<string, LocalizedScenarioInfo> = {
  scenario1: {
    titleEn: 'Fishing safety — Paradip',
    titleHi: 'मत्स्य पालन सुरक्षा — पारादीप',
    headlineHi: 'पारादीप तटीय क्षेत्र: मध्यम समुद्री स्थिति — सावधानी के साथ परिचालन की सलाह',
    executiveSummaryHi: 'ओशनसैट-3 और इनकॉइस स्वान वेव मॉडल के अनुसार पारादीप तट पर कल सुबह लहरों की ऊंचाई 1.6 से 2.1 मीटर और हवा की गति 18-24 नॉट रहने का अनुमान है। कोई गंभीर समुद्री चक्रवाती चेतावनी नहीं है।',
    recommendationHi: 'केवल सावधानी के साथ प्रस्थान करें और रवानगी से पूर्व अद्यतन समुद्री परामर्श की जांच करें। छोटी मोटर चालित नावें तट से 5 समुद्री मील के भीतर रहें।'
  },
  scenario2: {
    titleEn: 'Vessel route — Kochi',
    titleHi: 'जहाज़ मार्ग — कोच्चि',
    headlineHi: 'कोच्चि अपतटीय मार्ग: आंतरिक शेल्फ गलियारा (मार्ग A) अनुशंसित',
    executiveSummaryHi: 'कोच्चि से अपतटीय पारगमन हेतु मार्ग A (आंतरिक शेल्फ गलियारा) मार्ग B की तुलना में काफी सुरक्षित है। मालाबार शेल्फ पर तरंगों की ऊंचाई 1.2 से 1.5 मीटर और 14-17 नॉट हवा है, जबकि खुले अरब सागर मार्ग B पर 2.8 मीटर तक ऊंची लहरें हैं।',
    recommendationHi: 'मार्ग A (आंतरिक शेल्फ) अपनाएं। मार्ग B से बचें जहां 28 नॉट के हवा के झोंके मध्यम जहाजों की सुरक्षा सीमा से अधिक हैं।'
  },
  scenario3: {
    titleEn: 'Marine hazards — Visakhapatnam',
    titleHi: 'समुद्री खतरे — विशाखापत्तनम',
    headlineHi: 'विशाखापत्तनम तट: सामान्य स्थिति — कोई गंभीर समुद्री खतरा सक्रिय नहीं',
    executiveSummaryHi: 'कैलासगिरी डॉपलर रडार और डीप-मूरेड बॉय बीडी-11 के आंकड़ों के अनुसार विशाखापत्तनम आउटर रोडस्टेड में किसी सक्रिय चक्रवाती दबाव, असामान्य ज्वार या उग्र समुद्री खतरे का संकेत नहीं है।',
    recommendationHi: 'सामान्य बंदरगाह एवं तटीय परिचालन जारी रखा जा सकता है। डॉल्फिन नोज़ के समीप स्थानीय ज्वारीय धाराओं हेतु मानक तटीय निगरानी सक्रिय रखें।'
  }
};

export const UI_STRINGS = {
  en: {
    emptyHeadline: 'Ask anything about the ocean.',
    emptySubtitle: 'Marine conditions, vessel routes, fishing safety, coastal hazards.',
    emptyDisclaimer: 'Autonomous marine analysis for coastal operations • SIH26176 / ISRO',
    inputPlaceholder: 'Ask ORCA-X about coastal conditions, vessel routes, or marine hazards...',
    newMarineQuery: 'New Marine Query',
    recentInquiries: 'Recent Inquiries',
    noPastInquiries: 'No past inquiries yet in this session.',
    multiAgentMode: 'Multi-Agent Mode',
    chatAssistantTitle: 'ORCA-X Intelligence Assistant',
    chatAssistantSub: 'Natural Language Marine Surveillance & Risk Engine',
    processingMsg: 'Decomposing marine query & analyzing observation feeds...',
    surveillanceAdvisory: 'Surveillance Advisory',
    agentTrace: 'Agent Trace',
    exportAdvisory: 'Export Advisory',
    printAdvisory: 'Print Advisory',
    fullDashboard: 'Full Dashboard',
    intelSynthesis: 'Intelligence Synthesis',
    hydroMap: 'Hydrographic Map',
    marineAnalytics: 'Marine Analytics',
    observationFeeds: 'Observation Feeds',
    about: 'About',
    teamName: 'Team MarineX',
    teamSub: 'Supported by Indian Space Research Organisation (ISRO)',
    archDetails: 'Architecture Details',
    view: 'View',
    surveillanceGridActive: 'Surveillance Grid Active',
    pipelineAnalyzing: 'Agent Pipeline Analyzing',
    activeSector: 'Active Sector',
    fallbackQueryTitle: 'Marine Advisory Query',
    rejectionMsg: 'ORCA-X could not correlate this query with sufficient confidence in the requested coastal sector. Please specify a coastal area, time window, and marine operation (e.g. fishing safety, vessel routing, or hazard screening).'
  },
  hi: {
    emptyHeadline: 'समुद्र के बारे में कुछ भी पूछें।',
    emptySubtitle: 'समुद्री दशाएं, जहाज़ मार्ग, मत्स्य पालन सुरक्षा, तटीय खतरे।',
    emptyDisclaimer: 'तटीय परिचालनों हेतु स्वायत्त समुद्री आसूचना • SIH26176 / इसरो',
    inputPlaceholder: 'पारादीप, कोच्चि या विशाखापत्तनम के समुद्री हालातों के बारे में पूछें...',
    newMarineQuery: 'नया समुद्री प्रश्न',
    recentInquiries: 'हालिया प्रश्न',
    noPastInquiries: 'इस सत्र में अभी कोई पिछला प्रश्न नहीं है।',
    multiAgentMode: 'मल्टी-एजेंट मोड',
    chatAssistantTitle: 'ORCA-X इंटेलिजेंस असिस्टेंट',
    chatAssistantSub: 'प्राकृतिक भाषा समुद्री निगरानी एवं जोखिम इंजन',
    processingMsg: 'समुद्री प्रश्न का विश्लेषण एवं उपग्रह डेटा प्रक्रमण जारी...',
    surveillanceAdvisory: 'निगरानी परामर्श',
    agentTrace: 'एजेंट ट्रेस',
    exportAdvisory: 'परामर्श निर्यात',
    printAdvisory: 'परामर्श प्रिंट',
    fullDashboard: 'सम्पूर्ण डैशबोर्ड',
    intelSynthesis: 'आसूचना संश्लेषण',
    hydroMap: 'जल सर्वेक्षण मानचित्र',
    marineAnalytics: 'समुद्री विश्लेषण',
    observationFeeds: 'प्रेक्षण फीड्स',
    about: 'परिचय',
    teamName: 'टीम मरीन-एक्स',
    teamSub: 'भारतीय अंतरिक्ष अनुसंधान संगठन (इसरो) द्वारा समर्थित',
    archDetails: 'आर्किटेक्चर विवरण',
    view: 'देखें',
    surveillanceGridActive: 'निगरानी ग्रिड सक्रिय',
    pipelineAnalyzing: 'एजेंट विश्लेषण जारी',
    activeSector: 'सक्रिय क्षेत्र',
    fallbackQueryTitle: 'समुद्री परामर्श प्रश्न',
    rejectionMsg: 'ORCA-X इस तटीय क्षेत्र में पर्याप्त विश्वसनीयता के साथ सहसंबंध स्थापित नहीं कर सका। कृपया एक तटीय क्षेत्र (जैसे पारादीप, कोच्चि, विशाखापत्तनम), समय और संचालन निर्दिष्ट करें।'
  }
};

export function getUIText(lang: Language) {
  return UI_STRINGS[lang] || UI_STRINGS.en;
}
