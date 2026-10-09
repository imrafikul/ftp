import React from 'react';
import { 
  Server, 
  FolderTree, 
  Film, 
  Tv, 
  Gauge, 
  Activity, 
  DownloadCloud, 
  PlusCircle, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { SERVER_CONFIG } from '../data/ftpData';

interface NavbarProps {
  currentView: 'portal' | 'raw' | 'iptv' | 'speedtest';
  onSelectView: (view: 'portal' | 'raw' | 'iptv' | 'speedtest') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  downloadCount: number;
  onOpenDownloads: () => void;
  onOpenDiagnostic: () => void;
  onRequestModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  searchQuery,
  onSearchChange,
  downloadCount,
  onOpenDownloads,
  onOpenDiagnostic,
  onRequestModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 text-white shadow-2xl">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 px-4 py-1.5 text-xs border-b border-cyan-800/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono font-semibold tracking-wide text-slate-200">
            {SERVER_CONFIG.host}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-medium">BDIX 10G Peering Active</span>
          <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
            [{SERVER_CONFIG.ip}] Middle Badda, Dhaka-1212
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-300 text-xs">
          <button 
            onClick={onOpenDiagnostic}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Check ping & server status"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="font-mono">Ping: {SERVER_CONFIG.avgLatency}</span>
          </button>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 hidden sm:inline">Uptime: {SERVER_CONFIG.uptime}</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <button
            onClick={onRequestModal}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Request Media</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onSelectView('portal')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-cyan-300/30">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                NEON BADDA
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                BDIX FTP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono -mt-0.5">
              ftp.neonbadda.bd
            </p>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectView('portal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'portal'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Media Portal</span>
          </button>

          <button
            onClick={() => onSelectView('raw')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'raw'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Index of / (Raw FTP)</span>
          </button>

          <button
            onClick={() => onSelectView('iptv')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'iptv'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="flex items-center gap-1.5">
              Live IPTV
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            </span>
          </button>

          <button
            onClick={() => onSelectView('speedtest')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'speedtest'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>BDIX Speed Test</span>
          </button>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-44 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ftp.neonbadda.bd..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-900/90 text-sm pl-9 pr-3 py-1.5 rounded-lg border border-slate-700/60 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Downloads Counter button */}
          <button
            onClick={onOpenDownloads}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            title="Download Queue / BDIX Accelerator"
          >
            <DownloadCloud className="w-5 h-5" />
            {downloadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {downloadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden flex items-center justify-around bg-slate-900/90 border-t border-slate-800/80 px-2 py-2 text-xs">
        <button
          onClick={() => onSelectView('portal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${
            currentView === 'portal' ? 'text-cyan-400 bg-cyan-950/60 font-bold' : 'text-slate-400'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Media</span>
        </button>
        <button
          onClick={() => onSelectView('raw')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${
            currentView === 'raw' ? 'text-cyan-400 bg-cyan-950/60 font-bold' : 'text-slate-400'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Index of /</span>
        </button>
        <button
          onClick={() => onSelectView('iptv')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${
            currentView === 'iptv' ? 'text-cyan-400 bg-cyan-950/60 font-bold' : 'text-slate-400'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>IPTV</span>
        </button>
        <button
          onClick={() => onSelectView('speedtest')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${
            currentView === 'speedtest' ? 'text-cyan-400 bg-cyan-950/60 font-bold' : 'text-slate-400'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Speed</span>
        </button>
      </div>
    </header>
  );
};
