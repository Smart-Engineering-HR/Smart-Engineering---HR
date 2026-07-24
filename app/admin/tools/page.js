'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminToolsPage() {
  const [tools, setTools] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from('software_tools')
      .select('*')
      .order('id', { ascending: false });
    if (!error) setTools(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (editingId) {
      // عملية التعديل
      const { error } = await supabase
        .from('software_tools')
        .update({ ...formData })
        .eq('id', editingId);

      if (!error) {
        setMessage({ type: 'success', text: '✅ تم تحديث البيانات بنجاح!' });
        setEditingId(null);
      } else {
        setMessage({ type: 'error', text: `❌ فشل التعديل: ${error.message}` });
      }
    } else {
      // عملية الإضافة الجديدة
      const { error } = await supabase
        .from('software_tools')
        .insert([{ ...formData, status: 'Pro' }]);

      if (!error) {
        setMessage({ type: 'success', text: '✅ تم إضافة الأداة بنجاح!' });
      } else {
        setMessage({ type: 'error', text: `❌ فشل الإضافة: ${error.message}` });
      }
    }

    setFormData({ title: '', category: '', description: '' });
    setLoading(false);
    fetchTools();
  };

  const handleEdit = (tool) => {
    setEditingId(tool.id);
    setFormData({ title: tool.title, category: tool.category, description: tool.description });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الأداة نهائياً؟')) {
      const { error } = await supabase.from('software_tools').delete().eq('id', id);
      if (!error) fetchTools();
    }
  };

  return (
    <div className="min-h-screen bg-[#050a18] p-4 md:p-8 text-white text-right" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* نموذج التحكم (إضافة وتعديل) */}
        <div className={`bg-[#0a1128] border ${editingId ? 'border-yellow-500/50' : 'border-gray-800'} rounded-2xl p-8 shadow-2xl transition-all`}>
          <h1 className="text-2xl font-bold mb-6 text-blue-400">
            {editingId ? 'تعديل بيانات الأداة' : 'إضافة أداة هندسية جديدة'}
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="bg-[#111a36] border border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="اسم الأداة" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
            <select 
              className="bg-[#111a36] border border-gray-700 rounded-lg p-3 outline-none"
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              required
            >
              <option value="">اختر القسم...</option>
              <option value="تصميم إنشائي">تصميم إنشائي</option>
              <option value="حساب كميات">حساب كميات</option>
              <option value="ذكاء اصطناعي">ذكاء اصطناعي</option>
            </select>
            <textarea 
              className="md:col-span-2 bg-[#111a36] border border-gray-700 rounded-lg p-3 h-24 outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="الوصف الفني للميزة..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required 
            />
            <div className="md:col-span-2 flex gap-3">
              <button className={`flex-1 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} p-3 rounded-lg font-bold transition-all`}>
                {loading ? 'جاري المعالجة...' : (editingId ? 'تحديث البيانات' : 'إضافة الأداة')}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => {setEditingId(null); setFormData({title:'', category:'', description:''})}}
                  className="bg-gray-700 hover:bg-gray-600 px-6 rounded-lg font-bold"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
          </form>
          {message.text && <p className={`text-center mt-4 text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>}
        </div>

        {/* جدول الإدارة */}
        <div className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-sm text-right">
            <thead className="bg-[#111a36] text-blue-400">
              <tr>
                <th className="p-4">الأداة</th>
                <th className="p-4">التصنيف</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-[#0c1635] transition-colors">
                  <td className="p-4 font-medium">{tool.title}</td>
                  <td className="p-4 font-light text-gray-400">{tool.category}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(tool)}
                        className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1 rounded transition-all"
                      >
                        تعديل
                      </button>
                      <button 
                        onClick={() => handleDelete(tool.id)}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-all"
                      >
                        حذف
                      </button>
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