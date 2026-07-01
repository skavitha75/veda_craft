import { supabase } from '../config/supabase.js';

export const checkStateAvailability = async (stateName) => {
  if (!stateName) {
    return { is_active: false };
  }

  try {
    const { data, error } = await supabase
      .from('serviceable_states')
      .select('*')
      .ilike('state_name', stateName) // Case-insensitive match
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found -> Not serviceable by default
        return { is_active: false };
      }
      throw error;
    }

    return {
      is_active: data.is_active,
      estimated_days: data.estimated_days,
    };
  } catch (err) {
    console.error('Error fetching state availability:', err.message);
    // Safe fallback to block if error occurs
    return { is_active: false };
  }
};
