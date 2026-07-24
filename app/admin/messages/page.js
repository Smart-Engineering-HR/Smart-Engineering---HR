'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setMessages(data);
      setLoading(false);
    }
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-[#050a18] p-8 text-white text-right" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400 border-b border-gray-800 pb-4">صندوق الرسائل والاستشارات</h1>
        
        {loading ? (
          <p className="text-center text-gray-500">جاري تحميل الرسائل...</p>
        ) : messages.length === 0 ? (
          <div className="text-center p-12 bg-[#0a1128] rounded-xl border border-gray-800">
            <p className="text-gray-500">لا توجد رسائل واردة حتى الآن.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-[#0a1128] border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-300">{msg.full_name}</h3>
                  <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString('ar-EG')}</span>
                </div>
                <p className="text-sm text-blue-100 mb-2 font-semibold">الموضوع: {msg.subject}</p>
                <p className="text-gray-400 text-sm bg-[#111a36] p-4 rounded-lg leading-relaxed">
                  {msg.message}
                </p>
                <div className="mt-4 text-xs text-gray-500">البريد الإلكتروني: {msg.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}