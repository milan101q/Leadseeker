import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, ShieldAlert, CheckCircle, Search } from 'lucide-react';

interface ConsoleLogProps {
  logs: LogEntry[];
}

const ConsoleLog: React.FC<ConsoleLogProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} className="text-green-500" />;
      case 'warning': return <ShieldAlert size={14} className="text-yellow-500" />;
      case 'error': return <ShieldAlert size={14} className="text-red-500" />;
      case 'process': return <Search size={14} className="text-blue-400" />;
      default: return <span className="w-3.5 h-3.5 block rounded-full bg-slate-600" />;
    }
  };

  const getColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'process': return 'text-blue-300';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg shadow-xl overflow-hidden flex flex-col h-[300px] border border-slate-700">
      <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-slate-400" />
          <span className="text-xs font-mono text-slate-300">Scanner Output</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      <div className="p-4 overflow-y-auto font-mono text-xs space-y-2 flex-1 console-scrollbar">
        {logs.length === 0 && (
          <div className="text-slate-500 italic">Waiting to start scan...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-500 whitespace-nowrap">
              [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
            </span>
            <div className="mt-0.5">{getIcon(log.type)}</div>
            <span className={`${getColor(log.type)} break-all`}>{log.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ConsoleLog;