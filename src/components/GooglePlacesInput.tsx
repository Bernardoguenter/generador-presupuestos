import { useState, useCallback, type FormEvent, useEffect } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAutocompleteSuggestions } from "../common/hooks";
import { TextInputWithCloseIcon } from "./TextInputWithCloseIcon";
import { useFormContext, useWatch } from "react-hook-form";

interface Props {
  name: string;
  label: string;
}

export const GooglePlacesInput = ({ name, label }: Props) => {
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
      language="es">
      <PlaceAutocomplete
        name={name}
        label={label}
      />
    </APIProvider>
  );
};

interface PlaceAutocompleteProps {
  name: string;
  label: string;
}

const PlaceAutocomplete = ({ name, label }: PlaceAutocompleteProps) => {
  const places = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState<string>("");
  const [hasTyped, setHasTyped] = useState(false);

  const { suggestions, resetSession } = useAutocompleteSuggestions(inputValue);
  const { setValue, control } = useFormContext();

  const watchedValue = useWatch({ name, control });

  useEffect(() => {
    if (watchedValue && inputValue === "") {
      setInputValue(watchedValue);
    }
  }, [watchedValue]);

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
    setHasTyped(true);
  }, []);

  const handleCleanInput = useCallback(() => {
    setInputValue("");
    setHasTyped(false);

    /* setSelectedPlace(null); */
  }, []);

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places || !suggestion.placePrediction) return;
      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({
        fields: ["location", "formattedAddress", "displayName"],
      });
      resetSession();

      const fullAddress = place.formattedAddress || place.displayName;

      setValue(name, place.formattedAddress);
      setValue("lng", place.location?.lng());
      setValue("lat", place.location?.lat());
      setInputValue(fullAddress ?? "");
    },
    [places, setValue, resetSession, name]
  );

  return (
    <div className="relative">
      <TextInputWithCloseIcon
        containerStyles="w-full"
        name={name}
        label={label}
        value={inputValue}
        onChange={handleInput}
        onCloseIcon={handleCleanInput}
        placeholder="Ingresa una localidad"
      />

      {hasTyped && suggestions.length > 0 && (
        <ul className="absolute bg-white z-10 mt-1 shadow-md w-full border rounded">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-black"
              onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.placePrediction?.text?.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
