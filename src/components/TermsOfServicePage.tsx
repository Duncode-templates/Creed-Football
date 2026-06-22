import React from 'react';
import { Gavel, AlertCircle, FileText, Globe } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 space-y-12 animate-in fade-in duration-700">
      <div className="space-y-4">
        <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic text-white leading-none">
          Terms of <span className="text-[#00dd53]">Engagement</span>
        </h1>
        <p className="text-gray-400 font-mono text-xs tracking-widest uppercase italic">Valid as of: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10">
        <div className="bg-white/[0.02] border-l-2 border-[#00dd53] p-6 text-sm text-gray-300 italic leading-relaxed">
          By accessing the Creed Football platform, you agree to abide by the following tactical directives. If you do not agree with any of these terms, you are prohibited from utilizing the Creed Vault.
        </div>

        <section className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3 text-white mb-2">
            <Globe className="h-5 w-5 text-[#00dd53]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-tight m-0">1. Usage License</h2>
          </div>
          <p>
            Permission is granted to temporarily view the materials on Creed Football's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:
          </p>
          <ul className="list-disc pl-5 space-y-2 marker:text-[#00dd53]">
            <li>Modify or copy our tactical analyses or editorial content.</li>
            <li>Use the materials for any commercial purpose or public display.</li>
            <li>Attempt to decompile or reverse engineer any software contained on the platform.</li>
            <li>Remove any copyright or other proprietary notations from the materials.</li>
          </ul>
        </section>

        <section className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3 text-white mb-2">
            <AlertCircle className="h-5 w-5 text-[#00dd53]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-tight m-0">2. Disclaimer</h2>
          </div>
          <p>
            The materials on Creed Football's website are provided on an 'as is' basis. Creed Football makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
          <p>
            Live score data and transfer rumors are provided for informational purposes only. While we strive for absolute precision, we are not responsible for inaccuracies in third-party data feeds.
          </p>
        </section>

        <section className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3 text-white mb-2">
            <FileText className="h-5 w-5 text-[#00dd53]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-tight m-0">3. Content Accuracy</h2>
          </div>
          <p>
            The materials appearing on Creed Football's website could include technical, typographical, or photographic errors. Creed Football does not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3 text-white mb-2">
            <Gavel className="h-5 w-5 text-[#00dd53]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-tight m-0">4. Governing Law</h2>
          </div>
          <p>
            Any claim relating to Creed Football's website shall be governed by the laws of the jurisdiction in which our headquarters is located, without regard to its conflict of law provisions.
          </p>
        </section>
      </div>

      <div className="pt-8 border-t border-white/[0.05]">
        <a href="#/" className="inline-flex items-center gap-2 text-white font-mono text-[10px] uppercase tracking-[0.2em] hover:text-[#00dd53] transition-colors">
          &larr; Return to Base
        </a>
      </div>
    </div>
  );
}
