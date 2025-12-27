
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, showNav = true }) => {
  return (
    <div className="flex justify-center h-[100dvh] w-full bg-slate-950 overflow-hidden">
      <div className="w-full max-w-lg bg-white flex flex-col relative h-full overflow-hidden shadow-2xl">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative">
          {children}
        </main>

        {/* Floating Bottom Navigation */}
        {showNav && onTabChange && (
          <div className="absolute bottom-6 left-0 right-0 px-8 z-50 pointer-events-none">
            <nav className="glass border border-white/50 pointer-events-auto px-8 py-3 rounded-[2.5rem] flex justify-between items-center premium-shadow safe-area-bottom">
              <button 
                onClick={() => onTabChange('home')}
                className={`p-3 transition-all duration-300 rounded-2xl ${activeTab === 'home' ? 'text-emerald-600 bg-emerald-50/80 scale-110' : 'text-slate-400 hover:text-emerald-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </button>
              <button 
                onClick={() => onTabChange('chat')}
                className={`p-3 transition-all duration-300 rounded-2xl ${activeTab === 'chat' ? 'text-emerald-600 bg-emerald-50/80 scale-110' : 'text-slate-400 hover:text-emerald-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button 
                onClick={() => onTabChange('profile')}
                className={`p-3 transition-all duration-300 rounded-2xl ${activeTab === 'profile' ? 'text-emerald-600 bg-emerald-50/80 scale-110' : 'text-slate-400 hover:text-emerald-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
