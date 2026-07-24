"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { CheckCircle, XCircle, Clock, Mail, Phone, Building2, AlertTriangle } from 'lucide-react';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setErrorStatus(null);

        // التأكد من تهيئة supabase أولاً
        if (!supabase) {
          throw new Error("لم يتم تكوين اتصال Supabase بشكل صحيح في ملف الـ .env");
        }

        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setSubmissions(data || []);
      } catch (err) {
        console.error('Fetch Error:', err);
        setErrorStatus(err.message || "فشل الاتصال بخادم قاعدة البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-[#020813] text-white p-8 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-r-4 border-cyan-500 pr-4">
          <h1 className="text-3xl font-black italic">لوحة التحكم: طلبات الإعلانات</h1>
          <p className="text-slate-400 mt-2">إدارة طلبات "أعلن معنا" الواردة</p>
        </div>

        {/* عرض حالة الخطأ بشكل واضح للمستخدم */}
        {errorStatus && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-500 p-4 rounded-xl flex items-center gap-3 font-bold">
            <AlertTriangle className="h-5 w-5" />
            <span>خطأ في الربط: {errorStatus}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 animate-pulse text-cyan-500 font-black">جاري جلب البيانات من الخادم...</div>
        ) : (
          <div className="grid gap-6">
            {!errorStatus && submissions.length > 0 ? (
              submissions.map((sub) => (
                <div key={sub.id} className="bg-[#030d1a] border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 transition shadow-xl">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="bg-cyan-500/10 text-cyan-500 px-4 py-1 rounded-full text-xs font-bold">
                          {sub.advertiseType || 'إعلان'}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-cyan-500" /> {sub.companyName}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2 font-medium"><Mail className="h-4 w-4" /> {sub.email}</div>
                        <div className="flex items-center gap-2 font-medium"><Phone className="h-4 w-4" /> {sub.phone}</div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-r border-slate-800 pt-4 md:pt-0 md:pr-6">
                      <button className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-6 py-2 rounded-xl hover:bg-emerald-500 hover:text-black transition font-bold text-sm">
                        <CheckCircle className="h-4 w-4" /> قبول
                      </button>
                      <button className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-6 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition font-bold text-sm">
                        <XCircle className="h-4 w-4" /> رفض
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : !errorStatus && (
              <div className="text-center py-20 bg-[#030d1a] border border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-500 italic">لا توجد طلبات مسجلة في قاعدة البيانات حالياً.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}