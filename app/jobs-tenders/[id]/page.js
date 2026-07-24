'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Building2, MapPin, ArrowRight, Briefcase, FileText, Globe } from 'lucide-react';

export default function PostingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [posting, setPosting] = useState(null);
  const [extraFields, setExtraFields] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        // قراءة البيانات المخصصة للإعلان الفردي بناءً على الـ id من الـ API
        const res = await fetch(`/api/postings?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setPosting(data);
          try {
            // محاولة قراءة الحقول التفصيلية الـ 14 أو 22 إذا كانت مخزنة كـ JSON في حقل moreInfo
            setExtraFields(JSON.parse(data.moreInfo));
          } catch(e) {
            setExtraFields({}); // في حال كان نصاً عادياً قادماً من الجمهور
          }
        } else {
          setPosting(null);
        }
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id]);

  // دالة معالجة زر العودة الاحترافية (تغلق التبويب الجديد، أو تحول للبوابة فوراً إذا تم التحديث)
  const handleBack = () => {
    if (window.history.length > 1 && window.opener) {
      window.close();
    } else {
      router.push('/jobs-tenders');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans text-white" dir="rtl">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">جاري تحميل وتوثيق مستندات الإعلان الهندسي...</p>
        </div>
      </div>
    );
  }

  if (!posting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans text-white" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md space-y-4 shadow-2xl">
          <p className="text-amber-400 font-black text-lg">⚠️ عذراً، لم يتم العثور على هذا الطلب!</p>
          <p className="text-xs text-slate-400">ربما تم حذف هذا الإعلان بواسطة الإدارة المطلقة أو انتهت فترة صلاحيته.</p>
          <button onClick={handleBack} className="bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-xl text-xs transition hover:bg-amber-400">العودة للبوابة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 lg:p-8 selection:bg-amber-500 selection:text-slate-900" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* شريط التحكم العلوي وتفعيل زر العودة الاحترافي */}
        <div className="flex justify-between items-center">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 font-black bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition-all active:scale-95"
          >
            <ArrowRight className="w-4 h-4" /> العودة إلى بوابة الوظائف والمناقصات
          </button>
          <span className="text-[11px] font-bold text-slate-500">معرّف السجل: {posting.id}</span>
        </div>

        {/* الهيدر أو اللوحة العريضة العلوية للإعلان المنفرد */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <span className={`inline-block px-3 py-1 rounded-md text-xs font-black mb-4 ${posting.advertiseType === 'مناقصة' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
            {posting.advertiseType === 'مناقصة' ? <FileText className="w-3.5 h-3.5 inline ml-1" /> : <Briefcase className="w-3.5 h-3.5 inline ml-1" />} {posting.advertiseType} رسمية ومعتمدة
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
            {posting.companyName}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs text-slate-400 font-bold">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /> <span>الموقع الجغرافي: <strong className="text-white">{posting.address}</strong></span></div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-amber-500" /> <span>موقع التقديم / المستندات: <strong className="text-white underline break-all">{posting.website}</strong></span></div>
          </div>
        </div>

        {/* الحقول والبيانات المفصلة المستخرجة بالكامل */}
        <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
          <h2 className="text-base font-black text-amber-400 border-r-4 border-amber-500 pr-3 pb-0.5">الشروط، المواصفات وحقول البيانات الكاملة المدخلة:</h2>
          
          <div className="grid grid-cols-1 gap-3 pt-2">
            {Object.keys(extraFields).length > 0 ? (
              Object.entries(extraFields).map(([key, value]) => {
                if (!value || key.startsWith('_')) return null; // تخطي الحقول الهيكلية الداخلية المساعدة
                return (
                  <div key={key} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                    <span className="block text-xs font-black text-amber-500/80">{key}</span>
                    <p className="text-slate-200 font-bold whitespace-pre-line leading-relaxed text-base md:text-lg">{String(value)}</p>
                  </div>
                );
              })
            ) : (
              // آلية عودة مرنة (Fallback) لعرض الحقل النصي العام المتكامل
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 text-slate-200 font-bold text-base whitespace-pre-line leading-relaxed">
                {posting.moreInfo}
              </div>
            )}
          </div>
        </div>

        {/* صندوق التقديم النهائي والتعليمات الإرشادية للزوار */}
        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl space-y-3">
          <h3 className="font-black text-amber-400 text-sm">ℹ️ تعليمات وطريقة التقديم:</h3>
          <p className="text-xs text-slate-300 font-bold leading-relaxed">
            يرجى مراجعة الشروط والمستندات المطلوبة والمحددة في الحقول أعلاه بدقة هندسية عالية، والتوجه بالملفات أو المراسلة عبر الرابط أو العناوين المذكورة قبل تاريخ انتهاء الإعلان المرفق.
          </p>
        </div>

        <div className="text-center text-[10px] text-slate-600 pt-4">
          المنصة الذكية لإدارة الموارد البشرية والمناقصات الهندسية Smart Engineering & HR © 2026.
        </div>

      </div>
    </div>
  );
}