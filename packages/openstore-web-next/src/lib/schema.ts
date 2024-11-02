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

export const Channels = Object.values(Channel) as Channel[];
export const DEFAULT_CHANNEL = Channel.FOCAL;

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
    architecture: z.nativeEnum(Architecture).optional(),
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
  revisions: z.array(z.object({
    version: z.string(),
    download_url: z.string().nullable(),
    channel: z.string(),
    architecture: z.nativeEnum(Architecture).optional(),
  })),
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
  ratings: z.object({
    [RatingType.THUMBS_UP]: z.number(),
    [RatingType.THUMBS_DOWN]: z.number(),
    [RatingType.HAPPY]: z.number(),
    [RatingType.NEUTRAL]: z.number(),
    [RatingType.BUGGY]: z.number(),
  }),
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
