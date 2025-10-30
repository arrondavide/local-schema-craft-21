import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EntityType, LocationType } from '@/context/SchemaContext';

interface SaveSchemaDialogProps {
  entityType: EntityType | null;
  locationType: LocationType | null;
  formData: any;
}

export const SaveSchemaDialog = ({ entityType, locationType, formData }: SaveSchemaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for this schema version',
        variant: 'destructive',
      });
      return;
    }

    if (!entityType || !locationType) {
      toast({
        title: 'Schema type required',
        description: 'Please select entity and location type first',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('schema_history').insert({
        name: name.trim(),
        entity_type: entityType,
        location_type: locationType,
        schema_data: formData,
      });

      if (error) throw error;

      toast({
        title: 'Schema saved',
        description: 'Your schema has been saved successfully',
      });
      setName('');
      setOpen(false);
    } catch (error) {
      console.error('Error saving schema:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save schema. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save Schema
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Schema Version</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="schema-name">Version Name</Label>
            <Input
              id="schema-name"
              placeholder="e.g., Version 1.0, Initial Draft"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
