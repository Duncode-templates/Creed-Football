import React, { useEffect, useState } from 'react';
import { NewsArticle } from '../types';
import Markdown from 'react-markdown';
import { ArrowLeft, ArrowRight, Share2, ClipboardCheck, User } from 'lucide-react';

interface ArticlePageProps {
  article: NewsArticle;
  onClose: () => void;
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export default function ArticlePage({ article, onClose, articles, onSelectArticle }: ArticlePageProps) {
  const [copied, setCopied] = useState(false);

  // Automatically scroll to the top of the article on mount/change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article]);

  // Related news based on categories/tags
  const relatedArticles = React.useMemo(() => {
    const sameCategoryOrTag = articles.filter(
      (art) => art.id !== article.id && (art.category === article.category || art.tag === article.tag)
    );
    if (sameCategoryOrTag.length > 0) {
      return sameCategoryOrTag.slice(0, 5);
    }
    return articles.filter((art) => art.id !== article.id).slice(0, 5);
  }, [articles, article]);

  const handleShare = () => {
    navigator.clipboard.writeText(`${article.title} - Read live on Creed Football`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full text-white font-sans animate-fade-in py-4">
      
      {/* Back navigation button */}
      <div className="mb-6">
        <button 
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-mono font-extrabold text-[#00dd53] hover:text-white transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO DISPATCH FEEDS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-14 w-full items-start">
        
        {/* Left Column: Full-width Article details */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main header banner image (Displayed strictly FULL SIZE, no ratio crops) */}
          <div className="relative w-full rounded-none overflow-hidden shadow-2xl bg-black">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-auto block select-none max-h-[550px] object-contain mx-auto rounded-none"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="pt-2">
            {/* Meta headers (No Minutes Read, No Author on card, clean category representation) */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-gray-400 mb-4 uppercase tracking-widest font-bold">
              <span className="font-extrabold text-[#00dd53]">{article.tag}</span>
              <span className="text-gray-700 font-extrabold">•</span>
              <span>{article.category}</span>
              <span className="text-gray-700 font-extrabold">•</span>
              <span>{article.date}</span>
            </div>

            {/* Nice clean Title */}
            <h1 className="font-sans font-black text-2xl sm:text-3xl text-white leading-tight mb-6 tracking-tight">
              {article.title}
            </h1>

            {/* Minimalist Author UI Segment (rounded-none, only display essential metadata) */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/[0.06] mb-8">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white/5 border border-white/10 rounded-none flex items-center justify-center font-bold text-xs text-[#00dd53]">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold block text-sm text-white">DATE PUBLISHED</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">{article.date}</span>
                </div>
              </div>

              {/* Share block replacing any saves */}
              <button
                onClick={handleShare}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                  copied 
                    ? 'bg-[#00dd53]/10 text-[#00dd53] border border-[#00dd53]/30' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="h-3.5 w-3.5" /> COPIED LINK
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" /> SHARE REPORT
                  </>
                )}
              </button>
            </div>

            {/* Content body with responsive sizing */}
            <div className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans max-w-none">
              {article.summary && (
                <div className="bg-white/[0.01] border-l-3 border-[#00dd53] p-5 rounded-none mb-8 italic text-gray-200 text-xs sm:text-sm font-medium leading-relaxed font-sans">
                  {article.summary}
                </div>
              )}
              
              <div className="mt-4 break-words">
                <Markdown
                  components={{
                    h1: (props) => <h1 className="text-sm sm:text-base font-black text-white mt-8 mb-3 border-b border-white/[0.06] pb-1.5 uppercase tracking-wide rounded-none" {...props} />,
                    h2: (props) => <h2 className="text-xs sm:text-sm font-bold text-white mt-6 mb-2 uppercase tracking-wide rounded-none" {...props} />,
                    h3: (props) => <h3 className="text-xs font-semibold text-gray-200 mt-5 mb-1.5 rounded-none" {...props} />,
                    p: (props) => {
                       const text = props.children ? String(props.children) : '';
                       const containsImageLink = /\.(jpg|jpeg|png|webp|gif|svg|bmp)([?#].*)?$/i.test(text.trim());
                       if (containsImageLink) {
                         return (
                           <span className="block my-6">
                             <img
                               src={text.trim()}
                               alt="Embedded Story Media"
                               className="w-full rounded-none border border-white/[0.06] object-contain max-h-[450px]"
                               referrerPolicy="no-referrer"
                             />
                           </span>
                         );
                       }
                       return <p className="mb-4 leading-relaxed text-gray-300 text-xs sm:text-sm font-sans" {...props} />;
                    },
                    ul: (props) => <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-1.5" {...props} />,
                    ol: (props) => <ol className="list-decimal pl-5 mb-4 text-gray-300 space-y-1.5" {...props} />,
                    li: (props) => <li className="mb-1 text-xs sm:text-sm" {...props} />,
                    strong: (props) => <strong className="font-bold text-white hover:text-[#00dd53] transition-colors" {...props} />,
                    a: (props) => {
                      const href = props.href || '';
                      const isImageLink = /\.(jpg|jpeg|png|webp|gif|svg|bmp)([?#].*)?$/i.test(href) || 
                                          href.includes('i.guim.co.uk') || 
                                          href.includes('media.guim.co.uk') || 
                                          href.includes('images.unsplash.com');
                      if (isImageLink) {
                        return (
                          <span className="block my-6">
                            <img
                              src={href}
                              alt={props.children ? String(props.children) : 'Embedded Media'}
                              className="w-full rounded-none border border-white/[0.06] object-contain max-h-[450px]"
                              referrerPolicy="no-referrer"
                            />
                            {props.children && (
                              <span className="block text-center text-[10px] text-gray-400 mt-1 font-mono italic">
                                {String(props.children)}
                              </span>
                            )}
                          </span>
                        );
                      }
                      return (
                        <a 
                          className="text-[#00dd53] underline hover:text-white transition-colors font-semibold" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          {...props} 
                        />
                      );
                    },
                    img: ({ node, ...props }) => (
                      <span className="block my-6">
                        <img
                          className="w-full rounded-none border border-white/[0.06] object-contain max-h-[450px]"
                          referrerPolicy="no-referrer"
                          {...props}
                        />
                        {props.alt && (
                          <span className="block text-center text-[10px] text-gray-400 mt-1 font-mono italic">
                            {props.alt}
                          </span>
                        )}
                      </span>
                    ),
                  }}
                >
                  {article.content}
                </Markdown>
              </div>

              {/* Tag section directly after article ends displaying categories tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-10 pt-5 border-t border-white/[0.06]">
                  <span className="text-[9px] font-mono tracking-widest text-[#a8a8af] uppercase block mb-2.5 font-extrabold">
                    TAG INDEX
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tagItem, idx) => (
                      <span 
                        key={idx} 
                        className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-[10px] font-semibold text-gray-350 py-1 px-3 rounded-none hover:text-[#00dd53] transition-colors cursor-default font-sans"
                      >
                        #{tagItem}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Related News Section on the Right (No Emojis, No border-radius, no minutes read) */}
        <div className="lg:col-span-1 space-y-5 lg:border-l lg:border-white/[0.06] lg:pl-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] font-sans">
            <h3 className="font-sans font-black text-[10px] tracking-wider text-white uppercase flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-[#00dd53] rounded-none"></span>
              ALSO COVERED
            </h3>
            <span className="text-[9px] font-mono text-gray-500 uppercase font-bold">
              {article.category}
            </span>
          </div>

          <div className="space-y-3.5">
            {relatedArticles.length === 0 ? (
              <p className="text-[11px] text-gray-500 italic">No related articles found.</p>
            ) : (
              relatedArticles.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className="group cursor-pointer p-2 rounded-none hover:bg-white/[0.02] transition-all duration-200"
                >
                  <div className="flex gap-2.5">
                    <div className="h-14 w-16 flex-shrink-0 bg-black/40 rounded-none overflow-hidden border border-white/[0.05] relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[8px] font-bold text-[#00dd53] uppercase tracking-tight">{item.tag}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-[#00dd53] transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[8px] text-gray-500 font-mono mt-1 pt-0.5 border-t border-white/[0.03]">
                        <span>{item.date}</span>
                        <span className="inline-flex items-center gap-0.5 text-[#00dd53] font-bold group-hover:translate-x-0.5 transition-transform">
                          GO <ArrowRight className="h-2 w-2" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
