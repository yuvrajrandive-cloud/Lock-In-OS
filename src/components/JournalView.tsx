/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { useLockIn } from '../context/LockInContext';
import { Search, PenTool, Calendar, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { JournalEntry } from '../types';

export default function JournalView() {
  const { journal, addJournalEntry, settings } = useLockIn();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Entry state
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
  // Edit Form state
  const [entryText, setEntryText] = useState('');
  const [improvementsText, setImprovementsText] = useState('');
  const [distractionsText, setDistractionsText] = useState('');
  const [tomorrowActionText, setTomorrowActionText] = useState('');
  const [focusScore, setFocusScore] = useState<number>(8);
  const [wasLockedIn, setWasLockedIn] = useState(true);

  // Autosave status indicator string
  const [saveStatus, setSaveStatus] = useState('FILE STABLE');

  const activeColor = settings.accentColor === 'green' ? 'emerald' : 'blue';

  const todayStr = '2026-05-28';

  // Find if today already has a log entry
  const todayEntry = journal.find((j) => j.date === todayStr);

  // Initialize selected entry to today's entry (if exists) or the most recent log
  useEffect(() => {
    if (journal.length > 0) {
      const today = journal.find((j) => j.date === todayStr);
      if (today) {
        setSelectedEntry(today);
      } else {
        setSelectedEntry(journal[0]);
      }
    }
  }, [journal]);

  // Load editor data when selected entry changes
  useEffect(() => {
    if (selectedEntry) {
      setEntryText(selectedEntry.entryText);
      setImprovementsText(selectedEntry.improvementsText);
      setDistractionsText(selectedEntry.distractionsText);
      setTomorrowActionText(selectedEntry.tomorrowActionText);
      setFocusScore(selectedEntry.focusScore);
      setWasLockedIn(selectedEntry.wasLockedIn);
    } else {
      clearEditor();
    }
  }, [selectedEntry]);

  const clearEditor = () => {
    setEntryText('');
    setImprovementsText('');
    setDistractionsText('');
    setTomorrowActionText('');
    setFocusScore(8);
    setWasLockedIn(true);
  };

  // Simulated auto-saver trigger on text updates
  useEffect(() => {
    if (!selectedEntry || selectedEntry.date !== todayStr) return; // Only autosave today's entry

    setSaveStatus('WRITING...');
    
    const delayTimer = setTimeout(() => {
      // Auto commit
      addJournalEntry(
        entryText,
        focusScore,
        improvementsText,
        distractionsText,
        tomorrowActionText,
        wasLockedIn
      );
      setSaveStatus('FILE SAVED');
    }, 1500);

    return () => clearTimeout(delayTimer);
  }, [entryText, improvementsText, distractionsText, tomorrowActionText, focusScore, wasLockedIn]);

  // Handle explicit Save
  const handleManualSave = (e: FormEvent) => {
    e.preventDefault();
    addJournalEntry(
      entryText,
      focusScore,
      improvementsText,
      distractionsText,
      tomorrowActionText,
      wasLockedIn
    );
    setSaveStatus('COMPILED SECURELY');
  };

  const startNewTodayEntry = () => {
    clearEditor();
    // Simulate immediately setting state selection to today parameters
    setSelectedEntry({
      id: 'today_temp',
      date: todayStr,
      code: `ENTRY_${String(journal.length + 40).padStart(3, '0')}`,
      focusScore: 8,
      entryText: '',
      improvementsText: '',
      distractionsText: '',
      tomorrowActionText: '',
      wasLockedIn: true,
    });
  };

  // Filter journal list
  const filteredJournal = journal.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return (
      entry.date.includes(query) ||
      entry.code.toLowerCase().includes(query) ||
      entry.entryText.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 fade-in-blur">
      {/* View Header */}
      <div className="flex justify-between items-start border-b border-white/5 pb-5">
        <div>
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">// COGNITIVE REGISTRY</span>
          <h1 className="font-display text-2xl font-light text-white tracking-tight mt-1">Discipline Logs</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Logs History Index Section */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center space-x-2 bg-white/2 border border-white/5 rounded-lg p-2.5">
            <Search className="h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="Filter archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent font-mono text-xs border-none outline-none text-white placeholder-white/25"
            />
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {/* Create new entry for today button */}
            {!todayEntry && (
              <button
                onClick={startNewTodayEntry}
                className={`w-full p-3 border rounded-xl font-mono text-xs font-semibold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeColor === 'emerald'
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-500/35'
                    : 'border-blue-500/30 bg-blue-950/20 text-blue-400 hover:bg-blue-500/35'
                }`}
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>WRITE TODAY LOG</span>
              </button>
            )}

            {filteredJournal.length === 0 ? (
              <div className="text-center py-8 font-mono text-xs text-white/30 border border-white/5 rounded-2xl p-4 bg-[#080808]">
                No matching indexes found.
              </div>
            ) : (
              filteredJournal.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`w-full text-left p-4 rounded-xl border font-mono transition-all block cursor-pointer ${
                      isSelected
                        ? activeColor === 'emerald'
                          ? 'border-emerald-500/40 bg-emerald-950/10 text-white'
                          : 'border-blue-500/40 bg-blue-950/10 text-white'
                        : 'border-white/5 bg-[#080808]/80 hover:bg-[#0c0c0e] hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/30 text-[10px]">
                        {entry.code}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${
                        isSelected
                          ? activeColor === 'emerald' ? 'border-emerald-500/30 text-emerald-400' : 'border-blue-500/30 text-blue-400'
                          : 'border-white/5 text-white/40'
                      }`}>
                        FOCUS: {entry.focusScore}
                      </span>
                    </div>
                    <span className="block text-xs font-semibold text-white/70 truncate mb-1">
                      {entry.entryText || '(Draft text empty)'}
                    </span>
                    <span className="text-[10px] text-white/30 block mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {entry.date}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Distraction-Free Typewriter Editor */}
        <div className="md:col-span-2">
          {selectedEntry ? (
            <form onSubmit={handleManualSave} className="rounded-2xl border border-white/5 bg-[#080808] p-6 space-y-6 relative shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
              {/* Header registry logs details */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="font-mono">
                  <span className="block text-[8px] text-white/30">SECTOR SELECTION</span>
                  <span className="text-xs text-white/50 font-semibold">{selectedEntry.code} // {selectedEntry.date}</span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Save Status indicator */}
                  <span className="font-mono text-[9px] bg-white/2 border border-white/5 px-2 py-1 rounded text-white/40" title="State monitor indicator">
                     {saveStatus}
                  </span>
                </div>
              </div>

              {/* Sub-Forms and Interactive inputs */}
              <div className="space-y-4">
                {/* 1. Core reflection prompt block */}
                <div>
                  <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-2">
                    DID YOU TRULY LOCK IN TODAY? DISCUSS GENERAL REFLECTION
                  </label>
                  <textarea
                    required
                    disabled={selectedEntry.date !== todayStr}
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    placeholder="Woke up at 5:15 AM. Bypassed digital dopamine prompts. Locked in for blocks 1 & 2..."
                    className="w-full h-28 p-3 font-mono text-xs bg-white/2 border border-white/5 rounded-lg text-white placeholder-white/10 outline-none focus:border-white/20 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prompt A */}
                  <div>
                    <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-1.5 uppercase">
                      1. WHAT DID I IMPROVE TODAY?
                    </label>
                    <textarea
                      disabled={selectedEntry.date !== todayStr}
                      value={improvementsText}
                      onChange={(e) => setImprovementsText(e.target.value)}
                      placeholder="Better water intake. Kept focus sessions above 40 minutes."
                      className="w-full h-18 p-2.5 font-mono text-[10px] bg-white/2 border border-white/5 rounded-lg text-white placeholder-white/10 outline-none focus:border-white/20 transition-colors resize-none"
                    />
                  </div>

                  {/* Prompt B */}
                  <div>
                    <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-1.5 uppercase">
                      2. WHAT DISTRACTED ME?
                    </label>
                    <textarea
                      disabled={selectedEntry.date !== todayStr}
                      value={distractionsText}
                      onChange={(e) => setDistractionsText(e.target.value)}
                      placeholder="Took too long to make lunch, checked stock metrics."
                      className="w-full h-18 p-2.5 font-mono text-[10px] bg-white/2 border border-white/5 rounded-lg text-white placeholder-white/10 outline-none focus:border-white/20 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Prompt C */}
                <div>
                  <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-2 uppercase">
                    3. WHAT IS THE ABSOLUTE DEVIATION CRITICAL CORRECTION FOR TOMORROW?
                  </label>
                  <textarea
                    disabled={selectedEntry.date !== todayStr}
                    value={tomorrowActionText}
                    onChange={(e) => setTomorrowActionText(e.target.value)}
                    placeholder="Execute the hardest physics theorem immediately at 7:00 AM."
                    className="w-full h-16 p-2.5 font-mono text-[10px] bg-white/2 border border-white/5 rounded-lg text-white placeholder-white/10 outline-none focus:border-white/20 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Focus level score rating */}
                  <div>
                    <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-1.5">
                      FOCUS SCALE (1 to 10)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        disabled={selectedEntry.date !== todayStr}
                        value={focusScore}
                        onChange={(e) => setFocusScore(Number(e.target.value))}
                        className={`w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none ${
                           activeColor === 'emerald' ? 'accent-emerald-500 animate-pulse' : 'accent-blue-500 animate-pulse'
                        }`}
                      />
                      <span className="font-mono text-xs text-white font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                        {focusScore}
                      </span>
                    </div>
                  </div>

                  {/* High Intensity status */}
                  <div>
                    <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-1.5">
                      WERE YOU TRULY LOCKED IN?
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        disabled={selectedEntry.date !== todayStr}
                        onClick={() => setWasLockedIn(true)}
                        className={`px-4 py-1.5 rounded-lg font-mono text-[10px] border transition-all cursor-pointer ${
                          wasLockedIn
                            ? activeColor === 'emerald'
                              ? 'border-emerald-500/40 bg-emerald-950/35 text-white font-bold shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                              : 'border-blue-500/40 bg-blue-950/35 text-white font-bold shadow-[0_0_8px_rgba(59,130,246,0.1)]'
                            : 'border-white/5 bg-white/2 text-white/30 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        YES, ZERO COMPROMISE
                      </button>
                      <button
                        type="button"
                        disabled={selectedEntry.date !== todayStr}
                        onClick={() => setWasLockedIn(false)}
                        className={`px-4 py-1.5 rounded-lg font-mono text-[10px] border transition-all cursor-pointer ${
                          !wasLockedIn
                            ? 'border-rose-500/40 bg-rose-950/20 text-rose-300 font-bold shadow-[0_0_8px_rgba(244,63,94,0.1)]'
                            : 'border-white/5 bg-white/2 text-white/30 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        PARTIAL DISTRACTION
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Saved actions if it's today's drafts */}
              {selectedEntry.date === todayStr ? (
                <div className="flex justify-end pt-4 border-t border-white/5 pointer-events-none opacity-40">
                  <p className="font-mono text-[9px] text-white/30 flex items-center space-x-2">
                    <Sparkles className="h-3 w-3 inline text-white/40" />
                    <span>Autosave is active. Files persist immediately upon writing.</span>
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-white/30 font-mono text-[10px] flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-white/40 flex-shrink-0" />
                  <span>Archived journals are stored in read-only blocks and cannot be modified retrospectively.</span>
                </div>
              )}
            </form>
          ) : (
            <div className="h-full rounded-2xl border border-white/5 bg-[#080808] flex flex-col items-center justify-center p-8 py-24 text-center space-y-3 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
              <BookOpen className="h-7 w-7 text-white/10 mx-auto" />
              <h3 className="font-display text-sm font-semibold text-white/50 font-light">Reflection Center Unselected</h3>
              <p className="font-mono text-xs text-white/20 max-w-sm leading-relaxed">
                Select an existing journal log from the chronological registry, or click "WRITE TODAY LOG" to create a reflection sheet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
