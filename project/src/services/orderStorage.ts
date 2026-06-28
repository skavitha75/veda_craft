import { supabase } from '../lib/supabase';
import type { CartItem } from '../context/CartContext';
import type { Address } from '../context/AuthContext';

const ORDER_STORAGE_KEY = 'vc_orders';

export interface SavedOrder {
  id: string;
  createdAt: string;
  status: 'Placed' | 'In Transit' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  total: number;
  itemCount: number;
  product: string;
  items: CartItem[];
  address?: Address;
  userId?: string;
}

function readAllOrders(): SavedOrder[] {
  try {
    const saved = localStorage.getItem(ORDER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to read orders', error);
    return [];
  }
}

function writeAllOrders(orders: SavedOrder[]) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function sortOrders(orders: SavedOrder[]) {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function getStoredUserId(): string | null {
  try {
    const saved = localStorage.getItem('vc_user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed?.id ?? null;
  } catch {
    return null;
  }
}

async function resolveUserId(): Promise<string> {
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  if (sessionUser?.id) {
    return sessionUser.id;
  }

  return getStoredUserId() || 'guest';
}

function normalizeOrder(row: any, fallbackUserId?: string): SavedOrder {
  const addressValue = row.address;

  return {
    id: row.id,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    status: (row.status as SavedOrder['status']) || 'Placed',
    paymentMethod: row.payment_method || row.paymentMethod || 'Cash on Delivery',
    total: Number(row.total ?? 0),
    itemCount: Number(row.item_count ?? row.itemCount ?? 0),
    product: row.product || 'Vedha Craft Order',
    items: Array.isArray(row.items) ? row.items : [],
    address:
      addressValue && typeof addressValue === 'object'
        ? (addressValue as Address)
        : addressValue && typeof addressValue === 'string'
          ? JSON.parse(addressValue)
          : undefined,
    userId: row.user_id || row.userId || fallbackUserId,
  };
}

export async function getOrders(userId?: string): Promise<SavedOrder[]> {
  const localOrders = readAllOrders();
  const visibleLocalOrders = userId
    ? localOrders.filter((order) => !order.userId || order.userId === userId)
    : localOrders;

  const resolvedUserId = await resolveUserId();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', resolvedUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch orders:', error.message);
    return sortOrders(visibleLocalOrders);
  }

  const remoteOrders = (data || []).map((row: any) => normalizeOrder(row, resolvedUserId));
  if (remoteOrders.length > 0) {
    return sortOrders(remoteOrders);
  }

  return sortOrders(visibleLocalOrders);
}

export async function saveOrder(order: Omit<SavedOrder, 'id' | 'createdAt' | 'status'>): Promise<SavedOrder> {
  const localOrders = readAllOrders();
  const nextOrder: SavedOrder = {
    ...order,
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Placed',
  };

  writeAllOrders([nextOrder, ...localOrders]);

  const resolvedUserId = await resolveUserId();

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: resolvedUserId,
        status: nextOrder.status,
        payment_method: nextOrder.paymentMethod,
        total: nextOrder.total,
        item_count: nextOrder.itemCount,
        product: nextOrder.product,
        items: nextOrder.items,
        address: nextOrder.address ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Failed to save order:', error.message);
    return nextOrder;
  }

  const savedOrder = normalizeOrder(data, resolvedUserId);
  writeAllOrders([savedOrder, ...localOrders.filter((existing) => existing.id !== nextOrder.id)]);
  return savedOrder;
}
