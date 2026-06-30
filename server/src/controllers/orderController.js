import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { supabaseAdmin } from '../config/supabase.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

const getUserId = (req) => req.user?.id || 'guest';
const getUserEmail = (req) => req.user?.email || '';
const getUserName = (req) => req.user?.user_metadata?.full_name || req.user?.email?.split('@')[0] || '';

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
    const userEmail = getUserEmail(req);
    const userName = getUserName(req);

    if (!supabaseAdmin) {
      const mockOrder = {
        id: `local-${Date.now()}`,
        user_id: userId,
        ...payload,
      };

      // Try sending email even for mock/local setup if email is available
      if (userEmail) {
        // Run in background, don't await
        sendOrderConfirmationEmail({
          email: userEmail,
          name: userName,
          orderId: mockOrder.id,
          items: payload.items || [],
          total: Number(payload.total || 0),
          address: payload.address || null,
        }).catch(err => console.error('Background email error:', err));
      }

      return sendSuccess(res, mockOrder, 'Order created successfully', 201);
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

    // Send email asynchronously without blocking the response
    if (userEmail) {
      sendOrderConfirmationEmail({
        email: userEmail,
        name: userName,
        orderId: data.id,
        items: data.items || [],
        total: data.total,
        address: data.address || null,
      }).catch(err => console.error('Background email error:', err));
    }

    return sendSuccess(res, data, 'Order created successfully', 201);
  } catch (error) {
    return next(error);
  }
};
