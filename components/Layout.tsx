
import React from 'react';
import { LOGO_URL, DOC_LINK, WHATSAPP_LINK, TELEGRAM_DEV_LINK, TELEGRAM_CHANNEL_LINK } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  onAdminClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, onBack, onAdminClick }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafbff] text-slate-900 font-['Tajawal']">
      {/* Dynamic Header */}
      <header className="bg-[#0056b3] text-white shadow-2xl sticky top-0 z-[60] backdrop-blur-md bg-opacity-95 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack} 
                className="p-2 hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                aria-label="Back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            )}
            <h1 className="text-lg md:text-xl font-black tracking-tight truncate max-w-[200px] md:max-w-none">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
               <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Version 2.0</span>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href={DOC_LINK}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-white/20 hover:scale-110 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden"
                title="دليل استخدام التطبيق"
              >
                <img 
                  src={LOGO_URL} 
                  alt="Tafaoqe Logo" 
                  className="h-full w-full object-contain p-0.5" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=T&background=0056b3&color=fff';
                  }}
                />
              </a>
              <button 
                onDoubleClick={onAdminClick}
                className="w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors cursor-help"
                title="Admin Access"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-indigo-50 p-10 mt-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <a 
              href={DOC_LINK} 
              target="_blank" 
              rel="noreferrer" 
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden hover:scale-110 hover:shadow-xl transition-all"
            >
               <img 
                 src={LOGO_URL} 
                 alt="Tafaoqe Brand" 
                 className="h-full w-full object-contain p-1" 
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Tafaoqe&background=0056b3&color=fff';
                 }}
               />
            </a>
            <div className="space-y-1">
              <h3 className="font-black text-slate-800 text-xl tracking-tight">تطبيق تفوقي التعليمي</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">نعمل بكل حب لدعم طلبة السادس الإعدادي في مسيرتهم نحو النجاح الباهر.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
            <a 
              href={TELEGRAM_DEV_LINK} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center justify-center gap-3 bg-[#0056b3] text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-[#004494] transition-all border border-blue-600 shadow-md group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              شاركنا افكارك لتطوير التطبيق
            </a>
            <a 
              href={TELEGRAM_CHANNEL_LINK} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center justify-center gap-3 bg-[#F0EEFF] text-[#4F46E5] px-6 py-3.5 rounded-2xl font-bold hover:bg-[#E5E1FF] transition-all border border-[#DCD7FF] shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              القناة الرسمية
            </a>
          </div>

          <div className="pt-8 border-t border-slate-100 w-full flex flex-col md:flex-row items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest gap-4">
            <p>© {new Date().getFullYear()} TAFAOQE APP - ALL RIGHTS RESERVED</p>
            <p>DESIGNED FOR IRAQI STUDENTS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
