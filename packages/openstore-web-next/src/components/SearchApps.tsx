import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import AppList from "./AppList";
import { AppSearchSchema, AppType, type SlimAppData } from "@/lib/schema";
import Pagination from "./Pagination";
import SvgSpinner from "./icons/Spinner";
import { useStore } from "@nanostores/preact";
import { searchTerm } from "@/stores";
import FilterDialog from "./FilterDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import * as Sentry from "@sentry/astro";

const PAGE_SIZE = 32;
const DEFAULT_SORT = '-published_date';
const DEFAULT_TYPE = '';
const DEFAULT_CHANNEL = 'focal';

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "-calculated_rating", label: "Most Popular" },
  { value: "calculated_rating", label: "Least Popular" },
  { value: "name", label: "Title (A-Z)" },
  { value: "-name", label: "Title (Z-A)" },
  { value: "-published_date", label: "Newest" },
  { value: "published_date", label: "Oldest" },
  { value: "-updated_date", label: "Latest Update" },
  { value: "updated_date", label: "Oldest Update" },
];

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
      console.error(err);
      Sentry.captureException(err);

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

  const setSort = useCallback((value: string) => {
    setQuery((previous) => ({ ...previous, sort: value}));
  }, []);

  const setType = useCallback((value: AppType | '') => {
    setQuery((previous) => ({ ...previous, type: value}));
  }, []);

  return (
    <div class="h-full space-y-4 mb-4">
      <div class="flex justify-between flex-col md:flex-row">
        <div class="flex mx-4">
          <h1 class="text-4xl">
            Search{" "}

            {query.type === AppType.APP && (<>Apps</>)}
            {query.type === AppType.BOOKMARK && (<>Bookmarks</>)}
            {query.type === AppType.WEBAPP && (<>Web Apps</>)}

            {categoryName && (
              <>{" "}in {categoryName}</>
            )}
          </h1>

          <FilterDialog type={query.type as AppType | ''} onChange={setType} />
        </div>

        <div class="mx-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Sort by: {SORT_OPTIONS.find((option) => option.value === query.sort)!.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4">
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => setSort(option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
