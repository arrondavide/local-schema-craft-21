import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Plus, Trash2, Building2, MapPin, Clock, Share2, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import schemaTemplate from '@/data/schema-template.json';

interface BusinessData {
  businessName: string;
  legalName: string;
  website: string;
  logoUrl: string;
  heroImageUrl: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  emirate: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  areaServed: string;
  ratingValue: string;
  reviewCount: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  linkedin: string;
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
    emirate: string;
    postalCode: string;
    latitude: string;
    longitude: string;
  }>;
}

const BusinessForm = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('basic');
  
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'hours', label: 'Hours & Services', icon: Clock },
    { id: 'social', label: 'Social & Rating', icon: Share2 },
    { id: 'branches', label: 'Branches', icon: Star }
  ];
  const [data, setData] = useState<BusinessData>({
    businessName: '',
    legalName: '',
    website: '',
    logoUrl: '',
    heroImageUrl: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    emirate: '',
    postalCode: '',
    country: 'AE',
    latitude: '',
    longitude: '',
    areaServed: '',
    ratingValue: '4.9',
    reviewCount: '187',
    instagram: '',
    facebook: '',
    tiktok: '',
    linkedin: '',
    services: [
      { name: 'Anti-Wrinkle Injections', price: '900', url: '' },
      { name: 'Dermal Filler (1ml)', price: '1200', url: '' }
    ],
    openingHours: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
      { days: ['Saturday'], opens: '10:00', closes: '16:00' }
    ],
    branches: []
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('businessFormData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('businessFormData', JSON.stringify(data));
  }, [data]);

  const updateField = (field: keyof BusinessData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
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
        emirate: '',
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
        return data.businessName && data.website;
      case 'location':
        return data.street && data.city;
      case 'hours':
        return data.openingHours.length > 0;
      case 'social':
        return data.instagram || data.facebook || data.tiktok || data.linkedin;
      case 'branches':
        return true; // Optional section
      default:
        return false;
    }
  };

  const generateSchema = () => {
    let schema = JSON.parse(JSON.stringify(schemaTemplate));
    
    // Replace basic placeholders
    const domain = data.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    schema['@id'] = `https://${domain}/#clinic`;
    schema.name = data.businessName || 'YOUR CLINIC NAME';
    schema.legalName = data.legalName || 'YOUR LEGAL ENTITY (OPTIONAL)';
    schema.url = data.website || 'https://YOUR-DOMAIN/';
    schema.telephone = data.phone || '+971-XX-XXX-XXXX';
    schema.email = data.email || 'INFO@YOUR-DOMAIN';
    
    // Update images
    if (data.heroImageUrl || data.logoUrl) {
      schema.image = [
        data.heroImageUrl || `https://${domain}/path/hero.jpg`,
        data.logoUrl || `https://${domain}/path/logo.png`
      ];
    }
    schema.logo = data.logoUrl || `https://${domain}/path/logo.png`;
    
    // Update address
    schema.address.streetAddress = data.street || 'STREET, BUILDING, UNIT';
    schema.address.addressLocality = data.city || 'CITY';
    schema.address.addressRegion = data.emirate || 'EMIRATE/REGION';
    schema.address.postalCode = data.postalCode || 'POSTCODE';
    schema.address.addressCountry = data.country;
    
    // Update geo coordinates
    if (data.latitude && data.longitude) {
      schema.geo.latitude = parseFloat(data.latitude);
      schema.geo.longitude = parseFloat(data.longitude);
      schema.hasMap = `https://maps.google.com/?q=${data.latitude},${data.longitude}`;
    }
    
    // Update social links
    const socialLinks = [];
    if (data.instagram) socialLinks.push(`https://www.instagram.com/${data.instagram}`);
    if (data.facebook) socialLinks.push(`https://www.facebook.com/${data.facebook}`);
    if (data.tiktok) socialLinks.push(`https://www.tiktok.com/@${data.tiktok}`);
    if (data.linkedin) socialLinks.push(`https://www.linkedin.com/company/${data.linkedin}`);
    
    if (socialLinks.length > 0) {
      schema.sameAs = socialLinks;
    }
    
    // Update services
    if (data.services.some(s => s.name)) {
      schema.makesOffer.itemListElement = data.services
        .filter(s => s.name)
        .map(service => ({
          "@type": "Offer",
          name: service.name,
          url: service.url || `https://${domain}/treatments/${service.name.toLowerCase().replace(/\s+/g, '-')}/`,
          priceCurrency: "AED",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: service.price || "0"
          },
          availability: "https://schema.org/InStock"
        }));
    }
    
    // Update area served
    if (data.areaServed) {
      schema.areaServed.name = data.areaServed;
    }
    
    // Update rating
    if (data.ratingValue || data.reviewCount) {
      schema.aggregateRating.ratingValue = data.ratingValue || '4.9';
      schema.aggregateRating.reviewCount = data.reviewCount || '187';
    }
    
    // Update opening hours
    schema.openingHoursSpecification = data.openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes
    }));
    
    // Update branches
    if (data.branches.length > 0) {
      schema["@graph"] = [
        {
          "@type": "Organization",
          "@id": `https://${domain}/#org`,
          name: data.businessName || 'YOUR BRAND',
          url: data.website || `https://${domain}/`,
          logo: data.logoUrl || `https://${domain}/logo.png`,
          sameAs: socialLinks.length > 0 ? socialLinks : [
            "https://www.instagram.com/YOUR",
            "https://www.linkedin.com/company/YOUR"
          ]
        },
        ...data.branches.map((branch, index) => ({
          "@type": "LocalBusiness",
          "@id": `https://${domain}/#branch-${branch.name.toLowerCase().replace(/\s+/g, '-') || index}`,
          branchOf: {
            "@id": `https://${domain}/#org`
          },
          name: branch.name || `${data.businessName} — Branch ${index + 1}`,
          url: branch.url || `https://${domain}/locations/branch-${index + 1}/`,
          telephone: branch.phone || '+971-XX-XXX-XXXX',
          address: {
            "@type": "PostalAddress",
            streetAddress: branch.street || 'ADDR',
            addressLocality: branch.city || 'City',
            addressRegion: branch.emirate || 'EM',
            postalCode: branch.postalCode || '00000',
            addressCountry: 'AE'
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: branch.latitude ? parseFloat(branch.latitude) : 'LAT',
            longitude: branch.longitude ? parseFloat(branch.longitude) : 'LNG'
          }
        }))
      ];
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
    a.download = 'local-schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Schema Generated!",
      description: "Your local-schema.json file has been downloaded successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            AHM Local Schema Generator
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Generate structured JSON-LD schemas for your business
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(getProgress())}%</span>
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
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={data.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                      placeholder="Your clinic name"
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
                    <Input
                      id="phone"
                      value={data.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+971-XX-XXX-XXXX"
                    />
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
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="location">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={data.street}
                    onChange={(e) => updateField('street', e.target.value)}
                    placeholder="Street, Building, Unit"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={data.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Dubai"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emirate">Emirate/Region</Label>
                    <Input
                      id="emirate"
                      value={data.emirate}
                      onChange={(e) => updateField('emirate', e.target.value)}
                      placeholder="Dubai"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={data.postalCode}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      placeholder="00000"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={data.latitude}
                      onChange={(e) => updateField('latitude', e.target.value)}
                      placeholder="25.2048"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={data.longitude}
                      onChange={(e) => updateField('longitude', e.target.value)}
                      placeholder="55.2708"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="areaServed">Area Served</Label>
                  <Input
                    id="areaServed"
                    value={data.areaServed}
                    onChange={(e) => updateField('areaServed', e.target.value)}
                    placeholder="Dubai"
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
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="hours">
            <div className="space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
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

              <Card className="shadow-elegant">
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
                          <Label>Price (AED)</Label>
                          <Input
                            value={service.price}
                            onChange={(e) => updateService(index, 'price', e.target.value)}
                            placeholder="900"
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
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
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
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="branches">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
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
                          placeholder="Dubai Branch"
                        />
                      </div>
                      <div>
                        <Label>Branch URL</Label>
                        <Input
                          value={branch.url}
                          onChange={(e) => updateBranch(index, 'url', e.target.value)}
                          placeholder="https://your-domain.com/locations/dubai/"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={branch.phone}
                        onChange={(e) => updateBranch(index, 'phone', e.target.value)}
                        placeholder="+971-XX-XXX-XXXX"
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
                          placeholder="Dubai"
                        />
                      </div>
                      <div>
                        <Label>Emirate</Label>
                        <Input
                          value={branch.emirate}
                          onChange={(e) => updateBranch(index, 'emirate', e.target.value)}
                          placeholder="DU"
                        />
                      </div>
                      <div>
                        <Label>Postal Code</Label>
                        <Input
                          value={branch.postalCode}
                          onChange={(e) => updateBranch(index, 'postalCode', e.target.value)}
                          placeholder="00000"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Latitude</Label>
                        <Input
                          value={branch.latitude}
                          onChange={(e) => updateBranch(index, 'latitude', e.target.value)}
                          placeholder="25.2048"
                        />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input
                          value={branch.longitude}
                          onChange={(e) => updateBranch(index, 'longitude', e.target.value)}
                          placeholder="55.2708"
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
                className="bg-gradient-primary hover:shadow-glow transition-smooth px-8 flex items-center gap-2"
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