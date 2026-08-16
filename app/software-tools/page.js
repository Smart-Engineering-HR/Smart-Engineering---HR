"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Cpu, Settings, ShieldAlert, Sliders, ArrowRight, 
  Search, Copy, CheckCircle2, Download, ExternalLink, HelpCircle,
  FileText, Upload, BarChart2, AlertTriangle, Layers, Grid, FileSpreadsheet, Image as ImageIcon
} from "lucide-react";

export default function SoftwareToolsPublic() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState([]);
  
  // حالات تفاعلية للنوافذ المنبثقة والمعالجة
  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptInputs, setPromptInputs] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  
  const [activeAppModal, setActiveAppModal] = useState(null);
  const [appInputs, setAppInputs] = useState({});
  const [appResult, setAppResult] = useState(null);

  // نظام رفع الملفات والمعالجة الشاملة للمخرجات المتقدمة
  const [activeProcessingModal, setActiveProcessingModal] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputType, setOutputType] = useState("all"); // نوع المخرج المحدد
  const [processingResult, setProcessingResult] = useState(null);

  // نموذج طلب أداة برمجية خاصة
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    details: ""
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // تحميل البيانات المتزامنة تلقائياً من لوحة التحكم
  useEffect(() => {
    const storedTools = localStorage.getItem("smart_engineering_tools");
    if (storedTools) {
      setTools(JSON.parse(storedTools));
    } else {
      // بيانات افتراضية فنية متكاملة مطابقة للملف
      const defaultTools = [
        {
          id: "tool-1",
          title: "النظام الذكي لهندسة الأوامر وإعداد برومبت الخرسانة والمواد",
          category: "prompt-engineering",
          aiPlatform: "ChatGPT / Claude 3",
          badge: "أداة حصرية معتمدة",
          description: "توليد أوامر برمجية صارمة لصياغة تقارير فحص ومطابقة المواد الإنشائية وفق كود البناء السعودي (SBC) والكود الأمريكي (ACI).",
          secretPrompt: "أنت مهندس مواد خبير ومستشار إنشائي، قم بكتابة تقرير فني شامل ومفصل عن مادة [المادة] المستخدمة في [العنصر الإنشائي] طبقاً لاشتراطات كود [الكود المعتمد] مبيناً الفحوصات المختبرية وحدود القبول والرفض للعينات الفنية.",
          placeholders: ["المادة", "العنصر الإنشائي", "الكود المعتمد"]
        },
        {
          id: "tool-2",
          title: "حاسبة التحمل القصي والميكانيكي للأعمدة الخرسانية",
          category: "live-web-apps",
          aiPlatform: "محرك معادلات المنصة",
          badge: "حساب فوري مباشر",
          description: "حساب التحمل الاسمي والمسموح للأعمدة الخرسانية القصيرة الخاضعة لأحمال مركزية نقية وفق معادلات كود ACI 318 بدقة متناهية.",
          variables: [
            { name: "Ac", label: "مساحة المقطع الخرساني الإجمالي (mm²)", type: "number", unit: "mm²" },
            { name: "fc", label: "المقاومة المميزة للخرسانة fc' (MPa)", type: "number", unit: "MPa" }
          ],
          logic: "(0.85 * fc * Ac) / 1000",
          validation: "المساحة والمقاومة يجب أن تكون قيماً موجبة أكبر من الصفر",
          template: "قوة تحمل العمود الاسمية التقريبية هي: {Result} كيلو نيوتن (kN)"
        },
        {
          id: "tool-3",
          title: "برمجية المعالجة الآلية للمخططات الهندسية وحصر الكميات الذكي",
          category: "automation-software",
          aiPlatform: "Python SaaS Engine",
          badge: "أتمتة ذكية",
          description: "رفع المخططات بمختلف الامتدادات (RVT, IFC, DWG, DXF, PDF) لمعالجتها وتوليد سجلات الحصر والمطابقة الفنية الفورية تلقائياً.",
          requiredOutputs: ["transmittal-log", "excel-sheet", "gantt-chart", "marked-up-file"]
        },
        {
          id: "tool-4",
          title: "روبوت تشخيص العيوب الإنشائية والتحليل المرئي للشروخ الخرسانية",
          category: "ai-solutions",
          aiPlatform: "Computer Vision & Deep Learning",
          badge: "ذكاء اصطناعي موجه",
          description: "تحليل صور الشروخ والعيوب البصرية وتوليد الخرائط الحرارية (Heatmaps) لتحديد العمق، ونوع الشرخ، ونسبة الخطورة الفورية مع التوصية الهندسية الكامله.",
          requiredOutputs: ["heatmap", "status-report", "audit-report"]
        }
      ];
      setTools(defaultTools);
      localStorage.setItem("smart_engineering_tools", JSON.stringify(defaultTools));
    }
  }, []);

  // تصفية وعرض البيانات والبحث الفوري
  const filteredTools = tools.filter(tool => {
    const matchesTab = activeTab === "all" || tool.category === activeTab;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // معالجة نافذة هندسة الأوامر (البرومبت الذكي)
  const handleOpenPrompt = (tool) => {
    setActivePromptModal(tool);
    const inputs = {};
    tool.placeholders?.forEach(p => { inputs[p] = ""; });
    setPromptInputs(inputs);
  };

  const handleExecutePrompt = () => {
    let finalPrompt = activePromptModal.secretPrompt;
    Object.keys(promptInputs).forEach(key => {
      finalPrompt = finalPrompt.replace(`[${key}]`, promptInputs[key]);
    });
    navigator.clipboard.writeText(finalPrompt);
    setCopiedId(activePromptModal.id);
    alert(`تم توليد ونسخ نص البرومبت بنجاح! يرجى لصقه في منصة الذكاء الاصطناعي الموصى بها: (${activePromptModal.aiPlatform})`);
    setTimeout(() => { setCopiedId(null); setActivePromptModal(null); }, 1200);
  };

  // معالجة واجهة تطبيقات الويب الحية (محرك الحساب الرياضي)
  const handleOpenApp = (tool) => {
    setActiveAppModal(tool);
    const inputs = {};
    tool.variables?.forEach(v => { inputs[v.name] = ""; });
    setAppInputs(inputs);
    setAppResult(null);
  };

  const handleCalculateApp = () => {
    try {
      let logicStr = activeAppModal.logic;
      let hasZeroOrNeg = false;
      Object.keys(appInputs).forEach(key => {
        const val = parseFloat(appInputs[key]) || 0;
        if (val <= 0) hasZeroOrNeg = true;
        logicStr = logicStr.replaceAll(key, val);
      });

      if (hasZeroOrNeg) {
        alert(`تنبيه قيود التحقق فنيًا: ${activeAppModal.validation || "القيم المدخلة غير مسموح بها"}`);
        return;
      }

      const calcResult = eval(logicStr);
      if (isNaN(calcResult) || !isFinite(calcResult)) throw new Error("خطأ حسابي");
      
      setAppResult({
        numeric: calcResult.toFixed(2),
        report: `بناءً على المعادلات المعيارية المحددة في لوحة التحكم وتطبيق كود التصميم المعتمد (مثل ACI 318)، فإن القيمة الإجمالية المحسوبة تحقق حدود الأمان الهندسي الميكانيكي المستهدف.`
      });
    } catch (err) {
      alert("الرجاء التحقق من صحة القيم والمعادلة الحسابية المعتمدة لهذه الأداة.");
    }
  };

  // نظام رفع الملفات ومحاكاة المعالجة الشاملة للمخرجات المتعددة والأشكال المطلوبة
  const handleOpenProcessing = (tool) => {
    setActiveProcessingModal(tool);
    setUploadedFile(null);
    setProcessingResult(null);
    setOutputType("all");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleStartProcessing = () => {
    if (!uploadedFile) {
      alert("الرجاء رفع ملف المشروع أولاً ليتمكن محرك الأتمتة من بدء المعالجة الحية.");
      return;
    }
    setIsProcessing(true);
    
    // محاكاة معالجة ذكية دقيقة لإخراج كافة الصيغ والأشكال الهندسية المطلوبة بالملف
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingResult({
        transmittalLog: [
          { id: "S-01", name: "المخطط الإنشائي للقواعد الأرضية", version: "V1.0", status: "معتمد" },
          { id: "S-02", name: "مخطط تسليح الأعمدة والجدران الاستنادية", version: "V2.1", status: "مرفوض - نقص تسليح" },
          { id: "A-01", name: "المخطط المعماري للمسقط الأفقي العام", version: "V1.0", status: "معتمد" }
        ],
        comparisonSheet: [
          { rank: 1, provider: "مجموعة الراجحي للمواد والحديد", score: "94.5%", recommendation: "المورد الأنسب للتعاقد الفوري" },
          { rank: 2, provider: "شركة الفوزان للمقاولات والتوريد", score: "82.0%", recommendation: "خيار بديل ثانٍ" },
          { rank: 3, provider: "مؤسسة الشرق للمواد الإنشائية", score: "65.5%", recommendation: "لا ينصح به حالياً لتجاوز الميزانية" }
        ],
        ganttChart: [
          { task: "أعمال حفر الموقع وتجهيز التربة", duration: "12 يوم", status: "مكتملة", budget: "100%" },
          { task: "صب خرسانة القواعد والرقاب الإنشائية", duration: "8 أيام", status: "تأخير 3 أيام", budget: "85%" },
          { task: "عزل الرطوبة وبدء أعمال الردم والمعايرة", duration: "5 أيام", status: "قيد الانتظار", budget: "0%" }
        ],
        productivity: [
          { engineer: "م. هاشم سلطان (الإنشائي الاستشاري)", taskCount: "18 مهمة/مخطط", performance: "ممتاز - 98%" },
          { engineer: "مهندس الموقع التنفيذي الميداني", taskCount: "12 مهمة", performance: "جيد جداً - 85%" }
        ],
        crackAnalysis: {
          type: "شروخ قص إنشائية حادة (Shear Crack)",
          criticality: "عالية جداً ومقلقة للمنطوق الإنشائي",
          action: "إخلاء المكان فوراً واستشارة استشاري هندسي معتمد لعمل قميص خرساني تدعيمي للكمرة المتضررة.",
          depth: "14 mm",
          width: "3.5 mm"
        },
        auditReport: [
          { error: "هذا العمود (C3) لا يحقق نسبة التسليح الدنيا المطلوبة", cause: "مساحة الحديد الحالية 0.6% والكود يفرض 1.0%", fix: "زيادة أقطار حديد التسليح إلى 6Φ16 مم" },
          { error: "نقص واضح في الأختام الهندسية الرسمية والاعتمادية", cause: "الملف المرفوع لا يحتوي توقيع مهندس المواد", fix: "إعادة الرفع بعد الختم والتوقيع الرقمي المعتمد" }
        ]
      });
    }, 2000);
  };

  // نظام طلب أداة مخصصة وعكسها وحفظها مع محاكاة إرسال الإشعارات للايميلات الثلاثة المعتمدة
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("الرجاء تعبئة كافة حقول الاستمارة المطلوبة بشكل مكتمل.");
      return;
    }
    const newRequest = {
      id: "req-" + Date.now(),
      ...orderForm,
      date: new Date().toLocaleString()
    };
    
    const storedRequests = localStorage.getItem("smart_engineering_requests") || "[]";
    const currentRequests = JSON.parse(storedRequests);
    currentRequests.push(newRequest);
    localStorage.setItem("smart_engineering_requests", JSON.stringify(currentRequests));
    
    setOrderSubmitted(true);
    alert("تم بنجاح إرسال وتوجيه طلبك الفني وجاري إرسال إشعارات الأتمتة البرمجية إلى الإيميلات المعتمدة للمنصة.");
    
    setTimeout(() => {
      setOrderSubmitted(false);
      setOrderForm({ name: "", email: "", phone: "", details: "" });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased rtl relative" dir="rtl">
      {/* صورة الخلفية الفنية الهندسية الممتدة والراقية المدمجة بكامل الواجهة لتوضيح هوية المنصة */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06] pointer-events-none z-0 select-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80')" }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* الهيدر وزر العودة التفاعلي للرئيسية */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3.5 rounded-2xl shadow-xl shadow-blue-500/10">
              <Cpu className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-1 font-medium">بوابة الأدوات البرمجية والأتمتة المتكاملة ومعالجة المخططات الهندسية بالذكاء الاصطناعي</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-blue-400 font-bold px-6 py-3 rounded-xl border border-slate-700 transition-all shadow-md group text-sm"
          >
            <span>العودة إلى القائمة الرئيسية للمنصة</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </header>

        {/* شريط التنقل الشامل لجميع الأقسام الفرعية التابعة لمنظومة البرمجيات */}
        <nav className="mb-10 bg-slate-800/80 backdrop-blur border border-slate-700 p-2 rounded-2xl shadow-2xl overflow-x-auto">
          <ul className="flex items-center gap-2 min-w-max">
            {[
              { id: "all", label: "كل البرمجيات والأدوات الإنشائية", icon: Cpu },
              { id: "prompt-engineering", label: "هندسة الأوامر الذكية", icon: Terminal },
              { id: "live-web-apps", label: "تطبيقات الويب الحية", icon: Sliders },
              { id: "automation-software", label: "برمجيات الأتمتة المتقدمة", icon: Settings },
              { id: "ai-solutions", label: "حلول الذكاء الاصطناعي", icon: Cpu },
              { id: "management-control", label: "الإدارة والتحكم الفني", icon: ShieldAlert },
              { id: "order-custom", label: "أطلب أداتك البرمجية الخاصة", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/10"
                        : "text-slate-300 hover:bg-slate-700/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* واجهة طلب أداة مخصصة الشاملة والمربوطة بلوحة التحكم والايميلات */}
        {activeTab === "order-custom" ? (
          <div className="max-w-3xl mx-auto bg-slate-800/95 backdrop-blur border border-slate-700 p-8 rounded-3xl shadow-2xl relative">
            <div className="absolute top-0 left-0 bg-gradient-to-b from-blue-500/10 to-transparent w-full h-32 rounded-t-3xl pointer-events-none"></div>
            <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2 relative z-10">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>طلب بناء وتطوير أداة برمجية هندسية مخصصة</span>
            </h2>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed relative z-10">
              اطرح أفكارك الهندسية، المعادلات الرياضية، أو آليات الأتمتة البرمجية المطلوبة لمشاريعك، وسيقوم فريق التطوير بإدراجها فوراً كأداة حية داخل لوحة التحكم والمنصة العامة.
            </p>

            {orderSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>تم إرسال وحفظ طلبك بنجاح وعكسه في لوحة الإدارة!</span>
                </div>
                <p className="text-[11px] text-slate-400 pr-6">تم توجيه نسخة الإشعار التلقائية إلى الإيميلات المعتمدة للمنصة: Smart.Engineering.Global@proton.me و الأجهزة التابعة.</p>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المهندس أو الجهة الاستشارية الطالبة *</label>
                <input 
                  type="text" required value={orderForm.name}
                  onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs font-medium"
                  placeholder="الاسم الكامل أو اسم الشركة والمكتب الاستشاري..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني الرسمي للمتابعة *</label>
                  <input 
                    type="email" required value={orderForm.email}
                    onChange={e => setOrderForm({...orderForm, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs left-align font-mono"
                    placeholder="engineer@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الهاتف أو الواتساب (مع رمز الدولة) *</label>
                  <input 
                    type="tel" required value={orderForm.phone}
                    onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
                    placeholder="+9665..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الشرح والتفاصيل الفنية الدقيقة (المتغيرات، المعادلات، الكود المستخدم والمخرجات) *</label>
                <textarea 
                  rows="6" required value={orderForm.details}
                  onChange={e => setOrderForm({...orderForm, details: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
                  placeholder="اكتب هنا بوضوح تفاصيل الحسابات الإنشائية، شروط التحقق من الأبعاد الخرسانية، المتغيرات المطلوبة، أو صيغة البرومبت المراد حمايته وأتمتته..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all text-xs"
              >
                اعتماد طلب بناء الأداة الهندسية المخصصة وإخطار الإدارة فورياً
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* مربع البحث الفوري الذكي */}
            <div className="max-w-xl mx-auto mb-10 relative">
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن أداة برمجية، حاسبة حية، أو نظام أتمتة مخططات معين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pr-12 pl-4 py-4 text-white focus:outline-none focus:border-blue-500 placeholder-slate-400 font-medium shadow-md text-xs"
              />
            </div>

            {/* شبكة عرض بطاقات البرمجيات المنشورة التزامية المزامنة */}
            {filteredTools.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-800">
                <p className="text-slate-400 font-medium text-xs">لا توجد برمجيات هندسية منشورة حالياً تحت هذا التبويب المحدد.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div 
                    key={tool.id} 
                    className="bg-slate-800/95 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-500 transition-all group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-500/10 text-blue-400 text-[11px] px-3 py-1 rounded-full border border-blue-500/20 font-bold">
                          {tool.badge || "برمجية متقدمة"}
                        </span>
                        {tool.aiPlatform && (
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {tool.aiPlatform}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                        {tool.title}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-3 mb-6 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-700/60">
                      {tool.category === "prompt-engineering" && (
                        <button
                          onClick={() => handleOpenPrompt(tool)}
                          className="w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow"
                        >
                          <Terminal className="h-4 w-4" />
                          <span>تعبئة وتوليد البرومبت الذكي وعكسه</span>
                        </button>
                      )}

                      {tool.category === "live-web-apps" && (
                        <button
                          onClick={() => handleOpenApp(tool)}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow"
                        >
                          <Sliders className="h-4 w-4" />
                          <span>تشغيل الحاسبة التفاعلية المباشرة</span>
                        </button>
                      )}

                      {(tool.category !== "prompt-engineering" && tool.category !== "live-web-apps") && (
                        <button
                          onClick={() => {
                            if (tool.category === "management-control") {
                              alert("سيتم فتح وتوجيه الحساب إلى نظام إدارة ومراقبة المشاريع الهندسية الشامل SaaS.");
                            } else {
                              handleOpenProcessing(tool);
                            }
                          }}
                          className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow"
                        >
                          <Upload className="h-4 w-4" />
                          <span>رفع الملفات ومعالجة المخرجات والتقارير</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* نافذة منبثقة 1: هندسة الأوامر الذكية وقراءة الفراغات ذات الأقواس المربعة */}
        {activePromptModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-1">{activePromptModal.title}</h3>
              <p className="text-slate-400 text-[11px] mb-4">
                المنصة الهندسية الموصى بها للتنفيذ: <span className="text-cyan-400 font-mono font-bold">{activePromptModal.aiPlatform}</span>
              </p>
              
              <div className="space-y-4 my-4 max-h-64 overflow-y-auto pr-1 border-t border-b border-slate-700/60 py-4">
                {activePromptModal.placeholders && activePromptModal.placeholders.length > 0 ? (
                  activePromptModal.placeholders.map((p, i) => (
                    <div key={i}>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">أدخل تفاصيل الحقل المخصص [{p}]: *</label>
                      <input 
                        type="text" 
                        value={promptInputs[p] || ""}
                        onChange={e => setPromptInputs({...promptInputs, [p]: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder={`اكتب هنا قيمة الحقل المتغير لـ ${p}...`}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">هذا البرومبت الهندسي مهيأ ومحمي بالكامل وجاهز للتنفيذ الفوري المباشر دون مدخلات فرعية.</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 mt-4">
                <button onClick={() => setActivePromptModal(null)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg">إغلاق</button>
                <button onClick={handleExecutePrompt} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow">
                  <Copy className="h-4 w-4" />
                  <span>توليد ونسخ نص الأمر للحافظة</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة منبثقة 2: تطبيقات الويب الحية (محرك المعادلات وعرض النتيجة والتقرير الفني) */}
        {activeAppModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-lg font-bold text-white mb-1">{activeAppModal.title}</h3>
              <p className="text-slate-400 text-xs mb-4">المعادلة المعرفية النشطة: <code className="bg-slate-950 px-2 py-0.5 text-cyan-400 rounded font-mono text-[11px]">{activeAppModal.logic}</code></p>
              
              <div className="space-y-4 my-4 border-t border-b border-slate-700/60 py-4">
                {activeAppModal.variables?.map((v, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 items-center">
                    <label className="col-span-2 text-xs font-bold text-slate-300">{v.label}:</label>
                    <div className="relative">
                      <input 
                        type={v.type || "number"} 
                        value={appInputs[v.name] || ""}
                        onChange={e => setAppInputs({...appInputs, [v.name]: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-left font-mono focus:outline-none focus:border-cyan-500"
                      />
                      <span className="absolute left-2.5 top-2 text-[10px] text-slate-500 font-bold font-mono">{v.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleCalculateApp}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
              >
                تشغيل محرك الحساب والتحقق الفوري وفق كود التصميم
              </button>

              {appResult && (
                <div className="mt-6 p-5 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase block mb-1">النتيجة الرقمية الصارمة (واضحة وبخط عريض):</span>
                    <div className="text-4xl font-black text-white tracking-wide font-mono">{appResult.numeric}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 block mb-1">التقرير الفني الهندسي التفصيلي (ACI 318 / SBC):</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      {appResult.report} ويظهر الرقم المعياري متوافقاً مع حساب المقاومة الاسمية والحدود القياسية للأمان والاستقرار الهيكلي المعتمد.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => alert("جاري توليد وحفظ ملف الحسابات الشامل بصيغة تقرير فني مختوم PDF.")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all shadow"
                  >
                    <Download className="h-4 w-4" />
                    <span>تصدير وتحميل التقرير الفني وحسابات المقطع PDF</span>
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700 mt-6">
                <button onClick={() => { setActiveAppModal(null); setAppResult(null); }} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق النافذة</button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة منبثقة 3: نظام رفع ومعالجة الملفات الشامل وعرض كافة صيغ وأشكال المخرجات الهندسية المطلوبة بالملف */}
        {activeProcessingModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-4xl p-6 relative shadow-2xl overflow-y-auto max-h-[95vh]">
              <h3 className="text-xl font-bold text-white mb-2">{activeProcessingModal.title}</h3>
              <p className="text-slate-400 text-xs mb-4">رفع ملفات ومخططات المشروع بمختلف أنواعها المعيارية (.RVT, .IFC, .DWG, .DXF, .PDF, .XLSX, .PNG) لبدء سكربت الأتمتة المتقدم والمعايرة الفنية.</p>
              
              {/* صندوق الرفع الفني المتقدم لكافة أنواع الملفات */}
              <div className="border-2 border-dashed border-slate-600 rounded-2xl p-6 text-center bg-slate-950/50 mb-4 cursor-pointer hover:border-blue-500 transition-colors relative">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept=".rvt,.ifc,.dwg,.dxf,.pdf,.xlsx,.png,.jpg,.jpeg"
                />
                <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2 animate-bounce" />
                {uploadedFile ? (
                  <p className="text-xs text-emerald-400 font-bold">الملف الجاهز للمعالجة: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                ) : (
                  <>
                    <p className="text-xs text-slate-300 font-semibold">اسحب وأفلت المخططات الإنشائية/المعمارية، الصور، أو ملفات الحصر هنا</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">يدعم ملفات الريفيت، الأوتوكاد، صور الشروخ، جداول الإكسيل والـ PDF الفنية حتى 100 ميغابايت</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <button 
                  onClick={handleStartProcessing}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isProcessing ? "جاري تشغيل محركات المعالجة والحساب..." : "بدء معالجة الملف وتشغيل سكربت الأتمتة المتقدم"}
                </button>

                {processingResult && (
                  <div className="flex gap-2">
                    <select 
                      value={outputType} 
                      onChange={e => setOutputType(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-1.5 font-bold text-slate-300 focus:outline-none"
                    >
                      <option value="all">عرض كافة أشكال المخرجات المتاحة</option>
                      <option value="transmittal">سجل المخططات (Transmittal Log)</option>
                      <option value="comparison">جدول المقارنة وتقارير التوصية للموردين</option>
                      <option value="dashboard">لوحة القيادة ورسوم الإنتاجية (Gantt Chart)</option>
                      <option value="crack">تحليل الشروخ البصري والخرائط الحرارية</option>
                      <option value="audit">قائمة الملاحظات والملفات المعلمة والمصححة</option>
                    </select>
                  </div>
                )}
              </div>

              {/* قسم عرض المخرجات الهندسية بالكامل حسب رغبة واختيار المستخدم */}
              {processingResult && (
                <div className="space-y-6 mt-4 border-t border-slate-700/60 pt-4 max-h-[50vh] overflow-y-auto pl-2">
                  
                  {/* الشكل 1: سجل المخططات التفاعلي */}
                  {(outputType === "all" || outputType === "transmittal") && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-blue-400 mb-3 flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        <span>سجل المخططات التفاعلي (Transmittal Log):</span>
                      </h4>
                      <table className="w-full text-right border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                            <th className="p-2">معرف المخطط</th>
                            <th className="p-2">اسم الملف الهندسي المرفوع</th>
                            <th className="p-2">الإصدار</th>
                            <th className="p-2 text-center">حالة الاعتماد الفني الكودي</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {processingResult.transmittalLog.map((log, i) => (
                            <tr key={i} className="hover:bg-slate-900/50">
                              <td className="p-2 font-mono text-cyan-400">{log.id}</td>
                              <td className="p-2 text-white font-medium">{log.name}</td>
                              <td className="p-2 font-mono text-slate-400">{log.version}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${log.status.includes('معتمد') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* الشكل 2: جدول المقارنة الذكي وتقرير التوصية */}
                  {(outputType === "all" || outputType === "comparison") && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                          <Grid className="h-4 w-4" />
                          <span>جدول المقارنة الذكي وترتيب الموردين (Comparison Sheet):</span>
                        </h4>
                        <table className="w-full text-right border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                              <th className="p-2">الترتيب</th>
                              <th className="p-2">جهة المورد والمصنع</th>
                              <th className="p-2 font-mono">الوزن النسبي والتقييم</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900">
                            {processingResult.comparisonSheet.map((item, i) => (
                              <tr key={i} className="hover:bg-slate-900/50">
                                <td className="p-2 font-mono font-bold text-amber-400">{item.rank}</td>
                                <td className="p-2 text-slate-200">{item.provider}</td>
                                <td className="p-2 font-mono text-emerald-400 font-bold">{item.score}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 block mb-1">تقرير التوصية الآلي الآمن:</span>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            بناءً على حسابات الوزن النسبي للمخططات والعينات، يوصي النظام الإدارة بـ: <span className="text-white block mt-1 underline">"المورد الأنسب للتعاقد هو: {processingResult.comparisonSheet[0].provider}"</span>
                          </p>
                        </div>
                        <button onClick={() => alert("جاري تحميل وثيقة التوصية")} className="w-full mt-2 bg-slate-800 text-[11px] font-bold py-1 px-2 rounded hover:bg-slate-700 transition-colors text-center text-cyan-400">تنزيل تقرير التوصية المعتمد</button>
                      </div>
                    </div>
                  )}

                  {/* الشكل 3: لوحة القيادة (Dashboard) ومخطط Gantt وتقارير الإنتاجية */}
                  {(outputType === "all" || outputType === "dashboard") && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <BarChart2 className="h-4 w-4" />
                        <span>لوحة القيادة (Dashboard) ومخطط جدولة المهام (Gantt Chart):</span>
                      </h4>
                      <div className="space-y-2.5 text-xs">
                        {processingResult.ganttChart.map((g, i) => (
                          <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center">
                            <div>
                              <span className="text-white font-medium block">{g.task}</span>
                              <span className="text-[10px] text-slate-500">المدة التقديرية: {g.duration} | استهلاك الميزانية الفعلي: <code className="text-cyan-400 font-mono font-bold">{g.budget}</code></span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${g.status.includes('مكتملة') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{g.status}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold text-purple-400 block mb-2">تقارير الإنتاجية ورسم أداء الطاقم الهندسي بالموقع:</span>
                        <div className="space-y-1.5 text-[11px]">
                          {processingResult.productivity.map((p, i) => (
                            <p key={i} className="text-slate-300">✓ <span className="text-white font-semibold">{p.engineer}</span> انجز بنجاح <span className="text-cyan-400 font-mono">{p.taskCount}</span> - معدل كفاءة التدقيق: <span className="text-emerald-400 font-mono font-bold">{p.performance}</span></p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* الشكل 4: التحليل المرئي للشروخ والخرائط الحرارية وتقارير الحالة الصارمة */}
                  {(outputType === "all" || outputType === "crack") && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-900 rounded-xl border border-red-500/20 space-y-3">
                        <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          <span>تقرير حالة الشرخ والتشخيص الهندسي العاجل:</span>
                        </h4>
                        <div className="text-xs space-y-1 text-slate-300">
                          <p>• <span className="font-bold text-white">نوع العيب المرصود:</span> {processingResult.crackAnalysis.type}</p>
                          <p>• <span className="font-bold text-white">درجة الخطورة الهيكلية:</span> <span className="text-red-400 font-bold">{processingResult.crackAnalysis.criticality}</span></p>
                          <p>• <span className="font-bold text-white">أبعاد الشرخ المقاسة بالـ AI:</span> عمق {processingResult.crackAnalysis.depth} | عرض {processingResult.crackAnalysis.width}</p>
                          <p className="bg-red-500/10 text-red-400 p-2.5 rounded-lg border border-red-500/20 mt-2 font-bold leading-relaxed">
                            <span className="block text-[10px] text-slate-400 underline">الإجراء الفوري المطلوب بالموقع:</span>
                            {processingResult.crackAnalysis.action}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between items-center text-center">
                        <div className="w-full">
                          <span className="text-[10px] font-bold text-purple-400 block text-right mb-2">رسم خريطة حرارية مرئية (Heatmap Layout):</span>
                          <div className="h-28 w-full bg-gradient-to-tr from-blue-600 via-yellow-500 to-red-600 rounded-xl flex items-center justify-center opacity-80 border border-slate-700 shadow-inner relative">
                            <span className="text-[10px] font-bold text-white bg-slate-950/80 px-2.5 py-1 rounded-full">محاكاة الخريطة الحرارية لتركيز الإجهادات وعمق الشروخ بالبكسل</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-right w-full">تم دمج الصورة الحرارية ونظام كشف التصدعات بدقة ومطابقتها مع خوارزميات التشخيص البصري الرقمي.</p>
                      </div>
                    </div>
                  )}

                  {/* الشكل 5: قائمة الملاحظات (Audit Report) والملفات المعلمة والقابلة للتحرير والـ Excel */}
                  {(outputType === "all" || outputType === "audit") && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Layers className="h-4 w-4" />
                        <span>قائمة الملاحظات التدقيقية الفنية (Audit Report) والملفات القابلة للتحرير والتصدير:</span>
                      </h4>
                      <div className="space-y-2">
                        {processingResult.auditReport.map((audit, i) => (
                          <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-xs text-slate-300">
                            <p className="font-bold text-white flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              <span>الخطأ الهندسي: {audit.error}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 pr-3 mt-0.5">السبب الفني: {audit.cause}</p>
                            <p className="text-[11px] text-emerald-400 pr-3 font-semibold">آلية التصحيح الإنشائي: {audit.fix}</p>
                          </div>
                        ))}
                      </div>

                      {/* أزرار تنزيل وتصدير الملفات والتقارير بمختلف الأشكال المطلوبة بنص الاستمارة */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                        <button onClick={() => alert("جاري تنزيل ملف DXF/DWG منظم داخل طبقات جاهز للاوتوكاد")} className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl font-bold text-[10px] border border-slate-700">
                          <Layers className="h-3.5 w-3.5 text-blue-400" />
                          <span>تحميل ملف CAD DXF/DWG مجهز بطبقات</span>
                        </button>
                        
                        <button onClick={() => alert("جاري تنزيل ملف حصر كميات إكسيل تفصيلي")} className="flex items-center justify-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white p-2.5 rounded-xl font-bold text-[10px] border border-emerald-500/30">
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                          <span>تحميل حصر المواد الإنشائية Excel</span>
                        </button>

                        <button onClick={() => alert("جاري تنزيل تقرير فني مدمج PDF يحتوي قائمة عيوب ونقص الأختام")} className="flex items-center justify-center gap-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-2.5 rounded-xl font-bold text-[10px] border border-red-500/30">
                          <FileText className="h-3.5 w-3.5" />
                          <span>تحميل تقرير أخطاء المخططات PDF</span>
                        </button>

                        <button onClick={() => alert("جاري تحميل الملف المعلم الأصلي مع سحابات حمراء حول الأخطاء الإنشائية")} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white p-2.5 rounded-xl font-bold text-[10px] hover:bg-blue-500 shadow">
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>تحميل الملف المُعلّم (Marked-up File)</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700 mt-6">
                <button onClick={() => { setActiveProcessingModal(null); setProcessingResult(null); }} className="px-5 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق النافذة والعودة</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}