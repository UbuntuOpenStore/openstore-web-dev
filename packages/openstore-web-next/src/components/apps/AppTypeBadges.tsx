import { AppType, type AppData } from "@/lib/schema";

const ALL_TYPES: string[] = [AppType.APP, AppType.BOOKMARK, AppType.WEBAPP];

const AppTypeBadges = ({ types, publishedDate, messages }: { types: AppData['types'], publishedDate?: string, messages: { new: string, app: string, bookmark: string, webapp: string } }) => {
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
          {messages.new}
        </span>
      )}

      {types.filter((type) => ALL_TYPES.includes(type)).map((type) => (
        <span class="rounded-lg bg-primary text-white px-1 py-0.5 text-xs">
          {type === AppType.APP && (<>{messages.app}</>)}
          {type === AppType.BOOKMARK && (<>{messages.bookmark}</>)}
          {type === AppType.WEBAPP && (<>{messages.webapp}</>)}
        </span>
      ))}
    </div>
  )
};

export default AppTypeBadges;
