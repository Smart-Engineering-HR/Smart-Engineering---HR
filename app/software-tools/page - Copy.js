"use client";

import React, { useState, useEffect } from 'react';
import { 
  Laptop, Code2, Cpu, FileSpreadsheet, Play, Download, 
  MessageSquare, Send, CheckCircle2, Search, Filter, 
  ArrowLeftRight, HelpCircle, FileText, ChevronRight, Home,
  Calculator, Sparkles
} from 'lucide-react';

export default function SoftwareToolsPage() {
  const [activeTab, setActiveTab] = useState('all'); // الفلترة حسب نوع الأداة
  const [projectStage, setProjectStage] = useState('all'); // الفلترة حسب مرحلة المشروع
  const [hoveredVideoId, setHoveredVideoId] = useState(null); // للمعاينة السريعة 5 ثوانٍ
  const [searchQuery, setSearchQuery] = useState('');
  
  // حالات تفاعلية للحاسبات المصغرة المدمجة
  const [calcType, setCalcType] = useState('concrete');
  const [concreteVolume, setConcreteVolume] = useState({ length: 1, width: 1, height: 0.3 });
  const [steelWeightInput, setSteelWeightInput] = useState({ diameter: 16, length: 12, count: 10 });
  const [unitConvert, setUnitConvert] = useState({ value: 1, direction: 'knToTon' });

  // حالة نموذج "اطلب أداتك الخاصة"
  const [requestForm, setRequestForm] = useState({ name: '', email: '', idea: '', stage: 'design' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // حالة التعليقات التفاعلية لأداة "صفر هالك" كمثال
  const [comments, setComments] = useState([
    { id: 1, user: "م. أحمد عبد الرحمن", text: "الأداة وفرت علينا ما يقارب 4% من الهالك الفعلي في مشروع البرج السكني الحالي! رائع جداً.", time: "منذ ساعتين" },
    { id: 2, user: "م. خالد الحربي", text: "هل من الممكن إضافة تصدير النتائج مباشرة إلى أوتوكاد في التحديث القادم؟", time: "منذ يوم" }
  ]);
  const [newComment, setNewComment] = useState("");

  // بيانات الأدوات والبرمجيات بالتفصيل
  const toolsData = [
    {
      id: "zero-waste",
      title: "أداة Rebar Zero-Waste (صفر هالك)",
      problem: "الهدر الكبير في أسياخ حديد التسليح عند التقطيع العشوائي بالموقع.",
      badge: "Pro",
      category: "templates",
      stage: "site", // مرحلة التنفيذ والموقع
      desc: "خوارزمية ذكية لحل مشكلة تقطيع الحديد (Cutting Stock Problem) وتوزيع التفريد بأقل نسبة فاقد ممكنة تحت 1%.",
      downloadUrl: "#",
      pdfUrl: "#",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-34324-large.mp4"
    },
    {
      id: "concrete-calc",
      title: "حاسبة الكميات الذكية",
      problem: "الخطأ البشري والبطء في حساب كميات الخرسانة وأوزان الحديد المطلوبة للصب.",
      badge: "مجانية",
      category: "web-apps",
      stage: "survey", // المكتب الفني
      desc: "تطبيقات ويب حية لحساب حجوم الخرسانة للعناصر الإنشائية المختلفة بدقة ملموسة مع حساب أوزان تسليحها مباشرة.",
      downloadUrl: null, // تعمل مباشرة
      pdfUrl: "#",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-hands-typing-on-a-computer-keyboard-40348-large.mp4"
    },
    {
      id: "code-search",
      title: "محرك فحص الأكواد الإنشائية الذكي",
      problem: "صعوبة البحث في مئات الصفحات للوصول إلى اشتراطات التسليح أو الإجهاد.",
      badge: "تجريبية",
      category: "web-apps",
      stage: "design", // مرحلة التصميم
      desc: "محرك بحث متطور يبحث بالكلمة المفتاحية في الكود السعودي (SBC)، البريطاني، الأمريكي (ACI)، الأوروبي، والمصري.",
      downloadUrl: null,
      pdfUrl: "#",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-typing-on-a-laptop-42173-large.mp4"
    },
    {
      id: "revit-add-in",
      title: "إضافة أتمتة الـ BIM لريفت (Revit Add-in)",
      problem: "تكرار نمذجة الروابط وعناصر التسليح يدوياً لمئات الأعمدة والكمرات.",
      badge: "Pro",
      category: "automation",
      stage: "design",
      desc: "ملحق برمجى ذكي لبرنامج Revit لنمذجة وحساب حديد التسليح أوتوماتيكياً بالكامل بضغطة زر واحدة.",
      downloadUrl: "#",
      pdfUrl: "#",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-designing-a-3d-architectural-model-on-a-computer-42171-large.mp4"
    },
    {
      id: "python-etabs",
      title: "مجموعة سكريبتات Python لبرنامج ETABS",
      problem: "صعوبة تحليل وتدقيق الجداول الضخمة لردود أفعال الأعمدة المصدرة من البرامج الإنشائية.",
      badge: "مجانية",
      category: "automation",
      stage: "design",
      desc: "مجموعة برمجية مجهزة بلغة بايثون لمعالجة وتصميم القواعد والمقاطع المستوردة من ETABS وتصديرها كملفات Excel مرتبة.",
      downloadUrl: "#",
      pdfUrl: "#",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-monitor-with-running-code-41566-large.mp4"
    },
    {
      id: "ai-estimator",
      title: "أداة التنبؤ بالتكاليف الذكية (AI Cost Estimator)",
      problem: "تغير أسعار المواد الخام الفجائي وعدم دقة تقديرات التكلفة الأولية للمتر المربع.",
      badge: "Pro",
      category: "ai-solutions",
      stage: "survey",
      desc: "نموذج تعلم آلة متطور يتنبأ بتكلفة المتر المربع للمنشآت الهيكلية بناءً على أسعار الحديد والأسمنت والمنطقة الجغرافية الحالية.",
      downloadUrl: "#",
      pdfUrl: "#",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-graphic-designer-working-on-a-tablet-42183-large.mp4"
    }
  ];

  // تصفية وحصر البيانات بناءً على اختيارات المستخدم
  const filteredTools = toolsData.filter(tool => {
    const matchesTab = activeTab === 'all' || tool.category === activeTab;
    const matchesStage = projectStage === 'all' || tool.stage === projectStage;
    const matchesSearch = tool.title.includes(searchQuery) || tool.desc.includes(searchQuery);
    return matchesTab && matchesStage && matchesSearch;
  });

  // معالجة إضافة تعليق جديد
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      user: "مهندس زائر",
      text: newComment,
      time: "الآن"
    };
    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  // معالجة إرسال طلب أداة خاصة
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setRequestForm({ name: '', email: '', idea: '', stage: 'design' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030914] via-[#061124] to-[#0a1b36] text-white flex flex-col font-black selection:bg-cyan-500 selection:text-black" dir="rtl">
      
      {/* شبكة هندسية خلفية متناسقة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* الهيدر الفاخر */}
      <header className="w-full bg-[#030d1a]/95 backdrop-blur-md border-b border-cyan-500/15 sticky top-0 z-50 py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-400/30">
              <Laptop className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400">
                لوحة التحكم البرمجية والأدوات
              </h1>
              <span className="text-[11px] text-slate-400 block font-normal">منصة أدوات المهندس المدني المبرمج الذكية</span>
            </div>
          </div>
          <a href="/" className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-cyan-500 hover:text-black transition-all text-xs font-black">
            <Home className="w-4 h-4" /> الرئيسية
          </a>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10 relative z-10 space-y-12">
        
        {/* قسم تصفية وفلترة الأدوات الذكي */}
        <section className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-[28px] space-y-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-black text-slate-200">فرز وفلترة مستودع الأدوات البرمجية</h2>
            </div>
            {/* شريط البحث المباشر */}
            <div className="relative max-w-md w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="ابحث عن أداة معينة (مثال: صفر هالك)..." 
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 pr-10 pl-4 text-xs font-black focus:outline-none focus:border-cyan-400 text-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-slate-900 pt-5 space-y-4">
            {/* 1. التصفية حسب مرحلة المشروع الفعلي */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 min-w-[100px] font-black">مرحلة المشروع:</span>
              {[
                { id: 'all', name: 'الكل' },
                { id: 'design', name: 'مرحلة التصميم الإنشائي' },
                { id: 'site', name: 'مرحلة التنفيذ والموقع' },
                { id: 'survey', name: 'المكتب الفني وحصر الكميات' }
              ].map(stage => (
                <button
                  key={stage.id}
                  onClick={() => setProjectStage(stage.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                    projectStage === stage.id 
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' 
                      : 'bg-transparent border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {stage.name}
                </button>
              ))}
            </div>

            {/* 2. التصفية حسب نوع التصنيف الهندسي البرمجي */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 min-w-[100px] font-black">تصنيف الأداة:</span>
              {[
                { id: 'all', name: 'كافة الأدوات' },
                { id: 'web-apps', name: 'تطبيقات الويب "الحية"' },
                { id: 'automation', name: 'برمجيات الأتمتة والـ Add-ins' },
                { id: 'ai-solutions', name: 'حلول الذكاء الاصطناعي (AI)' },
                { id: 'templates', name: 'قوالب الإدارة والتحكم (Excel/Power BI)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                    activeTab === tab.id 
                      ? 'bg-cyan-500 text-black border-cyan-500' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-white'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* عرض الأدوات في بطاقات تفاعلية أنيقة */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <div 
              key={tool.id}
              className="bg-[#030d1a] border border-slate-800 hover:border-cyan-500/40 rounded-[24px] overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl relative group"
              onMouseEnter={() => setHoveredVideoId(tool.id)}
              onMouseLeave={() => setHoveredVideoId(null)}
            >
              
              {/* قسم الفيديو والمعاينة السريعة 5 ثوانٍ عند مرور الماوس */}
              <div className="h-40 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                {hoveredVideoId === tool.id ? (
                  <video 
                    src={tool.videoUrl} 
                    autoPlay 
                    muted 
                    loop 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 to-[#030d1a]">
                    <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                      <Play className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">ضع الماوس للمعاينة السريعة (5 ثوانٍ)</span>
                  </div>
                )}
                
                {/* وسم حالة الأداة */}
                <span className={`absolute top-4 right-4 text-[10px] font-black px-3 py-1 rounded-full border shadow-md ${
                  tool.badge === 'Pro' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400/40' :
                  tool.badge === 'تجريبية' ? 'bg-blue-600 text-white border-blue-400' : 'bg-emerald-600 text-white border-emerald-400'
                }`}>
                  {tool.badge}
                </span>
              </div>

              {/* تفاصيل الكرت */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">{tool.title}</h3>
                  <div className="text-[10px] text-rose-400 font-black mt-1 bg-rose-950/20 border border-rose-950/30 p-1.5 rounded-lg">
                    المشكلة: {tool.problem}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal mt-3">{tool.desc}</p>
                </div>

                {/* روابط التحميل، الدليل والمرفقات */}
                <div className="pt-4 border-t border-slate-900 flex items-center justify-between gap-2">
                  <div className="flex gap-1.5">
                    {tool.downloadUrl && (
                      <a href={tool.downloadUrl} className="p-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-lg text-cyan-400 hover:text-white transition-all flex items-center gap-1 text-[10px] font-black">
                        <Download className="w-3.5 h-3.5" /> تحميل الأداة
                      </a>
                    )}
                    {tool.pdfUrl && (
                      <a href={tool.pdfUrl} className="p-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1 text-[10px] font-black">
                        <FileText className="w-3.5 h-3.5" /> دليل PDF
                      </a>
                    )}
                  </div>
                  <span className="text-[9px] bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-500">
                    {tool.stage === 'design' ? 'تصميم إلكتروني' : tool.stage === 'site' ? 'تنفيذ موقعي' : 'مكتب فني'}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </section>

        {/* حاسبات الويب المدمجة حية ومباشرة */}
        <section className="bg-slate-950/80 border border-slate-800 rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-cyan-400" />
              <div>
                <h2 className="text-lg font-black text-white">حاسبات معمل الهندسة الذكية (تفاعلية حية)</h2>
                <p className="text-[11px] text-slate-500 font-normal">احسب مباشرة من المتصفح دون الحاجة لتحميل أي ملفات</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCalcType('concrete')} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${calcType === 'concrete' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>حساب الخرسانة</button>
              <button onClick={() => setCalcType('steel')} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${calcType === 'steel' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>أوزان الحديد</button>
              <button onClick={() => setCalcType('unit')} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${calcType === 'unit' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>محول الوحدات</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* واجهة التحكم بالإدخالات حسب النوع المختار */}
            <div className="space-y-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
              {calcType === 'concrete' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-cyan-400">حجم وكميات صب الخرسانة للعناصر</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">الطول (m)</label>
                      <input type="number" value={concreteVolume.length} onChange={(e) => setConcreteVolume({...concreteVolume, length: parseFloat(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-center text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">العرض (m)</label>
                      <input type="number" value={concreteVolume.width} onChange={(e) => setConcreteVolume({...concreteVolume, width: parseFloat(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-center text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">السمك/الارتفاع (m)</label>
                      <input type="number" value={concreteVolume.height} onChange={(e) => setConcreteVolume({...concreteVolume, height: parseFloat(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-center text-white" />
                    </div>
                  </div>
                </div>
              )}

              {calcType === 'steel' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-cyan-400">حساب أوزان حديد التسليح الكلي</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">القطر (mm)</label>
                      <input type="number" value={steelWeightInput.diameter} onChange={(e) => setSteelWeightInput({...steelWeightInput, diameter: parseFloat(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-center text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">طول السيخ (m)</label>
                      <input type="number" value={steelWeightInput.length} onChange={(e) => setSteelWeightInput({...steelWeightInput, length: parseFloat(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-center text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">عدد الأسياخ</label>
                      <input type="number" value={steelWeightInput.count} onChange={(e) => setSteelWeightInput({...steelWeightInput, count: parseInt(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-center text-white" />
                    </div>
                  </div>
                </div>
              )}

              {calcType === 'unit' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-cyan-400">محول الوحدات الهندسي المتخصص</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">التحويل من / إلى</label>
                      <select 
                        value={unitConvert.direction} 
                        onChange={(e) => setUnitConvert({...unitConvert, direction: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-black cursor-pointer"
                      >
                        <option value="knToTon">كيلو نيوتن (kN) ➔ طن (Ton)</option>
                        <option value="psiToMpa">بوند/إنش² (PSI) ➔ ميجا باسكال (MPa)</option>
                        <option value="mpaToPsi">ميجا باسكال (MPa) ➔ بوند/إنش² (PSI)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">القيمة المراد تحويلها</label>
                      <input type="number" value={unitConvert.value} onChange={(e) => setUnitConvert({...unitConvert, value: parseFloat(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-center text-white font-black" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* عرض نتائج الحساب التفاعلي الفوري */}
            <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
              <span className="text-xs text-slate-400 block font-black">النتيجة الحية التقريبية</span>
              
              {calcType === 'concrete' && (
                <div>
                  <div className="text-3xl md:text-4xl font-black text-cyan-400">
                    {(concreteVolume.length * concreteVolume.width * concreteVolume.height).toFixed(3)} <span className="text-sm text-slate-300">m³</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">كمية الأسمنت التقريبية المتوقعة: <strong className="text-white">{((concreteVolume.length * concreteVolume.width * concreteVolume.height) * 7).toFixed(1)} شوالات</strong> (بخلطة 350 كجم/م³)</p>
                </div>
              )}

              {calcType === 'steel' && (
                <div>
                  <div className="text-3xl md:text-4xl font-black text-cyan-400">
                    {(((steelWeightInput.diameter * steelWeightInput.diameter) / 162) * steelWeightInput.length * steelWeightInput.count).toFixed(2)} <span className="text-sm text-slate-300">كجم</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">وزن السيخ الواحد: <strong className="text-white">{((steelWeightInput.diameter * steelWeightInput.diameter) / 162).toFixed(3)} كجم/متر</strong></p>
                </div>
              )}

              {calcType === 'unit' && (
                <div>
                  <div className="text-3xl md:text-4xl font-black text-cyan-400">
                    {unitConvert.direction === 'knToTon' && (unitConvert.value * 0.10197).toFixed(4)}
                    {unitConvert.direction === 'psiToMpa' && (unitConvert.value * 0.006894).toFixed(4)}
                    {unitConvert.direction === 'mpaToPsi' && (unitConvert.value * 145.0377).toFixed(2)}
                    <span className="text-sm text-slate-300">
                      {unitConvert.direction === 'knToTon' && ' Ton'}
                      {unitConvert.direction === 'psiToMpa' && ' MPa'}
                      {unitConvert.direction === 'mpaToPsi' && ' PSI'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">تحويل قياسي دقيق معتمد هندسياً</p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* دمج قسمي: النقاشات و "اطلب أداتك الخاصة" */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* قسم التعليقات التفاعلية لأداة "صفر هالك" */}
          <section className="bg-slate-950/40 border border-slate-800 p-8 rounded-[28px] space-y-6">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>مراجعات وتقييمات أداة Rebar Zero-Waste</span>
            </h3>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input 
                type="text" 
                placeholder="اكتب تعليقك أو اقتراحك لتطوير الأداة..." 
                className="flex-grow bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-black focus:outline-none focus:border-cyan-500"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="bg-cyan-500 text-black px-4 rounded-xl hover:bg-cyan-400 transition-all">
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-4 max-h-60 overflow-y-auto scrollbar-none pr-1">
              {comments.map(c => (
                <div key={c.id} className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-cyan-400">{c.user}</span>
                    <span className="text-[9px] text-slate-500">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-normal leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* قسم اطلب أداتك الخاصة */}
          <section className="bg-gradient-to-br from-slate-950 to-cyan-950/20 border border-cyan-500/10 p-8 rounded-[28px] space-y-6 relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-44 h-44 bg-cyan-500/10 rounded-full blur-[80px]"></div>
            
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-base font-black text-white">اطلب أداتك البرمجية الخاصة</h3>
                <p className="text-[11px] text-slate-400 font-normal">لديك مشكلة مكررة بالمكتب أو الموقع؟ دعنا نبرمج حلها فوراً!</p>
              </div>
            </div>

            {formSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                <h4 className="text-sm font-black text-emerald-400">تم استلام طلبك بنجاح!</h4>
                <p className="text-xs text-slate-300 font-normal">سيقوم فريق الهندسة الذكية بمراجعة فكرتك البرمجية والتواصل معك لجدولتها.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="الاسم الكريم" 
                    required 
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500 text-white font-black"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="بريدك الإلكتروني للتواصل" 
                    required 
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500 text-white font-black"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                  />
                </div>
                <textarea 
                  placeholder="اشرح لنا المشكلة بالتفصيل والحل البرمجي المقترح (مثال: أداة لحساب مساحات الطوب بالذكاء الاصطناعي...)" 
                  rows="3" 
                  required
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500 text-white font-normal leading-relaxed"
                  value={requestForm.idea}
                  onChange={(e) => setRequestForm({...requestForm, idea: e.target.value})}
                ></textarea>
                <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10">
                  إرسال الطلب للجدولة البرمجية <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
              </form>
            )}
          </section>

        </div>

      </main>

      {/* شريط ذيل الصفحة */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
         <p>جميع الحقوق محفوظة لمنصة الهندسة الذكية © 2026</p>
      </footer>

    </div>
  );
}