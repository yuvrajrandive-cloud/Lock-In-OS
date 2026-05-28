/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useLockIn } from '../context/LockInContext';
import { motion } from 'motion/react';
import { Play, Pause, Square, Terminal as TermIcon, ShieldAlert, Award, Volume2, Sparkles, VolumeX } from 'lucide-react';

interface ConsoleLog {
  id: string;
  timeString: string;
  text: string;
  type: 'status' | 'info' | 'success' | 'warning';
}

const FOCUS_TYPES = ['Coding', 'Studying', 'Writing', 'Design', 'Research', 'Training'];

export default function LockInConsole() {
  const { settings, addFocusSession, updateSettings } = useLockIn();
  const [focusType, setFocusType] = useState('Coding');
  const [notes, setNotes] = useState('');
  
  // Timer States
  const [secondsLeft, setSecondsLeft] = useState(settings.focusTimerDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(settings.focusTimerDuration * 60);

  // Sound Toggle
  const [muteAudio, setMuteAudio] = useState(!settings.soundEnabled);

  // Terminal Logs
  const [logs, setLogs] = useState<ConsoleLog[]>([
    { id: '1', timeString: '00:00:00', text: 'SYSTEM CORE: ONLINE', type: 'status' },
    { id: '2', timeString: '00:00:01', text: 'COGNITIVE ISOLATION PARADIGM LAUNCHED', type: 'info' },
    { id: '3', timeString: '00:00:02', text: 'DISCIPLINE CRITERIA: FULL FOCUS REQUIRED', type: 'status' },
    { id: '4', timeString: '00:00:03', text: 'PRESS [START SESSION] TO LOCK IN', type: 'success' },
  ]);

  // For Typing/Logging Effect
  const [terminalInput, setTerminalInput] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep secondsLeft synced when timer duration settings are updated
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setSecondsLeft(settings.focusTimerDuration * 60);
      setTotalSessionSeconds(settings.focusTimerDuration * 60);
    }
  }, [settings.focusTimerDuration, isRunning, isPaused]);

  // Auto-scroll terminal logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Audio synthetical beeps
  const playBeep = (freq = 800, type = 'sine', duration = 0.08) => {
    if (muteAudio) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type as any;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play block:', e);
    }
  };

  const addLog = (text: string, type: 'status' | 'info' | 'success' | 'warning' = 'info') => {
    const elapsedSeconds = totalSessionSeconds - secondsLeft;
    const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
    const timeString = `00:${mins}:${secs}`;

    const newLog: ConsoleLog = {
      id: `log_${Date.now()}_${Math.random()}`,
      timeString,
      text: text.toUpperCase(),
      type,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Dynamic status messages based on remaining percentage
  const logInspirationalPhrase = (percentRemaining: number) => {
    const phrases: Record<number, string> = {
      95: 'Session initialized. Cellular device removed from active orbit.',
      85: 'Cortical synchronizer active. Focus states optimal.',
      70: 'Biological procrastination vectors bypassed successfully.',
      50: 'Momentum threshhold attained. Keep executing.',
      35: 'Discipline overrides standard human dopamine feedback loops.',
      20: 'Maximum cognitive compression achieved. Clean flow sequence.',
      10: 'Terminus approaching. Final focus phase initiated.',
    };

    const targetPercent = Math.floor(percentRemaining);
    if (phrases[targetPercent]) {
      addLog(phrases[targetPercent], 'status');
      playBeep(920, 'triangle', 0.12);
    }
  };

  // Timer Core logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          
          const nextSeconds = prev - 1;
          // Calculate percentage elapsed
          const elapsed = totalSessionSeconds - nextSeconds;
          const pct = Math.floor((nextSeconds / totalSessionSeconds) * 100);
          
          logInspirationalPhrase(pct);

          return nextSeconds;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, totalSessionSeconds]);

  const handleStartSession = () => {
    playBeep(650, 'sine', 0.15);
    setTimeout(() => playBeep(980, 'sine', 0.25), 120);

    setIsRunning(true);
    setIsPaused(false);
    
    addLog(`INITIATED LOCAL WORK MODULE // TYPE: ${focusType}`, 'success');
    addLog('REDUCING AMBIENT NOISE FACTOR TO ZERO', 'info');
  };

  const handlePauseSession = () => {
    if (isRunning) {
      playBeep(440, 'sine', 0.12);
      setIsRunning(false);
      setIsPaused(true);
      addLog('SESSION INTERRUPTED // PAUSED', 'warning');
    } else if (isPaused) {
      playBeep(520, 'sine', 0.12);
      setIsRunning(true);
      setIsPaused(false);
      addLog('RESUMING ACTIVE FLOW MODULE', 'success');
    }
  };

  const handleAbortSession = () => {
    playBeep(220, 'triangle', 0.3);
    setIsRunning(false);
    setIsPaused(false);
    
    const minutesCompleted = Math.floor((totalSessionSeconds - secondsLeft) / 60);
    
    addLog(`SESSION TERMINATED PREMATURELY // LOGGED: ${minutesCompleted} MINS`, 'warning');
    
    // Log active sessions if they did more than 2 minutes
    if (minutesCompleted >= 2) {
      addFocusSession(minutesCompleted, focusType, `Aborted. ${notes}`.trim(), false);
      addLog('PARTIAL CREDITS STORED TO DATABASE INDEX', 'status');
    }

    // Reset Seconds
    setSecondsLeft(settings.focusTimerDuration * 60);
  };

  const handleSessionComplete = () => {
    playBeep(1200, 'sine', 0.1);
    playBeep(1500, 'sine', 0.1);
    playBeep(2000, 'sine', 0.35);

    setIsRunning(false);
    setIsPaused(false);

    const minutesCompleted = Math.floor(totalSessionSeconds / 60);
    addFocusSession(minutesCompleted, focusType, notes, true);

    addLog(`OUTSTANDING ITERATION FINALISED // TARGET REACHED: ${minutesCompleted}m`, 'success');
    addLog('DISCIPLINE RATING INCREASING. COMPROMISE: NULL.', 'status');

    setSecondsLeft(settings.focusTimerDuration * 60);
    setNotes('');
  };

  // Submit terminal instruction (Simulate manual user terminal actions)
  const handleTerminalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    playBeep(700, 'sine', 0.05);
    const cmd = terminalInput.trim().toUpperCase();
    addLog(`USER_CMD_RUN: ${cmd}`, 'info');

    if (cmd === 'CLEAR') {
      setLogs([]);
    } else if (cmd === 'STATUS') {
      addLog(`SYSTEM TEMPERATURE: NOMINAL. ACCENT CODE: ${settings.accentColor.toUpperCase()}`, 'info');
    } else if (cmd === 'EXECUTE' || cmd === 'START') {
      if (!isRunning) handleStartSession();
    } else if (cmd === 'ABORT' || cmd === 'STOP') {
      if (isRunning || isPaused) handleAbortSession();
    } else if (cmd.startsWith('ACCENT ')) {
      const color = cmd.split(' ')[1]?.toLowerCase();
      if (color === 'green' || color === 'blue') {
        updateSettings({ accentColor: color as 'blue' | 'green' });
        addLog(`ACCENT COLOR ADAPTED TO: ${color.toUpperCase()}`, 'success');
      } else {
        addLog('INVALID SCHEME. PRESETS: BLUE, GREEN.', 'warning');
      }
    } else {
      addLog(`COMMAND NOT MATCHED IN OS SHELL: "${cmd}". REGISTERED ACCENT COMMANDS Available: 'CLEAR', 'STATUS', 'START', 'STOP', 'ACCENT <BLUE/GREEN>'`, 'warning');
    }

    setTerminalInput('');
  };

  // Seconds formatter
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const accentColor = settings.accentColor === 'green' ? 'emerald' : 'blue';

  const progressPercent = ((totalSessionSeconds - secondsLeft) / totalSessionSeconds) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 fade-in-blur">
      {/* View Header */}
      <div className="flex justify-between items-start border-b border-white/5 pb-5">
        <div>
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">// COGNITIVE PROTOCOL</span>
          <h1 className="font-display text-2xl font-light text-white tracking-tight mt-1">Focus Console</h1>
        </div>
        
        {/* Audio click indicator */}
        <button
          onClick={() => {
            setMuteAudio(!muteAudio);
            playBeep(880, 'sine', 0.05);
          }}
          className="p-2 border border-white/10 rounded-xl bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
          title="Toggle Cinematic Beats"
        >
          {muteAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Interactive Parameter Board */}
        <div className="md:col-span-1 rounded-2xl border border-white/5 bg-[#080808] p-6 flex flex-col justify-between space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
          <div className="space-y-4">
            <span className="block font-mono text-[9px] text-white/30 uppercase tracking-widest">
              // OPERATION SETUP
            </span>

            {/* Target Selectors */}
            <div>
              <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-2 uppercase">OPERATIONAL MODE</label>
              <div className="grid grid-cols-2 gap-2">
                {FOCUS_TYPES.map((type) => (
                  <button
                    key={type}
                    disabled={isRunning}
                    onClick={() => {
                      setFocusType(type);
                      playBeep(720, 'sine', 0.04);
                    }}
                    className={`p-2.5 font-mono text-[10px] rounded-lg border transition-all truncate text-left cursor-pointer ${
                      focusType === type
                        ? accentColor === 'emerald'
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-white font-semibold'
                          : 'border-blue-500/40 bg-blue-950/20 text-white font-semibold'
                        : 'border-white/5 bg-white/2 text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Notes Input on Session */}
            <div>
              <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-2 uppercase">TARGET OBJECTIVE (NOTES)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isRunning && !isPaused}
                placeholder="Declare targets (e.g., Code base, proof-reading layout)"
                className="w-full h-24 p-2.5 font-mono text-[10px] bg-white/2 border border-white/5 rounded-lg text-white placeholder-white/30 outline-none focus:border-white/20 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="font-mono text-[9px] text-white/30 bg-white/2 p-3 rounded-lg leading-relaxed border border-white/5 mx-0.5">
            <ShieldAlert className="h-3.5 w-3.5 text-white/20 inline mr-2 align-middle" />
            <span>Cellular notifications are forbidden. Focus session is engaged.</span>
          </div>
        </div>

        {/* Cinematic Main Timer & Terminal Console */}
        <div className="md:col-span-2 space-y-6 flex flex-col">
          {/* Top: Digital Countdown Timer card */}
          <div className="rounded-2xl border border-white/5 bg-[#080808] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
            <div className="absolute top-3 left-4 font-mono text-[8px] text-white/30 tracking-wider">
              PROTOCOL TIMING // SECURE RUNTIME
            </div>
            
            {/* Ambient Background Glow of Accent */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full filter blur-3xl opacity-10 transition-colors ${
              accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
            }`} />

            {/* Standard Timer Output Display styling */}
            <div className="relative z-10 flex flex-col items-center py-7">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-2 font-bold select-none">
                {focusType.toUpperCase()} IN PROGRESS
              </span>
              <span className="font-display font-light text-7xl tracking-tighter text-white font-mono leading-none">
                {formatTime(secondsLeft)}
              </span>
              
              {/* Progress bar visual */}
              <div className="w-56 h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${100 - progressPercent}%` }}
                />
              </div>
            </div>

            {/* Primary Controls */}
            <div className="relative z-10 flex space-x-3 mt-4">
              {!isRunning && !isPaused ? (
                <button
                  onClick={handleStartSession}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center space-x-2 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>START MODULE</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePauseSession}
                    className="px-6 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Pause className="h-3.5 w-3.5" />
                    <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
                  </button>
                  <button
                    onClick={handleAbortSession}
                    className="px-6 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest bg-rose-950/10 border border-rose-900/20 text-rose-400 hover:bg-rose-950/30 transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Square className="h-3.5 w-3.5" />
                    <span>ABORT</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Terminal output logs logger */}
          <div className="rounded-2xl border border-white/5 bg-[#060608] p-5 font-mono text-xs flex-grow flex flex-col justify-between h-64 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
            <div className="border-b border-white/5 pb-2 mb-3 flex justify-between items-center text-[10px] text-white/30">
              <span className="flex items-center space-x-2">
                <TermIcon className="h-3 w-3 text-white/40" />
                <span>ENVIRONMENT SHELL RECEPTOR</span>
              </span>
              <span>SHELL STABLE</span>
            </div>

            {/* Container for logs stream */}
            <div className="flex-grow overflow-y-auto space-y-1.5 scrollbar-thin pr-1 max-h-40">
              {logs.map((log) => (
                <div key={log.id} className="leading-snug">
                  <span className="text-white/20 mr-2">[{log.timeString}]</span>
                  <span
                    className={`${
                      log.type === 'status'
                        ? 'text-white/40 font-semibold'
                        : log.type === 'success'
                        ? 'text-emerald-400 font-semibold'
                        : log.type === 'warning'
                        ? 'text-amber-400 font-semibold'
                        : 'text-[#cbd5e1]'
                    }`}
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Manual user interaction instruction bar */}
            <form onSubmit={handleTerminalSubmit} className="mt-4 border-t border-white/5 pt-3 flex items-center">
              <span className={`mr-2.5 font-bold ${accentColor === 'emerald' ? 'text-emerald-400' : 'text-blue-500'}`}>&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Manually feed parameters... (e.g. CLEAR, STATUS, ACCENT GREEN)"
                className="w-full bg-transparent font-mono text-xs text-white placeholder-white/10 outline-none flex-grow"
              />
              <span className="terminal-cursor text-white/20 font-bold">|</span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
