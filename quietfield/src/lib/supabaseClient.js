import { createClient } from '@supabase/supabase-js';

/*
 * Supabase client (master plan section 5).
 *
 * Credentials come from Vite env vars (.env, see .env.example). The anon key
 * is public by design; Row Level Security on `progress` and `choices_made`
 * (every policy checks auth.uid() = user_id) is the actual boundary. The
 * service key must never appear in frontend code.
 *
 * When the env vars are absent the site runs in LOCAL MODE: progress and
 * choices persist to localStorage with the same shape as the tables, and the
 * auth gate stays open. This mirrors the master plan's warning (section 7,
 * task 2) that the Supabase project's live status is unverified - the site
 * stays fully usable while the real project is wired up.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** True when both env vars exist and Supabase auth/data is live. */
export const SUPABASE_CONFIGURED = Boolean(url && anonKey);

export const supabase = SUPABASE_CONFIGURED ? createClient(url, anonKey) : null;
