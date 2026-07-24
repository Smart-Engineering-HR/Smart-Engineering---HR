"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Save, X, Eye } from 'lucide-react';

export default function AdminSoftwareTools() {
  const [tools, setTools] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTool, setCurrentTool] = useState({ id: null, title: '', category: 'prompt', stage: 'design', status: 'مجانية', problem: '' });

  // مزامنة البيانات مع LocalStorage لتعكس التغييرات فورا للجمهور
  useEffect(() => {
    const storedTools = JSON.parse(localStorage.getItem('smart_engineering_tools')) || getDefaultTools();
    const storedRequests = JSON.parse(localStorage.getItem('smart_engineering_requests')) || [];
    setTools(storedTools);
    setRequests(storedRequests);
  }, []);

  const saveTools = (newTools) => {
    setTools(newTools);
    localStorage.setItem('smart_engineering_tools', JSON.stringify(newTools));
  };

  const handleSaveTool = () => {
    if (!currentTool.title || !currentTool.problem) {
      alert("يرجى تعبئة جميع الحقول.");
      return;
    }

    if (currentTool.id) {
      // تعديل
      const updatedTools = tools.map(t => t.id === currentTool.id ? currentTool : t);
      saveTools(updatedTools);
    } else {
      // إضافة جديدة
      const newTool = { ...currentTool, id: Date.now() };
      saveTools([...tools, newTool]);
    }
    
    setIsEditing(false);
    setCurrentTool({ id: null, title: '', category: 'prompt', stage: 'design', status: 'مجانية', problem: '' });
  };

  const handleEdit = (tool) => {
    setCurrentTool(tool);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من حذف هذه الأداة نهائياً؟")) {
      saveTools(tools.filter(t => t.id !== id));
    }
  };

  const deleteRequest = (id) => {
    if (confirm("حذف الطلب؟")) {
      const updatedRequests = requests.filter(r => r.id !== id);
      setRequests(updatedRequests);
      localStorage.setItem('smart_engineering_requests', JSON.stringify(updatedRequests));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans" dir="rtl">
      {/* الشريط العلوي */}
      <header className="bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-2xl font-bold text-white">لوحة تحكم: برمجيات وأدوات</h1>
          <p className="text-sm text-gray-400 mt-1">إدارة شاملة للمحتوى والطلبات لمنصة الهندسة الذكية</p>
        </div>
        <div className="flex gap-4">
          <Link href="/software-tools" target="_blank" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition border border-gray-700">
            <Eye size={18} />
            معاينة صفحة الجمهور
          </Link>
          <button onClick={() => { setIsEditing(true); setCurrentTool({ id: null, title: '', category: 'prompt', stage: 'design', status: 'مجانية', problem: '' }); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            إضافة أداة جديدة
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* قسم إدارة الأدوات (الجدول) */}
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">الأدوات المنشورة ({tools.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-800/50 text-gray-400 text-sm">
                <tr>
                  <th className="p-4 font-medium">اسم الأداة</th>
                  <th className="p-4 font-medium">القسم</th>
                  <th className="p-4 font-medium">المرحلة</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tools.map(tool => (
                  <tr key={tool.id} className="hover:bg-gray-800/30 transition">
                    <td className="p-4 font-medium text-white">{tool.title}</td>
                    <td className="p-4">
                      {tool.category === 'prompt' ? 'هندسة الأوامر' : tool.category === 'webapps' ? 'تطبيقات الويب' : tool.category === 'automation' ? 'أتمتة' : tool.category === 'ai' ? 'ذكاء اصطناعي' : 'إدارة'}
                    </td>
                    <td className="p-4">{tool.stage === 'design' ? 'تصميم' : tool.stage === 'execution' ? 'تنفيذ' : 'مكتب فني'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-md ${tool.status === 'مجانية' ? 'bg-green-900/50 text-green-400' : tool.status === 'Pro' ? 'bg-purple-900/50 text-purple-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                        {tool.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEdit(tool)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(tool.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* قسم الطلبات الواردة */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[800px]">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">طلبات الأدوات الخاصة ({requests.length})</h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {requests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">لا توجد طلبات جديدة.</p>
            ) : (
              requests.map(req => (
                <div key={req.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white">{req.name}</h3>
                    <span className="text-xs text-gray-500">{req.date}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1"><span className="text-gray-500">الإيميل:</span> {req.email}</p>
                  <p className="text-sm text-gray-400 mb-3"><span className="text-gray-500">التلفون:</span> {req.phone}</p>
                  <div className="bg-gray-900 p-3 rounded-lg text-sm text-gray-300 mb-3 border border-gray-700">
                    {req.details}
                  </div>
                  <button onClick={() => deleteRequest(req.id)} className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1">
                    <Trash2 size={14} /> حذف الطلب
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* نافذة الإضافة / التعديل المنبثقة (Modal) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">{currentTool.id ? 'تعديل الأداة' : 'إضافة أداة جديدة'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">اسم الأداة</label>
                <input type="text" value={currentTool.title} onChange={e => setCurrentTool({...currentTool, title: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="مثال: حاسبة تقوية الأعمدة" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">القسم</label>
                  <select value={currentTool.category} onChange={e => setCurrentTool({...currentTool, category: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="prompt">هندسة الأوامر</option>
                    <option value="webapps">تطبيقات الويب الحية</option>
                    <option value="automation">برمجيات الأتمتة</option>
                    <option value="ai">حلول الذكاء الاصطناعي</option>
                    <option value="management">الإدارة والتحكم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">مرحلة المشروع</label>
                  <select value={currentTool.stage} onChange={e => setCurrentTool({...currentTool, stage: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="design">مرحلة التصميم</option>
                    <option value="execution">مرحلة التنفيذ والموقع</option>
                    <option value="tech_office">المكتب الفني</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">الحالة (التسعير)</label>
                <select value={currentTool.status} onChange={e => setCurrentTool({...currentTool, status: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="مجانية">مجانية</option>
                  <option value="تجريبية">تجريبية</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">المشكلة التي تحلها الأداة (الوصف)</label>
                <textarea value={currentTool.problem} onChange={e => setCurrentTool({...currentTool, problem: e.target.value})} rows="3" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="وصف موجز للمشكلة وكيفية حلها..."></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end gap-4 bg-gray-900/50">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">إلغاء</button>
              <button onClick={handleSaveTool} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20">
                <Save size={18} /> حفظ الأداة والنشر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// دالة مساعدة لتهيئة البيانات في حال عدم وجودها
function getDefaultTools() {
  return [
    { id: 1, title: 'مولد برومبتات التحليل الإنشائي', category: 'prompt', stage: 'design', status: 'مجانية', problem: 'يصيغ لك أوامر دقيقة لـ ChatGPT لتحليل تقارير التربة وتصميم الأساسات.' },
    { id: 2, title: 'حاسبة تقوية الأعمدة التفاعلية', category: 'webapps', stage: 'execution', status: 'Pro', problem: 'أدخل بيانات العمود واحصل على تصميم التقوية بالـ FRP أو القمصان الخرسانية فوراً.' }
  ];
}