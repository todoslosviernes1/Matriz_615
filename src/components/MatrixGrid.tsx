import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, Layers, Bookmark, 
  Search, Eye, Filter, Sparkles, ChevronRight, HelpCircle
} from 'lucide-react';
import { DOMAINS, ALL_SUBSTAGES, ALL_MODALS, formatModalCode } from '../data/matrixData';
import { ModalTask, TaskStatus, UserOverridesMap } from '../types';

interface MatrixGridProps {
  overrides: UserOverridesMap;
  onOpenModal: (modalId: number) => void;
  activeModalId: number | null;
  searchQuery: string;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  overrides,
  onOpenModal,
  activeModalId,
  searchQuery,
}) => {
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [hoveredModalId, setHoveredModalId] = useState<number | null>(null);
  const [density, setDensity] = useState<'compact' | 'comfortable'>('compact');

  // Match search filter
  const searchLower = searchQuery.toLowerCase().trim();

  // Status background map for matrix cells
  const getCellClasses = (modal: ModalTask, status: TaskStatus, isFav: boolean, matchesSearch: boolean) => {
    const isActive = activeModalId === modal.id;
    let base = 'relative transition-all duration-150 rounded-sm cursor-pointer select-none ';

    if (isActive) {
      base += 'ring-2 ring-indigo-500 ring-offset-1 z-10 scale-110 shadow-md ';
    }

    if (!matchesSearch && searchLower) {
      return base + 'opacity-20 bg-slate-200 dark:bg-slate-800 ';
    }

    switch (status) {
      case 'completed':
        base += 'bg-emerald-500 hover:bg-emerald-400 text-white ';
        break;
      case 'in_progress':
        base += 'bg-amber-400 hover:bg-amber-300 text-slate-950 ';
        break;
      case 'review':
        base += 'bg-indigo-500 hover:bg-indigo-400 text-white ';
        break;
      case 'blocked':
        base += 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse ';
        break;
      default:
        base += 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 ';
        break;
    }

    return base;
  };

  const hoveredTask = useMemo(() => {
    if (!hoveredModalId) return null;
    return ALL_MODALS.find((m) => m.id === hoveredModalId) || null;
  }, [hoveredModalId]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Control bar above Matrix */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-indigo-500" /> Filtros de Matriz:
          </span>

          {/* Domain Filter */}
          <select
            id="matrix-filter-domain"
            value={selectedDomainFilter}
            onChange={(e) => setSelectedDomainFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-hidden"
          >
            <option value="all">Todos los 5 Dominios Estratégicos</option>
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="matrix-filter-status"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-hidden"
          >
            <option value="all">Todos los Estados</option>
            <option value="completed">🟢 Completadas</option>
            <option value="in_progress">🟡 En Progreso</option>
            <option value="review">🟣 En Revisión</option>
            <option value="blocked">🔴 Bloqueadas</option>
            <option value="pending">🔘 Pendientes</option>
          </select>

          {/* Favorites only */}
          <button
            id="matrix-btn-fav-filter"
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              onlyFavorites
                ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
            Solo Marcadas
          </button>
        </div>

        {/* Legend & Density */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700 inline-block" /> Pendiente
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" /> En curso
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 inline-block" /> Revisión
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" /> Bloqueada
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Hecho
            </span>
          </div>

          <button
            id="matrix-btn-density"
            type="button"
            onClick={() => setDensity(density === 'compact' ? 'comfortable' : 'compact')}
            className="px-2 py-1 text-[11px] rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {density === 'compact' ? 'Vista Ampliada' : 'Vista Compacta (25×25)'}
          </button>
        </div>
      </div>

      {/* Main Matrix Heatmap Grid */}
      <div className="relative overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="min-w-[760px]">
          {/* Top Column numbers 1..25 */}
          <div className="flex items-center mb-2 pl-44 sm:pl-56">
            <div className="grid grid-cols-25 gap-1 w-full text-[10px] font-mono text-slate-400 text-center select-none">
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i} title={`Acción Operativa ${i + 1}`}>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          {/* 25 Rows (Substages) grouped by Domain */}
          <div className="space-y-4">
            {DOMAINS.map((domain) => {
              // Check if domain filtered out
              if (selectedDomainFilter !== 'all' && selectedDomainFilter !== domain.id) {
                return null;
              }

              return (
                <div 
                  key={domain.id} 
                  className={`p-3 rounded-xl border ${domain.bgColor} ${domain.borderColor}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${domain.color}`}>
                        {domain.name}
                      </span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/50 dark:border-slate-700/50">
                        5 Sub-etapas • 125 Modales
                      </span>
                    </div>
                  </div>

                  {/* 5 Substages of this domain */}
                  <div className="space-y-1.5">
                    {domain.substages.map((substage) => {
                      const substageRowIdx = substage.globalSubstageIndex; // 0..24
                      const rowModals = ALL_MODALS.slice(substageRowIdx * 25, substageRowIdx * 25 + 25);

                      return (
                        <div key={substage.id} className="flex items-center gap-2">
                          {/* Substage label */}
                          <div 
                            className="w-40 sm:w-52 shrink-0 text-right pr-2 text-xs font-medium text-slate-700 dark:text-slate-300 truncate"
                            title={`Etapa ${substageRowIdx + 1}: ${substage.name}`}
                          >
                            <span className="text-slate-400 font-mono text-[10px] mr-1">
                              E{substageRowIdx + 1}
                            </span>
                            {substage.name}
                          </div>

                          {/* 25 Cell Matrix Row */}
                          <div className="grid grid-cols-25 gap-1 flex-1">
                            {rowModals.map((modal) => {
                              const o = overrides[modal.id];
                              const status = o?.status || 'pending';
                              const isFav = !!o?.isFavorite;

                              // Filter criteria check
                              if (selectedStatusFilter !== 'all' && status !== selectedStatusFilter) {
                                return (
                                  <div
                                    key={modal.id}
                                    className="h-5 rounded-xs bg-slate-100 dark:bg-slate-800/40 opacity-20"
                                    title={`${modal.code} (Filtrado)`}
                                  />
                                );
                              }
                              if (onlyFavorites && !isFav) {
                                return (
                                  <div
                                    key={modal.id}
                                    className="h-5 rounded-xs bg-slate-100 dark:bg-slate-800/40 opacity-20"
                                    title={`${modal.code} (No marcado)`}
                                  />
                                );
                              }

                              const matchesSearch = !searchLower || 
                                modal.title.toLowerCase().includes(searchLower) ||
                                modal.code.toLowerCase().includes(searchLower) ||
                                modal.substageName.toLowerCase().includes(searchLower) ||
                                modal.tags.some(t => t.toLowerCase().includes(searchLower));

                              const cellHeight = density === 'compact' ? 'h-5.5' : 'h-7';

                              return (
                                <button
                                  key={modal.id}
                                  id={`matrix-cell-${modal.id}`}
                                  type="button"
                                  onClick={() => onOpenModal(modal.id)}
                                  onMouseEnter={() => setHoveredModalId(modal.id)}
                                  onMouseLeave={() => setHoveredModalId(null)}
                                  className={`${cellHeight} flex items-center justify-center font-mono text-[9px] font-bold ${getCellClasses(
                                    modal,
                                    status,
                                    isFav,
                                    matchesSearch
                                  )}`}
                                  title={`${modal.code}: ${modal.title} (${status})`}
                                >
                                  {density === 'comfortable' ? (
                                    <span>{modal.id % 25 || 25}</span>
                                  ) : (
                                    isFav && <span className="text-[7px]">★</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hovered Modal Quick Inspector Box */}
        {hoveredTask && (
          <div className="mt-4 p-3 rounded-xl bg-slate-900 text-slate-100 shadow-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white">
                {hoveredTask.code}
              </span>
              <div>
                <span className="font-semibold text-white">{hoveredTask.title}</span>
                <span className="text-slate-400 block sm:inline sm:ml-2">
                  ({hoveredTask.substageName} • {hoveredTask.domainName})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-slate-400 font-mono">
                Estado: <span className="text-amber-300 font-semibold">{overrides[hoveredTask.id]?.status || 'pending'}</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenModal(hoveredTask.id)}
                className="px-3 py-1 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                Abrir Modal <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
