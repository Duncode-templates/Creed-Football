import React from 'react';
import { Lock, Eye, ShieldCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 space-y-12 animate-in fade-in duration-700">
      <div className="space-y-4">
        <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic text-white leading-none">
          Privacy <span className="text-[#00dd53]">Protocols</span>
        </h1>
        <p className="text-gray-400 font-mono text-xs tracking-widest uppercase italic">Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10">
        <section className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3 text-white mb-2">
            <Eye className="h-5 w-5 text-[#00dd53]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-tight m-0">1. Data Transparency</h2>
          </div>
          <p>
            At Creed Football, we recognize the importance of privacy. This Privacy Policy outlines the types of personal information we receive and collect when you use our website, as well as some of the steps we take to safeguard information.
          </p>
          <p>
            We collect basic analytics data, device information, and—only if you choose to provide it—your email address for our newsletter via the Pitch Dispatch subscription form.
          </p>
        </section>

        <section className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3 text-white mb-2">
            <Lock className="h-5 w-5 text-[#00dd53]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-tight m-0">2. Security Measures</h2>
          </div>
          <p>
            We implement high-performance security protocols to prevent unauthorized access, maintenance, or disclosure of user data. All data transmissions involving sensitive information are encrypted using industry-standard technologies.
          </p>
        </section>

        <section className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3 text-white mb-2">
            <ShieldCheck className="h-5 w-5 text-[#00dd53]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-tight m-0">3. Cookies & Advertising</h2>
          </div>
          <p>
            Creed Football uses cookies to analyze traffic and optimize the user experience. We also participate in the Google AdSense program. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet. You may opt out of personalized advertising by visiting Ad Settings.
          </p>
        </section>

        <section className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3 text-white mb-2">
            <Mail className="h-5 w-5 text-[#00dd53]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-tight m-0">4. Contact Inquiries</h2>
          </div>
          <p>
            For any inquiries regarding these privacy protocols or to request the deletion of your subscribed email from our dispatch list, please contact our tactical operations center via the editorial channels.
          </p>
        </section>
      </div>

      <div className="pt-8 border-t border-white/[0.05]">
        <a href="#/" className="inline-flex items-center gap-2 text-white font-mono text-[10px] uppercase tracking-[0.2em] hover:text-[#00dd53] transition-colors">
          &larr; Return to Central Hub
        </a>
      </div>
    </div>
  );
}
