"use client";

import React, { useState, useEffect } from 'react';
import { Download, Video, BookOpen, Layers, CheckSquare } from 'lucide-react';

export default function TrainingHubUserPage() {
  const [codes, setCodes] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // فورم حجز مقعد في كورس أو ندوة
  const [regForm, setRegForm] = useState({ fullName: '', email: '', phone: '' });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHubData();
  }, []);

  const fetchHubData = async () => {
    try {
      const res = await fetch('/api/admin/training');
      const json = await res.json();
      if (res.ok) {
        setCodes(json.codes);
        setItems(json.trainingItems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'trainingReg',
          data: { ...regForm, trainingItemId: selectedItem.id }
        })
      });
      if (res.ok) {
        alert(`تم تقديم طلب حجز المقعد لـ (${selectedItem.title}). سيقوم المكتب الفني بمراجعة الشروط والرسوم وتفعيل حسابك خلال ساعات.`);
        setRegForm({ fullName: '', email: '', phone: '' });
        setSelectedItem(null);
      }
    } catch (err) {
      alert("خطأ أثناء إرسال طلب الحجز");
    }
  };

  if (loading) return <div className="text-center text-white p-20">جاري تحميل منصة التطوير والمسارات الهندسية...</div>;

  return (
    <div className="min-h-screen bg-[#020813] text-white p-6 md:p-10" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* قسم تفعيل تحميل المكتبة الإنشائية وأكواد البناء */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="h-6 w-6" /> المكتبة الإنشائية وأكواد البناء المعتمدة (تحميل مباشر للمتصفحين)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {codes.map((code) => (
              <div key={code.id} className="bg-[#030d1a] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4 hover:border-cyan-500/30 transition">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{code.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">التصنيف: {code.category}</p>
                </div>
                <a href={code.fileUrl} target="_blank" rel="noreferrer" className="w-full text-center flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-cyan-400 py-2 rounded-xl text-xs font-bold hover:bg-cyan-500 hover:text-black transition">
                  <Download className="h-4 w-4" /> تحميل الكود المعتمد PDF
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* قسم الندوات والمسارات التعليمية مع حجز المقاعد والتحقق من الشروط والرسوم */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="h-6 w-6" /> مركز التطوير، الندوات المباشرة، والمسارات التعليمية الاحترافية
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-[#030d1a] border border-slate-800 p-6 rounded-[2rem] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold bg-slate-900 border border-slate-800 text-emerald-400 px-2.5 py-1 rounded-md uppercase">{item.category}</span>
                  <h3 className="font-bold text-base text-white pt-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed"><span className="text-slate-500 block mb-1">الشروط المسبقة:</span> {item.requirements}</p>
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">رسوم الاستثمار</span>
                    <span className="text-sm font-black text-white">{item.price}</span>
                  </div>
                  <button onClick={() => setSelectedItem(item)} className="bg-cyan-500 text-black text-xs font-black px-4 py-2.5 rounded-xl hover:bg-cyan-400 transition">
                    التسجيل وحجز مقعد
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* نافذة الحجز والتسجيل عند اختيار مادة تدريبية */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#030d1a] border border-slate-800 p-6 rounded-[2.5rem] max-w-md w-full space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-cyan-400">طلب تسجيل وانضمام</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedItem.title}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-slate-500 hover:text-white font-bold text-sm">✕</button>
              </div>
              <form onSubmit={handleRegister} className="space-y-3 pt-2">
                <input type="text" placeholder="اسمك المهني الثلاثي" value={regForm.fullName} onChange={(e) => setRegForm({...regForm, fullName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500" required />
                <input type="email" placeholder="البريد الإلكتروني للتواصل ومواد الدورة" value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500" required />
                <input type="tel" placeholder="رقم الواتساب الشخصي للتأكيد" value={regForm.phone} onChange={(e) => setRegForm({...regForm, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500" required />
                
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p>• الرسوم المقررة: <span className="text-white font-bold">{selectedItem.price}</span></p>
                  <p>• حضورك يتطلب مطابقة الشروط وموافقة الإدارة والتحقق من سداد الرسوم إن وجدت.</p>
                </div>

                <button type="submit" className="w-full bg-cyan-500 text-black font-black p-3 rounded-xl text-xs hover:bg-cyan-400 transition">
                  إرسال الطلب للمراجعة والموافقة
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}