import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { History, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EntityType, LocationType } from '@/context/SchemaContext';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { loadAllSchemas, deleteSchema, SchemaHistoryItem } from '@/utils/schemaStorage';

interface LoadSchemaDialogProps {
  onLoad: (entityType: EntityType, locationType: LocationType, data: any) => void;
}

export const LoadSchemaDialog = ({ onLoad }: LoadSchemaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<SchemaHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const schemas = await loadAllSchemas();
      setHistory(schemas);
    } catch (error) {
      console.error('Error fetching schema history:', error);
      toast({
        title: 'Load failed',
        description: 'Failed to load schema history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = (item: SchemaHistoryItem) => {
    onLoad(item.entity_type, item.location_type, item.schema_data);
    setOpen(false);
    toast({
      title: 'Schema loaded',
      description: `Loaded "${item.name}"`,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchema(id);
      setHistory(history.filter((item) => item.id !== id));
      toast({
        title: 'Schema deleted',
        description: 'Schema version has been removed',
      });
    } catch (error) {
      console.error('Error deleting schema:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete schema version',
        variant: 'destructive',
      });
    }
    setDeleteId(null);
  };

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  const getTypeLabel = (entityType: EntityType, locationType: LocationType) => {
    const entity = entityType === 'practitioner' ? 'Practitioner' : 'Clinic';
    const location = locationType === 'single' ? 'Single Location' : 'Multiple Locations';
    return `${entity} - ${location}`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Load Schema
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schema History</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No saved schemas yet. Save your current schema to start building history.
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getTypeLabel(item.entity_type, item.location_type)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(item.created_at), 'PPp')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleLoad(item)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete schema version?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this schema version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
