import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { supabaseAdmin } from '../config/supabase.js';

const getUserId = (req) => req.user?.id || 'guest';

export const getOrders = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    if (!supabaseAdmin) {
      return sendSuccess(res, [], 'Orders retrieved successfully');
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return sendSuccess(res, data || [], 'Orders retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const userId = getUserId(req);

    if (!supabaseAdmin) {
      return sendSuccess(res, {
        id: `local-${Date.now()}`,
        user_id: userId,
        ...payload,
      }, 'Order created successfully', 201);
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: userId,
          status: payload.status || 'Placed',
          payment_method: payload.paymentMethod || 'Cash on Delivery',
          total: Number(payload.total || 0),
          item_count: Number(payload.itemCount || 0),
          product: payload.product || 'Vedha Craft Order',
          items: payload.items || [],
          address: payload.address || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(res, data, 'Order created successfully', 201);
  } catch (error) {
    return next(error);
  }
};
