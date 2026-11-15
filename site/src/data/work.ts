import { getCollection, type CollectionEntry } from 'astro:content';

export type Study = CollectionEntry<'work'>;

/** Case studies in display order. */
export async function getWork(): Promise<Study[]> {
  return (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
}
