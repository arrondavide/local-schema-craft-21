import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { EntityType, LocationType } from '@/context/SchemaContext';

interface SchemaFormProps {
  entityType: EntityType;
  locationType: LocationType;
  onDataChange: (data: any) => void;
}

const SchemaForm = ({ entityType, locationType, onDataChange }: SchemaFormProps) => {
  const [formData, setFormData] = useState<any>({});

  const isPractitioner = entityType === 'practitioner';
  const isMultiple = locationType === 'multiple';

  useEffect(() => {
    // Initialize form data based on schema type
    const initialData: any = {
      name: '',
      url: '',
      telephone: '',
      sameAs: [''],
    };

    if (isPractitioner) {
      initialData.honorificSuffix = '';
      initialData.jobTitle = '';
      
      if (isMultiple) {
        initialData.worksFor = [{
          name: '',
          url: '',
          telephone: '',
          streetAddress: '',
          city: '',
          region: '',
          postalCode: '',
          country: '',
          latitude: '',
          longitude: '',
          openingHours: [],
          services: ['']
        }];
      } else {
        initialData.worksFor = {
          name: '',
          url: '',
          telephone: '',
          streetAddress: '',
          city: '',
          region: '',
          postalCode: '',
          country: '',
          latitude: '',
          longitude: '',
          openingHours: [],
          services: ['']
        };
      }
      initialData.reviews = [];
    } else {
      // Clinic
      initialData.email = '';
      initialData.streetAddress = '';
      initialData.city = '';
      initialData.region = '';
      initialData.postalCode = '';
      initialData.country = '';
      initialData.latitude = '';
      initialData.longitude = '';
      initialData.openingHours = [];
      initialData.services = [''];
      initialData.ratingValue = '';
      initialData.reviewCount = '';

      if (isMultiple) {
        initialData.departments = [{
          name: '',
          url: '',
          telephone: '',
          streetAddress: '',
          city: '',
          region: '',
          postalCode: '',
          country: '',
          latitude: '',
          longitude: '',
          openingHours: [],
          services: ['']
        }];
      }
    }

    setFormData(initialData);
  }, [entityType, locationType]);

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const updateField = (path: string[], value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (path: string[], defaultValue: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = [];
        current = current[path[i]];
      }
      
      const lastKey = path[path.length - 1];
      if (!Array.isArray(current[lastKey])) {
        current[lastKey] = [];
      }
      current[lastKey].push(defaultValue);
      
      return newData;
    });
  };

  const removeArrayItem = (path: string[], index: number) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      const lastKey = path[path.length - 1];
      current[lastKey].splice(index, 1);
      
      return newData;
    });
  };

  const updateArrayItem = (path: string[], index: number, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      const lastKey = path[path.length - 1];
      current[lastKey][index] = value;
      
      return newData;
    });
  };

  const addOpeningHours = (parentPath: string[] = []) => {
    const path = parentPath.length > 0 ? [...parentPath, 'openingHours'] : ['openingHours'];
    addArrayItem(path, {
      days: [],
      opens: '09:00',
      closes: '18:00'
    });
  };

  const renderBasicFields = () => (
    <Card>
      <CardHeader>
        <CardTitle>{isPractitioner ? 'Practitioner' : 'Clinic'} Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{isPractitioner ? 'Full Name' : 'Clinic Name'} *</Label>
          <Input
            value={formData.name || ''}
            onChange={(e) => updateField(['name'], e.target.value)}
            placeholder={isPractitioner ? 'Dr. John Smith' : 'Elegant Aesthetic Clinic'}
          />
        </div>

        {isPractitioner && (
          <>
            <div>
              <Label>Qualifications</Label>
              <Input
                value={formData.honorificSuffix || ''}
                onChange={(e) => updateField(['honorificSuffix'], e.target.value)}
                placeholder="MBBS, MRCP"
              />
            </div>
            <div>
              <Label>Job Title *</Label>
              <Input
                value={formData.jobTitle || ''}
                onChange={(e) => updateField(['jobTitle'], e.target.value)}
                placeholder="Consultant Cardiologist"
              />
            </div>
          </>
        )}

        <div>
          <Label>Website URL *</Label>
          <Input
            value={formData.url || ''}
            onChange={(e) => updateField(['url'], e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label>Phone Number *</Label>
          <Input
            value={formData.telephone || ''}
            onChange={(e) => updateField(['telephone'], e.target.value)}
            placeholder="+44 20 1234 5678"
          />
        </div>

        {!isPractitioner && (
          <div>
            <Label>Email</Label>
            <Input
              value={formData.email || ''}
              onChange={(e) => updateField(['email'], e.target.value)}
              placeholder="info@example.com"
              type="email"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAddressFields = (prefix: string[] = []) => {
    const getValue = (field: string) => {
      let current: any = formData;
      for (const key of prefix) {
        current = current?.[key];
      }
      return current?.[field] || '';
    };

    return (
      <div className="space-y-4">
        <div>
          <Label>Street Address *</Label>
          <Input
            value={getValue('streetAddress')}
            onChange={(e) => updateField([...prefix, 'streetAddress'], e.target.value)}
            placeholder="10 Harley Street"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>City *</Label>
            <Input
              value={getValue('city')}
              onChange={(e) => updateField([...prefix, 'city'], e.target.value)}
              placeholder="London"
            />
          </div>
          <div>
            <Label>Region *</Label>
            <Input
              value={getValue('region')}
              onChange={(e) => updateField([...prefix, 'region'], e.target.value)}
              placeholder="England"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Postal Code</Label>
            <Input
              value={getValue('postalCode')}
              onChange={(e) => updateField([...prefix, 'postalCode'], e.target.value)}
              placeholder="W1G 9PF"
            />
          </div>
          <div>
            <Label>Country Code *</Label>
            <Input
              value={getValue('country')}
              onChange={(e) => updateField([...prefix, 'country'], e.target.value)}
              placeholder="GB"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Latitude</Label>
            <Input
              value={getValue('latitude')}
              onChange={(e) => updateField([...prefix, 'latitude'], e.target.value)}
              placeholder="51.5237"
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              value={getValue('longitude')}
              onChange={(e) => updateField([...prefix, 'longitude'], e.target.value)}
              placeholder="-0.1444"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSocialLinks = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Professional Links</CardTitle>
          <Button
            onClick={() => addArrayItem(['sameAs'], '')}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {formData.sameAs?.map((link: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={link}
              onChange={(e) => updateArrayItem(['sameAs'], index, e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
            {formData.sameAs.length > 1 && (
              <Button
                onClick={() => removeArrayItem(['sameAs'], index)}
                size="icon"
                variant="ghost"
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderBasicFields()}
      {renderSocialLinks()}
      
      {/* More sections will be rendered based on schema type */}
      {!isPractitioner && !isMultiple && (
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            {renderAddressFields()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchemaForm;
