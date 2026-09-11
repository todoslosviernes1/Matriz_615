import { ModalTask, TaskPriority, TaskStatus, UserOverridesMap, UserTaskOverride } from '../types';
import { ALL_MODALS, MODAL_BY_ID } from '../data/matrixData';

const STORAGE_KEY = 'matriz625_user_overrides_v1';
const HISTORY_KEY = 'matriz625_history_v1';
const PINNED_KEY = 'matriz625_pinned_v1';

export const loadStoredOverrides = (): UserOverridesMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return seedDefaultOperationalProgress();
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage for overrides:', err);
    return seedDefaultOperationalProgress();
  }
};

export const persistOverrides = (overrides: UserOverridesMap): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.error('Error writing localStorage overrides:', err);
  }
};

export const loadStoredHistory = (): number[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [1, 26, 126, 251, 501]; // defaults to top of each domain
  } catch {
    return [1];
  }
};

export const persistHistory = (history: number[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 15)));
  } catch (err) {
    console.error('Error writing history:', err);
  }
};

export const loadStoredPinned = (): number[] => {
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    return raw ? JSON.parse(raw) : [1, 10, 42, 135];
  } catch {
    return [1, 10];
  }
};

export const persistPinned = (pinned: number[]): void => {
  try {
    localStorage.setItem(PINNED_KEY, JSON.stringify(pinned.slice(0, 8)));
  } catch (err) {
    console.error('Error writing pinned:', err);
  }
};

// Seed realistic enterprise status on first load so the 625 matrix is exciting and immediately useful
export const seedDefaultOperationalProgress = (): UserOverridesMap => {
  const seed: UserOverridesMap = {};

  // Sample realistic distributions
  const completedIds = [1, 2, 3, 5, 26, 27, 51, 126, 127, 251, 252, 376, 501, 502, 600];
  const inProgressIds = [4, 6, 28, 29, 52, 76, 128, 151, 253, 300, 377, 420, 503, 525, 624];
  const reviewIds = [7, 30, 129, 254, 378, 504];
  const blockedIds = [8, 53, 130, 255, 379, 505];

  const team = ['Elena Ramos (Lead Arch)', 'Carlos Mendoza (DevOps)', 'Sofía Alarcón (PM)', 'David Chen (SecOps)', 'Lucía Gómez (Legal)'];

  completedIds.forEach((id) => {
    const task = MODAL_BY_ID[id];
    if (!task) return;
    seed[id] = {
      status: 'completed',
      priority: task.defaultPriority,
      assignedTo: team[id % team.length],
      dueDate: '2026-09-10',
      checklist: task.defaultChecklist.map((c, i) => ({ id: `c-${id}-${i}`, text: c, done: true })),
      impactScore: 8,
      effortScore: 5,
      budgetEstimate: 4500,
      riskLevel: 'bajo',
      notes: 'Protocolo ejecutado con éxito y validado en reunión de sincronización técnica.',
      deliverableUrl: 'https://docs.enterprise.internal/spec-verified',
      isFavorite: id === 1 || id === 26,
      updatedAt: new Date().toISOString(),
    };
  });

  inProgressIds.forEach((id) => {
    const task = MODAL_BY_ID[id];
    if (!task) return;
    seed[id] = {
      status: 'in_progress',
      priority: task.defaultPriority,
      assignedTo: team[id % team.length],
      dueDate: '2026-09-18',
      checklist: task.defaultChecklist.map((c, i) => ({ id: `c-${id}-${i}`, text: c, done: i < 2 })),
      impactScore: 9,
      effortScore: 7,
      budgetEstimate: 7200,
      riskLevel: 'medio',
      notes: 'En curso con 2/5 pasos validados. Esperando informe de rendimiento.',
      deliverableUrl: 'https://github.com/org/repo/pull/42',
      isFavorite: id === 4 || id === 624,
      updatedAt: new Date().toISOString(),
    };
  });

  reviewIds.forEach((id) => {
    const task = MODAL_BY_ID[id];
    if (!task) return;
    seed[id] = {
      status: 'review',
      priority: task.defaultPriority,
      assignedTo: team[id % team.length],
      dueDate: '2026-09-15',
      checklist: task.defaultChecklist.map((c, i) => ({ id: `c-${id}-${i}`, text: c, done: i < 4 })),
      impactScore: 7,
      effortScore: 6,
      budgetEstimate: 3100,
      riskLevel: 'medio',
      notes: 'Listo para firma de conformidad por el comité.',
      deliverableUrl: 'https://notion.internal/review-dossier',
      isFavorite: false,
      updatedAt: new Date().toISOString(),
    };
  });

  blockedIds.forEach((id) => {
    const task = MODAL_BY_ID[id];
    if (!task) return;
    seed[id] = {
      status: 'blocked',
      priority: 'critical',
      assignedTo: team[id % team.length],
      dueDate: '2026-09-12',
      checklist: task.defaultChecklist.map((c, i) => ({ id: `c-${id}-${i}`, text: c, done: false })),
      impactScore: 10,
      effortScore: 9,
      budgetEstimate: 12000,
      riskLevel: 'critico',
      notes: 'BLOQUEO: Requiere resolución de compatibilidad con proveedor externo y sign-off legal.',
      deliverableUrl: '',
      isFavorite: true,
      updatedAt: new Date().toISOString(),
    };
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {
    // fallback safe
  }
  return seed;
};

// Merges standard task metadata with user overrides
export const resolveTask = (
  modal: ModalTask,
  overrides: UserOverridesMap
): {
  modal: ModalTask;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
  checklist: { id: string; text: string; done: boolean }[];
  impactScore: number;
  effortScore: number;
  budgetEstimate: number;
  riskLevel: 'bajo' | 'medio' | 'alto' | 'critico';
  notes: string;
  deliverableUrl: string;
  isFavorite: boolean;
  updatedAt?: string;
} => {
  const o = overrides[modal.id] || {};

  const checklist = o.checklist || modal.defaultChecklist.map((c, i) => ({
    id: `c-${modal.id}-${i}`,
    text: c,
    done: false,
  }));

  return {
    modal,
    status: o.status || 'pending',
    priority: o.priority || modal.defaultPriority,
    assignedTo: o.assignedTo || 'Sin asignar',
    dueDate: o.dueDate || '',
    checklist,
    impactScore: o.impactScore ?? 5,
    effortScore: o.effortScore ?? 5,
    budgetEstimate: o.budgetEstimate ?? 0,
    riskLevel: o.riskLevel || 'medio',
    notes: o.notes || '',
    deliverableUrl: o.deliverableUrl || '',
    isFavorite: !!o.isFavorite,
    updatedAt: o.updatedAt,
  };
};

export const computeMatrixStats = (overrides: UserOverridesMap) => {
  let completed = 0;
  let inProgress = 0;
  let review = 0;
  let blocked = 0;
  let pending = 0;
  let favorites = 0;

  for (let i = 1; i <= 625; i++) {
    const o = overrides[i];
    const status = o?.status || 'pending';
    if (o?.isFavorite) favorites++;

    if (status === 'completed') completed++;
    else if (status === 'in_progress') inProgress++;
    else if (status === 'review') review++;
    else if (status === 'blocked') blocked++;
    else pending++;
  }

  const completionPercentage = Math.round((completed / 625) * 100);

  return {
    total: 625,
    completed,
    inProgress,
    review,
    blocked,
    pending,
    favorites,
    completionPercentage,
  };
};
