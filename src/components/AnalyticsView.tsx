import React from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp, 
  DollarSign, ShieldAlert, Sparkles, Download, RotateCcw, Upload
} from 'lucide-react';
import { DOMAINS, ALL_MODALS } from '../data/matrixData';
import { UserOverridesMap } from '../types';
import { computeMatrixStats, resolveTask } from '../utils/storage';

interface AnalyticsViewProps {
  overrides: UserOverridesMap;
  onOpenModal: (id: number) => void;
  onResetProgress: () => void;
  onExportJson: () => void;
  onImportJson: (json: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  overrides,
  onOpenModal,
  onResetProgress,
  onExportJson,
  onImportJson,
}) => {
  const stats = computeMatrixStats(overrides);

  // Compute progress per domain
  const domainProgress = DOMAINS.map((domain) => {
    const domainTasks = ALL_MODALS.filter((m) => m.domainId === domain.id);
    let completed = 0;
    let inProgress = 0;
    let blocked = 0;

    domainTasks.forEach((t) => {
      const res = resolveTask(t, overrides);
      if (res.status === 'completed') completed++;
      else if (res.status === 'in_progress') inProgress++;
      else if (res.status === 'blocked') blocked++;
    });

    return {
      domain,
      total: domainTasks.length, // 125
      completed,
      inProgress,
      blocked,
      pct: Math.round((completed / domainTasks.length) * 100),
    };
  });

  // Find all blocked tasks across all 625 modals
  const blockedTasks = ALL_MODALS.filter((m) => {
    return (overrides[m.id]?.status || 'pending') === 'blocked';
  });

  // High impact quick wins (impact >= 7, effort <= 4)
  const quickWins = ALL_MODALS.filter((m) => {
    const res = resolveTask(m, overrides);
    return res.impactScore >= 7 && res.effortScore <= 4 && res.status !== 'completed';
  }).slice(0, 6);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJson(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Progreso Global</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight font-mono">
            {stats.completionPercentage}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.completed} de 625 modales completados
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>En Ejecución</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
            {stats.inProgress + stats.review}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.inProgress} en curso • {stats.review} en revisión
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Bloqueos Críticos</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight font-mono">
            {stats.blocked}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Requieren resolución inmediata
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Pendientes</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-700 dark:text-slate-300 tracking-tight font-mono">
            {stats.pending}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Disponibles en el backlog de la matriz
          </div>
        </div>
      </div>

      {/* Progress Breakdown per Domain */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          Rendimiento por Dominio Estratégico (125 Modales por Dominio)
        </h3>

        <div className="space-y-4">
          {domainProgress.map(({ domain, total, completed, inProgress, blocked, pct }) => (
            <div key={domain.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${domain.color}`}>
                    {domain.name}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    ({completed}/{total} completados)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {blocked > 0 && (
                    <span className="text-rose-500 text-[11px] font-bold">
                      {blocked} bloqueadas
                    </span>
                  )}
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {pct}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(completed / total) * 100}%` }}
                  title={`${completed} completadas`}
                />
                <div 
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${(inProgress / total) * 100}%` }}
                  title={`${inProgress} en curso`}
                />
                <div 
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${(blocked / total) * 100}%` }}
                  title={`${blocked} bloqueadas`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Blockages & Quick Wins grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Critical Blockages */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-950/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Modales en Estado Bloqueado ({blockedTasks.length})
            </h3>
          </div>

          {blockedTasks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No hay tareas bloqueadas actualmente. ¡Excelente flujo!
            </div>
          ) : (
            <div className="space-y-2.5">
              {blockedTasks.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onOpenModal(m.id)}
                  className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 hover:border-rose-400 cursor-pointer transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-800 dark:text-rose-300">
                        {m.code}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {m.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                      {overrides[m.id]?.notes || 'Requiere intervención técnica o decisión ejecutiva.'}
                    </div>
                  </div>
                  <span className="text-xs text-rose-700 dark:text-rose-300 font-bold shrink-0 ml-2">
                    Abrir →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Wins (High impact, low effort) */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Victorias Rápidas Sugeridas (Alto Impacto)
            </h3>
          </div>

          <div className="space-y-2.5">
            {quickWins.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Todas las victorias rápidas han sido completadas.
              </div>
            ) : (
              quickWins.map((m) => {
                const res = resolveTask(m, overrides);
                return (
                  <div
                    key={m.id}
                    onClick={() => onOpenModal(m.id)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {m.code}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {m.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Impacto {res.impactScore}/10 • Esfuerzo {res.effortScore}/10
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold shrink-0 ml-2">
                      Ejecutar →
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Data Management & Export / Reset Bar */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Gestión de Datos y Copia de Seguridad
          </h4>
          <p className="text-slate-500 text-xs mt-0.5">
            Descarga el estado completo de los 625 modales en JSON o restaura un backup previo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="analytics-btn-export"
            type="button"
            onClick={onExportJson}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar JSON
          </button>

          <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Importar
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            id="analytics-btn-reset"
            type="button"
            onClick={onResetProgress}
            className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar a Valores Iniciales
          </button>
        </div>
      </div>
    </div>
  );
};
