'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';

export default function TendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState([]);

  // جلب البيانات (يُنصح بنقل هذا لمنطق API Route أو Server Action في المشاريع الكبيرة)
  useEffect(() => {
    async function fetchData() {
      // بما أننا داخل صفحة العميل، نستخدم API لجلب البيانات من Prisma
      const res = await fetch('/api/tenders-data'); 
      const data = await res.json();
      setTenders(data);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 md:p-20" dir="rtl">
      {/* دمج زر العودة */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-emerald-500 hover:text-white mb-6 transition"
      >
        <ArrowRight size={20} /> العودة للخلف
      </button>

      <h1 className="text-4xl font-black mb-10 text-amber-400">قائمة المناقصات المتاحة</h1>
      
      {tenders.length === 0 ? (
        <div className="text-center p-20 border-2 border-dashed border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-xl">لا توجد مناقصات متاحة حالياً، يرجى المحاولة لاحقاً.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-800 border-b border-slate-700">
                <th className="p-4">تاريخ النشر</th>
                <th className="p-4">الجهة</th>
                <th className="p-4">عنوان المناقصة</th>
                <th className="p-4">الموقع</th>
                <th className="p-4">تاريخ الانتهاء</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((tender) => {
                // معالجة آمنة لبيانات الـ JSON
                const details = typeof tender.details === 'string' ? JSON.parse(tender.details) : tender.details;
                
                return (
                  <tr key={tender.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="p-4">{new Date(tender.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td className="p-4">{details?.companyName || tender.company || 'غير محدد'}</td>
                    <td className="p-4 font-bold text-amber-400">{tender.title}</td>
                    <td className="p-4">{details?.location || tender.location || 'غير محدد'}</td>
                    <td className="p-4 text-red-400">{details?.expiryDate || tender.expiryDate || 'غير محدد'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}