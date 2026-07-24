"use client";
import { useState } from 'react';

export default function AdminControl() {
  const [itemType, setItemType] = useState('job'); // 'job' or 'tender'
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    alert(`تمت إضافة ${itemType === 'job' ? 'الوظيفة' : 'المناقصة'} بنجاح!`);
    // Logic لحفظ البيانات في قاعدة البيانات
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">لوحة تحكم الهندسة الذكية - الإدارة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* نموذج إضافة وظيفة/مناقصة */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">إضافة إعلان جديد</h2>
          <select 
            className="w-full p-2 mb-4 border rounded"
            onChange={(e) => setItemType(e.target.value)}
          >
            <option value="job">وظيفة جديدة</option>
            <option value="tender">مناقصة جديدة</option>
          </select>
          <input type="text" placeholder="عنوان الإعلان" className="w-full p-2 mb-4 border rounded" onChange={(e)=>setTitle(e.target.value)} />
          <textarea placeholder="التفاصيل والشروط" className="w-full p-2 mb-4 border rounded h-32" onChange={(e)=>setDesc(e.target.value)}></textarea>
          <button onClick={handleAdd} className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold">نشر الآن</button>
        </div>

        {/* قسم الإشعارات البريدية الآلية */}
        <div className="bg-blue-900 text-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">نظام الإشعارات الآلي</h2>
          <p className="text-sm opacity-80 mb-4">عند تفعيل هذا الخيار، سيتم إرسال إيميل تلقائي لجميع المقاولين/الموظفين المسجلين عند نشر أي جديد.</p>
          <div className="flex items-center gap-4">
            <span className="bg-green-500 p-2 rounded text-xs font-bold">نشط الآن</span>
            <button className="bg-white text-blue-900 px-4 py-1 rounded-full text-sm">إيقاف مؤقت</button>
          </div>
        </div>
      </div>
    </div>
  );
}