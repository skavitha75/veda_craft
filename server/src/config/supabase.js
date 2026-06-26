/**
 * Supabase Client Configuration
 *
 * Exports two Supabase clients:
 *  - `supabase`      → uses the ANON key (respects RLS, safe for user-level ops)
 *  - `supabaseAdmin` → uses the SERVICE ROLE key (bypasses RLS, admin-only ops)
 *
 * IMPORTANT: Never expose `supabaseAdmin` to the frontend.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required env vars at startup
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[Supabase] SUPABASE_URL and SUPABASE_ANON_KEY are required.');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[Supabase] SUPABASE_SERVICE_ROLE_KEY is not set. ' +
    'Admin operations will be unavailable.'
  );
}

/**
 * Public client — uses anon key, respects Row Level Security (RLS).
 * Use for user-scoped queries and auth operations.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

/**
 * Creates a Supabase client scoped to a specific user's JWT.
 * Use this in backend services to execute queries as the authenticated user,
 * ensuring Row Level Security (RLS) policies are properly evaluated.
 */
export const createScopedClient = (token) => {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

/**
 * Admin client — uses service role key, bypasses Row Level Security (RLS).
 * Use ONLY for server-side administrative operations.
 */
export const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  : null;
