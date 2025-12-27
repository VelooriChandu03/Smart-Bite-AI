
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import AnalysisResult from './components/AnalysisResult';
import ChatView from './components/ChatView';
import { UserProfile, FoodAnalysis, AppLanguage } from './types';
import { analyzeFood } from './services/geminiService';
import { dbService } from './services/dbService';
import { translations } from './services/translations';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [manualFoodName, setManualFoodName] = useState('');
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const savedProfile = await dbService.getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
      }
      setTimeout(() => setIsInitializing(false), 2200);
    };
    initApp();
  }, []);

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    setIsSaving(true);
    const success = await dbService.saveProfile(newProfile);
    if (success) {
      setProfile(newProfile);
    }
    setIsSaving(false);
  };

  const handleLanguageChange = async (newLang: AppLanguage) => {
    if (!profile) return;
    const updatedProfile = { ...profile, language: newLang };
    setProfile(updatedProfile);
    await dbService.saveProfile(updatedProfile);
    setShowLangModal(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setIsLoading(true);
    setAnalysis(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await analyzeFood(profile, base64);
        setAnalysis(result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleManualSearch = async () => {
    if (!manualFoodName.trim() || !profile) return;
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeFood(profile, undefined, manualFoodName);
      setAnalysis(result);
      setManualFoodName('');
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const BrandLogo = ({ size = 56 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#10B981" stroke="#064E3B" strokeWidth="1.2"/>
      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 overflow-hidden text-center p-8">
        <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center animate-pulse mb-8 shadow-[0_25px_60px_rgba(16,185,129,0.2)] border border-emerald-50">
          <BrandLogo size={56} />
        </div>
        <h1 className="text-4xl font-[900] text-slate-950 tracking-tighter mb-2">SmartBite.</h1>
        <div className="w-16 h-1 bg-emerald-500 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!profile || isSaving) {
    return (
      <Layout showNav={false}>
        <Onboarding onComplete={handleOnboardingComplete} />
      </Layout>
    );
  }

  const t = translations[profile.language || 'en'];

  const languages: { code: AppLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="min-h-full">
        {activeTab === 'home' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-center pt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-emerald-50">
                  <BrandLogo size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-950 tracking-tighter">SmartBite.</h2>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[1.8rem] border border-slate-100 shadow-sm">
                <button 
                  onClick={() => setShowLangModal(true)}
                  className="w-11 h-11 bg-white rounded-[1.2rem] flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all active:scale-90 border border-transparent hover:border-emerald-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="w-11 h-11 bg-slate-950 rounded-[1.2rem] flex items-center justify-center text-white font-black text-[12px] active:scale-90 transition-all shadow-xl"
                >
                  {profile.name ? profile.name.charAt(0) : '?'}
                </button>
              </div>
            </header>

            <div className="pt-6">
               <h1 className="text-4xl font-[900] text-slate-950 tracking-[-0.03em] leading-tight">Hello, {profile.name ? profile.name.split(' ')[0] : 'User'}</h1>
               <p className="text-[13px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">Biological Status: <span className="text-emerald-500 font-black">Active</span></p>
            </div>

            <div className="relative overflow-hidden bg-slate-950 p-9 rounded-[3.5rem] text-white shadow-[0_30px_70px_rgba(15,23,42,0.3)]">
              <div className="relative z-10">
                <h2 className="text-[26px] font-black mb-1 tracking-tight">{t.scanTitle}</h2>
                <p className="text-slate-400 text-[12px] font-medium mb-10 leading-relaxed opacity-90">{t.scanDesc}</p>
                <div className="flex gap-5">
                  <label className="flex-1 cursor-pointer group">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    <div className="bg-emerald-600 group-active:scale-95 transition-all py-7 rounded-[2.2rem] flex flex-col items-center gap-2.5 shadow-[0_15px_30px_rgba(16,185,129,0.3)] border border-emerald-500/50">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t.snap}</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    <div className="bg-slate-900 group-active:scale-95 transition-all py-7 rounded-[2.2rem] flex flex-col items-center gap-2.5 border border-slate-800">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t.gallery}</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[110px] -mr-20 -mt-20"></div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  className="flex-1 px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2.5rem] outline-none transition-all text-[15px] font-bold shadow-sm"
                  value={manualFoodName}
                  onChange={e => setManualFoodName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
                />
                <button 
                  onClick={handleManualSearch}
                  className="w-18 h-18 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="bg-white p-14 rounded-[3.5rem] border border-slate-50 flex flex-col items-center text-center shadow-2xl animate-pulse">
                <div className="w-14 h-14 border-[4px] border-emerald-50 border-t-emerald-500 rounded-full animate-spin mb-6" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.35em]">Deciphering Bio-Signatures</p>
              </div>
            )}

            {analysis && (
              <div className="animate-spring-up pb-48">
                <AnalysisResult 
                  analysis={analysis} 
                  onClose={() => setAnalysis(null)} 
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && <ChatView profile={profile} />}

        {activeTab === 'profile' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-48">
            <h2 className="text-4xl font-[900] text-slate-950 tracking-tighter">{t.bioDossier}</h2>
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-10">
              <div className="flex items-center gap-7 pb-8 border-b border-slate-50">
                <div className="w-22 h-22 bg-slate-950 rounded-[2.2rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl">
                  {profile.name ? profile.name.charAt(0) : '?'}
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-950 leading-tight mb-3">{profile.name || 'Anonymous User'}</p>
                  <div className="flex gap-2.5">
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-[11px] font-black uppercase tracking-widest">{profile.bloodGroup}</span>
                    <span className="px-4 py-2 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest">{profile.language}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-slate-50 p-7 rounded-[2rem]">
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-black mb-2">WEIGHT</p>
                  <p className="text-xl font-black text-slate-950">{profile.weight} KG</p>
                </div>
                <div className="bg-slate-50 p-7 rounded-[2rem]">
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-black mb-2">GOAL</p>
                  <p className="text-xl font-black text-slate-950 truncate uppercase">{profile.goal}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => dbService.clearDatabase().then(() => window.location.reload())}
              className="w-full py-7 text-rose-500 font-black text-[12px] uppercase tracking-[0.35em] flex items-center justify-center gap-3 bg-white rounded-[2.5rem] border border-rose-50 active:scale-95 transition-all shadow-sm"
            >
              Secure Log Out
            </button>
          </div>
        )}

        {showLangModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
            <div 
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xl animate-in fade-in duration-300"
              onClick={() => setShowLangModal(false)}
            />
            <div className="bg-white w-full max-w-sm rounded-[4rem] premium-shadow border border-slate-100 p-12 animate-spring-up relative z-10">
              <header className="mb-10 flex justify-between items-center px-2">
                <h3 className="text-3xl font-black text-slate-950 tracking-tighter">Region.</h3>
                <button onClick={() => setShowLangModal(false)} className="text-slate-300 p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </header>
              <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    className={`flex items-center justify-between px-9 py-7 rounded-[2.5rem] border-2 transition-all ${profile.language === l.code ? 'bg-slate-950 text-white border-slate-950 shadow-2xl' : 'bg-slate-50 text-slate-600 border-transparent hover:border-slate-200'}`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[19px] font-black tracking-tight">{l.native}</span>
                      <span className={`text-[10px] font-black uppercase tracking-[0.25em] opacity-60 ${profile.language === l.code ? 'text-emerald-400' : 'text-slate-400'}`}>{l.label}</span>
                    </div>
                    {profile.language === l.code && <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full ring-4 ring-emerald-500/20 shadow-lg" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
