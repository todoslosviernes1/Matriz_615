/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  loadStoredOverrides, persistOverrides, loadStoredHistory, 
  persistHistory, loadStoredPinned, persistPinned, 
  seedDefaultOperationalProgress, resolveTask 
} from './utils/storage';
import { ALL_MODALS, MODAL_BY_ID, formatModalCode } from './data/matrixData';
import { ViewMode, UserOverridesMap, UserTaskOverride, TaskStatus } from './types';
import { NavigationHeader } from './components/NavigationHeader';
import { MatrixGrid } from './components/MatrixGrid';
import { TaskListView } from './components/TaskListView';
import { KanbanView } from './components/KanbanView';
import { AnalyticsView } from './components/AnalyticsView';
import { ModalWindow } from './components/ModalWindow';
import { ModalStackDock } from './components/ModalStackDock';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  const [overrides, setOverrides] = useState<UserOverridesMap>(() => loadStoredOverrides());
  const [recentModalIds, setRecentModalIds] = useState<number[]>(() => loadStoredHistory());
  const [pinnedModalIds, setPinnedModalIds] = useState<number[]>(() => loadStoredPinned());
  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Save overrides on state update
  useEffect(() => {
    persistOverrides(overrides);
  }, [overrides]);

  // Save history & pinned
  useEffect(() => {
    persistHistory(recentModalIds);
  }, [recentModalIds]);

  useEffect(() => {
    persistPinned(pinnedModalIds);
  }, [pinnedModalIds]);

  // Check URL hash on initial mount (e.g. #MOD-042 or #42)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').trim().toUpperCase();
      if (hash) {
        const num = parseInt(hash.replace('MOD-', ''), 10);
        if (!isNaN(num) && num >= 1 && num <= 625) {
          setActiveModalId(num);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Open modal and push to recent stack
  const handleOpenModal = useCallback((id: number) => {
    if (id < 1 || id > 625) return;
    setActiveModalId(id);
    window.location.hash = formatModalCode(id);

    setRecentModalIds((prev) => {
      const filtered = prev.filter((x) => x !== id);
      return [id, ...filtered].slice(0, 15);
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModalId(null);
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  const handleNavigateModal = useCallback((targetId: number) => {
    if (targetId >= 1 && targetId <= 625) {
      handleOpenModal(targetId);
    }
  }, [handleOpenModal]);

  const handleUpdateTask = useCallback((modalId: number, update: Partial<UserTaskOverride>) => {
    setOverrides((prev) => ({
      ...prev,
      [modalId]: {
        ...(prev[modalId] || {}),
        ...update,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const handleUpdateTaskStatus = useCallback((modalId: number, status: TaskStatus) => {
    setOverrides((prev) => ({
      ...prev,
      [modalId]: {
        ...(prev[modalId] || {}),
        status,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const handleToggleFavorite = useCallback((modalId: number) => {
    setOverrides((prev) => {
      const current = prev[modalId]?.isFavorite ?? false;
      return {
        ...prev,
        [modalId]: {
          ...(prev[modalId] || {}),
          isFavorite: !current,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const handleTogglePin = useCallback((modalId: number) => {
    setPinnedModalIds((prev) => {
      if (prev.includes(modalId)) {
        return prev.filter((id) => id !== modalId);
      }
      return [...prev, modalId].slice(0, 8);
    });
  }, []);

  const handleUnpin = useCallback((modalId: number) => {
    setPinnedModalIds((prev) => prev.filter((id) => id !== modalId));
  }, []);

  const handleRandomModal = useCallback(() => {
    const randomId = Math.floor(Math.random() * 625) + 1;
    handleOpenModal(randomId);
  }, [handleOpenModal]);

  const handleOpenNextPending = useCallback(() => {
    for (let i = 1; i <= 625; i++) {
      const status = overrides[i]?.status || 'pending';
      if (status === 'pending') {
        handleOpenModal(i);
        return;
      }
    }
    // If none pending, open modal 1
    handleOpenModal(1);
  }, [overrides, handleOpenModal]);

  const handleResetProgress = useCallback(() => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los estados a la configuración predeterminada?')) {
      const resetState = seedDefaultOperationalProgress();
      setOverrides(resetState);
      setRecentModalIds([1, 26, 126, 251, 501]);
      setPinnedModalIds([1, 10, 42, 135]);
    }
  }, []);

  const handleExportJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(overrides, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `matriz625_respaldo_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [overrides]);

  const handleImportJson = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        setOverrides(parsed);
        alert('Datos de la matriz 625 importados correctamente.');
      }
    } catch {
      alert('El archivo no tiene un formato JSON válido.');
    }
  }, []);

  const activeModal = activeModalId ? MODAL_BY_ID[activeModalId] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <NavigationHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onJumpToId={handleOpenModal}
        onOpenNextPending={handleOpenNextPending}
        onRandomModal={handleRandomModal}
        overrides={overrides}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24">
        {viewMode === 'matrix' && (
          <MatrixGrid
            overrides={overrides}
            onOpenModal={handleOpenModal}
            activeModalId={activeModalId}
            searchQuery={searchQuery}
          />
        )}

        {viewMode === 'list' && (
          <TaskListView
            overrides={overrides}
            onOpenModal={handleOpenModal}
            searchQuery={searchQuery}
          />
        )}

        {viewMode === 'kanban' && (
          <KanbanView
            overrides={overrides}
            onOpenModal={handleOpenModal}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            searchQuery={searchQuery}
          />
        )}

        {viewMode === 'analytics' && (
          <AnalyticsView
            overrides={overrides}
            onOpenModal={handleOpenModal}
            onResetProgress={handleResetProgress}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
          />
        )}
      </main>

      {/* Interactive Modal Window (Active Modal) */}
      {activeModal && (
        <ModalWindow
          modal={activeModal}
          overrides={overrides}
          onClose={handleCloseModal}
          onNavigateModal={handleNavigateModal}
          onUpdateTask={handleUpdateTask}
          onToggleFavorite={handleToggleFavorite}
          isPinned={pinnedModalIds.includes(activeModal.id)}
          onTogglePin={handleTogglePin}
        />
      )}

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectModal={handleOpenModal}
        overrides={overrides}
      />

      {/* Floating Modal Stack / Dock */}
      <ModalStackDock
        pinnedIds={pinnedModalIds}
        recentIds={recentModalIds}
        activeModalId={activeModalId}
        onOpenModal={handleOpenModal}
        onUnpin={handleUnpin}
        onRandomModal={handleRandomModal}
        overrides={overrides}
      />
    </div>
  );
}
