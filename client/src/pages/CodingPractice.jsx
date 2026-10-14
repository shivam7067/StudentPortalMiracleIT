import React, { useState } from 'react';
import { codingProblems } from '../data/dummyData';
import { 
  Code2, 
  Play, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function CodingPractice() {
  const [selectedProb, setSelectedProb] = useState(codingProblems[0]);
  const [code, setCode] = useState(selectedProb.starterCode);
  const [language, setLanguage] = useState('JavaScript (ES6)');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const filteredProblems = codingProblems.filter(p => {
    if (difficultyFilter === 'All') return true;
    return p.difficulty === difficultyFilter;
  });

  const handleSelectProblem = (prob) => {
    setSelectedProb(prob);
    setCode(prob.starterCode);
    setExecutionResult(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionResult(null);
    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'Accepted',
        runtime: '18 ms',
        memory: '42.1 MB',
        testCasesPassed: '12 / 12',
        output: '[0, 1]'
      });
    }, 700);
  };

  const handleResetCode = () => {
    setCode(selectedProb.starterCode);
    setExecutionResult(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">MiracleIT Interactive Browser IDE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Solve real-world algorithmic problems, submit solutions, and get automated test case evaluations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                difficultyFilter === diff
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Main IDE Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        
        {/* Left Column (4 cols): Problem Selector & Description */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Quick Problem List Selector */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Curated Problem Set ({filteredProblems.length})
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredProblems.map((prob) => (
                <button
                  key={prob.id}
                  onClick={() => handleSelectProblem(prob)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition text-left ${
                    selectedProb.id === prob.id
                      ? 'bg-indigo-600/20 border border-indigo-500/50 text-white'
                      : 'bg-slate-950/60 border border-slate-850 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {prob.solved ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{prob.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      prob.difficulty === 'Easy'
                        ? 'text-emerald-400 bg-emerald-950/80'
                        : prob.difficulty === 'Medium'
                        ? 'text-amber-400 bg-amber-950/80'
                        : 'text-rose-400 bg-rose-950/80'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Problem Statement Card */}
          <div className="flex-1 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-indigo-400 font-semibold">{selectedProb.category}</span>
                <span className="text-xs text-slate-400 font-mono">Acceptance: {selectedProb.acceptance}</span>
              </div>

              <h3 className="text-lg font-bold text-white">{selectedProb.title}</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {selectedProb.description}
              </p>

              {/* Examples */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Example Cases:</span>
                {selectedProb.examples.map((ex, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs font-mono">
                    <div className="text-slate-400">Input: <span className="text-slate-200">{ex.input}</span></div>
                    <div className="text-slate-400 mt-1">Output: <span className="text-emerald-400">{ex.output}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Time Limit: 2.0s</span>
              <span>Memory Limit: 256MB</span>
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Code Editor & Compiler Output */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          <div className="flex-1 rounded-2xl bg-slate-900/95 border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
            
            {/* Editor Top Bar */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                >
                  <option>JavaScript (ES6)</option>
                  <option>TypeScript</option>
                  <option>Python 3</option>
                  <option>Java 17</option>
                  <option>C++ 20</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Reset to starter template"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Solution</span>
                </button>
              </div>
            </div>

            {/* Code Textarea / Simulated IDE */}
            <div className="relative flex-1 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                rows={16}
                className="w-full h-full bg-transparent resize-none focus:outline-none leading-relaxed text-indigo-100 font-mono"
              />
            </div>

            {/* Terminal Output / Test Runner Console */}
            <div className="p-4 bg-slate-950 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-900">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Execution Console
                </span>
                {executionResult && (
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                    {executionResult.status} ({executionResult.runtime})
                  </span>
                )}
              </div>

              {isRunning ? (
                <div className="py-4 text-xs font-mono text-cyan-400 animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Running against test suite on MiracleIT Cloud sandbox...
                </div>
              ) : executionResult ? (
                <div className="pt-2 text-xs font-mono space-y-1">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Success: {executionResult.testCasesPassed} Test Cases Passed</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Runtime: <span className="text-slate-200">{executionResult.runtime}</span> • Memory: <span className="text-slate-200">{executionResult.memory}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 mt-2">
                    Result Output: {executionResult.output}
                  </div>
                </div>
              ) : (
                <div className="py-3 text-xs font-mono text-slate-400">
                  Click "Run Code" or "Submit Solution" to trigger the compiler suite.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
