export type ChangelogEntry = {
  date: string;
  items: string[];
};

export function parseChangelog(markdown: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  let current: ChangelogEntry | null = null;

  for (const line of markdown.split('\n')) {
    const heading = line.match(/^##\s+(.+)/);
    if (heading) {
      current = { date: heading[1].trim(), items: [] };
      entries.push(current);
      continue;
    }

    const item = line.match(/^[-*]\s+(.+)/);
    if (item && current) {
      current.items.push(item[1].trim());
    }
  }

  return entries;
}
