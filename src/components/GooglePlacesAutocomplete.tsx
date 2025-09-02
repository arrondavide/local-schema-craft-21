import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { MapPin } from 'lucide-react';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: any) => void;
  placeholder?: string;
  label?: string;
  apiKey?: string;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address",
  label = "Address",
  apiKey
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
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

        window.initAutocomplete = () => {
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
        types: ['address'],
        componentRestrictions: { country: ['ae', 'sa', 'us', 'gb', 'ca', 'in', 'pk', 'eg', 'jo', 'kw', 'qa', 'bh', 'om'] }
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
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
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

export default GooglePlacesAutocomplete;