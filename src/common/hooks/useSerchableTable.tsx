import { useEffect, useMemo, useState } from "react";
import { FormWatch, TextInput } from "../../components";

interface Props<T> {
  dataToFilter: T[];
  fieldsToSearch: string[];
  onFilteredData: (filtered: T[]) => void;
}

export function UseSearchableTable<T>({
  dataToFilter,
  fieldsToSearch,
  onFilteredData,
}: Props<T>) {
  const [searchText, setSearchText] = useState<string>("");

  // Solo se crea una vez, evitando el error de React Hook Form
  const defaultValues = useMemo(() => ({ search: "" }), []);

  useEffect(() => {
    if (!dataToFilter || dataToFilter.length === 0) {
      onFilteredData([]);
      return;
    }

    const term = searchText.trim().toLowerCase();

    if (term === "") {
      onFilteredData(dataToFilter);
      return;
    }

    const filtered = dataToFilter.filter((item) =>
      fieldsToSearch.some((field) => {
        const value = (item as Record<string, unknown>)[field];
        return typeof value === "string" && value.toLowerCase().includes(term);
      })
    );

    onFilteredData(filtered);
  }, [searchText, dataToFilter, fieldsToSearch, onFilteredData]);

  return (
    <FormWatch
      defaultValues={defaultValues}
      onWatch={(values: Record<string, string>) =>
        setSearchText(values.search || "")
      }>
      <TextInput
        label="Buscar..."
        name="search"
      />
    </FormWatch>
  );
}
