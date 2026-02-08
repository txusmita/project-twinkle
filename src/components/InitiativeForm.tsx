import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Initiative, InitiativeFormData, InitiativeStatus, STATUS_LABELS } from '@/types/initiative';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  impact: z.number().min(1).max(10),
  confidence: z.number().min(1).max(10),
  ease: z.number().min(1).max(10),
  status: z.enum(['backlog', 'in_progress', 'on_hold', 'done'] as const),
});

interface InitiativeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initiative?: Initiative | null;
  onSubmit: (data: InitiativeFormData) => void;
}

export const InitiativeForm = ({ open, onOpenChange, initiative, onSubmit }: InitiativeFormProps) => {
  const form = useForm<InitiativeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      impact: 5,
      confidence: 5,
      ease: 5,
      status: 'backlog',
    },
  });

  // Reset form when initiative changes
  const resetForm = () => {
    if (initiative) {
      form.reset({
        title: initiative.title,
        description: initiative.description,
        impact: initiative.impact,
        confidence: initiative.confidence,
        ease: initiative.ease,
        status: initiative.status,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        impact: 5,
        confidence: 5,
        ease: 5,
        status: 'backlog',
      });
    }
  };

  const handleSubmit = (data: InitiativeFormData) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initiative ? 'Edit Initiative' : 'Add Initiative'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Add user onboarding flow"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the initiative..."
              rows={3}
              {...form.register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(value: InitiativeStatus) => form.setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5">
            <ScoreSlider
              label="Impact"
              description="How much will this move the needle?"
              value={form.watch('impact')}
              onChange={(value) => form.setValue('impact', value)}
            />
            <ScoreSlider
              label="Confidence"
              description="How confident are you in this estimate?"
              value={form.watch('confidence')}
              onChange={(value) => form.setValue('confidence', value)}
            />
            <ScoreSlider
              label="Ease"
              description="How easy is this to implement?"
              value={form.watch('ease')}
              onChange={(value) => form.setValue('ease', value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initiative ? 'Save Changes' : 'Add Initiative'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ScoreSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

const ScoreSlider = ({ label, description, value, onChange }: ScoreSliderProps) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-xl font-semibold text-primary w-8 text-right">{value}</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={([val]) => onChange(val)}
      min={1}
      max={10}
      step={1}
      className="w-full"
    />
  </div>
);
