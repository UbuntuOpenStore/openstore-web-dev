import { z } from "astro/zod";

export enum RatingType {
  THUMBS_UP = 'THUMBS_UP',
  THUMBS_DOWN = 'THUMBS_DOWN',
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  BUGGY = 'BUGGY',
}

export enum Architecture {
  ALL = 'all',
  ARMHF = 'armhf',
  AMD64 = 'amd64',
  ARM64 = 'arm64',
}

export enum Channel {
  FOCAL = 'focal',
}

export enum AppType {
  APP = 'app',
  BOOKMARK = 'webapp',
  WEBAPP = 'webapp+',
};

export const Channels = Object.values(Channel) as Channel[];
export const DEFAULT_CHANNEL = Channel.FOCAL;

export const AppRevisionSchema = z.object({
  version: z.string(),
  download_url: z.string().nullable(),
  channel: z.string(),
  architecture: z.nativeEnum(Architecture),
  revision: z.number(),
  downloads: z.number(),
});

export type AppRevisionData = z.infer<typeof AppRevisionSchema>;

export const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  architectures: z.array(z.nativeEnum(Architecture)),
  category: z.string().nullable(),
  changelog: z.string(),
  channels: z.array(z.string()),
  description: z.string(),
  downloads: z.array(z.object({
    version: z.string(),
    download_url: z.string().nullable(),
    channel: z.string(),
    architecture: z.nativeEnum(Architecture),
    revision: z.number(),
  })),
  icon: z.string(),
  keywords: z.array(z.string()),
  license: z.string(),
  nsfw: z.boolean(),
  published_date: z.coerce.date(),
  screenshots: z.array(z.string()),
  source: z.string(),
  support_url: z.string(),
  donate_url: z.string(),
  video_url: z.string(),
  translation_url: z.string(),
  types: z.array(z.string()),
  updated_date: z.coerce.date(),
  languages: z.array(z.string()),
  revisions: z.array(AppRevisionSchema),
  totalDownloads: z.number(),
  latestDownloads: z.number(),
  version: z.string(),
  ratings: z.object({
    [RatingType.THUMBS_UP]: z.number(),
    [RatingType.THUMBS_DOWN]: z.number(),
    [RatingType.HAPPY]: z.number(),
    [RatingType.NEUTRAL]: z.number(),
    [RatingType.BUGGY]: z.number(),
  }),
  publisher: z.string().optional(),
  permissions: z.array(z.string()),
  read_paths: z.array(z.string()),
  write_paths: z.array(z.string()),
});

export type AppData = z.infer<typeof AppSchema>;

export const AppManageSchema = AppSchema.extend({
  published: z.boolean(),
  locked: z.boolean(),
  type_override: z.string(),
  review_exceptions: z.array(z.string()),
  maintainer: z.string().optional(),
});

export type AppManageData = z.infer<typeof AppManageSchema>;

export const ReviewSchema = z.object({
  author: z.string(),
  body: z.string(),
  version: z.string(),
  rating: z.nativeEnum(RatingType),
  date: z.coerce.date(),
  comment: z.string().nullable(),
});

export type ReviewData = z.infer<typeof ReviewSchema>;

export const ReviewsSchema = z.object({
  reviews: z.array(ReviewSchema),
});

export const SlimAppSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  icon: z.string(),
  nsfw: z.boolean(),
  types: z.array(z.string()),
  ratings: z.object({
    [RatingType.THUMBS_UP]: z.number(),
    [RatingType.THUMBS_DOWN]: z.number(),
    [RatingType.HAPPY]: z.number(),
    [RatingType.NEUTRAL]: z.number(),
    [RatingType.BUGGY]: z.number(),
  }),
  published: z.boolean().optional(),
  publisher: z.string(),
});

export type SlimAppData = z.infer<typeof SlimAppSchema>;

export const DiscoverSchema = z.object({
  highlights: z.array(z.object({
    id: z.string(),
    image: z.string(),
    description: z.string(),
    app: SlimAppSchema,
  })),
  categories: z.array(z.object({
    name: z.string(),
    tagline: z.string(),
    referral: z.string(),
    apps: z.array(SlimAppSchema),
  }))
});

export type DiscoverData = z.infer<typeof DiscoverSchema>;

export const AppSearchSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  packages: z.array(SlimAppSchema),
});

export const CategorySchema = z.object({
  category: z.string(),
  translation: z.string(),
  count: z.number(),
  icon: z.string(),
  slug: z.string(),
});

export type CategoryData = z.infer<typeof CategorySchema>;

export const CategoriesSchema = z.array(CategorySchema);

export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  language: z.string().optional(),
  username: z.string(),
  role: z.string().optional(),
});

export type UserData = z.infer<typeof UserSchema>;

export const UserListSchema = z.array(UserSchema);
