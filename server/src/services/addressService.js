import { createScopedClient } from '../config/supabase.js';

export const getAddresses = async (userId, token) => {
  const supabase = createScopedClient(token);
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getAddressById = async (userId, addressId, token) => {
  const supabase = createScopedClient(token);
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('id', addressId)
    .single();

  if (error) throw error;
  return data;
};

export const addAddress = async (userId, addressData, token) => {
  const supabase = createScopedClient(token);

  // If is_default is true, unset other defaults
  if (addressData.is_default) {
    await unsetDefaultAddress(userId, token);
  }

  // If this is the user's first address, force it to be default
  const { count } = await supabase
    .from('addresses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (count === 0) {
    addressData.is_default = true;
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert([
      {
        user_id: userId,
        full_name: addressData.fullName,
        phone_number: addressData.phoneNumber,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        landmark: addressData.landmark,
        address_type: addressData.addressType,
        is_default: addressData.is_default || false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAddress = async (userId, addressId, addressData, token) => {
  const supabase = createScopedClient(token);

  // If setting this to default, unset other defaults
  if (addressData.is_default) {
    await unsetDefaultAddress(userId, token);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update({
      full_name: addressData.fullName,
      phone_number: addressData.phoneNumber,
      address: addressData.address,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      landmark: addressData.landmark,
      address_type: addressData.addressType,
      is_default: addressData.is_default,
      updated_at: new Date().toISOString(),
    })
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAddress = async (userId, addressId, token) => {
  const supabase = createScopedClient(token);

  const { data: addressToDelete } = await supabase
    .from('addresses')
    .select('is_default')
    .eq('id', addressId)
    .eq('user_id', userId)
    .single();

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) throw error;

  // If deleted address was default, make the most recently created address the new default
  if (addressToDelete && addressToDelete.is_default) {
    const { data: latestAddress } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (latestAddress) {
      await setDefaultAddress(userId, latestAddress.id, token);
    }
  }

  return true;
};

export const setDefaultAddress = async (userId, addressId, token) => {
  const supabase = createScopedClient(token);

  // 1. Unset existing defaults
  await unsetDefaultAddress(userId, token);

  // 2. Set new default
  const { data, error } = await supabase
    .from('addresses')
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const unsetDefaultAddress = async (userId, token) => {
  const supabase = createScopedClient(token);
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: false, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_default', true);

  if (error) throw error;
  return true;
};
