"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function AdvertiseForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    phone: '',
    email: '',
    location: '',
    type: 'وظيفة'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Sending Data:", formData);

    const res = await fetch('/api/advertise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("تم إرسال بيانات الإعلان بنجاح، سيتم التواصل معكم قريباً!");
      setFormData({ company: '', contactName: '', phone: '', email: '', location: '', type: 'وظيفة' });
    } else {
      const err = await res.json();
      alert("خطأ: " + (err.error || "حدث خطأ أثناء الإرسال"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-20" dir="rtl">
      {/* دمج زر العودة */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-emerald-500 hover:text-white mb-6 transition"
      >
        <ArrowRight size={20} /> العودة للخلف
      </button>

      <h1 className="text-3xl font-black mb-2">أعلن معنا</h1>
      <p className="text-emerald-400 mb-8">يرجي تعبئة البيانات وارسالها وسيتم التواصل معكم قريبا</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <input 
          required 
          placeholder="اسم الشركة" 
          className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
        />
        <input 
          required 
          placeholder="اسم المسؤول" 
          className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
          value={formData.contactName}
          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
        />
        <input 
          required 
          placeholder="رقم التليفون" 
          className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        <input 
          required 
          type="email" 
          placeholder="البريد الإلكتروني" 
          className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          placeholder="العنوان/الموقع" 
          className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
        <select 
          className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option>وظيفة</option>
          <option>مناقصة</option>
          <option>وظيفة ومناقصة</option>
        </select>
        
        <button type="submit" className="w-full bg-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all">
          إرسال الإعلان
        </button>
      </form>
    </div>
  );
}