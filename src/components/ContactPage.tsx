import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Globe } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic text-white leading-none">
          Contact the <span className="text-[#00dd53]">Tactical Hub</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Reporting issues, inquiries, or editorial submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 space-y-4">
            <div className="bg-[#00dd53]/10 w-fit p-3">
              <Mail className="h-5 w-5 text-[#00dd53]" />
            </div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">Editorial</h3>
            <p className="text-gray-500 text-xs font-mono">editor@creed-football.netlify.app</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] p-6 space-y-4">
            <div className="bg-[#00dd53]/10 w-fit p-3">
              <MessageSquare className="h-5 w-5 text-[#00dd53]" />
            </div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">Support</h3>
            <p className="text-gray-500 text-xs font-mono">support@creed-football.netlify.app</p>
          </div>
          
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 space-y-4">
            <div className="bg-[#00dd53]/10 w-fit p-3">
              <Globe className="h-5 w-5 text-[#00dd53]" />
            </div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">HQ</h3>
            <p className="text-gray-500 text-xs font-mono italic">Digital Operations Center<br/>London / Distributed</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white/[0.02] border border-white/[0.05] p-8">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="bg-[#00dd53] p-4 rounded-full">
                <Send className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white uppercase">Dispatch Sent</h2>
              <p className="text-gray-400 text-sm">Your message is being processed by the Creed editorial board.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-[#00dd53] font-mono text-[10px] uppercase tracking-widest mt-4 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">Your Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/[0.03] border border-white/[0.1] px-4 py-3 text-white text-sm focus:border-[#00dd53] focus:outline-none transition-colors rounded-none"
                      placeholder="e.g. Alex Hunter"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-white/[0.03] border border-white/[0.1] px-4 py-3 text-white text-sm focus:border-[#00dd53] focus:outline-none transition-colors rounded-none"
                      placeholder="alex@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">Inquiry Type</label>
                   <select className="w-full bg-white/[0.03] border border-white/[0.1] px-4 py-3 text-white text-sm focus:border-[#00dd53] focus:outline-none transition-colors rounded-none">
                     <option value="general">General Inquiry</option>
                     <option value="editorial">Editorial Submission</option>
                     <option value="ads">Advertising/Partnerships</option>
                     <option value="legal">Legal/Privacy</option>
                   </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">Message</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full bg-white/[0.03] border border-white/[0.1] px-4 py-3 text-white text-sm focus:border-[#00dd53] focus:outline-none transition-colors rounded-none resize-none"
                    placeholder="Briefly describe your request..."
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-[#00dd53] text-black font-display font-black uppercase italic py-4 hover:bg-white transition-all tracking-tighter"
              >
                Transmit to Base
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="pt-8 border-t border-white/[0.05]">
        <a href="#/" className="inline-flex items-center gap-2 text-white font-mono text-[10px] uppercase tracking-[0.2em] hover:text-[#00dd53] transition-colors">
          &larr; Back to Command Center
        </a>
      </div>
    </div>
  );
}
