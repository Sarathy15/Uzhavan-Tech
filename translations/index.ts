export const translations = {
  en: {
    nav: {
      home: 'Home',
      detect: 'Disease Detection',
      weather: 'Weather',
      chatbot: 'Ask Uzhavan',
      dashboard: 'Analytics'
    },
    home: {
      title: 'Welcome to Uzhavan Tech',
      subtitle: 'Your AI-powered partner in modern farming. Instantly detect crop diseases, get expert advice, and stay ahead with smart analytics.',
      detectButton: 'Start Disease Detection',
      weatherButton: 'Check Weather Risks',
      chatButton: 'Ask Farming Questions',
      analyticsButton: 'View Analytics',
      feature1: {
        title: 'Instant Diagnosis',
        description: 'Upload a photo of a crop leaf and let our AI identify diseases with high accuracy in seconds.'
      },
      feature2: {
        title: 'Multilingual Advice',
        description: 'Receive clear treatment plans and preventive measures in English, Tamil, Hindi, or Telugu.'
      },
      feature3: {
        title: 'Actionable Insights',
        description: 'Use our weather dashboard and analytics to make informed decisions and minimize risks.'
      }
    },
    detect: {
      title: 'Crop Disease Detection',
      uploadPrompt: 'Upload an image of a crop leaf to get an instant AI diagnosis',
      analyzing: 'AI analysis is in progress. Please wait...',
      diagnosed: 'AI diagnosis complete. See the results below.',
      uploadButton: 'Upload Image',
      diagnoseButton: 'Diagnose Crop',
      selectLanguage: 'Select Language',
      imagePreview: 'Image Preview',
      error: {
        noImage: 'Please select an image first.',
        analysisError: 'Failed to analyze the image. The model may be unable to process this request. Please try another image.'
      },
      confidence: 'Confidence',
      treatment: 'Treatment Plan',
      prevention: 'Preventive Measures',
      result: {
        title: 'Diagnosis Result',
        listenButton: 'Listen to Advice',
        stopListening: 'Stop Listening',
        saveButton: 'Save Diagnosis',
        saving: 'Saving...',
        saved: 'Saved Successfully!',
        saveError: 'Failed to save diagnosis. Please try again.',
        speakError: 'Sorry, your browser does not support text-to-speech.',
        analyzeAnother: 'Analyze Another Image',
        confidenceLabel: 'Confidence:'
      }
    },
      weather: {
      title: 'Weather & Disease Risk',
      getLocation: 'Get weather forecast',
      locating: 'Detecting location...',
      humidity: 'Humidity',
      precipitation: 'Rain Chance',
      riskTitle: 'Risk Assessment',
      today: 'Today',
      tomorrow: 'Tomorrow',
      locationPrompt: 'Click "Get weather forecast" to fetch real-time weather for your location',
      locationDetected: 'Weather forecast for {location}',
      loading: 'Generating AI Risk Assessment...',
      error: 'Could not fetch forecast for your location.',
      permissionDenied: 'Location permission denied. Please enable location access in your browser settings.',
      timeout: 'Location request timed out. Please try again.',
      locationError: 'Could not get your location. Please try again.'
    },
    chatbot: {
      title: 'Ask Uzhavan Bot',
      clearChat: 'Clear Chat',
      placeholder: 'Type your farming question...',
      send: 'Send',
      thinking: 'Thinking...',
      error: 'Sorry, I encountered an error. Please try again.'
    },
    analytics: {
      title: 'Farm Analytics',
      diseases: 'Common Diseases',
      crops: 'Crop Distribution',
      noData: 'No data available',
      detectionCount: 'Detection Count'
    }
  },
  ta: {
    nav: {
      home: 'முகப்பு',
      detect: 'நோய் கண்டறிதல்',
      weather: 'வானிலை',
      chatbot: 'உழவனிடம் கேளுங்கள்',
      dashboard: 'புள்ளிவிவரங்கள்'
    },
    home: {
      title: 'உழவன் டெக்கிற்கு வரவேற்கிறோம்',
      subtitle: 'நவீன விவசாயத்தில் உங்கள் செயற்கை நுண்ணறிவு கூட்டாளி. உடனடியாக பயிர் நோய்களைக் கண்டறியவும், நிபுணர் ஆலோசனை பெறவும், புத்திசாலித்தனமான பகுப்பாய்வுகளுடன் முன்னேறவும்.',
      detectButton: 'நோய் கண்டறிதலைத் தொடங்கு',
      weatherButton: 'வானிலை ஆபத்துகளை சரிபார்க்க',
      chatButton: 'விவசாய கேள்விகளை கேளுங்கள்',
      analyticsButton: 'புள்ளிவிவரங்களைக் காண',
      feature1: {
        title: 'உடனடி நோய் கண்டறிதல்',
        description: 'பயிர் இலையின் படத்தை பதிவேற்றவும், நமது AI நொடிகளில் உயர் துல்லியத்துடன் நோய்களை கண்டறியும்.'
      },
      feature2: {
        title: 'பல மொழி ஆலோசனை',
        description: 'ஆங்கிலம், தமிழ், இந்தி அல்லது தெலுங்கில் தெளிவான சிகிச்சை திட்டங்கள் மற்றும் தடுப்பு நடவடிக்கைகளைப் பெறுங்கள்.'
      },
      feature3: {
        title: 'செயல்படுத்தக்கூடிய நுண்ணறிவுகள்',
        description: 'தெளிவான முடிவுகளை எடுக்கவும், ஆபத்துகளைக் குறைக்கவும் எங்கள் வானிலை டாஷ்போர்டு மற்றும் பகுப்பாய்வுகளைப் பயன்படுத்தவும்.'
      }
    },
    detect: {
      title: 'பயிர் நோய் கண்டறிதல்',
      uploadPrompt: 'உடனடி AI நோய் கண்டறிதலுக்கு பயிர் இலையின் படத்தை பதிவேற்றவும்',
      analyzing: 'AI பகுப்பாய்வு நடைபெறுகிறது. தயவுசெய்து காத்திருக்கவும்...',
      diagnosed: 'AI நோய் கண்டறிதல் முடிந்தது. கீழே முடிவுகளைக் காணலாம்.',
      uploadButton: 'படம் பதிவேற்று',
      diagnoseButton: 'நோயை கண்டறி',
      selectLanguage: 'மொழியை தேர்ந்தெடுக்கவும்',
      imagePreview: 'பட முன்னோட்டம்',
      error: {
        noImage: 'முதலில் ஒரு படத்தை தேர்ந்தெடுக்கவும்.',
        analysisError: 'படத்தை பகுப்பாய்வு செய்ய முடியவில்லை. மாதிரியால் இந்த கோரிக்கையை செயலாக்க முடியாமல் போகலாம். மற்றொரு படத்தை முயற்சிக்கவும்.'
      },
      confidence: 'நம்பகத்தன்மை',
      treatment: 'சிகிச்சை திட்டம்',
      prevention: 'தடுப்பு நடவடிக்கைகள்'
    ,
      result: {
        title: 'மலினவு முடிவு',
        listenButton: 'ஆலோசனையை கேளுங்கள்',
        stopListening: 'கேட்கச்சேகரத்தை நிறுத்து',
        saveButton: 'நோயிற்றை சேமி',
        saving: 'சேமிக்கப்படுகிறது...',
        saved: 'வெற்றிகரமாக சேமிக்கப்பட்டது!',
        saveError: 'நோயிற்றை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
        speakError: 'மன்னிக்கவும், உங்கள் உலாவி உரை-இலக்கு ஆதரிக்காது.',
        analyzeAnother: 'மறு பகுப்பாய்வு',
        confidenceLabel: 'நம்பகத்தன்மை:'
      }
    },
      weather: {
      title: 'வானிலை & நோய் ஆபத்து',
      getLocation: 'வானிலை அறிக்கையைப் பெறுக',
      locating: 'இருப்பிடம் கண்டறியப்படுகிறது...',
      humidity: 'ஈரப்பதம்',
      precipitation: 'மழை வாய்ப்பு',
      riskTitle: 'ஆபத்து மதிப்பீடு',
      today: 'இன்று',
      tomorrow: 'நாளை',
      locationPrompt: 'உங்கள் இருப்பிடத்திற்கான நேரடி வானிலையைப் பெற "வானிலை அறிக்கையைப் பெறுக" என்பதைக் கிளிக் செய்யவும்',
      locationDetected: '{location}க்கான வானிலை முன்னறிவிப்பு',
      loading: 'செயற்கை நுண்ணறிவு ஆபத்து மதிப்பீடு உருவாக்கப்படுகிறது...',
      error: 'உங்கள் இருப்பிடத்திற்கான முன்னறிவிப்பைப் பெற முடியவில்லை.',
      permissionDenied: 'இருப்பிட அனுமதி மறுக்கப்பட்டது. உங்கள் உலாவி அமைப்புகளில் இருப்பிட அணுகலை இயக்கவும்.',
      timeout: 'இருப்பிட கோரிக்கை நேரம் முடிந்தது. மீண்டும் முயற்சிக்கவும்.',
      locationError: 'உங்கள் இருப்பிடத்தைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
    },
    chatbot: {
      title: 'உழவன் போட்டிடம் கேளுங்கள்',
      clearChat: 'அரட்டையை அழி',
      placeholder: 'உங்கள் விவசாய கேள்வியை தட்டச்சு செய்யவும்...',
      send: 'அனுப்பு',
      thinking: 'சிந்திக்கிறது...',
      error: 'மன்னிக்கவும், ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
    },
    analytics: {
      title: 'பண்ணை புள்ளிவிவரங்கள்',
      diseases: 'பொதுவான நோய்கள்',
      crops: 'பயிர் விநியோகம்',
      noData: 'தரவு எதுவும் இல்லை',
      detectionCount: 'கண்டறிதல் எண்ணிக்கை'
    }
  },
  hi: {
    nav: {
      home: 'होम',
      detect: 'रोग पहचान',
      weather: 'मौसम',
      chatbot: 'उज़वन से पूछें',
      dashboard: 'विश्लेषण'
    },
    home: {
      title: 'उज़वन टेक में आपका स्वागत है',
      subtitle: 'आधुनिक कृषि में आपका एआई-संचालित साथी। तुरंत फसल रोगों का पता लगाएं, विशेषज्ञ सलाह प्राप्त करें, और स्मार्ट विश्लेषण के साथ आगे बढ़ें।',
      detectButton: 'रोग पहचान शुरू करें',
      weatherButton: 'मौसम जोखिम जांचें',
      chatButton: 'कृषि प्रश्न पूछें',
      analyticsButton: 'विश्लेषण देखें',
      feature1: {
        title: 'तत्काल निदान',
        description: 'फसल की पत्ती की एक तस्वीर अपलोड करें और हमारा एआई सेकंड में उच्च सटीकता के साथ रोगों की पहचान करेगा।'
      },
      feature2: {
        title: 'बहुभाषी सलाह',
        description: 'अंग्रेजी, तमिल, हिंदी या तेलुगु में स्पष्ट उपचार योजनाएं और निवारक उपाय प्राप्त करें।'
      },
      feature3: {
        title: 'क्रियात्मक अंतर्दृष्टि',
        description: 'सूचित निर्णय लेने और जोखिमों को कम करने के लिए हमारे मौसम डैशबोर्ड और विश्लेषण का उपयोग करें।'
      }
    },
    detect: {
      title: 'फसल रोग पहचान',
      uploadPrompt: 'तत्काल एआई निदान के लिए फसल की पत्ती की छवि अपलोड करें',
      analyzing: 'एआई विश्लेषण प्रगति पर है। कृपया प्रतीक्षा करें...',
      diagnosed: 'एआई निदान पूरा हुआ। नीचे परिणाम देखें।',
      uploadButton: 'छवि अपलोड करें',
      diagnoseButton: 'रोग का निदान करें',
      selectLanguage: 'भाषा चुनें',
      imagePreview: 'छवि पूर्वावलोकन',
      error: {
        noImage: 'कृपया पहले एक छवि चुनें।',
        analysisError: 'छवि का विश्लेषण करने में विफल। मॉडल इस अनुरोध को संसाधित करने में असमर्थ हो सकता है। कृपया दूसरी छवि का प्रयास करें।'
      },
      confidence: 'विश्वास स्तर',
      treatment: 'उपचार योजना',
      prevention: 'निवारक उपाय'
    ,
      result: {
        title: 'निदान परिणाम',
        listenButton: 'सलाह सुनें',
        stopListening: 'सुनना बंद करें',
        saveButton: 'निदान सहेजें',
        saving: 'सहेजा जा रहा है...',
        saved: 'सफलतापूर्वक सहेजा गया!',
        saveError: 'निदान सहेजने में विफल। कृपया पुनः प्रयास करें।',
        speakError: 'क्षमा करें, आपका ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता।',
        analyzeAnother: 'एक और छवि विश्लेषण करें',
        confidenceLabel: 'विश्वास स्तर:'
      }
    },
      weather: {
      title: 'मौसम और रोग जोखिम',
      getLocation: 'मौसम पूर्वानुमान प्राप्त करें',
      locating: 'स्थान का पता लगा रहा है...',
      humidity: 'नमी',
      precipitation: 'बारिश की संभावना',
      riskTitle: 'जोखिम मूल्यांकन',
      today: 'आज',
      tomorrow: 'कल',
      locationPrompt: 'वास्तविक समय के मौसम के लिए "मौसम पूर्वानुमान प्राप्त करें" पर क्लिक करें',
      locationDetected: '{location} के लिए मौसम पूर्वानुमान',
      loading: 'एआई जोखिम मूल्यांकन तैयार किया जा रहा है...',
      error: 'आपके स्थान के लिए पूर्वानुमान प्राप्त नहीं कर सका।',
      permissionDenied: 'स्थान की अनुमति नहीं मिली। कृपया अपने ब्राउज़र सेटिंग्स में स्थान पहुंच सक्षम करें।',
      timeout: 'स्थान अनुरोध समय समाप्त। कृपया पुनः प्रयास करें।',
      locationError: 'आपका स्थान प्राप्त नहीं कर सका। कृपया पुनः प्रयास करें।'
    },
    chatbot: {
      title: 'उज़वन बॉट से पूछें',
      clearChat: 'चैट साफ करें',
      placeholder: 'अपना कृषि प्रश्न टाइप करें...',
      send: 'भेजें',
      thinking: 'सोच रहा है...',
      error: 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।'
    },
    analytics: {
      title: 'कृषि विश्लेषण',
      diseases: 'सामान्य रोग',
      crops: 'फसल वितरण',
      noData: 'कोई डेटा उपलब्ध नहीं है',
      detectionCount: 'पहचान संख्या'
    }
  }
};