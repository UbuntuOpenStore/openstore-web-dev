import { type AppData, RatingType } from "@/schema";
import thumbsUp from "@/assets/icons/thumbs_up.svg?raw";
import happy from "@/assets/icons/happy.svg?raw";
import neutral from "@/assets/icons/neutral.svg?raw";
import thumbsDown from "@/assets/icons/thumbs_down.svg?raw";
import buggy from "@/assets/icons/buggy.svg?raw";

const IconMap = {
  [RatingType.THUMBS_UP]: thumbsUp,
  [RatingType.HAPPY]: happy,
  [RatingType.NEUTRAL]: neutral,
  [RatingType.THUMBS_DOWN]: thumbsDown,
  [RatingType.BUGGY]: buggy,
};

const TopRating = ({ ratings }: { ratings: AppData["ratings"] }) => {
  let topRating: RatingType | undefined = undefined;
  let ratingCount = 0;
  for (const rating of Object.keys(ratings)) {
    const ratingType = rating as RatingType;
    if (ratings[ratingType] > ratingCount) {
      topRating = ratingType;
      ratingCount = ratings[ratingType];
    }
  }

  if (topRating) {
    return (
      <div class="flex gap-2">
        <div dangerouslySetInnerHTML={{ __html: IconMap[topRating]}} />
        {ratingCount}
      </div>
    );
  }

  return null;
};

export default TopRating;
