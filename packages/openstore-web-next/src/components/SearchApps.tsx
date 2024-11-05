import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import AppList from "./AppList";
import { AppSearchSchema, type SlimAppData } from "@/lib/schema";
import Pagination from "./Pagination";
import SvgSpinner from "./icons/Spinner";
import { useStore } from "@nanostores/preact";
import { searchTerm } from "@/stores";

const PAGE_SIZE = 32;
const DEFAULT_SORT = '-published_date';
const DEFAULT_TYPE = '';
const DEFAULT_CHANNEL = 'focal';

type Props = {
  category?: string;
  categoryName?: string;
};

const SearchApps = ({ category, categoryName }: Props) => {
  const hash = new URLSearchParams(document.location.hash.substring(1));
  const hashPage = parseInt(hash.get('page') ?? '0');

  const term = useStore(searchTerm);
  const [page, setPage] = useState(isNaN(hashPage) ? 0 : hashPage);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState({
    search: '',
    sort: hash.get('sort') ?? DEFAULT_SORT,
    type: hash.get('type') ?? DEFAULT_TYPE,
    channel: hash.get('channel') ?? DEFAULT_CHANNEL,
  });
  const [apps, setApps] = useState<SlimAppData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Update the query when the term changes

    if (term != query.search) {
      setQuery((previous) => ({
        ...previous,
        sort: term === '' ? DEFAULT_SORT : 'relevance',
        search: term,
      }));
      setPage(0);
    }
  }, [term, query]);

  useMemo(async () => {
    setLoading(true);

    const skip = page * PAGE_SIZE;
    const url = new URL(`${import.meta.env.SITE}api/v4/apps`);
    url.searchParams.append('limit', PAGE_SIZE.toString());
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('search', term);
    url.searchParams.append('sort', query.sort);
    url.searchParams.append('type', query.type);
    url.searchParams.append('category', category ?? '');
    url.searchParams.append('channel', query.channel);

    const updateHash = new URLSearchParams();
    if (term) {
      updateHash.append('search', term);
    }
    if (query.sort !== DEFAULT_SORT) {
      updateHash.append('sort', query.sort);
    }
    if (query.type !== DEFAULT_TYPE) {
      updateHash.append('type', query.type);
    }
    if (category) {
      updateHash.append('category', category);
    }
    if (query.channel !== DEFAULT_CHANNEL) {
      updateHash.append('channel', query.channel);
    }
    if (page > 0) {
      updateHash.append('page', page.toString());
    }

    document.location.hash = updateHash.size > 0 ? `#${updateHash.toString()}` : '';

    try {
      const response = await fetch(url);
      const { data } = await response.json();
      const search = AppSearchSchema.parse(data);

      setApps(search.packages);
      setTotalPages(Math.ceil(data.count / PAGE_SIZE) - 1);
    }
    catch (err) {
      // TODO sentry
      setError(true);
    }

    setLoading(false);
  }, [query, page]);

  const setPageWrapper = useCallback((update: number) => {
    if (update < 0) {
      update = 0;
    }

    setPage(update);
  }, []);

  return (
    <div class="h-full space-y-4">
      <h1 class="text-4xl">Search {categoryName ?? 'Apps'}</h1>

      {/* TODO filtering */}

      {error ? (
        <div class="h-full text-2xl text-red">
          There was an error loading the app list. Please try again later.
        </div>
      ) : (
        <>
          {loading ? (
            <div class="h-full">
              <SvgSpinner class="animate-spin w-12 h-12 text-ubuntu-purple mx-auto" />
            </div>
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
                <div class="h-full text-2xl">
                  No apps found
                </div>
              )}
            </>
          )}
        </>
      )}

    </div>
  );
};

export default SearchApps;
