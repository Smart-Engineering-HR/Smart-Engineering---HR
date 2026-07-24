'use client';
import React from 'react';

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8" dir="rtl">
      <h1 className="text-4xl font-bold text-center mb-12 text-amber-500">الأكاديمية والتدريب الهندسي</h1>
      
      {/* عرض المسارات التعليمية */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-r-4 border-amber-500 pr-4">1. المسارات التعليمية</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* كارد الدورة */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold">بايثون في الهندسة الإنشائية</h3>
            <p className="text-slate-400 mt-2">اسم المدرب: د. مهندس خبير</p>
            <p className="text-slate-400">مدة الدورة: 40 ساعة</p>
            <button className="mt-4 w-full bg-slate-800 hover:bg-amber-500 py-2 rounded">عرض التفاصيل</button>
          </div>
        </div>
      </section>

      {/* عرض المنح */}
      <section>
        <h2 className="text-2xl font-bold mb-6 border-r-4 border-amber-500 pr-4">2. المنح الدراسية</h2>
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700">
          <p className="text-slate-300">قائمة المنح المتاحة حالياً والمحدثة من لوحة التحكم...</p>
          {/* زر التقديم المخصص */}
          <button onClick={() => window.open('/academy/apply', '_blank')} className="mt-6 bg-green-600 px-8 py-3 rounded-lg font-bold text-white">
            التقديم الاحترافي من خلالنا
          </button>
        </div>
      </section>
    </div>
  );
}