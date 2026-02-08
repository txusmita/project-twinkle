export type InitiativeStatus = 'backlog' | 'in_progress' | 'on_hold' | 'done';

export interface Initiative {
  id: string;
  title: string;
  description: string;
  impact: number;
  confidence: number;
  ease: number;
  status: InitiativeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeFormData {
  title: string;
  description: string;
  impact: number;
  confidence: number;
  ease: number;
  status: InitiativeStatus;
}

export const calculateICEScore = (initiative: Pick<Initiative, 'impact' | 'confidence' | 'ease'>): number => {
  return (initiative.impact + initiative.confidence + initiative.ease) / 3;
};

export const STATUS_LABELS: Record<InitiativeStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  done: 'Done',
};

export const STATUS_COLORS: Record<InitiativeStatus, string> = {
  backlog: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/10 text-primary',
  on_hold: 'bg-orange-100 text-orange-700',
  done: 'bg-green-100 text-green-700',
};
