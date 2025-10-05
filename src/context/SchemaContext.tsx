import React, { createContext, useContext, useState, ReactNode } from 'react';

export type EntityType = 'practitioner' | 'clinic';
export type LocationType = 'single' | 'multiple';

interface SchemaContextType {
  entityType: EntityType | null;
  locationType: LocationType | null;
  setSchemaType: (entity: EntityType, location: LocationType) => void;
  resetSchema: () => void;
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [locationType, setLocationType] = useState<LocationType | null>(null);

  const setSchemaType = (entity: EntityType, location: LocationType) => {
    setEntityType(entity);
    setLocationType(location);
  };

  const resetSchema = () => {
    setEntityType(null);
    setLocationType(null);
  };

  return (
    <SchemaContext.Provider value={{ entityType, locationType, setSchemaType, resetSchema }}>
      {children}
    </SchemaContext.Provider>
  );
};

export const useSchema = () => {
  const context = useContext(SchemaContext);
  if (!context) {
    throw new Error('useSchema must be used within SchemaProvider');
  }
  return context;
};
