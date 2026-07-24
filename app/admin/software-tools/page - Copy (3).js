'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Plus, Trash2, Edit3, Save, RefreshCw, 
  Inbox, Users, ToggleLeft, ToggleRight, AlertTriangle,
  Terminal, Cpu, HardDrive, Sparkles, Layers, Check, X
} from 'lucide-react';

export default function SoftwareToolsAdmin() {
  // الحالات الأساسية لإدارة البيانات
  const [tools, setTools] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  
  // حالة التحكم بالتبويبات داخل صفحة الأدمن الفنية
  const [adminTab, setAdminTab] = useState('MANAGE_TOOLS'); // MANAGE_TOOLS, ORDERS, USER_CONTROL

  // حالة النموذج لإضافة وتعديل الأدوات والبرومبتات
  const [isEditing, setIsEditing] = useState(false);
  const [currentToolId, setCurrentToolId] = useState(null);
  
  const [toolForm, setToolForm] = useState({
    title: '',
    category: 'PROMPT',
    phase: 'DESIGN',
    status: 'FREE',
    problem: '',
    template: '', // مستخدم خصيصاً لهندسة الأوامر بقوالب مرنة الحقول
    isPrompt: true,
    isLiveApp: false,
    isDownloadable: false,
    isAIModel: false,
    isSaaS: false
  });

  // مزامنة البيانات والتحكم الكلي الفوري عبر الـ LocalStorage المنعكس على واجهة الجمهور
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedTools = localStorage.getItem('smart_engineering_tools');
    if (storedTools) setTools(JSON.parse(storedTools));

    const storedRequests = localStorage.getItem('smart_engineering_orders');
    if (storedRequests) setRequests(JSON.parse(storedRequests));

    // توليد سجل مستخدمين افتراضي لأغراض التحكم والحظر والحذف للجمهور
    const defaultUsers = [
      { id: 'usr_1', name: 'م. أحمد خالد', email: 'ahmed@example.com', status: 'ACTIVE', lastLogin: 'اليوم، 11:20 ص' },
      { id: 'usr_2', name: 'م. سارة عمر', email: 'sara.civil@example.com', status: 'ACTIVE', lastLogin: 'أمس، 09:45 م' },
      { id: 'usr_3', name: 'م. رامي المنصوري', email: 'rami@block.com', status: 'BLOCKED', lastLogin: '14 يونيو 2026' }
    ];
    const storedUsers = localStorage.getItem('smart_engineering_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem('smart_engineering_users', JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  };

  // التحكم بالفئات وتحديث نوعية الأداة تلقائياً لتسهيل الاستخدام البرمجي 10000%
  const handleCategoryChange = (cat) => {
    setToolForm({
      ...toolForm,
      category: cat,
      isPrompt: cat === 'PROMPT',
      isLiveApp: cat === 'LIVE_APPS',
      isDownloadable: cat === 'AUTOMATION',
      isAIModel: cat === 'AI_SOLUTIONS',
      isSaaS: cat === 'MANAGEMENT'
    });
  };

  // معالجة حفظ أو تعديل الأداة لتنعكس فوراً دون المساس بالكود
  const handleSaveTool = (e) => {
    e.preventDefault();
    if (!toolForm.title || !toolForm.problem) {
      alert('الرجاء تعبئة جميع الحقول الأساسية بشكل كامل!');
      return;
    }

    let updatedTools = [...tools];

    if (isEditing) {
      updatedTools = updatedTools.map(t => t.id === currentToolId ? { ...t, ...toolForm } : t);
      setIsEditing(false);
      setCurrentToolId(null);
    } else {
      const newTool = {
        id: 'tool_' + Date.now(),
        ...toolForm
      };
      updatedTools.push(newTool);
    }

    localStorage.setItem('smart_engineering_tools', JSON.stringify(updatedTools));
    setTools(updatedTools);
    resetForm();
  };

  // تفعيل وضع تعديل الأداة وسحب بياناتها للنموذج
  const handleEditClick = (tool) => {
    setIsEditing(true);
    setCurrentToolId(tool.id);
    setToolForm({ ...tool });
  };

  // حذف أداة بشكل نهائي ومزامنتها للجمهور فوراً
  const handleDeleteTool = (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الأداة الهندسية نهائياً من العرض العام؟')) {
      const updatedTools = tools.filter(t => t.id !== id);
      localStorage.setItem('smart_engineering_tools', JSON.stringify(updatedTools));
      setTools(updatedTools);
    }
  };

  // تغيير حالة طلبات الأدوات الخاصة الواردة
  const handleUpdateOrderStatus = (id, newStatus) => {
    const updatedRequests = requests.map(req => req.id === id ? { ...req, status: newStatus } : req);
    localStorage.setItem('smart_engineering_orders', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
  };

  // حذف طلب أداة برمجية واردة
  const handleDeleteOrder = (id) => {
    if (confirm('هل ترغب في حذف سجل هذا الطلب بالكامل؟')) {
      const updatedRequests = requests.filter(req => req.id !== id);
      localStorage.setItem('smart_engineering_orders', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
    }
  };

  // حظر أو تفعيل مستخدم من المنصة والتحكم في صلاحية دخوله للجمهور
  const handleToggleUserBlock = (id) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' };
      }
      return u;
    });
    localStorage.setItem('smart_engineering_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // حذف مستخدم نهائياً من سجلات المنصة الرقمية
  const handleDeleteUser = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم وقطع اتصاله بالكامل بالمنصة الهندسية؟')) {
      const updatedUsers = users.filter(u => u.id !== id);
      localStorage.setItem('smart_engineering_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const resetForm = () => {
    setToolForm({
      title: '',
      category: 'PROMPT',
      phase: 'DESIGN',
      status: 'FREE',
      problem: '',
      template: '',
      isPrompt: true,
      isLiveApp: false,
      isDownloadable: false,
      isAIModel: false,
      isSaaS: false
    });
    setIsEditing(false);
    setCurrentToolId(null);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans p-6 selection:bg-indigo-500 selection:text-white">
      
      {/* هيدر لوحة التحكم المركزية المصغرة للمطور والأدمن لبرمجيات المنصة */}
      <header className="max-w-7xl mx-auto bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-200">لوحة تحكم برمجيات وأدوات المنصة (Admin Area)</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">تحكم كامل ومطلق بالإعلانات، الأدوات، هندسة الأوامر، والطلبات والمستخدمين</p>
          </div>
        </div>

        {/* التبويبات الثلاثة الرئيسية للسيطرة والتحكم الكامل */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/60">
          <button 
            onClick={() => setAdminTab('MANAGE_TOOLS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${adminTab === 'MANAGE_TOOLS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Layers className="w-3.5 h-3.5" /> إدارة الأدوات والبرومبتات ({tools.length})
          </button>
          <button 
            onClick={() => setAdminTab('ORDERS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${adminTab === 'ORDERS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Inbox className="w-3.5 h-3.5" /> طلبات الأدوات المخصصة ({requests.length})
          </button>
          <button 
            onClick={() => setAdminTab('USER_CONTROL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${adminTab === 'USER_CONTROL' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Users className="w-3.5 h-3.5" /> أمن الجمهور والمستخدمين ({users.length})
          </button>
        </div>
      </header>

      {/* منطقة محتوى الأدمن المنسقة تفصيلياً */}
      <main className="max-w-7xl mx-auto">
        
        {/* التبويب الأول: إضافة ونشر وتعديل وحذف كل ما يتعلق بالأدوات والبرومبتات */}
        {adminTab === 'MANAGE_TOOLS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* نموذج الإضافة والتعديل الشامل لكافة الحقول المطلوبة بالدقة المتناهية */}
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl h-fit shadow-xl space-y-4">
              <h3 className="text-sm font-bold border-b border-slate-800 pb-2 text-slate-300 flex items-center justify-between">
                <span>{isEditing ? 'تعديل بيانات الأداة الحالية' : 'نشر وإعلان أداة هندسية جديدة'}</span>
                {isEditing && (
                  <button onClick={resetForm} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-rose-400">إلغاء التعديل</button>
                )}
              </h3>

              <form onSubmit={handleSaveTool} className="space-y-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">العنوان أو اسم الأداة الفريد:</label>
                  <input 
                    type="text"
                    required
                    value={toolForm.title}
                    onChange={(e) => setToolForm({...toolForm, title: e.target.value})}
                    placeholder="مثال: حاسبة ترخيم الكمرات الخرسانية المتقدمة"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">الفئة الفرعية الأساسية:</label>
                    <select
                      value={toolForm.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="PROMPT">هندسة الأوامر (Prompt)</option>
                      <option value="LIVE_APPS">تطبيقات الويب الحية</option>
                      <option value="AUTOMATION">برمجيات الأتمتة</option>
                      <option value="AI_SOLUTIONS">حلول الذكاء الاصطناعي</option>
                      <option value="MANAGEMENT">الإدارة والتحكم SaaS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">مرحلة الفلترة والعمل:</label>
                    <select
                      value={toolForm.phase}
                      onChange={(e) => setToolForm({...toolForm, phase: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="DESIGN">مرحلة التصميم</option>
                      <option value="SITE">مرحلة التنفيذ والموقع</option>
                      <option value="OFFICE">المكتب الفني الحصر</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">وسم الحالة للجمهور:</label>
                    <select
                      value={toolForm.status}
                      onChange={(e) => setToolForm({...toolForm, status: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="FREE">مجانية (FREE)</option>
                      <option value="BETA">نسخة تجريبية (BETA)</option>
                      <option value="PRO">نسخة احترافية مدفوعة (PRO)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">شرح المشكلة التي تحلها الأداة بدقة:</label>
                  <textarea
                    rows="3"
                    required
                    value={toolForm.problem}
                    onChange={(e) => setToolForm({...toolForm, problem: e.target.value})}
                    placeholder="اكتب هنا المشكلة الهندسية والبيع العاطفي لتوفير الوقت والدقة الفورية للمهندس الميداني أو التصميمي..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* حقول مخصصة لهندسة الأوامر (Prompt Engineering Template) تظهر بديناميكية عند اختيار الفئة */}
                {toolForm.category === 'PROMPT' && (
                  <div className="p-3 bg-slate-950 border border-dashed border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] text-indigo-400 font-bold block">إعدادات قالب البرومبت الهندسي المطور 10000%</span>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">قالب البرومبت الأساسي (استخدم المتغيرات {'{area}'} و {'{price}'}):</label>
                      <textarea
                        rows="3"
                        value={toolForm.template}
                        onChange={(e) => setToolForm({...toolForm, template: e.target.value})}
                        placeholder="قم بتحليل المخطط للمساحة {area} م² بتكلفة إجمالية {price}..."
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
                      ></textarea>
                    </div>
                    <div className="text-[9px] text-slate-500 italic">يتم حقن المدخلات الرقمية (input_area عدد ومعدل input_price) مباشرة بواسطة واجهة المحادثة السريعة للجمهور.</div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'حفظ التعديلات الحالية ونشرها' : 'إعلان ونشر الأداة فورياً'}</span>
                </button>
              </form>
            </div>

            {/* عرض قائمة العناصر الحالية والتحكم الفوري بالجمهور بحذف وتعديل كلي */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-300">الأدوات والإعلانات النشطة حالياً بالموقع</h3>
                <button onClick={loadData} className="p-1 text-slate-400 hover:text-white bg-slate-950 rounded border border-slate-800">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {tools.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">لا توجد أدوات برمجية منشورة حالياً، يرجى إضافة الأداة الأولى.</div>
                ) : (
                  tools.map(tool => (
                    <div key={tool.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {tool.category === 'PROMPT' && <Terminal className="w-4 h-4 text-cyan-400" />}
                          {tool.category === 'LIVE_APPS' && <Cpu className="w-4 h-4 text-emerald-400" />}
                          {tool.category === 'AUTOMATION' && <HardDrive className="w-4 h-4 text-amber-400" />}
                          {tool.category === 'AI_SOLUTIONS' && <Sparkles className="w-4 h-4 text-purple-400" />}
                          {tool.category === 'MANAGEMENT' && <Layers className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200">{tool.title}</span>
                            <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">{tool.category}</span>
                            <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-cyan-500">{tool.phase}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{tool.problem}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => handleEditClick(tool)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 transition-all"
                          title="تعديل"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTool(tool.id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-all"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* التبويب الثاني: التحكم واستقبال ومعالجة طلبات الأدوات المخصصة التي يتم استقبالها من الجمهور */}
        {adminTab === 'ORDERS' && (
          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold border-b border-slate-800 pb-3 mb-4 text-slate-300">
              سجل طلبات الأدوات البرمجية الخاصة المستقبلة عبر لوحة التحكم والبريد المعتمد
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {requests.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">لا توجد طلبات برمجية واردة من الجمهور حالياً.</div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 w-24 bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-200">{req.name}</span>
                        <span className="text-[10px] text-slate-500">{req.date}</span>
                        <span className="text-[10px] text-indigo-400 font-mono bg-slate-900 px-2 py-0.5 rounded">{req.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded ${req.status === 'قيد التنفيذ' ? 'bg-amber-500/10 text-amber-400' : req.status === 'تم الانجاز' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-400'}`}>
                          {req.status}
                        </span>
                        <select 
                          value={req.status} 
                          onChange={(e) => handleUpdateOrderStatus(req.id, e.target.value)}
                          className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded px-1 py-0.5 focus:outline-none"
                        >
                          <option value="قيد المراجعة">قيد المراجعة</option>
                          <option value="قيد التنفيذ">الموافقة والتنفيذ</option>
                          <option value="تم الانجاز">تم الإنجاز والنشر</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteOrder(req.id)}
                          className="text-rose-400 hover:text-rose-300 text-xs p-1"
                          title="حذف الطلب نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div><span className="text-slate-500">البريد الإلكتروني للعميل:</span> {req.email}</div>
                      <div><span className="text-slate-500">رقم الهاتف والتواصل المباشر:</span> {req.phone}</div>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="text-[10px] text-slate-500 block mb-1">تفاصيل ومواصفات الأداة المطلوبة:</span>
                      {req.details}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* التبويب الثالث: التحكم بعمليات تسجيل دخول الجمهور وحظر وحذف المستخدمين لمنع العبث */}
        {adminTab === 'USER_CONTROL' && (
          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-300">سجل أمان الجمهور والتحكم بصلاحيات الدخول والحظر</h3>
              <div className="text-[10px] text-amber-400 flex items-center gap-1.5 bg-amber-500/5 px-3 py-1 rounded-lg border border-amber-500/10">
                <AlertTriangle className="w-3.5 h-3.5" /> صلاحيات حساسة لحماية الملكية الفكرية والبيانات الإنشائية
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-500">
                    <th className="pb-3 pt-1">اسم المهندس/المستخدم</th>
                    <th className="pb-3 pt-1">البريد الإلكتروني</th>
                    <th className="pb-3 pt-1">آخر تسجيل دخول نشط</th>
                    <th className="pb-3 pt-1">حالة الحساب الحالي</th>
                    <th className="pb-3 pt-1 text-left">الإجراءات والتحكم النهائي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-950/20 transition-colors">
                      <td className="py-3.5 font-semibold text-slate-200">{user.name}</td>
                      <td className="py-3.5 text-slate-400 font-mono">{user.email}</td>
                      <td className="py-3.5 text-slate-500">{user.lastLogin}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {user.status === 'ACTIVE' ? 'نشط ومصرح' : 'محظور من الدخول'}
                        </span>
                      </td>
                      <td className="py-3.5 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserBlock(user.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 border transition-all ${user.status === 'ACTIVE' ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/5' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/5'}`}
                          >
                            {user.status === 'ACTIVE' ? (
                              <>
                                <ToggleLeft className="w-3.5 h-3.5" /> حظر الحساب
                              </>
                            ) : (
                              <>
                                <ToggleRight className="w-3.5 h-3.5" /> إلغاء الحظر
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 rounded bg-slate-950 border border-slate-800 hover:border-rose-500 text-slate-500 hover:text-rose-400 transition-colors"
                            title="حذف الحساب كلياً"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}