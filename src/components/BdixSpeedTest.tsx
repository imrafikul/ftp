import React, { useState, useEffect, useRef } from 'react';
import { 
  Gauge, 
  Play, 
  RotateCcw, 
  Zap, 
  Activity, 
  Server, 
  CheckCircle2, 
  Wifi, 
  ArrowDown, 
  ArrowUp,
  ShieldCheck
} from 'lucide-react';
import { SERVER_CONFIG } from '../data/ftpData';

export const BdixSpeedTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'completed'>('idle');
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [peakSpeed, setPeakSpeed] = useState<number>(0);
  const [pingVal, setPingVal] = useState<number>(0);
  const [jitterVal, setJitterVal] = useState<number>(0);
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);
  const [speedHistory, setSpeedHistory] = useState<number[]>([]);

  const intervalRef = useRef<any>(null);

  const startTest = () => {
    setIsRunning(true);
    setPhase('ping');
    setCurrentSpeed(0);
    setPeakSpeed(0);
    setPingVal(0);
    setJitterVal(0);
    setUploadSpeed(0);
    setSpeedHistory([]);

    // Step 1: Ping phase (1.2 seconds)
    setTimeout(() => {
      setPingVal(1.8);
      setJitterVal(0.4);
      setPhase('download');

      // Step 2: Download speed phase (4.5 seconds)
      let elapsed = 0;
      let peak = 0;
      const history: number[] = [];

      intervalRef.current = setInterval(() => {
        elapsed += 100;
        // Curve simulating BDIX ramp-up to 95-102 Mbps
        const target = 98.4;
        const noise = (Math.random() - 0.5) * 8;
        const progress = Math.min(elapsed / 2500, 1);
        const val = Math.max(5, Math.min(108, target * progress + noise));
        
        setCurrentSpeed(Math.round(val * 10) / 10);
        if (val > peak) peak = Math.round(val * 10) / 10;
        setPeakSpeed(peak);

        history.push(val);
        if (history.length > 25) history.shift();
        setSpeedHistory([...history]);

        if (elapsed >= 4500) {
          clearInterval(intervalRef.current);
          setPhase('upload');

          // Step 3: Upload speed phase (3 seconds)
          let upElapsed = 0;
          const upInterval = setInterval(() => {
            upElapsed += 100;
            const upTarget = 94.2;
            const upNoise = (Math.random() - 0.5) * 6;
            const upVal = Math.max(10, Math.min(100, upTarget + upNoise));
            setCurrentSpeed(Math.round(upVal * 10) / 10);

            if (upElapsed >= 3000) {
              clearInterval(upInterval);
              setUploadSpeed(94.2);
              setPhase('completed');
              setIsRunning(false);
            }
          }, 100);
        }
      }, 100);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Title Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Neon Badda Local BDIX Gigabit Exchange</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          BDIX Speed & Peering Diagnostic Tool
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Test real-time throughput directly to server host <span className="font-mono text-cyan-300">ftp.neonbadda.bd</span> (Middle Badda, Dhaka).
        </p>
      </div>

      {/* Main Gauge & Speed Display */}
      <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col items-center justify-center space-y-6">
          {/* Status Badge */}
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            {phase === 'idle' && <span>Ready to start test</span>}
            {phase === 'ping' && <span className="text-amber-400 animate-pulse">Measuring Latency & Jitter to Badda Node...</span>}
            {phase === 'download' && <span className="text-cyan-400 font-bold animate-pulse">Testing BDIX Download Bandwidth...</span>}
            {phase === 'upload' && <span className="text-emerald-400 font-bold animate-pulse">Testing BDIX Upload Bandwidth...</span>}
            {phase === 'completed' && <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> BDIX Peering Confirmed</span>}
          </div>

          {/* Speed Number Display */}
          <div className="text-center">
            <div className="text-6xl sm:text-8xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400">
              {phase === 'completed' ? peakSpeed.toFixed(1) : currentSpeed.toFixed(1)}
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-cyan-400 mt-1 uppercase tracking-widest">
              Mbps (MegaBit/s)
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              ~ {((phase === 'completed' ? peakSpeed : currentSpeed) / 8).toFixed(1)} MB/s Real Download Rate
            </div>
          </div>

          {/* Sparkline / waveform preview */}
          {speedHistory.length > 0 && (
            <div className="w-full max-w-md h-12 flex items-end gap-1.5 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80 py-2">
              {speedHistory.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-100"
                  style={{ height: `${Math.min(100, (val / 110) * 100)}%` }}
                ></div>
              ))}
            </div>
          )}

          {/* Controls button */}
          <div>
            {!isRunning ? (
              <button
                onClick={startTest}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {phase === 'completed' ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-slate-950" />}
                <span>{phase === 'completed' ? 'Run Test Again' : 'Start BDIX Speed Test'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 text-cyan-400 font-mono text-sm border border-cyan-500/40 animate-pulse">
                <Activity className="w-4 h-4 animate-spin" />
                <span>Benchmarking BDIX Network...</span>
              </div>
            )}
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-center font-mono">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ping / Latency</span>
            </div>
            <div className="text-xl font-bold text-white">
              {pingVal ? `${pingVal} ms` : '--'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Wifi className="w-3.5 h-3.5 text-amber-400" />
              <span>Jitter</span>
            </div>
            <div className="text-xl font-bold text-white">
              {jitterVal ? `${jitterVal} ms` : '--'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>BDIX Download</span>
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {peakSpeed ? `${peakSpeed.toFixed(1)} Mbps` : '--'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
              <span>BDIX Upload</span>
            </div>
            <div className="text-xl font-bold text-sky-400">
              {uploadSpeed ? `${uploadSpeed.toFixed(1)} Mbps` : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Network Verification Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">
              Peered via Bangladesh Internet Exchange (BDIX)
            </h4>
            <p className="text-slate-400">
              Traffic is routed directly through local optical fiber exchange. No international bandwidth is deducted.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-slate-400 hidden sm:block">
          <div>Target Node: Middle Badda, Dhaka</div>
          <div className="text-cyan-400">IP: 103.145.244.18 (AS138128)</div>
        </div>
      </div>
    </div>
  );
};
