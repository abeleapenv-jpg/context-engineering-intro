/*
 * The entry sequence's five beats (§4.2). Shared by the 2D and 3D
 * implementations so the beat structure cannot drift between them.
 */
export type EntryBeat =
  | 'void'
  | 'glimpse'
  | 'pause'
  | 'question'
  | 'branch'
  | 'resolution';
