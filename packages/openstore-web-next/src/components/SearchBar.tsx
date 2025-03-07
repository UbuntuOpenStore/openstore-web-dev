import { useStore } from '@nanostores/preact';
import { searchTerm } from '@/stores';
import SvgSearch from './icons/Search';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'preact/hooks';

const SearchBar = () => {
  const term = useStore(searchTerm);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      const hash = new URLSearchParams(document.location.hash.substring(1));
      if (hash.get('search')) {
        searchTerm.set(hash.get('search')!);
      }

      setInitialized(true);
    }
  }, [initialized]);

  const debounceSetTerm = useDebouncedCallback((value: string) => {
    searchTerm.set(value);

    if (!document.location.pathname.startsWith('/apps/')) {
      const updateHash = new URLSearchParams();
      updateHash.append('search', value);

      document.location.replace(`/apps/#${updateHash.toString()}`)
    }
  }, 300);

  return (
    <div class="relative max-w-sm w-full h-full">
      <input
        type="text"
        placeholder="Search..."
        aria-label="Search"
        class="w-full h-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={term}
        onInput={(e) => debounceSetTerm(e.currentTarget.value)}
      />

      <SvgSearch class="h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
    </div>
  );
};

export default SearchBar;
