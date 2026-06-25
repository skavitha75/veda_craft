import { supabaseAdmin } from '../config/supabase.js';

const DEFAULT_PROFILE_REQUIRED_FIELDS = ['full_name', 'phone'];

const getRequiredFields = () => {
  const configuredFields = process.env.PROFILE_REQUIRED_FIELDS;

  if (!configuredFields) {
    return DEFAULT_PROFILE_REQUIRED_FIELDS;
  }

  return configuredFields
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean);
};

const pickFirst = (...values) => values.find((value) => typeof value === 'string' && value.trim());

export const isProfileComplete = (profile) => {
  if (!profile) return false;

  return getRequiredFields().every((field) => {
    const value = profile[field];
    return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
  });
};

const buildProfilePayload = (user) => {
  const metadata = user.user_metadata || {};
  const identityData = user.identities?.[0]?.identity_data || {};

  return {
    id: user.id,
    email: user.email || identityData.email || null,
    full_name:
      pickFirst(metadata.full_name, metadata.name, identityData.full_name, identityData.name) || null,
    avatar_url:
      pickFirst(metadata.avatar_url, metadata.picture, identityData.avatar_url, identityData.picture) ||
      null,
    provider: user.app_metadata?.provider || user.identities?.[0]?.provider || 'email',
    updated_at: new Date().toISOString(),
  };
};

export const ensureUserProfile = async (user) => {
  if (!user?.id) {
    throw new Error('Cannot create a profile without an authenticated user.');
  }

  if (!supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for profile management.');
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert(buildProfilePayload(user), {
      onConflict: 'id',
      ignoreDuplicates: false,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  const complete = isProfileComplete(data);

  if (data.is_profile_complete === complete) {
    return data;
  }

  const { data: updatedProfile, error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      is_profile_complete: complete,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select('*')
    .single();

  if (updateError) {
    throw updateError;
  }

  return updatedProfile;
};

export const getProfileCompletionStatus = (profile) => {
  const requiredFields = getRequiredFields();
  const missingFields = requiredFields.filter((field) => {
    const value = profile?.[field];
    return typeof value === 'string' ? !value.trim() : !value;
  });

  return {
    is_profile_complete: missingFields.length === 0,
    required_fields: requiredFields,
    missing_fields: missingFields,
  };
};
