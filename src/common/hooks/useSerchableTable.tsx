import { useMemo, useState } from "react";

interface Props<T> {
  data: T[];
  filterFn: (item: T, searchInput: string) => boolean;
}

export function UseSearchableTable<T>({ data, filterFn }: Props<T>) {
  const [searchInput, setSearchInput] = useState("");

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
