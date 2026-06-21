import React, { useState, useEffect } from 'react';
import { Match, MatchEvent } from '../types';
import { mockMatches as initialMatches } from '../footballData';
import { fetchFootballFixtures, getStoredFootballApiKey, setStoredFootballApiKey } from '../footballApi';
import { Play, Pause, RotateCcw, Swords, Calendar, Eye, Activity, Key, Check, Info, ShieldAlert } from 'lucide-react';

interface MatchTickerProps {
  onSelectMatch: (match: Match) => void;
  selectedMatch: Match | null;
}

export default function MatchTicker({ onSelectMatch, selectedMatch }: MatchTickerProps) {
  const [apiKey, setApiKey] = useState(getStoredFootballApiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiError, setApiError] = useState('');
  
  const [matches, setMatches] = useState<Match[]>(() => {
    const stored = localStorage.getItem('ft_matches');
    return stored ? JSON.parse(stored) : initialMatches;
  });

  const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'FT' | 'UPCOMING'>('LIVE');
  const [simulationActive, setSimulationActive] = useState(true);

  // Save matches if they update or mutate
  useEffect(() => {
    localStorage.setItem('ft_matches', JSON.stringify(matches));
  }, [matches]);

  // Load from API-Football when component mounts or API Key changes
  const loadApiMatches = async (keyToUse: string) => {
    if (!keyToUse.trim()) {
      setApiStatus('idle');
      return;
    }
    setApiStatus('loading');
    setApiError('');
    try {
      const fetchedMatches = await fetchFootballFixtures(keyToUse);
      if (fetchedMatches && fetchedMatches.length > 0) {
        setMatches(fetchedMatches);
        setApiStatus('success');
      } else {
        setApiStatus('success');
        // If no matches found for today on API, we keep initial mock ones with notice
      }
    } catch (err: any) {
      console.error(err);
      setApiStatus('error');
      setApiError(err?.message || 'Unauthorized or expired key. Falling back to simulated matches.');
    }
  };

  useEffect(() => {
    const defaultKey = getStoredFootballApiKey();
    if (defaultKey) {
      loadApiMatches(defaultKey);
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredFootballApiKey(apiKey);
    loadApiMatches(apiKey);
  };

  // Live simulation looping (Only applies when using simulated mock data)
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      setMatches((prevMatches) => {
        return prevMatches.map((match) => {
          if (match.status === 'LIVE' && (match.minute || 0) < 90) {
            const nextMinute = (match.minute || 0) + 1;
            const newEvents = [...match.events];
            let nextHomeScore = match.homeScore;
            let nextAwayScore = match.awayScore;

            // Random events
            const roll = Math.random();
            if (roll < 0.08) {
              const scoringTeam = Math.random() > 0.5 ? 'home' : 'away';
              const scorers = scoringTeam === 'home' 
                ? ['Bukayo Saka', 'Kai Havertz', 'Declan Rice']
                : ['E. Haaland', 'Phil Foden', 'K. De Bruyne'];
              const player = scorers[Math.floor(Math.random() * scorers.length)];
              
              if (scoringTeam === 'home') nextHomeScore++;
              else nextAwayScore++;

              const goalEvent: MatchEvent = {
                type: 'goal',
                player,
                minute: nextMinute,
                team: scoringTeam,
                detail: 'Brilliant standard shot'
              };
              newEvents.push(goalEvent);
            }

            const updatedMatch = {
              ...match,
              minute: nextMinute,
              homeScore: nextHomeScore,
              awayScore: nextAwayScore,
              events: newEvents
            };

            if (selectedMatch && selectedMatch.id === match.id) {
              setTimeout(() => onSelectMatch(updatedMatch), 0);
            }

            return updatedMatch;
          }
          return match;
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [simulationActive, selectedMatch, onSelectMatch]);

  const resetMatches = () => {
    localStorage.removeItem('ft_matches');
    setMatches(initialMatches);
    if (selectedMatch) {
      const matchInOriginal = initialMatches.find(m => m.id === selectedMatch.id);
      if (matchInOriginal) onSelectMatch(matchInOriginal);
    }
    setApiStatus('idle');
  };

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'ALL') return true;
    return match.status === activeTab;
  });

  return (
    <div id="match-center" className="scroll-mt-20 w-full animate-fade-in mb-8">
      {/* Fixtures Feed Grid (No container card background, completely flat layout) */}
      {filteredMatches.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-500 font-mono italic">
          No live fixtures currently found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.slice(1).map((match) => {
            const isLive = match.status === 'LIVE';
            const isSelected = selectedMatch?.id === match.id;
            
            return (
              <div
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className={`group cursor-pointer rounded-none border p-4 transition-all duration-300 relative ${
                  isSelected
                    ? 'border-[#00dd53] bg-[#00dd53]/5'
                    : 'border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] hover:bg-white/[0.03]'
                }`}
              >
                {/* Header state */}
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 mb-2">
                  <span className="font-extrabold tracking-tight uppercase truncate max-w-[130px]">{match.league}</span>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-[#00dd53]/15 text-[#00dd53] font-black text-[10px] animate-pulse">
                      <Activity className="h-2.5 w-2.5" /> {match.minute}&apos;
                    </span>
                  ) : match.status === 'FT' ? (
                    <span className="px-2 py-0.5 rounded-none bg-white/10 text-white text-[9px] font-bold">
                      FT
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-400 font-mono text-[9px]">
                      <Calendar className="h-2.5 w-2.5" /> UPCOMING
                    </span>
                  )}
                </div>

                {/* Main comparison wrapper */}
                <div className="flex justify-between items-center py-1">
                  {/* Home Team */}
                  <div className="flex items-center gap-2 w-5/12 min-w-0">
                    <span className="text-sm shrink-0">🛡️</span>
                    <span className="text-xs font-bold text-gray-200 truncate group-hover:text-[#00dd53] transition-colors" title={match.homeTeam}>
                      {match.homeTeam}
                    </span>
                  </div>

                  {/* Scoreboard block */}
                  <div className="flex items-center justify-center bg-black/60 border border-white/[0.06] px-2 py-1 rounded-none w-2/12 h-6 text-center">
                    {match.status === 'UPCOMING' ? (
                      <span className="text-[10px] text-gray-500 font-bold font-mono">VS</span>
                    ) : (
                      <span className="text-xs font-mono font-black text-white flex items-center justify-center gap-0.5">
                        <span className={isLive && match.homeScore > match.awayScore ? 'text-[#00dd53]' : ''}>
                          {match.homeScore}
                        </span>
                        <span className="text-gray-600">-</span>
                        <span className={isLive && match.awayScore > match.homeScore ? 'text-[#00dd53]' : ''}>
                          {match.awayScore}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-2 w-5/12 min-w-0 justify-end text-right">
                    <span className="text-xs font-bold text-gray-200 truncate group-hover:text-[#00dd53] transition-colors" title={match.awayTeam}>
                      {match.awayTeam}
                    </span>
                    <span className="text-sm shrink-0">⚔️</span>
                  </div>
                </div>

                {/* Stadium details */}
                <div className="mt-2.5 pt-2.5 border-t border-white/[0.03] flex justify-between items-center text-[9px] text-gray-500 font-mono">
                  <span className="truncate max-w-[153px]">{match.stadium}</span>
                  <span className="text-[#00dd53] font-bold group-hover:underline flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5" /> TIMELINE
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
