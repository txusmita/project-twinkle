import { Initiative, calculateICEScore, STATUS_LABELS, STATUS_COLORS } from '@/types/initiative';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface InitiativeCardProps {
  initiative: Initiative;
  onEdit: (initiative: Initiative) => void;
  onDelete: (id: string) => void;
}

export const InitiativeCard = ({ initiative, onEdit, onDelete }: InitiativeCardProps) => {
  const iceScore = calculateICEScore(initiative);

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={STATUS_COLORS[initiative.status]}>
                {STATUS_LABELS[initiative.status]}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground truncate">{initiative.title}</h3>
            {initiative.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {initiative.description}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{iceScore.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">ICE Score</div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(initiative)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(initiative.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4 pt-3 border-t border-border">
          <ScoreIndicator label="Impact" value={initiative.impact} />
          <ScoreIndicator label="Confidence" value={initiative.confidence} />
          <ScoreIndicator label="Ease" value={initiative.ease} />
        </div>
      </CardContent>
    </Card>
  );
};

const ScoreIndicator = ({ label, value }: { label: string; value: number }) => (
  <div className="flex-1 text-center">
    <div className="text-sm font-medium text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);
