/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal as TermIcon, Shield, Radio, Sparkles } from 'lucide-react';

interface BootViewProps {
  onBootComplete: () => void;
  accentColor: 'blue' | 'green';
}

export default function BootView({ onBootComplete, accentColor }: BootViewProps) {
  const [bootStep, setBootStep] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const logsSequence = [
    'BOOT PROTOCOL INITIATING...',
    'CHECKING INTEGRAL FILE SYSTEM BUFFERS...',
    'OK: 1048 LOCAL CACHE VECTOR READS COMPLETED',
    'MINIMIZING AMBIENT DOPAMINE VECTORS...',
    'OK: DISCORD AND SOCIAL NOTIFICATIONS DETACHED',
    'CALCULATING OPERATIVE CONSISTENCY COEFFICIENT...',
    'ESTABLISHED SYNC METRICS IN STORAGE MAP',
    'BOOT SUCCESSFUL: LOCKIN OPERATING ENVIRONMENT DEPLOYED.',
  ];

  // Sound generator
  const playBootChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Low chime
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // High chime
      
      gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.45);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (bootStep < logsSequence.length) {
      const delay = bootStep === 0 ? 300 : bootStep === logsSequence.length - 1 ? 800 : 250;
      const timer = setTimeout(() => {
        setBootLogs((prev) => [...prev, logsSequence[bootStep]]);
        setBootStep((prev) => prev + 1);
        // Play click feedback on each step
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.frequency.setValueAtTime(600 + (bootStep * 40), audioCtx.currentTime);
          gainNode.gain.setValueAtTime(0.005, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.05);
        } catch {}
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [bootStep]);

  const handleEnterStation = () => {
    playBootChime();
    onBootComplete();
  };

  const activeColor = accentColor === 'green' ? 'border-emerald-500/30 text-emerald-400' : 'border-blue-500/30 text-blue-400';
  const activeBtn = accentColor === 'green' 
    ? 'bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400' 
    : 'bg-blue-500 text-black border-blue-400 hover:bg-blue-400';

  return (
    <div className="fixed inset-0 bg-[#060608] flex items-center justify-center p-6 z-50 overflow-hidden font-mono select-none">
      {/* Background cinematic lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b1b1f_1px,transparent_1px),linear-gradient(to_bottom,#1b1b1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5" />

      {/* Cyberpunk grid mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608]" />

      <div className="w-full max-w-xl space-y-8 relative z-10 transition-all duration-700">
        {/* Animated Brand Logo element */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`p-4 rounded-xl border bg-zinc-950/40 animate-pulse ${activeColor}`}>
            <Shield className="h-10 w-10" />
          </div>
          <div>
            <h1 className="font-display font-medium text-4xl tracking-widest text-white leading-none">LOCKIN_OS</h1>
            <span className="text-[10px] text-zinc-600 tracking-wider block mt-2 uppercase">
              COGNITIVE ISOLATION ENVIRONMENT // SECURE GATEWAY
            </span>
          </div>
        </div>

        {/* Console Boot Steps Logger */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-6 h-60 flex flex-col justify-between text-xs space-y-2 relative">
          <div className="overflow-y-auto space-y-1 text-zinc-400">
            {bootLogs.map((log, index) => (
              <div key={index} className="flex items-start">
                <span className="text-zinc-650 mr-2.5">[{index.toString().padStart(2, '0')}]</span>
                <span>{log}</span>
              </div>
            ))}
            {bootStep < logsSequence.length && (
              <div className="flex items-center">
                <span className="text-zinc-650 mr-2.5">[{bootStep.toString().padStart(2, '0')}]</span>
                <span className="h-4 w-1.5 bg-zinc-600 animate-pulse" />
              </div>
            )}
          </div>

          <div className="border-t border-zinc-950/80 pt-3 flex justify-between items-center text-[9px] text-zinc-650">
            <span>STABLE: CLOUD RECEPTOR READY</span>
            <div className="flex items-center space-x-1.5">
              <Radio className="h-3 w-3 text-red-500 animate-pulse" />
              <span>TERMINAL ENGAGED</span>
            </div>
          </div>
        </div>

        {/* Boot trigger Button */}
        <div className="flex justify-center h-12">
          {isReady && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={handleEnterStation}
              className={`px-8 py-3 rounded-lg text-xs font-bold tracking-widest border transition-all cursor-pointer shadow-lg uppercase ${activeBtn}`}
            >
              INITIALISE STATION PROTOCOL
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
