import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchema } from '@/context/SchemaContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SchemaForm from '@/components/SchemaForm';
import SchemaPreview from '@/components/SchemaPreview';
import { getSchemaTemplate, cleanSchema } from '@/utils/schemaTemplates';
import { Badge } from '@/components/ui/badge';

const SchemaGenerator = () => {
  const navigate = useNavigate();
  const { entityType, locationType, resetSchema } = useSchema();
  const [formData, setFormData] = useState<any>({});
  const [generatedSchema, setGeneratedSchema] = useState<any>({});

  useEffect(() => {
    if (!entityType || !locationType) {
      navigate('/');
      return;
    }
  }, [entityType, locationType, navigate]);

  useEffect(() => {
    // Generate schema from form data
    if (entityType && locationType) {
      const template = getSchemaTemplate(entityType, locationType);
      const schema = buildSchema(template, formData);
      const cleaned = cleanSchema(schema);
      setGeneratedSchema(cleaned || {});
    }
  }, [formData, entityType, locationType]);

  const buildSchema = (template: any, data: any): any => {
    // This is a simplified version - you'll need to expand this
    // based on the actual template structure and form data
    return {
      ...template,
      ...data
    };
  };

  const handleBack = () => {
    resetSchema();
    navigate('/');
  };

  const getSchemaTypeLabel = () => {
    if (!entityType || !locationType) return '';
    
    const entity = entityType === 'practitioner' ? 'Practitioner' : 'Medical Clinic';
    const location = locationType === 'single' ? 'Single Location' : 'Multiple Locations';
    
    return `${entity} - ${location}`;
  };

  if (!entityType || !locationType) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          <Badge variant="secondary" className="text-sm">
            {getSchemaTypeLabel()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SchemaForm
            entityType={entityType}
            locationType={locationType}
            onDataChange={setFormData}
          />
        </div>

        <div>
          <SchemaPreview schema={generatedSchema} />
        </div>
      </div>
    </div>
  );
};

export default SchemaGenerator;
