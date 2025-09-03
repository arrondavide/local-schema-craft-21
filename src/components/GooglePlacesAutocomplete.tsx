import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin } from 'lucide-react';

const GooglePlacesAutocomplete = ({ 
  value, 
  onChange, 
  onPlaceSelect, 
  placeholder = "Enter address", 
  label = "Address", 
  apiKey = 'AIzaSyB1SiZWgwVib7DCqkCHPFDySwewiOi4GgQ' 
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const lastProcessedPlaceId = useRef(null);

  // Always use hardcoded API key
  const HARDCODED_API_KEY = 'AIzaSyB1SiZWgwVib7DCqkCHPFDySwewiOi4GgQ';

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${HARDCODED_API_KEY}&libraries=places&callback=initAutocomplete`;
        script.async = true;
        script.defer = true;

        window.initAutocomplete = () => {
          setIsLoaded(true);
        };

        document.head.appendChild(script);
        script.onerror = () => setError('Failed to load Google Maps API');
      } catch (err) {
        setError('Error loading Google Maps API');
      }
    };

    loadGoogleMaps();
  }, []);

  // Enhanced place processing with retry logic
  const processPlaceWithRetry = (place, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 200;

    console.log(`Processing place (attempt ${retryCount + 1}):`, {
      place_id: place?.place_id,
      formatted_address: place?.formatted_address,
      hasComponents: !!place?.address_components,
      hasGeometry: !!place?.geometry,
      componentCount: place?.address_components?.length
    });

    // Check if we have complete data
    const hasCompleteData = place && 
      place.place_id && 
      place.formatted_address && 
      place.address_components && 
      place.address_components.length > 0 && 
      place.geometry &&
      place.geometry.location;

    if (hasCompleteData) {
      // Avoid processing the same place multiple times
      if (lastProcessedPlaceId.current === place.place_id) {
        console.log('Place already processed, skipping');
        return;
      }
      
      lastProcessedPlaceId.current = place.place_id;
      console.log('Complete place data found, processing...');
      onChange(place.formatted_address);
      onPlaceSelect(place);
      return;
    }

    // If incomplete data and we haven't exceeded retry limit
    if (retryCount < MAX_RETRIES) {
      console.log(`Incomplete data, retrying in ${RETRY_DELAY}ms...`);
      setTimeout(() => {
        const freshPlace = autocompleteRef.current?.getPlace();
        if (freshPlace && freshPlace.place_id === place?.place_id) {
          processPlaceWithRetry(freshPlace, retryCount + 1);
        }
      }, RETRY_DELAY * (retryCount + 1)); // Increasing delay
      return;
    }

    // Fallback: use Places Details API for more complete data
    if (place?.place_id && window.google?.maps?.places?.PlacesService) {
      console.log('Using Places Details API as fallback...');
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      service.getDetails({
        placeId: place.place_id,
        fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id']
      }, (detailedPlace, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && detailedPlace) {
          console.log('Got detailed place data:', detailedPlace);
          lastProcessedPlaceId.current = detailedPlace.place_id;
          onChange(detailedPlace.formatted_address);
          onPlaceSelect(detailedPlace);
        } else {
          console.log('Places Details API failed, using partial data');
          if (place?.formatted_address) {
            onChange(place.formatted_address);
          }
        }
      });
      return;
    }

    // Final fallback: use whatever data we have
    console.log('Using partial place data');
    if (place?.formatted_address) {
      onChange(place.formatted_address);
      if (place.address_components || place.geometry) {
        onPlaceSelect(place);
      }
    }
  };

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id']
      });

      // Main place_changed listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        console.log('place_changed event fired:', place);
        
        if (place) {
          processPlaceWithRetry(place);
        }
      });

      // Additional listeners for better coverage
      const handleManualSelection = () => {
        setTimeout(() => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.place_id !== lastProcessedPlaceId.current) {
            console.log('Manual selection detected:', place);
            processPlaceWithRetry(place);
          }
        }, 100);
      };

      // Listen for Enter key
      inputRef.current.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          setTimeout(handleManualSelection, 200);
        }
      });

      // Listen for blur (when user clicks away)
      inputRef.current.addEventListener('blur', () => {
        setTimeout(handleManualSelection, 100);
      });

    } catch (err) {
      setError('Error initializing autocomplete');
      console.error('Autocomplete initialization error:', err);
    }

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, onPlaceSelect]);

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
