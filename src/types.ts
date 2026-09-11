export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'blocked' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface DomainMeta {
  id: string;
  name: string;
  code: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconName: string;
  substages: SubstageMeta[];
}

export interface SubstageMeta {
  id: string;
  name: string;
  domainId: string;
  indexInDomain: number; // 0..4
  globalSubstageIndex: number; // 0..24
}

export interface ModalTask {
  id: number; // 1 to 625
  code: string; // e.g. "MOD-001" to "MOD-625"
  title: string;
  domainId: string;
  substageId: string;
  substageName: string;
  domainName: string;
  objective: string;
  protocolGuidelines: string;
  defaultPriority: TaskPriority;
  complexity: 1 | 2 | 3 | 4 | 5; // 1 (bajo) a 5 (crítico/complejo)
  estimatedHours: number;
  tags: string[];
  defaultChecklist: string[];
}

export interface UserTaskOverride {
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
  checklist: ChecklistItem[];
  impactScore: number; // 1..10
  effortScore: number; // 1..10
  budgetEstimate: number; // in USD / currency
  riskLevel: 'bajo' | 'medio' | 'alto' | 'critico';
  notes: string;
  deliverableUrl: string;
  isFavorite: boolean;
  updatedAt: string;
}

export type UserOverridesMap = Record<number, Partial<UserTaskOverride>>;

export interface ActiveModalState {
  currentId: number | null;
  openModalsHistory: number[]; // stack of recently opened modals
  pinnedModalIds: number[]; // dock pins
}

export type ViewMode = 'matrix' | 'kanban' | 'list' | 'analytics';
