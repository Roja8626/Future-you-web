import React, { useState, useEffect } from 'react';
import './index.css';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Button from './components/Button';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ProtectedRoute from './components/ProtectedRoute';
import { ViewState, STORAGE_KEYS, ReflectionEntry, LanguageCode } from './types';
import { generateFutureSelfLetter, generateDailyPrompt } from './services/geminiService';
import { LANGUAGES, t, isRTL } from './utils/translations';
import { Sparkles, Heart, Shield, Sun, Cloud, Feather, Globe } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './services/firebase';

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
              className={`text-left px-4 py-3 rounded-xl transition-colors text-sm flex justify-between items-center ${current === lang.code
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
const GeneratingView: React.FC<{ lang: LanguageCode; onComplete: () => void }> = ({ lang, onComplete }) => {
  // Simulate generation or wait for parent logic? 
  // Parent component 'App' handles the logic in useEffect usually?
  // Here we just show the view. 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in text-center" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <div className="mb-8 relative">
        <div className="w-40 h-40 bg-lavender-200/30 rounded-full animate-scale-pulse blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <Sparkles className="w-12 h-12 text-warm-400 relative z-10 animate-spin-slow opacity-80" strokeWidth={1} />
      </div>
      <h2 className="text-2xl font-serif text-warm-800 mb-2">{t(lang, 'generating_title')}</h2>
      <p className="text-warm-500 animate-pulse-slow">{t(lang, 'generating_subtitle')}</p>
    </div>
  );
};

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
  lang: LanguageCode;
}> = ({ prompt, onSave, lang }) => {
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
  const { user, userProfile, loading, logout } = useAuth();
  const [letter, setLetter] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load state on mount
  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE_PREF) as LanguageCode;
    if (savedLang) setLanguage(savedLang);

    // Load last letter from storage
    const savedLetter = localStorage.getItem(STORAGE_KEYS.LAST_LETTER);
    if (savedLetter) setLetter(savedLetter);
  }, []);

  // Sync user language
  useEffect(() => {
    if (userProfile?.language) {
      setLanguage(userProfile.language);
    }
  }, [userProfile]);

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE_PREF, lang);
  };

  const handleStart = () => {
    if (user) {
      if (!userProfile?.hasCompletedSetup) {
        navigate('/setup');
      } else {
        navigate('/letter');
      }
    } else {
      navigate('/login');
    }
  };

  const handleSetupComplete = async (desc: string, time: string, focus: string) => {
    if (!user) return;

    // Update firestore
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        futureDescription: desc,
        timeHorizon: time,
        emotionalFocus: focus,
        hasCompletedSetup: true,
        language: language // Sync language preference
      });

      generateContent({ ...userProfile!, futureDescription: desc, timeHorizon: time, emotionalFocus: focus, language } as any);
      // Note: we might not have immediate profile update in context, so we pass constructed object
    } catch (e) {
      console.error("Error updating profile", e);
    }
  };

  const generateContent = async (profile: any) => {
    navigate('/generating');
    try {
      const [genLetter, genPrompt] = await Promise.all([
        generateFutureSelfLetter(profile),
        generateDailyPrompt(profile)
      ]);

      setLetter(genLetter);
      setPrompt(genPrompt);
      localStorage.setItem(STORAGE_KEYS.LAST_LETTER, genLetter);
      navigate('/letter');
    } catch (e) {
      console.error(e);
      setLetter(language === 'ta' ? "நான் இங்கே இருக்கிறேன்." : "I am here.");
      setPrompt(language === 'ta' ? "உங்களை நீங்களே எப்படி கவனித்துக் கொள்வீர்கள்?" : "How can you be kind to yourself?");
      navigate('/letter');
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
    <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none" dir="ltr">
      <div
        className="font-serif font-bold text-warm-800 cursor-pointer flex items-center gap-2 pointer-events-auto"
        onClick={() => navigate('/')}
      >
        <Sparkles size={18} className="text-lavender-500" />
        <span className="hidden sm:inline">Future You</span>
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        <LanguageSelector
          current={language}
          onSelect={changeLanguage}
          isOpen={isLangMenuOpen}
          setIsOpen={setIsLangMenuOpen}
        />

        {/* Auth Navigation */}
        {!loading && (
          user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-warm-600 hidden sm:inline">
                {userProfile?.name || user.email}
              </span>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="px-4 py-2 text-sm font-medium text-warm-600 hover:text-warm-800 bg-white/40 hover:bg-white/60 rounded-full backdrop-blur-sm transition-all border border-white/40"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-warm-600 hover:text-warm-800 bg-white/40 hover:bg-white/60 rounded-full backdrop-blur-sm transition-all border border-white/40"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-sm font-medium text-white bg-lavender-500 hover:bg-lavender-600 rounded-full transition-all shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )
        )}
      </div>
    </header>
  );

  return (
    <Layout>
      <Header />
      <Routes>
        <Route path="/" element={<LandingView onStart={handleStart} lang={language} />} />

        <Route path="/login" element={<LoginForm lang={language} />} />
        <Route path="/signup" element={<SignupForm lang={language} />} />

        <Route path="/setup" element={
          <ProtectedRoute>
            <SetupView onComplete={handleSetupComplete} lang={language} />
          </ProtectedRoute>
        } />

        <Route path="/generating" element={
          <ProtectedRoute>
            <GeneratingView lang={language} onComplete={() => navigate('/letter')} />
          </ProtectedRoute>
        } />

        <Route path="/letter" element={
          <ProtectedRoute>
            {letter ? (
              <LetterView letter={letter} onContinue={() => navigate('/reflection')} lang={language} />
            ) : (
              <Navigate to="/" replace />
            )}
          </ProtectedRoute>
        } />

        <Route path="/reflection" element={
          <ProtectedRoute>
            {prompt && userProfile ? (
              <ReflectionView prompt={prompt} onSave={saveReflection} user={userProfile} lang={language} />
            ) : (
              <Navigate to="/" replace />
            )}
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
};

export default App;