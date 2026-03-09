import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useDebounce } from "../use-debounce/useDebounce";

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (debouncedSearch) {
      setSearchParams({ search: debouncedSearch }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedSearch, setSearchParams]);

  return { search, setSearch, debouncedSearch };
};
