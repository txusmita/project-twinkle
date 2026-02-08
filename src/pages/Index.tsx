import { useState, useMemo } from 'react';
import { useInitiatives } from '@/hooks/useInitiatives';
import { Initiative, InitiativeFormData, InitiativeStatus } from '@/types/initiative';
import { InitiativeCard } from '@/components/InitiativeCard';
import { InitiativeForm } from '@/components/InitiativeForm';
import { StatusFilter } from '@/components/StatusFilter';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const { initiatives, isLoading, addInitiative, updateInitiative, deleteInitiative } = useInitiatives();
  const [formOpen, setFormOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<InitiativeStatus | 'all'>('all');

  // Filter by status
  const filteredInitiatives = useMemo(() => {
    if (activeStatus === 'all') return initiatives;
    return initiatives.filter((init) => init.status === activeStatus);
  }, [initiatives, activeStatus]);

  // Count per status
  const statusCounts = useMemo(() => {
    const counts: Record<InitiativeStatus | 'all', number> = {
      all: initiatives.length,
      backlog: 0,
      in_progress: 0,
      on_hold: 0,
      done: 0,
    };
    initiatives.forEach((init) => {
      counts[init.status]++;
    });
    return counts;
  }, [initiatives]);

  const handleFormSubmit = (data: InitiativeFormData) => {
    if (editingInitiative) {
      updateInitiative(editingInitiative.id, data);
    } else {
      addInitiative(data);
    }
    setEditingInitiative(null);
  };

  const handleEdit = (initiative: Initiative) => {
    setEditingInitiative(initiative);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteInitiative(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Initiative Tracker</h1>
          </div>
          <p className="text-muted-foreground">
            Prioritize your product initiatives with ICE scoring
          </p>
        </header>

        {/* Actions & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <StatusFilter
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            counts={statusCounts}
          />
          <Button onClick={() => setFormOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Initiative
          </Button>
        </div>

        {/* Initiative List */}
        {filteredInitiatives.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              {initiatives.length === 0 ? 'No initiatives yet' : 'No matching initiatives'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {initiatives.length === 0
                ? 'Add your first initiative to start prioritizing'
                : 'Try selecting a different status filter'}
            </p>
            {initiatives.length === 0 && (
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Initiative
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInitiatives.map((initiative) => (
              <InitiativeCard
                key={initiative.id}
                initiative={initiative}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}

        {/* Form Dialog */}
        <InitiativeForm
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingInitiative(null);
          }}
          initiative={editingInitiative}
          onSubmit={handleFormSubmit}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete initiative?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the initiative.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;
