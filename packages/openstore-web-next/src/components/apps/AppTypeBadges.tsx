import { AppType, type AppData } from "@/lib/schema";

const ALL_TYPES: string[] = [AppType.APP, AppType.BOOKMARK, AppType.WEBAPP];

const AppTypeBadges = ({ types, publishedDate }: { types: AppData['types'], publishedDate?: string }) => {
  let isNew = false;

  if (publishedDate) {
    const published = new Date(publishedDate);
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 30);
    isNew = published.getTime() > checkDate.getTime();
  }

  return (
    <div class="mt-1 space-x-1">
      {isNew && (
        <span class="rounded-lg bg-ubuntu-orange text-white px-1 py-0.5 text-xs">
          New!
        </span>
      )}

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
