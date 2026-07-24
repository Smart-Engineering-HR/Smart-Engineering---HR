// المسار: app/scholarship/apply/[id]/page.js

'use client';
import { useState } from 'react';

export default function ScholarshipApplication({ params }) {
  const [formData, setFormData] = useState({});

  const submitApplication = async (e) => {
    e.preventDefault();
    // إرسال البيانات للبريد الإلكتروني للإدارة
    const res = await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'Smart.Engineering.Global@proton.me',
        subject: 'طلب تقديم جديد لمنحة',
        data: formData
      })
    });
    if(res.ok) alert("تم إرسال طلبك باحترافية، سنتواصل معك قريباً!");
  };

  return (
    <form onSubmit={submitApplication} className="max-w-2xl mx-auto p-8 bg-white text-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-green-700">تقديم احترافي للمنحة</h2>
      <p className="mb-4 text-sm text-gray-600">رسوم الخدمة: سيتم التواصل لتحديدها</p>
      
      {/* الحقول المطلوبة */}
      <input type="text" placeholder="الاسم الكامل (جواز السفر)" onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full border p-2 mb-4" required />
      <input type="email" placeholder="البريد الإلكتروني" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border p-2 mb-4" required />
      {/* باقي الحقول كما طلبت بصرامة */}
      
      <button type="submit" className="bg-green-600 text-white w-full py-3 font-bold rounded">إرسال الطلب للتدقيق</button>
    </form>
  );
}