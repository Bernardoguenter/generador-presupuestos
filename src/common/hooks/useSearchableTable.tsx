import { useMemo } from "react";
import { useSearchParams } from "react-router";

interface Props<T> {
  data: T[];
  filterFn: (item: T, searchInput: string) => boolean;
}

export function useSearchableTable<T>({ data, filterFn }: Props<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchInput = searchParams.get("search") || "";

  const setSearchInput = (value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      prev.set("page", "1");
      return prev;
    }, { replace: true, viewTransition: true });
  };

  const filteredData = useMemo(() => {
    if (!searchInput) return data;
    return data.filter((item) => filterFn(item, searchInput));
  }, [searchInput, data, filterFn]);

  return {
    searchInput,
    setSearchInput,
    filteredData,
  };
}


