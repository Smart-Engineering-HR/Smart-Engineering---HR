'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, Cpu, HardDrive, Layers, Sliders, ArrowLeft, 
  Search, CheckCircle, Send, Play, Sparkles, Filter, 
  HelpCircle, Code, ShieldAlert, FileText, Download
} from 'lucide-react';

export default function SoftwareToolsPublic() {
  // حالات البيانات والفلترة
  const [tools, setTools] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activePhase, setActivePhase] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // حالات تفاعلية للبرومبت والتشغيل
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [promptInputs, setPromptInputs] = useState({ area: '', price: '' });
  const [promptResult, setPromptResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // حالة نموذج طلب أداة خاصة
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', details: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // حالة معاينة الفيديو التلقائي الذكي عند الحوم (Hover)
  const [hoveredToolId, setHoveredToolId] = useState(null);

  // تحميل البيانات الأولية وتحديثها من الـ LocalStorage لضمان التوافق مع الأدمن
  useEffect(() => {
    const defaultTools = [
      {
        id: 'p1',
        title: 'برومبت تحليل كود إنشائي متقدم',
        category: 'PROMPT',
        phase: 'DESIGN',
        status: 'FREE',
        problem: 'حل مشكلة التدقيق اليدوي الطويل للأكواد الإنشائية وتجنب الأخطاء البشرية.',
        template: 'قم بتحليل المخطط الإنشائي للمساحة {area} م² مع مراعاة تكلفة التأسيس التقريبية {price} دولار للطن، وتحقق من معاملات الأمان وفق الكود الأمريكي.',
        isPrompt: true
      },
      {
        id: 'l1',
        title: 'حاسبة تقوية الأعمدة الخرسانية',
        category: 'LIVE_APPS',
        phase: 'SITE',
        status: 'PRO',
        problem: 'حساب قطاعات التدعيم القميصي الخرساني أو الحديدي للأعمدة فورياً في الموقع.',
        isLiveApp: true
      },
      {
        id: 'a1',
        title: 'سكربت Python لحصر الحصى والحديد بضغط زر',
        category: 'AUTOMATION',
        phase: 'OFFICE',
        status: 'BETA',
        problem: 'تحويل ساعات العمل في الجداول اليدوية إلى 5 دقائق بدقة متناهية.',
        isDownloadable: true
      },
      {
        id: 'ai1',
        title: 'محرك معالجة وتحويل صـور المخططات إلى CAD',
        category: 'AI_SOLUTIONS',
        phase: 'DESIGN',
        status: 'PRO',
        problem: 'رسم المخططات الأولية الممسوحة ضوئياً وتحويلها لملفات DWG ذكية باستخدام الذكاء الاصطناعي.',
        isAIModel: true
      },
      {
        id: 'm1',
        title: 'منصة إدارة مهام المكاتب الفنية SaaS',
        category: 'MANAGEMENT',
        phase: 'OFFICE',
        status: 'PRO',
        problem: 'إدارة وتتبع المناقصات، الأوامر التغيرية، والتوثيق الهندسي في جيبك.',
        isSaaS: true
      }
    ];

    const storedTools = localStorage.getItem('smart_engineering_tools');
    if (storedTools) {
      setTools(JSON.parse(storedTools));
    } else {
      localStorage.setItem('smart_engineering_tools', JSON.stringify(defaultTools));
      setTools(defaultTools);
    }

    const storedRequests = localStorage.getItem('smart_engineering_orders');
    if (storedRequests) setRequests(JSON.parse(storedRequests));
  }, []);

  // تصفية العناصر بناءً على الفئات والمراحل والبحث
  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'ALL' || tool.category === activeCategory;
    const matchesPhase = activePhase === 'ALL' || tool.phase === activePhase;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.problem.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPhase && matchesSearch;
  });

  // معالجة تشغيل برومبت الذكاء الاصطناعي تفاعلياً
  const handleRunPrompt = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setPromptResult('');
    
    setTimeout(() => {
      let output = selectedPrompt.template
        .replace('{area}', promptInputs.area || '0')
        .replace('{price}', promptInputs.price || '0');
      
      setPromptResult(`[نظام الاستجابة الذكي للمنصة]:\nتم توليد التقرير بنجاح!\n\nبناءً على المساحة المدخلة البالغة ${promptInputs.area} م² والميزانية التقريبية ${promptInputs.price} وحدة نقدية، يوصى باستخدام نظام الأسقف Flat Slab مع تدعيم الجسور الطرفية بمقاومة خرسانية لا تقل عن 35 Mpa. تم مراجعة الانحرافات والترخيم طبقاً للمواصفات القياسية.`);
      setIsGenerating(false);
    }, 1500);
  };

  // إرسال نموذج طلب أداة برمجية خاصة
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      id: 'req_' + Date.now(),
      ...orderForm,
      date: new Date().toLocaleDateString('ar-YE'),
      status: 'قيد المراجعة'
    };

    const updatedRequests = [...requests, newOrder];
    localStorage.setItem('smart_engineering_orders', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    setFormSubmitted(true);
    
    // محاكاة إرسال البريد الإلكتروني للمواقع المحددة
    console.log("تم توجيه نسخة من الطلب هندسياً إلى البريد المعتمد:", [
      "Smart.Engineering.Global@proton.me",
      "smart.engineering.global@tuta.io",
      "smartengineering.hr.global@gmail.com"
    ]);

    setTimeout(() => {
      setOrderForm({ name: '', email: '', phone: '', details: '' });
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
      
      {/* صورة الخلفية الاحترافية المدمجة مع طبقة هندسية ومؤثرات توهج */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-cover bg-center mix-blend-overlay" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1920')" }}>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#070b14]/95 to-[#070b14] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none"></div>

      {/* الهيدر العلوي والأقسام الأفقية الجذابة ذات الدلالات والمعاني المعبرة */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/40 sticky top-0 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">الرئيسية للمنصة</span>
            </a>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
              <span className="text-lg font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                بوابة البرمجيات والأدوات الذكية
              </span>
            </div>
          </div>

          {/* القوائم الفرعية المرتبة أفقياً في أعلى الصفحة بشكل احترافي غاية في الجاذبية */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/60 shadow-2xl">
            <button 
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeCategory === 'ALL' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              الكل
            </button>
            <button 
              onClick={() => setActiveCategory('PROMPT')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeCategory === 'PROMPT' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Terminal className="w-3.5 h-3.5" /> هندسة الأوامر
            </button>
            <button 
              onClick={() => setActiveCategory('LIVE_APPS')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeCategory === 'LIVE_APPS' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Cpu className="w-3.5 h-3.5" /> تطبيقات الويب الحية
            </button>
            <button 
              onClick={() => setActiveCategory('AUTOMATION')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeCategory === 'AUTOMATION' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <HardDrive className="w-3.5 h-3.5" /> برمجيات الأتمتة
            </button>
            <button 
              onClick={() => setActiveCategory('AI_SOLUTIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeCategory === 'AI_SOLUTIONS' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> حلول الذكاء الاصطناعي
            </button>
            <button 
              onClick={() => setActiveCategory('MANAGEMENT')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeCategory === 'MANAGEMENT' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Layers className="w-3.5 h-3.5" /> الإدارة والتحكم
            </button>
          </nav>
        </div>
      </header>

      {/* المحتوى الرئيسي للمنصة */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* شريط أدوات البحث المتقدم وفلترة مراحل المشاريع الواقعية */}
        <section className="mb-12 bg-slate-900/50 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="ابحث عن أداة، حاسبة، أو نموذج ذكي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-11 py-3 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* نظام الفلترة الذكي حسب مراحل المشروع الفعلي */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 ml-2">
              <Filter className="w-3.5 h-3.5" /> مرحلة المشروع:
            </span>
            {[
              { id: 'ALL', label: 'كافة المراحل' },
              { id: 'DESIGN', label: 'مرحلة التصميم الإنشائي المعماري' },
              { id: 'SITE', label: 'مرحلة التنفيذ والموقع الميداني' },
              { id: 'OFFICE', label: 'المكتب الفني الحصر والكميات' }
            ].map(phase => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${activePhase === phase.id ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-sm' : 'bg-slate-950/40 text-slate-400 border-slate-800/60 hover:border-slate-700'}`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </section>

        {/* عرض شبكة البطاقات الذكية بأسلوب تفاعلي راقٍ */}
        <section className="mb-20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-200">
            <Sliders className="w-5 h-5 text-indigo-400" /> الأدوات المتوفرة حالياً بالمنصة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                onMouseEnter={() => setHoveredToolId(tool.id)}
                onMouseLeave={() => setHoveredToolId(null)}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-slate-700 p-6 shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* المعاينة السريعة الفورية التلقائية عبر الذكاء الاصطناعي مدمجة في البطاقة بصرياً */}
                {hoveredToolId === tool.id && (
                  <div className="absolute inset-0 bg-slate-950/95 z-20 p-4 flex flex-col justify-between transition-opacity duration-300 animate-fadeIn">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
                      <Play className="w-3.5 h-3.5 animate-ping" />
                      <span>معاينة سينمائية ذكية لطريقة عمل الأداة (5 ثوانٍ)</span>
                    </div>
                    {/* تجسيد محاكاة الفيديو المتولد هندسياً */}
                    <div className="w-full h-32 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-between px-6">
                      <div className="space-y-2 w-2/3">
                        <div className="h-2 w-full bg-cyan-500/40 rounded animate-pulse"></div>
                        <div className="h-2 w-4/5 bg-indigo-500/30 rounded animate-pulse"></div>
                        <div className="h-2 w-1/2 bg-purple-500/20 rounded animate-pulse"></div>
                      </div>
                      <Code className="w-12 h-12 text-slate-700 animate-spin-slow" />
                    </div>
                    <p className="text-[11px] text-slate-400 italic">تم إنشاء الفيديو والشرح فورياً بنماذج الرؤية الحاسوبية لمنصة الهندسة الذكية.</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      tool.status === 'PRO' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      tool.status === 'BETA' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {tool.status}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {tool.phase === 'DESIGN' ? '🔧 تصميم' : tool.phase === 'SITE' ? '🏗️ موقع وتنفيذ' : '📊 مكتب فني'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {tool.problem}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 mt-4">
                  {tool.isPrompt && (
                    <button 
                      onClick={() => { setSelectedPrompt(tool); setPromptResult(''); }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> جرب البرومبت الآن بالموقع
                    </button>
                  )}

                  {tool.isLiveApp && (
                    <div className="space-y-3">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">حمل العمود الحرج (kN):</span>
                          <span className="text-cyan-400 font-bold">3200 kN</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 w-3/4"></div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 block text-center">تفاعل فوري ورسم بياني مرن مدمج تلقائياً</span>
                    </div>
                  )}

                  {tool.isDownloadable && (
                    <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700">
                      <Download className="w-3.5 h-3.5" /> تحميل الاسكربت الجاهز للتنفيذ
                    </button>
                  )}

                  {tool.isAIModel && (
                    <div className="border border-dashed border-slate-800 p-4 rounded-xl text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
                      <FileText className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                      <span className="text-xs text-slate-400 block">اسحب وأفلت ملف الـ PDF/DWG لمعالجته فوراً</span>
                    </div>
                  )}

                  {tool.isSaaS && (
                    <span className="text-xs text-indigo-400 font-semibold block text-center bg-indigo-500/5 py-2 rounded-lg border border-indigo-500/10">
                      لوحة نظام تحكم وسجلات مركزي كاملة
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* نموذج تفاعلي راقٍ: اطلب أداتك البرمجية الخاصة */}
        <section className="max-w-3xl mx-auto bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl relative shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
              <Code className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              اطلب أداتك البرمجية المخصصة الآن
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              فريق مهندسي المطورين بالمنصة يقوم ببناء السكربت أو الحاسبة التي تلبي أعمالك بدقة كاملة ومزامنتها عبر قنواتنا المعتمدة.
            </p>
          </div>

          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">الاسم الكريم</label>
                <input 
                  type="text" 
                  required
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all" 
                  placeholder="المهندس..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">البريد الإلكتروني للرد</label>
                <input 
                  type="email" 
                  required
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all" 
                  placeholder="name@domain.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">رقم الهاتف والتواصل</label>
                <input 
                  type="tel" 
                  required
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all" 
                  placeholder="+967..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">شرح تفصيلي ومتطلبات الأداة الهندسية المطلوبة</label>
              <textarea 
                rows="4" 
                required
                value={orderForm.details}
                onChange={(e) => setOrderForm({...orderForm, details: e.target.value})}
                className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all resize-none" 
                placeholder="يرجى كتابة المعادلات المحددة أو وصف كامل للمشكلة الإنشائية والتنفيذية المراد أتمتتها..."
              ></textarea>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-[10px] text-slate-500">
              <span>القنوات الرسمية المستقبلة: Smart.Engineering.Global@proton.me</span>
              <span className="hidden md:inline">smart.engineering.global@tuta.io | smartengineering.hr.global@gmail.com</span>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-3.5 h-3.5" /> إرسال الطلب واعتماده فوراً في لوحة التحكم
            </button>
          </form>

          {formSubmitted && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
              <CheckCircle className="w-12 h-12 text-emerald-400 mb-4 animate-bounce" />
              <h3 className="text-base font-bold text-slate-200">تم استلام طلبك البرمجي بنجاح متناهٍ!</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm">
                تم تسجيل الطلب بلوحة تحكم الأدمن وبثه لغرفة المطورين عبر البريد الإلكتروني المشفر والمزامنة جارية.
              </p>
            </div>
          )}
        </section>

      </main>

      {/* مودال تفاعلي 100% لمحاكاة تشغيل الأوامر (Try Prompt Now) للذكاء الاصطناعي */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl relative animate-scaleUp">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">{selectedPrompt.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedPrompt(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-md"
              >
                إغلاق
              </button>
            </div>

            <form onSubmit={handleRunPrompt} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                <span className="text-[10px] text-cyan-400 font-bold block mb-1">قالب البرومبت الذكي المخزن:</span>
                {selectedPrompt.template}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">المساحة المستهدفة (input_area عدد):</label>
                  <input 
                    type="number" 
                    required
                    value={promptInputs.area}
                    onChange={(e) => setPromptInputs({...promptInputs, area: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" 
                    placeholder="مثال: 250"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">سعر التكلفة التقديري (input_price عدد):</label>
                  <input 
                    type="number" 
                    required
                    value={promptInputs.price}
                    onChange={(e) => setPromptInputs({...promptInputs, price: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" 
                    placeholder="مثال: 650"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري التحليل وتوليد التقرير الهندسي...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>توليد التقرير بالذكاء الاصطناعي الآن</span>
                  </>
                )}
              </button>

              {promptResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto animate-fadeIn">
                  {promptResult}
                </div>
              )}
            </form>

          </div>
        </div>
      )}

      {/* فوتر ذكي بسيط للتوثيق الإداري للمنصة */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-600">
        منصة الهندسة الذكية &copy; {new Date().getFullYear()} - بوابة إدارة الأدوات البرمجية الشاملة للجمهور والمحترفين.
      </footer>
    </div>
  );
}