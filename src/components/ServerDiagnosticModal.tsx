import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Activity, 
  CheckCircle2, 
  Server, 
  Globe2, 
  RefreshCw, 
  ShieldCheck, 
  Wifi
} from 'lucide-react';
import { SERVER_CONFIG } from '../data/ftpData';

interface ServerDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerDiagnosticModal: React.FC<ServerDiagnosticModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [testing, setTesting] = useState(false);
  const [activePortIndex, setActivePortIndex] = useState(4);

  if (!isOpen) return null;

  const ports = [
    { port: 21, service: 'FTP Control (vsftpd)', status: 'OPEN', latency: '1.2 ms' },
    { port: 20, service: 'FTP Data Transfer', status: 'OPEN', latency: '1.4 ms' },
    { port: 80, service: 'HTTP Web Directory Index', status: 'OPEN', latency: '1.6 ms' },
    { port: 8080, service: 'HTTP Media Streaming Server', status: 'OPEN', latency: '1.8 ms' },
    { port: 8000, service: 'BDIX Multicast IPTV Feed', status: 'OPEN', latency: '2.1 ms' },
  ];

  const bdFtpServers = [
    { name: 'Neon Badda FTP (ftp.neonbadda.bd)', ip: '103.145.244.18', area: 'Middle Badda, Dhaka', status: 'Active (Direct)', ping: '1.8 ms' },
    { name: 'SAM Online Badda Hub', ip: '103.205.71.2', area: 'Badda / Gulshan', status: 'Peered', ping: '2.4 ms' },
    { name: 'Circle FTP Network', ip: '172.16.50.4', area: 'Dhaka BDIX', status: 'Peered', ping: '3.1 ms' },
    { name: 'ICC FTP Media Server', ip: '103.230.106.10', area: 'BDIX Peered', status: 'Peered', ping: '3.8 ms' },
    { name: 'Roar BDIX Server', ip: '103.102.253.2', area: 'BDIX Peered', status: 'Peered', ping: '4.2 ms' },
  ];

  const runRecheck = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-800/40 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Terminal className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base">
                Host Diagnostic: ftp.neonbadda.bd
              </h3>
              <p className="text-[11px] font-mono text-cyan-400">
                Resolved IP: {SERVER_CONFIG.ip} (Middle Badda NOC)
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Diagnostic status box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                ALL SYSTEMS OPERATIONAL
              </span>
              <button
                onClick={runRecheck}
                disabled={testing}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>Re-ping Host</span>
              </button>
            </div>

            <div className="space-y-1 text-slate-300 pt-1 text-[11px]">
              <div>$ ping -c 4 ftp.neonbadda.bd</div>
              <div className="text-slate-400">64 bytes from 103.145.244.18: icmp_seq=1 ttl=58 time=1.82 ms</div>
              <div className="text-slate-400">64 bytes from 103.145.244.18: icmp_seq=2 ttl=58 time=1.65 ms</div>
              <div className="text-slate-400">64 bytes from 103.145.244.18: icmp_seq=3 ttl=58 time=1.79 ms</div>
              <div className="text-emerald-400 font-bold">--- ftp.neonbadda.bd ping statistics: 0% packet loss, min/avg/max = 1.65/1.78/1.89 ms</div>
            </div>
          </div>

          {/* Port Scanning Results */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Port Connectivity Matrix ({SERVER_CONFIG.host})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ports.map((p) => (
                <div
                  key={p.port}
                  className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs"
                >
                  <div>
                    <span className="font-bold text-cyan-300">Port {p.port}</span>
                    <span className="text-slate-400 text-[11px] block">{p.service}</span>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold">
                      {p.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{p.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bangladeshi BDIX Peering Network Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>BDIX Servers Network Interconnect</span>
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Server Host</th>
                    <th className="py-2.5 px-3 font-semibold">Location / Node</th>
                    <th className="py-2.5 px-3 font-semibold">BDIX Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Ping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {bdFtpServers.map((s, idx) => (
                    <tr key={idx} className={idx === 0 ? 'bg-cyan-950/30 font-bold' : ''}>
                      <td className="py-2 px-3 text-slate-200">
                        {s.name}
                      </td>
                      <td className="py-2 px-3 text-slate-400">{s.area}</td>
                      <td className="py-2 px-3">
                        <span className="text-emerald-400 text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/30">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-cyan-300">{s.ping}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Neon Broadband NOC: +880 1700-000000 / Pragati Sarani, Dhaka</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
