import { AppType, type AppData } from "@/lib/schema";

const ALL_TYPES: string[] = [AppType.APP, AppType.BOOKMARK, AppType.WEBAPP];

const AppTypeBadges = ({ types }: { types: AppData['types'] }) => {
  return (
    <div class="mt-1 space-x-4">
      {types.filter((type) => ALL_TYPES.includes(type)).map((type) => (
        <span class="rounded-lg bg-primary text-white px-1 py-0.5 text-xs">
          {type === AppType.APP && (<>App</>)}
          {type === AppType.BOOKMARK && (<>Bookmark</>)}
          {type === AppType.WEBAPP && (<>Web App</>)}
        </span>
      ))}
    </div>
  )
};

export default AppTypeBadges;
