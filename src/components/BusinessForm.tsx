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
import { Download, Plus, Trash2, Building2, MapPin, Clock, Share2, Star, ChevronLeft, ChevronRight, Check, Eye, Copy } from 'lucide-react';

import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

const BusinessForm = () => {
  const [currentTab, setCurrentTab] = useState('basic');
  const [newBusinessType, setNewBusinessType] = useState('');
  const [newKnowsAbout, setNewKnowsAbout] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
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

  const commonKnowsAbout = [
    'anti-wrinkle injections',
    'dermal fillers',
    'lip filler',
    'PRP',
    'skin booster',
    'laser hair removal',
    'hydrafacial',
    'chemical peel',
    'microneedling',
    'botox',
    'facial treatments',
    'skin consultation'
  ];

  const paymentOptions = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Apple Pay',
    'Google Pay',
    'Bank Transfer',
    'PayPal',
    'Cryptocurrency'
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
    { code: '+968', country: 'OM', label: '+968 (Oman)' }
  ];

  const countries = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'IN', name: 'India' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'QA', name: 'Qatar' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'OM', name: 'Oman' }
  ];
  
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'hours', label: 'Hours & Services', icon: Clock },
    { id: 'social', label: 'Social & Rating', icon: Share2 },
    { id: 'branches', label: 'Branches', icon: Star }
  ];
  
  const [data, setData] = useState({
    businessTypes: [],
    businessName: '',
    legalName: '',
    website: '',
    logoUrl: '',
    heroImageUrl: '',
    phone: '',
    phoneCode: '+44',
    email: '',
    qualifications: [], // New field for medical qualifications
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    latitude: '',
    longitude: '',
    googlePlacesApiKey: '',
    ratingValue: '',
    reviewCount: '',
    reviewsUrl: '', // New field for reviews link
    instagram: '',
    facebook: '',
    tiktok: '',
    linkedin: '',
    currency: 'GBP',
    areaServed: '',
    priceRange: '$$',
    acceptsReservations: true,
    paymentMethods: ['Cash', 'Credit Card', 'Debit Card'],
    knowsAbout: [],
    services: [],
    openingHours: [],
    branches: []
  });

  const updateField = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const extractAddressComponents = (place) => {
    console.log('Extracting from place:', place);
    
    if (!place.address_components) {
      console.log('No address_components found');
      return { city: '', region: '', country: '', postalCode: '', latitude: '', longitude: '', areaServed: '' };
    }

    const components = place.address_components;
    const geometry = place.geometry;
    
    let city = '';
    let region = '';
    let country = '';
    let postalCode = '';
    let latitude = '';
    let longitude = '';
    let areaServed = '';

    console.log('Address components:', components);

    components.forEach((component) => {
      const types = component.types;
      console.log('Component:', component.long_name, 'Types:', types);
      
      // City - try multiple approaches
      if (types.includes('locality')) {
        city = component.long_name;
        areaServed = component.long_name;
        console.log('Found city (locality):', city);
      } else if (types.includes('sublocality_level_1') && !city) {
        city = component.long_name;
        areaServed = component.long_name;
        console.log('Found city (sublocality_level_1):', city);
      } else if (types.includes('administrative_area_level_2') && !city) {
        city = component.long_name;
        areaServed = component.long_name;
        console.log('Found city (administrative_area_level_2):', city);
      }
      
      // Region/State
      if (types.includes('administrative_area_level_1')) {
        region = component.long_name;
        console.log('Found region:', region);
      }
      
      // Country
      if (types.includes('country')) {
        const countryByCode = countries.find(c => c.code === component.short_name);
        const countryByName = countries.find(c => c.name.toLowerCase() === component.long_name.toLowerCase());
        
        if (countryByCode) {
          country = countryByCode.code;
          console.log('Found country by code:', country);
        } else if (countryByName) {
          country = countryByName.code;
          console.log('Found country by name:', country);
        } else {
          country = component.short_name;
          console.log('Using country short_name:', country);
        }
      }
      
      // Postal Code
      if (types.includes('postal_code')) {
        postalCode = component.long_name;
        console.log('Found postal code:', postalCode);
      }
    });

    // Extract coordinates with better error handling
    if (geometry && geometry.location) {
      try {
        if (typeof geometry.location.lat === 'function') {
          latitude = geometry.location.lat().toString();
          longitude = geometry.location.lng().toString();
        } else {
          latitude = geometry.location.lat.toString();
          longitude = geometry.location.lng.toString();
        }
        console.log('Found coordinates:', latitude, longitude);
      } catch (err) {
        console.error('Error extracting coordinates:', err);
        latitude = '';
        longitude = '';
      }
    } else {
      console.log('No geometry data found');
    }

    const result = { city, region, country, postalCode, latitude, longitude, areaServed };
    console.log('Extracted data:', result);
    
    return result;
  };

  const handlePlaceSelect = (place) => {
    console.log('Place selected, processing...', place);
    
    // Add a small delay to ensure all place data is loaded
    setTimeout(() => {
      const extracted = extractAddressComponents(place);
      
      console.log('Updating form with extracted data:', extracted);
      
      setData(prev => {
        const updated = {
          ...prev,
          // Only update if we got meaningful data, otherwise keep existing values
          city: extracted.city || prev.city,
          region: extracted.region || prev.region,
          country: extracted.country || prev.country,
          postalCode: extracted.postalCode || prev.postalCode,
          latitude: extracted.latitude || prev.latitude,
          longitude: extracted.longitude || prev.longitude,
          areaServed: extracted.areaServed || prev.areaServed
        };
        
        console.log('Form data updated:', updated);
        return updated;
      });
    }, 100); // Small delay to ensure Google Places has finished processing
  };

  const addBusinessType = (type) => {
    if (type && type.trim() && !data.businessTypes.includes(type.trim())) {
      setData(prev => ({
        ...prev,
        businessTypes: [...prev.businessTypes, type.trim()]
      }));
    }
  };

  const removeBusinessType = (type) => {
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

  const addKnowsAbout = (item) => {
    if (item && item.trim() && !data.knowsAbout.includes(item.trim())) {
      setData(prev => ({
        ...prev,
        knowsAbout: [...prev.knowsAbout, item.trim()]
      }));
    }
  };

  const removeKnowsAbout = (item) => {
    setData(prev => ({
      ...prev,
      knowsAbout: prev.knowsAbout.filter(k => k !== item)
    }));
  };

  const addCustomKnowsAbout = () => {
    if (newKnowsAbout.trim()) {
      addKnowsAbout(newKnowsAbout);
      setNewKnowsAbout('');
    }
  };

  // Qualifications management
  const [newQualification, setNewQualification] = useState('');
  
  const commonQualifications = [
    'MBBS', 'MD', 'MRCS', 'FRCS', 'DM', 'MCh', 'MS', 'FCPS', 'DNB', 'DOMS',
    'DCH', 'DGO', 'DA', 'DTCD', 'DMRD', 'MD (General Medicine)', 'MD (Pediatrics)',
    'MD (Dermatology)', 'MD (Psychiatry)', 'MD (Radiology)', 'MD (Anesthesia)',
    'MS (General Surgery)', 'MS (Orthopedics)', 'MS (ENT)', 'MS (Ophthalmology)',
    'BDS', 'MDS', 'BPT', 'MPT', 'BAMS', 'BHMS', 'BUMS'
  ];

  const addQualification = (qualification) => {
    if (!data.qualifications.includes(qualification)) {
      setData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, qualification]
      }));
    }
  };

  const removeQualification = (qualification) => {
    setData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(q => q !== qualification)
    }));
  };

  const addCustomQualification = () => {
    if (newQualification.trim()) {
      addQualification(newQualification.trim());
      setNewQualification('');
    }
  };

  const togglePaymentMethod = (method) => {
    setData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  const addService = () => {
    setData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', price: '', url: '' }]
    }));
  };

  const updateService = (index, field, value) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (index) => {
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

  const updateOpeningHours = (index, field, value) => {
    setData(prev => ({
      ...prev,
      openingHours: prev.openingHours.map((hours, i) => 
        i === index ? { ...hours, [field]: value } : hours
      )
    }));
  };

  const updateOpeningHoursDays = (index, day, checked) => {
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

  const removeOpeningHours = (index) => {
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

  const updateBranch = (index, field, value) => {
    setData(prev => ({
      ...prev,
      branches: prev.branches.map((branch, i) => 
        i === index ? { ...branch, [field]: value } : branch
      )
    }));
  };

  const removeBranch = (index) => {
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

  const getSectionCompleteness = (tabId) => {
    switch (tabId) {
      case 'basic':
        return data.businessName && data.website && data.businessTypes && data.businessTypes.length > 0;
      case 'location':
        return data.street && data.city && data.region && data.postalCode && data.country && data.latitude && data.longitude && data.areaServed;
      case 'hours':
        return data.openingHours && data.openingHours.length > 0;
      case 'social':
        return data.instagram || data.facebook || data.tiktok || data.linkedin;
      case 'branches':
        return true;
      default:
        return false;
    }
  };

  const generateSchema = () => {
    let schema: any = {
      "@context": "https://schema.org"
    };

    // Business Type
    if (data.businessTypes && data.businessTypes.length > 0) {
      schema["@type"] = data.businessTypes;
    }

    // Basic Business Info
    const domain = data.website ? data.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
    
    if (domain) {
      schema["@id"] = `https://${domain}/#clinic`;
      schema.url = data.website;
    }
    
    if (data.businessName) {
      schema.name = data.businessName;
    }
    
    if (data.legalName) {
      schema.legalName = data.legalName;
    }

    // Images
    const images = [];
    if (data.heroImageUrl) images.push(data.heroImageUrl);
    if (data.logoUrl) images.push(data.logoUrl);
    
    if (images.length > 0) {
      schema.image = images;
    }
    
    if (data.logoUrl) {
      schema.logo = data.logoUrl;
    }
    
    if (data.phone) {
      schema.telephone = `${data.phoneCode}-${data.phone}`;
    }
    
    if (data.email) {
      schema.email = data.email;
    }

    if (data.paymentMethods && data.paymentMethods.length > 0) {
      schema.paymentAccepted = data.paymentMethods.join(', ');
    }
    
    if (data.acceptsReservations) {
      schema.acceptsReservations = "True";
    }
    
    // Coordinates and Map
    if (data.latitude && data.longitude) {
      schema.hasMap = `https://maps.google.com/?q=${data.latitude},${data.longitude}`;
      
      schema.geo = {
        "@type": "GeoCoordinates",
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude)
      };
    }
    
    // Address
    if (data.street || data.city) {
      const addressData: any = {
        "@type": "PostalAddress"
      };
      
      if (data.street) addressData.streetAddress = data.street;
      if (data.city) addressData.addressLocality = data.city;
      if (data.region) addressData.addressRegion = data.region;
      if (data.postalCode) addressData.postalCode = data.postalCode;
      if (data.country) addressData.addressCountry = data.country;
      
      schema.address = addressData;
    }
    
    // Opening Hours
    if (data.openingHours && data.openingHours.length > 0) {
      schema.openingHoursSpecification = data.openingHours.map(hours => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days,
        opens: hours.opens,
        closes: hours.closes
      }));
    }
    
    // Social Links
    const socialLinks = [];
    if (data.instagram) socialLinks.push(`https://www.instagram.com/${data.instagram}`);
    if (data.facebook) socialLinks.push(`https://www.facebook.com/${data.facebook}`);
    if (data.tiktok) socialLinks.push(`https://www.tiktok.com/@${data.tiktok}`);
    if (data.linkedin) socialLinks.push(`https://www.linkedin.com/company/${data.linkedin}`);
    
    if (socialLinks.length > 0) {
      schema.sameAs = socialLinks;
    }
    
    // Services and Expertise
    if (data.knowsAbout && data.knowsAbout.length > 0) {
      schema.knowsAbout = data.knowsAbout;
    }
    
    // Medical Qualifications
    if (data.qualifications && data.qualifications.length > 0) {
      schema.hasCredential = data.qualifications.map(qualification => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: qualification
      }));
    }
    
    // Services/Offers
    if (data.services && data.services.length > 0) {
      schema.makesOffer = {
        "@type": "OfferCatalog",
        name: "Clinic Services",
        itemListElement: data.services.map(service => {
          const offer: any = {
            "@type": "Offer",
            name: service.name,
            priceCurrency: "AED",
            priceSpecification: {
              "@type": "PriceSpecification",
              price: service.price
            },
            availability: "https://schema.org/InStock"
          };
          
          // Only include URL if it's provided and not empty
          if (service.url && service.url.trim()) {
            offer.url = service.url;
          }
          
          return offer;
        })
      };
    }
    
    // Area Served
    if (data.areaServed) {
      schema.areaServed = {
        "@type": "City",
        name: data.areaServed
      };
    }
    
    // Booking Action
    if (schema.url) {
      schema.potentialAction = {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${schema.url}book/`,
          inLanguage: "en"
        }
      };
    }
    
    // Rating
    if (data.ratingValue && data.reviewCount) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: data.ratingValue,
        reviewCount: data.reviewCount
      };
      
      // Add reviews URL if provided
      if (data.reviewsUrl) {
        schema.aggregateRating.url = data.reviewsUrl;
      }
    }
    
    // Branches
    if (data.branches && data.branches.length > 0 && schema.url) {
      const orgData: any = {
        "@type": "Organization",
        "@id": `${schema.url}/#org`,
        name: data.businessName,
        url: schema.url,
        logo: data.logoUrl
      };
      
      if (socialLinks.length > 0) {
        orgData.sameAs = socialLinks;
      }
      
      const branchData = data.branches.map((branch: any) => {
        const branchSchema: any = {
          "@type": "LocalBusiness",
          "@id": `${schema.url}/#branch-${branch.name.toLowerCase().replace(/\s+/g, '-')}`,
          branchOf: {
            "@id": `${schema.url}/#org`
          },
          name: `${data.businessName} - ${branch.name}`,
          url: branch.url,
          telephone: branch.phone
        };
        
        if (branch.street || branch.city) {
          const branchAddress: any = {
            "@type": "PostalAddress"
          };
          
          if (branch.street) branchAddress.streetAddress = branch.street;
          if (branch.city) branchAddress.addressLocality = branch.city;
          if (branch.region) branchAddress.addressRegion = branch.region;
          if (branch.postalCode) branchAddress.postalCode = branch.postalCode;
          if (data.country) branchAddress.addressCountry = data.country;
          
          branchSchema.address = branchAddress;
        }
        
        if (branch.latitude && branch.longitude) {
          branchSchema.geo = {
            "@type": "GeoCoordinates",
            latitude: parseFloat(branch.latitude),
            longitude: parseFloat(branch.longitude)
          };
        }
        
        return branchSchema;
      });
      
      schema["@graph"] = [orgData, ...branchData];
    }
    
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
    a.download = 'local-business-schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySchema = () => {
    const schema = generateSchema();
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Business Schema Generator
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Generate comprehensive JSON-LD schemas for enhanced SEO
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

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Preview Schema'}
          </Button>
          <Button
            onClick={copySchema}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Schema
          </Button>
        </div>

        {/* Schema Preview */}
        {showPreview && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Schema Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                {JSON.stringify(generateSchema(), null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

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
              <CardContent className="space-y-6">
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

                <div>
                  <Label className="text-sm font-medium mb-3 block">Services & Expertise</Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-gray-50">
                      {data.knowsAbout.length > 0 ? (
                        data.knowsAbout.map((item) => (
                          <Badge key={item} variant="outline" className="flex items-center gap-1">
                            {item}
                            <button
                              onClick={() => removeKnowsAbout(item)}
                              className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No services/expertise added</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Select onValueChange={addKnowsAbout}>
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Select services/expertise" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {commonKnowsAbout
                            .filter(item => !data.knowsAbout.includes(item))
                            .map((item) => (
                              <SelectItem key={item} value={item} className="hover:bg-gray-100">
                                {item}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom service/expertise"
                          value={newKnowsAbout}
                          onChange={(e) => setNewKnowsAbout(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomKnowsAbout()}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={addCustomKnowsAbout}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Medical Qualifications</Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-gray-50">
                      {data.qualifications.length > 0 ? (
                        data.qualifications.map((qualification) => (
                          <Badge key={qualification} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                            {qualification}
                            <button
                              onClick={() => removeQualification(qualification)}
                              className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No qualifications added</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Select onValueChange={addQualification}>
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {commonQualifications
                            .filter(qualification => !data.qualifications.includes(qualification))
                            .map((qualification) => (
                              <SelectItem key={qualification} value={qualification} className="hover:bg-gray-100">
                                {qualification}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom qualification"
                          value={newQualification}
                          onChange={(e) => setNewQualification(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomQualification()}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={addCustomQualification}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Select value={data.priceRange} onValueChange={(value) => updateField('priceRange', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$">$ (Budget)</SelectItem>
                        <SelectItem value="$$">$$ (Moderate)</SelectItem>
                        <SelectItem value="$$$">$$$ (Expensive)</SelectItem>
                        <SelectItem value="$$$$">$$$$ (Very Expensive)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={data.currency} onValueChange={(value) => updateField('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="AED">AED (د.إ)</SelectItem>
                        <SelectItem value="SAR">SAR (ر.س)</SelectItem>
                        <SelectItem value="QAR">QAR (ر.ق)</SelectItem>
                        <SelectItem value="KWD">KWD (د.ك)</SelectItem>
                        <SelectItem value="BHD">BHD (.د.ب)</SelectItem>
                        <SelectItem value="OMR">OMR (ر.ع.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="acceptsReservations"
                      checked={data.acceptsReservations}
                      onChange={(e) => updateField('acceptsReservations', e.target.checked)}
                    />
                    <Label htmlFor="acceptsReservations">Accepts Reservations</Label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Payment Methods</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {paymentOptions.map((method) => (
                      <label key={method} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.paymentMethods.includes(method)}
                          onChange={() => togglePaymentMethod(method)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
                  <CardTitle>Services & Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.services.map((service, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          <Input
                            value={service.price}
                            onChange={(e) => updateService(index, 'price', e.target.value)}
                            placeholder="100"
                            type="number"
                          />
                        </div>
                        <div>
                          <Label>Service URL (Optional)</Label>
                          <Input
                            value={service.url}
                            onChange={(e) => updateService(index, 'url', e.target.value)}
                            placeholder="https://example.com/service (leave empty if no specific page)"
                          />
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
                    <Label htmlFor="ratingValue">Rating Value (0-5)</Label>
                    <Input
                      id="ratingValue"
                      value={data.ratingValue}
                      onChange={(e) => updateField('ratingValue', e.target.value)}
                      placeholder="4.9"
                      type="number"
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
                      type="number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reviewsUrl">Reviews Page URL</Label>
                  <Input
                    id="reviewsUrl"
                    value={data.reviewsUrl}
                    onChange={(e) => updateField('reviewsUrl', e.target.value)}
                    placeholder="https://g.page/your-business/review or https://www.yelp.com/biz/your-business"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Link to your Google Reviews, Yelp, or other review platform where patients can leave reviews
                  </p>
                </div>
              </CardContent>
            </Card>
            
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
                  Business Branches (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.branches.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No branches added yet. Branches are optional but help with multi-location SEO.</p>
                  </div>
                ) : (
                  data.branches.map((branch, index) => (
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
                  ))
                )}
                
                <Button onClick={addBranch} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Branch
                </Button>
              </CardContent>
            </Card>
            
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
