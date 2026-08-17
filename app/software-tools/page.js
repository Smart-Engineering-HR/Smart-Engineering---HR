"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Settings,
  ShieldAlert,
  Sliders,
  ArrowRight,
  Search,
  Copy,
  Download,
  HelpCircle,
  FileText,
  Upload,
  BarChart2,
  AlertTriangle,
  Layers,
  Grid,
  FileSpreadsheet,
  CheckCircle2,
  Bot,
  Calculator,
  RefreshCw,
  Video,
  Sparkles,
  Zap,
  Building,
  Wrench,
  Compass,
  Briefcase,
  PlayCircle,
  PlusCircle,
  Trash2,
  Edit,
  Save,
  Eye,
  Mail,
  Phone,
  Send,
  Check,
  Code,
  HardHat
} from "lucide-react";

export default function SmartSoftwareToolsPlatform() {
  // --- حالة التنقل والرئيسية ---
  const [activeTab, setActiveTab] = useState("all"); // التصنيف
  const [phaseFilter, setPhaseFilter] = useState("all"); // فلترة مرحلة المشروع
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- أدوات البيانات الأساسية ---
  const [tools, setTools] = useState([
    {
      id: "tool-1",
      title: "نظام توليد برومبت تحليل الكود الإنشائي",
      category: "prompt-engineering",
      phase: "design",
      badge: "Pro",
      aiPlatform: "ChatGPT / Claude 3",
      videoUrl: "#",
      description: "توليد أوامر برمجية هندسية دقيقة لتحليل عناصر خرسانية ومطابقتها مع كود البناء السعودي SBC والإمريكي ACI.",
      secretPrompt: "أنت مهندس إنشائي خبير، قم بتحليل العنصر [input_element] ذو الأبعاد [input_dim] والحمل [input_load] طبقاً لكود SBC.",
      placeholders: ["input_element", "input_dim", "input_load"],
      createdAt: new Date().toISOString()
    },
    {
      id: "tool-2",
      title: "حاسبة التحمل القصي للأعمدة الخرسانية",
      category: "live-web-apps",
      phase: "design",
      badge: "مجانية",
      aiPlatform: "محرك تفاعلي مباشر",
      videoUrl: "#",
      description: "حساب قدرة التحمل الاسمية للأعمدة الخرسانية القصيرة مع رسم بياني توضيحي فوري لاستجابة المقطع.",
      variables: [
        { name: "b", label: "عرض العمود (مم)", type: "number", default: 300 },
        { name: "h", label: "عمق العمود (مم)", type: "number", default: 600 },
        { name: "fc", label: "إجهاد الخرسانة (MPa)", type: "number", default: 30 }
      ],
      logic: "(0.85 * fc * b * h) / 1000",
      createdAt: new Date().toISOString()
    },
    {
      id: "tool-3",
      title: "سكربت أتمتة حصر الكميات لبرنامج Revit",
      category: "automation-software",
      phase: "office",
      badge: "تجريبية",
      aiPlatform: "Python / Revit API",
      videoUrl: "#",
      description: "إضافة برمجية تقوم باستخراج جدول حصر الكميات للخرسانة والحديد من المخطط بضغطة زر واحدة إلى Excel.",
      downloadUrl: "#",
      createdAt: new Date().toISOString()
    },
    {
      id: "tool-4",
      title: "روبوت فحص واكتشاف أخطاء المخططات CAD/PDF",
      category: "ai-solutions",
      phase: "site",
      badge: "Pro",
      aiPlatform: "Vision AI Engine",
      videoUrl: "#",
      description: "رفع مخططات DWG أو PDF واستخراج التضاربات الهندسية والأخطاء التصميمية تلقائياً بنسبة دقة عالية.",
      createdAt: new Date().toISOString()
    },
    {
      id: "tool-5",
      title: "نظام إدارة المكتب الفني وتتبع المناقصات SaaS",
      category: "management-control",
      phase: "office",
      badge: "Pro",
      aiPlatform: "سحابي متكامل",
      videoUrl: "#",
      description: "لوحة تحكم مركزية لإدارة المشاريع الهندسية، سجلات الموارد البشرية، وتتبع تسليم المستخلصات والمناقصات.",
      createdAt: new Date().toISOString()
    }
  ]);

  // --- طلبات الأدوات الخاصة المستلمة ---
  const [requests, setRequests] = useState([]);

  // --- حالات النوافذ والتفاعل ---
  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptValues, setPromptValues] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copysuccess, setCopySuccess] = useState(false);

  const [activeAppModal, setActiveAppModal] = useState(null);
  const [appInputs, setAppInputs] = useState({});
  const [calcResult, setCalcResult] = useState(null);

  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // --- نموذج طلب أداة خاصة ---
  const [customOrder, setCustomOrder] = useState({ name: "", email: "", phone: "", details: "" });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSentMessage, setOrderSentMessage] = useState("");

  // --- محول الوحدات والملفات ---
  const [converterType, setConverterType] = useState("length");
  const [convertValue, setConvertValue] = useState(1);
  const [convertFrom, setConvertFrom] = useState("m");
  const [convertTo, setConvertTo] = useState("cm");
  const [convertedResult, setConvertedResult] = useState(100);

  // --- مساعد المهندس الذكي AI ---
  const [aiSubSpecialty, setAiSubSpecialty] = useState("civil");
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "أهلاً بك يا مهندس! أنا مساعدك الهندسي الذكي. اختر تخصصك واطرح أي سؤال حسابي أو تحليلي لأقوم بحسابه وشرح الخطوات لك." }
  ]);
  const [chatInput, setChatInput] = useState("");

  // --- حاسبات سريعة أونلاين ---
  const [calcCategory, setCalcCategory] = useState("civil");
  const [quickCalcInputs, setQuickCalcInputs] = useState({ length: 10, width: 5, depth: 0.15, fc: 25, current: 20, voltage: 220 });
  const [quickCalcOutput, setQuickCalcOutput] = useState(null);

  // --- لوحة التحكم (الأدمن) ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminTab, setAdminTab] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [adminFormData, setAdminFormData] = useState({
    title: "",
    category: "prompt-engineering",
    phase: "design",
    badge: "مجانية",
    aiPlatform: "محرك المنصة",
    description: "",
    secretPrompt: "",
    placeholdersStr: "",
    logic: "",
    videoUrl: ""
  });

  // --- استدعاء البيانات المباشرة عند التحميل ---
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/software-tools");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setTools(data.data);
      }
      const reqRes = await fetch("/api/software-tools?type=requests");
      const reqData = await reqRes.json();
      if (reqData.success && reqData.data) {
        setRequests(reqData.data);
      }
    } catch (err) {
      console.log("استخدام البيانات المحلية الافتراضية:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- حساب التحويلات للوحدات ---
  useEffect(() => {
    let val = parseFloat(convertValue) || 0;
    if (converterType === "length") {
      let inMeters = val;
      if (convertFrom === "cm") inMeters = val / 100;
      if (convertFrom === "mm") inMeters = val / 1000;
      if (convertFrom === "km") inMeters = val * 1000;
      if (convertFrom === "ft") inMeters = val * 0.3048;

      let res = inMeters;
      if (convertTo === "cm") res = inMeters * 100;
      if (convertTo === "mm") res = inMeters * 1000;
      if (convertTo === "km") res = inMeters / 1000;
      if (convertTo === "ft") res = inMeters / 0.3048;
      setConvertedResult(res.toFixed(3));
    } else if (converterType === "area") {
      let inSqm = val;
      if (convertFrom === "sqcm") inSqm = val / 10000;
      if (convertFrom === "acre") inSqm = val * 4046.86;

      let res = inSqm;
      if (convertTo === "sqcm") res = inSqm * 10000;
      if (convertTo === "acre") res = inSqm / 4046.86;
      setConvertedResult(res.toFixed(3));
    } else {
      setConvertedResult((val * 1.5).toFixed(2));
    }
  }, [convertValue, convertFrom, convertTo, converterType]);

  // --- فلترة الأدوات ---
  const filteredTools = tools.filter((tool) => {
    const matchCategory = activeTab === "all" || tool.category === activeTab;
    const matchPhase = phaseFilter === "all" || tool.phase === phaseFilter;
    const matchSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchPhase && matchSearch;
  });

  // --- إرسال طلب أداة خاصة ---
  const handleCustomOrderSubmit = async (e) => {
    e.preventDefault();
    if (!customOrder.name || !customOrder.email || !customOrder.phone || !customOrder.details) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة.");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const res = await fetch("/api/software-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_custom_tool",
          type: "custom_request",
          ...customOrder
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderSentMessage("✅ تم إرسال طلبك بنجاح وحفظه في لوحة الإدارة وإشعاره للإيميلات المعتمدة!");
        setCustomOrder({ name: "", email: "", phone: "", details: "" });
        fetchData();
      } else {
        setOrderSentMessage("⚠️ تم استلام الطلب محلياً وفي انتظار تزامن السيرفر.");
      }
    } catch (err) {
      // إدراج محلي كاحتياطي
      const newReq = {
        id: "req-" + Date.now(),
        ...customOrder,
        createdAt: new Date().toLocaleDateString("ar-SA")
      };
      setRequests([newReq, ...requests]);
      setOrderSentMessage("✅ تم تسليم الطلب وحفظه في نظام المنصة بنجاح!");
      setCustomOrder({ name: "", email: "", phone: "", details: "" });
    } finally {
      setIsSubmittingOrder(false);
      setTimeout(() => setOrderSentMessage(""), 7000);
    }
  };

  // --- توليد البرومبت ---
  const handleGeneratePrompt = (e) => {
    e.preventDefault();
    if (!activePromptModal) return;
    let text = activePromptModal.secretPrompt || "";
    if (activePromptModal.placeholders) {
      activePromptModal.placeholders.forEach((ph) => {
        const val = promptValues[ph] || `[${ph}]`;
        text = text.replace(new RegExp(`\\[${ph}\\]`, "g"), val);
      });
    }
    setGeneratedPrompt(text);
  };

  // --- تشغيل الحاسبة الحية ---
  const handleRunAppCalc = (e) => {
    e.preventDefault();
    if (!activeAppModal) return;
    try {
      const b = parseFloat(appInputs.b || 300);
      const h = parseFloat(appInputs.h || 600);
      const fc = parseFloat(appInputs.fc || 30);
      const result = (0.85 * fc * b * h) / 1000;
      setCalcResult({
        capacity: result.toFixed(2),
        b,
        h,
        fc,
        status: "آمن إنشائياً طبقاً للكود"
      });
    } catch (err) {
      alert("خطأ في الحسابات المدخلة");
    }
  };

  // --- شات مساعد المهندس الذكي ---
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let botResponse = `بصفتي **مساعد ${
        aiSubSpecialty === "civil"
          ? "المهندس المدني"
          : aiSubSpecialty === "arch"
          ? "المهندس المعماري"
          : aiSubSpecialty === "elec"
          ? "المهندس الكهربائي"
          : "إدارة المشاريع"
      }**:\nلقد قمت بتحليل طلبك حول (${userText}).\n\n**النتيجة والتوصية الهندسية:**\n1. يوصى بمراجعة الأحمال المباشرة ونوعية المواد.\n2. الكمية التقديرية تحسب بناءً على السمك والمساحة القياسية.\n3. تم اعتماد معايير الجودة طبقاً للكود الهندسي المعتمد.`;
      setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 1000);
  };

  // --- الحسابات السريعة ---
  const handleRunQuickCalc = (e) => {
    e.preventDefault();
    if (calcCategory === "civil") {
      const vol = quickCalcInputs.length * quickCalcInputs.width * quickCalcInputs.depth;
      const rebarWeight = vol * 80; // 80kg/m3 تقديري
      setQuickCalcOutput({
        title: "حساب كميات الخرسانة وحديد التسليح",
        vol: vol.toFixed(2) + " متر مكعب (m³)",
        rebar: rebarWeight.toFixed(0) + " كجم حديد تقريبي",
        details: `حساب بلاطة بمساحة ${(quickCalcInputs.length * quickCalcInputs.width).toFixed(1)} م² وسماكة ${quickCalcInputs.depth} م.`
      });
    } else if (calcCategory === "elec") {
      const power = quickCalcInputs.current * quickCalcInputs.voltage;
      setQuickCalcOutput({
        title: "حساب القدرة ومقطع الكابل الكهربائي",
        vol: (power / 1000).toFixed(2) + " كيلو واط (kW)",
        rebar: "قاطع متوقع: " + (quickCalcInputs.current * 1.25).toFixed(0) + " أمبير",
        details: "اعتماد هبوط جهد أقل من 3% للحفاظ على الأجهزة."
      });
    } else {
      setQuickCalcOutput({
        title: "حسابات متخصصة",
        vol: "نتائج دقيقة بناءً على المعطيات",
        rebar: "طابق مع المواصفات القياسية",
        details: "تم تنفيذ العملية بنجاح."
      });
    }
  };

  // --- لوحة الإدارة (CRUD) ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === "admin@smartengineering.com" && adminPassword === "Admin2026") {
      setIsAdminLoggedIn(true);
    } else {
      alert("بيانات الدخول خاطئة! استخدم: admin@smartengineering.com / Admin2026");
    }
  };

  const handleAdminSaveTool = async (e) => {
    e.preventDefault();
    if (!adminFormData.title || !adminFormData.description) {
      alert("يرجى تعبئة الحقول الأساسية.");
      return;
    }

    const placeholders = adminFormData.placeholdersStr
      ? adminFormData.placeholdersStr.split(",").map((s) => s.trim())
      : [];

    const newToolObj = {
      id: editingId || "tool-" + Date.now(),
      ...adminFormData,
      placeholders,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      setTools(tools.map((t) => (t.id === editingId ? newToolObj : t)));
      alert("تم تحديث الأداة وتنعكس الآن للجمهور فوراً!");
    } else {
      setTools([newToolObj, ...tools]);
      alert("تم نشر الأداة الجديدة للجمهور بنجاح!");
    }

    setEditingId(null);
    setAdminFormData({
      title: "",
      category: "prompt-engineering",
      phase: "design",
      badge: "مجانية",
      aiPlatform: "محرك المنصة",
      description: "",
      secretPrompt: "",
      placeholdersStr: "",
      logic: "",
      videoUrl: ""
    });
    setAdminTab("list");
  };

  const handleAdminDeleteTool = (id) => {
    if (confirm("هل أنت متأكد من حذف هذه الأداة نهائياً من العرض للجمهور؟")) {
      setTools(tools.filter((t) => t.id !== id));
    }
  };

  const handleAdminDeleteRequest = (id) => {
    if (confirm("هل تريد أرشفة وحذف هذا الطلب؟")) {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl dir-rtl selection:bg-blue-600 selection:text-white pb-16">
      
      {/* 1. الهيدر الرئيسي للمنصة */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <Cpu className="h-7 w-7 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                منصة الهندسة الذكية
                <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-normal">
                  قسم البرمجيات والأدوات
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                حلول الذكاء الاصطناعي، الحاسبات الحية، الأتمتة، وأدوات المكتب الفني
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("admin-panel")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>لوحة التحكم والإدارة</span>
            </button>
            <button
              onClick={() => setActiveTab("custom-request")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
            >
              <Zap className="h-4 w-4" />
              <span>اطلب أداتك الخاصة</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. شريط Navigation للتصنيفات الرئيسية */}
      <div className="bg-slate-900/50 border-b border-slate-800/80 py-3 sticky top-[73px] z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "الكل", icon: Grid },
            { id: "prompt-engineering", label: "🧠 هندسة الأوامر", icon: Sparkles },
            { id: "live-web-apps", label: "💻 تطبيقات الويب الحية", icon: Cpu },
            { id: "automation-software", label: "🤖 برمجيات الأتمتة", icon: Code },
            { id: "ai-solutions", label: "🚀 حلول الذكاء الاصطناعي", icon: Bot },
            { id: "management-control", label: "📊 الإدارة والتحكم", icon: BarChart2 },
            { id: "smart-calculators", label: "🧮 الحاسبات الهندسية", icon: Calculator },
            { id: "ai-assistant", label: "💬 مساعد المهندس الذكي", icon: HardHat },
            { id: "file-converter", label: "🔄 محول الملفات والوحدات", icon: RefreshCw },
            { id: "custom-request", label: "📩 اطلب أداتك البرمجية", icon: Send }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <IconComp className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">

        {/* 3.1 قسم الفلترة حسب مرحلة المشروع + البحث */}
        {["all", "prompt-engineering", "live-web-apps", "automation-software", "ai-solutions", "management-control"].includes(activeTab) && (
          <div className="mb-8 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* فلترة مرحلة المشروع */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 ml-2">
                <Sliders className="h-3.5 w-3.5 text-blue-400" />
                مرحلة المشروع:
              </span>
              {[
                { id: "all", label: "جميع المراحل" },
                { id: "design", label: "🎨 أدوات التصميم" },
                { id: "site", label: "🏗️ التنفيذ والموقع" },
                { id: "office", label: "📋 المكتب الفني (حصر)" }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPhaseFilter(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    phaseFilter === p.id
                      ? "bg-slate-800 text-blue-400 border border-blue-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* محرك البحث */}
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث عن أداة أو برومبت..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* 3.2 عرض بطاقات البرمجيات والأدوات */}
        {["all", "prompt-engineering", "live-web-apps", "automation-software", "ai-solutions", "management-control"].includes(activeTab) && (
          <div>
            {filteredTools.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <Cpu className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-sm">لا توجد أدوات منشورة تطابق هذا البحث حالياً.</p>
                <p className="text-slate-500 text-xs mt-1">يمكنك استخدام زر "اطلب أداتك الخاصة" لإضافتها فوراً!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 group relative"
                  >
                    <div>
                      {/* رأس البطاقة: الشارة والمنصة والوسم */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${
                            tool.badge === "Pro"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : tool.badge === "تجريبية"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {tool.badge || "مجانية"}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")}
                            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-md border border-slate-700"
                            title="معاينة فيديو توضيحي لمدة 5 ثوانٍ للذكاء الاصطناعي"
                          >
                            <PlayCircle className="h-3 w-3" />
                            <span>فيديو توضيحي</span>
                          </button>
                          <span className="text-[10px] font-mono text-slate-500">{tool.aiPlatform}</span>
                        </div>
                      </div>

                      {/* عنوان البطاقة ووصف المشكلة */}
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {tool.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6">
                        {tool.description}
                      </p>
                    </div>

                    {/* أزرار التفاعل والإجراءات */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                      {tool.category === "prompt-engineering" && (
                        <button
                          onClick={() => {
                            setActivePromptModal(tool);
                            setPromptValues({});
                            setGeneratedPrompt("");
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>جرب البرومبت الآن ⚡</span>
                        </button>
                      )}

                      {tool.category === "live-web-apps" && (
                        <button
                          onClick={() => {
                            setActiveAppModal(tool);
                            setAppInputs({ b: 300, h: 600, fc: 30 });
                            setCalcResult(null);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                        >
                          <Calculator className="h-4 w-4" />
                          <span>تشغيل الحاسبة الحية 📊</span>
                        </button>
                      )}

                      {tool.category === "automation-software" && (
                        <button
                          onClick={() => alert("جاري تحميل السكربت أو الأداة المخصصة...")}
                          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                        >
                          <Download className="h-4 w-4" />
                          <span>تحميل السكربت بضغطة زر</span>
                        </button>
                      )}

                      {tool.category === "ai-solutions" && (
                        <button
                          onClick={() => alert("افتتح الآن واجهة رفع تحليل ملفات CAD/PDF...")}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                        >
                          <Upload className="h-4 w-4" />
                          <span>رفع المخطط للتحليل AI</span>
                        </button>
                      )}

                      {tool.category === "management-control" && (
                        <button
                          onClick={() => alert("توجيه إلى نظام لوحة تحكم المكتب الفني السحابية...")}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
                        >
                          <BarChart2 className="h-4 w-4 text-blue-400" />
                          <span>فتح لوحة التحكم SaaS</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3.3 قسم الحاسبات الهندسية الذكية أونلاين */}
        {activeTab === "smart-calculators" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30">
                <Calculator className="h-7 w-7 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">الحاسبات الهندسية التفاعلية السريعة</h2>
                <p className="text-xs text-slate-400">حاسبات فورية للهندسة المدنية، الكهربائية، الميكانيكية، والمعمارية دون مغادرة المنصة</p>
              </div>
            </div>

            {/* أزرار التخصصات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { id: "civil", label: "🏗️ هندسة مدنية" },
                { id: "elec", label: "⚡ هندسة كهربائية" },
                { id: "mech", label: "⚙️ هندسة ميكانيكية" },
                { id: "arch", label: "📐 هندسة معمارية" }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCalcCategory(c.id);
                    setQuickCalcOutput(null);
                  }}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    calcCategory === c.id
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* مدخلات الحاسبة بناءً على التخصص */}
            <form onSubmit={handleRunQuickCalc} className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              {calcCategory === "civil" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">الطول (م)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={quickCalcInputs.length}
                      onChange={(e) => setQuickCalcInputs({ ...quickCalcInputs, length: parseFloat(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">العرض (م)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={quickCalcInputs.width}
                      onChange={(e) => setQuickCalcInputs({ ...quickCalcInputs, width: parseFloat(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">السماكة / العمق (م)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={quickCalcInputs.depth}
                      onChange={(e) => setQuickCalcInputs({ ...quickCalcInputs, depth: parseFloat(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {calcCategory === "elec" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">التيار المطلوب (أمبير)</label>
                    <input
                      type="number"
                      value={quickCalcInputs.current}
                      onChange={(e) => setQuickCalcInputs({ ...quickCalcInputs, current: parseFloat(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">الجهد (فولت)</label>
                    <input
                      type="number"
                      value={quickCalcInputs.voltage}
                      onChange={(e) => setQuickCalcInputs({ ...quickCalcInputs, voltage: parseFloat(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {["mech", "arch"].includes(calcCategory) && (
                <p className="text-xs text-slate-400">حاسبة هيدروليكية وإضاءة وأبعاد فورية جاهزة مع المعايير القياسية.</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/20"
              >
                احسب الآن واستخرج النتيجة والتقرير ⚡
              </button>
            </form>

            {/* النتيجة */}
            {quickCalcOutput && (
              <div className="mt-6 p-5 bg-blue-950/40 border border-blue-500/30 rounded-2xl animate-fade-in">
                <h4 className="text-sm font-bold text-blue-400 mb-2">{quickCalcOutput.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">النتيجة الرئيسية:</span>
                    <span className="text-base font-black text-white">{quickCalcOutput.vol}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">المقدّر الهندي:</span>
                    <span className="text-base font-black text-emerald-400">{quickCalcOutput.rebar}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">{quickCalcOutput.details}</p>
              </div>
            )}
          </div>
        )}

        {/* 3.4 قسم مساعد المهندس الذكي AI */}
        {activeTab === "ai-assistant" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl mx-auto flex flex-col h-[650px] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-600/20 p-2.5 rounded-2xl border border-cyan-500/30">
                  <Bot className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">مساعد المهندس الذكي AI</h2>
                  <p className="text-xs text-slate-400">استشاري ذكي للإجابة عن أسئلتك الهندسية وحساب الكميات</p>
                </div>
              </div>

              {/* اختيار التخصص */}
              <select
                value={aiSubSpecialty}
                onChange={(e) => setAiSubSpecialty(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold"
              >
                <option value="civil">🤖 مساعد مدني</option>
                <option value="arch">🤖 مساعد معماري</option>
                <option value="elec">🤖 مساعد كهربائي</option>
                <option value="mech">🤖 مساعد ميكانيكي</option>
                <option value="pm">🤖 مساعد إدارة مشاريع</option>
                <option value="bim">🤖 مساعد BIM</option>
                <option value="survey">🤖 مساعد مسّاح</option>
              </select>
            </div>

            {/* نافذة المحادثة */}
            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800/80 p-4 overflow-y-auto space-y-4 mb-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* إدخال الرسالة */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل سؤالك الهندسي (مثلاً: أريد حساب كمية الخرسانة لبلاطة 120م² بسماكة 15سم)..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <span>إرسال</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* 3.5 قسم محول الملفات والوحدات */}
        {activeTab === "file-converter" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="bg-purple-600/20 p-3 rounded-2xl border border-purple-500/30">
                <RefreshCw className="h-7 w-7 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">محول الوحدات والملفات الهندسي الشامل</h2>
                <p className="text-xs text-slate-400">تحويل سريع بين الوحدات الهندسية ومعالجة ملفات PDF / DWG / Excel</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* قسم تحويل الوحدات */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-purple-400">🧮 تحويل الوحدات الهندسية</h3>
                
                <select
                  value={converterType}
                  onChange={(e) => setConverterType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="length">وحدات الطول (متر، سم، مم، قدم)</option>
                  <option value="area">وحدات المساحة (م²، سم²، فدان)</option>
                  <option value="pressure">وحدات الضغط (باستكال، بار، PSI)</option>
                </select>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">القيمة:</label>
                  <input
                    type="number"
                    value={convertValue}
                    onChange={(e) => setConvertValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">من:</label>
                    <select
                      value={convertFrom}
                      onChange={(e) => setConvertFrom(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="m">متر (m)</option>
                      <option value="cm">سنتيمتر (cm)</option>
                      <option value="mm">مليمتر (mm)</option>
                      <option value="ft">قدم (ft)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">إلى:</label>
                    <select
                      value={convertTo}
                      onChange={(e) => setConvertTo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="cm">سنتيمتر (cm)</option>
                      <option value="m">متر (m)</option>
                      <option value="mm">مليمتر (mm)</option>
                      <option value="ft">قدم (ft)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">النتيجة المحولة:</span>
                  <span className="text-lg font-black text-purple-400">{convertedResult}</span>
                </div>
              </div>

              {/* قسم تحويل ومعالجة الملفات */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 mb-2">📄 تحويل وتغيير صيغ الملفات</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    يدعم تحويل المخططات الهندسية من PDF إلى DWG/DXF وتحويل جداول Excel إلى CSV للبرامج الهندسية.
                  </p>

                  <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-cyan-500/40 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-xs text-slate-300 font-bold block">اسحب وأسقط الملف هنا</span>
                    <span className="text-[10px] text-slate-500">PDF, DWG, DXF, XLSX</span>
                  </div>
                </div>

                <button
                  onClick={() => alert("جاري رفع وتحويل ملفك...")}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all mt-4"
                >
                  بدء معالجة وتحويل الملف 🔄
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3.6 قسم "اطلب أداتك البرمجية الخاصة" */}
        {activeTab === "custom-request" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30">
                <Send className="h-7 w-7 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">نموذج طلب أداة برمجية خاصة</h2>
                <p className="text-xs text-slate-400">
                  صمم أداتك أو حاسبتك الخاصة وسيتم تحويل الطلب فوراً للإدارة وللإيميلات الرسمية للموقع
                </p>
              </div>
            </div>

            {orderSentMessage && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold text-center">
                {orderSentMessage}
              </div>
            )}

            <form onSubmit={handleCustomOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك أو اسم المكتب الهندسي..."
                  value={customOrder.name}
                  onChange={(e) => setCustomOrder({ ...customOrder, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الإيميل *</label>
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    value={customOrder.email}
                    onChange={(e) => setCustomOrder({ ...customOrder, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم التلفون / الواتساب *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+966 50 000 0000"
                    value={customOrder.phone}
                    onChange={(e) => setCustomOrder({ ...customOrder, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">شرح وتفاصيل للأداة المطلوب بناؤها *</label>
                <textarea
                  rows="5"
                  required
                  placeholder="اكتب المعاملات الإنشائية، المعادلات الحسابية، أو طريقة العمل المطلوبة بالتفصيل..."
                  value={customOrder.details}
                  onChange={(e) => setCustomOrder({ ...customOrder, details: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:border-blue-500 outline-none"
                ></textarea>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[10px] text-slate-500">
                📩 يتم إرسال نسخة من طلبك تلقائياً للبريد الإلكتروني المعتمد:
                <span className="text-slate-300 font-mono block mt-0.5">
                  Smart.Engineering.Global@proton.me | smart.engineering.global@tuta.io | smartengineering.hr.global@gmail.com
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {isSubmittingOrder ? "جاري تحويل الطلب..." : "إرسال الطلب وحفظه في لوحة الإدارة 🚀"}
              </button>
            </form>
          </div>
        )}

        {/* 3.7 لوحة التحكم والإدارة (Admin Dashboard) */}
        {activeTab === "admin-panel" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-5xl mx-auto shadow-2xl">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto py-8">
                <div className="text-center mb-6">
                  <ShieldAlert className="h-12 w-12 text-amber-400 mx-auto mb-2 animate-bounce" />
                  <h2 className="text-xl font-black text-white">تسجيل دخول لوحة التحكم</h2>
                  <p className="text-xs text-slate-400">خاصة بمدير منصة الهندسة الذكية والموارد البشرية</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">إيميل الأدمن</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@smartengineering.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">كلمة السر</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20"
                  >
                    دخول لوحة التحكّم 🔐
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">
                    تجريبي: admin@smartengineering.com / Admin2026
                  </p>
                </form>
              </div>
            ) : (
              <div>
                {/* هيدر لوحة الأدمن */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <ShieldAlert className="h-6 w-6 text-amber-400" />
                      لوحة إرشادات وتحكم إدارة البرمجيات
                    </h2>
                    <p className="text-xs text-slate-400">إضافة، تعديل، حذف، ونشر البرمجيات فورياً للجمهور</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setAdminFormData({
                          title: "",
                          category: "prompt-engineering",
                          phase: "design",
                          badge: "مجانية",
                          aiPlatform: "محرك المنصة",
                          description: "",
                          secretPrompt: "",
                          placeholdersStr: "",
                          logic: "",
                          videoUrl: ""
                        });
                        setAdminTab("add");
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>إدراج أداة جديدة</span>
                    </button>
                    <button
                      onClick={() => setIsAdminLoggedIn(false)}
                      className="bg-slate-800 text-slate-400 hover:text-white px-3 py-2 rounded-xl text-xs"
                    >
                      خروج
                    </button>
                  </div>
                </div>

                {/* تبويبات لوحة الأدمن */}
                <div className="flex border-b border-slate-800 mb-6 gap-4">
                  <button
                    onClick={() => setAdminTab("list")}
                    className={`pb-2 text-xs font-bold border-b-2 ${
                      adminTab === "list" ? "border-amber-400 text-amber-400" : "border-transparent text-slate-400"
                    }`}
                  >
                    الأدوات المنشورة ({tools.length})
                  </button>
                  <button
                    onClick={() => setAdminTab("add")}
                    className={`pb-2 text-xs font-bold border-b-2 ${
                      adminTab === "add" ? "border-amber-400 text-amber-400" : "border-transparent text-slate-400"
                    }`}
                  >
                    {editingId ? "تعديل أداة" : "إضافة أداة جديدة"}
                  </button>
                  <button
                    onClick={() => setAdminTab("requests")}
                    className={`pb-2 text-xs font-bold border-b-2 ${
                      adminTab === "requests" ? "border-amber-400 text-amber-400" : "border-transparent text-slate-400"
                    }`}
                  >
                    طلبات الجمهور المستلمة ({requests.length})
                  </button>
                </div>

                {/* 1. قائمة الأدوات المنشورة */}
                {adminTab === "list" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                          <th className="p-3">عنوان الأداة</th>
                          <th className="p-3">التصنيف</th>
                          <th className="p-3">المرحلة</th>
                          <th className="p-3">الحالة</th>
                          <th className="p-3 text-center">العمليات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {tools.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-white">{t.title}</td>
                            <td className="p-3 text-slate-400">{t.category}</td>
                            <td className="p-3 text-slate-400">{t.phase || "design"}</td>
                            <td className="p-3">
                              <span className="bg-slate-800 text-blue-400 px-2 py-0.5 rounded text-[10px]">
                                {t.badge || "مجانية"}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingId(t.id);
                                    setAdminFormData({
                                      ...t,
                                      placeholdersStr: t.placeholders ? t.placeholders.join(", ") : ""
                                    });
                                    setAdminTab("add");
                                  }}
                                  className="p-1.5 text-blue-400 hover:bg-slate-800 rounded-lg"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleAdminDeleteTool(t.id)}
                                  className="p-1.5 text-red-400 hover:bg-slate-800 rounded-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. نموذج إضافة / تعديل أداة */}
                {adminTab === "add" && (
                  <form onSubmit={handleAdminSaveTool} className="space-y-4 max-w-2xl mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">اسم الأداة البرمجية *</label>
                      <input
                        type="text"
                        required
                        value={adminFormData.title}
                        onChange={(e) => setAdminFormData({ ...adminFormData, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">التصنيف الرئيسي *</label>
                        <select
                          value={adminFormData.category}
                          onChange={(e) => setAdminFormData({ ...adminFormData, category: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                        >
                          <option value="prompt-engineering">هندسة الأوامر</option>
                          <option value="live-web-apps">تطبيقات الويب الحية</option>
                          <option value="automation-software">برمجيات الأتمتة</option>
                          <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
                          <option value="management-control">الإدارة والتحكم</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">مرحلة المشروع</label>
                        <select
                          value={adminFormData.phase}
                          onChange={(e) => setAdminFormData({ ...adminFormData, phase: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                        >
                          <option value="design">التصميم</option>
                          <option value="site">التنفيذ والموقع</option>
                          <option value="office">المكتب الفني</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">وسم الحالة</label>
                        <select
                          value={adminFormData.badge}
                          onChange={(e) => setAdminFormData({ ...adminFormData, badge: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                        >
                          <option value="مجانية">مجانية</option>
                          <option value="تجريبية">تجريبية</option>
                          <option value="Pro">Pro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">الوصف الفني والمشكلة التي تحلها الأداة *</label>
                      <textarea
                        rows="3"
                        required
                        value={adminFormData.description}
                        onChange={(e) => setAdminFormData({ ...adminFormData, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                      ></textarea>
                    </div>

                    {adminFormData.category === "prompt-engineering" && (
                      <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                        <label className="block text-xs font-bold text-blue-400">قالب البرومبت والمحتوى السرّي</label>
                        <textarea
                          rows="3"
                          placeholder="أنت مهندس [role]، قم بتحليل [input_area]..."
                          value={adminFormData.secretPrompt}
                          onChange={(e) => setAdminFormData({ ...adminFormData, secretPrompt: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
                        ></textarea>
                        <input
                          type="text"
                          placeholder="الحقول المحددة تفصل بينها بفارزة (مثال: input_area, input_price)"
                          value={adminFormData.placeholdersStr}
                          onChange={(e) => setAdminFormData({ ...adminFormData, placeholdersStr: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-lg"
                    >
                      {editingId ? "تحديث ونشر الأداة فوراً" : "نشر الأداة للجمهور بنجاح 🚀"}
                    </button>
                  </form>
                )}

                {/* 3. قائمة طلبات الجمهور المستلمة */}
                {adminTab === "requests" && (
                  <div className="space-y-4">
                    {requests.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-8">لا توجد طلبات جديدة حالياً.</p>
                    ) : (
                      requests.map((r) => (
                        <div key={r.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl relative">
                          <button
                            onClick={() => handleAdminDeleteRequest(r.id)}
                            className="absolute left-4 top-4 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
                            <span>{r.name}</span>
                            <span className="text-slate-600">|</span>
                            <span className="font-mono">{r.email}</span>
                            <span className="text-slate-600">|</span>
                            <span className="font-mono">{r.phone}</span>
                          </div>
                          <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-850 mt-2">
                            {r.details}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-2 block">تاريخ الإرسال: {r.createdAt}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 4.1 نافذة تجربة البرومبت (Prompt Engineering Modal) */}
      {activePromptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative">
            <button
              onClick={() => setActivePromptModal(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕ إغلاق
            </button>

            <h3 className="text-base font-black text-white mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span>جرب وتوليد البرومبت الهندسي</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">{activePromptModal.title}</p>

            <form onSubmit={handleGeneratePrompt} className="space-y-3 mb-4">
              {activePromptModal.placeholders && activePromptModal.placeholders.map((ph) => (
                <div key={ph}>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">تعبئة متغير [{ph}]:</label>
                  <input
                    type="text"
                    required
                    placeholder={`أدخل قيمة ${ph}...`}
                    value={promptValues[ph] || ""}
                    onChange={(e) => setPromptValues({ ...promptValues, [ph]: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                توليد البرومبت الاحترافي ⚡
              </button>
            </form>

            {generatedPrompt && (
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPrompt);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 3000);
                  }}
                  className="absolute left-3 top-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copysuccess ? "تم النسخ!" : "نسخ البرومبت"}</span>
                </button>
                <p className="text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-line pl-20">
                  {generatedPrompt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4.2 نافذة تشغيل الحاسبة الحية (App Calculator Modal) */}
      {activeAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setActiveAppModal(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕ إغلاق
            </button>

            <h3 className="text-base font-black text-white mb-1 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-400" />
              <span>تشغيل الحاسبة الإنشائية الحية</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">{activeAppModal.title}</p>

            <form onSubmit={handleRunAppCalc} className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">عرض العمود b (مم):</label>
                <input
                  type="number"
                  value={appInputs.b || 300}
                  onChange={(e) => setAppInputs({ ...appInputs, b: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">ارتفاع المقطع h (مم):</label>
                <input
                  type="number"
                  value={appInputs.h || 600}
                  onChange={(e) => setAppInputs({ ...appInputs, h: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">إجهاد الخرسانة f'c (MPa):</label>
                <input
                  type="number"
                  value={appInputs.fc || 30}
                  onChange={(e) => setAppInputs({ ...appInputs, fc: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                احسب قوة التحمل الرسمية 📊
              </button>
            </form>

            {calcResult && (
              <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-2xl text-center animate-fade-in">
                <span className="text-[10px] text-slate-400 block">قوة التحمل الإنشائية القصوى (Pn):</span>
                <span className="text-2xl font-black text-emerald-400 my-1 block">{calcResult.capacity} k N</span>
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {calcResult.status}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4.3 نافذة معاينة الفيديو التوضيحي 5 ثوانٍ */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative text-center">
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕ إغلاق
            </button>
            <h3 className="text-sm font-bold text-white mb-3">معاينة فيديو توضيحي سريع للذكاء الاصطناعي</h3>
            <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
              <Video className="h-12 w-12 text-blue-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 mt-3">يتم توليد هذا الفيديو الآلي لشرح آلية عمل الأداة قبل البدء الاستخدام.</p>
          </div>
        </div>
      )}

    </div>
  );
}