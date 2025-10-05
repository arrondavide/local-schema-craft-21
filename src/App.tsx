import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Building2, User, MapPin, MapPinned, Download, Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';

// Load Google Places API
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Schema Context
const SchemaContext = createContext();

const SchemaProvider = ({ children }) => {
  const [schemaType, setSchemaType] = useState({ entity: '', location: '' });
  const [schemaData, setSchemaData] = useState({});
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [apiLoaded, setApiLoaded] = useState(false);
  
  useEffect(() => {
    const savedKey = localStorage.getItem('googlePlacesApiKey');
    if (savedKey) {
      setGoogleApiKey(savedKey);
      loadGoogleMapsScript(savedKey)
        .then(() => setApiLoaded(true))
        .catch(console.error);
    }
  }, []);
  
  return (
    <SchemaContext.Provider value={{ 
      schemaType, setSchemaType, 
      schemaData, setSchemaData,
      googleApiKey, setGoogleApiKey,
      apiLoaded, setApiLoaded
    }}>
      {children}
    </SchemaContext.Provider>
  );
};

const useSchema = () => useContext(SchemaContext);

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Schema Generator</h1>
          </div>
          <div className="text-sm opacity-90">JSON-LD for Healthcare</div>
        </div>
      </div>
    </nav>
  );
};

// API Key Setup Component
const ApiKeySetup = ({ onComplete }) => {
  const { googleApiKey, setGoogleApiKey, setApiLoaded } = useSchema();
  const [keyInput, setKeyInput] = useState(googleApiKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!keyInput.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loadGoogleMapsScript(keyInput);
      localStorage.setItem('googlePlacesApiKey', keyInput);
      setGoogleApiKey(keyInput);
      setApiLoaded(true);
      onComplete();
    } catch (err) {
      setError('Failed to load Google Places API. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Google Places API Key</h3>
        <p className="text-gray-600 mb-6">
          Enter your Google Places API key to enable address autocomplete features.
        </p>
        <input
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="AIzaSy..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
        />
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-semibold"
          >
            {loading ? 'Loading...' : 'Save & Continue'}
          </button>
          {googleApiKey && (
            <button
              onClick={onComplete}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Skip
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Get your API key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
        </p>
      </div>
    </div>
  );
};

// Google Places Autocomplete Input
const PlacesAutocompleteInput = ({ value, onChange, onPlaceSelect, placeholder, label, required = false }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const { apiLoaded } = useSchema();

  useEffect(() => {
    if (!apiLoaded || !inputRef.current) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment', 'geocode'],
        fields: ['name', 'formatted_address', 'address_components', 'geometry', 'formatted_phone_number', 'opening_hours', 'website']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && onPlaceSelect) {
          onPlaceSelect(place);
        }
      });
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [apiLoaded, onPlaceSelect]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

// Index Page - Schema Type Selector
const Index = () => {
  const navigate = useNavigate();
  const { setSchemaType, setSchemaData, googleApiKey, apiLoaded } = useSchema();
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showApiSetup, setShowApiSetup] = useState(false);

  useEffect(() => {
    if (!googleApiKey) {
      setShowApiSetup(true);
    }
  }, [googleApiKey]);

  const handleGenerate = () => {
    if (selectedEntity && selectedLocation) {
      setSchemaType({ entity: selectedEntity, location: selectedLocation });
      setSchemaData({});
      navigate('/service');
    }
  };

  const entityTypes = [
    { id: 'practitioner', label: 'Practitioner', icon: User, description: 'Individual healthcare provider' },
    { id: 'clinic', label: 'Medical Clinic', icon: Building2, description: 'Healthcare facility or business' }
  ];

  const locationTypes = [
    { id: 'single', label: 'Single Location', icon: MapPin, description: 'One practice location' },
    { id: 'multiple', label: 'Multiple Locations', icon: MapPinned, description: 'Multiple practice locations' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {showApiSetup && <ApiKeySetup onComplete={() => setShowApiSetup(false)} />}
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Create Your Schema</h2>
            <p className="text-lg text-gray-600">Generate structured data for healthcare providers and facilities</p>
            {apiLoaded && (
              <p className="text-sm text-green-600 mt-2">✓ Google Places API loaded</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Select Entity Type</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {entityTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedEntity(type.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedEntity === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow'
                    }`}
                  >
                    <type.icon className={`w-12 h-12 mx-auto mb-3 ${
                      selectedEntity === type.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-lg mb-1">{type.label}</h4>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Select Location Type</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {locationTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedLocation(type.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedLocation === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow'
                    }`}
                  >
                    <type.icon className={`w-12 h-12 mx-auto mb-3 ${
                      selectedLocation === type.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-lg mb-1">{type.label}</h4>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={!selectedEntity || !selectedLocation}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Generate Schema Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Schema Page
const ServiceSchema = () => {
  const { schemaType } = useSchema();
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState(() => getInitialFormData(schemaType));

  const generatedSchema = generateSchema(formData, schemaType);

  const downloadJSON = () => {
    const dataStr = JSON.stringify(generatedSchema, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Schema Editor</h2>
            <p className="text-gray-600 mt-1">
              {schemaType.entity === 'practitioner' ? 'Practitioner' : 'Medical Clinic'} - 
              {schemaType.location === 'single' ? ' Single Location' : ' Multiple Locations'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={downloadJSON}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <SchemaForm formData={formData} setFormData={setFormData} schemaType={schemaType} />
          </div>
          
          {showPreview && (
            <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-auto">
              <SchemaPreview schema={generatedSchema} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Schema Form Component
const SchemaForm = ({ formData, setFormData, schemaType }) => {
  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (path, template) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (!Array.isArray(current[keys[keys.length - 1]])) {
        current[keys[keys.length - 1]] = [];
      }
      
      current[keys[keys.length - 1]].push(template);
      return newData;
    });
  };

  const removeArrayItem = (path, index) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]].splice(index, 1);
      return newData;
    });
  };

  return (
    <div className="space-y-6">
      <Section title="Basic Information">
        <Input
          label="Name"
          value={formData.name || ''}
          onChange={(v) => updateField('name', v)}
          required
        />
        {schemaType.entity === 'practitioner' && (
          <>
            <Input
              label="Honorific Suffix (e.g., MBBS, MRCP)"
              value={formData.honorificSuffix || ''}
              onChange={(v) => updateField('honorificSuffix', v)}
            />
            <Input
              label="Job Title"
              value={formData.jobTitle || ''}
              onChange={(v) => updateField('jobTitle', v)}
            />
          </>
        )}
        <Input
          label="Website URL"
          value={formData.url || ''}
          onChange={(v) => updateField('url', v)}
        />
        <Input
          label="Telephone"
          value={formData.telephone || ''}
          onChange={(v) => updateField('telephone', v)}
        />
        {schemaType.entity === 'clinic' && (
          <Input
            label="Price Range (e.g., $$$)"
            value={formData.priceRange || ''}
            onChange={(v) => updateField('priceRange', v)}
          />
        )}
      </Section>

      <Section title="Social Media Links" collapsible>
        <ArrayField
          label="Links"
          items={formData.sameAs || []}
          onAdd={() => addArrayItem('sameAs', '')}
          onRemove={(i) => removeArrayItem('sameAs', i)}
          renderItem={(item, i) => (
            <Input
              placeholder="https://example.com/profile"
              value={item}
              onChange={(v) => {
                const newSameAs = [...(formData.sameAs || [])];
                newSameAs[i] = v;
                updateField('sameAs', newSameAs);
              }}
            />
          )}
        />
      </Section>

      {schemaType.entity === 'practitioner' && schemaType.location === 'single' && (
        <LocationSection
          location={formData.worksFor || {}}
          onChange={(v) => updateField('worksFor', v)}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {schemaType.entity === 'practitioner' && schemaType.location === 'multiple' && (
        <Section title="Practice Locations">
          <ArrayField
            label="Locations"
            items={formData.worksFor || []}
            onAdd={() => addArrayItem('worksFor', getLocationTemplate())}
            onRemove={(i) => removeArrayItem('worksFor', i)}
            renderItem={(location, i) => (
              <div className="border border-gray-200 rounded-lg p-4">
                <LocationSection
                  location={location}
                  onChange={(v) => {
                    const newWorksFor = [...(formData.worksFor || [])];
                    newWorksFor[i] = v;
                    updateField('worksFor', newWorksFor);
                  }}
                  formData={formData}
                  setFormData={setFormData}
                  index={i}
                />
              </div>
            )}
          />
        </Section>
      )}

      {schemaType.entity === 'clinic' && schemaType.location === 'single' && (
        <>
          <AddressSection
            address={formData.address || {}}
            onChange={(v) => updateField('address', v)}
          />
          <GeoSection
            geo={formData.geo || {}}
            onChange={(v) => updateField('geo', v)}
          />
          <OpeningHoursSection
            hours={formData.openingHoursSpecification || []}
            onChange={(v) => updateField('openingHoursSpecification', v)}
          />
          <ServicesSection
            services={formData.department?.availableService || []}
            onChange={(v) => updateField('department.availableService', v)}
            label="Available Services"
          />
        </>
      )}

      {schemaType.entity === 'clinic' && schemaType.location === 'multiple' && (
        <>
          <AddressSection
            address={formData.address || {}}
            onChange={(v) => updateField('address', v)}
            label="Main Address"
          />
          <GeoSection
            geo={formData.geo || {}}
            onChange={(v) => updateField('geo', v)}
            label="Main Location Coordinates"
          />
          <OpeningHoursSection
            hours={formData.openingHoursSpecification || []}
            onChange={(v) => updateField('openingHoursSpecification', v)}
            label="Main Opening Hours"
          />
          <Section title="Department Locations">
            <ArrayField
              label="Departments"
              items={formData.department || []}
              onAdd={() => addArrayItem('department', getDepartmentTemplate())}
              onRemove={(i) => removeArrayItem('department', i)}
              renderItem={(dept, i) => (
                <div className="border border-gray-200 rounded-lg p-4">
                  <Input
                    label="Department Name"
                    value={dept.name || ''}
                    onChange={(v) => {
                      const newDept = [...(formData.department || [])];
                      newDept[i] = { ...newDept[i], name: v };
                      updateField('department', newDept);
                    }}
                  />
                  <AddressSection
                    address={dept.address || {}}
                    onChange={(v) => {
                      const newDept = [...(formData.department || [])];
                      newDept[i] = { ...newDept[i], address: v };
                      updateField('department', newDept);
                    }}
                  />
                  <GeoSection
                    geo={dept.geo || {}}
                    onChange={(v) => {
                      const newDept = [...(formData.department || [])];
                      newDept[i] = { ...newDept[i], geo: v };
                      updateField('department', newDept);
                    }}
                  />
                  <Input
                    label="Telephone"
                    value={dept.telephone || ''}
                    onChange={(v) => {
                      const newDept = [...(formData.department || [])];
                      newDept[i] = { ...newDept[i], telephone: v };
                      updateField('department', newDept);
                    }}
                  />
                  <OpeningHoursSection
                    hours={dept.openingHoursSpecification || []}
                    onChange={(v) => {
                      const newDept = [...(formData.department || [])];
                      newDept[i] = { ...newDept[i], openingHoursSpecification: v };
                      updateField('department', newDept);
                    }}
                  />
                  <ServicesSection
                    services={dept.availableService || []}
                    onChange={(v) => {
                      const newDept = [...(formData.department || [])];
                      newDept[i] = { ...newDept[i], availableService: v };
                      updateField('department', newDept);
                    }}
                  />
                </div>
              )}
            />
          </Section>
        </>
      )}

      <ReviewSection
        review={formData.review || {}}
        onChange={(v) => updateField('review', v)}
      />
    </div>
  );
};

// Location Section Component
const LocationSection = ({ location, onChange, index }) => {
  const handlePlaceSelect = (place) => {
    const updated = { ...location };
    
    if (place.name) updated.name = place.name;
    if (place.formatted_phone_number) updated.telephone = place.formatted_phone_number;
    
    if (place.address_components) {
      const address = {};
      let streetNumber = '';
      let route = '';
      
      place.address_components.forEach(component => {
        if (component.types.includes('street_number')) streetNumber = component.long_name;
        if (component.types.includes('route')) route = component.long_name;
        if (component.types.includes('locality')) address.addressLocality = component.long_name;
        if (component.types.includes('postal_code')) address.postalCode = component.long_name;
        if (component.types.includes('country')) address.addressCountry = component.short_name;
      });
      
      if (streetNumber || route) {
        address.streetAddress = `${streetNumber} ${route}`.trim();
      }
      
      updated.address = address;
    }
    
    if (place.geometry?.location) {
      updated.geo = {
        latitude: place.geometry.location.lat().toString(),
        longitude: place.geometry.location.lng().toString()
      };
    }
    
    onChange(updated);
  };

  return (
    <Section title={index !== undefined ? `Location ${index + 1}` : "Practice Location"}>
      <PlacesAutocompleteInput
        label="Search Location"
        value=""
        onChange={() => {}}
        onPlaceSelect={handlePlaceSelect}
        placeholder="Search for a place..."
      />
      <Input
        label="Clinic Name"
        value={location.name || ''}
        onChange={(v) => onChange({ ...location, name: v })}
      />
      <AddressSection
        address={location.address || {}}
        onChange={(v) => onChange({ ...location, address: v })}
      />
      <GeoSection
        geo={location.geo || {}}
        onChange={(v) => onChange({ ...location, geo: v })}
      />
      <Input
        label="Telephone"
        value={location.telephone || ''}
        onChange={(v) => onChange({ ...location, telephone: v })}
      />
      <OpeningHoursSection
        hours={location.openingHoursSpecification || []}
        onChange={(v) => onChange({ ...location, openingHoursSpecification: v })}
      />
      <ServicesSection
        services={location.availableService || []}
        onChange={(v) => onChange({ ...location, availableService: v })}
      />
      <ReviewSection
        review={location.review || {}}
        onChange={(v) => onChange({ ...location, review: v })}
      />
    </Section>
  );
};

// Reusable Components
const Section = ({ title, children, collapsible = false }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div
        className={`flex items-center justify-between mb-4 ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setCollapsed(!collapsed) : undefined}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {collapsible && (
          collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />
        )}
      </div>
      {(!collapsible || !collapsed) && <div className="space-y-4">{children}</div>}
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const ArrayField = ({ label, items, onAdd, onRemove, renderItem }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <button
        onClick={onAdd}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
      >
        <Plus className="w-4 h-4" /> Add
      </button>
    </div>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <div className="flex-1">{renderItem(item, i)}</div>
          <button
            onClick={() => onRemove(i)}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const AddressSection = ({ address, onChange, label = "Address" }) => {
  const { apiLoaded } = useSchema();
  
  const handlePlaceSelect = (place) => {
    if (place.address_components) {
      const newAddress = {};
      let streetNumber = '';
      let route = '';
      
      place.address_components.forEach(component => {
        if (component.types.includes('street_number')) streetNumber = component.long_name;
        if (component.types.includes('route')) route = component.long_name;
        if (component.types.includes('locality')) newAddress.addressLocality = component.long_name;
        if (component.types.includes('postal_code')) newAddress.postalCode = component.long_name;
        if (component.types.includes('country')) newAddress.addressCountry = component.short_name;
      });
      
      if (streetNumber || route) {
        newAddress.streetAddress = `${streetNumber} ${route}`.trim();
      }
      
      onChange(newAddress);
    }
  };

  return (
    <Section title={label} collapsible>
      {apiLoaded && (
        <PlacesAutocompleteInput
          label="Search Address"
          value=""
          onChange={() => {}}
          onPlaceSelect={handlePlaceSelect}
          placeholder="Search for an address..."
        />
      )}
      <Input
        label="Street Address"
        value={address.streetAddress || ''}
        onChange={(v) => onChange({ ...address, streetAddress: v })}
      />
      <Input
        label="City"
        value={address.addressLocality || ''}
        onChange={(v) => onChange({ ...address, addressLocality: v })}
      />
      <Input
        label="Postal Code"
        value={address.postalCode || ''}
        onChange={(v) => onChange({ ...address, postalCode: v })}
      />
      <Input
        label="Country"
        value={address.addressCountry || ''}
        onChange={(v) => onChange({ ...address, addressCountry: v })}
      />
    </Section>
  );
};

const GeoSection = ({ geo, onChange, label = "Geographic Coordinates" }) => (
  <Section title={label} collapsible>
    <Input
      label="Latitude"
      value={geo.latitude || ''}
      onChange={(v) => onChange({ ...geo, latitude: v })}
      placeholder="51.5074"
    />
    <Input
      label="Longitude"
      value={geo.longitude || ''}
      onChange={(v) => onChange({ ...geo, longitude: v })}
      placeholder="-0.1278"
    />
  </Section>
);

const OpeningHoursSection = ({ hours, onChange, label = "Opening Hours" }) => {
  const addHours = () => {
    onChange([...(hours || []), { dayOfWeek: [], opens: '', closes: '' }]);
  };

  const removeHours = (index) => {
    const newHours = [...hours];
    newHours.splice(index, 1);
    onChange(newHours);
  };

  const updateHours = (index, field, value) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    onChange(newHours);
  };

  const toggleDay = (index, day) => {
    const newHours = [...hours];
    const days = newHours[index].dayOfWeek || [];
    const dayIndex = days.indexOf(day);
    
    if (dayIndex > -1) {
      days.splice(dayIndex, 1);
    } else {
      days.push(day);
    }
    
    newHours[index].dayOfWeek = days;
    onChange(newHours);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Section title={label} collapsible>
      <ArrayField
        label="Time Periods"
        items={hours || []}
        onAdd={addHours}
        onRemove={removeHours}
        renderItem={(item, i) => (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(i, day)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      (item.dayOfWeek || []).includes(day)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Opens"
                value={item.opens || ''}
                onChange={(v) => updateHours(i, 'opens', v)}
                placeholder="09:00"
              />
              <Input
                label="Closes"
                value={item.closes || ''}
                onChange={(v) => updateHours(i, 'closes', v)}
                placeholder="17:00"
              />
            </div>
          </div>
        )}
      />
    </Section>
  );
};

const ServicesSection = ({ services, onChange, label = "Services" }) => {
  const addService = () => {
    onChange([...(services || []), { name: '' }]);
  };

  const removeService = (index) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    onChange(newServices);
  };

  const updateService = (index, value) => {
    const newServices = [...services];
    newServices[index] = { name: value };
    onChange(newServices);
  };

  return (
    <Section title={label} collapsible>
      <ArrayField
        label="Medical Procedures"
        items={services || []}
        onAdd={addService}
        onRemove={removeService}
        renderItem={(item, i) => (
          <Input
            placeholder="e.g., Consultation, Echocardiogram"
            value={item.name || ''}
            onChange={(v) => updateService(i, v)}
          />
        )}
      />
    </Section>
  );
};

const ReviewSection = ({ review, onChange }) => (
  <Section title="Review (Optional)" collapsible>
    <Input
      label="Rating Value (1-5)"
      value={review.reviewRating?.ratingValue || ''}
      onChange={(v) => onChange({
        ...review,
        reviewRating: { ...review.reviewRating, ratingValue: v, bestRating: '5' }
      })}
      placeholder="4.5"
    />
    <Input
      label="Reviewer Name"
      value={review.author?.name || ''}
      onChange={(v) => onChange({
        ...review,
        author: { ...review.author, name: v }
      })}
      placeholder="John Doe"
    />
  </Section>
);

// Schema Preview Component
const SchemaPreview = ({ schema }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">JSON-LD Preview</h3>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-[70vh]">
        {JSON.stringify(schema, null, 2)}
      </pre>
    </div>
  );
};

// Utility Functions
function getInitialFormData(schemaType) {
  const base = {
    name: '',
    url: '',
    telephone: '',
    sameAs: []
  };

  if (schemaType.entity === 'practitioner') {
    return {
      ...base,
      honorificSuffix: '',
      jobTitle: '',
      worksFor: schemaType.location === 'single' ? getLocationTemplate() : []
    };
  } else {
    return {
      ...base,
      priceRange: '',
      address: {},
      geo: {},
      openingHoursSpecification: [],
      department: schemaType.location === 'single' ? { availableService: [] } : [],
      review: {}
    };
  }
}

function getLocationTemplate() {
  return {
    name: '',
    address: {},
    geo: {},
    telephone: '',
    openingHoursSpecification: [],
    availableService: [],
    review: {}
  };
}

function getDepartmentTemplate() {
  return {
    name: '',
    address: {},
    geo: {},
    telephone: '',
    openingHoursSpecification: [],
    availableService: []
  };
}

function generateSchema(formData, schemaType) {
  const cleanObject = (obj) => {
    if (Array.isArray(obj)) {
      const cleaned = obj.map(cleanObject).filter(item => {
        if (typeof item === 'string') return item !== '';
        if (typeof item === 'object') return Object.keys(item).length > 0;
        return true;
      });
      return cleaned.length > 0 ? cleaned : undefined;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = cleanObject(value);
        if (cleanedValue !== undefined && cleanedValue !== '' && 
            !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)) {
          cleaned[key] = cleanedValue;
        }
      }
      return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }
    
    return obj !== '' ? obj : undefined;
  };

  const buildAddress = (address) => {
    const cleaned = cleanObject(address);
    if (!cleaned) return undefined;
    return {
      '@type': 'PostalAddress',
      ...cleaned
    };
  };

  const buildGeo = (geo) => {
    const cleaned = cleanObject(geo);
    if (!cleaned) return undefined;
    return {
      '@type': 'GeoCoordinates',
      ...cleaned
    };
  };

  const buildOpeningHours = (hours) => {
    const cleaned = cleanObject(hours);
    if (!cleaned || cleaned.length === 0) return undefined;
    return cleaned.map(h => ({
      '@type': 'OpeningHoursSpecification',
      ...h
    }));
  };

  const buildServices = (services) => {
    const cleaned = cleanObject(services);
    if (!cleaned || cleaned.length === 0) return undefined;
    return cleaned.map(s => ({
      '@type': 'MedicalProcedure',
      name: s.name
    }));
  };

  const buildReview = (review) => {
    if (!review.reviewRating?.ratingValue && !review.author?.name) return undefined;
    
    const reviewObj = {
      '@type': 'Review'
    };
    
    if (review.reviewRating?.ratingValue) {
      reviewObj.reviewRating = {
        '@type': 'Rating',
        ratingValue: review.reviewRating.ratingValue,
        bestRating: '5'
      };
    }
    
    if (review.author?.name) {
      reviewObj.author = {
        '@type': 'Person',
        name: review.author.name
      };
    }
    
    return reviewObj;
  };

  const buildLocation = (location) => {
    const loc = {
      '@type': 'MedicalClinic'
    };
    
    if (location.name) loc.name = location.name;
    
    const address = buildAddress(location.address);
    if (address) loc.address = address;
    
    const geo = buildGeo(location.geo);
    if (geo) loc.geo = geo;
    
    if (location.telephone) loc.telephone = location.telephone;
    
    const openingHours = buildOpeningHours(location.openingHoursSpecification);
    if (openingHours) loc.openingHoursSpecification = openingHours;
    
    const services = buildServices(location.availableService);
    if (services) loc.availableService = services;
    
    const review = buildReview(location.review);
    if (review) loc.review = review;
    
    return loc;
  };

  let schema = {
    '@context': 'https://schema.org'
  };

  // Practitioner Schema
  if (schemaType.entity === 'practitioner') {
    schema['@type'] = 'Person';
    
    if (formData.name) schema.name = formData.name;
    if (formData.honorificSuffix) schema.honorificSuffix = formData.honorificSuffix;
    if (formData.jobTitle) schema.jobTitle = formData.jobTitle;
    if (formData.url) schema.url = formData.url;
    if (formData.telephone) schema.telephone = formData.telephone;
    
    const sameAs = cleanObject(formData.sameAs);
    if (sameAs) schema.sameAs = sameAs;

    if (schemaType.location === 'single') {
      const worksFor = buildLocation(formData.worksFor);
      if (Object.keys(worksFor).length > 1) schema.worksFor = worksFor;
    } else {
      const worksFor = (formData.worksFor || []).map(buildLocation).filter(loc => Object.keys(loc).length > 1);
      if (worksFor.length > 0) schema.worksFor = worksFor;
    }
  }
  
  // Medical Clinic Schema
  else if (schemaType.entity === 'clinic') {
    schema['@type'] = 'MedicalBusiness';
    
    if (formData.name) schema.name = formData.name;
    if (formData.url) schema.url = formData.url;
    if (formData.telephone) schema.telephone = formData.telephone;
    
    const sameAs = cleanObject(formData.sameAs);
    if (sameAs) schema.sameAs = sameAs;
    
    const address = buildAddress(formData.address);
    if (address) schema.address = address;
    
    const geo = buildGeo(formData.geo);
    if (geo) schema.geo = geo;
    
    if (formData.priceRange) schema.priceRange = formData.priceRange;
    
    const openingHours = buildOpeningHours(formData.openingHoursSpecification);
    if (openingHours) schema.openingHoursSpecification = openingHours;

    if (schemaType.location === 'single') {
      if (formData.department?.availableService) {
        const services = buildServices(formData.department.availableService);
        if (services) {
          schema.department = {
            '@type': 'MedicalClinic',
            name: formData.department.name || 'Medical Services',
            availableService: services
          };
        }
      }
    } else {
      const departments = (formData.department || []).map(dept => {
        const d = {
          '@type': 'MedicalClinic'
        };
        
        if (dept.name) d.name = dept.name;
        
        const address = buildAddress(dept.address);
        if (address) d.address = address;
        
        const geo = buildGeo(dept.geo);
        if (geo) d.geo = geo;
        
        if (dept.telephone) d.telephone = dept.telephone;
        
        const openingHours = buildOpeningHours(dept.openingHoursSpecification);
        if (openingHours) d.openingHoursSpecification = openingHours;
        
        const services = buildServices(dept.availableService);
        if (services) d.availableService = services;
        
        return d;
      }).filter(d => Object.keys(d).length > 1);
      
      if (departments.length > 0) schema.department = departments;
    }
    
    const review = buildReview(formData.review);
    if (review) schema.review = review;
  }

  return schema;
}

// Not Found Page
const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <SchemaProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/service" element={<ServiceSchema />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </SchemaProvider>
  );
};

export default App;
