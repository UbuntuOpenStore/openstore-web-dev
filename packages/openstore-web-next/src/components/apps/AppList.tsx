import type { SlimAppData } from "@/lib/schema";
import TopRating from "./TopRating";
import AppTypeBadges from "./AppTypeBadges";
import { getRelativeLocaleUrl } from "@/lib/utils";

const AppList = ({ apps, messages, currentLocale }: { apps: SlimAppData[], currentLocale: string | undefined, messages: { new: string, app: string, bookmark: string, webapp: string } }) => {
  return (
    <div class="grid grid-cols-2 md:grid-cols-4">
      {
        apps.map((app) => (
          <a href={getRelativeLocaleUrl(currentLocale, `/app/${app.id}/`)} class="flex flex-row gap-4 max-w-xl mb-4 py-2 px-1 md:p-4" data-astro-prefetch>
            <img
              class="rounded-2xl max-w-[64px] max-h-[64px]"
              src={app.icon}
              alt={app.name}
              width="64"
              height="64"
              loading="eager"
              style={`view-transition-name: app-${app.id.replace(/\./g, '-')}`}
            />
            <div>
              <div class="text-md md:text-lg text-ellipsis line-clamp-2 font-bold">
                {app.name}
              </div>

              <TopRating ratings={app.ratings} />

              <AppTypeBadges types={app.types} publishedDate={app.published_date} messages={messages} />
            </div>
          </a>
        ))
      }
    </div>
  )
};

export default AppList;
