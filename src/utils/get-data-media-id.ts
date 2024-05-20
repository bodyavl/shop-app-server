export function getDataMediaIds(input: string): number[] {
  const regex = /data-media-id="(\d+)"/g;
  const matches = input.matchAll(regex);
  const ids: number[] = [];

  for (const match of matches) {
    if (match && match.length > 1) {
      const id = parseInt(match[1]);
      ids.push(id);
    }
  }

  return ids;
}
