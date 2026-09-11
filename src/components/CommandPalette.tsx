import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Layers, Bookmark, CheckCircle2 } from 'lucide-react';
import { ALL_MODALS, formatModalCode } from '../data/matrixData';
import { ModalTask, UserOverridesMap } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModal: (modalId: number) => void;
  overrides: UserOverridesMap;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModal,
  overrides,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredModals = React.useMemo(() => {
    if (!query.trim()) {
      // Show default top picks or pinned/in-progress
      return ALL_MODALS.slice(0, 15);
    }
    const q = query.toLowerCase().trim();
    // Direct number search e.g. "42" or "042" or "MOD-042"
    const parsedNum = parseInt(q.replace(/\D/g, ''), 10);

    const matches: ModalTask[] = [];
    if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= 625) {
      const direct = ALL_MODALS[parsedNum - 1];
      if (direct) matches.push(direct);
    }

    for (const m of ALL_MODALS) {
      if (matches.some((x) => x.id === m.id)) continue;
      if (
        m.code.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.substageName.toLowerCase().includes(q) ||
        m.domainName.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        matches.push(m);
        if (matches.length >= 25) break; // Limit for fast rendering
      }
    }
    return matches;
  }, [query]);

  // Keyboard navigation inside command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredModals.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredModals[selectedIndex]) {
          onSelectModal(filteredModals[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredModals, selectedIndex, onSelectModal, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      id="command-palette-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="command-palette-container"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar entre los 625 modales (ej. 'MOD-042', 'Arquitectura', '42', 'Riesgos')..."
            className="flex-1 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden"
          />
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
            ESC para salir
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {query ? `Resultados (${filteredModals.length})` : 'Modales destacados'}
          </div>

          {filteredModals.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No se encontró ningún modal con el criterio &quot;{query}&quot;. Prueba buscando por ID (1-625).
            </div>
          ) : (
            filteredModals.map((modal, idx) => {
              const isSelected = idx === selectedIndex;
              const status = overrides[modal.id]?.status || 'pending';
              const isFav = overrides[modal.id]?.isFavorite;

              return (
                <div
                  key={modal.id}
                  id={`palette-item-${modal.id}`}
                  onClick={() => {
                    onSelectModal(modal.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-bold px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0">
                      {modal.code}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold truncate flex items-center gap-2">
                        {modal.title}
                        {isFav && <Bookmark className="w-3 h-3 text-rose-500 fill-current shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {modal.domainName} • {modal.substageName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {status}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ Navegar</span>
            <span>↵ Abrir modal</span>
            <span>ESC Cerrar</span>
          </div>
          <span className="font-mono">625 modales indexados</span>
        </div>
      </div>
    </div>
  );
};
