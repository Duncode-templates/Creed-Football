import React, { useState, useEffect } from 'react';
import { Shield, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories?: string[];
  searchQuery?: string;
}

export default function Header({ onSearch, activeCategory, setActiveCategory, categories, searchQuery = '' }: HeaderProps) {
  const [searchVal, setSearchVal] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  const navItems = (categories && categories.length > 0) ? categories : ['Analysis', 'Transfers', 'News'];

  return (
    <header className="sticky top-0 z-50 bg-[#0c0c0e]/60 backdrop-blur-[24px] border-b border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent before:pointer-events-none">
      {/* iOS highlight gloss glow */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"></div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4 relative z-101">
        {/* Brand Logo - No border radius */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveCategory(navItems[0])}>
          <img
            src="https://od.lk/s/MjNfNzg4NjY3NDZf/1000378993-removebg-preview.png"
            alt="Creed Football Logo"
            className="h-10 w-auto object-contain select-none"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-display font-black tracking-tight text-white text-lg leading-none">
              CREED
            </span>
            <span className="text-[9px] font-mono tracking-widest text-gray-400 font-bold uppercase leading-tight">
              FOOTBALL EDITION
            </span>
          </div>
        </div>

        {/* Center Search bar - No border radius */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full bg-[#121216]/85 border border-white/[0.08] rounded-none pl-10 pr-4 py-1.5 text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#00dd53] focus:ring-1 focus:ring-[#00dd53]/20 transition-all"
            placeholder="Search news, player rumors, clubs..."
            value={searchVal}
            onChange={handleSearchChange}
          />
        </div>

        {/* Action button - No border radius */}
        <div className="flex items-center gap-4">
          <a
            href="#match-center"
            className="hidden sm:inline-flex items-center gap-1.5 bg-white text-black font-display font-bold text-xs px-4 py-2 rounded-none hover:bg-[#00dd53] hover:shadow-[0_0_12px_rgba(0,221,83,0.5)] transition-all uppercase tracking-wider"
          >
            <Shield className="h-3.5 w-3.5" /> Match Centre
          </a>

          <button
            className="md:hidden text-white p-1 hover:text-[#00dd53] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Categories submenus (Desktop) */}
      <div className="hidden md:block bg-white/[0.01] border-t border-white/[0.04] backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-6 h-11 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {navItems.map((item) => {
              const isActive = activeCategory === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveCategory(item)}
                  className={`px-4 py-3 text-xs font-display font-bold tracking-wider uppercase transition-all duration-150 border-b-2 relative shrink-0 ${
                    isActive
                      ? 'text-[#00dd53] border-[#00dd53]'
                      : 'text-gray-400 hover:text-white border-transparent'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile submenu - No border radius */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c0e]/95 border-t border-white/[0.08] p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="w-full bg-[#121216] border border-white/[0.08] rounded-none pl-10 pr-4 py-2 text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#00dd53] transition-all"
              placeholder="Search news, players..."
              value={searchVal}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeCategory === item;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveCategory(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-none justify-between items-center flex text-sm font-display font-semibold transition-all ${
                    isActive
                      ? 'bg-[#00dd53]/10 text-[#00dd53] border-l-4 border-[#00dd53] pl-4'
                      : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <div className="border-t border-white/[0.06] pt-4">
            <a
              href="#match-center"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center gap-2 bg-[#00dd53] text-[#0c0c0e] font-display font-extrabold text-xs py-3 rounded-none hover:bg-white transition-all uppercase tracking-wider"
            >
              <Shield className="h-4 w-4" /> Match Centre
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
