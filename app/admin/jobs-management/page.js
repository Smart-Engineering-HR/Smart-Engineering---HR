'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminJobsManagement() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('وظيفة'); // التحكم في نوع النموذج
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // حالة البيانات الموحدة
  const [formData, setFormData] = useState({
    title: '', company: '', company_address: '', category: '', 
    location: '', posted_date: '', expiry_date: '', 
    service_title: '', description: '', file_url: ''
  });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, item_type: type };

    if (editingId) {
      await supabase.from('jobs').update(payload).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('jobs').insert([payload]);
    }

    resetForm();
    setLoading(false);
    fetchItems();
  };

  const resetForm = () => {
    setFormData({ title: '', company: '', company_address: '', category: '', location: '', posted_date: '', expiry_date: '', service_title: '', description: '', file_url: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من الحذف النهائي؟')) {
      await supabase.from('jobs').delete().eq('id', id);
      fetchItems();
    }
  };

  return (
    <div className="min-h-screen bg-[#050a18] p-4 md:p-8 text-white text-right" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* لوحة التحكم العلوية */}
        <div className="bg-[#0a1128] border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold text-blue-400">
              {editingId ? '🛠️ تعديل البيانات' : '➕ إضافة إعلان جديد'}
            </h1>
            <div className="flex bg-[#111a36] rounded-2xl p-1 border border-gray-700">
              <button onClick={() => {setType('وظيفة'); resetForm();}} className={`px-6 py-2 rounded-xl transition-all ${type === 'وظيفة' ? 'bg-blue-600 shadow-lg' : 'text-gray-400'}`}>وظيفة</button>
              <button onClick={() => {setType('مناقصة'); resetForm();}} className={`px-6 py-2 rounded-xl transition-all ${type === 'مناقصة' ? 'bg-blue-600 shadow-lg' : 'text-gray-400'}`}>مناقصة</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* الحقول المشتركة */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 mr-2">العنوان الرئيسي</label>
              <input className="w-full bg-[#111a36] border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder={type === 'وظيفة' ? "مسمى الوظيفة" : "عنوان المناقصة"} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 mr-2">المنظمة / الشركة</label>
              <input className="w-full bg-[#111a36] border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="اسم الشركة المعلنة" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 mr-2 text-blue-300">📅 تاريخ النشر</label>
              <input className="w-full bg-[#111a36] border border-gray-700 rounded-xl p-4 outline-none" type="date" value={formData.posted_date} onChange={e => setFormData({...formData, posted_date: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 mr-2">📍 الموقع</label>
              <input className="w-full bg-[#111a36] border border-gray-700 rounded-xl p-4 outline-none" placeholder="المدينة أو (عن بعد)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>

            {/* حقول خاصة بالوظيفة */}
            {type === 'وظيفة' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 mr-2">🏢 عنوان الشركة</label>
                  <input className="w-full bg-[#111a36] border border-gray-700 rounded-xl p-4 outline-none" placeholder="العنوان التفصيلي للشركة" value={formData.company_address} onChange={e => setFormData({...formData, company_address: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 mr-2">📂 فئة الوظيفة</label>
                  <select className="w-full bg-[#111a36] border border-gray-700 rounded-xl p-4 outline-none text-gray-300" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                    <option value="">اختر الفئة...</option>
                    <option value="هندسية">هندسية</option>
                    <option value="تنموية">تنموية</option>
                    <option value="إنسانية">إنسانية</option>
                    <option value="إدارية">إدارية</option>
                  </select>
                </div>
              </>
            )}

            {/* حقول خاصة بالمناقصة */}
            {type === 'مناقصة' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 mr-2">🛠️ عنوان الخدمات</label>
                  <input className="w-full bg-[#111a36] border border-gray-700 rounded-xl p-4 outline-none" placeholder="وصف موجز للخدمات المطلوبة" value={formData.service_title} onChange={e => setFormData({...formData, service_title: e.target.value})} />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs text-red-400 mr-2 font-bold">🚫 إغلاق الإعلان (تاريخ الانتهاء)</label>
              <input className="w-full bg-[#111a36] border border-red-900/30 rounded-xl p-4 outline-none" type="date" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 mr-2">🔗 رابط ملف (PDF/صورة)</label>
              <input className="w-full bg-[#111a36] border border-gray-700 rounded-xl p-4 outline-none text-sm" placeholder="ضع رابط الملف هنا إن وجد" value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})} />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs text-gray-400 mr-2">📝 الشروط والتفاصيل الكاملة</label>
              <textarea className="w-full bg-[#111a36] border border-gray-700 rounded-2xl p-4 h-48 outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed" placeholder="اكتب شروط الوظيفة، تفاصيل الإعلان، ومعلومات الشركة بالتفصيل هنا..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>

            <button className={`md:col-span-2 p-5 rounded-2xl font-bold text-lg transition-all transform active:scale-95 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20 shadow-xl'}`}>
              {loading ? 'جاري المعالجة...' : (editingId ? 'تحديث البيانات المنشورة' : '🚀 نشر الإعلان الآن')}
            </button>
          </form>
        </div>

        {/* الجدول الزمني للإدارة */}
        <div className="bg-[#0a1128] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800 bg-[#111a36]/50">
            <h2 className="text-lg font-bold">إدارة المحتوى الحالي</h2>
          </div>
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#111a36] text-blue-400 text-xs">
                <th className="p-4 border-b border-gray-800">العنوان</th>
                <th className="p-4 border-b border-gray-800">النوع</th>
                <th className="p-4 border-b border-gray-800">تاريخ النشر</th>
                <th className="p-4 border-b border-gray-800 text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-800 hover:bg-[#111a36]/30 transition-colors">
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4 font-light"><span className={`px-2 py-1 rounded-md text-[10px] ${item.item_type === 'وظيفة' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>{item.item_type || 'وظيفة'}</span></td>
                  <td className="p-4 text-gray-500 text-xs">{item.posted_date}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { setEditingId(item.id); setFormData(item); setType(item.item_type || 'وظيفة'); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-400 hover:text-white transition-colors">تعديل</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-white transition-colors">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}