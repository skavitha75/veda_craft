import dotenv from 'dotenv';
dotenv.config();

import { sendOrderConfirmationEmail } from './src/services/emailService.js';

sendOrderConfirmationEmail({
  email: 'test@example.com',
  name: 'Test User',
  orderId: 'TEST-1234',
  items: [{ name: 'Test Product', quantity: 1, price: 100 }],
  total: 100,
  address: null,
}).then(() => console.log('Done')).catch(console.error);
