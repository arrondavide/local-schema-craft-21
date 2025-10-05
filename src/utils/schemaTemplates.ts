export const getSchemaTemplate = (entityType: string, locationType: string) => {
  const templates: Record<string, any> = {
    'practitioner-single': {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "",
      "honorificSuffix": "",
      "jobTitle": "",
      "url": "",
      "telephone": "",
      "sameAs": [],
      "worksFor": {
        "@type": "MedicalClinic",
        "name": "",
        "url": "",
        "telephone": "",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "",
          "addressLocality": "",
          "addressRegion": "",
          "postalCode": "",
          "addressCountry": ""
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "",
          "longitude": ""
        },
        "openingHoursSpecification": [],
        "availableService": []
      },
      "review": []
    },
    'practitioner-multiple': {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "",
      "honorificSuffix": "",
      "jobTitle": "",
      "url": "",
      "telephone": "",
      "sameAs": [],
      "worksFor": [],
      "review": []
    },
    'clinic-single': {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "",
      "url": "",
      "telephone": "",
      "email": "",
      "sameAs": [],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "",
        "addressLocality": "",
        "addressRegion": "",
        "postalCode": "",
        "addressCountry": ""
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "",
        "longitude": ""
      },
      "openingHoursSpecification": [],
      "availableService": [],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "",
        "reviewCount": ""
      }
    },
    'clinic-multiple': {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "",
      "url": "",
      "telephone": "",
      "email": "",
      "sameAs": [],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "",
        "addressLocality": "",
        "addressRegion": "",
        "postalCode": "",
        "addressCountry": ""
      },
      "openingHoursSpecification": [],
      "department": [],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "",
        "reviewCount": ""
      }
    }
  };

  return templates[`${entityType}-${locationType}`] || templates['clinic-single'];
};

export const cleanSchema = (schema: any): any => {
  if (Array.isArray(schema)) {
    const filtered = schema.map(cleanSchema).filter(item => {
      if (typeof item === 'string') return item.trim() !== '';
      if (typeof item === 'object') return Object.keys(item).length > 0;
      return item !== null && item !== undefined;
    });
    return filtered.length > 0 ? filtered : undefined;
  }

  if (schema && typeof schema === 'object') {
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(schema)) {
      if (value === null || value === undefined || value === '') {
        continue;
      }

      if (Array.isArray(value)) {
        const cleanedArray = cleanSchema(value);
        if (cleanedArray && cleanedArray.length > 0) {
          cleaned[key] = cleanedArray;
        }
      } else if (typeof value === 'object') {
        const cleanedObj = cleanSchema(value);
        if (cleanedObj && Object.keys(cleanedObj).length > 0) {
          cleaned[key] = cleanedObj;
        }
      } else if (typeof value === 'string' && value.trim() !== '') {
        cleaned[key] = value;
      } else if (typeof value !== 'string') {
        cleaned[key] = value;
      }
    }

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  return schema;
};
