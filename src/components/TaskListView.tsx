import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Filter, Bookmark, 
  Clock, CheckCircle2, AlertCircle, ArrowUpDown, ExternalLink
} from 'lucide-react';
import { ALL_MODALS, DOMAINS, ALL_SUBSTAGES } from '../data/matrixData';
import { ModalTask, TaskPriority, TaskStatus, UserOverridesMap } from '../types';
import { resolveTask } from '../utils/storage';

interface TaskListViewProps {
  overrides: UserOverridesMap;
  onOpenModal: (id: number) => void;
  searchQuery: string;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  overrides,
  onOpenModal,
  searchQuery,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25; // 25 items per page (25 pages for 625 modals)
  const [domainFilter, setDomainFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'id' | 'complexity' | 'priority' | 'status'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredTasks = useMemo(() => {
    return ALL_MODALS.filter((modal) => {
      const resolved = resolveTask(modal, overrides);

      if (domainFilter !== 'all' && modal.domainId !== domainFilter) return false;
      if (statusFilter !== 'all' && resolved.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && resolved.priority !== priorityFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          modal.code.toLowerCase().includes(q) ||
          modal.title.toLowerCase().includes(q) ||
          modal.domainName.toLowerCase().includes(q) ||
          modal.substageName.toLowerCase().includes(q) ||
          resolved.assignedTo.toLowerCase().includes(q) ||
          modal.tags.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      const resA = resolveTask(a, overrides);
      const resB = resolveTask(b, overrides);

      let valA: any = a.id;
      let valB: any = b.id;

      if (sortBy === 'complexity') {
        valA = a.complexity;
        valB = b.complexity;
      } else if (sortBy === 'priority') {
        const pOrder: Record<TaskPriority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
        valA = pOrder[resA.priority];
        valB = pOrder[resB.priority];
      } else if (sortBy === 'status') {
        valA = resA.status;
        valB = resB.status;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [domainFilter, statusFilter, priorityFilter, searchQuery, sortBy, sortAsc, overrides]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const currentTasks = filteredTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: 'id' | 'complexity' | 'priority' | 'status') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const statusBadge = (status: TaskStatus) => {
    const map = {
      pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      review: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      blocked: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    };
    const labels = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      blocked: 'Bloqueada',
      completed: 'Completada',
    };
    return (
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            id="list-filter-domain"
            value={domainFilter}
            onChange={(e) => {
              setDomainFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Todos los Dominios (5)</option>
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            id="list-filter-status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">🔘 Pendiente</option>
            <option value="in_progress">🟡 En Progreso</option>
            <option value="review">🟣 En Revisión</option>
            <option value="blocked">🔴 Bloqueada</option>
            <option value="completed">🟢 Completada</option>
          </select>

          <select
            id="list-filter-priority"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Todas las Prioridades</option>
            <option value="critical">Prioridad Crítica</option>
            <option value="high">Prioridad Alta</option>
            <option value="medium">Prioridad Media</option>
            <option value="low">Prioridad Baja</option>
          </select>
        </div>

        <div className="text-slate-500 dark:text-slate-400 font-medium">
          Mostrando {filteredTasks.length} de 625 modales (Página {currentPage} de {totalPages})
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            <tr>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  Código <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3">Tarea Operativa & Dominio</th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  Estado <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('priority')}>
                <div className="flex items-center gap-1">
                  Prioridad <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3">Responsable</th>
              <th className="px-4 py-3">Checklist</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {currentTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  No se encontraron modales con los filtros aplicados.
                </td>
              </tr>
            ) : (
              currentTasks.map((task) => {
                const resolved = resolveTask(task, overrides);
                const doneCount = resolved.checklist.filter((c) => c.done).length;
                const totalCount = resolved.checklist.length;

                return (
                  <tr 
                    key={task.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenModal(task.id)}
                          className="hover:underline text-indigo-600 dark:text-indigo-400"
                        >
                          {task.code}
                        </button>
                        {resolved.isFavorite && (
                          <Bookmark className="w-3 h-3 text-rose-500 fill-current" />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{task.domainName}</span>
                        <span>•</span>
                        <span>{task.substageName}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {statusBadge(resolved.status)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="capitalize font-medium">
                        {resolved.priority}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {resolved.assignedTo}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${(doneCount / totalCount) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px]">
                          {doneCount}/{totalCount}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        id={`list-btn-open-${task.id}`}
                        type="button"
                        onClick={() => onOpenModal(task.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        Abrir Modal
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-2 text-xs">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        <div className="flex items-center gap-1 font-medium">
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-md font-mono ${
                  currentPage === pageNum
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 7 && <span className="px-1 text-slate-400">... {totalPages}</span>}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center gap-1"
        >
          Siguiente <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
