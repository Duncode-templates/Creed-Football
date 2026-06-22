/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import MatchTicker from './components/MatchTicker';
import ActiveMatchDrawer from './components/ActiveMatchDrawer';
import FeaturedHero from './components/FeaturedHero';
import NewsFeed from './components/NewsFeed';
import ArticlePage from './components/ArticlePage';
import ClubNews from './components/ClubNews';
import SEO from './components/SEO';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import { fetchArticlesFromFirebase, getStoredFirebaseConfig } from './firebase';
import { mockArticles } from './footballData';
import { Match, NewsArticle } from './types';
import { Newspaper, Check, ChevronUp, Database } from 'lucide-react';



export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [currentStaticPage, setCurrentStaticPage] = useState<'about' | 'privacy' | 'terms' | null>(null);

  // Connection and Dynamic Articles State
  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string>('');

  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Load cached first for ultra-fast rendering to satisfy: "the news fetching process should be fast"
  useEffect(() => {
    const cached = localStorage.getItem('creed_cached_articles');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
          setSyncStatus('success');
        }
      } catch (e) {}
    }
  }, []);

  // Fetch from Firebase and update cache
  const fetchDbArticles = async () => {
    const config = getStoredFirebaseConfig();
    if (!config) {
      return;
    }

    setSyncStatus('loading');
    setSyncError('');
    try {
      const dbArticles = await fetchArticlesFromFirebase();
      if (dbArticles && dbArticles.length > 0) {
        // Sort explicitly by date descending to prioritize "most recent ones" as requested
        const sorted = [...dbArticles].sort((a, b) => {
          const tA = new Date(a.date).getTime();
          const tB = new Date(b.date).getTime();
          return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
        });
        
        setArticles(sorted);
        localStorage.setItem('creed_cached_articles', JSON.stringify(sorted));
        setSyncStatus('success');
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatus('error');
      setSyncError(err?.message || 'Failed to fetch items from Firestore.');
    }
  };

  useEffect(() => {
    fetchDbArticles();
  }, []);

  // Filter hero article based on popular soccer keywords, prioritizing "live" in title
  const featuredArticle = useMemo(() => {
    // First, prioritize any article with "live" in the title (case-insensitive)
    const liveArticle = articles.find(art => art.title.toLowerCase().includes('live'));
    if (liveArticle) {
      return liveArticle;
    }

    const popularKeywords = [
      'chelsea', 'arsenal', 'manchester', 'madrid', 'barcelona', 'liverpool', 
      'city', 'bayern', 'psg', 'united', 'bellingham', 'haaland', 'saka', 
      'mbappe', 'messi', 'ronaldo', 'england', 'france', 'spain', 'germany'
    ];

    return articles.find(art => {
      const textToSearch = (art.title + ' ' + art.summary + ' ' + art.content).toLowerCase();
      return popularKeywords.some(kw => textToSearch.includes(kw));
    }) || null;
  }, [articles]);

  // Dynamically compute authentic categories from loaded articles
  const dynamicCategories = useMemo(() => {
    const catsSet = new Set<string>();
    articles.forEach((art) => {
      if (art.category && art.category.trim() !== '') {
        catsSet.add(art.category.trim());
      }
      if (Array.isArray(art.tags)) {
        art.tags.forEach((item) => {
          if (item && item.trim() !== '') {
            catsSet.add(item.trim());
          }
        });
      }
    });
    
    // Ensure "All News" is not in the set of categories
    const searchValLower = 'all news';
    Array.from(catsSet).forEach((cat) => {
      if (cat.trim().toLowerCase() === searchValLower) {
        catsSet.delete(cat);
      }
    });

    const uniqueCats = Array.from(catsSet);

    // Shuffle unique categories randomly
    const shuffled = [...uniqueCats];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    // Return 'All News' followed by up to 9 randomized categories
    return ['All News', ...shuffled.slice(0, 9)];
  }, [articles]);

  // Set default active category
  useEffect(() => {
    if (dynamicCategories.length > 0 && !activeCategory) {
      setActiveCategory(dynamicCategories[0]);
    }
  }, [dynamicCategories, activeCategory]);

  // Filtering news list based on segment category and search query
  const filteredArticles = useMemo(() => {
    let list = articles;

    // Deduplicate: If an article is displayed in the FeaturedHero, filter it out!
    if (featuredArticle) {
      list = list.filter((art) => art.id !== featuredArticle.id);
    }

    if (activeCategory && activeCategory.trim().toLowerCase() !== 'all news') {
      list = list.filter((art) => {
        const matchesCategory = art.category.trim().toLowerCase() === activeCategory.trim().toLowerCase();
        const matchesTags = Array.isArray(art.tags) && art.tags.some(t => t.trim().toLowerCase() === activeCategory.trim().toLowerCase());
        return matchesCategory || matchesTags;
      });
    }

    // Filter on search text query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          (art.tag && art.tag.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      const tA = new Date(a.date).getTime();
      const tB = new Date(b.date).getTime();
      return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
    });
  }, [articles, activeCategory, searchQuery, featuredArticle]);

  // Find specifically matched articles loaded from the live Firestore database
  const matchedFirestoreArticles = useMemo(() => {
    const firestoreList = articles.filter(art => art.isFromFirestore);
    if (!searchQuery.trim()) {
      return firestoreList; // Default list when no queries are set
    }
    const q = searchQuery.toLowerCase();
    return firestoreList.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        (art.tag && art.tag.toLowerCase().includes(q))
    );
  }, [articles, searchQuery]);

  // Dynamically compute sections for top authentic categories with > 5 articles
  const uniqueSections = useMemo(() => {
    const catsSet = new Set<string>();
    articles.forEach((art) => {
      if (art.category && art.category.trim() !== '') {
        catsSet.add(art.category.trim());
      }
    });

    const uniqueCats = Array.from(catsSet);

    const validSections = uniqueCats.map((cat) => {
      const matched = articles.filter((art) => {
        return art.category.trim().toLowerCase() === cat.trim().toLowerCase();
      });

      return {
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        title: `🔥 ${cat} Arena`,
        badge: cat.toUpperCase(),
        description: `Delivering premium coverage, strategic analyses, and raw updates for the ${cat} section.`,
        articles: matched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        count: matched.length
      };
    }).filter(sec => sec.count > 5);

    return validSections.slice(0, 3);
  }, [articles]);

  // --- COMPACT CLIENT ROTATION ENGINE ---
  useEffect(() => {
    const parseUrlHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/article/')) {
        const articleId = hash.replace('#/article/', '');
        const found = articles.find((art) => art.id === articleId);
        if (found) {
          setSelectedArticle(found);
          setCurrentStaticPage(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash === '#/about') {
        setCurrentStaticPage('about');
        setSelectedArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#/privacy') {
        setCurrentStaticPage('privacy');
        setSelectedArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#/terms') {
        setCurrentStaticPage('terms');
        setSelectedArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#/category/')) {
        const cat = decodeURIComponent(hash.replace('#/category/', ''));
        setActiveCategory(cat);
        setSelectedArticle(null);
        setCurrentStaticPage(null);
        setSearchQuery('');
        setTimeout(() => {
          const el = document.getElementById('category-section-main');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else if (hash.startsWith('#/search/')) {
        const query = decodeURIComponent(hash.replace('#/search/', ''));
        setSearchQuery(query);
        setSelectedArticle(null);
        setCurrentStaticPage(null);
      } else if (hash === '#/' || !hash) {
        setSelectedArticle(null);
        setCurrentStaticPage(null);
      }
    };

    window.addEventListener('hashchange', parseUrlHash);
    
    // Resolve immediately on data load
    if (articles.length > 0) {
      parseUrlHash();
    }

    return () => {
      window.removeEventListener('hashchange', parseUrlHash);
    };
  }, [articles]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const targetHash = `#/search/${encodeURIComponent(query)}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    } else {
      if (window.location.hash && window.location.hash.startsWith('#/search/')) {
        window.location.hash = '#/';
      }
    }
  };

  const handleCategoryClick = (cat: string) => {
    window.location.hash = `#/category/${encodeURIComponent(cat)}`;
  };

  const handleArticleClick = (art: NewsArticle) => {
    window.location.hash = `#/article/${art.id}`;
  };

  const handleSubscribed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white selection:bg-[#00dd53] selection:text-black font-sans rounded-none">
      
      {/* General Search Engine Optimization dynamic injector */}
      {!selectedArticle && (
        <SEO 
          title={activeCategory && activeCategory !== 'All News' 
            ? `${activeCategory} Football News & Analysis | Creed Football` 
            : searchQuery 
              ? `Search results for "${searchQuery}" | Creed Football` 
              : undefined
          } 
        />
      )}

      {/* Sleek Navigation Bar */}
      <Header
        onSearch={handleSearch}
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryClick}
        categories={dynamicCategories}
        searchQuery={searchQuery}
      />

      {/* Main Container Stage wrapper */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 font-sans transition-all duration-300 rounded-none w-full">
        
        {currentStaticPage === 'about' && <AboutPage />}
        {currentStaticPage === 'privacy' && <PrivacyPolicyPage />}
        {currentStaticPage === 'terms' && <TermsOfServicePage />}

        {!currentStaticPage && (
          selectedArticle ? (
            <ArticlePage
              article={selectedArticle}
              onClose={() => { window.location.hash = '#/'; }}
              articles={articles}
              onSelectArticle={handleArticleClick}
            />
          ) : (
            <>
              {/* Top-tier Featured Story banner */}
            {!searchQuery && featuredArticle && (
              <FeaturedHero
                article={featuredArticle}
                onReadMore={handleArticleClick}
              />
            )}

            {/* LIVE MATCH Scoreboards (Strictly right after hero banner) */}
            {!searchQuery && (
              <MatchTicker
                onSelectMatch={setSelectedMatch}
                selectedMatch={selectedMatch}
              />
            )}

            {/* Loading sync notification */}
            {syncStatus === 'loading' && articles.length === 0 && (
              <div className="py-12 text-center text-xs font-mono text-gray-500 tracking-wider">
                SYNCING SECURE FLUID DIRECTORY WIRE...
              </div>
            )}



            {/* Render Category News or Custom Filtering Keywords Sections */}
            <div className="space-y-12 mt-6">
              {(activeCategory && activeCategory.trim().toLowerCase() !== 'all news') || searchQuery.trim() ? (
                // Focused display when a category segment or search query is set
                <section id="category-section-main" className="scroll-mt-24">
                  <NewsFeed
                    articles={filteredArticles}
                    onReadArticle={handleArticleClick}
                    selectedCategory={activeCategory || 'LATEST NEWS'}
                  />
                  {filteredArticles.length === 0 && (
                    <div className="py-12 border border-white/[0.05] text-center text-gray-500 font-semibold text-xs rounded-none bg-white/[0.01]">
                      No reports correspond with your search filters.
                    </div>
                  )}
                </section>
              ) : (
                // Home Landing Page: Render beautiful dedicated keyword-based sections
                <div className="space-y-16 mt-8">
                  {uniqueSections.map((sec) => (
                    <section key={sec.id} id={`section-${sec.id}`} className="scroll-mt-24 border-b border-white/[0.04] pb-12 last:border-0 last:pb-0">
                      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-white/[0.06] pb-3">
                        <div>
                          <h2 className="text-sm font-mono font-black text-white flex items-center gap-2 tracking-wider uppercase">
                            {sec.title}
                          </h2>
                          <p className="text-[11px] text-gray-500 font-sans mt-0.5">{sec.description}</p>
                        </div>
                        <span className="text-[9px] font-mono text-[#00dd53] bg-[#00dd53]/10 border border-[#00dd53]/25 px-2 py-0.5 font-bold uppercase tracking-wider">
                          {sec.badge}
                        </span>
                      </div>
                      <NewsFeed
                        articles={sec.articles}
                        onReadArticle={handleArticleClick}
                        selectedCategory={sec.badge}
                      />
                    </section>
                  ))}
                  {uniqueSections.length === 0 && (
                    <div className="py-12 border border-white/[0.05] text-center text-gray-500 font-semibold text-xs rounded-none bg-white/[0.01]">
                      No reports match the custom sections.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CLUBS CATEGORY NEWS WIRE (Appear last!) */}
            {!searchQuery && articles.length > 0 && (
              <div id="category-section-club-wire" className="mt-12 pt-8 border-t border-white/[0.06]">
                <ClubNews
                  articles={articles}
                  onReadArticle={handleArticleClick}
                />
              </div>
            )}

            {/* Dynamic active timeline drawer for standard simulations */}
            {selectedMatch && (
              <ActiveMatchDrawer
                match={selectedMatch}
                onClose={() => setSelectedMatch(null)}
              />
            )}
          </>
        ))}

      </main>

      {/* Styled Footer containing pitch dispatch newsletter cleanly as requested */}
      <footer className="border-t border-white/[0.08] mt-20 py-12 px-6 bg-[#0a0a0c]/80 relative z-20 rounded-none w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* Bio block & Links */}
          <div className="space-y-4 rounded-none">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { if (dynamicCategories.length > 0) handleCategoryClick(dynamicCategories[0]); }}>
              <img
                src="https://od.lk/s/MjNfNzg4NjY3NDZf/1000378993-removebg-preview.png"
                alt="Creed Football Logo"
                className="h-8 w-auto object-contain select-none"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-black text-white text-base tracking-tight">
                CREED FOOTBALL
              </span>
            </div>
            <p className="text-[11px] font-sans text-gray-500 leading-relaxed max-w-sm">
              Your elite, high-performance tactical center for football reports and Live match dynamics. Real-time updates delivered with precision.
            </p>
            <div className="text-[11px] text-gray-655 font-mono">
              <p>© {new Date().getFullYear()} Creed Vault. All rights reserved.</p>
              <div className="flex gap-4 mt-2">
                <a href="#/about" className="hover:text-[#00dd53] transition-colors">About</a>
                <a href="#/privacy" className="hover:text-[#00dd53] transition-colors">Privacy</a>
                <a href="#/terms" className="hover:text-[#00dd53] transition-colors">Terms</a>
              </div>
            </div>
          </div>

          {/* Newsletter Pitch Dispatch in Footer */}
          <div className="space-y-3 rounded-none">
            <div className="flex items-center gap-1.5">
              <Newspaper className="h-4 w-4 text-[#00dd53]" />
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-white">
                THE PITCH DISPATCH NEWSLETTER
              </span>
            </div>
            
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              Receive immediate breaking news bulletins, exclusive transfer notifications, and tactical scouting reports directly in your inbox.
            </p>

            {!newsletterSubscribed ? (
              <form onSubmit={handleSubscribed} className="flex gap-1.5 w-full rounded-none">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-none text-xs py-2 px-3 focus:outline-none focus:border-[#00dd53] text-white placeholder-gray-500 font-mono"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-none bg-[#00dd53] text-black font-semibold text-xs hover:bg-white transition cursor-pointer"
                >
                  JOIN
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#00dd53]/10 border border-[#00dd53]/30 text-[#00dd53] rounded-none p-2.5 text-xs font-semibold">
                <Check className="h-4 w-4 shrink-0" />
                <span>Subscribed successfully to Pitch Dispatch.</span>
              </div>
            )}
          </div>

        </div>
      </footer>

      {/* Scroll-to-top micro button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-2 rounded-none bg-white/5 border border-white/10 text-gray-400 hover:text-[#00dd53] hover:border-[#00dd53] transition-all z-40 cursor-pointer"
        title="Scroll to Top"
      >
        <ChevronUp className="h-4 w-4" />
      </button>

    </div>
  );
}
