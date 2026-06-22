import React from 'react';
import { Shield, Info, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic text-white leading-none">
          Inside the <span className="text-[#00dd53]">Creed Vault</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">The independent observatory of tactical football</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-white/[0.02] border border-white/[0.05] p-8 space-y-4">
          <div className="bg-[#00dd53]/10 w-fit p-3">
            <Shield className="h-6 w-6 text-[#00dd53]" />
          </div>
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">Our Mission</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Creed Football was founded on a singular principle: football is more than a game; it is a tactical chess match played at 100 miles per hour. We provide the analytics, the breaking rumors, and the live data required to understand the modern game at its highest level.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.05] p-8 space-y-4">
          <div className="bg-[#00dd53]/10 w-fit p-3">
            <Users className="h-6 w-6 text-[#00dd53]" />
          </div>
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">The Team</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Our editorial board consists of seasoned sports journalists, data analysts specializing in expected goals (xG), and tactical scouts who have transitioned from the pitch to the keyboard. We don't just report scores; we explain the systems behind them.
          </p>
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-white/[0.05]">
        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight flex items-center gap-3">
          <Target className="h-6 w-6 text-[#00dd53]" /> Global Reach
        </h2>
        <div className="prose prose-invert max-w-none text-gray-400 text-sm leading-relaxed space-y-4">
          <p>
            From the bustling transfer markets of the Premier League and La Liga to the emerging talents of South America and Asia, Creed Football maintains a global network of information providers. Our commitment is to the "Creed" of authentic, unbiased, and lightning-fast reporting.
          </p>
          <p>
            Whether you're looking for matchday metrics, deep-dive tactical breakdowns of Pep Guardiola's latest inverted fullback experiment, or exclusive news on the next multi-million dollar transfer, the Creed Vault is your primary source.
          </p>
        </div>
      </div>

      <div className="bg-[#00dd53] p-10 text-black flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h4 className="text-2xl font-display font-black uppercase italic leading-none">Join the collective</h4>
          <p className="font-bold text-sm">Stay ahead of the tactical curve with Creed Football.</p>
        </div>
        <a href="#/" className="bg-black text-white px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">
          Back to feed
        </a>
      </div>
    </div>
  );
}
