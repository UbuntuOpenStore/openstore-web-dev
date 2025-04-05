import { type AppData, RatingType } from "@/lib/schema";
import SvgThumbsUp from "@/components/icons/ThumbsUp";
import SvgNeutral from "@/components/icons/Neutral";
import SvgHappy from "@/components/icons/Happy";
import SvgThumbsDown from "@/components/icons/ThumbsDown";
import SvgBuggy from "@/components/icons/Buggy";

const ICON_MAP = {
  [RatingType.THUMBS_UP]: SvgThumbsUp,
  [RatingType.HAPPY]: SvgHappy,
  [RatingType.NEUTRAL]: SvgNeutral,
  [RatingType.THUMBS_DOWN]: SvgThumbsDown,
  [RatingType.BUGGY]: SvgBuggy,
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
    const Icon = ICON_MAP[topRating];
    return (
      <div class="flex gap-2">
        <Icon />
        {ratingCount}
      </div>
    );
  }

  return null;
};

export default TopRating;
