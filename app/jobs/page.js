'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma'; // ملاحظة: في الممارسات الفضلى لـ Next.js، يُفضل جلب البيانات في Server Component منفصل

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);

  // جلب البيانات (يتم تنفيذه في المتصفح، يمكنك أيضاً استخدام Server Action)
  useEffect(() => {
    async function fetchData() {
      const data = await fetch('/api/jobs-data').then(res => res.json());
      setJobs(data);
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

      <h1 className="text-4xl font-black mb-10 text-emerald-400">قائمة الوظائف المتاحة</h1>
      
      {jobs.length === 0 ? (
        <div className="text-center p-20 border-2 border-dashed border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-xl">لا توجد وظائف متاحة حالياً، يرجى المحاولة لاحقاً.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-800 border-b border-slate-700">
                <th className="p-4">التاريخ</th>
                <th className="p-4">الجهة</th>
                <th className="p-4">المسمى الوظيفي</th>
                <th className="p-4">الفئة</th>
                <th className="p-4">الموقع</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const details = typeof job.details === 'string' ? JSON.parse(job.details) : job.details;
                
                return (
                  <tr key={job.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="p-4">{new Date(job.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td className="p-4">{details?.companyName || job.company || 'غير محدد'}</td>
                    <td className="p-4 font-bold text-emerald-400">{job.title}</td>
                    <td className="p-4">{details?.category || 'عام'}</td>
                    <td className="p-4">{details?.location || job.location || 'غير محدد'}</td>
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