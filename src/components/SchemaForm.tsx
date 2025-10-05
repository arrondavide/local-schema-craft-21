import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    // Initialize form based on schema type
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
          openingHours: [{
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00'
          }],
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
          openingHours: [{
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00'
          }],
          services: ['']
        };
      }
      initialData.reviews = [{
        ratingValue: '',
        author: ''
      }];
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
      initialData.openingHours = [{
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }];
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
          openingHours: [{
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00'
          }],
          services: ['']
        }];
        initialData.reviews = [{
          ratingValue: '',
          author: ''
        }];
      }
    }

    setFormData(initialData);
  }, [entityType, locationType, isPractitioner, isMultiple]);

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addArrayItem = (field: string, defaultValue: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) => i === index ? value : item)
    }));
  };

  const updateArrayItemField = (field: string, index: number, itemField: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) => 
        i === index ? { ...item, [itemField]: value } : item
      )
    }));
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const renderOpeningHours = (hours: any[], parentField: string, parentIndex?: number) => {
    const updateHours = (index: number, field: string, value: any) => {
      if (parentIndex !== undefined) {
        const newHours = [...hours];
        newHours[index] = { ...newHours[index], [field]: value };
        updateArrayItemField(parentField, parentIndex, 'openingHours', newHours);
      } else {
        const newHours = [...hours];
        newHours[index] = { ...newHours[index], [field]: value };
        updateField('openingHours', newHours);
      }
    };

    const addHours = () => {
      const newHour = { days: [], opens: '09:00', closes: '18:00' };
      if (parentIndex !== undefined) {
        const newHours = [...hours, newHour];
        updateArrayItemField(parentField, parentIndex, 'openingHours', newHours);
      } else {
        addArrayItem('openingHours', newHour);
      }
    };

    const removeHours = (index: number) => {
      if (parentIndex !== undefined) {
        const newHours = hours.filter((_: any, i: number) => i !== index);
        updateArrayItemField(parentField, parentIndex, 'openingHours', newHours);
      } else {
        removeArrayItem('openingHours', index);
      }
    };

    const toggleDay = (hourIndex: number, day: string) => {
      const hour = hours[hourIndex];
      const days = hour.days.includes(day)
        ? hour.days.filter((d: string) => d !== day)
        : [...hour.days, day];
      updateHours(hourIndex, 'days', days);
    };

    return (
      <div className="space-y-4">
        {hours?.map((hour: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label>Opening Hours Set {index + 1}</Label>
              {hours.length > 1 && (
                <Button
                  onClick={() => removeHours(index)}
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Days of Week</Label>
              <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      checked={hour.days?.includes(day) || false}
                      onCheckedChange={() => toggleDay(index, day)}
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Opens</Label>
                <Input
                  type="time"
                  value={hour.opens || ''}
                  onChange={(e) => updateHours(index, 'opens', e.target.value)}
                />
              </div>
              <div>
                <Label>Closes</Label>
                <Input
                  type="time"
                  value={hour.closes || ''}
                  onChange={(e) => updateHours(index, 'closes', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button onClick={addHours} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Opening Hours
        </Button>
      </div>
    );
  };

  const renderServices = (services: string[], parentField: string, parentIndex?: number) => {
    const updateService = (index: number, value: string) => {
      if (parentIndex !== undefined) {
        const newServices = [...services];
        newServices[index] = value;
        updateArrayItemField(parentField, parentIndex, 'services', newServices);
      } else {
        updateArrayItem('services', index, value);
      }
    };

    const addService = () => {
      if (parentIndex !== undefined) {
        updateArrayItemField(parentField, parentIndex, 'services', [...services, '']);
      } else {
        addArrayItem('services', '');
      }
    };

    const removeService = (index: number) => {
      if (parentIndex !== undefined) {
        const newServices = services.filter((_: any, i: number) => i !== index);
        updateArrayItemField(parentField, parentIndex, 'services', newServices);
      } else {
        removeArrayItem('services', index);
      }
    };

    return (
      <div className="space-y-3">
        {services?.map((service: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={service}
              onChange={(e) => updateService(index, e.target.value)}
              placeholder="e.g., Cardiac Consultation"
            />
            {services.length > 1 && (
              <Button
                onClick={() => removeService(index)}
                size="icon"
                variant="ghost"
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        <Button onClick={addService} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>
    );
  };

  const renderLocationFields = (location: any, parentField: string, index?: number) => {
    const updateLoc = (field: string, value: any) => {
      if (index !== undefined) {
        updateArrayItemField(parentField, index, field, value);
      } else {
        updateNestedField(parentField, field, value);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Clinic Name *</Label>
            <Input
              value={location?.name || ''}
              onChange={(e) => updateLoc('name', e.target.value)}
              placeholder="Heart Clinic - Harley Street"
            />
          </div>
          <div>
            <Label>Clinic URL</Label>
            <Input
              value={location?.url || ''}
              onChange={(e) => updateLoc('url', e.target.value)}
              placeholder="https://example.com/locations/..."
            />
          </div>
        </div>

        <div>
          <Label>Clinic Phone *</Label>
          <Input
            value={location?.telephone || ''}
            onChange={(e) => updateLoc('telephone', e.target.value)}
            placeholder="+44 20 1234 5678"
          />
        </div>

        <div>
          <Label>Street Address *</Label>
          <Input
            value={location?.streetAddress || ''}
            onChange={(e) => updateLoc('streetAddress', e.target.value)}
            placeholder="10 Harley Street"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>City *</Label>
            <Input
              value={location?.city || ''}
              onChange={(e) => updateLoc('city', e.target.value)}
              placeholder="London"
            />
          </div>
          <div>
            <Label>Region *</Label>
            <Input
              value={location?.region || ''}
              onChange={(e) => updateLoc('region', e.target.value)}
              placeholder="England"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Postal Code</Label>
            <Input
              value={location?.postalCode || ''}
              onChange={(e) => updateLoc('postalCode', e.target.value)}
              placeholder="W1G 9PF"
            />
          </div>
          <div>
            <Label>Country Code *</Label>
            <Input
              value={location?.country || ''}
              onChange={(e) => updateLoc('country', e.target.value)}
              placeholder="GB"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Latitude</Label>
            <Input
              value={location?.latitude || ''}
              onChange={(e) => updateLoc('latitude', e.target.value)}
              placeholder="51.5237"
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              value={location?.longitude || ''}
              onChange={(e) => updateLoc('longitude', e.target.value)}
              placeholder="-0.1444"
            />
          </div>
        </div>

        <div>
          <Label className="text-lg font-medium mb-3 block">Opening Hours</Label>
          {renderOpeningHours(location?.openingHours || [], parentField, index)}
        </div>

        <div>
          <Label className="text-lg font-medium mb-3 block">Available Services</Label>
          {renderServices(location?.services || [], parentField, index)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>{isPractitioner ? 'Practitioner' : 'Clinic'} Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{isPractitioner ? 'Full Name' : 'Clinic Name'} *</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder={isPractitioner ? 'Dr. John Smith' : 'Elegant Aesthetic Clinic'}
            />
          </div>

          {isPractitioner && (
            <>
              <div>
                <Label>Qualifications (e.g., MBBS, MRCP)</Label>
                <Input
                  value={formData.honorificSuffix || ''}
                  onChange={(e) => updateField('honorificSuffix', e.target.value)}
                  placeholder="MBBS, MRCP"
                />
              </div>
              <div>
                <Label>Job Title *</Label>
                <Input
                  value={formData.jobTitle || ''}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  placeholder="Consultant Cardiologist"
                />
              </div>
            </>
          )}

          <div>
            <Label>Website URL *</Label>
            <Input
              value={formData.url || ''}
              onChange={(e) => updateField('url', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label>Phone Number *</Label>
            <Input
              value={formData.telephone || ''}
              onChange={(e) => updateField('telephone', e.target.value)}
              placeholder="+44 20 1234 5678"
            />
          </div>

          {!isPractitioner && (
            <div>
              <Label>Email</Label>
              <Input
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="info@example.com"
                type="email"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Professional Links</CardTitle>
            <Button
              onClick={() => addArrayItem('sameAs', '')}
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
                onChange={(e) => updateArrayItem('sameAs', index, e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
              {formData.sameAs.length > 1 && (
                <Button
                  onClick={() => removeArrayItem('sameAs', index)}
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

      {/* Location/Work Information */}
      {isPractitioner ? (
        isMultiple ? (
          // Practitioner - Multiple Locations
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Work Locations</CardTitle>
                <Button
                  onClick={() => addArrayItem('worksFor', {
                    name: '', url: '', telephone: '', streetAddress: '',
                    city: '', region: '', postalCode: '', country: '',
                    latitude: '', longitude: '',
                    openingHours: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' }],
                    services: ['']
                  })}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.worksFor?.map((location: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Location {index + 1}</h4>
                    {formData.worksFor.length > 1 && (
                      <Button
                        onClick={() => removeArrayItem('worksFor', index)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {renderLocationFields(location, 'worksFor', index)}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          // Practitioner - Single Location
          <Card>
            <CardHeader>
              <CardTitle>Work Location</CardTitle>
            </CardHeader>
            <CardContent>
              {renderLocationFields(formData.worksFor, 'worksFor')}
            </CardContent>
          </Card>
        )
      ) : (
        // Clinic
        <>
          {!isMultiple && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Street Address *</Label>
                  <Input
                    value={formData.streetAddress || ''}
                    onChange={(e) => updateField('streetAddress', e.target.value)}
                    placeholder="100 Beauty Avenue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={formData.city || ''}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="London"
                    />
                  </div>
                  <div>
                    <Label>Region *</Label>
                    <Input
                      value={formData.region || ''}
                      onChange={(e) => updateField('region', e.target.value)}
                      placeholder="England"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      value={formData.postalCode || ''}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      placeholder="SW1A 1AA"
                    />
                  </div>
                  <div>
                    <Label>Country Code *</Label>
                    <Input
                      value={formData.country || ''}
                      onChange={(e) => updateField('country', e.target.value)}
                      placeholder="GB"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      value={formData.latitude || ''}
                      onChange={(e) => updateField('latitude', e.target.value)}
                      placeholder="51.5237"
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      value={formData.longitude || ''}
                      onChange={(e) => updateField('longitude', e.target.value)}
                      placeholder="-0.1444"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Opening Hours for Single Clinic */}
          {!isMultiple && (
            <Card>
              <CardHeader>
                <CardTitle>Opening Hours</CardTitle>
              </CardHeader>
              <CardContent>
                {renderOpeningHours(formData.openingHours || [], 'openingHours')}
              </CardContent>
            </Card>
          )}

          {/* Services for Single Clinic */}
          {!isMultiple && (
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                {renderServices(formData.services || [], 'services')}
              </CardContent>
            </Card>
          )}

          {/* Multiple Clinic Departments */}
          {isMultiple && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Departments / Branches</CardTitle>
                  <Button
                    onClick={() => addArrayItem('departments', {
                      name: '', url: '', telephone: '', streetAddress: '',
                      city: '', region: '', postalCode: '', country: '',
                      latitude: '', longitude: '',
                      openingHours: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' }],
                      services: ['']
                    })}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.departments?.map((dept: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Department {index + 1}</h4>
                      {formData.departments.length > 1 && (
                        <Button
                          onClick={() => removeArrayItem('departments', index)}
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {renderLocationFields(dept, 'departments', index)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviews</CardTitle>
            <Button
              onClick={() => addArrayItem('reviews', { ratingValue: '', author: '' })}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isPractitioner && !isMultiple && (
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <Label>Aggregate Rating</Label>
                <Input
                  value={formData.ratingValue || ''}
                  onChange={(e) => updateField('ratingValue', e.target.value)}
                  placeholder="4.8"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>
              <div>
                <Label>Review Count</Label>
                <Input
                  value={formData.reviewCount || ''}
                  onChange={(e) => updateField('reviewCount', e.target.value)}
                  placeholder="187"
                  type="number"
                />
              </div>
            </div>
          )}

          {formData.reviews?.map((review: any, index: number) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <Label>Rating (out of 5)</Label>
                  <Input
                    value={review.ratingValue || ''}
                    onChange={(e) => updateArrayItemField('reviews', index, 'ratingValue', e.target.value)}
                    placeholder="4.5"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </div>
                <div>
                  <Label>Author Name</Label>
                  <Input
                    value={review.author || ''}
                    onChange={(e) => updateArrayItemField('reviews', index, 'author', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              {formData.reviews.length > 1 && (
                <Button
                  onClick={() => removeArrayItem('reviews', index)}
                  size="icon"
                  variant="ghost"
                  className="text-destructive mt-6"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemaForm;
