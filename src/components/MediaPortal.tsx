import React, { useState, useMemo } from 'react';
import { 
  Play, 
  DownloadCloud, 
  Sparkles, 
  Flame, 
  Film, 
  Tv, 
  Gamepad2, 
  Monitor, 
  Languages, 
  Star, 
  Calendar, 
  HardDrive, 
  Copy, 
  Check, 
  Info,
  Filter
} from 'lucide-react';
import { FtpFileItem } from '../types/ftp';
import { MEDIA_ITEMS } from '../data/ftpData';

interface MediaPortalProps {
  onPlayItem: (item: FtpFileItem) => void;
  onDownloadItem: (item: FtpFileItem) => void;
  searchQuery: string;
}

export const MediaPortal: React.FC<MediaPortalProps> = ({
  onPlayItem,
  onDownloadItem,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'rating' | 'downloads' | 'newest'>('trending');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Spotlight featured movie
  const featuredItem = MEDIA_ITEMS.find((item) => item.id === 'toofan-2024') || MEDIA_ITEMS[0];

  const handleCopyLink = (item: FtpFileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const ftpLink = `ftp://ftp.neonbadda.bd${item.path}`;
    navigator.clipboard.writeText(ftpLink);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = useMemo(() => {
    let result = [...MEDIA_ITEMS];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.language && item.language.toLowerCase().includes(q)) ||
          (item.subCategory && item.subCategory.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Quality filter
    if (selectedQuality !== 'all') {
      result = result.filter((item) => item.quality?.toLowerCase().includes(selectedQuality.toLowerCase()));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'trending') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
      if (sortBy === 'newest') return (b.year || 0) - (a.year || 0);
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, selectedQuality, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Featured Spotlight Banner (Hero) */}
      {!searchQuery && (
        <div className="relative rounded-2xl overflow-hidden border border-cyan-900/40 bg-slate-900 shadow-2xl shadow-cyan-950/40">
          <div className="absolute inset-0">
            <img 
              src={featuredItem.thumbnail} 
              alt={featuredItem.name}
              className="w-full h-full object-cover object-center filter brightness-40 blur-[1px] transform scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          </div>

          <div className="relative p-6 sm:p-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-md">
                <Flame className="w-3.5 h-3.5" />
                #1 TRENDING ON BDIX
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                {featuredItem.quality}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {featuredItem.rating}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {featuredItem.name}
            </h2>

            <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
              {featuredItem.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                {featuredItem.size}
              </span>
              <span>•</span>
              <span>Codec: {featuredItem.codec}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">⚡ BDIX 100Mbps Direct Link</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onPlayItem(featuredItem)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer transform hover:scale-102"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Stream on BDIX</span>
              </button>

              <button
                onClick={() => onDownloadItem(featuredItem)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700/80 transition-all cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4 text-cyan-400" />
                <span>Fast FTP Download</span>
              </button>

              <button
                onClick={(e) => handleCopyLink(featuredItem, e)}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title="Copy direct FTP URL"
              >
                {copiedId === featuredItem.id ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Sort Controls */}
      <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Files', icon: Sparkles },
            { id: 'bangla', label: 'Bangla Cinema & Natok', icon: Film },
            { id: 'movies', label: 'Hollywood & Bollywood', icon: Film },
            { id: 'tv', label: 'TV & Web Series', icon: Tv },
            { id: 'games', label: 'PC Games Repacks', icon: Gamepad2 },
            { id: 'software', label: 'Software & OS ISO', icon: Monitor },
            { id: 'anime', label: 'Anime Hub', icon: Film },
          ].map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quality and Sort selects */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs">
          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Resolutions</option>
            <option value="4K">4K UltraHD</option>
            <option value="1080p">1080p Full HD</option>
            <option value="720p">720p HD</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="trending">Sort: Trending</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="downloads">Sort: Most Downloaded</option>
            <option value="newest">Sort: Release Year</option>
          </select>
        </div>
      </div>

      {/* Grid of Media Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Neon Badda FTP Library'}
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {filteredItems.length} items available
            </span>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            Direct high-speed FTP links from <span className="font-mono text-slate-300">ftp.neonbadda.bd</span>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            <Info className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">No files matching your search</h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
              We couldn't find "{searchQuery}" in the current category. You can try searching all files or request it to be added by Neon Badda sysadmins.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedQuality('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onPlayItem(item)}
                className="group relative bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col cursor-pointer"
              >
                {/* Poster / Thumbnail with overlays */}
                <div className="relative aspect-video sm:aspect-16/10 overflow-hidden bg-slate-950">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  {/* Badges on top */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {item.quality && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-xs">
                        {item.quality}
                      </span>
                    )}
                    {item.isTrending && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-600/90 text-white flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> Hot
                      </span>
                    )}
                  </div>

                  {/* Rating on top right */}
                  {item.rating && (
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-xs px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 text-[11px] font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  )}

                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom bar inside thumbnail */}
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                    <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300">
                      {item.size}
                    </span>
                    {item.year && <span className="text-slate-400">{item.year}</span>}
                  </div>
                </div>

                {/* Content details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-white font-bold text-sm leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {item.name}
                    </h4>
                    {item.language && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        🌐 {item.language}
                      </p>
                    )}
                    {item.subCategory && (
                      <span className="inline-block mt-1 text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {item.subCategory}
                      </span>
                    )}
                  </div>

                  {/* Action buttons footer */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadItem(item);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-medium border border-cyan-800/40 transition-colors"
                      title="Download via BDIX"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={(e) => handleCopyLink(item, e)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copy FTP Link"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
