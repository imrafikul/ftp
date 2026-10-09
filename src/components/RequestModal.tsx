import React, { useState } from 'react';
import { X, Send, Film, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { SERVER_CONFIG } from '../data/ftpData';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose }) => {
  const [mediaTitle, setMediaTitle] = useState('');
  const [category, setCategory] = useState('Bangla Cinema / Natok');
  const [qualityPreference, setQualityPreference] = useState('1080p BluRay / WEB-DL');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMediaTitle('');
      setNotes('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-800/40 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base">
                Request Media / Report to Admin
              </h3>
              <p className="text-[11px] text-slate-400">
                Neon Broadband FTP Admin Team (Middle Badda NOC)
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

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Request Queued Successfully!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Our Badda NOC download bot will fetch "{mediaTitle}" and seed it to the storage array within 2–6 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Media or Software Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priyotoma (2023), GTA VI, Adobe Photoshop 2025..."
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>Bangla Cinema / Natok</option>
                  <option>Hollywood Movie</option>
                  <option>Bollywood Movie</option>
                  <option>South Hindi Dubbed</option>
                  <option>TV / Web Series</option>
                  <option>PC Game</option>
                  <option>Software / OS ISO</option>
                  <option>Anime</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Preferred Quality</label>
                <select
                  value={qualityPreference}
                  onChange={(e) => setQualityPreference(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>1080p BluRay / WEB-DL</option>
                  <option>4K UltraHD HDR</option>
                  <option>720p HD (Low Size)</option>
                  <option>Dual Audio (Hindi + English)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Additional Notes / IMDB Link / Specific Release
              </label>
              <textarea
                rows={3}
                placeholder="Any special details, subtitle preference, or torrent magnet link..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              ></textarea>
            </div>

            <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-800/40 text-[11px] text-cyan-300 flex items-start gap-2">
              <Film className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Requests are processed in priority order for connected Neon Broadband subscribers. Approved files are moved to <span className="font-mono">ftp://ftp.neonbadda.bd/</span>.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
