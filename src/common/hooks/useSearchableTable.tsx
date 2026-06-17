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
      const next = new URLSearchParams(prev);

      if (value) {
        next.set("search", value);
      } else {
        next.delete("search");
      }
      next.set("page", "1");
      return next;
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


