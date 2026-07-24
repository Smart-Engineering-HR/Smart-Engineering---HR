'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, MapPin, Mail, Link as LinkIcon } from 'lucide-react';

// المكون الأساسي
export default function DetailsPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب البيانات (يتم استدعاء API الخاص بك هنا)
  useEffect(() => {
    async function getData() {
      try {
        // يمكنك استبدال الرابط أدناه بمسار الـ API الفعلي لديك
        const res = await fetch(`/api/postings?id=${id}`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) getData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white p-20 flex justify-center items-center">جاري تحميل البيانات...</div>;
  if (!data) return <div className="min-h-screen bg-slate-950 text-white p-20 flex justify-center items-center">لم يتم العثور على البيانات</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 md:p-20 font-sans" dir="rtl">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 mb-10 text-emerald-500 hover:text-white transition"
      >
        <ArrowRight /> العودة للقائمة
      </button>

      <div className="max-w-4xl bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black mb-10 border-b border-slate-700 pb-6">
          {data.title || data.companyName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <InfoItem icon={<Building2 className="w-5 h-5 text-emerald-500"/>} label="الجهة المعلنة" value={data.companyName} />
          <InfoItem icon={<MapPin className="w-5 h-5 text-emerald-500"/>} label="الموقع" value={data.location || data.address} />
        </div>

        <div className="space-y-6 text-lg">
          <Field label="المسمى الوظيفي" value={data.jobTitle} />
          <Field label="تفاصيل إضافية" value={data.moreInfo} />
          
          <div className="mt-10 p-8 bg-slate-800 border border-emerald-900 rounded-2xl">
            <h3 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" /> كيفية التقديم:
            </h3>
            <div className="text-lg">
              {renderContact(data.contact || data.email || data.website)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون فرعي لعرض المعلومات الأساسية (من الكود الثاني)
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase">{label}</div>
        <div className="font-semibold text-white">{value || "---"}</div>
      </div>
    </div>
  );
}

// مكون فرعي للحقول (من الكود الأول)
function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="border-r-4 border-emerald-500 pr-4">
      <span className="block text-sm text-slate-400 font-bold mb-1">{label}</span>
      <span className="block text-white text-xl">{value}</span>
    </div>
  );
}

// دالة تنسيق التواصل (دمج ذكي)
function renderContact(value) {
  if (!value) return <span className="text-slate-500">غير محدد</span>;
  
  // إذا كان كائن (Object)
  if (typeof value === 'object') {
    if (value.type === 'email') return <a href={`mailto:${value.value}`} className="text-emerald-400 underline">{value.value}</a>;
    if (value.type === 'link' || value.type === 'button-link') return <a href={value.value} target="_blank" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition">اضغط هنا للتقديم</a>;
  }

  // إذا كان نصاً (String)
  if (value.includes('@')) return <a href={`mailto:${value}`} className="text-emerald-400 underline">{value}</a>;
  if (value.startsWith('http')) return <a href={value} target="_blank" className="text-emerald-400 flex items-center gap-1 hover:underline"><LinkIcon className="w-4 h-4"/> اضغط هنا للتقديم</a>;
  
  return <span className="text-white">{value}</span>;
}