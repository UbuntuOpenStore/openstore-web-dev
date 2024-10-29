import { z } from "astro/zod";

export enum RatingType {
  THUMBS_UP = 'THUMBS_UP',
  THUMBS_DOWN = 'THUMBS_DOWN',
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  BUGGY = 'BUGGY',
}

export const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  architectures: z.array(z.string()),
  category: z.string().nullable(),
  changelog: z.string(),
  channels: z.array(z.string()),
  description: z.string(),
  // TODO downloads
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
  // TODO revisions
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
});

export type AppData = z.infer<typeof AppSchema>;

export const ReviewsSchema = z.object({
  reviews: z.array(z.object({
    author: z.string(),
    body: z.string(),
    version: z.string(),
    rating: z.nativeEnum(RatingType),
    date: z.coerce.date(),
    comment: z.string().nullable(),
  })),
});

export const DiscoverSchema = z.object({
  highlights: z.array(z.object({
    id: z.string(),
    image: z.string(),
    description: z.string(),
    app: AppSchema,
  })),
  categories: z.array(z.object({
    name: z.string(),
    tagline: z.string(),
    referral: z.string(),
    apps: z.array(AppSchema),
  }))
});

export type DiscoverData = z.infer<typeof DiscoverSchema>;

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

export const AppSearchSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  packages: z.array(SlimAppSchema),
});
