
import React, { useState } from 'react';
import { UserProfile, HealthGoal, ActivityLevel, AppLanguage } from '../types';
import { HEALTH_CONDITIONS, GOALS, BLOOD_GROUPS, ACTIVITY_LEVELS } from '../constants';
import { translations } from '../services/translations';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<AppLanguage>('en');
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: undefined,
    gender: 'male',
    height: '',
    weight: '',
    bloodGroup: 'O+',
    activityLevel: 'moderate',
    conditions: [],
    medications: '',
    preference: 'veg',
    cuisines: [],
    goal: 'stay healthy',
    language: 'en'
  });

  const t = translations[lang] || translations['en'];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Simulated Google Auth Flow - Name is now empty as requested
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: '', 
        language: lang
      }));
      setLoading(false);
      setStep(1); 
    }, 1200);
  };

  const toggleItem = (field: keyof UserProfile, item: string) => {
    setFormData(prev => {
      const current = (prev[field] as string[]) || [];
      return {
        ...prev,
        [field]: current.includes(item) 
          ? current.filter(i => i !== item) 
          : [...current, item]
      };
    });
  };

  const handleFinish = () => {
    setLoading(true);
    onComplete({ ...formData, language: lang } as UserProfile);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-12 bg-white text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-[3px] border-emerald-50 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Synchronizing Bio-Data</p>
      </div>
    );
  }

  const languages: { code: AppLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const BrandLogo = ({ size = 56 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#10B981" stroke="#064E3B" strokeWidth="1.2"/>
      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="animate-spring-up h-full">
          {step === 0 && (
            <div className="h-full flex flex-col items-center justify-between py-20 px-10 text-center relative">
              <div className="absolute top-0 left-0 right-0 h-[45vh] bg-gradient-to-b from-emerald-50/60 via-emerald-50/20 to-transparent -z-10" />
              
              <div className="space-y-8 flex flex-col items-center mt-12">
                <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.2)] border border-emerald-50 transform hover:scale-105 transition-all duration-500 ease-out">
                  <BrandLogo size={56} />
                </div>
                
                <div className="space-y-3">
                  <h1 className="text-5xl font-[900] text-slate-950 tracking-[-0.04em] leading-none">SmartBite.</h1>
                  <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] opacity-80">Professional Nutri-OS</p>
                </div>
              </div>

              <div className="w-full space-y-4 max-w-sm">
                <div className="space-y-3 mb-10">
                  <p className="text-[15px] font-semibold text-slate-400 leading-relaxed px-4">
                    Clinical nutritional analysis for the <span className="text-slate-900 font-bold underline decoration-emerald-200 decoration-4 underline-offset-4">Indian biological profile.</span>
                  </p>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className="w-full h-16 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 shadow-xl shadow-slate-200/40 active:scale-[0.97] transition-all hover:bg-slate-50 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-slate-50 opacity-0 group-active:opacity-100 transition-opacity" />
                  <svg width="22" height="22" viewBox="0 0 20 20">
                    <path d="M19.6 10.2c0-.7-.1-1.4-.2-2H10v3.8h5.4c-.2 1.2-1 2.2-2 3l3.1 2.4c1.8-1.7 2.9-4.2 2.9-7.2z" fill="#4285F4"/>
                    <path d="M10 20c2.7 0 5-.9 6.6-2.4l-3.1-2.4c-.9.6-2.1 1-3.5 1-2.6 0-4.9-1.8-5.7-4.2H1.1v2.5C2.8 17.9 6.2 20 10 20z" fill="#34A853"/>
                    <path d="M4.3 12c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V5.5H1.1C.4 6.9 0 8.4 0 10s.4 3.1 1.1 4.5L4.3 12z" fill="#FBBC05"/>
                    <path d="M10 3.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9C15 1 12.7 0 10 0 6.2 0 2.8 2.1 1.1 5.5L4.3 8c.8-2.4 3.1-4.1 5.7-4.1z" fill="#EA4335"/>
                  </svg>
                  <span className="font-bold text-slate-800 tracking-tight text-[16px]">Continue with Google</span>
                </button>
                
                <button 
                  onClick={nextStep}
                  className="w-full h-16 bg-slate-100/80 text-slate-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.15em] active:scale-[0.97] transition-all"
                >
                  Set up profile manually
                </button>
                
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.15em] pt-6">Secured by Biometric Encryption</p>
              </div>
            </div>
          )}

          {step > 0 && (
            <div className="flex flex-col h-full bg-white">
              <div className="px-10 pt-16 pb-6">
                <div className="flex gap-2 h-1.5 mb-10">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className={`flex-1 rounded-full transition-all duration-700 ${step >= s ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-10 animate-spring-up">
                    <header>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Identity.</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Baseline biological data</p>
                    </header>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white px-8 py-6 rounded-[2rem] outline-none font-bold text-xl transition-all shadow-sm"
                        placeholder="Name"
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                      <input
                        type="number"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white px-8 py-6 rounded-[2rem] outline-none font-bold text-xl transition-all shadow-sm"
                        placeholder="Age"
                        value={formData.age || ''}
                        onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                      />
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.langSelect}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {languages.map(l => (
                          <button
                            key={l.code}
                            onClick={() => { setLang(l.code); setFormData(p => ({...p, language: l.code})); }}
                            className={`flex flex-col items-start px-6 py-5 rounded-[2rem] border-2 transition-all ${lang === l.code ? 'bg-slate-950 text-white border-slate-950 shadow-xl' : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'}`}
                          >
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">{l.label}</span>
                            <span className="text-[17px] font-black tracking-tight">{l.native}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8 animate-spring-up">
                    <header>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Vulnerabilities.</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select relevant conditions</p>
                    </header>
                    <div className="grid grid-cols-1 gap-2.5 max-h-[45vh] overflow-y-auto pr-1">
                      {HEALTH_CONDITIONS.map(cond => (
                        <button
                          key={cond}
                          onClick={() => toggleItem('conditions', cond)}
                          className={`flex items-center justify-between px-8 py-5 rounded-[1.8rem] border-2 text-left transition-all ${formData.conditions?.includes(cond) ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100'}`}
                        >
                          <span className="text-[12px] font-bold uppercase tracking-tight">{cond}</span>
                          {formData.conditions?.includes(cond) && <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10 animate-spring-up">
                    <header>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Physicals.</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Anatomical measurements</p>
                    </header>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Height (CM)</label>
                        <input type="text" className="w-full bg-slate-50 px-8 py-7 rounded-[2.2rem] font-bold text-3xl text-center outline-none border-2 border-transparent focus:border-emerald-500 transition-all shadow-sm" value={formData.height || ''} onChange={e => setFormData({ ...formData, height: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Weight (KG)</label>
                        <input type="text" className="w-full bg-slate-50 px-8 py-7 rounded-[2.2rem] font-bold text-3xl text-center outline-none border-2 border-transparent focus:border-emerald-500 transition-all shadow-sm" value={formData.weight || ''} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {BLOOD_GROUPS.map(bg => (
                        <button
                          key={bg}
                          onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                          className={`py-5 rounded-2xl border-2 font-black text-[12px] transition-all ${formData.bloodGroup === bg ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-400 border-transparent'}`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-10 animate-spring-up">
                    <header>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Metabolism.</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active lifestyle index</p>
                    </header>
                    <div className="space-y-3.5">
                      {ACTIVITY_LEVELS.map(act => (
                        <button
                          key={act.id}
                          onClick={() => setFormData({ ...formData, activityLevel: act.id as ActivityLevel })}
                          className={`w-full px-8 py-8 rounded-[2.2rem] border-2 text-left transition-all group ${formData.activityLevel === act.id ? 'bg-slate-950 text-white border-slate-950 shadow-xl' : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100'}`}
                        >
                          <span className="text-[13px] font-black uppercase tracking-widest">{act.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-10 animate-spring-up">
                    <header>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Objective.</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary health target</p>
                    </header>
                    <div className="space-y-3.5">
                      {GOALS.map(goal => (
                        <button
                          key={goal.id}
                          onClick={() => setFormData({ ...formData, goal: goal.id as HealthGoal })}
                          className={`w-full px-10 py-8 rounded-[2.2rem] border-2 text-left transition-all ${formData.goal === goal.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-[0_20px_40px_rgba(16,185,129,0.3)]' : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'}`}
                        >
                          <span className="font-black text-[14px] uppercase tracking-widest">{goal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto px-10 pb-16 pt-8 bg-gradient-to-t from-white via-white to-transparent">
                <div className="flex gap-4">
                  <button 
                    onClick={prevStep} 
                    className="w-18 h-18 bg-slate-50 text-slate-400 rounded-[2rem] flex items-center justify-center active:scale-95 transition-all border border-slate-100 hover:bg-slate-100"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button
                    onClick={step === 5 ? handleFinish : nextStep}
                    className="flex-1 h-18 bg-slate-950 text-white font-black rounded-[2rem] text-[12px] uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {step === 5 ? t.deploy : 'Next Step'}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
