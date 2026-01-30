import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Button from './components/Button';
import { UserProfile, ViewState, STORAGE_KEYS, ReflectionEntry, LanguageCode } from './types';
import { generateFutureSelfLetter, generateDailyPrompt } from './services/geminiService';
import { LANGUAGES, t, isRTL } from './utils/translations';
import { Sparkles, ArrowRight, Anchor, Heart, Shield, Sun, Cloud, Feather, BookOpen, User, HelpCircle, Globe } from 'lucide-react';

// --- Components ---

const LanguageSelector: React.FC<{ 
  current: LanguageCode; 
  onSelect: (lang: LanguageCode) => void; 
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}> = ({ current, onSelect, isOpen, setIsOpen }) => {
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm transition-all text-warm-700 border border-white/40 shadow-sm"
      >
        <Globe size={16} />
        <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === current)?.nativeLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-warm-100 p-2 z-50 grid grid-cols-1 gap-1 max-h-80 overflow-y-auto animate-fade-in-up">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onSelect(lang.code); setIsOpen(false); }}
              className={`text-left px-4 py-3 rounded-xl transition-colors text-sm flex justify-between items-center ${
                current === lang.code 
                  ? 'bg-lavender-100 text-warm-900 font-medium' 
                  : 'hover:bg-warm-50 text-warm-600'
              }`}
            >
              <span>{lang.nativeLabel}</span>
              <span className="text-xs text-warm-400">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 1. Landing View
const LandingView: React.FC<{ onStart: () => void; lang: LanguageCode }> = ({ onStart, lang }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-4xl mx-auto animate-fade-in" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
    {/* Hero */}
    <div className="text-center space-y-8 mt-10 mb-20 relative">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-lavender-200/20 rounded-full blur-[80px] pointer-events-none"></div>
      
      <h1 className="text-4xl md:text-6xl font-serif text-warm-900 leading-tight relative z-10">
        {t(lang, 'hero_title')}<br />
        <span className="text-lavender-600 italic">{t(lang, 'hero_subtitle')}</span>
      </h1>
      <p className="text-warm-600 text-lg md:text-xl max-w-lg mx-auto leading-relaxed relative z-10">
        {t(lang, 'hero_text')}
      </p>
      <div className="w-full max-w-xs mx-auto pt-4 relative z-10">
        <Button onClick={onStart}>
          {t(lang, 'cta_start')}
        </Button>
      </div>
    </div>

    {/* Validation Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20 relative z-10">
      {[
        { icon: Cloud, text: t(lang, 'card_loud'), color: "text-misty-500", bg: "bg-misty-50/50" },
        { icon: Shield, text: t(lang, 'card_doubt'), color: "text-lavender-600", bg: "bg-lavender-50/50" },
        { icon: Sun, text: t(lang, 'card_courage'), color: "text-peach-500", bg: "bg-peach-50/50" },
      ].map((card, i) => (
        <div key={i} className={`p-8 rounded-3xl ${card.bg} backdrop-blur-sm border border-white/40 flex flex-col items-center text-center space-y-4 hover:transform hover:-translate-y-2 transition-all duration-700 hover:bg-white/40 hover:shadow-lg hover:shadow-lavender-100/50`}>
          <card.icon className={`${card.color} w-8 h-8 opacity-80`} strokeWidth={1.5} />
          <p className="text-warm-700 font-medium">{card.text}</p>
        </div>
      ))}
    </div>

    {/* How it Works */}
    <div className="w-full max-w-2xl text-center space-y-12 mb-20 relative z-10">
      <h2 className="text-2xl font-serif text-warm-900">A Quiet Ritual</h2>
      <div className="space-y-8 text-left" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
        {[
          { step: "01", desc: t(lang, 'step_1') },
          { step: "02", desc: t(lang, 'step_2') },
          { step: "03", desc: t(lang, 'step_3') }
        ].map((item) => (
          <div key={item.step} className="flex gap-6 items-center group p-4 rounded-2xl hover:bg-white/30 transition-colors duration-500">
            <span className="text-lavender-400 font-serif text-3xl opacity-50 group-hover:opacity-100 transition-opacity">{item.step}</span>
            <div>
              <p className="text-xl font-medium text-warm-800">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <footer className="w-full py-8 text-center border-t border-warm-200/30 mt-auto relative z-10">
      <p className="text-warm-500 font-medium text-sm tracking-wide opacity-70 hover:opacity-100 transition-opacity">{t(lang, 'footer_copyright')}</p>
    </footer>
  </div>
);

// 2. Auth View
const AuthView: React.FC<{ onAuth: (name: string, email: string) => void; lang: LanguageCode }> = ({ onAuth, lang }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif text-warm-900">{t(lang, 'auth_title')}</h2>
          <p className="text-warm-500">{t(lang, 'auth_subtitle')}</p>
        </div>
        
        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm font-medium text-warm-500 mb-2 ml-1 transition-colors group-focus-within:text-lavender-600">{t(lang, 'input_name')}</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/50 border border-warm-100 focus:outline-none focus:ring-2 focus:ring-lavender-200 focus:bg-white transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(233,213,255,0.2)]"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-warm-500 mb-2 ml-1 transition-colors group-focus-within:text-lavender-600">{t(lang, 'input_email')}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/50 border border-warm-100 focus:outline-none focus:ring-2 focus:ring-lavender-200 focus:bg-white transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(233,213,255,0.2)]"
            />
          </div>
        </div>

        <Button onClick={() => onAuth(name, email)} disabled={!name || !email}>
          {t(lang, 'cta_start')}
        </Button>
      </div>
    </div>
  );
};

// 3. Setup View
interface SetupProps {
  onComplete: (description: string, time: string, focus: string) => void;
  lang: LanguageCode;
}
const SetupView: React.FC<SetupProps> = ({ onComplete, lang }) => {
  const [step, setStep] = useState(1);
  const [timeHorizon, setTimeHorizon] = useState('');
  const [description, setDescription] = useState('');

  const next = () => setStep(s => s + 1);
  const dir = isRTL(lang) ? 'rtl' : 'ltr';

  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in max-w-2xl mx-auto text-center" dir={dir}>
        <h2 className="text-3xl font-serif text-warm-900 mb-12">{t(lang, 'setup_time_title')}</h2>
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          {['6 months', '1 year', '5 years'].map((opt) => (
            <button
              key={opt}
              onClick={() => { setTimeHorizon(opt); next(); }}
              className="p-6 rounded-2xl bg-white/40 hover:bg-white/80 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 text-lg text-warm-700 font-medium transform hover:-translate-y-1"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in max-w-2xl mx-auto" dir={dir}>
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif text-warm-900">{t(lang, 'setup_desc_title')}</h2>
            <p className="text-warm-500">{t(lang, 'setup_desc_subtitle')}</p>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t(lang, 'setup_desc_placeholder')}
            rows={5}
            className="w-full p-6 rounded-2xl bg-white/60 border border-white/50 focus:outline-none focus:ring-2 focus:ring-peach-200 focus:bg-white text-xl leading-relaxed text-warm-800 placeholder:text-warm-300 shadow-sm resize-none transition-all duration-500 focus:shadow-[0_0_30px_-5px_rgba(255,166,124,0.2)]"
            autoFocus
          />
           <div className="flex justify-end">
            <div className="w-32">
              <Button onClick={next} disabled={description.length < 5}>Next</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in max-w-2xl mx-auto text-center" dir={dir}>
        <h2 className="text-3xl font-serif text-warm-900 mb-12">{t(lang, 'setup_focus_title')}</h2>
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
          {['Reassurance', 'Courage', 'Perspective', 'Calm', 'Strength'].map((opt) => (
            <button
              key={opt}
              onClick={() => onComplete(description, timeHorizon, opt)}
              className="px-8 py-4 rounded-full bg-white/40 hover:bg-white/80 border border-white/50 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg text-warm-700"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

// 4. Generating View
const GeneratingView: React.FC<{ lang: LanguageCode }> = ({ lang }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in text-center" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
    <div className="mb-8 relative">
      <div className="w-40 h-40 bg-lavender-200/30 rounded-full animate-scale-pulse blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <Sparkles className="w-12 h-12 text-warm-400 relative z-10 animate-spin-slow opacity-80" strokeWidth={1} />
    </div>
    <h2 className="text-2xl font-serif text-warm-800 mb-2">{t(lang, 'generating_title')}</h2>
    <p className="text-warm-500 animate-pulse-slow">{t(lang, 'generating_subtitle')}</p>
  </div>
);

// 5. Letter View
const LetterView: React.FC<{ letter: string; onContinue: () => void; lang: LanguageCode }> = ({ letter, onContinue, lang }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 animate-fade-in-up" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
    <div className="w-full max-w-2xl relative z-10">
      <div className="bg-[#fcfbf9]/90 backdrop-blur-sm p-8 md:p-16 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-200/50 via-warm-200/50 to-amber-200/50 opacity-60"></div>
        
        {/* Soft light leak effect inside card */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-100/20 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="mb-8 flex items-center justify-center gap-2 text-warm-400">
          <Feather size={16} />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase">{t(lang, 'letter_from')}</span>
        </div>

        <div className="prose prose-lg prose-warm mx-auto font-serif text-warm-800 leading-loose relative z-10">
          <p className="whitespace-pre-line">{letter}</p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="w-16 h-1 bg-warm-100 rounded-full opacity-50"></div>
        </div>
      </div>

      <div className="mt-10 text-center space-y-4">
        <div className="w-full max-w-xs mx-auto">
          <Button onClick={onContinue} variant="primary">
            {t(lang, 'letter_continue')}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// 6. Reflection View
const ReflectionView: React.FC<{ 
  prompt: string; 
  onSave: (response: string) => void;
  user: UserProfile;
  lang: LanguageCode;
}> = ({ prompt, onSave, user, lang }) => {
  const [response, setResponse] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(response);
    setIsSaved(true);
  };

  if (isSaved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in text-center" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
        <div className="p-8 bg-white/40 rounded-full text-green-600 mb-8 shadow-sm backdrop-blur-sm relative">
          <div className="absolute inset-0 bg-green-100/30 rounded-full animate-ripple rounded-full"></div>
          <Heart size={40} strokeWidth={1.5} fill="currentColor" className="opacity-20 relative z-10" />
        </div>
        <h2 className="text-3xl font-serif text-warm-900 mb-4">{t(lang, 'reflection_title')}</h2>
        <p className="text-warm-600 max-w-md mx-auto leading-relaxed">
          {t(lang, 'reflection_subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in max-w-xl mx-auto" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
       <div className="text-center mb-10 space-y-2 relative z-10">
         <h2 className="text-2xl font-serif text-warm-800">{prompt}</h2>
       </div>

       <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="..."
          rows={4}
          className="w-full p-6 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-2 focus:ring-lavender-200 text-lg text-warm-700 placeholder:text-warm-300 shadow-sm resize-none mb-8 transition-all duration-700 focus:shadow-[0_0_40px_-10px_rgba(167,139,250,0.2)] focus:bg-white/60"
        />

        <div className="relative z-10">
          <Button onClick={handleSave} disabled={!response.trim()}>
            {t(lang, 'letter_continue')}
          </Button>
        </div>
    </div>
  );
};

// --- Main App Logic ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Load state on mount
  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE_PREF) as LanguageCode;
    if (savedLang) setLanguage(savedLang);

    const savedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (savedProfile) {
      const parsedUser = JSON.parse(savedProfile);
      setUser(parsedUser);
      // Ensure UI matches user's saved language preference if logged in
      if (parsedUser.language) {
        setLanguage(parsedUser.language);
      }
    }
  }, []);

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE_PREF, lang);
    if (user) {
      const updated = { ...user, language: lang };
      setUser(updated);
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    }
  };

  const handleStart = () => {
    if (user && user.hasCompletedSetup) {
      generateContent(user);
    } else {
      setView('AUTH');
    }
  };

  const handleAuth = (name: string, email: string) => {
    const newUser: UserProfile = {
      name,
      email,
      futureDescription: '',
      timeHorizon: '',
      emotionalFocus: '',
      language: language,
      hasCompletedSetup: false
    };
    setUser(newUser);
    setView('SETUP');
  };

  const handleSetupComplete = (desc: string, time: string, focus: string) => {
    if (!user) return;
    const updatedUser = { 
      ...user, 
      futureDescription: desc, 
      timeHorizon: time, 
      emotionalFocus: focus,
      language: language,
      hasCompletedSetup: true 
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedUser));
    generateContent(updatedUser);
  };

  const generateContent = async (profile: UserProfile) => {
    setView('GENERATING');
    try {
      const [genLetter, genPrompt] = await Promise.all([
        generateFutureSelfLetter(profile),
        generateDailyPrompt(profile)
      ]);
      
      setLetter(genLetter);
      setPrompt(genPrompt);
      localStorage.setItem(STORAGE_KEYS.LAST_LETTER, genLetter);
      setView('LETTER');
    } catch (e) {
      console.error(e);
      setLetter(language === 'ta' ? "நான் இங்கே இருக்கிறேன்." : "I am here.");
      setPrompt(language === 'ta' ? "உங்களை நீங்களே எப்படி கவனித்துக் கொள்வீர்கள்?" : "How can you be kind to yourself?");
      setView('LETTER');
    }
  };

  const saveReflection = (response: string) => {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.REFLECTION_HISTORY) || '[]');
    history.push({ 
      id: Date.now().toString(), 
      date: new Date().toISOString(), 
      prompt: prompt, 
      response 
    });
    localStorage.setItem(STORAGE_KEYS.REFLECTION_HISTORY, JSON.stringify(history));
  };

  // Header
  const Header = () => (
    <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50" dir="ltr">
      <div 
        className="font-serif font-bold text-warm-800 cursor-pointer flex items-center gap-2"
        onClick={() => setView('LANDING')}
      >
        <Sparkles size={18} className="text-lavender-500" />
        <span className="hidden sm:inline">Future You</span>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSelector 
          current={language} 
          onSelect={changeLanguage} 
          isOpen={isLangMenuOpen}
          setIsOpen={setIsLangMenuOpen}
        />
      </div>
    </header>
  );

  return (
    <Layout>
      <Header />
      
      {view === 'LANDING' && <LandingView onStart={handleStart} lang={language} />}
      
      {view === 'AUTH' && <AuthView onAuth={handleAuth} lang={language} />}
      
      {view === 'SETUP' && <SetupView onComplete={handleSetupComplete} lang={language} />}
      
      {view === 'GENERATING' && <GeneratingView lang={language} />}
      
      {view === 'LETTER' && letter && (
        <LetterView letter={letter} onContinue={() => setView('REFLECTION')} lang={language} />
      )}
      
      {view === 'REFLECTION' && prompt && user && (
        <ReflectionView prompt={prompt} onSave={saveReflection} user={user} lang={language} />
      )}
      
    </Layout>
  );
};

export default App;