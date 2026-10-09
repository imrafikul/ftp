import React, { useState } from 'react';
import { 
  Tv, 
  Play, 
  Radio, 
  DownloadCloud, 
  Signal, 
  Volume2, 
  ListFilter, 
  Check, 
  Copy,
  Flame,
  Activity
} from 'lucide-react';
import { IptvChannel } from '../types/ftp';
import { IPTV_CHANNELS } from '../data/ftpData';

export const LiveIptvPlayer: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<IptvChannel>(IPTV_CHANNELS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedM3u, setCopiedM3u] = useState(false);

  const categories = ['All', 'Sports', 'Bangla News', 'Bangla Entertainment'];

  const filteredChannels = selectedCategory === 'All'
    ? IPTV_CHANNELS
    : IPTV_CHANNELS.filter((ch) => ch.category === selectedCategory);

  const copyM3uLink = () => {
    navigator.clipboard.writeText('http://ftp.neonbadda.bd:8080/live/neon_bdix_iptv_playlist.m3u');
    setCopiedM3u(true);
    setTimeout(() => setCopiedM3u(false), 2000);
  };

  const downloadM3uFile = () => {
    const playlistContent = `#EXTM3U
#EXTINF:-1 tvg-id="tsports" tvg-name="T Sports HD" group-title="Sports",T Sports HD (BDIX)
http://ftp.neonbadda.bd:8080/live/tsports_hd.m3u8
#EXTINF:-1 tvg-id="gtv" tvg-name="Gazi TV" group-title="Sports",Gazi TV (GTV Sports)
http://ftp.neonbadda.bd:8080/live/gtv_hd.m3u8
#EXTINF:-1 tvg-id="somoy" tvg-name="Somoy News" group-title="News",Somoy News TV HD
http://ftp.neonbadda.bd:8080/live/somoy_news.m3u8
#EXTINF:-1 tvg-id="jamuna" tvg-name="Jamuna TV" group-title="News",Jamuna Television HD
http://ftp.neonbadda.bd:8080/live/jamuna_tv.m3u8
#EXTINF:-1 tvg-id="btv" tvg-name="BTV World" group-title="Bangla",BTV World National
http://ftp.neonbadda.bd:8080/live/btv_world.m3u8
#EXTINF:-1 tvg-id="channeli" tvg-name="Channel i" group-title="Bangla",Channel i HD
http://ftp.neonbadda.bd:8080/live/channel_i.m3u8
#EXTINF:-1 tvg-id="starsports" tvg-name="Star Sports 1 HD" group-title="Sports",Star Sports 1 HD BDIX
http://ftp.neonbadda.bd:8080/live/star_sports_1.m3u8
`;
    const blob = new Blob([playlistContent], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NeonBadda_BDIX_IPTV_2026.m3u';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Tv className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Neon BDIX Live IPTV Streaming
                </h2>
                <span className="flex items-center gap-1 text-[11px] font-bold bg-rose-950 text-rose-400 border border-rose-800/40 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  LIVE FEED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Zero-buffer local BDIX IPTV network for Neon Broadband subscribers (Badda Node)
              </p>
            </div>
          </div>
        </div>

        {/* M3U Playlist actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyM3uLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedM3u ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedM3u ? 'Copied M3U URL!' : 'Copy M3U Link'}</span>
          </button>

          <button
            onClick={downloadM3uFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Download .M3U Playlist</span>
          </button>
        </div>
      </div>

      {/* Main Player & Channel Guide Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden border border-cyan-900/40 shadow-2xl aspect-video flex items-center justify-center">
            <video
              key={selectedChannel.id}
              src={selectedChannel.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>

            {/* Live Indicator overlay */}
            <div className="absolute top-3 left-3 bg-rose-600/90 text-white font-bold text-xs px-2.5 py-1 rounded flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>LIVE</span>
              <span className="text-rose-200 text-[10px] ml-1">| {selectedChannel.quality}</span>
            </div>

            {/* Watermark overlay */}
            <div className="absolute bottom-12 right-3 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-slate-800 pointer-events-none">
              ftp.neonbadda.bd:8080/live
            </div>
          </div>

          {/* Currently playing channel details */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedChannel.logo}</span>
              <div>
                <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                  {selectedChannel.name}
                  <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    BDIX Multicast
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Now Broadcasting: <span className="text-cyan-300 font-medium">{selectedChannel.currentShow}</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold">Bitrate: 6.2 Mbps (H.264)</span>
              <span>Audio: AAC Stereo 192k</span>
            </div>
          </div>
        </div>

        {/* Right: Channels Guide */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-cyan-400" />
              <span>Channels List ({filteredChannels.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">BDIX Fast Feed</span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Channels Scroll list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/40">
            {filteredChannels.map((channel) => {
              const isSelected = selectedChannel.id === channel.id;
              return (
                <div
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/50 shadow-md'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-2xl shrink-0">{channel.logo}</span>
                    <div className="truncate">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {channel.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {channel.currentShow}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    )}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {channel.quality}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick VLC instructions */}
          <div className="pt-3 mt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Playable on VLC / Android TV / Smart TV</span>
            <span className="font-mono text-cyan-400">Port 8080</span>
          </div>
        </div>
      </div>
    </div>
  );
};
