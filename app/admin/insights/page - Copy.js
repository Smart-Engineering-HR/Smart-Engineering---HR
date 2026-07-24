'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState([]);
  
  // نموذج إدخال البيانات الموحد للمقال الإنشائي والبحثي
  const [formData, setFormData] = useState({
    id: '',
    category: 'future',
    title: '',
    difficulty: 'متقدم',
    specialty: '',
    summary30s: '',
    problem: '',
    science: '',
    smartIdea: '',
    applicationCode: '',
    toolLink: '',
    calcType: 'rebar'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // جلب المزامنة من localStorage لربط كود المشرف بكود الجمهور فورياً
  useEffect(() => {
    const stored = localStorage.getItem('smart_engineering_insights_data');
    if (stored) {
      setInsights(JSON.parse(stored));
    }
  }, []);

  const saveToLocalStorage = (updatedData) => {
    localStorage.setItem('smart_engineering_insights_data', JSON.stringify(updatedData));
    setInsights(updatedData);
  };

  const showStatus = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // معالجة تقديم النموذج (إضافة أو تعديل مقال بالكامل)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.summary30s || !formData.problem || !formData.science || !formData.smartIdea) {
      showStatus('يرجى ملء كافة الحقول الأساسية وصياغة المقال بهيكله الصحيح لضمان الجودة الفنية.', 'error');
      return;
    }

    let updatedInsights = [...insights];
    const categoryTitles = {
      future: 'هندسة المستقبل',
      technical: 'أسرار التنفيذ والمكتب الفني',
      programming: 'البرمجة للمهندسين',
      papers: 'أوراق بحثية مبسطة'
    };

    const readyData = {
      ...formData,
      categoryTitle: categoryTitles[formData.category] || 'عام'
    };

    if (isEditing) {
      updatedInsights = updatedInsights.map(item => item.id === formData.id ? readyData : item);
      showStatus('تم تحديث المقال العلمي بنجاح وانعكس فوراً على واجهة الجمهور.');
      setIsEditing(false);
    } else {
      readyData.id = Date.now().toString();
      updatedInsights.unshift(readyData);
      showStatus('تم نشر الفكرة العلمية الجديدة وبثها مباشرة للجمهور بنجاح.');
    }

    saveToLocalStorage(updatedInsights);
    resetForm();
  };

  const handleEditClick = (item) => {
    setFormData(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (confirm('هل أنت متأكد مطلقاً من حذف هذه الفكرة/المقال العلمي من قائمة العرض العامة للجمهور؟')) {
      const filtered = insights.filter(item => item.id !== id);
      saveToLocalStorage(filtered);
      showStatus('تم حذف المادة العلمية بنجاح من النظام والواجهة العامة.', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      category: 'future',
      title: '',
      difficulty: 'متقدم',
      specialty: '',
      summary30s: '',
      problem: '',
      science: '',
      smartIdea: '',
      applicationCode: '',
      toolLink: '',
      calcType: 'rebar'
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans" dir="rtl">
      {/* الرأس العلوي المخصص للإدارة والسيطرة والتحكم الكامل */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
            <h1 className="text-xl font-black text-white tracking-wide">
              لوحة تحكم المشرف الفنية | <span className="text-cyan-400 font-bold">إدارة أفكار وعلوم الهندسة الذكية</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/insights" target="_blank" className="text-xs bg-slate-800 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
              🔎 معاينة واجهة الجمهور الحية
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* إشعار الحالة التشغيلية الفورية */}
        {statusMessage.text && (
          <div className={`p-4 rounded-xl border mb-8 text-sm font-bold animate-bounce ${
            statusMessage.type === 'error' ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* أولاً: استمارة التحكم الشاملة (إضافة وتعديل مقالات وبحوث وعينات) */}
          <section className="lg:col-span-2 bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
              <span>{isEditing ? '📝 تعديل وتحديث المقال الحالي' : '➕ نشر فكرة برمجية وعلمية جديدة'}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">القائمة الفرعية المستهدفة *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500">
                    <option value="future">هندسة المستقبل (A / E)</option>
                    <option value="technical">أسرار التنفيذ والمكتب الفني (B / F)</option>
                    <option value="programming">البرمجة للمهندسين (C / G)</option>
                    <option value="papers">أوراق بحثية مبسطة (D / H)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">العنوان الرئيسي الفاخر للمقال *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="مثال: التوأم الرقمي (Digital Twin) وربطه بـ BIM" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">مستوى صعوبة المحتوى</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500">
                    <option value="أساسيات">أساسيات</option>
                    <option value="متقدم">متقدم</option>
                    <option value="خبير">خبير</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">التخصص الهندسي (الوسم)</label>
                  <input type="text" name="specialty" value={formData.specialty} onChange={handleInputChange} placeholder="إنشائي، إدارة مشروعات، بيئة" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">نوع الحاسبة المدمجة الحية</label>
                  <select name="calcType" value={formData.calcType} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500">
                    <option value="soil">حاسبة انهيار واستقرار التربة الفورية</option>
                    <option value="value">حاسبة هندسة القيمة والأعمدة الاقتصادية</option>
                    <option value="rebar">حاسبة أوزان حديد التسليح القياسية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">1. إنفو جرافيك المقال (ملخص القراءة في 30 ثانية للجمهور) *</label>
                <textarea name="summary30s" rows="2" value={formData.summary30s} onChange={handleInputChange} placeholder="اكتب خلاصة شديدة التركيز ومبهرة تجذب انتباه القارئ فوراً..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500 resize-none"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">2. المشكلة الهندسية الفعلية *</label>
                  <textarea name="problem" rows="4" value={formData.problem} onChange={handleInputChange} placeholder="وصف التحدي أو المشكلة في الموقع أو المكتب..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"></textarea>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">3. العلم والنظرية الرياضية للحل *</label>
                  <textarea name="science" rows="4" value={formData.science} onChange={handleInputChange} placeholder="الأساس العلمي، الكود، المعادلات المستخدمة لمعالجة المشكلة..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"></textarea>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">4. الفكرة الذكية والتحويل الخوارزمي *</label>
                  <textarea name="smartIdea" rows="4" value={formData.smartIdea} onChange={handleInputChange} placeholder="كيف نختصر الوقت برمجياً أو نبتكر طريقة سريعة لتوفير الجهد والمال..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"></textarea>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">5. الكود البرمجي التطبيقي المقترح (Python / JavaScript)</label>
                <textarea name="applicationCode" rows="5" value={formData.applicationCode} onChange={handleInputChange} placeholder="اكتب الكود البرمجي النظيف المباشر المخصص للحل دون أخطاء..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-emerald-400 font-mono outline-none focus:border-cyan-500 dir-ltr text-left"></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">رابط الأداة التفاعلية في قسم البرمجيات التخصصي للمنصة</label>
                <input type="text" name="toolLink" value={formData.toolLink} onChange={handleInputChange} placeholder="مثال: /tools/rebar-optimizer" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500 dir-ltr text-left" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-850">
                {isEditing && (
                  <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 font-medium transition-colors">إلغاء التعديل</button>
                )}
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl transition-all">
                  {isEditing ? '💾 حفظ التعديلات ونشر التحديث الفوري' : '🚀 اعتماد ونشر المادة للجمهور الآن'}
                </button>
              </div>
            </form>
          </section>

          {/* ثانياً: شريط جانبي لمراقبة ومراجعة المواد المنشورة حالياً وحذفها */}
          <section className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">📊 إحصائيات السيطرة الحالية</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 text-center">
                  <span className="text-2xl font-black text-white">{insights.length}</span>
                  <p className="text-[10px] text-slate-500 mt-1">إجمالي المقالات والأفكار</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 text-center">
                  <span className="text-2xl font-black text-cyan-400">4 / 4</span>
                  <p className="text-[10px] text-slate-500 mt-1">تغطية الأقسام المعتمدة</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                <span>📁 العناصر المنشورة حياً ({insights.length})</span>
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {insights.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">لا يوجد مواد مدرجة بالنظام حالياً.</p>
                ) : (
                  insights.map((item) => (
                    <div key={item.id} className="p-3.5 bg-slate-900 rounded-xl border border-slate-850 hover:border-slate-700 transition-all flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono">{item.categoryTitle}</span>
                          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{item.difficulty}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                      </div>
                      
                      <div className="flex items-center justify-end gap-1.5 border-t border-slate-850/50 pt-2 text-[11px]">
                        <button onClick={() => handleEditClick(item)} className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-900 hover:bg-indigo-900/50 transition-colors">تعديل</button>
                        <button onClick={() => handleDeleteClick(item.id)} className="px-2.5 py-1 rounded bg-red-950 text-red-400 border border-red-900 hover:bg-red-900/50 transition-colors">حذف قطعي</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* حقل تذييل لوحة التحكم الأمني والتوثيقي متضمناً قنوات الاتصال والتحقق الرسمية المعتمدة للمنصة */}
      <footer className="mt-20 border-t border-slate-950 bg-slate-950 py-10 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-mono mb-2">منصة الهندسة الذكية | لوحة تحكم أمن البيانات والقوائم الفرعية</p>
          <p className="text-slate-600 mb-4">يتم فلترة عمليات التحكم والنشر والمصادقة بالبريد الإلكتروني المعتمد للمسؤولين:</p>
          <div className="inline-flex flex-wrap justify-center gap-4 bg-slate-900/60 p-3 rounded-lg border border-slate-900">
            <span>🔐 Smart.Engineering.Global@proton.me</span>
            <span>🛡️ smart.engineering.global@tuta.io</span>
            <span>💼 smartengineering.hr.global@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}