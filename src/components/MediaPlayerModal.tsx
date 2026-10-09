import React, { useState } from 'react';
import { 
  X, 
  DownloadCloud, 
  Copy, 
  Check, 
  Terminal, 
  Film, 
  HardDrive, 
  Volume2, 
  Languages, 
  Tv, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { FtpFileItem } from '../types/ftp';

interface MediaPlayerModalProps {
  item: FtpFileItem | null;
  onClose: () => void;
  onDownload: (item: FtpFileItem) => void;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({
  item,
  onClose,
  onDownload,
}) => {
  const [copiedFtp, setCopiedFtp] = useState(false);
  const [copiedIdm, setCopiedIdm] = useState(false);
  const [copiedWget, setCopiedWget] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  if (!item) return null;

  const ftpUrl = `ftp://guest:neon@ftp.neonbadda.bd${item.path}`;
  const idmUrl = `http://ftp.neonbadda.bd:8080${item.path}`;
  const wgetCmd = `wget -c --passive-ftp "${ftpUrl}"`;

  const copyToClipboard = (text: string, type: 'ftp' | 'idm' | 'wget') => {
    navigator.clipboard.writeText(text);
    if (type === 'ftp') {
      setCopiedFtp(true);
      setTimeout(() => setCopiedFtp(false), 2000);
    } else if (type === 'idm') {
      setCopiedIdm(true);
      setTimeout(() => setCopiedIdm(false), 2000);
    } else {
      setCopiedWget(true);
      setTimeout(() => setCopiedWget(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-800/40 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Film className="w-4 h-4" />
            </span>
            <div className="truncate">
              <h3 className="text-white font-bold text-sm sm:text-base truncate">
                {item.name}
              </h3>
              <p className="text-[11px] font-mono text-cyan-400 truncate">
                ftp.neonbadda.bd{item.path}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
          {item.videoUrl ? (
            <video
              src={item.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              poster={item.thumbnail}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-8 space-y-3">
              <Film className="w-16 h-16 text-cyan-500 mx-auto opacity-50" />
              <p className="text-slate-300 font-semibold">Ready for direct BDIX streaming</p>
              <p className="text-xs text-slate-500">Audio/File container ready for playback via local network</p>
            </div>
          )}

          {/* BDIX streaming watermark */}
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>BDIX Direct Feed (100 Mbps)</span>
          </div>
        </div>

        {/* Details & Download Options */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Specifications grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">File Size</span>
              <span className="font-bold text-cyan-300 text-sm">{item.size}</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Video Codec</span>
              <span className="font-bold text-slate-200 text-sm">{item.codec || 'HEVC x265 10-bit'}</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Audio Stream</span>
              <span className="font-bold text-amber-300 text-sm">{item.audio || 'Dolby Atmos 5.1'}</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Resolution Quality</span>
              <span className="font-bold text-emerald-400 text-sm">{item.quality || '1080p BluRay'}</span>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              <p>{item.description}</p>
            </div>
          )}

          {/* Download & Copy links bar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DownloadCloud className="w-4 h-4 text-cyan-400" />
              <span>Direct BDIX Download Options</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Start In-App BDIX Download */}
              <button
                onClick={() => {
                  onDownload(item);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Start BDIX Download</span>
              </button>

              {/* Copy IDM link */}
              <button
                onClick={() => copyToClipboard(idmUrl, 'idm')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedIdm ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedIdm ? 'Copied IDM URL!' : 'Copy IDM Link'}</span>
              </button>

              {/* Copy FTP link */}
              <button
                onClick={() => copyToClipboard(ftpUrl, 'ftp')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedFtp ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFtp ? 'Copied FTP URL!' : 'Copy Raw FTP Link'}</span>
              </button>
            </div>

            {/* Wget snippet */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[11px] text-slate-400">
              <span className="truncate select-all text-cyan-400">
                {wgetCmd}
              </span>
              <button
                onClick={() => copyToClipboard(wgetCmd, 'wget')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                {copiedWget ? <Check className="w-3 h-3 text-emerald-400" /> : <Terminal className="w-3 h-3" />}
                <span>{copiedWget ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
