import { useCallback, useMemo, useState } from "preact/hooks";
import AppList from "./AppList";
import { AppSearchSchema, type SlimAppData } from "@/lib/schema";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "./Pagination";

const PAGE_SIZE = 32;
const DEFAULT_SORT = '-published_date';
const DEFAULT_TYPE = '';
const DEFAULT_CHANNEL = 'focal';

type Props = {
  category?: string;
  categoryName?: string;
};

const SearchApps = ({ category, categoryName }: Props) => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState({
    // TODO load state from url for default
    search: '',
    sort: DEFAULT_SORT,
    type: DEFAULT_TYPE,
    channel: DEFAULT_CHANNEL,
  });
  const [apps, setApps] = useState<SlimAppData[]>([]);
  const [loading, setLoading] = useState(false);

  useMemo(async () => {
    setLoading(true);
    // TODO state in url

    // TODO error handling
    const skip = page * PAGE_SIZE;
    const url = new URL(`${import.meta.env.SITE}api/v4/apps`);
    url.searchParams.append('limit', PAGE_SIZE.toString());
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('search', query.search);
    url.searchParams.append('sort', query.sort);
    url.searchParams.append('type', query.type);
    url.searchParams.append('category', category ?? '');
    url.searchParams.append('channel', query.channel);

    const response = await fetch(url);
    const { data } = await response.json();
    const search = AppSearchSchema.parse(data);

    setApps(search.packages);
    setTotalPages(Math.ceil(data.count / PAGE_SIZE) - 1);
    setLoading(false);
  }, [query, page]);

  const debounceSetTerm = useDebouncedCallback((search: string) => {
    setQuery((previous) => ({
      ...previous,
      sort: 'relevance',
      search,
    }));
    setPage(0);
  }, 300);

  const setPageWrapper = useCallback((update: number) => {
    if (update < 0) {
      update = 0;
    }

    setPage(update);
  }, []);

  return (
    <div class="h-full space-y-4">
      <h1 class="text-4xl">Search {categoryName ?? 'Apps'}</h1>

      <input value={query.search} onInput={(e) => debounceSetTerm(e.currentTarget.value)} placeholder="Search" class="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-xl placeholder:text-gray-400 sm:text-sm max-w-xs" />
      {/* TODO filtering */}

      {loading ? (
        <div class="h-full">TODO loading...</div>
      ) : (
        <>
          {apps.length > 0 ? (
            <>
              <AppList apps={apps} />

              {totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChanged={(p) => setPageWrapper(p)} />
              )}
            </>
          ) : (
            <div class="h-full">TODO no apps...</div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchApps;
