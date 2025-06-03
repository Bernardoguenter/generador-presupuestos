import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

export type UseAutocompleteSuggestionsReturn = {
  suggestions: google.maps.places.AutocompleteSuggestion[];
  isLoading: boolean;
  resetSession: () => void;
};

export function useAutocompleteSuggestions(
  inputString: string,
  requestOptions: Partial<google.maps.places.AutocompleteRequest> = {}
): UseAutocompleteSuggestionsReturn {
  const placesLib = useMapsLibrary("places");

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const ignoreInputChangeRef = useRef(false);

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState(inputString);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(inputString);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputString]);

  useEffect(() => {
    if (!placesLib) return;

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;

    if (ignoreInputChangeRef.current) {
      ignoreInputChangeRef.current = false;
      return;
    }

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    if (debouncedInput === "") {
      if (suggestions.length > 0) setSuggestions([]);
      return;
    }

    const request: google.maps.places.AutocompleteRequest = {
      ...requestOptions,
      input: debouncedInput,
      sessionToken: sessionTokenRef.current,
      language: "es-AR",
      region: "ar",
      includedRegionCodes: ["ar"],
    };

    setIsLoading(true);
    AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
      .then((res) => {
        setSuggestions(res.suggestions);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [placesLib, debouncedInput]);

  return {
    suggestions,
    isLoading,
    resetSession: () => {
      sessionTokenRef.current = null;
      setSuggestions([]);
      ignoreInputChangeRef.current = true;
    },
  };
}
