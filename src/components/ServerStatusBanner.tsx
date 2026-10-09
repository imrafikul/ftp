import React, { useState } from 'react';
import { 
  HardDrive, 
  Wifi, 
  Users, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Zap, 
  Globe2,
  ShieldCheck
} from 'lucide-react';
import { SERVER_CONFIG } from '../data/ftpData';

interface ServerStatusBannerProps {
  onOpenSpeedTest: () => void;
  onOpenDiagnostic: () => void;
}

export const ServerStatusBanner: React.FC<ServerStatusBannerProps> = ({
  onOpenSpeedTest,
  onOpenDiagnostic,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const copyFtpUrl = () => {
    navigator.clipboard.writeText(SERVER_CONFIG.ftpUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyWget = () => {
    navigator.clipboard.writeText(`wget -c --passive-ftp ftp://anonymous:guest@ftp.neonbadda.bd/`);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border-b border-cyan-950/60 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Wifi className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-white font-bold text-base sm:text-lg">
                    Neon Broadband BDIX FTP Hub
                  </h1>
                  <span className="text-[11px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Host: <span className="text-cyan-300">{SERVER_CONFIG.host}</span> • Node: Cha-98/1, Middle Badda, Dhaka
                </p>
              </div>
            </div>

            {/* Quick Copy FTP Link Pill */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <span className="font-mono text-cyan-400 select-all font-semibold">
                ftp://ftp.neonbadda.bd
              </span>
              <button
                onClick={copyFtpUrl}
                className="p-1 hover:text-white text-slate-400 transition-colors"
                title="Copy FTP URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 text-[10px] block leading-none">Storage Pool</span>
                <span className="font-mono font-bold text-slate-200">284 TB / 320 TB</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <Users className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400 text-[10px] block leading-none">Active Streams</span>
                <span className="font-mono font-bold text-slate-200">{SERVER_CONFIG.activeUsers} Users</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400 text-[10px] block leading-none">BDIX Bandwidth</span>
                <span className="font-mono font-bold text-emerald-400">10 Gbps Peered</span>
              </div>
            </div>

            <button
              onClick={onOpenSpeedTest}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Test BDIX Speed</span>
            </button>

            <button
              onClick={copyWget}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Copy wget command"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">{copiedCommand ? 'Copied!' : 'wget Command'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
