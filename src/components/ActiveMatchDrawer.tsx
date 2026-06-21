import React, { useRef, useEffect } from 'react';
import { Match } from '../types';
import { Activity, Users, Flame, X, Calendar, Shield } from 'lucide-react';

interface ActiveMatchDrawerProps {
  match: Match | null;
  onClose: () => void;
}

export default function ActiveMatchDrawer({ match, onClose }: ActiveMatchDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (match) {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [match]);

  if (!match) return null;

  const hasScore = match.status !== 'UPCOMING';
  const totalEvents = match.events.length;
  const hGoals = match.events.filter(e => e.type === 'goal' && e.team === 'home').length;
  const aGoals = match.events.filter(e => e.type === 'goal' && e.team === 'away').length;

  const homePossession = hasScore ? 45 + ((hGoals - aGoals) * 3) + (match.id === 'match-1' ? 7 : -4) : 50;
  const awayPossession = 100 - homePossession;

  const homeShots = hasScore ? 8 + hGoals * 3 : 0;
  const awayShots = hasScore ? 7 + aGoals * 3 : 0;

  const homeFouls = hasScore ? 6 + (match.id === 'match-1' ? 4 : 2) : 0;
  const awayFouls = hasScore ? 8 + (match.id === 'match-1' ? 1 : 4) : 0;

  return (
    <div
      ref={containerRef}
      className="bg-black/45 border-t border-b border-white/[0.08] p-6 mb-8 relative overflow-hidden animate-fade-in rounded-none"
    >
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-white/[0.06] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#00dd53] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00dd53]">
            Tactical Analysis Segment
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 px-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-none transition-colors text-xs flex items-center gap-1.5"
        >
          <X className="h-3.5 w-3.5" /> Close Analysis
        </button>
      </div>

      {/* Banner info */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-6">
        
        {/* Home Club */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center text-sm font-bold text-[#00dd53] mb-2.5">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-display font-black text-sm text-white">{match.homeTeam}</h3>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Home Squad</span>
        </div>

        {/* Score and State */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest mb-1.5">{match.league}</div>
          <div className="bg-black/60 px-5 py-2.5 border border-white/[0.08] rounded-none flex items-center gap-5">
            <span className="text-2xl font-mono font-black text-white">{match.status === 'UPCOMING' ? '-' : match.homeScore}</span>
            <span className="text-gray-650 font-bold text-lg">:</span>
            <span className="text-2xl font-mono font-black text-white">{match.status === 'UPCOMING' ? '-' : match.awayScore}</span>
          </div>
          <div className="mt-3">
            {match.status === 'LIVE' ? (
              <span className="inline-flex items-center gap-1 bg-[#00dd53]/10 text-[#00dd53] font-bold text-[10px] px-2.5 py-1 rounded-none animate-pulse border border-[#00dd53]/20">
                LIVE NOW • {match.minute}&apos; IN PLAY
              </span>
            ) : match.status === 'FT' ? (
              <span className="inline-flex items-center gap-1 bg-white/10 text-gray-300 font-bold text-[10px] px-2.5 py-1 rounded-none border border-white/5">
                MATCH CONCLUDED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-white/5 text-gray-400 font-bold text-[10px] px-2.5 py-1 rounded-none border border-white/5">
                UPCOMING FIXTURE
              </span>
            )}
          </div>
        </div>

        {/* Away Club */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center text-sm font-bold text-white mb-2.5">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-display font-black text-sm text-white">{match.awayTeam}</h3>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Away Squad</span>
        </div>

      </div>

      {/* Stadium details (No Emojis) */}
      <div className="bg-white/[0.02] px-4 py-2 rounded-none border border-white/[0.05] flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-400 gap-2 mb-6">
        <span>STADIUM: <strong className="text-white">{match.stadium}</strong></span>
        <span>OFFICIAL: <strong className="text-white">Elite Panel Referee</strong></span>
      </div>

      {/* Stats and Events split layout */}
      {match.status !== 'UPCOMING' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-white/[0.06]">
          
          {/* Timeline events feed */}
          <div>
            <h4 className="text-[10px] font-mono font-black text-gray-400 tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-[#00dd53]" /> Chronological Events
            </h4>

            {totalEvents === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs font-mono">
                Waiting for match reporting to produce dynamic incidents.
              </div>
            ) : (
              <div className="relative border-l border-white/[0.06] pl-6 ml-3 space-y-5">
                {match.events.map((evt, idx) => {
                  const isHome = evt.team === 'home';
                  const isGoal = evt.type === 'goal';
                  const isYellow = evt.type === 'card_yellow';
                  const isRed = evt.type === 'card_red';

                  return (
                    <div key={idx} className="relative group">
                      {/* Left vertical bubble connector */}
                      <span className={`absolute -left-9 top-1.5 h-6 w-6 rounded-none flex items-center justify-center text-[9px] font-mono font-bold border ${
                        isGoal 
                          ? 'bg-[#00dd53] border-[#00dd53] text-black font-extrabold shadow-[0_0_8px_rgba(0,221,83,0.4)]'
                          : isYellow 
                          ? 'bg-yellow-400 border-yellow-400 text-black'
                          : isRed 
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}>
                        {isGoal ? 'GOAL' : isYellow ? 'YLW' : isRed ? 'RED' : 'SUB'}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#00dd53] font-extrabold">{evt.minute}&apos;</span>
                          <span className="text-[10px] font-bold text-gray-500 font-mono uppercase">
                            {isHome ? match.homeTeam : match.awayTeam}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white mt-0.5">
                          {evt.player}
                        </h5>
                        {evt.detail && (
                          <p className="text-[10px] text-gray-500 font-mono">
                            {evt.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive stats comparison */}
          <div>
            <h4 className="text-[10px] font-mono font-black text-gray-400 tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#00dd53]" /> Match Data Metrics
            </h4>

            <div className="space-y-4">
              {/* Possession bar */}
              <div>
                <div className="flex justify-between text-[10px] font-mono font-bold text-gray-400 mb-1">
                  <span>{homePossession}%</span>
                  <span className="uppercase tracking-wider text-gray-500 text-[9px]">POSSESSION</span>
                  <span>{awayPossession}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-none flex overflow-hidden">
                  <div className="bg-[#00dd53] h-full" style={{ width: `${homePossession}%` }}></div>
                  <div className="bg-white h-full" style={{ width: `${awayPossession}%` }}></div>
                </div>
              </div>

              {/* Goal-scoring attempts */}
              <div>
                <div className="flex justify-between text-[10px] font-mono font-bold text-gray-400 mb-1">
                  <span>{homeShots}</span>
                  <span className="uppercase tracking-wider text-gray-500 text-[9px]">SHOTS ON TARGET</span>
                  <span>{awayShots}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-none flex overflow-hidden">
                  <div className="bg-[#00dd53] h-full" style={{ width: `${(homeShots / (homeShots + awayShots || 1)) * 100}%` }}></div>
                  <div className="bg-white h-full" style={{ width: `${(awayShots / (homeShots + awayShots || 1)) * 100}%` }}></div>
                </div>
              </div>

              {/* Fouls */}
              <div>
                <div className="flex justify-between text-[10px] font-mono font-bold text-gray-400 mb-1">
                  <span>{homeFouls}</span>
                  <span className="uppercase tracking-wider text-gray-500 text-[9px]">SQUAD FOULS</span>
                  <span>{awayFouls}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-none flex overflow-hidden">
                  <div className="bg-[#00dd53] h-full" style={{ width: `${(homeFouls / (homeFouls + awayFouls || 1)) * 100}%` }}></div>
                  <div className="bg-white h-full" style={{ width: `${(awayShots / (homeShots + awayShots || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Strategic/tactical commentary snippet */}
            <div className="bg-[#0c0c0e]/60 p-4 rounded-none border border-white/[0.05] mt-6 text-[11px] leading-relaxed text-gray-400 font-mono">
              <span className="text-[#00dd53] font-extrabold uppercase">ANALYST ADVISORY:</span>{' '}
              {match.id === 'match-1' 
                ? 'High counter-pressing and intense passing triangles down the left flank are producing deep defensive coverage, while City channels deep switches.' 
                : match.id === 'match-2'
                ? 'High verticality on counter-attacks. Real Madrid utilized Vinicius Jr. pacing down empty channels, stretching the Barcelona high defensive line.'
                : 'Leveraging structural discipline to nullify central pockets of space.'}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-10 border-t border-white/[0.06] text-gray-400 flex flex-col items-center justify-center">
          <Calendar className="h-8 w-8 text-[#00dd53] mb-3 opacity-90" />
          <h4 className="font-display font-medium text-white text-xs uppercase tracking-wide">Fixture has not commenced</h4>
          <p className="text-[11px] text-gray-500 max-w-sm mt-1 font-mono">
            Full timelines and real-time statistics panels will activate immediately upon kickoff at {match.stadium}.
          </p>
        </div>
      )}
    </div>
  );
}
