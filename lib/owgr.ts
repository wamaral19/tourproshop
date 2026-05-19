import {
  isPlayerHidden,
  PLAYERS_SNAPSHOT,
  PLAYERS_SNAPSHOT_UPDATED_AT,
  RANKED_PLAYERS,
  type Player,
} from "./players";

/**
 * OWGR / roster data layer.
 *
 * Single source of truth: /data/owgr.json. Update that file weekly to refresh
 * rankings + roster. See /data/README.md for the workflow.
 *
 * For future flexibility this loader also honors an OWGR_DATA_URL env var; if
 * set, it fetches the same JSON shape from a remote URL and falls back to the
 * local file when the request fails.
 */

export const OWGR_REVALIDATE_SECONDS = 60 * 60 * 24 * 7; // one week
export const OWGR_CACHE_TAG = "owgr";

type FeedShape = Player[] | { players: Player[] };

function normalize(data: FeedShape): Player[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as { players?: Player[] }).players)) {
    return (data as { players: Player[] }).players;
  }
  return [];
}

/**
 * Returns the full roster (every player in the JSON file), regardless of
 * OWGR rank. Use this when you want to browse everyone we cover.
 */
export async function getRoster(): Promise<Player[]> {
  const url = process.env.OWGR_DATA_URL;
  let list: Player[] = PLAYERS_SNAPSHOT;
  if (url) {
    try {
      const res = await fetch(url, {
        next: {
          revalidate: OWGR_REVALIDATE_SECONDS,
          tags: [OWGR_CACHE_TAG],
        },
      });
      if (res.ok) {
        const remote = normalize((await res.json()) as FeedShape);
        if (remote.length > 0) list = remote;
      }
    } catch {
      // fall through to bundled snapshot
    }
  }
  return list.filter((p) => !isPlayerHidden(p.slug));
}

/**
 * Returns just the OWGR-ranked players (top 20-ish), sorted by rank ascending.
 * Use this for the "world ranking" view that excludes off-rank exclusives.
 */
export async function getOwgrTop20(): Promise<Player[]> {
  const list = await getRoster();
  return RANKED_PLAYERS(list).slice(0, 20);
}

export async function getOwgrPlayer(slug: string): Promise<Player | undefined> {
  const list = await getRoster();
  return list.find((p) => p.slug === slug);
}

export function getOwgrUpdatedAt(): string {
  return PLAYERS_SNAPSHOT_UPDATED_AT;
}
