import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('creed_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('creed_cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 group">
      <div className="max-w-4xl mx-auto bg-black/90 backdrop-blur-xl border border-white/10 p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 slide-in-from-bottom duration-500 animate-in">
        <div className="flex items-start gap-4">
          <div className="bg-[#00dd53]/20 p-2 shrink-0">
            <ShieldAlert className="h-5 w-5 text-[#00dd53]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-tight">Tactical Cookie Notice</h4>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
              Creed Football uses analytical cookies and participates in the Google AdSense program to track visitor metrics and serve personalized technical content. By continuing to explore the vault, you accept our <a href="#/privacy" className="text-[#00dd53] hover:underline">Privacy Protocols</a>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={accept}
            className="flex-1 md:flex-none bg-[#00dd53] text-black px-8 py-2.5 font-display font-black text-xs uppercase italic hover:bg-white transition-all tracking-tight"
          >
            Accept Intelligence
          </button>
          <button 
            onClick={() => setVisible(false)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
