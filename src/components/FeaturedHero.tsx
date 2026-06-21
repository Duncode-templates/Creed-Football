import React from 'react';
import { NewsArticle } from '../types';
import { ArrowRight, Radio } from 'lucide-react';

const defaultHeroBg = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800';

interface FeaturedHeroProps {
  article: NewsArticle;
  onReadMore: (article: NewsArticle) => void;
}

export default function FeaturedHero({ article, onReadMore }: FeaturedHeroProps) {
  const currentImage = article.image || defaultHeroBg;

  // List of popular clubs, players, countries to verify if it qualifies
  const popularKeywords = [
    'arsenal', 'chelsea', 'manchester', 'madrid', 'barcelona', 'liverpool', 
    'city', 'bayern', 'psg', 'united', 'bellingham', 'haaland', 'saka', 
    'mbappe', 'messi', 'ronaldo', 'england', 'france', 'spain', 'germany'
  ];
  
  const textMatches = (
    article.title.toLowerCase() + ' ' + 
    article.summary.toLowerCase() + ' ' + 
    article.content.toLowerCase()
  );
  
  const hasPopularMatch = popularKeywords.some(keyword => textMatches.includes(keyword));

  return (
    <div className="w-full mb-8 group animate-fade-in">
      {/* Standalone Banner Image (Edge-to-edge, original size, no crop, no border-radius) */}
      <div className="relative w-full overflow-hidden mb-4 shadow-xl bg-black">
        <img
          src={currentImage}
          alt={article.title}
          className="w-full h-auto max-h-[480px] object-contain block mx-auto transition-transform duration-700 group-hover:scale-[1.01]"
          referrerPolicy="no-referrer"
        />
        
        {/* Flashing Green LIVE Signal overlay top left */}
        {hasPopularMatch && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-[#00dd53]/40 py-1 px-3 text-[9px] font-mono font-bold tracking-widest text-[#00dd53] shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-[#00dd53] opacity-75"></span>
              <span className="relative inline-flex rounded-none h-2 w-2 bg-[#00dd53]"></span>
            </span>
            <Radio className="h-3 w-3 inline" /> LIVE BROADCAST SIGNAL
          </div>
        )}
      </div>

      {/* Hero Content stacked cleanly BELOW the image */}
      <div className="pt-2 pb-4">
        {/* Meta Tag Line */}
        <div className="flex items-center gap-2.5 text-[10px] font-mono text-gray-500 mb-2">
          <span className="font-extrabold text-[#00dd53] tracking-widest uppercase">{article.tag}</span>
        </div>

        {/* Hero Title (Not massive, clean and elegant) */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white leading-tight tracking-tight hover:text-[#00dd53] transition-colors duration-200">
          {article.title}
        </h1>

        {/* Hero Summary */}
        <p className="mt-3 text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-4xl">
          {article.summary}
        </p>

        {/* Date block with no Author Info as requested */}
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.04] pt-4">
          <span className="text-[11px] font-mono text-gray-400">
            PUBLISHED: {article.date}
          </span>

          <button
            onClick={() => onReadMore(article)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#00dd53] hover:text-white transition-all tracking-wider uppercase group-hover:translate-x-1 duration-200"
          >
            EXCLUSIVE REPORT <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
