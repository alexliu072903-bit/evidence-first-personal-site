import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import site from '../site.config.mjs';
import { primary } from '../lib/i18n';

const read = (text) => typeof text === 'string' ? text : text[primary];

export async function GET(context) {
  const posts = (await getCollection('writing')).filter((entry) => entry.data.publication === 'public').sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  return rss({
    title: site.name,
    description: read(site.description),
    site: context.site,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: `writing/${entry.id}/`,
    })),
  });
}
