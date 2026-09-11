import React, { useState, useEffect } from 'react';
import { 
  X, CheckSquare, Square, ChevronLeft, ChevronRight, Bookmark, 
  Share2, AlertTriangle, Clock, Layers, Sparkles, 
  ExternalLink, Calendar, User, DollarSign, Target, Save, CheckCircle2
} from 'lucide-react';
import { ModalTask, TaskPriority, TaskStatus, UserOverridesMap, UserTaskOverride } from '../types';
import { DOMAINS, formatModalCode } from '../data/matrixData';
import { resolveTask } from '../utils/storage';

interface ModalWindowProps {
  modal: ModalTask;
  overrides: UserOverridesMap;
  onClose: () => void;
  onNavigateModal: (targetId: number) => void;
  onUpdateTask: (modalId: number, update: Partial<UserTaskOverride>) => void;
  onToggleFavorite: (modalId: number) => void;
  isPinned: boolean;
  onTogglePin: (modalId: number) => void;
}

export const ModalWindow: React.FC<ModalWindowProps> = ({
  modal,
  overrides,
  onClose,
  onNavigateModal,
  onUpdateTask,
  onToggleFavorite,
  isPinned,
  onTogglePin,
}) => {
  const resolved = resolveTask(modal, overrides);
  const [activeTab, setActiveTab] = useState<'checklist' | 'parameters' | 'notes'>('checklist');
  const [jumpInput, setJumpInput] = useState<string>('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  // Local form states synced with current resolved task
  const [status, setStatus] = useState<TaskStatus>(resolved.status);
  const [priority, setPriority] = useState<TaskPriority>(resolved.priority);
  const [assignedTo, setAssignedTo] = useState<string>(resolved.assignedTo);
  const [dueDate, setDueDate] = useState<string>(resolved.dueDate);
  const [impactScore, setImpactScore] = useState<number>(resolved.impactScore);
  const [effortScore, setEffortScore] = useState<number>(resolved.effortScore);
  const [budgetEstimate, setBudgetEstimate] = useState<number>(resolved.budgetEstimate);
  const [riskLevel, setRiskLevel] = useState<'bajo' | 'medio' | 'alto' | 'critico'>(resolved.riskLevel);
  const [notes, setNotes] = useState<string>(resolved.notes);
  const [deliverableUrl, setDeliverableUrl] = useState<string>(resolved.deliverableUrl);
  const [checklist, setChecklist] = useState(resolved.checklist);

  // Re-sync when modal changes
  useEffect(() => {
    setStatus(resolved.status);
    setPriority(resolved.priority);
    setAssignedTo(resolved.assignedTo);
    setDueDate(resolved.dueDate);
    setImpactScore(resolved.impactScore);
    setEffortScore(resolved.effortScore);
    setBudgetEstimate(resolved.budgetEstimate);
    setRiskLevel(resolved.riskLevel);
    setNotes(resolved.notes);
    setDeliverableUrl(resolved.deliverableUrl);
    setChecklist(resolved.checklist);
    setActiveTab('checklist');
  }, [modal.id]);

  // Keyboard navigation: Escape closes, Left/Right navigates
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleToggleCheckItem = (index: number) => {
    const updated = [...checklist];
    updated[index] = { ...updated[index], done: !updated[index].done };
    setChecklist(updated);

    // Auto calculate if all done
    const allDone = updated.every((c) => c.done);
    const newStatus: TaskStatus = allDone ? 'completed' : status === 'completed' ? 'in_progress' : status;
    setStatus(newStatus);

    onUpdateTask(modal.id, {
      checklist: updated,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSaveAll = () => {
    onUpdateTask(modal.id, {
      status,
      priority,
      assignedTo,
      dueDate,
      impactScore,
      effortScore,
      budgetEstimate,
      riskLevel,
      notes,
      deliverableUrl,
      checklist,
      updatedAt: new Date().toISOString(),
    });
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const handleQuickStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    if (newStatus === 'completed') {
      const allChecked = checklist.map((c) => ({ ...c, done: true }));
      setChecklist(allChecked);
      onUpdateTask(modal.id, {
        status: newStatus,
        checklist: allChecked,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onUpdateTask(modal.id, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= 1 && num <= 625) {
      onNavigateModal(num);
      setJumpInput('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}#${modal.code}`);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const domain = DOMAINS.find((d) => d.id === modal.domainId);
  const completedCount = checklist.filter((c) => c.done).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  // Status visual configs
  const statusColors = {
    pending: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    in_progress: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    review: 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    blocked: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    completed: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  };

  const statusLabels: Record<TaskStatus, string> = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    review: 'En Revisión',
    blocked: 'Bloqueada',
    completed: 'Completada',
  };

  const priorityLabels: Record<TaskPriority, { label: string; color: string }> = {
    low: { label: 'Prioridad Baja', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
    medium: { label: 'Prioridad Media', color: 'text-sky-700 bg-sky-100 dark:bg-sky-950 dark:text-sky-300' },
    high: { label: 'Prioridad Alta', color: 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300' },
    critical: { label: 'Prioridad Crítica', color: 'text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300' },
  };

  // ROI / Quadrant calculation
  const roiScore = ((impactScore * 2) / Math.max(effortScore, 1)).toFixed(1);
  const getQuadrant = () => {
    if (impactScore >= 6 && effortScore <= 5) return '⭐ Victoria Rápida (Alto Impacto / Bajo Esfuerzo)';
    if (impactScore >= 6 && effortScore > 5) return '🎯 Proyecto Estratégico Mayor';
    if (impactScore < 6 && effortScore <= 5) return '🛠️ Mejora Menor / Relleno';
    return '⚠️ Deuda Técnica / Posible Descarte';
  };

  return (
    <div 
      id={`modal-overlay-${modal.id}`} 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id={`modal-container-${modal.id}`}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 text-xs font-mono font-bold tracking-wider rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              {modal.code}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${domain?.bgColor || 'bg-slate-100'} ${domain?.color || 'text-slate-700'} ${domain?.borderColor || 'border-slate-200'}`}>
              {domain?.name || modal.domainName}
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 truncate">
              {modal.substageName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`modal-btn-pin-${modal.id}`}
              type="button"
              onClick={() => onTogglePin(modal.id)}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                isPinned 
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300' 
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isPinned ? 'Desanclar del dock rápido' : 'Anclar al dock de modales activos'}
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              id={`modal-btn-favorite-${modal.id}`}
              type="button"
              onClick={() => onToggleFavorite(modal.id)}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                resolved.isFavorite 
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:text-rose-400' 
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Guardar en Favoritos"
            >
              <Bookmark className={`w-4 h-4 ${resolved.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              id={`modal-btn-share-${modal.id}`}
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copiar identificador único"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              id={`modal-btn-close-${modal.id}`}
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Cerrar modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback toasts */}
        {copiedFeedback && (
          <div className="absolute top-16 right-6 z-20 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-md shadow-lg animate-in fade-in">
            ✓ Enlace de modal copiado al portapapeles
          </div>
        )}
        {saveBanner && (
          <div className="absolute top-16 right-6 z-20 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md shadow-lg animate-in fade-in flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Cambios guardados
          </div>
        )}

        {/* Modal Main Title & Executive Status Bar */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                {modal.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {modal.substageName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {modal.estimatedHours}h estimadas
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Complejidad:
                  <span className="inline-flex gap-0.5 ml-0.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-2 h-2 rounded-full ${
                          lvl <= modal.complexity 
                            ? 'bg-amber-500' 
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </span>
                </span>
              </div>
            </div>

            {/* Quick Status Pill / Dropdown */}
            <div className="flex items-center gap-2">
              <select
                id={`modal-select-status-${modal.id}`}
                value={status}
                onChange={(e) => handleQuickStatusChange(e.target.value as TaskStatus)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer transition-colors focus:ring-2 focus:ring-indigo-500 outline-hidden ${statusColors[status]}`}
              >
                <option value="pending">🔘 Pendiente</option>
                <option value="in_progress">🟡 En Progreso</option>
                <option value="review">🟣 En Revisión</option>
                <option value="blocked">🔴 Bloqueada</option>
                <option value="completed">🟢 Completada</option>
              </select>

              <select
                id={`modal-select-priority-${modal.id}`}
                value={priority}
                onChange={(e) => {
                  const p = e.target.value as TaskPriority;
                  setPriority(p);
                  onUpdateTask(modal.id, { priority: p, updatedAt: new Date().toISOString() });
                }}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer ${priorityLabels[priority].color}`}
              >
                <option value="low">Prioridad Baja</option>
                <option value="medium">Prioridad Media</option>
                <option value="high">Prioridad Alta</option>
                <option value="critical">Prioridad Crítica</option>
              </select>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-b border-slate-200 dark:border-slate-800 -mb-4">
            <button
              id={`modal-tab-checklist-${modal.id}`}
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`pb-3 text-xs font-semibold border-b-2 px-3 transition-colors ${
                activeTab === 'checklist'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Lista de Verificación & Protocolo ({completedCount}/{checklist.length})
            </button>
            <button
              id={`modal-tab-params-${modal.id}`}
              type="button"
              onClick={() => setActiveTab('parameters')}
              className={`pb-3 text-xs font-semibold border-b-2 px-3 transition-colors ${
                activeTab === 'parameters'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Parámetros, ROI & Riesgo
            </button>
            <button
              id={`modal-tab-notes-${modal.id}`}
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`pb-3 text-xs font-semibold border-b-2 px-3 transition-colors ${
                activeTab === 'notes'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Bitácora & Entregable
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              {/* Objective Banner */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-sm">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-indigo-500" /> Objetivo Operativo del Modal
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  {modal.objective}
                </p>
              </div>

              {/* Checklist Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-700 dark:text-slate-300">
                    Progreso de Ejecución del Protocolo
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {progressPercent}% ({completedCount} de {checklist.length} pasos)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Pasos Críticos de la Tarea ({modal.code})
                </h4>
                <div className="space-y-2">
                  {checklist.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      onClick={() => handleToggleCheckItem(idx)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        item.done 
                          ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 text-slate-600 dark:text-slate-400' 
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0"
                      >
                        {item.done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <div className="text-xs leading-relaxed flex-1">
                        <span className={item.done ? 'line-through opacity-75' : 'font-medium'}>
                          {item.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol Guidelines */}
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Directrices Metodológicas Estandarizadas
                </h4>
                <div className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                  {modal.protocolGuidelines}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-6">
              {/* Assignee and Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" /> Responsable de la Tarea
                  </label>
                  <input
                    id={`input-assigned-${modal.id}`}
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Ej. Sofía Alarcón (Lead DevOps)"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Fecha Límite de Cumplimiento
                  </label>
                  <input
                    id={`input-due-${modal.id}`}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Impact vs Effort Matrix */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Matriz de Valor: Impacto vs Esfuerzo
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                    ROI Ratio: {roiScore}x
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Impacto en el Negocio:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{impactScore}/10</span>
                    </div>
                    <input
                      id={`slider-impact-${modal.id}`}
                      type="range"
                      min="1"
                      max="10"
                      value={impactScore}
                      onChange={(e) => setImpactScore(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Esfuerzo Operativo:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{effortScore}/10</span>
                    </div>
                    <input
                      id={`slider-effort-${modal.id}`}
                      type="range"
                      min="1"
                      max="10"
                      value={effortScore}
                      onChange={(e) => setEffortScore(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>

                <div className="text-xs p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
                  {getQuadrant()}
                </div>
              </div>

              {/* Budget and Risk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-500" /> Presupuesto Asignado (USD)
                  </label>
                  <input
                    id={`input-budget-${modal.id}`}
                    type="number"
                    value={budgetEstimate}
                    onChange={(e) => setBudgetEstimate(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Nivel de Riesgo Operativo
                  </label>
                  <select
                    id={`select-risk-${modal.id}`}
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  >
                    <option value="bajo">🟢 Riesgo Bajo (Controlado)</option>
                    <option value="medio">🟡 Riesgo Medio (Atención)</option>
                    <option value="alto">🟠 Riesgo Elevado (Mitigación activa)</option>
                    <option value="critico">🔴 Riesgo Crítico (Impacto mayor)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Bitácora de Seguimiento & Registro de Cambios ({modal.code})
                </label>
                <textarea
                  id={`textarea-notes-${modal.id}`}
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalla aquí los hallazgos técnicos, decisiones tomadas, actas de reunión o bloqueos encontrados durante la ejecución de este modal..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-500" /> Enlace al Entregable / Repositorio / PR
                </label>
                <div className="flex gap-2">
                  <input
                    id={`input-deliverable-${modal.id}`}
                    type="url"
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    placeholder="https://github.com/... o https://notion.so/..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                  {deliverableUrl && (
                    <a
                      href={deliverableUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      Abrir <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs text-slate-400">Etiquetas:</span>
                {modal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigator & Quick Actions Dock */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Previous / Next modal controls */}
          <div className="flex items-center gap-1.5">
            <button
              id="modal-btn-prev"
              type="button"
              disabled={modal.id <= 1}
              onClick={() => onNavigateModal(modal.id - 1)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              title="Ir al modal anterior"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior ({formatModalCode(Math.max(1, modal.id - 1))})</span>
            </button>

            <button
              id="modal-btn-next"
              type="button"
              disabled={modal.id >= 625}
              onClick={() => onNavigateModal(modal.id + 1)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              title="Ir al siguiente modal"
            >
              <span className="hidden sm:inline">Siguiente ({formatModalCode(Math.min(625, modal.id + 1))})</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Jump direct input */}
            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1 ml-1 sm:ml-2">
              <input
                id="modal-input-jump"
                type="text"
                placeholder="ID 1..625"
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className="w-20 px-2 py-1 text-xs text-center font-mono rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium"
              >
                Ir
              </button>
            </form>
          </div>

          {/* Quick Mark Completed & Save */}
          <div className="flex items-center gap-2">
            {status !== 'completed' ? (
              <button
                id="modal-btn-mark-completed"
                type="button"
                onClick={() => handleQuickStatusChange('completed')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Marcar Completada
              </button>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Tarea Completada
              </span>
            )}

            <button
              id="modal-btn-save-all"
              type="button"
              onClick={handleSaveAll}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
