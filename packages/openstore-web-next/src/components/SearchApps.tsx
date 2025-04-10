import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import AppList from "./apps/AppList";
import { AppSearchSchema, AppType, type SlimAppData } from "@/lib/schema";
import Pagination from "./Pagination";
import SvgSpinner from "./icons/Spinner";
import { useStore } from "@nanostores/preact";
import { searchTerm, searchTermInitialized } from "@/stores";
import FilterDialog from "./FilterDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import * as Sentry from "@sentry/astro";
import { localeSlugToCode } from "@/lib/utils";

const PAGE_SIZE = 32;
const DEFAULT_SORT = '-published_date';
const DEFAULT_TYPE = '';
const DEFAULT_CHANNEL = 'focal';

type Props = {
  category?: string;
  categoryName?: string;
  messages: {
    all: string,
    app: string,
    apps: string,
    bookmark: string,
    bookmarks: string,
    webapp: string,
    webapps: string,
    filter: string,
    showNsfwFilter: string,
    new: string,
    notFound: string,
    previous: string,
    next: string,
    error: string,
    search: string,
    sortBy: string,
    sortOptions: string,
    options: {
      relevance: string,
      "-calculated_rating": string,
      calculated_rating: string,
      name: string,
      "-name": string,
      "-published_date": string,
      published_date: string,
      "-updated_date": string,
      updated_date: string,
    }
  },
  currentLocale: string | undefined,
};

const SearchApps = ({ category, categoryName, messages, currentLocale }: Props) => {
  const SORT_OPTIONS = [
  { value: "relevance", label: messages.options.relevance },
  { value: "-calculated_rating", label: messages.options['-calculated_rating'] },
  { value: "calculated_rating", label: messages.options.calculated_rating },
  { value: "name", label: messages.options.name },
  { value: "-name", label: messages.options["-name"] },
  { value: "-published_date", label: messages.options["-published_date"] },
  { value: "published_date", label: messages.options.published_date },
  { value: "-updated_date", label: messages.options["-updated_date"] },
  { value: "updated_date", label: messages.options.updated_date },
];

  const hash = new URLSearchParams(document.location.hash.substring(1));
  const hashPage = parseInt(hash.get('page') ?? '0');

  const storeTerm = useStore(searchTerm);
  const initialized = useStore(searchTermInitialized);

  const [page, setPage] = useState(isNaN(hashPage) ? 0 : hashPage);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState({
    // Get from the hash as a backup so we don't overwrite the hash before it gets stored in SearchBar.tsx
    search: storeTerm || hash.get('search') || '',
    sort: hash.get('sort') ?? DEFAULT_SORT,
    type: hash.get('type') ?? DEFAULT_TYPE,
    channel: hash.get('channel') ?? DEFAULT_CHANNEL,
    showNsfw: hash.get('nsfw') === 'true' ? true : undefined,
  });
  const [apps, setApps] = useState<SlimAppData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // We only want to do this after it has been initialized, otherwise we get 2 updates, one with and one without the search term
    if (initialized) {
      // Update the query when the term changes
      if (storeTerm != query.search) {
        setQuery((previous) => ({
          ...previous,
          sort: storeTerm === '' ? DEFAULT_SORT : 'relevance',
          search: storeTerm,
        }));
        setPage(0);
      }
    }
  }, [storeTerm, initialized, query.search]);

  useMemo(async () => {
    setLoading(true);

    const skip = page * PAGE_SIZE;
    const url = new URL(`${import.meta.env.PUBLIC_API_URL}api/v4/apps?lang=${localeSlugToCode(currentLocale)}`);
    url.searchParams.append('limit', PAGE_SIZE.toString());
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('search', query.search);
    url.searchParams.append('sort', query.sort);
    url.searchParams.append('type', query.type);
    url.searchParams.append('category', category ?? '');
    url.searchParams.append('channel', query.channel);
    url.searchParams.append('nsfw', query.showNsfw ? '' : 'false');

    const updateHash = new URLSearchParams();
    if (query.search) {
      updateHash.append('search', query.search);
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
    if (query.showNsfw) {
      updateHash.append('nsfw', 'true');
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

  const setFilters = useCallback((value: AppType | '', showNsfw: boolean) => {
    setQuery((previous) => ({ ...previous, type: value, showNsfw: showNsfw ? true : undefined }));
  }, []);

  return (
    <div class="h-full space-y-4 mb-4">
      <div class="flex justify-between flex-col md:flex-row">
        <div class="flex mx-4">
          <h1 class="text-4xl">
            {messages.search}{" "}

            {query.type === AppType.APP && (<>{messages.apps}</>)}
            {query.type === AppType.BOOKMARK && (<>{messages.bookmarks}</>)}
            {query.type === AppType.WEBAPP && (<>{messages.webapps}</>)}

            {categoryName && (
              <>{" "}- {categoryName}</>
            )}
          </h1>

          <FilterDialog
            type={query.type as AppType | ''}
            showNsfw={!!query.showNsfw}
            onChange={setFilters}
            messages={messages}
          />
        </div>

        <div class="mx-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                {messages.sortBy} {SORT_OPTIONS.find((option) => option.value === query.sort)!.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4">
              <DropdownMenuLabel>{messages.sortOptions}</DropdownMenuLabel>
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
          {messages.error}
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
                  <AppList
                    apps={apps}
                    currentLocale={currentLocale}
                    messages={messages}
                  />

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChanged={(p) => setPageWrapper(p)}
                      messages={messages}
                    />
                  )}
                </>
              ) : (
                <div class="h-full text-2xl">
                  {messages.notFound}
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
