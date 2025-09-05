import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Provider {
  name: string;
  url: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  telephone: string;
}

const ServiceSchemaForm = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Service basic info
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [areaServed, setAreaServed] = useState('');
  
  // Offer details
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [validFrom, setValidFrom] = useState('');
  
  // Providers
  const [providers, setProviders] = useState<Provider[]>([{
    name: '',
    url: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'AE',
    telephone: ''
  }]);

  const addProvider = () => {
    setProviders([...providers, {
      name: '',
      url: '',
      streetAddress: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'AE',
      telephone: ''
    }]);
  };

  const removeProvider = (index: number) => {
    if (providers.length > 1) {
      setProviders(providers.filter((_, i) => i !== index));
    }
  };

  const updateProvider = (index: number, field: keyof Provider, value: string) => {
    const newProviders = [...providers];
    newProviders[index][field] = value;
    setProviders(newProviders);
  };

  const generateSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceName,
      "description": description,
      "provider": providers.map(provider => ({
        "@type": "MedicalBusiness",
        "name": provider.name,
        "url": provider.url,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": provider.streetAddress,
          "addressLocality": provider.city,
          "addressRegion": provider.region,
          "postalCode": provider.postalCode,
          "addressCountry": provider.country
        },
        "telephone": provider.telephone
      })),
      "areaServed": {
        "@type": "City",
        "name": areaServed
      },
      "serviceType": serviceType,
      "url": serviceUrl,
      "offers": {
        "@type": "Offer",
        "url": serviceUrl,
        "priceCurrency": currency,
        "price": price,
        "availability": "https://schema.org/InStock",
        "validFrom": validFrom
      }
    };

    return JSON.stringify(schema, null, 2);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateSchema());
      setCopied(true);
      toast({
        title: "Success!",
        description: "Service schema copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                  id="serviceName"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Enzyme Peel & Firming Peptide Mask"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your service..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input
                    id="serviceType"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    placeholder="e.g., Facial Treatment"
                  />
                </div>

                <div>
                  <Label htmlFor="serviceUrl">Service URL</Label>
                  <Input
                    id="serviceUrl"
                    value={serviceUrl}
                    onChange={(e) => setServiceUrl(e.target.value)}
                    placeholder="https://example.com/services/..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="areaServed">Area Served *</Label>
                <Input
                  id="areaServed"
                  value={areaServed}
                  onChange={(e) => setAreaServed(e.target.value)}
                  placeholder="e.g., Dubai"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="100.00"
                    type="number"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Input
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="AED"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="validFrom">Valid From Date</Label>
                <Input
                  id="validFrom"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  type="date"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Service Providers</CardTitle>
                <Button onClick={addProvider} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {providers.map((provider, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Provider {index + 1}</h4>
                    {providers.length > 1 && (
                      <Button
                        onClick={() => removeProvider(index)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Business Name *</Label>
                      <Input
                        value={provider.name}
                        onChange={(e) => updateProvider(index, 'name', e.target.value)}
                        placeholder="e.g., Clinic Downtown"
                      />
                    </div>

                    <div>
                      <Label>Business URL</Label>
                      <Input
                        value={provider.url}
                        onChange={(e) => updateProvider(index, 'url', e.target.value)}
                        placeholder="https://example.com/locations/..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Street Address *</Label>
                    <Input
                      value={provider.streetAddress}
                      onChange={(e) => updateProvider(index, 'streetAddress', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>City *</Label>
                      <Input
                        value={provider.city}
                        onChange={(e) => updateProvider(index, 'city', e.target.value)}
                        placeholder="Dubai"
                      />
                    </div>

                    <div>
                      <Label>Region *</Label>
                      <Input
                        value={provider.region}
                        onChange={(e) => updateProvider(index, 'region', e.target.value)}
                        placeholder="Dubai"
                      />
                    </div>

                    <div>
                      <Label>Postal Code</Label>
                      <Input
                        value={provider.postalCode}
                        onChange={(e) => updateProvider(index, 'postalCode', e.target.value)}
                        placeholder="00000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Country Code *</Label>
                      <Input
                        value={provider.country}
                        onChange={(e) => updateProvider(index, 'country', e.target.value)}
                        placeholder="AE"
                      />
                    </div>

                    <div>
                      <Label>Phone Number *</Label>
                      <Input
                        value={provider.telephone}
                        onChange={(e) => updateProvider(index, 'telephone', e.target.value)}
                        placeholder="+971-123-456789"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Service Schema</CardTitle>
                <Button onClick={copyToClipboard} size="sm" variant="outline">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[600px]">
                {generateSchema()}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. Fill out the service information and pricing details</p>
              <p>2. Add all locations/providers that offer this service</p>
              <p>3. Copy the generated JSON-LD schema</p>
              <p>4. Add it to your website's &lt;head&gt; section within &lt;script type="application/ld+json"&gt; tags</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceSchemaForm;