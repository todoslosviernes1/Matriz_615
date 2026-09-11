import React, { useState } from 'react';
import { 
  Grid, List, Kanban, BarChart3, Search, Sparkles, 
  ArrowRight, CheckCircle2, Bookmark, Compass
} from 'lucide-react';
import { ViewMode, UserOverridesMap } from '../types';
import { computeMatrixStats } from '../utils/storage';

interface NavigationHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenCommandPalette: () => void;
  onJumpToId: (id: number) => void;
  onOpenNextPending: () => void;
  onRandomModal: () => void;
  overrides: UserOverridesMap;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenCommandPalette,
  onJumpToId,
  onOpenNextPending,
  onRandomModal,
  overrides,
}) => {
  const [jumpVal, setJumpVal] = useState('');
  const stats = computeMatrixStats(overrides);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpVal.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= 1 && num <= 625) {
      onJumpToId(num);
      setJumpVal('');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & Stats */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold shadow-md shadow-indigo-500/20">
                625
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Matriz 625
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    625 Modales
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Gestión integral de tareas y protocolos operativos
                </p>
              </div>
            </div>

            {/* Quick Mobile / Tablet mini progress */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {stats.completed}/625 ({stats.completionPercentage}%)
                </div>
                <div className="text-[10px] text-slate-400">Completados</div>
              </div>
              <div className="w-14 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center search & jump buttons */}
          <div className="flex items-center gap-2 flex-1 max-w-md mx-0 md:mx-4">
            <button
              id="header-btn-search"
              type="button"
              onClick={onOpenCommandPalette}
              className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Buscar modal (ej. MOD-042 o nombre)...</span>
              </span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Quick jump input */}
            <form onSubmit={handleJumpSubmit} className="flex items-center shrink-0">
              <input
                id="header-input-jump"
                type="text"
                placeholder="#1..625"
                value={jumpVal}
                onChange={(e) => setJumpVal(e.target.value)}
                className="w-16 px-2 py-1.5 text-xs text-center font-mono rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-hidden"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 text-xs font-bold rounded-r-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-l-0 border-slate-200 dark:border-slate-700"
                title="Abrir modal por número de 1 a 625"
              >
                →
              </button>
            </form>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="header-btn-next-pending"
              type="button"
              onClick={onOpenNextPending}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              title="Abrir el siguiente modal en estado pendiente"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden lg:inline">Siguiente Pendiente</span>
            </button>

            <button
              id="header-btn-random"
              type="button"
              onClick={onRandomModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              title="Explorar un modal aleatorio"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">Aleatorio</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher Subbar */}
        <div className="flex items-center gap-1 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            id="view-tab-matrix"
            type="button"
            onClick={() => onViewModeChange('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
              viewMode === 'matrix'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Matriz 25×25 (625 Células)
          </button>

          <button
            id="view-tab-list"
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Directorio de Tareas
          </button>

          <button
            id="view-tab-kanban"
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
              viewMode === 'kanban'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Tablero Kanban
          </button>

          <button
            id="view-tab-analytics"
            type="button"
            onClick={() => onViewModeChange('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
              viewMode === 'analytics'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Métricas & Auditoría
          </button>
        </div>
      </div>
    </header>
  );
};
