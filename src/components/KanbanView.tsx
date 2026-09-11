import React, { useState, useMemo } from 'react';
import { ALL_MODALS, DOMAINS } from '../data/matrixData';
import { ModalTask, TaskStatus, UserOverridesMap } from '../types';
import { resolveTask } from '../utils/storage';
import { CheckCircle2, AlertTriangle, Clock, Bookmark, ArrowRight } from 'lucide-react';

interface KanbanViewProps {
  overrides: UserOverridesMap;
  onOpenModal: (id: number) => void;
  onUpdateTaskStatus: (id: number, status: TaskStatus) => void;
  searchQuery: string;
}

const COLUMNS: { id: TaskStatus; title: string; color: string; border: string; bg: string }[] = [
  { id: 'pending', title: 'Pendientes', color: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700', bg: 'bg-slate-100/70 dark:bg-slate-800/40' },
  { id: 'in_progress', title: 'En Progreso', color: 'text-amber-700 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-700', bg: 'bg-amber-50/50 dark:bg-amber-950/20' },
  { id: 'review', title: 'En Revisión', color: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-300 dark:border-indigo-700', bg: 'bg-indigo-50/50 dark:bg-indigo-950/20' },
  { id: 'blocked', title: 'Bloqueadas', color: 'text-rose-700 dark:text-rose-400', border: 'border-rose-300 dark:border-rose-700', bg: 'bg-rose-50/50 dark:bg-rose-950/20' },
  { id: 'completed', title: 'Completadas', color: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-700', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20' },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  overrides,
  onOpenModal,
  onUpdateTaskStatus,
  searchQuery,
}) => {
  const [domainFilter, setDomainFilter] = useState('all');

  // Filter tasks
  const tasksByColumn = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const map: Record<TaskStatus, ModalTask[]> = {
      pending: [],
      in_progress: [],
      review: [],
      blocked: [],
      completed: [],
    };

    ALL_MODALS.forEach((modal) => {
      if (domainFilter !== 'all' && modal.domainId !== domainFilter) return;

      if (q) {
        const matches =
          modal.code.toLowerCase().includes(q) ||
          modal.title.toLowerCase().includes(q) ||
          modal.domainName.toLowerCase().includes(q) ||
          modal.substageName.toLowerCase().includes(q);
        if (!matches) return;
      }

      const res = resolveTask(modal, overrides);
      map[res.status].push(modal);
    });

    return map;
  }, [overrides, domainFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Filtrar por Dominio:</span>
          <select
            id="kanban-filter-domain"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Todos los Dominios Estratégicos (5)</option>
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Arrastra o haz clic en cualquier tarjeta para abrir su modal
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {COLUMNS.map((col) => {
          const tasks = tasksByColumn[col.id];
          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl border ${col.border} ${col.bg} p-3 max-h-[75vh]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800 mb-3">
                <span className={`font-bold text-xs ${col.color} flex items-center gap-1.5`}>
                  {col.title}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {tasks.length}
                </span>
              </div>

              {/* Cards scroll container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {tasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    Sin tareas en esta etapa
                  </div>
                ) : (
                  tasks.slice(0, 50).map((modal) => {
                    const resolved = resolveTask(modal, overrides);
                    const doneCount = resolved.checklist.filter((c) => c.done).length;

                    return (
                      <div
                        key={modal.id}
                        id={`kanban-card-${modal.id}`}
                        onClick={() => onOpenModal(modal.id)}
                        className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all hover:shadow-md group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {modal.code}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                            {modal.domainName}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {modal.title}
                        </h4>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="font-medium">
                            ✓ {doneCount}/{resolved.checklist.length}
                          </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {resolved.assignedTo !== 'Sin asignar' ? resolved.assignedTo.split(' ')[0] : '—'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                {tasks.length > 50 && (
                  <div className="text-center text-[11px] text-slate-500 py-1">
                    + {tasks.length - 50} tareas más (usa filtros para acotar)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
