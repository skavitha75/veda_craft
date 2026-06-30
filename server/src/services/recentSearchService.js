import { createScopedClient } from '../config/supabase.js';

const MAX_RECENT = 6;

/**
 * Get recent searches for a user from the database.
 */
export const getRecentSearches = async (userId, token) => {
  const supabase = createScopedClient(token);
  const { data, error } = await supabase
    .from('user_recent_searches')
    .select('id, query, searched_at')
    .eq('user_id', userId)
    .order('searched_at', { ascending: false })
    .limit(MAX_RECENT);

  if (error) throw new Error(error.message);
  return data || [];
};

/**
 * Save a search query for a user.
 * Deletes any existing duplicate entry first, then inserts fresh.
 */
export const saveRecentSearch = async (userId, query, token) => {
  const trimmed = query?.trim();
  if (!trimmed) return;

  const supabase = createScopedClient(token);

  // Remove duplicate if exists (case-insensitive)
  await supabase
    .from('user_recent_searches')
    .delete()
    .eq('user_id', userId)
    .ilike('query', trimmed);

  // Insert new entry at the top
  const { error: insertError } = await supabase
    .from('user_recent_searches')
    .insert({ user_id: userId, query: trimmed });

  if (insertError) throw new Error(insertError.message);

  // Keep only latest MAX_RECENT entries — delete older ones
  const { data: all } = await supabase
    .from('user_recent_searches')
    .select('id, searched_at')
    .eq('user_id', userId)
    .order('searched_at', { ascending: false });

  if (all && all.length > MAX_RECENT) {
    const toDelete = all.slice(MAX_RECENT).map(r => r.id);
    await supabase.from('user_recent_searches').delete().in('id', toDelete);
  }
};

/**
 * Delete a single recent search entry.
 */
export const deleteRecentSearch = async (userId, query, token) => {
  const supabase = createScopedClient(token);
  const { error } = await supabase
    .from('user_recent_searches')
    .delete()
    .eq('user_id', userId)
    .ilike('query', query.trim());

  if (error) throw new Error(error.message);
};

/**
 * Clear all recent searches for a user.
 */
export const clearRecentSearches = async (userId, token) => {
  const supabase = createScopedClient(token);
  const { error } = await supabase
    .from('user_recent_searches')
    .delete()
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
};
