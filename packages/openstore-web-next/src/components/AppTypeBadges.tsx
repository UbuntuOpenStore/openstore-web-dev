import { AppType, type AppData } from "@/lib/schema";

const AppTypeBadges = ({ types }: { types: AppData['types'] }) => {
  return (
    <div class="mt-1 space-x-4">
      {types.map((type) => (
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
