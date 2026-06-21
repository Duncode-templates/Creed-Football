import React, { useState, useMemo } from 'react';
import { NewsArticle } from '../types';

interface ClubNewsProps {
  articles: NewsArticle[];
  onReadArticle: (article: NewsArticle) => void;
}

interface ClubDefinition {
  name: string;
  keywords: string[];
}

const POPULAR_CLUBS: ClubDefinition[] = [
  { name: 'Chelsea', keywords: ['chelsea', 'blues', 'stamford'] },
  { name: 'Arsenal', keywords: ['arsenal', 'gunners', 'arteta'] },
  { name: 'Manchester United', keywords: ['manchester united', 'man utd', 'ten hag'] },
  { name: 'Manchester City', keywords: ['manchester city', 'man city', 'guardiola'] },
  { name: 'Liverpool', keywords: ['liverpool', 'reds', 'salah'] },
  { name: 'Real Madrid', keywords: ['real madrid', 'madrid', 'bellingham'] },
  { name: 'Barcelona', keywords: ['barcelona', 'fcb', 'catalan'] },
  { name: 'Bayern Munich', keywords: ['bayern', 'munich', 'bavarian'] },
  { name: 'Paris Saint-Germain', keywords: ['psg', 'paris saint-germain', 'mbappe'] }
];

export default function ClubNews({ articles, onReadArticle }: ClubNewsProps) {
  const [selectedClub, setSelectedClub] = useState<string>('Real Madrid');

  // Find articles matching current club keywords
  const clubMatchingArticles = useMemo(() => {
    const clubDef = POPULAR_CLUBS.find(c => c.name === selectedClub);
    if (!clubDef) return [];

    return articles.filter(art => {
      const textToSearch = (art.title + ' ' + art.summary + ' ' + art.content).toLowerCase();
      return clubDef.keywords.some(kw => textToSearch.includes(kw));
    });
  }, [articles, selectedClub]);

  return (
    <div className="w-full py-4 my-4 border-b border-white/[0.06]">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3.5">
        <div className="h-1.5 w-1.5 bg-[#00dd53]"></div>
        <h3 className="font-display font-black text-xs sm:text-xs tracking-widest text-[#a8a8af] uppercase">
          CLUB CATEGORY NEWS WIRE
        </h3>
      </div>

      {/* Horizontal list of clubs (No edge rounding, no article counts) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3.5 scrollbar-none w-full">
        {POPULAR_CLUBS.map((club) => {
          const isSelected = selectedClub === club.name;

          return (
            <button
              key={club.name}
              onClick={() => setSelectedClub(club.name)}
              className={`px-3 py-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider transition-all whitespace-nowrap inline-flex items-center gap-1.5 border rounded-none shrink-0 ${
                isSelected
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-gray-400 hover:text-white border-transparent'
              }`}
            >
              <span>{club.name}</span>
            </button>
          );
        })}
      </div>

      {/* Matches articles displaying in crisp 2 column flat cards (completely square edges, full image) */}
      {clubMatchingArticles.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-500 font-mono italic">
          No club-specific articles matching {selectedClub} are loaded on the dispatch server.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 md:gap-6 mt-1">
          {clubMatchingArticles.slice(0, 4).map((art) => (
            <div
              key={art.id}
              onClick={() => onReadArticle(art)}
              className="group cursor-pointer flex flex-col justify-between hover:scale-[1.008] transition-all duration-300"
            >
              <div>
                <div className="relative w-full overflow-hidden bg-[#0a0a0c] mb-2.5">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-auto max-h-[185px] object-contain block mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="px-0.5">
                  <span className="text-[9px] font-mono font-extrabold text-[#00dd53] uppercase tracking-wide">
                    {art.tag}
                  </span>
                  <h4 className="font-sans font-bold text-xs sm:text-xs text-gray-150 leading-tight group-hover:text-[#00dd53] transition-colors mt-0.5 max-lines-2 line-clamp-2">
                    {art.title}
                  </h4>
                </div>
              </div>
              <div className="px-0.5 pt-1.5 mt-2 flex justify-between items-center text-[9px] font-mono text-gray-400 border-t border-white/[0.03]">
                <span>{art.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
