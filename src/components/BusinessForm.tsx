import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Plus, Trash2, Building2, MapPin, Clock, Share2, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface BusinessData {
  businessTypes: string[];
  businessName: string;
  legalName: string;
  website: string;
  logoUrl: string;
  heroImageUrl: string;
  phone: string;
  phoneCode: string;
  email: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  googlePlacesApiKey: string;
  ratingValue: string;
  reviewCount: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  linkedin: string;
  currency: string;
  areaServed: string;
  services: Array<{
    name: string;
    price: string;
    url: string;
  }>;
  openingHours: Array<{
    days: string[];
    opens: string;
    closes: string;
  }>;
  branches: Array<{
    name: string;
    url: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
    latitude: string;
    longitude: string;
  }>;
}

// Google Places Autocomplete Component
interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: any) => void;
  placeholder?: string;
  label?: string;
  apiKey?: string;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address",
  label = "Address",
  apiKey
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const autocompleteRef = React.useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!apiKey) return;

    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsLoaded(true);
          return;
        }

        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
        script.async = true;
        script.defer = true;

        (window as any).initAutocomplete = () => {
          setIsLoaded(true);
        };

        document.head.appendChild(script);

        script.onerror = () => {
          setError('Failed to load Google Maps API');
        };
      } catch (err) {
        setError('Error loading Google Maps API');
      }
    };

    loadGoogleMaps();
  }, [apiKey]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    try {
      // Initialize autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address']
      });

      // Add place changed listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          onChange(place.formatted_address);
          onPlaceSelect(place);
        }
      });
    } catch (err) {
      setError('Error initializing autocomplete');
    }

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, onPlaceSelect]);

  if (!apiKey) {
    return (
      <div>
        <Label htmlFor="address">{label}</Label>
        <Input
          id="address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <Alert className="mt-2">
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            Add your Google Places API key to enable address autocomplete
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Label htmlFor="address">{label}</Label>
        <Input
          id="address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <Alert className="mt-2">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor="address">{label}</Label>
      <Input
        ref={inputRef}
        id="address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isLoaded ? "Start typing an address..." : placeholder}
        disabled={!isLoaded}
      />
      {!isLoaded && (
        <div className="text-sm text-muted-foreground mt-1">
          Loading Google Places...
        </div>
      )}
    </div>
  );
};

const BusinessForm = () => {
  const [currentTab, setCurrentTab] = useState('basic');
  const [newBusinessType, setNewBusinessType] = useState('');
  
  const commonBusinessTypes = [
    'MedicalClinic',
    'HealthAndBeautyBusiness', 
    'DentalClinic',
    'DermatologyClinic',
    'CosmeticSurgery',
    'Spa',
    'BeautySalon',
    'MedicalSpa',
    'WellnessCenter',
    'HealthcareOrganization',
    'LocalBusiness',
    'ProfessionalService',
    'Store',
    'Restaurant',
    'Hotel',
    'Gym',
    'FitnessCenter'
  ];

  const phoneCountryCodes = [
    { code: '+44', country: 'GB', label: '+44 (UK)' },
    { code: '+1', country: 'US', label: '+1 (US/Canada)' },
    { code: '+971', country: 'UAE', label: '+971 (UAE)' },
    { code: '+91', country: 'IN', label: '+91 (India)' },
    { code: '+49', country: 'DE', label: '+49 (Germany)' },
    { code: '+33', country: 'FR', label: '+33 (France)' },
    { code: '+86', country: 'CN', label: '+86 (China)' },
    { code: '+81', country: 'JP', label: '+81 (Japan)' },
    { code: '+82', country: 'KR', label: '+82 (South Korea)' },
    { code: '+65', country: 'SG', label: '+65 (Singapore)' },
    { code: '+966', country: 'SA', label: '+966 (Saudi Arabia)' },
    { code: '+974', country: 'QA', label: '+974 (Qatar)' },
    { code: '+965', country: 'KW', label: '+965 (Kuwait)' },
    { code: '+973', country: 'BH', label: '+973 (Bahrain)' },
    { code: '+968', country: 'OM', label: '+968 (Oman)' },
    { code: '+20', country: 'EG', label: '+20 (Egypt)' },
    { code: '+961', country: 'LB', label: '+961 (Lebanon)' },
    { code: '+962', country: 'JO', label: '+962 (Jordan)' },
    { code: '+41', country: 'CH', label: '+41 (Switzerland)' },
    { code: '+31', country: 'NL', label: '+31 (Netherlands)' },
    { code: '+46', country: 'SE', label: '+46 (Sweden)' },
    { code: '+47', country: 'NO', label: '+47 (Norway)' },
    { code: '+45', country: 'DK', label: '+45 (Denmark)' },
    { code: '+61', country: 'AU', label: '+61 (Australia)' },
    { code: '+64', country: 'NZ', label: '+64 (New Zealand)' },
    { code: '+27', country: 'ZA', label: '+27 (South Africa)' },
    { code: '+55', country: 'BR', label: '+55 (Brazil)' },
    { code: '+52', country: 'MX', label: '+52 (Mexico)' },
    { code: '+7', country: 'RU', label: '+7 (Russia)' },
    { code: '+90', country: 'TR', label: '+90 (Turkey)' }
  ];

  const countries = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'IN', name: 'India' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'CN', name: 'China' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'QA', name: 'Qatar' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'OM', name: 'Oman' },
    { code: 'EG', name: 'Egypt' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'JO', name: 'Jordan' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'AU', name: 'Australia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'RU', name: 'Russia' },
    { code: 'TR', name: 'Turkey' }
  ];
  
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'hours', label: 'Hours & Services', icon: Clock },
    { id: 'social', label: 'Social & Rating', icon: Share2 },
    { id: 'branches', label: 'Branches', icon: Star }
  ];
  
  const [data, setData] = useState<BusinessData>({
    businessTypes: [],
    businessName: '',
    legalName: '',
    website: '',
    logoUrl: '',
    heroImageUrl: '',
    phone: '',
    phoneCode: '+44',
    email: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    latitude: '',
    longitude: '',
    googlePlacesApiKey: 'AIzaSyB1SiZWgwVib7DCqkCHPFDySwewiOi4GgQ',
    ratingValue: '',
    reviewCount: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    linkedin: '',
    currency: 'GBP',
    areaServed: '',
    services: [],
    openingHours: [],
    branches: []
  });

  // Load data from memory
  useEffect(() => {
    // In a real app, this would load from localStorage
    // For this demo, we'll just use the initial state
  }, []);

  const updateField = (field: keyof BusinessData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const extractAddressComponents = (place: any) => {
    const components = place.address_components || [];
    const geometry = place.geometry;
    
    let city = '';
    let region = '';
    let country = '';
    let postalCode = '';
    let latitude = '';
    let longitude = '';

    // Extract address components
    components.forEach((component: any) => {
      const types = component.types;
      
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        region = component.long_name;
      } else if (types.includes('country')) {
        const countryMatch = countries.find(c => c.name === component.long_name || c.code === component.short_name);
        country = countryMatch ? countryMatch.code : component.short_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    });

    // Extract coordinates
    if (geometry && geometry.location) {
      latitude = geometry.location.lat().toString();
      longitude = geometry.location.lng().toString();
    }

    return { city, region, country, postalCode, latitude, longitude };
  };

  const handlePlaceSelect = (place: any) => {
    const { city, region, country, postalCode, latitude, longitude } = extractAddressComponents(place);
    
    // Update all the extracted fields
    setData(prev => ({
      ...prev,
      city: city || prev.city,
      region: region || prev.region,
      country: country || prev.country,
      postalCode: postalCode || prev.postalCode,
      latitude: latitude || prev.latitude,
      longitude: longitude || prev.longitude
    }));
  };

  const addBusinessType = (type: string) => {
    if (type && type.trim() && !data.businessTypes.includes(type.trim())) {
      setData(prev => ({
        ...prev,
        businessTypes: [...prev.businessTypes, type.trim()]
      }));
    }
  };

  const removeBusinessType = (type: string) => {
    setData(prev => ({
      ...prev,
      businessTypes: prev.businessTypes.filter(t => t !== type)
    }));
  };

  const addCustomBusinessType = () => {
    if (newBusinessType.trim()) {
      addBusinessType(newBusinessType);
      setNewBusinessType('');
    }
  };

  const addService = () => {
    setData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', price: '', url: '' }]
    }));
  };

  const updateService = (index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (index: number) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addOpeningHours = () => {
    setData(prev => ({
      ...prev,
      openingHours: [...prev.openingHours, { days: [], opens: '09:00', closes: '18:00' }]
    }));
  };

  const updateOpeningHours = (index: number, field: 'opens' | 'closes', value: string) => {
    setData(prev => ({
      ...prev,
      openingHours: prev.openingHours.map((hours, i) => 
        i === index ? { ...hours, [field]: value } : hours
      )
    }));
  };

  const updateOpeningHoursDays = (index: number, day: string, checked: boolean) => {
    setData(prev => ({
      ...prev,
      openingHours: prev.openingHours.map((hours, i) => 
        i === index ? {
          ...hours,
          days: checked 
            ? [...hours.days, day]
            : hours.days.filter(d => d !== day)
        } : hours
      )
    }));
  };

  const removeOpeningHours = (index: number) => {
    setData(prev => ({
      ...prev,
      openingHours: prev.openingHours.filter((_, i) => i !== index)
    }));
  };

  const addBranch = () => {
    setData(prev => ({
      ...prev,
      branches: [...prev.branches, {
        name: '',
        url: '',
        phone: '',
        street: '',
        city: '',
        region: '',
        postalCode: '',
        latitude: '',
        longitude: ''
      }]
    }));
  };

  const updateBranch = (index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      branches: prev.branches.map((branch, i) => 
        i === index ? { ...branch, [field]: value } : branch
      )
    }));
  };

  const removeBranch = (index: number) => {
    setData(prev => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== index)
    }));
  };

  const nextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
    }
  };

  const previousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  const getProgress = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    return ((currentIndex + 1) / tabs.length) * 100;
  };

  const getSectionCompleteness = (tabId: string) => {
    switch (tabId) {
      case 'basic':
        return data.businessName && data.website && data.businessTypes && data.businessTypes.length > 0;
      case 'location':
        return data.street && data.city;
      case 'hours':
        return data.openingHours && data.openingHours.length > 0;
      case 'social':
        return data.instagram || data.facebook || data.tiktok || data.linkedin;
      case 'branches':
        return true; // Optional section
      default:
        return false;
    }
  };

  const generateSchema = () => {
    // Schema generation logic (same as before but with updated field names)
    let schema: any = {
      "@context": "https://schema.org"
    };

    if (data.businessTypes && data.businessTypes.length > 0) {
      schema["@type"] = data.businessTypes.length === 1 ? data.businessTypes[0] : data.businessTypes;
    }

    const domain = data.website ? data.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
    
    if (domain) {
      schema["@id"] = `https://${domain}/#clinic`;
      schema.url = data.website;
    }
    
    if (data.businessName && data.businessName.trim()) {
      schema.name = data.businessName;
    }
    
    if (data.legalName && data.legalName.trim()) {
      schema.legalName = data.legalName;
    }
    
    if (data.phone && data.phone.trim()) {
      schema.telephone = `${data.phoneCode}${data.phone}`;
    }
    
    if (data.email && data.email.trim()) {
      schema.email = data.email;
    }
    
    // Images
    const images = [];
    if (data.heroImageUrl && data.heroImageUrl.trim()) images.push(data.heroImageUrl);
    if (data.logoUrl && data.logoUrl.trim()) images.push(data.logoUrl);
    
    if (images.length > 0) {
      schema.image = images;
      if (data.logoUrl && data.logoUrl.trim()) {
        schema.logo = data.logoUrl;
      }
    }
    
    // Address
    const addressData: any = {};
    if (data.street && data.street.trim()) addressData.streetAddress = data.street;
    if (data.city && data.city.trim()) addressData.addressLocality = data.city;
    if (data.region && data.region.trim()) addressData.addressRegion = data.region;
    if (data.postalCode && data.postalCode.trim()) addressData.postalCode = data.postalCode;
    if (data.country && data.country.trim()) addressData.addressCountry = data.country;
    
    if (Object.keys(addressData).length > 0) {
      schema.address = {
        "@type": "PostalAddress",
        ...addressData
      };
    }
    
    // Rest of schema generation...
    return schema;
  };

  const downloadSchema = () => {
    const schema = generateSchema();
    const blob = new Blob([JSON.stringify(schema, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'local-schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AHM SEO Schema Generator
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Generate structured JSON-LD schemas for your business
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-600">{Math.round(getProgress())}%</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 w-full gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isCompleted = getSectionCompleteness(tab.id);
              return (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 relative"
                >
                  {isCompleted && (
                    <Check className="w-3 h-3 absolute -top-1 -right-1 text-green-500 bg-white rounded-full" />
                  )}
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="basic">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Business Types *</Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-gray-50">
                      {data.businessTypes.length > 0 ? (
                        data.businessTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="flex items-center gap-1">
                            {type}
                            <button
                              onClick={() => removeBusinessType(type)}
                              className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No business types selected</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Select onValueChange={addBusinessType}>
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Select a business type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {commonBusinessTypes
                            .filter(type => !data.businessTypes.includes(type))
                            .map((type) => (
                              <SelectItem key={type} value={type} className="hover:bg-gray-100">
                                {type}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom business type"
                          value={newBusinessType}
                          onChange={(e) => setNewBusinessType(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomBusinessType()}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={addCustomBusinessType}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={data.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="legalName">Legal Name (Optional)</Label>
                    <Input
                      id="legalName"
                      value={data.legalName}
                      onChange={(e) => updateField('legalName', e.target.value)}
                      placeholder="Legal entity name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="website">Website URL *</Label>
                  <Input
                    id="website"
                    value={data.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://your-domain.com"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={data.logoUrl}
                      onChange={(e) => updateField('logoUrl', e.target.value)}
                      placeholder="https://your-domain.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroImageUrl">Hero Image URL</Label>
                    <Input
                      id="heroImageUrl"
                      value={data.heroImageUrl}
                      onChange={(e) => updateField('heroImageUrl', e.target.value)}
                      placeholder="https://your-domain.com/hero.jpg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select value={data.phoneCode} onValueChange={(value) => updateField('phoneCode', value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {phoneCountryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        className="flex-1"
                        value={data.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="XX-XXX-XXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="info@your-domain.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={previousTab} 
                disabled={currentTab === 'basic'}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button 
                onClick={nextTab}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="location">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <GooglePlacesAutocomplete
                  value={data.street}
                  onChange={(value) => updateField('street', value)}
                  onPlaceSelect={handlePlaceSelect}
                  apiKey={data.googlePlacesApiKey}
                  label="Street Address *"
                  placeholder="Start typing an address..."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={data.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="London"
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">State/Region</Label>
                    <Input
                      id="region"
                      value={data.region}
                      onChange={(e) => updateField('region', e.target.value)}
                      placeholder="England"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={data.postalCode}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={data.country} onValueChange={(value) => updateField('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={data.latitude}
                      onChange={(e) => updateField('latitude', e.target.value)}
                      placeholder="51.5074"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={data.longitude}
                      onChange={(e) => updateField('longitude', e.target.value)}
                      placeholder="-0.1278"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="areaServed">Area Served</Label>
                  <Input
                    id="areaServed"
                    value={data.areaServed}
                    onChange={(e) => updateField('areaServed', e.target.value)}
                    placeholder="London"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={previousTab}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button 
                onClick={nextTab}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="hours">
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.openingHours.map((hours, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Schedule {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOpeningHours(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Select Days</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <label key={day} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={hours.days.includes(day)}
                                onChange={(e) => updateOpeningHoursDays(index, day, e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-xs sm:text-sm">{day.slice(0, 3)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {hours.days.map(day => (
                          <Badge key={day} variant="secondary" className="text-xs">{day}</Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Opens</Label>
                          <Input
                            type="time"
                            value={hours.opens}
                            onChange={(e) => updateOpeningHours(index, 'opens', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Closes</Label>
                          <Input
                            type="time"
                            value={hours.closes}
                            onChange={(e) => updateOpeningHours(index, 'closes', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addOpeningHours} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Opening Hours
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Services & Offers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.services.map((service, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Service Name</Label>
                          <Input
                            value={service.name}
                            onChange={(e) => updateService(index, 'name', e.target.value)}
                            placeholder="Service name"
                          />
                        </div>
                        <div>
                          <Label>Price ({data.currency})</Label>
                          <div className="flex gap-2">
                            <Select value={data.currency} onValueChange={(value) => updateField('currency', value)}>
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="AED">AED</SelectItem>
                                <SelectItem value="SAR">SAR</SelectItem>
                                <SelectItem value="QAR">QAR</SelectItem>
                                <SelectItem value="KWD">KWD</SelectItem>
                                <SelectItem value="BHD">BHD</SelectItem>
                                <SelectItem value="OMR">OMR</SelectItem>
                                <SelectItem value="INR">INR</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              className="flex-1"
                              value={service.price}
                              onChange={(e) => updateService(index, 'price', e.target.value)}
                              placeholder="900"
                            />
                          </div>
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeService(index)}
                            className="w-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addService} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={previousTab}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button 
                onClick={nextTab}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  Social Links & Rating
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram">Instagram Username</Label>
                    <Input
                      id="instagram"
                      value={data.instagram}
                      onChange={(e) => updateField('instagram', e.target.value)}
                      placeholder="your_username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook Page</Label>
                    <Input
                      id="facebook"
                      value={data.facebook}
                      onChange={(e) => updateField('facebook', e.target.value)}
                      placeholder="your_page"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tiktok">TikTok Username</Label>
                    <Input
                      id="tiktok"
                      value={data.tiktok}
                      onChange={(e) => updateField('tiktok', e.target.value)}
                      placeholder="your_username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Company</Label>
                    <Input
                      id="linkedin"
                      value={data.linkedin}
                      onChange={(e) => updateField('linkedin', e.target.value)}
                      placeholder="your_company"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ratingValue">Rating Value</Label>
                    <Input
                      id="ratingValue"
                      value={data.ratingValue}
                      onChange={(e) => updateField('ratingValue', e.target.value)}
                      placeholder="4.9"
                      step="0.1"
                      min="0"
                      max="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviewCount">Review Count</Label>
                    <Input
                      id="reviewCount"
                      value={data.reviewCount}
                      onChange={(e) => updateField('reviewCount', e.target.value)}
                      placeholder="187"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={previousTab}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button 
                onClick={nextTab}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="branches">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  Business Branches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.branches.map((branch, index) => (
                  <div key={index} className="p-6 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Branch {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeBranch(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Branch Name</Label>
                        <Input
                          value={branch.name}
                          onChange={(e) => updateBranch(index, 'name', e.target.value)}
                          placeholder="London Branch"
                        />
                      </div>
                      <div>
                        <Label>Branch URL</Label>
                        <Input
                          value={branch.url}
                          onChange={(e) => updateBranch(index, 'url', e.target.value)}
                          placeholder="https://your-domain.com/locations/london/"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={branch.phone}
                        onChange={(e) => updateBranch(index, 'phone', e.target.value)}
                        placeholder="+44-20-XXXX-XXXX"
                      />
                    </div>
                    
                    <div>
                      <Label>Street Address</Label>
                      <Input
                        value={branch.street}
                        onChange={(e) => updateBranch(index, 'street', e.target.value)}
                        placeholder="Street, Building, Unit"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={branch.city}
                          onChange={(e) => updateBranch(index, 'city', e.target.value)}
                          placeholder="London"
                        />
                      </div>
                      <div>
                        <Label>State/Region</Label>
                        <Input
                          value={branch.region}
                          onChange={(e) => updateBranch(index, 'region', e.target.value)}
                          placeholder="England"
                        />
                      </div>
                      <div>
                        <Label>Postal Code</Label>
                        <Input
                          value={branch.postalCode}
                          onChange={(e) => updateBranch(index, 'postalCode', e.target.value)}
                          placeholder="SW1A 1AA"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Latitude</Label>
                        <Input
                          value={branch.latitude}
                          onChange={(e) => updateBranch(index, 'latitude', e.target.value)}
                          placeholder="51.5074"
                        />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input
                          value={branch.longitude}
                          onChange={(e) => updateBranch(index, 'longitude', e.target.value)}
                          placeholder="-0.1278"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button onClick={addBranch} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Branch
                </Button>
              </CardContent>
            </Card>
            
            {/* Final Section Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="outline" 
                onClick={previousTab}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button 
                onClick={downloadSchema}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Generate & Download Schema
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessForm;
