import type { AppData } from "@/schema";
import TopRating from "./TopRating";

const AppList = ({ apps }: { apps: AppData[] }) => {
  return (
    <div class="grid grid-cols-4">
      {
        apps.map((app) => (
          <div class="flex flex-row gap-4 max-w-xl mb-4 p-4">
            <div>
              <a href={`/app/${app.id}`}>
                <img class="rounded-2xl" src={app.icon} alt={app.name} width="64" height="64" loading="eager" />
              </a>
            </div>
            <div>
              <h1 class="text-lg">
                <a href={`/app/${app.id}`} class="underline">
                  {app.name}
                </a>
              </h1>

              <TopRating ratings={app.ratings} />
            </div>
          </div>
        ))
      }
    </div>
  )
};

export default AppList;
