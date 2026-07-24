'use client';

import React, { useState, useEffect } from 'react';

// المجموعات الأولية والمستخدمين الافتراضيين لنظام المراقبة والاستبعاد للتحكم الشامل للجمهور
const initialUsers = [
  { id: 'u1', name: 'م. أحمد خالد الرشيدي', email: 'ahmed@example.com', role: 'جمهور', status: 'نشط' },
  { id: 'u2', name: 'م. سارة عبد الله طاهر', email: 'sara.eng@example.com', role: 'جمهور', status: 'نشط' },
  { id: 'u3', name: 'م. فادي غسان الشامي', email: 'fadi.shami@example.com', role: 'جمهور', status: 'محظور' }
];

export default function AdminSoftwareToolsPage() {
  const [tools, setTools] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('manage-tools');

  // حقول الإضافة والتعديل للبرمجيات والأدوات (تأكيد تعبئة كامل الحقول منعاً للأخطاء)
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    problemSolved: '',
    category: 'prompt-engineering',
    phase: 'design',
    status: 'Free',
    icon: 'code',
    template: '',
    input_area: '',
    input_price: '',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-23024-large.mp4'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotification, setAdminNotification] = useState('');

  useEffect(() => {
    // جلب البيانات ومزامنتها مباشرة مع واجهة الجمهور
    const storedTools = localStorage.getItem('smart_engineering_tools');
    if (storedTools) setTools(JSON.parse(storedTools));

    const storedOrders = localStorage.getItem('smart_engineering_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedUsers = localStorage.getItem('smart_engineering_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('smart_engineering_users', JSON.stringify(initialUsers));
    }
  }, []);

  // دالة تحديث التخزين ومزامنتها الفورية مع الجمهور دون تعديل الكود
  const updateStorage = (updatedTools) => {
    setTools(updatedTools);
    localStorage.setItem('smart_engineering_tools', JSON.stringify(updatedTools));
    // إطلاق حدث التحديث المتزامن للمتصفح لتحديث النوافذ المفتوحة الأخرى تلقائياً
    window.dispatchEvent(new Event('storage'));
  };

  // معالجة وحفظ البيانات (إضافة / تعديل) مع وجوب تعبئة الحقول المطلوبة لضمان سلامة العرض للجمهور
  const handleSaveTool = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.problemSolved || !formData.template) {
      alert('خطأ إداري: يجب تعبئة جميع الحقول والبيانات الأساسية بدقة مطلقة قبل النشر للجمهور.');
      return;
    }

    let updatedTools = [...tools];
    if (isEditing) {
      updatedTools = tools.map(t => t.id === formData.id ? { ...formData, input_area: Number(formData.input_area), input_price: Number(formData.input_price) } : t);
      setAdminNotification('تم تعديل بيانات الأداة بنجاح، وجاري ترحيل التحديثات لواجهة الجمهور فورياً.');
    } else {
      const newTool = {
        ...formData,
        id: Date.now().toString(),
        input_area: Number(formData.input_area) || 200,
        input_price: Number(formData.input_price) || 10000
      };
      updatedTools.push(newTool);
      setAdminNotification('تم نشر الأداة الهندسية الجديدة بنجاح في القوائم المخصصة للجمهور.');
    }

    updateStorage(updatedTools);
    resetForm();
    setTimeout(() => setAdminNotification(''), 4000);
  };

  const handleEditClick = (tool) => {
    setFormData(tool);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // دالة حذف أداة هندسية وسحبها فورياً من شاشات الجمهور
  const handleDeleteClick = (id) => {
    if (confirm('تأكيد السيطرة والتحكم: هل أنت متأكد من حذف هذه الأداة نهائياً من شاشة الجمهور؟')) {
      const updated = tools.filter(t => t.id !== id);
      updateStorage(updated);
      setAdminNotification('تم إزالة الأداة والملف من قوائم العرض العامة للجمهور.');
      setTimeout(() => setAdminNotification(''), 4000);
    }
  };

  // معالجة حذف طلبات الأدوات الخاصة الواردة من المستخدمين
  const handleDeleteOrder = (id) => {
    if (confirm('هل ترغب في أرشفة أو إزالة طلب الهندسة الخاص هذا من لوحة التحكم؟')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem('smart_engineering_orders', JSON.stringify(updated));
    }
  };

  // نظام التحكم بتسجيل الدخول وحظر وحذف مستخدمي المنصة من الجمهور
  const toggleUserStatus = (id) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'نشط' ? 'محظور' : 'نشط';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('smart_engineering_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id) => {
    if (confirm('هل ترغب بحذف هذا المستخدم نهائياً ومنعه من عمليات تسجيل الدخول للمنصة؟')) {
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('smart_engineering_users', JSON.stringify(updatedUsers));
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      problemSolved: '',
      category: 'prompt-engineering',
      phase: 'design',
      status: 'Free',
      icon: 'code',
      template: '',
      input_area: '',
      input_price: '',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-23024-large.mp4'
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 relative font-sans overflow-x-hidden antialiased select-none" dir="rtl">
      
      {/* شريط الإدارة العلوي والأنيق للمنصة */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <h1 className="text-xl font-black tracking-wide text-white">لوحة تحكم المسؤول والأدمن الفني</h1>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">التحكم الحصري ببوابة البرمجيات، النشر، الإعلانات، إدارة طلبات التطوير، والسيطرة التامة على المستخدمين.</p>
          </div>

          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button onClick={() => setActiveTab('manage-tools')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'manage-tools' ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}>إدارة ونشر الأدوات</button>
            <button onClick={() => setActiveTab('manage-orders')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all relative ${activeTab === 'manage-orders' ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}>
              طلبات الأدوات الخاصة
              {orders.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold animate-bounce">{orders.length}</span>}
            </button>
            <button onClick={() => setActiveTab('manage-users')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'manage-users' ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}>إدارة الجمهور والمستخدمين</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">

        {adminNotification && (
          <div className="mb-6 p-4 bg-zinc-900 border-r-4 border-amber-500 text-amber-400 rounded-xl text-xs font-bold shadow-lg animate-fade-in flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {adminNotification}
          </div>
        )}

        {/* التبويب الأول: إضافة وتعديل وحذف مكونات قائمة البرمجيات والأدوات */}
        {activeTab === 'manage-tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* استمارة النشر والتحكم بالبيانات والحقول المطلوبة بالكامل */}
            <div className="lg:col-span-1 bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6 shadow-xl h-fit">
              <h2 className="text-sm font-bold text-white mb-4 border-b border-zinc-800 pb-2 flex items-center justify-between">
                <span>{isEditing ? 'تعديل بيانات أداة منشورة' : 'نشر وإعلان أداة برمجية جديدة'}</span>
                {isEditing && <button onClick={resetForm} className="text-[10px] text-zinc-400 hover:text-white bg-zinc-800 px-2 py-0.5 rounded">إلغاء التعديل</button>}
              </h2>

              <form onSubmit={handleSaveTool} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">العنوان أو اسم الأداة الهندسية المخصصة:</label>
                  <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} placeholder="مثال: حاسبة ترحيم الكمرات الإنشائية..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500" required />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">شرح المشكلة والحل الأساسي للأداة (Subtitle):</label>
                  <textarea rows="2" value={formData.problemSolved} onChange={(e)=>setFormData({...formData, problemSolved: e.target.value})} placeholder="وصف المشكلة التي تحلها الأداة لبيع الخدمة عاطفياً للمهندس..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none" required></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">القائمة الفرعية والتصنيف:</label>
                    <select value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                      <option value="prompt-engineering">هندسة الأوامر (Prompt)</option>
                      <option value="live-apps">تطبيقات الويب الحية</option>
                      <option value="automation">برمجيات الأتمتة</option>
                      <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
                      <option value="management">الإدارة والتحكم</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">المرحلة الهندسية للمشروع:</label>
                    <select value={formData.phase} onChange={(e)=>setFormData({...formData, phase: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                      <option value="design">مرحلة التصميم</option>
                      <option value="execution">مرحلة التنفيذ والموقع</option>
                      <option value="technical-office">المكتب الفني (الحصر)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">حالة الترخيص (الوسم):</label>
                    <select value={formData.status} onChange={(e)=>setFormData({...formData, status: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                      <option value="Free">مجانية (Free)</option>
                      <option value="Demo">تجريبية (Demo)</option>
                      <option value="Pro">نسخة مدفوعة (Pro)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">الأيقونة الدلالية المعبّرة:</label>
                    <select value={formData.icon} onChange={(e)=>setFormData({...formData, icon: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                      <option value="code">رموز برمجية / برومبت (Code)</option>
                      <option value="calculator">حاسبة رقمية (Calculator)</option>
                      <option value="cpu">أتمتة ومعالجة صلبة (CPU)</option>
                      <option value="layers">طبقات ومخططات CAD (Layers)</option>
                      <option value="briefcase">إدارة وحقيبة أعمال (Briefcase)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-3">
                  <span className="text-[11px] font-bold text-amber-500 block">إعدادات قوالب الذكاء الاصطناعي وهندسة الأوامر الحاكمة:</span>
                  <div>
                    <label className="block text-zinc-500 mb-1">نص قالب البرومبت الموجه للـ LLM:</label>
                    <textarea rows="3" value={formData.template} onChange={(e)=>setFormData({...formData, template: e.target.value})} placeholder="قم بتحليل المخطط التالي للمساحة البالغة [input_area]..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500 resize-none" required></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-500 mb-1">الحقل (input_area) عدد:</label>
                      <input type="number" value={formData.input_area} onChange={(e)=>setFormData({...formData, input_area: e.target.value})} placeholder="250" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-1">الحقل (input_price) عدد:</label>
                      <input type="number" value={formData.input_price} onChange={(e)=>setFormData({...formData, input_price: e.target.value})} placeholder="15000" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-amber-500" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2">
                  {isEditing ? 'حفظ وإرسال التعديلات الفورية للجمهور' : 'اعتماد ونشر الأداة في منصة الهندسة الذكية'}
                </button>
              </form>
            </div>

            {/* عرض البرمجيات الحالية المنشورة والتحكم فيها (تعديل وحذف بالكامل) */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                البرمجيات والأدوات المنشورة حالياً والمتاحة للجمهور ({tools.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">ID: {tool.id}</span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                          {tool.category === 'prompt-engineering' ? 'هندسة أوامر' : tool.category === 'live-apps' ? 'تطبيقات حية' : tool.category === 'automation' ? 'أتمتة' : tool.category === 'ai-solutions' ? 'ذكاء اصطناعي' : 'إدارة ومكتب'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">{tool.title}</h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{tool.problemSolved}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-bold">الحالة للجمهور: {tool.status}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(tool)} className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[11px] px-2.5 py-1 rounded font-medium transition-colors">تعديل</button>
                        <button onClick={() => handleDeleteClick(tool.id)} className="bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[11px] px-2.5 py-1 rounded font-medium transition-colors">حذف</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* التبويب الثاني: مراجعة طلبات الأدوات المخصصة الواردة من واجهة المستخدم والجمهور */}
        {activeTab === 'manage-orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-bold text-white">طلبات الأدوات والسكربتات البرمجية المطلوبة من قبل الجمهور ({orders.length})</h2>
              <p className="text-xs text-zinc-400">تتم المزامنة والتوجيه التلقائي للملفات الفنية على المراسلات الرسمية للموقع: <span className="text-amber-400 font-mono select-all">Smart.Engineering.Global@proton.me</span></p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800">
                <p className="text-zinc-500 text-xs">لا توجد أي طلبات واردة جديدة من نماذج التقديم حالياً.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 hover:border-zinc-700 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-full w-1 bg-amber-500"></div>
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-sm font-bold text-white">{order.name}</h3>
                          <span className="text-[11px] text-zinc-500 font-mono">تاريخ التقديم: {order.date}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-zinc-400 text-[11px]">
                          <div>البريد الإلكتروني للعميل: <span className="text-cyan-400 font-mono select-all">{order.email}</span></div>
                          <div>رقم التلفون والتواصل: <span className="text-amber-400 font-mono select-all">{order.phone}</span></div>
                        </div>

                        <div className="mt-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-300 leading-relaxed text-xs">
                          <p className="font-bold text-zinc-400 text-[11px] mb-1">تفاصيل ومواصفات الأداة المطلوبة برمجياً:</p>
                          {order.details}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 self-end md:self-start">
                        <a href={`mailto:${order.email}?subject=بخصوص طلبك لبناء أداة هندسية في منصة الهندسة الذكية`} className="bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg text-center transition-colors">
                          مراسلة العميل إلكترونياً
                        </a>
                        <button onClick={() => handleDeleteOrder(order.id)} className="bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[11px] px-3 py-1.5 rounded-lg font-bold transition-colors">
                          أرشفة وحذف الطلب
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* التبويب الثالث: لوحة التحكم بالجمهور والمستخدمين وتأمين عمليات تسجيل الدخول */}
        {activeTab === 'manage-users' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white mb-2">إدارة حسابات الجمهور والتحكم في صلاحيات تسجيل الدخول</h2>
            <p className="text-xs text-zinc-400 mb-4">تتيح لك هذه اللوحة حظر، إلغاء حظر، أو حذف المستخدمين من قواعد البيانات لمنع الدخول غير المصرح به للأدوات الاحترافية (Pro).</p>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-lg">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">اسم المستخدم / المهندس</th>
                    <th className="px-6 py-3.5 font-bold">البريد الإلكتروني</th>
                    <th className="px-6 py-3.5 font-bold">الفئة المحددة</th>
                    <th className="px-6 py-3.5 font-bold">حالة الحساب</th>
                    <th className="px-6 py-3.5 font-bold text-center">الإجراءات والعمليات الإدارية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{user.name}</td>
                      <td className="px-6 py-4 font-mono text-zinc-300">{user.email}</td>
                      <td className="px-6 py-4 text-zinc-400">{user.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center gap-2">
                        <button 
                          onClick={() => toggleUserStatus(user.id)} 
                          className={`text-[11px] font-medium px-3 py-1 rounded transition-colors ${user.status === 'نشط' ? 'bg-zinc-800 hover:bg-amber-900/40 text-amber-400' : 'bg-amber-600 hover:bg-amber-500 text-white'}`}
                        >
                          {user.status === 'نشط' ? 'حظر الحساب' : 'إلغاء الحظر'}
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)} 
                          className="bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[11px] px-3 py-1 rounded font-medium transition-colors"
                        >
                          حذف نهائي
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <footer className="mt-20 border-t border-zinc-900 bg-zinc-950 py-4 text-center text-xs text-zinc-600">
        <p>نظام الإشراف المركزي الآمن &bull; تم النشر البرمجي والمزامنة المباشرة بنجاح.</p>
      </footer>
    </div>
  );
}