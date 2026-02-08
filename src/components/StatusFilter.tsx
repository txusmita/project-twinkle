import { InitiativeStatus, STATUS_LABELS } from '@/types/initiative';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatusFilterProps {
  activeStatus: InitiativeStatus | 'all';
  onStatusChange: (status: InitiativeStatus | 'all') => void;
  counts: Record<InitiativeStatus | 'all', number>;
}

export const StatusFilter = ({ activeStatus, onStatusChange, counts }: StatusFilterProps) => {
  const statuses: (InitiativeStatus | 'all')[] = ['all', 'backlog', 'in_progress', 'on_hold', 'done'];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={activeStatus === status ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(status)}
          className={cn(
            'transition-all',
            activeStatus === status && 'shadow-sm'
          )}
        >
          {status === 'all' ? 'All' : STATUS_LABELS[status]}
          <span className="ml-1.5 text-xs opacity-70">({counts[status]})</span>
        </Button>
      ))}
    </div>
  );
};
