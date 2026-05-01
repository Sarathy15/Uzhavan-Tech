import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const examplePrompts = {
  en: [
    "How to treat tomato leaf blight?",
    "What are signs of nitrogen deficiency?",
    "Best organic pesticides for aphids?",
  ],
  ta: [
    "தக்காளி இலை கருகல் நோயை எவ்வாறு சிகிச்சை செய்வது?",
    "நைட்ரஜன் குறைபாட்டின் அறிகுறிகள் என்ன?",
    "பூச்சிகளுக்கு சிறந்த இயற்கை பூச்சிக்கொல்லிகள் என்ன?",
  ],
  hi: [
    "टमाटर की पत्ती झुलसने का इलाज कैसे करें?",
    "नाइट्रोजन की कमी के क्या लक्षण हैं?",
    "एफिड्स के लिए सर्वश्रेष्ठ जैविक कीटनाशक क्या हैं?",
  ]
} as const;

const Chatbot: React.FC = () => {
  const { t, language } = useTranslation();
  
  const initialMessage: ChatMessage = { 
    role: 'model', 
    text: language === 'ta' 
      ? 'வணக்கம்! நான் உழவன் போட். உங்கள் விவசாய கேள்விகளுக்கு எவ்வாறு உதவ முடியும்?'
      : language === 'hi'
      ? 'नमस्ते! मैं उज़वन बॉट हूं। आज मैं आपकी कृषि संबंधी प्रश्नों में कैसे मदद कर सकता हूं?'
      : 'Hello! I am Uzhavan Bot. How can I help you with your farming questions today?'
  };
  
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isSupported, isListening, error: speechError, result, start, stop } = useSpeechRecognition();
  const lastFinalRef = useRef('');
  const preListeningInputRef = useRef('');

  useEffect(() => {
    // Reset chat when language changes
    setMessages([initialMessage]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keep input updated with speech recognition interim/final results
  useEffect(() => {
    if (!isListening) return;
    const interim = result.interim || '';
    const final = result.final || '';

    // If final changed since last time, compute delta and update
    if (final !== lastFinalRef.current) {
      const newFinal = final;
      lastFinalRef.current = newFinal;
      const base = preListeningInputRef.current || '';
      setInput((base + (base && newFinal ? ' ' : '') + newFinal + (interim ? ' ' + interim : '')).trimStart());
    } else {
      // only interim changed
      const base = preListeningInputRef.current || '';
      setInput((base + (base && interim ? ' ' : '') + interim).trimStart());
    }
  }, [result, isListening]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));
      const responseText = await getChatbotResponse(history, input);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = { 
        role: 'model', 
        text: t('chatbot.error') 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([initialMessage]);
  };

  const handleExamplePrompt = (prompt: string) => {
    setInput(prompt);
  };

  // Get example prompts based on current language
  const currentPrompts = examplePrompts[language as keyof typeof examplePrompts];

  // Language mapping for SpeechRecognition
  const speechLangMap: Record<string, string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
  };

  const [speechLocale, setSpeechLocale] = useState<string>(speechLangMap[language] || 'en-IN');

  // keep speechLocale in sync when app language changes
  useEffect(() => {
    setSpeechLocale(speechLangMap[language] || 'en-IN');
  }, [language]);

  const handleMicToggle = async () => {
    if (!isSupported) return;
    if (isListening) {
      stop();
      return;
    }

    // Prepare to capture speech: remember current input so interim text is appended to it
    preListeningInputRef.current = input;
    lastFinalRef.current = '';

    const speechLang = speechLocale || (speechLangMap[language] || 'en-IN');
    try {
      start(speechLang);
    } catch (err) {
      console.error('Speech start error', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-2xl mx-auto flex flex-col h-[80vh]">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-green-dark">{t('chatbot.title')}</h2>
        <button onClick={handleClear} className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
          {t('chatbot.clearChat')}
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-green-50">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2">
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatbot.placeholder')}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            disabled={isLoading}
          />
          {/* Speech locale selector */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={speechLocale}
              onChange={(e) => setSpeechLocale(e.target.value)}
              className="text-sm border rounded-full px-3 py-2 bg-white"
              aria-label="Speech recognition language"
              disabled={isLoading}
            >
              <option value="en-IN">English (India)</option>
              <option value="en-US">English (US)</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
            </select>
          </div>

          {/* Microphone button */}
          <button
            onClick={handleMicToggle}
            disabled={!isSupported || isLoading}
            aria-pressed={isListening}
            title={isListening ? 'Stop recording' : 'Start voice input'}
            className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            {/* Mic icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"></path><path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11z"></path></svg>
          </button>

          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="bg-brand-green text-white p-3 rounded-full hover:bg-brand-green-dark disabled:bg-gray-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
        { !isSupported && (
          <p className="text-xs text-gray-500 mt-2">Microphone not supported in this browser — please type your question.</p>
        )}
        { speechError && (
          <p className="text-xs text-red-600 mt-2">Microphone error: {String(speechError)} — please check microphone permissions or type instead.</p>
        )}
        { isSupported && (
          <p className="text-xs text-gray-500 mt-2">Tip: If recognition is poor for your language, try switching the speech locale above (e.g., choose regional variant like en-US, hi-IN, ta-IN).</p>
        )}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {currentPrompts.map(prompt => (
                <button 
                    key={prompt} 
                    onClick={() => handleExamplePrompt(prompt)} 
                    className="px-3 py-1 bg-green-100 text-brand-green-dark text-sm rounded-full hover:bg-green-200 transition-colors"
                    disabled={isLoading}
                >
                    {prompt}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;