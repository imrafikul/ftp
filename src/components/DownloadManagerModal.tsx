import React from 'react';
import { 
  X, 
  DownloadCloud, 
  CheckCircle2, 
  Pause, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  HardDrive,
  Zap
} from 'lucide-react';
import { DownloadTask } from '../types/ftp';

interface DownloadManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: DownloadTask[];
  onTogglePause: (id: string) => void;
  onRemoveTask: (id: string) => void;
  onClearCompleted: () => void;
}

export const DownloadManagerModal: React.FC<DownloadManagerModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onTogglePause,
  onRemoveTask,
  onClearCompleted,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = (task: DownloadTask) => {
    const link = `ftp://ftp.neonbadda.bd${task.path}`;
    navigator.clipboard.writeText(link);
    setCopiedId(task.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-800/40 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <DownloadCloud className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                Neon BDIX Download Manager
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Multi-thread direct transfer from ftp.neonbadda.bd
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {tasks.some((t) => t.status === 'completed') && (
              <button
                onClick={onClearCompleted}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                Clear Finished
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <DownloadCloud className="w-12 h-12 mx-auto opacity-30 text-cyan-400" />
              <p className="text-slate-300 font-semibold">No active downloads</p>
              <p className="text-xs text-slate-500">
                Browse the media portal or raw directory and click "Download" on any file.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                      {task.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Path: {task.path}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyLink(task)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copy FTP URL"
                    >
                      {copiedId === task.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {task.status !== 'completed' && (
                      <button
                        onClick={() => onTogglePause(task.id)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                        title={task.status === 'paused' ? 'Resume' : 'Pause'}
                      >
                        {task.status === 'paused' ? <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" /> : <Pause className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <button
                      onClick={() => onRemoveTask(task.id)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      task.status === 'completed'
                        ? 'bg-emerald-500'
                        : task.status === 'paused'
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>

                {/* Status footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{task.size}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-bold">{Math.round(task.progress)}%</span>
                  </div>

                  <div>
                    {task.status === 'completed' ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Download Complete
                      </span>
                    ) : task.status === 'paused' ? (
                      <span className="text-amber-400">Paused</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Speed: {task.speed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400 font-mono">
            <Zap className="w-3.5 h-3.5" />
            Neon BDIX Direct Acceleration: 8 Concurrent Threads
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
