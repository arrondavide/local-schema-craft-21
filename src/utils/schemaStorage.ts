import { supabase } from '@/integrations/supabase/client';
import { EntityType, LocationType } from '@/context/SchemaContext';

export interface SchemaHistoryItem {
  id: string;
  name: string;
  entity_type: EntityType;
  location_type: LocationType;
  schema_data: any;
  created_at: string;
  synced: boolean;
}

const LOCAL_STORAGE_KEY = 'schema_history';

// Get all schemas from local storage
export const getLocalSchemas = (): SchemaHistoryItem[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading local schemas:', error);
    return [];
  }
};

// Save schema to local storage
export const saveLocalSchema = (schema: Omit<SchemaHistoryItem, 'id' | 'created_at' | 'synced'>): SchemaHistoryItem => {
  const schemas = getLocalSchemas();
  const newSchema: SchemaHistoryItem = {
    ...schema,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    synced: false,
  };
  schemas.unshift(newSchema);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schemas));
  return newSchema;
};

// Delete schema from local storage
export const deleteLocalSchema = (id: string): void => {
  const schemas = getLocalSchemas().filter(s => s.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schemas));
};

// Sync local schemas to Supabase
export const syncToSupabase = async (): Promise<void> => {
  const schemas = getLocalSchemas();
  const unsyncedSchemas = schemas.filter(s => !s.synced);
  
  if (unsyncedSchemas.length === 0) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Not authenticated, skip sync

    for (const schema of unsyncedSchemas) {
      const { error } = await supabase.from('schema_history').insert({
        name: schema.name,
        entity_type: schema.entity_type,
        location_type: schema.location_type,
        schema_data: schema.schema_data,
      });

      if (!error) {
        // Mark as synced
        schema.synced = true;
      }
    }

    // Update local storage with synced status
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schemas));
  } catch (error) {
    console.error('Error syncing to Supabase:', error);
  }
};

// Load schemas from both local and Supabase
export const loadAllSchemas = async (): Promise<SchemaHistoryItem[]> => {
  const localSchemas = getLocalSchemas();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return localSchemas; // Not authenticated, return local only

    const { data: onlineSchemas, error } = await supabase
      .from('schema_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Merge online and local schemas, removing duplicates
    const allSchemas = [...localSchemas];
    const localIds = new Set(localSchemas.map(s => s.id));
    
    onlineSchemas?.forEach(schema => {
      if (!localIds.has(schema.id)) {
        allSchemas.push({
          id: schema.id,
          name: schema.name,
          entity_type: schema.entity_type as EntityType,
          location_type: schema.location_type as LocationType,
          schema_data: schema.schema_data,
          created_at: schema.created_at,
          synced: true,
        });
      }
    });

    // Sort by created_at
    allSchemas.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return allSchemas;
  } catch (error) {
    console.error('Error loading online schemas:', error);
    return localSchemas; // Fallback to local only
  }
};

// Delete schema from both local and Supabase
export const deleteSchema = async (id: string): Promise<void> => {
  deleteLocalSchema(id);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('schema_history').delete().eq('id', id);
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
  }
};
