// Main Index Component
const Index = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showEditor, setShowEditor] = useState(false);

  const handleEntitySelect = (type) => {
    setSelectedEntity(type);
    setSelectedLocation('');
  };

  const handleLocationSelect = (type) => {
    setSelectedLocation(type);
  };

  const handleProceed = () => {
    if (selectedEntity && selectedLocation) {
      setShowEditor(true);
    }
  };

  if (showEditor) {
    return <SchemaEditor entityType={selectedEntity} locationType={selectedLocation} onBack={() => setShowEditor(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Schema Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional JSON-LD structured data for medical practitioners and clinics
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Entity Type Selection */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                  1
                </span>
                Select Entity Type
              </CardTitle>
              <CardDescription>Choose whether you're creating a schema for a practitioner or a medical clinic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleEntitySelect('practitioner')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedEntity === 'practitioner'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {selectedEntity === 'practitioner' && (
                    <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-blue-600" />
                  )}
                  <User className="w-12 h-12 mb-4 text-blue-600 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Practitioner</h3>
                  <p className="text-gray-600 text-sm">
                    Individual medical professional (Doctor, Dentist, Specialist)
                  </p>
                </button>

                <button
                  onClick={() => handleEntitySelect('clinic')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedEntity === 'clinic'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {selectedEntity === 'clinic' && (
                    <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-purple-600" />
                  )}
                  <Building2 className="w-12 h-12 mb-4 text-purple-600 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Medical Clinic</h3>
                  <p className="text-gray-600 text-sm">
                    Medical business or healthcare facility
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Location Type Selection */}
          {selectedEntity && (
            <Card className="shadow-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                    2
                  </span>
                  Select Location Type
                </CardTitle>
                <CardDescription>
                  Does this {selectedEntity === 'practitioner' ? 'practitioner work at' : 'clinic have'} one location or multiple locations?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleLocationSelect('single')}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedLocation === 'single'
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {selectedLocation === 'single' && (
                      <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-green-600" />
                    )}
                    <MapPin className="w-12 h-12 mb-4 text-green-600 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2">Single Location</h3>
                    <p className="text-gray-600 text-sm">
                      {selectedEntity === 'practitioner' 
                        ? 'Practitioner works at one clinic'
                        : 'One clinic location'
                      }
                    </p>
                  </button>

                  <button
                    onClick={() => handleLocationSelect('multiple')}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedLocation === 'multiple'
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {selectedLocation === 'multiple' && (
                      <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-orange-600" />
                    )}
                    <div className="flex justify-center mb-4">
                      <MapPin className="w-10 h-10 text-orange-600 -mr-2" />
                      <MapPin className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Multiple Locations</h3>
                    <p className="text-gray-600 text-sm">
                      {selectedEntity === 'practitioner' 
                        ? 'Practitioner works at multiple clinics'
                        : 'Multiple clinic branches/departments'
                      }
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Proceed Button */}
          {selectedEntity && selectedLocation && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleProceed}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg shadow-xl"
              >
                Continue to Schema Editor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Generate schema.org compliant JSON-LD for better search visibility
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Step-by-step wizard guides you through the entire process
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flexible Output</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Download JSON or copy to clipboard for immediate use
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building2, MapPin, ArrowRight, CheckCircle2, Plus, Trash2, Download, Copy, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Schema Editor Component
const getBaseSchema = (entityType, locationType) => {
  if (entityType === 'practitioner') {
    const base = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "",
      honorificSuffix: "",
      jobTitle: "",
      url: "",
      telephone: "",
      sameAs: []
    };
    
    if (locationType === 'single') {
      base.worksFor = {
        "@type": "MedicalClinic",
        name: "",
        address: {
          "@type": "PostalAddress",
          streetAddress: "",
          addressLocality: "",
          postalCode: "",
          addressCountry: ""
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 0,
          longitude: 0
        },
        telephone: "",
        openingHoursSpecification: [],
        availableService: [],
        review: null
      };
    } else {
      base.worksFor = [];
    }
    
    return base;
  } else {
    const base = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "",
      url: "",
      telephone: "",
      sameAs: [],
      address: {
        "@type": "PostalAddress",
        streetAddress: "",
        addressLocality: "",
        postalCode: "",
        addressCountry: ""
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 0,
        longitude: 0
      },
      priceRange: "",
      openingHoursSpecification: [],
      review: null
    };
    
    if (locationType === 'multiple') {
      base.department = [];
    } else {
      base.department = {
        "@type": "MedicalClinic",
        name: "",
        availableService: []
      };
    }
    
    return base;
  }
};

const cleanSchema = (obj) => {
  if (Array.isArray(obj)) {
    const cleaned = obj.map(cleanSchema).filter(item => {
      if (typeof item === 'object' && item !== null) {
        return Object.keys(item).length > 0;
      }
      return item !== '' && item !== null && item !== undefined;
    });
    return cleaned.length > 0 ? cleaned : undefined;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      const value = cleanSchema(obj[key]);
      if (value !== undefined && value !== '' && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          if (Object.keys(value).length > 0) {
            cleaned[key] = value;
          }
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            cleaned[key] = value;
          }
        } else {
          cleaned[key] = value;
        }
      }
    });
    return cleaned;
  }
  
  return obj === '' || obj === null || obj === undefined ? undefined : obj;
};

const SchemaEditor = ({ entityType, locationType, onBack }) => {
  const { toast } = useToast();
  const [schema, setSchema] = useState(getBaseSchema(entityType, locationType));
  const [showPreview, setShowPreview] = useState(true);

  const updateField = (path, value) => {
    setSchema(prev => {
      const newSchema = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newSchema;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSchema;
    });
  };

  const addSocialLink = () => {
    setSchema(prev => ({
      ...prev,
      sameAs: [...(prev.sameAs || []), '']
    }));
  };

  const updateSocialLink = (index, value) => {
    setSchema(prev => ({
      ...prev,
      sameAs: prev.sameAs.map((link, i) => i === index ? value : link)
    }));
  };

  const removeSocialLink = (index) => {
    setSchema(prev => ({
      ...prev,
      sameAs: prev.sameAs.filter((_, i) => i !== index)
    }));
  };

  const addOpeningHours = (target = null) => {
    const newHours = {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    };

    if (entityType === 'practitioner' && locationType === 'single') {
      setSchema(prev => ({
        ...prev,
        worksFor: {
          ...prev.worksFor,
          openingHoursSpecification: [...(prev.worksFor.openingHoursSpecification || []), newHours]
        }
      }));
    } else if (entityType === 'practitioner' && locationType === 'multiple') {
      setSchema(prev => ({
        ...prev,
        worksFor: prev.worksFor.map((clinic, i) => 
          i === target ? {
            ...clinic,
            openingHoursSpecification: [...(clinic.openingHoursSpecification || []), newHours]
          } : clinic
        )
      }));
    } else if (entityType === 'clinic' && locationType === 'single') {
      setSchema(prev => ({
        ...prev,
        openingHoursSpecification: [...(prev.openingHoursSpecification || []), newHours]
      }));
    } else {
      setSchema(prev => ({
        ...prev,
        openingHoursSpecification: [...(prev.openingHoursSpecification || []), newHours]
      }));
    }
  };

  const addService = (target = null) => {
    const newService = {
      "@type": "MedicalProcedure",
      name: ""
    };

    if (entityType === 'practitioner' && locationType === 'single') {
      setSchema(prev => ({
        ...prev,
        worksFor: {
          ...prev.worksFor,
          availableService: [...(prev.worksFor.availableService || []), newService]
        }
      }));
    } else if (entityType === 'practitioner' && locationType === 'multiple') {
      setSchema(prev => ({
        ...prev,
        worksFor: prev.worksFor.map((clinic, i) => 
          i === target ? {
            ...clinic,
            availableService: [...(clinic.availableService || []), newService]
          } : clinic
        )
      }));
    } else if (entityType === 'clinic' && locationType === 'single') {
      setSchema(prev => ({
        ...prev,
        department: {
          ...prev.department,
          availableService: [...(prev.department.availableService || []), newService]
        }
      }));
    } else {
      setSchema(prev => ({
        ...prev,
        department: prev.department.map((dept, i) => 
          i === target ? {
            ...dept,
            availableService: [...(dept.availableService || []), newService]
          } : dept
        )
      }));
    }
  };

  const addLocation = () => {
    const newLocation = {
      "@type": "MedicalClinic",
      name: "",
      address: {
        "@type": "PostalAddress",
        streetAddress: "",
        addressLocality: "",
        postalCode: "",
        addressCountry: ""
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 0,
        longitude: 0
      },
      telephone: "",
      openingHoursSpecification: [],
      availableService: []
    };

    if (entityType === 'practitioner') {
      setSchema(prev => ({
        ...prev,
        worksFor: [...prev.worksFor, newLocation]
      }));
    } else {
      setSchema(prev => ({
        ...prev,
        department: [...prev.department, newLocation]
      }));
    }
  };

  const downloadSchema = () => {
    const cleaned = cleanSchema(schema);
    const blob = new Blob([JSON.stringify(cleaned, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entityType}-${locationType}-schema.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "Schema downloaded successfully"
    });
  };

  const copySchema = () => {
    const cleaned = cleanSchema(schema);
    navigator.clipboard.writeText(JSON.stringify(cleaned, null, 2));
    toast({
      title: "Copied!",
      description: "Schema copied to clipboard"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            <Button variant="outline" onClick={copySchema}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={downloadSchema} className="bg-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {entityType === 'practitioner' ? 'Practitioner' : 'Clinic'} Information
                  {' '}({locationType === 'single' ? 'Single' : 'Multiple'} Location)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={schema.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder={entityType === 'practitioner' ? 'Dr. John Smith' : 'Clinic Name'}
                  />
                </div>

                {entityType === 'practitioner' && (
                  <>
                    <div>
                      <Label>Qualifications</Label>
                      <Input
                        value={schema.honorificSuffix || ''}
                        onChange={(e) => updateField('honorificSuffix', e.target.value)}
                        placeholder="MBBS, MRCP"
                      />
                    </div>
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={schema.jobTitle || ''}
                        onChange={(e) => updateField('jobTitle', e.target.value)}
                        placeholder="Consultant Cardiologist"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label>Website URL</Label>
                  <Input
                    value={schema.url || ''}
                    onChange={(e) => updateField('url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label>Telephone</Label>
                  <Input
                    value={schema.telephone || ''}
                    onChange={(e) => updateField('telephone', e.target.value)}
                    placeholder="+44 20 1234 5678"
                  />
                </div>

                {entityType === 'clinic' && (
                  <div>
                    <Label>Price Range</Label>
                    <Input
                      value={schema.priceRange || ''}
                      onChange={(e) => updateField('priceRange', e.target.value)}
                      placeholder="$$"
                    />
                  </div>
                )}

                <div>
                  <Label className="flex items-center justify-between mb-2">
                    Social Media Links
                    <Button type="button" size="sm" variant="outline" onClick={addSocialLink}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Label>
                  {schema.sameAs && schema.sameAs.map((link, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={link}
                        onChange={(e) => updateSocialLink(index, e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeSocialLink(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Address Section for Clinic Single Location */}
            {entityType === 'clinic' && locationType === 'single' && (
              <Card>
                <CardHeader>
                  <CardTitle>Address & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Street Address</Label>
                    <Input
                      value={schema.address?.streetAddress || ''}
                      onChange={(e) => updateField('address.streetAddress', e.target.value)}
                      placeholder="100 Beauty Avenue"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={schema.address?.addressLocality || ''}
                        onChange={(e) => updateField('address.addressLocality', e.target.value)}
                        placeholder="London"
                      />
                    </div>
                    <div>
                      <Label>Postal Code</Label>
                      <Input
                        value={schema.address?.postalCode || ''}
                        onChange={(e) => updateField('address.postalCode', e.target.value)}
                        placeholder="SW1A 1AA"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Country Code</Label>
                    <Input
                      value={schema.address?.addressCountry || ''}
                      onChange={(e) => updateField('address.addressCountry', e.target.value)}
                      placeholder="UK"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={schema.geo?.latitude || ''}
                        onChange={(e) => updateField('geo.latitude', parseFloat(e.target.value) || 0)}
                        placeholder="51.5074"
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={schema.geo?.longitude || ''}
                        onChange={(e) => updateField('geo.longitude', parseFloat(e.target.value) || 0)}
                        placeholder="-0.1278"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Single Location for Practitioner */}
            {entityType === 'practitioner' && locationType === 'single' && (
              <Card>
                <CardHeader>
                  <CardTitle>Workplace Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Clinic Name</Label>
                    <Input
                      value={schema.worksFor?.name || ''}
                      onChange={(e) => updateField('worksFor.name', e.target.value)}
                      placeholder="Heart Clinic - Harley Street"
                    />
                  </div>
                  <div>
                    <Label>Street Address</Label>
                    <Input
                      value={schema.worksFor?.address?.streetAddress || ''}
                      onChange={(e) => updateField('worksFor.address.streetAddress', e.target.value)}
                      placeholder="10 Harley Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={schema.worksFor?.address?.addressLocality || ''}
                        onChange={(e) => updateField('worksFor.address.addressLocality', e.target.value)}
                        placeholder="London"
                      />
                    </div>
                    <div>
                      <Label>Postal Code</Label>
                      <Input
                        value={schema.worksFor?.address?.postalCode || ''}
                        onChange={(e) => updateField('worksFor.address.postalCode', e.target.value)}
                        placeholder="W1G 9PF"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Country Code</Label>
                    <Input
                      value={schema.worksFor?.address?.addressCountry || ''}
                      onChange={(e) => updateField('worksFor.address.addressCountry', e.target.value)}
                      placeholder="UK"
                    />
                  </div>
                  <div>
                    <Label>Clinic Telephone</Label>
                    <Input
                      value={schema.worksFor?.telephone || ''}
                      onChange={(e) => updateField('worksFor.telephone', e.target.value)}
                      placeholder="+44 20 1234 5678"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={schema.worksFor?.geo?.latitude || ''}
                        onChange={(e) => updateField('worksFor.geo.latitude', parseFloat(e.target.value) || 0)}
                        placeholder="51.5237"
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={schema.worksFor?.geo?.longitude || ''}
                        onChange={(e) => updateField('worksFor.geo.longitude', parseFloat(e.target.value) || 0)}
                        placeholder="-0.1444"
                      />
                    </div>
                  </div>
                  <div>
                    <Button type="button" variant="outline" onClick={() => addService()} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                  {schema.worksFor?.availableService?.map((service, index) => (
                    <div key={index}>
                      <Input
                        value={service.name || ''}
                        onChange={(e) => {
                          setSchema(prev => ({
                            ...prev,
                            worksFor: {
                              ...prev.worksFor,
                              availableService: prev.worksFor.availableService.map((s, i) =>
                                i === index ? { ...s, name: e.target.value } : s
                              )
                            }
                          }));
                        }}
                        placeholder="Service name"
                      />
                    </div>
                  ))}
                  <div>
                    <Button type="button" variant="outline" onClick={() => addOpeningHours()} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Opening Hours
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Multiple Locations */}
            {locationType === 'multiple' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {entityType === 'practitioner' ? 'Workplaces' : 'Departments/Branches'}
                    <Button type="button" size="sm" variant="outline" onClick={addLocation}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Location
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(entityType === 'practitioner' ? schema.worksFor : schema.department)?.map((location, index) => (
                    <Card key={index} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Location {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={location.name || ''}
                            onChange={(e) => {
                              const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                              setSchema(prev => ({
                                ...prev,
                                [path]: prev[path].map((loc, i) => 
                                  i === index ? { ...loc, name: e.target.value } : loc
                                )
                              }));
                            }}
                            placeholder="Clinic Name - Branch"
                          />
                        </div>
                        <div>
                          <Label>Street Address</Label>
                          <Input
                            value={location.address?.streetAddress || ''}
                            onChange={(e) => {
                              const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                              setSchema(prev => ({
                                ...prev,
                                [path]: prev[path].map((loc, i) => 
                                  i === index ? { 
                                    ...loc, 
                                    address: { ...loc.address, streetAddress: e.target.value }
                                  } : loc
                                )
                              }));
                            }}
                            placeholder="Street Address"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>City</Label>
                            <Input
                              value={location.address?.addressLocality || ''}
                              onChange={(e) => {
                                const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                                setSchema(prev => ({
                                  ...prev,
                                  [path]: prev[path].map((loc, i) => 
                                    i === index ? { 
                                      ...loc, 
                                      address: { ...loc.address, addressLocality: e.target.value }
                                    } : loc
                                  )
                                }));
                              }}
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <Label>Postal Code</Label>
                            <Input
                              value={location.address?.postalCode || ''}
                              onChange={(e) => {
                                const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                                setSchema(prev => ({
                                  ...prev,
                                  [path]: prev[path].map((loc, i) => 
                                    i === index ? { 
                                      ...loc, 
                                      address: { ...loc.address, postalCode: e.target.value }
                                    } : loc
                                  )
                                }));
                              }}
                              placeholder="Postal Code"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Country Code</Label>
                          <Input
                            value={location.address?.addressCountry || ''}
                            onChange={(e) => {
                              const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                              setSchema(prev => ({
                                ...prev,
                                [path]: prev[path].map((loc, i) => 
                                  i === index ? { 
                                    ...loc, 
                                    address: { ...loc.address, addressCountry: e.target.value }
                                  } : loc
                                )
                              }));
                            }}
                            placeholder="UK"
                          />
                        </div>
                        <div>
                          <Label>Telephone</Label>
                          <Input
                            value={location.telephone || ''}
                            onChange={(e) => {
                              const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                              setSchema(prev => ({
                                ...prev,
                                [path]: prev[path].map((loc, i) => 
                                  i === index ? { ...loc, telephone: e.target.value } : loc
                                )
                              }));
                            }}
                            placeholder="+44 20 1234 5678"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Latitude</Label>
                            <Input
                              type="number"
                              step="0.0001"
                              value={location.geo?.latitude || ''}
                              onChange={(e) => {
                                const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                                setSchema(prev => ({
                                  ...prev,
                                  [path]: prev[path].map((loc, i) => 
                                    i === index ? { 
                                      ...loc, 
                                      geo: { ...loc.geo, latitude: parseFloat(e.target.value) || 0 }
                                    } : loc
                                  )
                                }));
                              }}
                              placeholder="51.5074"
                            />
                          </div>
                          <div>
                            <Label>Longitude</Label>
                            <Input
                              type="number"
                              step="0.0001"
                              value={location.geo?.longitude || ''}
                              onChange={(e) => {
                                const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                                setSchema(prev => ({
                                  ...prev,
                                  [path]: prev[path].map((loc, i) => 
                                    i === index ? { 
                                      ...loc, 
                                      geo: { ...loc.geo, longitude: parseFloat(e.target.value) || 0 }
                                    } : loc
                                  )
                                }));
                              }}
                              placeholder="-0.1278"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addService(index)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Service
                        </Button>
                        {location.availableService?.map((service, sIndex) => (
                          <Input
                            key={sIndex}
                            value={service.name || ''}
                            onChange={(e) => {
                              const path = entityType === 'practitioner' ? 'worksFor' : 'department';
                              setSchema(prev => ({
                                ...prev,
                                [path]: prev[path].map((loc, i) => 
                                  i === index ? {
                                    ...loc,
                                    availableService: loc.availableService.map((s, si) =>
                                      si === sIndex ? { ...s, name: e.target.value } : s
                                    )
                                  } : loc
                                )
                              }));
                            }}
                            placeholder="Service name"
                          />
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Opening Hours for Clinic Single */}
            {entityType === 'clinic' && locationType === 'single' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Opening Hours
                    <Button type="button" size="sm" variant="outline" onClick={() => addOpeningHours()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {schema.openingHoursSpecification?.map((hours, index) => (
                    <div key={index} className="p-4 border rounded">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Opens</Label>
                          <Input
                            type="time"
                            value={hours.opens || ''}
                            onChange={(e) => {
                              setSchema(prev => ({
                                ...prev,
                                openingHoursSpecification: prev.openingHoursSpecification.map((h, i) =>
                                  i === index ? { ...h, opens: e.target.value } : h
                                )
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label>Closes</Label>
                          <Input
                            type="time"
                            value={hours.closes || ''}
                            onChange={(e) => {
                              setSchema(prev => ({
                                ...prev,
                                openingHoursSpecification: prev.openingHoursSpecification.map((h, i) =>
                                  i === index ? { ...h, closes: e.target.value } : h
                                )
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Days: {hours.dayOfWeek?.join(', ') || 'Not set'}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Services for Clinic Single */}
            {entityType === 'clinic' && locationType === 'single' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Services
                    <Button type="button" size="sm" variant="outline" onClick={() => addService()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {schema.department?.availableService?.map((service, index) => (
                    <Input
                      key={index}
                      value={service.name || ''}
                      onChange={(e) => {
                        setSchema(prev => ({
                          ...prev,
                          department: {
                            ...prev.department,
                            availableService: prev.department.availableService.map((s, i) =>
                              i === index ? { ...s, name: e.target.value } : s
                            )
                          }
                        }));
                      }}
                      placeholder="Service name (e.g., Breast Augmentation)"
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Schema Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto font-mono">
                    {JSON.stringify(cleanSchema(schema), null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Index Component

const Index = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showEditor, setShowEditor] = useState(false);

  const handleEntitySelect = (type) => {
    setSelectedEntity(type);
    setSelectedLocation('');
  };

  const handleLocationSelect = (type) => {
    setSelectedLocation(type);
  };

  const handleProceed = () => {
    if (selectedEntity && selectedLocation) {
      setShowEditor(true);
    }
  };

  if (showEditor) {
    return <SchemaEditor entityType={selectedEntity} locationType={selectedLocation} onBack={() => setShowEditor(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Schema Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional JSON-LD structured data for medical practitioners and clinics
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Entity Type Selection */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                  1
                </span>
                Select Entity Type
              </CardTitle>
              <CardDescription>Choose whether you're creating a schema for a practitioner or a medical clinic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleEntitySelect('practitioner')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedEntity === 'practitioner'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {selectedEntity === 'practitioner' && (
                    <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-blue-600" />
                  )}
                  <User className="w-12 h-12 mb-4 text-blue-600 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Practitioner</h3>
                  <p className="text-gray-600 text-sm">
                    Individual medical professional (Doctor, Dentist, Specialist)
                  </p>
                </button>

                <button
                  onClick={() => handleEntitySelect('clinic')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedEntity === 'clinic'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {selectedEntity === 'clinic' && (
                    <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-purple-600" />
                  )}
                  <Building2 className="w-12 h-12 mb-4 text-purple-600 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Medical Clinic</h3>
                  <p className="text-gray-600 text-sm">
                    Medical business or healthcare facility
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Location Type Selection */}
          {selectedEntity && (
            <Card className="shadow-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                    2
                  </span>
                  Select Location Type
                </CardTitle>
                <CardDescription>
                  Does this {selectedEntity === 'practitioner' ? 'practitioner work at' : 'clinic have'} one location or multiple locations?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleLocationSelect('single')}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedLocation === 'single'
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {selectedLocation === 'single' && (
                      <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-green-600" />
                    )}
                    <MapPin className="w-12 h-12 mb-4 text-green-600 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2">Single Location</h3>
                    <p className="text-gray-600 text-sm">
                      {selectedEntity === 'practitioner' 
                        ? 'Practitioner works at one clinic'
                        : 'One clinic location'
                      }
                    </p>
                  </button>

                  <button
                    onClick={() => handleLocationSelect('multiple')}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedLocation === 'multiple'
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {selectedLocation === 'multiple' && (
                      <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-orange-600" />
                    )}
                    <div className="flex justify-center mb-4">
                      <MapPin className="w-10 h-10 text-orange-600 -mr-2" />
                      <MapPin className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Multiple Locations</h3>
                    <p className="text-gray-600 text-sm">
                      {selectedEntity === 'practitioner' 
                        ? 'Practitioner works at multiple clinics'
                        : 'Multiple clinic branches/departments'
                      }
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Proceed Button */}
          {selectedEntity && selectedLocation && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleProceed}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg shadow-xl"
              >
                Continue to Schema Editor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Generate schema.org compliant JSON-LD for better search visibility
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Step-by-step wizard guides you through the entire process
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flexible Output</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Download JSON or copy to clipboard for immediate use
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
