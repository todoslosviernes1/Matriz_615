import React from 'react';
import { Layers, Bookmark, Sparkles, Plus, X, ArrowUpRight } from 'lucide-react';
import { formatModalCode, MODAL_BY_ID } from '../data/matrixData';
import { UserOverridesMap } from '../types';

interface ModalStackDockProps {
  pinnedIds: number[];
  recentIds: number[];
  activeModalId: number | null;
  onOpenModal: (id: number) => void;
  onUnpin: (id: number) => void;
  onRandomModal: () => void;
  overrides: UserOverridesMap;
}

export const ModalStackDock: React.FC<ModalStackDockProps> = ({
  pinnedIds,
  recentIds,
  activeModalId,
  onOpenModal,
  onUnpin,
  onRandomModal,
  overrides,
}) => {
  // Combine pinned and unique recent (excluding pinned duplicates)
  const combined = Array.from(new Set([...pinnedIds, ...recentIds])).slice(0, 8);

  if (combined.length === 0) return null;

  return (
    <div 
      id="modal-stack-dock"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] sm:w-auto bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-1 pr-1.5 shrink-0">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Modales:</span>
        </span>

        {combined.map((id) => {
          const task = MODAL_BY_ID[id];
          if (!task) return null;
          const isPinned = pinnedIds.includes(id);
          const isActive = activeModalId === id;
          const status = overrides[id]?.status || 'pending';

          const statusDot = {
            completed: 'bg-emerald-400',
            in_progress: 'bg-amber-400',
            review: 'bg-indigo-400',
            blocked: 'bg-rose-400',
            pending: 'bg-slate-500',
          }[status];

          return (
            <div
              key={id}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all text-xs shrink-0 ${
                isActive
                  ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => onOpenModal(id)}
                className="flex items-center gap-1.5 font-mono"
                title={`${task.code}: ${task.title}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                <span>{task.code}</span>
                {isPinned && <Bookmark className="w-2.5 h-2.5 text-amber-300 fill-current" />}
              </button>

              {isPinned && (
                <button
                  type="button"
                  onClick={() => onUnpin(id)}
                  className="ml-1 text-slate-400 hover:text-white"
                  title="Desanclar"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1 shrink-0 border-l border-slate-700 pl-2">
        <button
          id="dock-btn-random"
          type="button"
          onClick={onRandomModal}
          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-medium flex items-center gap-1 transition-colors"
          title="Abrir un modal aleatorio de los 625 disponibles"
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span className="hidden sm:inline">Aleatorio</span>
        </button>
      </div>
    </div>
  );
};
