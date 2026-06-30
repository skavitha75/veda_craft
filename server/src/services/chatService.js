const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const SYSTEM_PROMPT = `
You are Veda Craft's friendly shopping assistant.
Help customers with eco-friendly products, categories, orders, checkout, wishlist, and general store questions.
Keep replies concise, warm, and practical. If a question needs private account/order data, ask the customer to check their profile/orders page or contact support.
Do not invent prices, stock, discounts, policies, or delivery dates.
`;

const fallbackReply = (message) => {
  const text = message.toLowerCase();

  if (text.includes('product') || text.includes('buy') || text.includes('recommend')) {
    return 'I can help you explore Veda Craft products. Try browsing Eco, Wellness, Food, Craft, Fashion, or Decor categories, or search for the item name in the search bar.';
  }

  if (text.includes('order') || text.includes('delivery') || text.includes('track')) {
    return 'You can check your order status from Profile > Orders. If you need help with a specific order, keep the order ID ready.';
  }

  if (text.includes('cart') || text.includes('checkout') || text.includes('payment')) {
    return 'You can add items to cart, open the cart icon, and continue to checkout. Make sure your address is saved before placing the order.';
  }

  return 'Hi, I am your Veda Craft assistant. I can help with products, categories, cart, checkout, wishlist, and order questions.';
};

const normalizeMessages = (messages = []) => {
  return messages
    .filter((item) => item && typeof item.content === 'string')
    .slice(-8)
    .map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: item.content.trim().slice(0, 1000),
    }))
    .filter((item) => item.content);
};

const extractResponseText = (payload) => {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const parts = payload?.output
    ?.flatMap((item) => item.content || [])
    ?.map((content) => content.text)
    ?.filter(Boolean);

  return parts?.join('\n').trim() || '';
};

export const createChatReply = async ({ message, messages }) => {
  const userMessage = String(message || '').trim();

  if (!userMessage) {
    return {
      reply: 'Please type a message so I can help.',
      source: 'fallback',
    };
  }

  const conversation = normalizeMessages(messages);

  if (!process.env.OPENAI_API_KEY) {
    return {
      reply: fallbackReply(userMessage),
      source: 'fallback',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        instructions: SYSTEM_PROMPT,
        input: [
          ...conversation.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[Chat] OpenAI request failed:', payload?.error || response.statusText);
      return {
        reply: fallbackReply(userMessage),
        source: 'fallback',
      };
    }

    return {
      reply: extractResponseText(payload) || fallbackReply(userMessage),
      source: 'openai',
    };
  } catch (error) {
    console.error('[Chat] Reply generation failed:', error.message);
    return {
      reply: fallbackReply(userMessage),
      source: 'fallback',
    };
  } finally {
    clearTimeout(timeout);
  }
};
