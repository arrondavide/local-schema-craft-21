declare global {
  interface Window {
    google: typeof google;
    initAutocomplete: () => void;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: any);
    }
    
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: any);
        addListener(eventName: string, handler: () => void): void;
        getPlace(): PlaceResult;
      }
      
      class PlacesService {
        constructor(attrContainer: HTMLDivElement);
        getDetails(request: any, callback: (place: PlaceResult | null, status: PlacesServiceStatus) => void): void;
      }
      
      enum PlacesServiceStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        NOT_FOUND = 'NOT_FOUND',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR'
      }
      
      interface PlaceResult {
        place_id?: string;
        formatted_address?: string;
        name?: string;
        address_components?: AddressComponent[];
        geometry?: {
          location: LatLng;
          viewport?: any;
        };
        types?: string[];
      }
      
      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    namespace event {
      function clearInstanceListeners(instance: any): void;
    }
  }
}

export {};