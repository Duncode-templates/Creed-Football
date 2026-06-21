import React from 'react';
import { NewsArticle } from '../types';
import { Newspaper, ArrowUpRight } from 'lucide-react';

interface NewsFeedProps {
  articles: NewsArticle[];
  onReadArticle: (article: NewsArticle) => void;
  selectedCategory: string;
}

export default function NewsFeed({ articles, onReadArticle, selectedCategory }: NewsFeedProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in relative z-10">
      
      {/* Category Section Header (No Emojis, No article counts) */}
      <div className="flex justify-between items-end border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4.5 w-4.5 text-[#00dd53]" />
          <h3 className="font-display font-black text-white text-sm sm:text-base tracking-wider uppercase">
            {selectedCategory === 'All News' ? 'LATEST REPORT WIRE' : `${selectedCategory}`}
          </h3>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="py-12 border border-white/[0.05] rounded-none text-center text-gray-500 font-semibold text-xs bg-white/[0.01]">
          No reports match your current category filters or search parameters.
        </div>
      ) : (
        /* Grid layout: exactly grid-cols-2 on even the smallest mobile screen, with optimized, tight padding */
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6 w-full">
          {articles.map((article) => {
            return (
              <div
                key={article.id}
                onClick={() => onReadArticle(article)}
                className="group cursor-pointer flex flex-col justify-between hover:scale-[1.008] transition-all duration-300"
              >
                <div>
                  {/* Thumbnail Image (Original Aspect, Contain, no cut, no rounded corners) */}
                  <div className="relative w-full overflow-hidden bg-[#0a0a0c] mb-2.5">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-auto max-h-[220px] object-contain block mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Body Content (No container background, no surrounding border lines) */}
                  <div className="px-1 py-1">
                    {/* Meta tag label */}
                    <span className="text-[9px] font-mono font-extrabold text-[#00dd53] uppercase tracking-wide">
                      {article.tag}
                    </span>

                    {/* Smaller Title for optimal 2-column mobile displays */}
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-gray-150 leading-tight group-hover:text-[#00dd53] transition-colors duration-200 mt-1 lines-2 line-clamp-2">
                      {article.title}
                    </h4>

                    {/* Summary paragraph (hidden on tiny screens to avoid layout clutter, visible on sm and up) */}
                    <p className="hidden sm:block text-[11px] text-gray-400 mt-1.5 leading-relaxed font-sans line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Professional compact Date and Link (No Author, No Minutes read, completely flat) */}
                <div className="px-1 pt-2 pb-1 mt-2 border-t border-white/[0.03] flex justify-between items-center text-[9px] font-mono text-gray-400">
                  <span>{article.date}</span>
                  <span className="inline-flex items-center gap-0.5 text-[#00dd53] font-bold">
                    READ <ArrowUpRight className="h-2.5 w-2.5" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
