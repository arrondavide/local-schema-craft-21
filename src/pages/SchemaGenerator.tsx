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
      const schema = buildSchema(entityType, locationType, formData);
      const cleaned = cleanSchema(schema);
      setGeneratedSchema(cleaned || {});
    }
  }, [formData, entityType, locationType]);

  const buildSchema = (entity: string, location: string, data: any): any => {
    const isPractitioner = entity === 'practitioner';
    const isMultiple = location === 'multiple';

    let schema: any = {
      "@context": "https://schema.org"
    };

    if (isPractitioner) {
      schema["@type"] = "Person";
      schema.name = data.name;
      schema.honorificSuffix = data.honorificSuffix;
      schema.jobTitle = data.jobTitle;
      schema.url = data.url;
      schema.telephone = data.telephone;
      schema.sameAs = data.sameAs;

      if (isMultiple) {
        // Multiple locations
        schema.worksFor = data.worksFor?.map((loc: any) => ({
          "@type": "MedicalClinic",
          name: loc.name,
          url: loc.url,
          telephone: loc.telephone,
          address: {
            "@type": "PostalAddress",
            streetAddress: loc.streetAddress,
            addressLocality: loc.city,
            addressRegion: loc.region,
            postalCode: loc.postalCode,
            addressCountry: loc.country
          },
          geo: loc.latitude && loc.longitude ? {
            "@type": "GeoCoordinates",
            latitude: loc.latitude,
            longitude: loc.longitude
          } : undefined,
          openingHoursSpecification: loc.openingHours?.map((h: any) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes
          })),
          availableService: loc.services?.map((s: string) => ({
            "@type": "MedicalProcedure",
            name: s
          }))
        }));
      } else {
        // Single location
        const loc = data.worksFor || {};
        schema.worksFor = {
          "@type": "MedicalClinic",
          name: loc.name,
          url: loc.url,
          telephone: loc.telephone,
          address: {
            "@type": "PostalAddress",
            streetAddress: loc.streetAddress,
            addressLocality: loc.city,
            addressRegion: loc.region,
            postalCode: loc.postalCode,
            addressCountry: loc.country
          },
          geo: loc.latitude && loc.longitude ? {
            "@type": "GeoCoordinates",
            latitude: loc.latitude,
            longitude: loc.longitude
          } : undefined,
          openingHoursSpecification: loc.openingHours?.map((h: any) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes
          })),
          availableService: loc.services?.map((s: string) => ({
            "@type": "MedicalProcedure",
            name: s
          }))
        };
      }

      schema.review = data.reviews?.map((r: any) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.ratingValue
        },
        author: {
          "@type": "Person",
          name: r.author
        }
      }));
    } else {
      // Clinic
      schema["@type"] = "MedicalClinic";
      schema.name = data.name;
      schema.url = data.url;
      schema.telephone = data.telephone;
      schema.email = data.email;
      schema.priceRange = data.priceRange;
      schema.logo = data.logo;
      schema.image = data.image;
      schema.cidLink = data.cidLink;
      schema.sameAs = data.sameAs;

      if (!isMultiple) {
        // Single clinic
        schema.address = {
          "@type": "PostalAddress",
          streetAddress: data.streetAddress,
          addressLocality: data.city,
          addressRegion: data.region,
          postalCode: data.postalCode,
          addressCountry: data.country
        };

        schema.geo = data.latitude && data.longitude ? {
          "@type": "GeoCoordinates",
          latitude: data.latitude,
          longitude: data.longitude
        } : undefined;

        schema.openingHoursSpecification = data.openingHours?.map((h: any) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes
        }));

        schema.availableService = data.services?.map((s: string) => ({
          "@type": "MedicalProcedure",
          name: s
        }));

        schema.review = data.reviews?.map((r: any) => ({
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.ratingValue
          },
          author: {
            "@type": "Person",
            name: r.author
          }
        }));

        schema.aggregateRating = data.ratingValue ? {
          "@type": "AggregateRating",
          ratingValue: data.ratingValue,
          reviewCount: data.reviewCount
        } : undefined;
      } else {
        // Multiple locations/departments
        schema.address = {
          "@type": "PostalAddress",
          streetAddress: data.streetAddress,
          addressLocality: data.city,
          addressRegion: data.region,
          postalCode: data.postalCode,
          addressCountry: data.country
        };

        schema.openingHoursSpecification = data.openingHours?.map((h: any) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes
        }));

        schema.department = data.departments?.map((dept: any) => ({
          "@type": "MedicalClinic",
          name: dept.name,
          url: dept.url,
          telephone: dept.telephone,
          address: {
            "@type": "PostalAddress",
            streetAddress: dept.streetAddress,
            addressLocality: dept.city,
            addressRegion: dept.region,
            postalCode: dept.postalCode,
            addressCountry: dept.country
          },
          geo: dept.latitude && dept.longitude ? {
            "@type": "GeoCoordinates",
            latitude: dept.latitude,
            longitude: dept.longitude
          } : undefined,
          openingHoursSpecification: dept.openingHours?.map((h: any) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes
          })),
          availableService: dept.services?.map((s: string) => ({
            "@type": "MedicalProcedure",
            name: s
          }))
        }));

        schema.review = data.reviews?.map((r: any) => ({
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.ratingValue
          },
          author: {
            "@type": "Person",
            name: r.author
          }
        }));

        schema.aggregateRating = data.ratingValue ? {
          "@type": "AggregateRating",
          ratingValue: data.ratingValue,
          reviewCount: data.reviewCount
        } : undefined;
      }
    }

    return schema;
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
