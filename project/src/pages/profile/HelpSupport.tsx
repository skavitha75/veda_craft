import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'How can I track my order?',
    a: 'Once your order is shipped, you will receive a tracking link via SMS and email. You can also check the "My Orders" section in your profile.',
  },
  {
    q: 'What is the return policy?',
    a: 'We offer a 7-day return policy for most products. Items must be in their original condition and packaging. Visit the order details page to initiate a return.',
  },
  {
    q: 'How do I cancel an order?',
    a: 'Orders can be cancelled within 24 hours of placing them. Go to My Orders, select the order, and tap "Cancel Order".',
  },
  {
    q: 'Are the products on Vedacraft authentic?',
    a: 'Yes! All products are sourced directly from verified artisans and local farmers. We guarantee authenticity and quality.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left
                   hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-800">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpSupport() {
  return (
    <div className="flex flex-col gap-4">
      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-5">
          <HelpCircle className="w-5 h-5 text-[#2d6a2d]" />
          <h3 className="text-base font-semibold text-gray-900">Frequently Asked Questions</h3>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* Contact Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Us</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: MessageSquare, label: 'Live Chat', sub: 'Chat with support', color: 'text-blue-600 bg-blue-50' },
            { icon: Phone, label: 'Call Us', sub: '+91 98765 43210', color: 'text-green-600 bg-green-50' },
            { icon: Mail, label: 'Email', sub: 'support@vedacraft.in', color: 'text-yellow-600 bg-yellow-50' },
          ].map(({ icon: Icon, label, sub, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-100
                         hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all text-center"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
