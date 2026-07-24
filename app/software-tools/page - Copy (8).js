"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Cpu, Settings, Bot, Layers, HelpCircle, 
  ArrowLeft, Search, Copy, CheckCircle, Calculator, 
  Download, FileSpreadsheet, FileText, AlertTriangle, 
  Upload, Sliders, ChevronRight, BarChart3, Mail, Phone, User
} from "lucide-react";

export default function SoftwareToolsPublic() {
  // القوائم الفرعية الأساسية للمنصة
  const tabs = [
    { id: "prompt-engineering", name: "هندسة الأوامر", icon: Terminal },
    { id: "live-web-apps", name: "تطبيقات الويب الحية", icon: Calculator },
    { id: "automation-software", name: "برمجيات الأتمتة", icon: Settings },
    { id: "ai-solutions", name: "حلول الذكاء الاصطناعي", icon: Bot },
    { id: "management-control", name: "الإدارة والتحكم", icon: Layers },
    { id: "request-tool", name: "اطلب أداتك البرمجية الخاصة", icon: HelpCircle }
  ];

  const [activeTab, setActiveTab] = useState("prompt-engineering");
  const [searchQuery, setSearchQuery] = useState("");
  const [professionFilter, setProfessionFilter] = useState("الكل");
  
  // المخازن الحركية للبيانات المربوطة مع الأدمن
  const [prompts, setPrompts] = useState([]);
  const [webApps, setWebApps] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [aiSolutions, setAiSolutions] = useState([]);
  const [managementTools, setManagementTools] = useState([]);

  // الحالات المنبثقة للتفاعل والتطبيقات
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [promptVariables, setPromptVariables] = useState({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  // حالات تشغيل تطبيقات الويب الحية
  const [activeApp, setActiveApp] = useState(null);
  const [appInputs, setAppInputs] = useState({});
  const [appResult, setAppResult] = useState(null);

  // حالات تشغيل برمجيات الأتمتة
  const [activeAutomation, setActiveAutomation] = useState(null);
  const [autoInputs, setAutoInputs] = useState({});
  const [autoResult, setAutoResult] = useState(null);

  // حالات تشغيل حلول الذكاء الاصطناعي
  const [activeAi, setActiveAi] = useState(null);
  const [aiInputs, setAiInputs] = useState({});
  const [aiResult, setAiResult] = useState(null);

  // حالات تشغيل الإدارة والتحكم
  const [activeManagement, setActiveManagement] = useState(null);
  const [mgmtInputs, setMgmtInputs] = useState({});
  const [mgmtResult, setMgmtResult] = useState(null);

  // نموذج طلب أداة خاصة
  const [requestForm, setRequestForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [requestStatus, setRequestStatus] = useState("");

  // تحميل البيانات من الـ localStorage لضمان انعكاس تحكم الأدمن
  useEffect(() => {
    const storedPrompts = localStorage.getItem("se_prompts");
    const storedWebApps = localStorage.getItem("se_webapps");
    const storedAutomations = localStorage.getItem("se_automations");
    const storedAiSolutions = localStorage.getItem("se_aisolutions");
    const storedManagement = localStorage.getItem("se_management");

    if (storedPrompts) setPrompts(JSON.parse(storedPrompts));
    else {
      // بيانات افتراضية احترافية أولية
      const defaultPrompts = [{
        id: "p1", title: "المولد الذكي لتقارير المواد", category: "هندسة إنشائية", 
        platform: "ChatGPT", badge: "أداة حصرية", description: "توليد مراجعة فنية لتقارير اختبارات الخرسانة والمواد وفق الأكواد القياسية.",
        secretPrompt: "قم بتحليل تقرير اختبار المادة: [المادة] للعنصر الإنشائي: [العنصر] وفقاً لمتطلبات الكود: [الكود المستخدم]. قدم تقريراً شاملاً يوضح مدى مطابقة الكسر للإجهاد التصميمي المستهدف."
      }];
      setPrompts(defaultPrompts);
      localStorage.setItem("se_prompts", JSON.stringify(defaultPrompts));
    }

    if (storedWebApps) setWebApps(JSON.parse(storedWebApps));
    else {
      const defaultWebApps = [{
        id: "w1", title: "حاسبة تقوية وتدعيم الأعمدة الخرسانية", category: "هندسة إنشائية",
        variables: [{ name: "P", type: "number", label: "الحمل المحوري الأقصى", unit: "كيلونيوتن" }, { name: "Ac", type: "number", label: "مساحة المقطع الخرساني الحالي", unit: "مم²" }, { name: "fc", type: "number", label: "مقاومة الخرسانة المميزة fc'", unit: "ميجا باسكال" }],
        logic: "Result = (P * 1000) / (Ac * fc);", minMax: "Width >= 0.2", template: "نسبة التحمل الإجهادي للعمود تحت التأثير المباشر هي: {Result}"
      }];
      setWebApps(defaultWebApps);
      localStorage.setItem("se_webapps", JSON.stringify(defaultWebApps));
    }

    if (storedAutomations) setAutomations(JSON.parse(storedAutomations));
    if (storedAiSolutions) setAiSolutions(JSON.parse(storedAiSolutions));
    if (storedManagement) setManagementTools(JSON.parse(storedManagement));
  }, []);

  // معالجة استخراج المتغيرات المحصورة بين أقواس مربعة للبرومبت
  const handleOpenPromptModal = (prompt) => {
    setSelectedPrompt(prompt);
    const matches = prompt.secretPrompt.match(/\[(.*?)\]/g) || [];
    const vars = {};
    matches.forEach(m => {
      const varName = m.replace(/[\[\]]/g, "");
      vars[varName] = "";
    });
    setPromptVariables(vars);
  };

  const handleExecutePrompt = () => {
    let finalPromptText = selectedPrompt.secretPrompt;
    Object.keys(promptVariables).forEach(key => {
      finalPromptText = finalPromptText.replace(`[${key}]`, promptVariables[key]);
    });

    navigator.clipboard.writeText(finalPromptText);
    setCopiedNotification(true);
    setTimeout(() => {
      setCopiedNotification(false);
      setSelectedPrompt(null);
    }, 2500);
  };

  // محرك احترافي لتنفيذ معادلات تطبيقات الويب الحية ديناميكياً
  const handleCalculateApp = (app) => {
    try {
      let logicStr = app.logic;
      // استبدال المتغيرات بقيمها المدخلة
      app.variables.forEach(v => {
        const val = parseFloat(appInputs[v.name]) || 0;
        logicStr = `const ${v.name} = ${val}; ` + logicStr;
      });
      
      // تنفيذ المعادلة بأمان مبسط
      let Result = 0;
      const evalFunc = new Function(logicStr + " return Result;");
      Result = evalFunc();

      if (isNaN(Result) || !isFinite(Result)) {
        throw new Error("خطأ في الحسابات الرياضية للمدخلات");
      }

      const formattedResult = Result.toFixed(3);
      const textOutput = app.template.replace("{Result}", formattedResult);

      setAppResult({
        numeric: formattedResult,
        report: textOutput,
        code: "ACI 318-19 / SBC 304"
      });
    } catch (err) {
      alert("حدث خطأ أثناء معالجة المعادلة الرياضية: " + err.message);
    }
  };

  // تقديم طلب أداة برمجية خاصة وإرساله وحفظه
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!requestForm.name || !requestForm.email || !requestForm.details) {
      alert("الرجاء تعبئة الحقول الأساسية");
      return;
    }
    const currentRequests = JSON.parse(localStorage.getItem("se_tool_requests") || "[]");
    const newRequest = { ...requestForm, id: "req_" + Date.now(), date: new Date().toLocaleDateString() };
    currentRequests.push(newRequest);
    localStorage.setItem("se_tool_requests", JSON.stringify(currentRequests));
    
    setRequestStatus("success");
    setRequestForm({ name: "", email: "", phone: "", details: "" });
    setTimeout(() => setRequestStatus(""), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900 relative overflow-hidden">
      {/* صورة الخلفية الاحترافية المعبرة */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&q=80&w=2000')" }}
      />
      {/* توهجات ضوئية شبكية زرقاء */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* الهيدر العلوي وزر العودة الاستراتيجي */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
              <Cpu className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">منصة الهندسة الذكية</h1>
              <p className="text-xs text-cyan-400/80 font-medium">البرمجيات والأدوات الهندسية المتكاملة</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.href = "/"}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-all duration-200 border border-slate-700 hover:border-slate-600 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            العودة للرئيسية
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* الترتيب الأفقي الإحترافي للقوائم الفرعية في أعلى الصفحة */}
        <nav className="flex flex-wrap justify-center xl:justify-between items-center gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 mb-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
          
          {activeTab !== "request-tool" && (
            <div className="relative w-full md:w-64 mt-2 xl:mt-0">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="بحث ذكي في الأدوات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-200 transition-all"
              />
            </div>
          )}
        </nav>

        {/* 1. قسم هندسة الأوامر (Prompt Engineering) */}
        {activeTab === "prompt-engineering" && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Terminal className="text-cyan-400" /> مكتبة هندسة الأوامر الذكية
                </h2>
                <p className="text-slate-400 text-sm mt-1">برومبتات احترافية مجهزة لإنتاج أدق التقارير والتحليلات الهندسية عبر نماذج الـ AI.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">تصفية حسب التخصص:</span>
                <select 
                  className="bg-slate-900 border border-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
                  value={professionFilter}
                  onChange={(e) => setProfessionFilter(e.target.value)}
                >
                  <option value="الكل">كل التخصصات</option>
                  <option value="هندسة إنشائية">هندسة إنشائية</option>
                  <option value="تصميم معماري">تصميم معماري</option>
                  <option value="مكتب فني وحصر">مكتب فني وحصر</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts
                .filter(p => professionFilter === "الكل" || p.category === professionFilter)
                .filter(p => p.title.includes(searchQuery) || p.description.includes(searchQuery))
                .map((prompt) => (
                  <div key={prompt.id} className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg font-medium border border-cyan-500/20 shadow-sm">
                          {prompt.badge || "أداة هندسية"}
                        </span>
                        <span className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {prompt.platform}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">{prompt.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">{prompt.description}</p>
                    </div>
                    <button
                      onClick={() => handleOpenPromptModal(prompt)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-slate-950 text-slate-300 font-semibold rounded-xl text-sm transition-all duration-300 border border-slate-700/60 hover:border-transparent flex items-center justify-center gap-2 shadow-inner"
                    >
                      <Terminal className="w-4 h-4" />
                      استخدام وتجربة الأداة الآن
                    </button>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. تطبيقات الويب الحية (Live Web Apps) */}
        {activeTab === "live-web-apps" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calculator className="text-emerald-400" /> تطبيقات الويب الحية (Live Web Apps)
              </h2>
              <p className="text-slate-400 text-sm mt-1">حاسبات إنشائية تفاعلية تعمل داخل المتصفح مباشرة لخدمة المهندسين في العمل الميداني والمكتبي.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col gap-4">
                {webApps.filter(app => app.title.includes(searchQuery)).map((app) => (
                  <button
                    key={app.id}
                    onClick={() => { setActiveApp(app); setAppInputs({}); setAppResult(null); }}
                    className={`w-full text-right p-5 rounded-2xl border transition-all flex flex-col gap-2 ${
                      activeApp?.id === app.id 
                        ? "bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/5" 
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded self-start">{app.category}</span>
                    <h3 className="text-md font-bold text-slate-200">{app.title}</h3>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2">
                {activeApp ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-emerald-400" /> {activeApp.title}
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      {activeApp.variables?.map((v, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                          <label className="text-sm text-slate-300 font-medium">{v.label}:</label>
                          <div className="md:col-span-2 relative">
                            <input
                              type={v.type === "number" ? "number" : "text"}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-slate-100"
                              placeholder={`أدخل قيمة المتغير ${v.name}`}
                              value={appInputs[v.name] || ""}
                              onChange={(e) => setAppInputs({ ...appInputs, [v.name]: e.target.value })}
                            />
                            {v.unit && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400">{v.unit}</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCalculateApp(activeApp)}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold rounded-xl text-sm hover:opacity-90 shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4" /> حساب النتيجة فوراً
                    </button>

                    {appResult && (
                      <div className="mt-8 p-6 bg-slate-950 rounded-xl border border-slate-800 animate-fadeIn">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">مخرجات الحساب الفورية</span>
                          <span className="text-xs text-slate-500">المرجع الهندسي: {appResult.code}</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-xs text-slate-400 block mb-1">النتيجة الرقمية القطعية:</span>
                          <span className="text-3xl font-black text-white tracking-tight">{appResult.numeric}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block mb-1">التقرير الفني التوضيحي:</span>
                          <p className="text-sm text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800/60 leading-relaxed font-mono">{appResult.report}</p>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs rounded-lg border border-slate-800 font-medium transition-colors">
                            <Download className="w-3.5 h-3.5 text-cyan-400" /> تحميل التقرير PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                    <Calculator className="w-12 h-12 text-slate-700 animate-pulse" />
                    <p className="text-sm font-medium">الرجاء اختيار أحد التطبيقات الحسابية الحية من القائمة الجانبية لبدء إدخال البيانات والمعالجة الفورية.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. برمجيات الأتمتة (Automation Software) */}
        {activeTab === "automation-software" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Settings className="text-purple-400" /> متجر برمجيات وسكربتات الأتمتة
              </h2>
              <p className="text-slate-400 text-sm mt-1">سكربتات وإضافات جاهزة لبرامج التحليل والحصر لتقليص وقت العمل المكتبي وهندسة البيانات بضغطة زر واحدة.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col gap-4">
                {automations.map((auto) => (
                  <button
                    key={auto.id}
                    onClick={() => { setActiveAutomation(auto); setAutoResult(null); }}
                    className={`w-full text-right p-5 rounded-2xl border transition-all flex flex-col gap-2 ${
                      activeAutomation?.id === auto.id ? "bg-slate-900 border-purple-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded self-start">مسموح: {auto.allowedExtensions}</span>
                    <h3 className="text-md font-bold text-slate-200">{auto.title}</h3>
                  </button>
                ))}
                {automations.length === 0 && <p className="text-xs text-slate-600 text-center py-4">لا توجد سكربتات مرفوعة حالياً من الأدمن.</p>}
              </div>

              <div className="lg:col-span-2">
                {activeAutomation ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2">{activeAutomation.title}</h3>
                    <p className="text-xs text-slate-400 mb-6">الحد الأقصى للملف: {activeAutomation.maxSize} ميجابايت لضمان سرعة الخادم.</p>
                    
                    <div className="border-2 border-dashed border-slate-800 hover:border-purple-500 rounded-xl p-8 text-center bg-slate-950 transition-colors cursor-pointer mb-6">
                      <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3 animate-bounce" />
                      <p className="text-sm text-slate-300 font-medium">قم بسحب وإفلات ملف المشروع هنا أو انقر للتصفح</p>
                      <p className="text-xs text-slate-500 mt-1">الملفات المدعومة المقبولة: {activeAutomation.allowedExtensions}</p>
                    </div>

                    <button 
                      onClick={() => setAutoResult(true)}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl text-sm shadow-md"
                    >
                      تشغيل سكربت الأتمتة الميكانيكية خلف الكواليس
                    </button>

                    {autoResult && (
                      <div className="mt-6 p-5 bg-slate-950 border border-slate-800 rounded-xl animate-fadeIn">
                        <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> تم معالجة السكربت والوصفة بنجاح!
                        </h4>
                        <div className="flex flex-col gap-2">
                          <button className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-800/80">
                            <span className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-400" /> جداول الحصر المحاسبية النهائية المكتملة</span>
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500">
                    الرجاء تحديد محرك الأتمتة والسكربت من القائمة الجانبية لتشغيل خوارزميات التدقيق والحصر التلقائي.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. حلول الذكاء الاصطناعي (AI Solutions) */}
        {activeTab === "ai-solutions" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Bot className="text-blue-400" /> حلول وروبوتات الذكاء الاصطناعي التخصصية
              </h2>
              <p className="text-slate-400 text-sm mt-1">معالجة الصور والمخططات الهندسية عبر نماذج شبكية عميقة مدربة بدقة بالغة على رصد الأخطاء والتصدعات.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col gap-4">
                {aiSolutions.map((ai) => (
                  <button
                    key={ai.id}
                    onClick={() => { setActiveAi(ai); setAiResult(null); }}
                    className={`w-full text-right p-5 rounded-2xl border transition-all flex flex-col gap-2 ${
                      activeAi?.id === ai.id ? "bg-slate-900 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <h3 className="text-md font-bold text-slate-200">{ai.title}</h3>
                  </button>
                ))}
                {aiSolutions.length === 0 && <p className="text-xs text-slate-600 text-center py-4">لا توجد أدوات ذكاء اصطناعي مرفوعة حالياً.</p>}
              </div>

              <div className="lg:col-span-2">
                {activeAi ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4">{activeAi.title}</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="border-2 border-dashed border-slate-800 hover:border-blue-500 rounded-xl p-6 text-center bg-slate-950 cursor-pointer">
                        <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-300">ارفع الصورة الواضحة للتصدعات/المخطط الفني المطلوب فحصه</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">بيانات السياق المحيطة (عمر المبنى، نوع العنصر الإنشائي):</label>
                        <input 
                          type="text" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                          placeholder="مثال: مبنى سكني بعمر 5 سنوات، الفحص لعمود خرساني بالدور الأرضي"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => setAiResult(true)}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-slate-950 font-bold rounded-xl text-sm shadow-md"
                    >
                      بدء تحليل الشبكة العصبية الهندسية الفورية
                    </button>

                    {aiResult && (
                      <div className="mt-6 p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                          <AlertTriangle className="w-4 h-4" /> تقرير حالة تشخيص الروبوت الفوري المعتمد:
                        </div>
                        <div className="p-3 bg-red-950/20 text-red-400 border border-red-900/30 rounded-lg text-xs leading-relaxed font-semibold">
                          الشرخ المرصود: (شروخ قص إنشائية حادة - Shear Crack) - مستوى الخطورة الحرجة: عالية جداً - الإجراء الفوري الإلزامي: إخلاء محيط المكان واستدعاء استشاري ترميم متخصص فوراً.
                        </div>
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                          <p>• تحليل مرئي: تم رسم خريطة حرارية (Heatmap) لتحديد العمق بدقة متناهية.</p>
                          <p>• مطابقة المعايير: تخطى العرض حاجز الحدود الدنيا المسموحة بكود الاستدامة القياسي.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500">
                    الرجاء تحديد النموذج الذكي أو روبوت التشخيص لتطبيق خوارزميات المسح الذاتي واستخراج الخرائط الحرارية للأخطاء.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. الإدارة والتحكم (Management & Control) */}
        {activeTab === "management-control" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="text-cyan-400" /> أنظمة الإدارة والتحكم الفني للمشاريع (SaaS)
              </h2>
              <p className="text-slate-400 text-sm mt-1">تطبيقات مركزية سحابية متكاملة لتمكين المكاتب الهندسية من إدارة مستنداتهم، ومناقصاتهم، ومورديهم بذكاء استراتيجي.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col gap-4">
                {managementTools.map((mgmt) => (
                  <button
                    key={mgmt.id}
                    onClick={() => { setActiveManagement(mgmt); setMgmtResult(null); }}
                    className={`w-full text-right p-5 rounded-2xl border transition-all flex flex-col gap-2 ${
                      activeManagement?.id === mgmt.id ? "bg-slate-900 border-cyan-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <h3 className="text-md font-bold text-slate-200">{mgmt.title}</h3>
                  </button>
                ))}
                {managementTools.length === 0 && <p className="text-xs text-slate-600 text-center py-4">لا توجد أنظمة إدارة مرفوعة حالياً.</p>}
              </div>

              <div className="lg:col-span-2">
                {activeManagement ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4">{activeManagement.title}</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">رفع المخططات أو جداول المقارنة والعروض المالية:</label>
                        <div className="border-2 border-dashed border-slate-800 p-6 text-center rounded-xl bg-slate-950">
                          <Upload className="w-7 h-7 text-cyan-400 mx-auto mb-1" />
                          <span className="text-xs text-slate-400 block">قم بإسقاط عروض الموردين الفنية والمالية</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setMgmtResult(true)}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-sm shadow-md"
                    >
                      توليد جداول المقارنة والتحليلات الإدارية الذكية
                    </button>

                    {mgmtResult && (
                      <div className="mt-6 space-y-4 animate-fadeIn">
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4" /> لوحة قيادة متكاملة وجدول المقارنة الذكي (Comparison Sheet)
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            تم تفعيل معادلات الوزن النسبي تلقائياً لإجراء الترتيب الهيكلي للموردين بناءً على (السعر المطروح، سنوات الخبرة، وجداول المدد الزمنية للتنفيذ)، مع صياغة آلية لتقرير التوصية الإداري النهائي للتعاقد الفوري.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500">
                    الرجاء اختيار أحد الأنظمة الإدارية والهيكلية لتفعيل لوحات المتابعة وسجلات الاعتماد القياسية للمخططات والموردين.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 6. قسم اطلب أداتك البرمجية الخاصة */}
        {activeTab === "request-tool" && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                <HelpCircle className="text-cyan-400 w-7 h-7" /> اطلب أداتك البرمجية المخصصة
              </h2>
              <p className="text-slate-400 text-sm mt-1.5">هل تحتاج إلى معادلة خاصة أو سكربت أتمتة مخصص لشركتك؟ صغ متطلباتك وسيقوم فريقنا الهندسي بتطويرها ودمجها لك فوراً.</p>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1"><User className="w-3.5 h-3.5 text-cyan-400" /> الاسم الكريم *</label>
                  <input
                    type="text" required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-slate-100 placeholder:text-slate-600"
                    placeholder="الاسم الثلاثي بالكامل"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-cyan-400" /> البريد الإلكتروني المعتمد *</label>
                  <input
                    type="email" required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-slate-100 placeholder:text-slate-600"
                    placeholder="example@domain.com"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-cyan-400" /> رقم الهاتف / الواتساب للتواصل والتدقيق</label>
                <input
                  type="tel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-slate-100 placeholder:text-slate-600 text-left font-mono"
                  placeholder="+966 50 000 0000"
                  value={requestForm.phone}
                  onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">شرح وتفاصيل المتطلبات التقنية والهندسية للأداة المطلوبة *</label>
                <textarea
                  required rows={5}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-slate-100 placeholder:text-slate-600 leading-relaxed"
                  placeholder="الرجاء صياغة المعادلات الرياضية، نطاق العمل، الكود الهندسي المتبع، ونوع الملفات المستهدفة للمخرجات..."
                  value={requestForm.details}
                  onChange={(e) => setRequestForm({ ...requestForm, details: e.target.value })}
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-slate-300">يتم استقبال ومعالجة طلبات الأدوات البرمجية مركزياً عبر خوادم الموقع والبريد الرسمي المشترك:</p>
                <p className="font-mono text-cyan-400 select-all">Smart.Engineering.Global@proton.me | smart.engineering.global@tuta.io | smartengineering.hr.global@gmail.com</p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-slate-950 font-black rounded-xl text-md hover:opacity-95 shadow-xl shadow-cyan-500/10 transition-all uppercase tracking-wide"
              >
                إرسال الطلب الفني إلى المكتب البرمجي المشترك
              </button>

              {requestStatus === "success" && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl text-center animate-fadeIn flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> تم رفع طلبك الهندسي بنجاح إلى الإدارة والمزامنة عبر الايميلات المعتمدة بنجاح تام!
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      {/* النافذة المنبثقة الذكية (Popup) للبرومبتات لقراءة الأقواس وتعبئتها */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Terminal className="text-cyan-400" /> تخصيص أمر: {selectedPrompt.title}
            </h3>
            <p className="text-xs text-slate-400 mb-5">الرجاء إدخال البيانات الميدانية المطلوبة لتوليد صياغة هندسية بالغة الدقة ومتوافقة مع الذكاء الاصطناعي.</p>

            <div className="space-y-4 mb-6">
              {Object.keys(promptVariables).map((vName, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">أدخل قيمة حقل [ {vName} ]:</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500 text-slate-100"
                    placeholder={`مثال لقيمة: ${vName}`}
                    value={promptVariables[vName]}
                    onChange={(e) => setPromptVariables({ ...promptVariables, [vName]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExecutePrompt}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Copy className="w-4 h-4" /> دمج الأمر ونسخه في الخلفية
              </button>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-xl text-sm transition-all border border-slate-700/50"
              >
                إلغاء
              </button>
            </div>

            {copiedNotification && (
              <div className="absolute inset-x-6 bottom-20 p-3 bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 shadow-xl animate-bounce">
                <CheckCircle className="w-4 h-4" /> تم النسخ بنجاح! اذهب إلى {selectedPrompt.platform} المنصة المناسبة للتنفيذ وألصق النص.
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-600 font-medium mt-20">
        &copy; {new Date().getFullYear()} منصة الهندسة الذكية - كافة الحقوق محفوظة للمطور م. هاشم سلطان
      </footer>
    </div>
  );
}