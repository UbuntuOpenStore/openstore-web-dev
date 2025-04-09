import type { AppData } from "./schema";

export function generateSchema(url: string, breadcrumbs: { name: string, path: string }[], app?: AppData) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: import.meta.env.SITE,
          },
          ...breadcrumbs.map(({ name, path }, idx) => ({
            '@type': 'ListItem',
            position: idx + 2,
            name,
            item: new URL(path, import.meta.env.SITE).href,
          })),
        ].filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': `${import.meta.env.SITE}#website`,
        url: import.meta.env.SITE,
        name: 'OpenStore',
        description: 'The open source app store for Ubuntu Touch',
        inLanguage: 'en-US'
      },
      app ? {
        '@type': 'MobileApplication',
        '@id': new URL(`/app/${app.id}/`, import.meta.env.SITE).href,
        url: new URL(`/app/${app.id}/`, import.meta.env.SITE).href,
        downloadUrl: app.downloads.find((download) => download.architecture === 'arm64' || download.architecture === 'all')?.download_url,
        applicationCategory: app.category,
        operatingSystem: 'Ubuntu Touch',
        permissions: app.permissions.join(', '),
        screenshot: app.screenshots[0],
        abstract: app.tagline,
        about: app.description,
        dateModified: new Date(app.updated_date).toISOString(),
        datePublished: new Date(app.published_date).toISOString(),
        isFamilyFriendly: !app.nsfw,

      } : undefined,
    ].filter(Boolean),
  }
}
