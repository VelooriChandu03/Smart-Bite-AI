
import React from 'react';
import { FoodAnalysis, FoodSafetyStatus } from '../types';

interface AnalysisResultProps {
  analysis: FoodAnalysis;
  onClose: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onClose }) => {
  const getStatusStyles = (status: FoodSafetyStatus) => {
    switch (status) {
      case FoodSafetyStatus.SAFE: 
        return { 
          bg: 'bg-emerald-600', 
          light: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        };
      case FoodSafetyStatus.MODERATE: 
        return { 
          bg: 'bg-amber-500', 
          light: 'bg-amber-50', 
          text: 'text-amber-700', 
          icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        };
      case FoodSafetyStatus.HARMFUL: 
        return { 
          bg: 'bg-rose-600', 
          light: 'bg-rose-50', 
          text: 'text-rose-700', 
          icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        };
      default: 
        return { 
          bg: 'bg-slate-500', 
          light: 'bg-slate-50', 
          text: 'text-slate-700', 
          icon: null 
        };
    }
  };

  const styles = getStatusStyles(analysis.status);

  return (
    <div className="relative overflow-hidden bg-white rounded-[3rem] premium-shadow border border-slate-50 p-10 pb-12 animate-spring-up">
      {/* Visual Status Strip */}
      <div className={`absolute top-0 left-0 right-0 h-3 ${styles.bg}`} />
      
      <div className="flex justify-between items-start mb-12">
        <div className="max-w-[70%]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Analysis Results</p>
          <h3 className="text-3xl font-black text-slate-900 leading-none mb-4 tracking-tighter">{analysis.foodName}</h3>
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider ${styles.light} ${styles.text} shadow-sm border border-black/5`}>
            {styles.icon}
            {analysis.status}
          </div>
        </div>
        
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="absolute w-full h-full -rotate-90">
            <circle cx="48" cy="48" r="42" className="fill-none stroke-slate-50" strokeWidth="8" />
            <circle 
              cx="48" cy="48" r="42" 
              className={`fill-none ${styles.text} transition-all duration-1000`} 
              strokeWidth="8" 
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - (analysis.healthScore || 0)/10)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center relative z-10">
            <span className="text-3xl font-black block leading-none text-slate-900">{analysis.healthScore}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score</span>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Clinical Verdict</h4>
          <p className="text-slate-700 text-sm font-bold leading-relaxed italic">
            "{analysis.explanation}"
          </p>
        </section>

        {analysis.risks && analysis.risks.length > 0 && (
          <section>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Alert Profiles</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.risks.map((risk, i) => (
                <span key={i} className="px-5 py-2.5 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-rose-100 shadow-sm">
                  {risk}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-8">
          <section className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/10">
            <h4 className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-6">Optimized Swaps</h4>
            <div className="space-y-3">
              {analysis.alternatives.map((alt, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11l5 5 5-5M7 7l5 5 5-5"/></svg>
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-tight">{alt}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Metabolic Guidance</h4>
            <div className="space-y-4">
              {analysis.tips.map((tip, i) => (
                <div key={i} className="text-xs font-bold text-slate-600 flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="min-w-[20px] pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-12 py-7 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] hover:bg-black transition-all active:scale-95 shadow-2xl"
      >
        Acknowledge
      </button>
    </div>
  );
};

export default AnalysisResult;
