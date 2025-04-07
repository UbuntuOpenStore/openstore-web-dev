import type { SlimAppData } from "@/lib/schema";
import TopRating from "./TopRating";
import AppTypeBadges from "./AppTypeBadges";

const AppList = ({ apps, messages }: { apps: SlimAppData[], messages: { new: string, app: string, bookmark: string, webapp: string } }) => {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {
        apps.map((app) => (
          <div class="flex flex-row gap-4 max-w-xl mb-4 p-4">
            <div>
              <a href={`/app/${app.id}`}>
                <img class="rounded-2xl" src={app.icon} alt={app.name} width="64" height="64" loading="eager" style={`view-transition-name: app-${app.id.replace(/\./g, '-')}`} />
              </a>
            </div>
            <div>
              <h1 class="text-lg">
                <a href={`/app/${app.id}`} class="underline">
                  {app.name}
                </a>
              </h1>

              <TopRating ratings={app.ratings} />

              <AppTypeBadges types={app.types} publishedDate={app.published_date} messages={messages} />
            </div>
          </div>
        ))
      }
    </div>
  )
};

export default AppList;
