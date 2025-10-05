import { useNavigate } from 'react-router-dom';
import { useSchema } from '@/context/SchemaContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2, MapPin, Building } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { setSchemaType } = useSchema();

  const handleSelection = (entity: 'practitioner' | 'clinic', location: 'single' | 'multiple') => {
    setSchemaType(entity, location);
    navigate('/schema-generator');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Local Schema Generator</h1>
          <p className="text-lg text-muted-foreground">
            Create valid JSON-LD schema markup for medical practitioners and clinics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Practitioner Schemas */}
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Practitioner Schema</CardTitle>
              </div>
              <CardDescription>
                Create schema for individual doctors, dentists, or medical professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSelection('practitioner', 'single')}
                className="w-full justify-start"
                variant="outline"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Single Location
              </Button>
              <Button
                onClick={() => handleSelection('practitioner', 'multiple')}
                className="w-full justify-start"
                variant="outline"
              >
                <Building className="h-4 w-4 mr-2" />
                Multiple Locations
              </Button>
            </CardContent>
          </Card>

          {/* Medical Clinic Schemas */}
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Medical Clinic Schema</CardTitle>
              </div>
              <CardDescription>
                Create schema for clinics, hospitals, or medical facilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSelection('clinic', 'single')}
                className="w-full justify-start"
                variant="outline"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Single Location
              </Button>
              <Button
                onClick={() => handleSelection('clinic', 'multiple')}
                className="w-full justify-start"
                variant="outline"
              >
                <Building className="h-4 w-4 mr-2" />
                Multiple Locations
              </Button>
            </CardContent>
          </Card>
        </div>

       
      </div>
    </div>
  );
};

export default Index;
