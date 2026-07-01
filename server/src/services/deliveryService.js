import { supabaseAdmin, supabase } from '../config/supabase.js';

// Hardcoded fallback — used when the DB table doesn't exist yet
const FALLBACK_STATES = {
  'tamil nadu':      { is_active: true,  estimated_days: 2 },
  'kerala':          { is_active: true,  estimated_days: 3 },
  'karnataka':       { is_active: true,  estimated_days: 3 },
  'andhra pradesh':  { is_active: true,  estimated_days: 4 },
  'telangana':       { is_active: true,  estimated_days: 4 },
  'maharashtra':     { is_active: true,  estimated_days: 5 },
  'delhi':           { is_active: true,  estimated_days: 5 },
  'gujarat':         { is_active: false, estimated_days: 6 },
  'west bengal':     { is_active: false, estimated_days: 6 },
  'rajasthan':       { is_active: false, estimated_days: 6 },
};

export const checkStateAvailability = async (stateName) => {
  if (!stateName) {
    return { is_active: true };
  }

  // Prefer admin client to bypass RLS; fall back to anon client
  const client = supabaseAdmin || supabase;

  try {
    const { data, error } = await client
      .from('serviceable_states')
      .select('is_active, estimated_days')
      .ilike('state_name', stateName)
      .single();

    if (error) {
      // Table missing (42P01) or no rows found (PGRST116) — use fallback
      console.warn('[DeliveryService] DB unavailable, using fallback:', error.message);
      const key = stateName.toLowerCase().trim();
      return FALLBACK_STATES[key] ?? { is_active: true };
    }

    return {
      is_active: data.is_active,
      estimated_days: data.estimated_days,
    };
  } catch (err) {
    console.error('[DeliveryService] Error:', err.message);
    const key = stateName.toLowerCase().trim();
    return FALLBACK_STATES[key] ?? { is_active: true };
  }
};

