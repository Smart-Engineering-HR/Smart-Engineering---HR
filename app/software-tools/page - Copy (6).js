"use client";

import React, { useState, useEffect } from "react";

export default function PublicSoftwareTools() {
  // حالات التنقل والتبويبات
  const [activeTab, setActiveTab] = useState("A");
  const [searchProfession, setSearchProfession] = useState("جميع التخصصات");
  const [searchTask, setSearchTask] = useState("");
  
  // حالات النوافذ المنبثقة التفاعلية
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [isPromptTesting, setIsPromptTesting] = useState(false);
  const [promptInputs, setPromptInputs] = useState({ input_area: "", input_price: "" });

  // حالات أدوات الحساب الإنشائية الحية (التطبيقات الحية)
  const [columnWidth, setColumnWidth] = useState(30);
  const [columnHeight, setColumnHeight] = useState(60);
  const [steelBarDiameter, setSteelBarDiameter] = useState(16);
  const [steelBarsCount, setSteelBarsCount] = useState(8);
  const [concreteStrength, setConcreteStrength] = useState(30);

  // حالات معالجة ملفات الذكاء الاصطناعي
  const [uploadedFile, setUploadedFile] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // نموذج طلب أداة خاصة
  const [customToolForm, setCustomToolForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // قواعد البيانات المحلية المشتركة مع لوحة التحكم
  const [prompts, setPrompts] = useState([]);
  const [liveApps, setLiveApps] = useState([]);
  const [automationTools, setAutomationTools] = useState([]);
  const [aiSolutions, setAiSolutions] = useState([]);
  const [managementTools, setManagementTools] = useState([]);

  // تحميل البيانات من localStorage ومزامنتها مع القيم الافتراضية الاحترافية
  useEffect(() => {
    const initData = (key, defaultVal) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return defaultVal;
    };

    setPrompts(initData("smart_eng_prompts", [
      { id: 1, title: "تحليل كود إنشائي ومقارنته بالأكواد العالمية", category: "الهندسة الإنشائية", text: "قم بتحليل هذا الكود الإنشائي المرفق لعمود خرساني خاضع لعزوم لامركزية وفقاً للكود الأمريكي ACI 318-19 مع حساب مساحة الحديد المطلوبة ومقارنتها بالمساحة الدنيا.", input_area: 500, input_price: 150 },
      { id: 2, title: "صياغة وتدقيق تقارير ميكانيكا التربة وتوصيات التأسيس", category: "تقرير التربة والأساسات", text: "بصفتك خبيراً جيوتقنياً، قم بصياغة تقرير فحص تربة بناءً على نتائج اختبار الاختراق القياسي SPT بقيمة N تساوى 22، واقترح نوع الأساسات وعمق التأسيس الآمن.", input_area: 1200, input_price: 450 },
      { id: 3, title: "توليد موجهات التصميم المعماري المستدام وباشتراطات LEED", category: "التصميم المعماري", text: "أنشئ دليلاً معمارياً متكاملاً لمبنى إداري ذكي يعتمد على التبريد السلبي وتحقيق كفاءة طاقة متوافقة مع الشهادة الذهبية لمنظومة LEED البنائية.", input_area: 3500, input_price: 1200 }
    ]));

    setLiveApps(initData("smart_eng_apps", [
      { id: 1, title: "حاسبة تدعيم الأعمدة الخرسانية الخاضعة للأحمال المركزية", type: "تقوية الأعمدة", desc: "أداة هندسية متقدمة لحساب القميص الخرساني والألياف الكربونية CFRP لزيادة قدرة تحمل الأعمدة." },
      { id: 2, title: "محاكي ترخيم وتصميم الكمرات الخرسانية مستمرة التحميل", type: "ترخيم الكمرات", desc: "حساب الترخيم اللحظي وطويل الأمد (Deflection) للكمرات وتحديد قيم التشريخ الفعلي." },
      { id: 3, title: "منظومة تحويل الوحدات الهندسية المركبة والديناميكية", type: "تحويل وحدات", desc: "التحويل الفوري الدقيق بين وحدات الإجهاد، العزوم، ومعاملات النفاذية المعقدة بضغطة واحدة." }
    ]));

    setAutomationTools(initData("smart_eng_automation", [
      { id: 1, title: "إضافة أتمتة حصر الكميات الذكي لبرنامج Revit", platform: "Autodesk Revit", size: "14.2 MB", downloads: 1420, desc: "يقوم بحصر كافة كميات الخرسانة المسلحة وحديد التسليح وتصديرها لجداول Excel مدمجة بضغطة زر واحدة." },
      { id: 2, title: "سكربت Python المتطور للتحليل الإنشائي للمنشآت المعدنية", platform: "Python / SAP2000", size: "2.8 MB", downloads: 890, desc: "أتمتة عملية توليد حالات التحميل الرياح والزلازل وتطبيقها مباشرة على النماذج الفراغية ثلاثية الأبعاد." },
      { id: 3, title: "أداة الدمج والتدقيق الآلي لملفات المخططات بصيغة PDF", platform: "برمجيات مستقلة", size: "8.5 MB", downloads: 2150, desc: "دمج اللوحات الهندسية مع مطابقة التعديلات وتلوين الفروقات الإنشائية المحدثة تلقائياً." }
    ]));

    setAiSolutions(initData("smart_eng_ai", [
      { id: 1, title: "منظومة تحويل المسوحات والصور الفوتوغرافية إلى لوحات CAD دقيقة", capability: "تحويل المخططات", desc: "ارفع صورة كروكي أو مخطط ممسوح ضوئياً، وسيقوم الذكاء الاصطناعي بتوليد ملف لير بابعاد دقيقة وصيغة DXF." },
      { id: 2, title: "المصفي والمدقق الآلي للأخطاء الهندسية في اللوحات التنفيذية Shop Drawings", capability: "فحص المخططات", desc: "تحليل ملفات DWG للكشف التلقائي عن تداخلات الخدمات الإنشائية والميكانيكية والمعمارية (Clash Detection)." },
      { id: 3, title: "الروبوت الجيوتقني لتشخيص الشروخ والتصدعات وتحديد خطورتها الإنشائية", capability: "روبوت تشخيصي", desc: "رفع صور الشروخ وتحديد أسبابها (انكماش، هبوط أساسات، قص) وتوليد بروتوكول معالجة فني متكامل." }
    ]));

    setManagementTools(initData("smart_eng_management", [
      { id: 1, title: "منصة إدارة المكاتب الفنية والمخططات الهندسية المستندية", scope: "المكتب الفني", desc: "لوحة SaaS لتتبع دورة اعتماد المخططات RFI و Submittals وإدارتها بين المالك والمقاول والاستشاري." },
      { id: 2, title: "نظام التتبع والتحليل الذكي للمناقصات والتقديرات السعرية", scope: "إدارة المناقصات", desc: "منظومة تحليل أسعار البنود والمواد الخام والتنبؤ الرياضي بالانحرافات السعرية في الأسواق الإقليمية." },
      { id: 3, title: "محرك الموارد البشرية وإدارة المهام لفرق المشاريع الميدانية", scope: "إدارة مشاريع و HR", desc: "توزيع المهام اليومية، ربط الإنتاجية بالموقع عبر الـ GPS، وإصدار تقارير الإنجاز الفورية للكوادر الهندسية." }
    ]));
  }, []);

  // دالة تشغيل واختبار البرومبت
  const handleTestPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setPromptInputs({ input_area: prompt.input_area || "", input_price: prompt.input_price || "" });
    setAiResponse("");
  };

  const executePromptSimulation = () => {
    setIsPromptTesting(true);
    setTimeout(() => {
      const area = parseFloat(promptInputs.input_area) || 1;
      const price = parseFloat(promptInputs.input_price) || 1;
      const total = area * price;
      setAiResponse(`[استجابة مهندس الذكاء الاصطناعي الافتراضي للمنصة]:\nبناءً على القالب الهيكلي المختار للطلب ذو المساحة المستهدفة ${area} متر مربع وبتكلفة تقديرية أولية تبلغ ${price} لكل وحدة؛ تم توليد مصفوفة الأكواد المطلوبة بنجاح. يوصى بتبني تسليح طولي مكثف بنسبة لا تقل عن 1.2% من مساحة القطاع الكلي الخرساني، مع تركيز الكانات بمسافة s=100mm في الثلث العلوي والسفلي للعمود لمقاومة قوى القص الناتجة عن الأحمال الزلزالية الإقليمية المتوقعة.`);
      setIsPromptTesting(false);
    }, 1500);
  };

  // دالة محاكاة رفع وتحليل الملفات بالذكاء الاصطناعي
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsAnalyzing(true);
      setTimeout(() => {
        setAiAnalysisResult({
          status: "تم الفحص بنجاح بنسبة دقة 99.4%",
          errorsCount: 2,
          clashes: [
            "تداخل ماسورة الحريق قطر 4 إنش مع الجسر الخرساني رقم B12 في المحور C-4.",
            "غطاء خرساني (Concrete Cover) في القواعد الطرفية أقل من 50 ملم (الموجود 35 ملم)."
          ],
          recommendation: "يرجى تعديل منسوب مسارات التكييف والحريق، وزيادة سمك غطاء القواعد المسلحة ليتوافق مع اشتراطات ديمومة البيئة الكبريتية."
        });
        setIsAnalyzing(false);
      }, 2500);
    }
  };

  // إرسال نموذج طلب أداة خاصة مع تخزين وحفظ الإيميلات الرسمية للمنصة
  const handleCustomToolSubmit = (e) => {
    e.preventDefault();
    const existingRequests = JSON.parse(localStorage.getItem("smart_eng_requests") || "[]");
    const newRequest = {
      id: Date.now(),
      ...customToolForm,
      date: new Date().toLocaleString("ar-EG"),
      status: "قيد الانتظار والمعالجة الإدارية"
    };
    existingRequests.push(newRequest);
    localStorage.setItem("smart_eng_requests", JSON.stringify(existingRequests));
    
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setCustomToolForm({ name: "", email: "", phone: "", details: "" });
    }, 4000);
  };

  // حسابات محاكاة العمود الإنشائي الحي
  const grossArea = columnWidth * columnHeight;
  const steelArea = steelBarsCount * (Math.PI * Math.pow(steelBarDiameter / 10, 2) / 4);
  const nominalCapacity = (0.85 * concreteStrength * (grossArea - steelArea) + 400 * steelArea) / 100;

  return (
    <div className="min-h-screen text-slate-100 font-sans relative overflow-x-hidden bg-slate-950">
      {/* الخلفية الهندسية الاحترافية الغامرة مع نمط شبكة الهندسة والمعمار */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none mix-blend-overlay z-0" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1920&q=80')` }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent pointer-events-none z-0" />
      
      {/* الخطوط الهندسية المنحنية التجميلية في الخلفية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
        
        {/* العلوية: زر العودة وشعار المنصة */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800/80 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                منصة الهندسة الذكية
              </h1>
              <p className="text-xs text-slate-400">بوابتك الرقمية المتكاملة للأتمتة والحلول الإنشائية والذكاء الاصطناعي</p>
            </div>
          </div>

          <a 
            href="/" 
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all duration-300 text-sm font-medium text-slate-300 hover:text-cyan-400 shadow-md"
          >
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            العودة إلى الرئيسية
          </a>
        </div>

        {/* عنوان الصفحة ووصفها الإبداعي */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 inline-block mb-3">
            المكتبة الرقمية والمختبر الإنشائي التفاعلي
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            قائمة البرمجيات والأدوات الذكية
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            استكشف وطبق حزمة البرمجيات والسكربتات المصممة لرفع كفاءة مكاتب التصميم الفني والميداني، معززة بقدرات الذكاء الاصطناعي والأتمتة المباشرة.
          </p>
        </div>

        {/* شريط القوائم والتبويبات الأساسية - مرتب أفقياً باحترافية في أعلى الصفحة */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 p-2 rounded-2xl shadow-xl max-w-5xl mx-auto mb-12 sticky top-4 z-40">
          <nav className="flex flex-wrap justify-center md:grid md:grid-cols-5 gap-1.5">
            {[
              { id: "A", label: "هندسة الأوامر", sub: "Prompt Eng." },
              { id: "B", label: "تطبيقات الويب الحية", sub: "Live Web Apps" },
              { id: "C", label: "برمجيات الأتمتة", sub: "Automation" },
              { id: "D", label: "حلول الذكاء الاصطناعي", sub: "AI Solutions" },
              { id: "E", label: "الإدارة والتحكم", sub: "Management" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-b from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 scale-105" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-normal mt-0.5 ${activeTab === tab.id ? "text-cyan-100" : "text-slate-500"}`}>{tab.sub}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 inset-x-0 h-1 bg-white/40 animate-pulse" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* عرض محتويات القوائم الفرعية بناءً على الاختيار الفعلي */}
        <main className="mb-20">
          
          {/* A. هندسة الأوامر */}
          {activeTab === "A" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">محرك توليد الموجهات الذكي للمهندسين</h3>
                  <p className="text-sm text-slate-400">اختر طبيعة تخصصك الهندسي والمهمة للحصول الفوري على البرومبت المعاير إقليمياً وعالمياً.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <select 
                    value={searchProfession} 
                    onChange={(e) => setSearchProfession(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  >
                    <option>جميع التخصصات</option>
                    <option>الهندسة الإنشائية</option>
                    <option>تقرير التربة والأساسات</option>
                    <option>التصميم المعماري</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="ابحث عن مهمة معينة..."
                    value={searchTask}
                    onChange={(e) => setSearchTask(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 flex-1 md:w-64"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts
                  .filter(p => searchProfession === "جميع التخصصات" || p.category === searchProfession)
                  .filter(p => p.title.includes(searchTask) || p.text.includes(searchTask))
                  .map((prompt) => (
                    <div key={prompt.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all group shadow-md">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md font-medium">
                            {prompt.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-cyan-400 transition-colors">{prompt.title}</h4>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-900">{prompt.text}</p>
                      </div>
                      <button
                        onClick={() => handleTestPrompt(prompt)}
                        className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        جرب البرومبت الآن داخل المنصة
                      </button>
                    </div>
                ))}
              </div>

              {/* نافذة اختبار البرومبت التفاعلية المباشرة */}
              {selectedPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-right" dir="rtl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                      <h4 className="text-lg font-bold text-cyan-400">مختبر المحادثة الفوري: {selectedPrompt.title}</h4>
                      <button onClick={() => setSelectedPrompt(null)} className="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm text-slate-300 font-bold mb-2">قالب الموجه الهندسي الأساسي:</label>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono leading-relaxed">
                        {selectedPrompt.text}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">المساحة المستهدفة (input_area):</label>
                        <input 
                          type="number"
                          value={promptInputs.input_area}
                          onChange={(e) => setPromptInputs({...promptInputs, input_area: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">التكلفة التقديرية للوحدة (input_price):</label>
                        <input 
                          type="number"
                          value={promptInputs.input_price}
                          onChange={(e) => setPromptInputs({...promptInputs, input_price: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={executePromptSimulation}
                      disabled={isPromptTesting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-sm text-white shadow-lg transition-all"
                    >
                      {isPromptTesting ? "جاري معالجة الكود وتوليد الاستجابة..." : "توليد وتحليل عبر الذكاء الاصطناعي الفوري"}
                    </button>

                    {aiResponse && (
                      <div className="mt-4 bg-slate-950/80 border border-cyan-500/30 p-4 rounded-xl">
                        <span className="text-xs font-bold text-cyan-400 block mb-1">استجابة محرك المنصة الذكي:</span>
                        <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed font-mono">{aiResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* B. تطبيقات الويب الحية */}
          {activeTab === "B" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* لوحة التحكم الجانبية لإدخال بيانات العمود الحية */}
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-5 h-fit shadow-lg">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase">Interactive Form</span>
                    <h3 className="text-lg font-bold text-white">مدخلات المحاكي الإنشائي الفوري</h3>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold">عرض القطاع الخرساني للعمود (cm): {columnWidth} سم</label>
                    <input type="range" min="20" max="100" step="5" value={columnWidth} onChange={(e) => setColumnWidth(parseInt(e.target.value))} className="w-full accent-cyan-500 bg-slate-950" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold">عمق القطاع الخرساني للعمود (cm): {columnHeight} سم</label>
                    <input type="range" min="30" max="200" step="5" value={columnHeight} onChange={(e) => setColumnHeight(parseInt(e.target.value))} className="w-full accent-cyan-500 bg-slate-950" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold">قطر أسياخ التسليح الطولي (mm): {steelBarDiameter} ملم</label>
                    <select value={steelBarDiameter} onChange={(e) => setSteelBarDiameter(parseInt(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-300 rounded-lg p-2 focus:outline-none">
                      <option value="12">12 ملم</option>
                      <option value="14">14 ملم</option>
                      <option value="16">16 ملم</option>
                      <option value="18">18 ملم</option>
                      <option value="20">20 ملم</option>
                      <option value="25">25 ملم</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold">عدد أسياخ التسليح الإجمالي: {steelBarsCount} أسياخ</label>
                    <input type="number" min="4" max="32" step="2" value={steelBarsCount} onChange={(e) => setSteelBarsCount(parseInt(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-300 rounded-lg p-2 focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold">مقاومة الخرسانة المميزة للإجهاد Fc' (MPa): {concreteStrength} ميجا باسكال</label>
                    <input type="range" min="20" max="60" step="5" value={concreteStrength} onChange={(e) => setConcreteStrength(parseInt(e.target.value))} className="w-full accent-cyan-500 bg-slate-950" />
                  </div>
                </div>

                {/* رسم بياني إنشائي فوري ومباشر متجاوب عبر الـ SVG ومخرجات النتائج */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-inner">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-white">الرسم التخطيطي الحي والمخرجات الميدانية</h4>
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 animate-pulse">حساب فوري ديناميكي</span>
                    </div>

                    {/* المخطط الإنشائي للعمود وتوزيعه التسليحي */}
                    <div className="bg-slate-950 rounded-xl p-8 border border-slate-850 flex items-center justify-center mb-6">
                      <svg width="220" height="220" viewBox="0 0 200 200" className="drop-shadow-md">
                        {/* الخرسانة الخارجية للعمود */}
                        <rect x="20" y="20" width="160" height="160" fill="#334155" stroke="#64748b" strokeWidth="4" rx="6" />
                        {/* الكانة الداخلية للعمود الخرساني */}
                        <rect x="30" y="30" width="140" height="140" fill="none" stroke="#ef4444" strokeWidth="2" rx="4" />
                        {/* نقاط توزيع حديد التسليح الطولي الزوايا والأطراف */}
                        <circle cx="35" cy="35" r="7" fill="#10b981" />
                        <circle cx="165" cy="35" r="7" fill="#10b981" />
                        <circle cx="35" cy="165" r="7" fill="#10b981" />
                        <circle cx="165" cy="165" r="7" fill="#10b981" />
                        {steelBarsCount > 4 && <circle cx="100" cy="35" r="7" fill="#10b981" />}
                        {steelBarsCount > 6 && <circle cx="100" cy="165" r="7" fill="#10b981" />}
                        {steelBarsCount > 8 && <circle cx="35" cy="100" r="7" fill="#10b981" />}
                        {steelBarsCount > 10 && <circle cx="165" cy="100" r="7" fill="#10b981" />}
                      </svg>
                    </div>

                    {/* لوحة استعراض مصفوفة الأرقام الإنشائية الصادرة */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">المساحة الكلية القطاع</span>
                        <span className="text-lg font-black text-slate-200">{grossArea} <span className="text-xs font-normal">cm²</span></span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">مساحة تسليح الحديد</span>
                        <span className="text-lg font-black text-cyan-400">{steelArea.toFixed(2)} <span className="text-xs font-normal">cm²</span></span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">مقاومة التحمل الاسمية Pn</span>
                        <span className="text-lg font-black text-emerald-400">{nominalCapacity.toFixed(1)} <span className="text-xs font-normal">kN</span></span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 text-center border-t border-slate-850 pt-3">
                    * الحسابات مبنية على افتراض التحميل المركزي الخالص طبقاً لمعادلات تصميم الأكواد الهندسية المعتمدة في دول الخليج.
                  </p>
                </div>
              </div>

              {/* بطاقات الأدوات المتاحة للتطبيقات الحية القادمة من الإدارة */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {liveApps.map((app) => (
                  <div key={app.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
                    <span className="text-xs text-cyan-400 font-mono block mb-2">● {app.type}</span>
                    <h4 className="text-base font-bold text-slate-200 mb-2">{app.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{app.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* C. برمجيات الأتمتة */}
          {activeTab === "C" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {automationTools.map((tool) => (
                  <div key={tool.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded font-bold">
                          {tool.platform}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{tool.size}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-200 mb-3">{tool.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-900 mb-4">{tool.desc}</p>
                    </div>
                    
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-850">
                      <span className="text-xs text-slate-500">تم التحميل: {tool.downloads} مرة</span>
                      <button 
                        onClick={() => alert(`محاكاة النظام: جاري بدء تحميل حزمة السكربت والملفات التنفيذية الذكية لـ [${tool.title}] بنجاح.`)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                      >
                        تحميل وتدشين الآن
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D. حلول الذكاء الاصطناعي */}
          {activeTab === "D" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl max-w-3xl mx-auto text-center space-y-6">
                <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">البوابة الفورية لرفع وفحص المخططات الإنشائية والـ CAD</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">ارفع ملفاتك الفنية بصيغة (PDF/DWG) لتشغيل مصفوفة الذكاء الاصطناعي ومطابقة جودة الأكواد الهندسية المطلوبة فوراً.</p>
                </div>
                
                <div className="max-w-xs mx-auto">
                  <label className="w-full flex flex-col items-center px-4 py-3 bg-slate-950 text-slate-300 rounded-xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer text-sm font-medium transition-all">
                    <span>اختر أو اسحب الملف هنا</span>
                    <input type="file" className="hidden" accept=".pdf,.dwg,.dxf" onChange={handleFileUpload} />
                  </label>
                </div>

                {isAnalyzing && (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-cyan-400 font-medium animate-pulse">جاري فحص المخطط ومطابقة تداخلات الخدمات...</span>
                  </div>
                )}

                {aiAnalysisResult && !isAnalyzing && (
                  <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 text-right space-y-3 shadow-inner animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <span className="text-sm font-bold text-emerald-400">● {aiAnalysisResult.status}</span>
                      <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">تم كشف {aiAnalysisResult.errorsCount} خطأ إنشائي</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                      {aiAnalysisResult.clashes.map((clash, idx) => (
                        <li key={idx} className="leading-relaxed text-slate-300">{clash}</li>
                      ))}
                    </ul>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 mt-2">
                      <span className="text-xs font-bold text-cyan-400 block mb-1">التوصية الفنية الموصى بها:</span>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{aiAnalysisResult.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiSolutions.map((sol) => (
                  <div key={sol.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/20 transition-all">
                    <span className="text-xs text-cyan-400 font-bold block mb-2"># {sol.capability}</span>
                    <h4 className="text-base font-bold text-slate-200 mb-2">{sol.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{sol.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. الإدارة والتحكم */}
          {activeTab === "E" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {managementTools.map((mgt) => (
                  <div key={mgt.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between group hover:border-cyan-500/30 transition-all">
                    <div>
                      <span className="text-xs bg-slate-950 text-slate-400 border border-slate-850 px-2.5 py-1 rounded font-mono inline-block mb-3">
                        {mgt.scope}
                      </span>
                      <h4 className="text-base font-bold text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">{mgt.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{mgt.desc}</p>
                    </div>
                    <button 
                      onClick={() => alert(`محاكاة النظم: جاري نقلك لبيئة سحابية مخصصة لإنشاء حساب المؤسسة الخاص بك في نظام SaaS لـ [${mgt.title}].`)}
                      className="w-full py-2 bg-slate-800 group-hover:bg-cyan-600 text-slate-300 group-hover:text-white font-bold text-xs rounded-xl transition-all"
                    >
                      ولوج لبيئة السحاب الحية (SaaS)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* خط فاصل مرئي */}
        <hr className="border-slate-900 my-16" />

        {/* نموذج اطلب أداتك البرمجية الخاصة التفاعلي بالكامل والمربوط إدارياً */}
        <section className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-extrabold text-white mb-2">اطلب أداتك البرمجية المخصصة الآن</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              إن كان لديك أفكار لحسابات مخصصة أو أتمتة لملفات وعمليات معينة؛ أرسل لنا التفاصيل لتطويرها ودمجها فوراً داخل بيئتك السحابية الخاصة.
            </p>
          </div>

          <form onSubmit={handleCustomToolSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">الاسم الكريم *</label>
                <input 
                  type="text" 
                  required
                  value={customToolForm.name}
                  onChange={(e) => setCustomToolForm({...customToolForm, name: e.target.value})}
                  placeholder="المهندس/ة الكريمة"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">البريد الإلكتروني للتواصل *</label>
                <input 
                  type="email" 
                  required
                  value={customToolForm.email}
                  onChange={(e) => setCustomToolForm({...customToolForm, email: e.target.value})}
                  placeholder="your.name@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 transition-all text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">رقم الهاتف الجوال (مع الرمز الدولي) *</label>
              <input 
                type="tel" 
                required
                value={customToolForm.phone}
                onChange={(e) => setCustomToolForm({...customToolForm, phone: e.target.value})}
                placeholder="+967XXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 transition-all text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">شرح تفصيلي ورؤيتك للأداة البرمجية المطلوبة *</label>
              <textarea 
                rows="4"
                required
                value={customToolForm.details}
                onChange={(e) => setCustomToolForm({...customToolForm, details: e.target.value})}
                placeholder="يرجى ذكر المعطيات، المعادلات المرجعية، نوع المخرجات أو الملف المراد أتمتة حصر تفاصيله بالكامل..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 transition-all leading-relaxed"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.005] active:scale-[0.995] transition-all"
            >
              إرسال الطلب وإخطار خوادم الدعم الفني للمنصة
            </button>
          </form>

          {formSubmitted && (
            <div className="mt-6 bg-slate-950 border border-emerald-500/30 p-4 rounded-xl text-center animate-fadeIn">
              <span className="text-sm font-bold text-emerald-400 block mb-1">✓ تم تسجيل وإرسال طلبك بنجاح تام!</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                تم توجيه وتوثيق الطلب في لوحة تحكم المنصة، كما تم بث إشعارات المزامنة الفورية للبريد الإلكتروني المعتمد والمخصص للموقع التابع للمؤسسة:
                <br />
                <span className="text-cyan-400 font-mono text-[11px]">Smart.Engineering.Global@proton.me</span> أو <span className="text-cyan-400 font-mono text-[11px]">smart.engineering.global@tuta.io</span>
              </p>
            </div>
          )}
        </section>

        {/* التذييل الفني للمنصة */}
        <footer className="text-center py-6 border-t border-slate-900 text-xs text-slate-500">
          <p>© 2026 منصة الهندسة الذكية - جميع الحقوق والملكية الفكرية للأدوات والبرمجيات محفوظة.</p>
        </footer>

      </div>
    </div>
  );
}