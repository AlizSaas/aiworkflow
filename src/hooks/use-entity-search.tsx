import { PAGINATION } from "@/config/constants";
import { useState, useEffect } from "react";

interface EntitySearchProps<T
extends { search: string; page: number }



> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: EntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if(localSearch === '' && params.search !== '') {
        setParams({ ...params, search: '', page: PAGINATION.DEFAULT_PAGE });
        return 
    }

    const timer = setTimeout(() => {
        if(localSearch !== params.search) {
            setParams({ ...params, search: localSearch, page: PAGINATION.DEFAULT_PAGE });
        }

    },
    debounceMs


)

return () => clearTimeout(timer)


  },[ localSearch, debounceMs, params, setParams])

  useEffect(() => {
    setLocalSearch(params.search)
  },[params.search]) // sync local search with params search

return {
    searchValue: localSearch,
    onSearcheValue: setLocalSearch
}
}