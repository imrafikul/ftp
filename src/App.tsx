/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ServerStatusBanner } from './components/ServerStatusBanner';
import { MediaPortal } from './components/MediaPortal';
import { RawFtpBrowser } from './components/RawFtpBrowser';
import { LiveIptvPlayer } from './components/LiveIptvPlayer';
import { BdixSpeedTest } from './components/BdixSpeedTest';
import { MediaPlayerModal } from './components/MediaPlayerModal';
import { DownloadManagerModal } from './components/DownloadManagerModal';
import { ServerDiagnosticModal } from './components/ServerDiagnosticModal';
import { RequestModal } from './components/RequestModal';
import { FtpFileItem, DownloadTask } from './types/ftp';
import { SERVER_CONFIG, MEDIA_ITEMS } from './data/ftpData';
import { 
  Server, 
  Wifi, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  HardDrive, 
  Zap, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'portal' | 'raw' | 'iptv' | 'speedtest'>('portal');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMediaItem, setActiveMediaItem] = useState<FtpFileItem | null>(null);
  
  // Download Manager State
  const [downloadTasks, setDownloadTasks] = useState<DownloadTask[]>([
    {
      id: 'task-initial-1',
      name: 'Toofan.2024.1080p.Hoichoi.WEB-DL.x264.AAC-NeonBD.mkv',
      size: '3.4 GB',
      sizeBytes: 3650722201,
      progress: 68,
      speed: '12.4 MB/s',
      status: 'downloading',
      path: '/Movies/Bangla/Toofan.2024.1080p.Hoichoi.WEB-DL.x264.AAC-NeonBD.mkv',
      addedAt: '2026-10-08 21:00',
    },
    {
      id: 'task-initial-2',
      name: 'IDM.6.42.Build.18.Retail.Multilingual-NeonBD.zip',
      size: '14.2 MB',
      sizeBytes: 14889779,
      progress: 100,
      speed: '0 MB/s',
      status: 'completed',
      path: '/Softwares/Utilities/IDM.6.42.Build.18.Retail.Multilingual-NeonBD.zip',
      addedAt: '2026-10-08 20:45',
    },
  ]);

  // Modals
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simulate active download progress incrementing
  useEffect(() => {
    const timer = setInterval(() => {
      setDownloadTasks((prev) =>
        prev.map((task) => {
          if (task.status !== 'downloading') return task;
          if (task.progress >= 100) {
            return { ...task, progress: 100, status: 'completed', speed: '0 MB/s' };
          }
          const nextProgress = Math.min(100, task.progress + 1.2);
          return {
            ...task,
            progress: nextProgress,
            status: nextProgress >= 100 ? 'completed' : 'downloading',
            speed: nextProgress >= 100 ? '0 MB/s' : `${(11.5 + Math.random() * 1.5).toFixed(1)} MB/s`,
          };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartDownload = (item: FtpFileItem | { name: string; size: string; sizeBytes: number; path: string }) => {
    const exists = downloadTasks.find((t) => t.path === item.path);
    if (exists) {
      setIsDownloadModalOpen(true);
      showToast(`Already downloading ${item.name}`);
      return;
    }

    const newTask: DownloadTask = {
      id: 'dl-' + Date.now(),
      name: item.name,
      size: item.size,
      sizeBytes: item.sizeBytes,
      progress: 1,
      speed: '12.1 MB/s',
      status: 'downloading',
      path: item.path,
      addedAt: new Date().toLocaleTimeString(),
    };

    setDownloadTasks((prev) => [newTask, ...prev]);
    setIsDownloadModalOpen(true);
    showToast(`Started BDIX high-speed download for ${item.name}`);
  };

  const handleTogglePause = (id: string) => {
    setDownloadTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'paused' ? 'downloading' : 'paused';
          return {
            ...t,
            status: newStatus,
            speed: newStatus === 'downloading' ? '11.8 MB/s' : '0 MB/s',
          };
        }
        return t;
      })
    );
  };

  const handleRemoveTask = (id: string) => {
    setDownloadTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    setDownloadTasks((prev) => prev.filter((t) => t.status !== 'completed'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 text-cyan-200 border border-cyan-500/50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        downloadCount={downloadTasks.filter((t) => t.status === 'downloading').length}
        onOpenDownloads={() => setIsDownloadModalOpen(true)}
        onOpenDiagnostic={() => setIsDiagnosticModalOpen(true)}
        onRequestModal={() => setIsRequestModalOpen(true)}
      />

      {/* Server Status Header Banner */}
      <ServerStatusBanner
        onOpenSpeedTest={() => setCurrentView('speedtest')}
        onOpenDiagnostic={() => setIsDiagnosticModalOpen(true)}
      />

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentView === 'portal' && (
          <MediaPortal
            onPlayItem={(item) => setActiveMediaItem(item)}
            onDownloadItem={handleStartDownload}
            searchQuery={searchQuery}
          />
        )}

        {currentView === 'raw' && (
          <RawFtpBrowser
            onPlayMedia={(item) => setActiveMediaItem(item)}
            onDownloadFile={handleStartDownload}
          />
        )}

        {currentView === 'iptv' && <LiveIptvPlayer />}

        {currentView === 'speedtest' && <BdixSpeedTest />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Server Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Server className="w-4 h-4" />
              </div>
              <span className="font-black text-white text-base tracking-wider">
                ftp.neonbadda.bd
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Official high-speed BDIX FTP storage cluster and media streaming engine operated by Neon Broadband Network for subscribers in Badda, Dhaka.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>10Gbps Optical Peering Active</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Directory Services</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button onClick={() => setCurrentView('portal')} className="hover:text-cyan-400 transition-colors">
                  • 4K/1080p Movies & Web Series
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('raw')} className="hover:text-cyan-400 transition-colors">
                  • Index of / (Raw Apache Directory)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('iptv')} className="hover:text-cyan-400 transition-colors">
                  • Live Cricket & Bangla IPTV Streams
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('speedtest')} className="hover:text-cyan-400 transition-colors">
                  • BDIX Latency & Bandwidth Benchmark
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Protocols & Specifications */}
          <div className="space-y-2 font-mono text-[11px]">
            <h4 className="font-bold text-white font-sans text-xs uppercase tracking-wider">Network Spec</h4>
            <div className="space-y-1 text-slate-400">
              <div>Host: <span className="text-cyan-300">ftp.neonbadda.bd</span></div>
              <div>IPv4: <span className="text-slate-200">103.145.244.18</span></div>
              <div>FTP Port: <span className="text-slate-200">21 (vsftpd 3.0.5)</span></div>
              <div>HTTP Stream: <span className="text-slate-200">Port 8080 (Nginx/HLS)</span></div>
              <div>RAID: <span className="text-slate-200">ZFS RAID-Z2 (320 TB)</span></div>
            </div>
          </div>

          {/* Column 4: NOC Location */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">NOC & Support</h4>
            <p className="text-slate-400 leading-relaxed">
              Neon Broadband NOC, Cha-98/1, Middle Badda, Pragati Sarani, Dhaka-1212, Bangladesh.
            </p>
            <div className="pt-1 text-slate-400 text-[11px] space-y-1">
              <div>Helpline: +880 9611-NEONBD</div>
              <div>Email: noc@neonbadda.bd</div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline text-[11px]"
              >
                Request a movie or file
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Neon Broadband & Telecommunication Services. All BDIX rights reserved.
          </div>
          <div className="font-mono text-slate-400">
            Connected to BDIX Node: Middle Badda (Dhaka-1212)
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MediaPlayerModal
        item={activeMediaItem}
        onClose={() => setActiveMediaItem(null)}
        onDownload={handleStartDownload}
      />

      <DownloadManagerModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        tasks={downloadTasks}
        onTogglePause={handleTogglePause}
        onRemoveTask={handleRemoveTask}
        onClearCompleted={handleClearCompleted}
      />

      <ServerDiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
      />

      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}
