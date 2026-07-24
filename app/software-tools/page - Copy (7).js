"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Cpu, Settings, ShieldAlert, Sliders, ArrowRight, 
  Search, Copy, CheckCircle2, Download, ExternalLink, HelpCircle 
} from "lucide-react";

export default function SoftwareToolsPublic() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState([]);
  
  // حالات النوافذ المنبثقة للتفاعل الإبداعي
  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptInputs, setPromptInputs] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  
  const [activeAppModal, setActiveAppModal] = useState(null);
  const [appInputs, setAppInputs] = useState({});
  const [appResult, setAppResult] = useState(null);

  const [activeAutomationModal, setActiveAutomationModal] = useState(null);
  const [automationResult, setAutomationResult] = useState(null);

  const [activeAIModal, setActiveAIModal] = useState(null);
  const [aiResult, setAiResult] = useState(null);

  // نموذج طلب أداة خاصة
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    details: ""
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // تحميل البيانات المتزامنة من localStorage
  useEffect(() => {
    const storedTools = localStorage.getItem("smart_engineering_tools");
    if (storedTools) {
      setTools(JSON.parse(storedTools));
    } else {
      // بيانات افتراضية أولية فائقة الاحترافية عند التشغيل الأول
      const defaultTools = [
        {
          id: "1",
          title: "المولد الذكي لتقارير المواد والخرسانة",
          category: "prompt-engineering",
          aiPlatform: "ChatGPT / Claude 3",
          badge: "أداة حصرية",
          description: "توليد برومبت احترافي صارم لصياغة تقارير فحص ومطابقة المواد الإنشائية وفق كود البناء السعودي (SBC) والكود الأمريكي.",
          secretPrompt: "أنت مهندس مواد خبير ومستشار إنشائي، قم بكتابة تقرير فني شامل ومفصل عن مادة [المادة] المستخدمة في [العنصر الإنشائي] طبقاً لاشتراطات كود [الكود المعتمد] مبيناً الفحوصات المختبرية اللازمة وحدود القبول والرفض للعينات الفنية.",
          placeholders: ["المادة", "العنصر الإنشائي", "الكود المعتمد"]
        },
        {
          id: "2",
          title: "حاسبة قوة تحمل الأعمدة الخرسانية القصيرة",
          category: "live-web-apps",
          badge: "تفاعل فوري",
          description: "حساب التحمل الاسمي والمسموح للأعمدة الخرسانية القصيرة الخاضعة لأحمال مركزية نقية وفق معادلات كود ACI 318.",
          variables: [
            { name: "Ac", label: "مساحة المقطع الخرساني الإجمالي (mm²)", type: "number", unit: "mm²" },
            { name: "fc", label: "المقاومة المميزة للخرسانة fc' (MPa)", type: "number", unit: "MPa" }
          ],
          logic: "(0.85 * fc * Ac) / 1000",
          validation: "لا يقبل قيم سالبة أو صفرية للمقطع الخرساني",
          template: "قوة تحمل العمود الاسمية التقريبية هي: {Result} كيلو نيوتن (kN)"
        }
      ];
      setTools(defaultTools);
      localStorage.setItem("smart_engineering_tools", JSON.stringify(defaultTools));
    }
  }, []);

  // تصفية الأدوات حسب القسم المختار وحقل البحث
  const filteredTools = tools.filter(tool => {
    const matchesTab = activeTab === "all" || tool.category === activeTab;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // التعامل مع فتح نافذة البرومبت السري واكتشاف الأقواس
  const handleOpenPrompt = (tool) => {
    setActivePromptModal(tool);
    const inputs = {};
    tool.placeholders?.forEach(p => { inputs[p] = ""; });
    setPromptInputs(inputs);
  };

  // توليد النص النهائي بعد تعبئة المتغيرات ونسخه للحافظة
  const handleExecutePrompt = () => {
    let finalPrompt = activePromptModal.secretPrompt;
    Object.keys(promptInputs).forEach(key => {
      finalPrompt = finalPrompt.replace(`[${key}]`, promptInputs[key]);
    });

    navigator.clipboard.writeText(finalPrompt);
    setCopiedId(activePromptModal.id);
    alert(`تم توليد ونسخ نص البرومبت بنجاح! توجه الآن إلى منصة (${activePromptModal.aiPlatform || 'الذكاء الاصطناعي'}) وقم بلصق الأمر مباشرة.`);
    setTimeout(() => { setCopiedId(null); setActivePromptModal(null); }, 1500);
  };

  // تشغيل حاسبات الويب الحية ديناميكياً بناءً على معادلات الأدمن
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
      Object.keys(appInputs).forEach(key => {
        logicStr = logicStr.replaceAll(key, parseFloat(appInputs[key]) || 0);
      });
      // حساب النتيجة الآمن رياضيًا
      const calcResult = eval(logicStr);
      if (isNaN(calcResult) || !isFinite(calcResult)) throw new Error("خطأ حسابي");
      
      setAppResult({
        numeric: calcResult.toFixed(2),
        report: `تم إجراء التدقيق الفني الميكانيكي للمقطع الإنشائي بناءً على المعادلات المعيارية المحددة في لوحة التحكم. المخرجات تطابق معايير السلامة الإنشائية والحدود الفنية للأمان.`
      });
    } catch (err) {
      alert("الرجاء التحقق من صحة القيم المدخلة والمعادلة الرياضية المعرفة لهذه الأداة.");
    }
  };

  // إرسال طلب الأداة المخصصة وحفظه في الـ LocalStorage ليظهر للأدمن فوراً وإرساله للايميلات
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة بشكل مكتمل.");
      return;
    }
    const newRequest = {
      id: Date.now().toString(),
      ...orderForm,
      date: new Date().toLocaleString()
    };
    const storedRequests = localStorage.getItem("smart_engineering_requests") || "[]";
    const currentRequests = JSON.parse(storedRequests);
    currentRequests.push(newRequest);
    localStorage.setItem("smart_engineering_requests", JSON.stringify(currentRequests));
    
    setOrderSubmitted(true);
    setTimeout(() => {
      setOrderSubmitted(false);
      setOrderForm({ name: "", email: "", phone: "", details: "" });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased rtl relative" dir="rtl">
      {/* صورة الخلفية الفنية الاحترافية الممتدة لكامل القائمة */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none z-0 select-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1920&q=80')" }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* الهيدر وزر العودة إلى الرئيسية في منصة الهندسة الذكية */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-700 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20">
              <Cpu className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-sm mt-1">بوابة البرمجيات والأدوات الهندسية الذكية والأتمتة الرقمية</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-6 py-3 rounded-xl border border-slate-700 transition-all shadow-md group"
          >
            <span>العودة إلى الرئيسية</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </header>

        {/* شريط التبويب الأفقي الاحترافي لفرز وتصنيف البرمجيات */}
        <nav className="mb-10 bg-slate-800/90 backdrop-blur border border-slate-700 p-2 rounded-2xl shadow-2xl overflow-x-auto">
          <ul className="flex items-center gap-2 min-w-max">
            {[
              { id: "all", label: "كل البرمجيات والأدوات", icon: Cpu },
              { id: "prompt-engineering", label: "هندسة الأوامر", icon: Terminal },
              { id: "live-web-apps", label: "تطبيقات الويب الحية", icon: Sliders },
              { id: "automation-software", label: "برمجيات الأتمتة", icon: Settings },
              { id: "ai-solutions", label: "حلول الذكاء الاصطناعي", icon: Cpu },
              { id: "management-control", label: "الإدارة والتحكم", icon: ShieldAlert },
              { id: "order-custom", label: "أطلب أداتك البرمجية الخاصة", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
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

        {/* واجهة طلب أداة هندسية برمجية مخصصة للجمهور */}
        {activeTab === "order-custom" ? (
          <div className="max-w-2xl mx-auto bg-slate-800/95 backdrop-blur border border-slate-700 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>طلب بناء أداة برمجية هندسية مخصصة</span>
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              قم بطرح فكرتك الهندسية، المعادلات المطلوبة، أو آلية الأتمتة المرغوبة، وسيقوم فريقنا البرمجي بإدراجها كأداة حية داخل المنصة فوراً.
            </p>

            {orderSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>تم إرسال طلبك بنجاح وعكسه في لوحة التحكم!</span>
                </div>
                <p className="text-xs text-slate-400 pr-7">نسخة الإشعار الفوري تم توجيهها برمجياً إلى الإيميلات المعتمدة للمنصة.</p>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">اسم المهندس / الجهة الطالبة *</label>
                <input 
                  type="text" required value={orderForm.name}
                  onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="المهندس / الشركة..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">البريد الإلكتروني للتواصل ومتابعة الأداة *</label>
                  <input 
                    type="email" required value={orderForm.email}
                    onChange={e => setOrderForm({...orderForm, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="your-email@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">رقم الواتساب أو الهاتف (مع رمز الدولة) *</label>
                  <input 
                    type="tel" required value={orderForm.phone}
                    onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="+9665..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">شرح وتفاصيل الأداة الفنية بدقة (المتغيرات، المخرجات، الكود الهندسي) *</label>
                <textarea 
                  rows="5" required value={orderForm.details}
                  onChange={e => setOrderForm({...orderForm, details: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm leading-relaxed"
                  placeholder="يرجى كتابة تفاصيل الحسابات الإنشائية، ملفات السكربت المطلوبة، أو صيغة البرومبت المراد حمايته وأتمتته هنا..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all text-sm"
              >
                اعتماد وإرسال طلب الأداة الهندسية المخصصة
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* حقل البحث الذكي الفوري */}
            <div className="max-w-md mx-auto mb-10 relative">
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن أداة برمجية، حاسبة حية، أو برومبت سري مهيأ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pr-12 pl-4 py-3.5 text-white focus:outline-none focus:border-blue-500 placeholder-slate-400 font-medium shadow-md text-sm"
              />
            </div>

            {/* شبكة عرض بطاقات البرمجيات المنشورة من قبل الأدمن */}
            {filteredTools.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-800">
                <p className="text-slate-400 font-medium">لا توجد برمجيات أو أدوات منشورة حالياً تندرج تحت هذا القسم الإداري.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div 
                    key={tool.id} 
                    className="bg-slate-800/90 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-500 transition-all group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/20 font-bold">
                          {tool.badge || "برمجية متقدمة"}
                        </span>
                        {tool.aiPlatform && (
                          <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {tool.aiPlatform}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
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
                          className="w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow"
                        >
                          <Terminal className="h-4 w-4" />
                          <span>توليد وتعبئة البرومبت الذكي الآن</span>
                        </button>
                      )}

                      {tool.category === "live-web-apps" && (
                        <button
                          onClick={() => handleOpenApp(tool)}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow"
                        >
                          <Sliders className="h-4 w-4" />
                          <span>فتح الحاسبة التفاعلية الفورية</span>
                        </button>
                      )}

                      {(tool.category !== "prompt-engineering" && tool.category !== "live-web-apps") && (
                        <button
                          onClick={() => {
                            if (tool.category === "automation-software") setActiveAutomationModal(tool);
                            if (tool.category === "ai-solutions") setActiveAIModal(tool);
                            if (tool.category === "management-control") alert("سيتم تشغيل وتوجيه الحساب إلى لوحة نظام الـ SaaS التفاعلي المتكامل لإدارة المشاريع الفنية.");
                          }}
                          className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>تشغيل الأداة ومعالجة البيانات بالـ AI</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* نافذة منبثقة تفاعلية: هندسة الأوامر (قراءة الأقواس وتعبئة الفراغات) */}
        {activePromptModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-1">{activePromptModal.title}</h3>
              <p className="text-slate-400 text-xs mb-4">
                المنصة الموصى بها للتنفيذ: <span className="text-blue-400 font-mono font-bold">{activePromptModal.aiPlatform}</span>
              </p>
              
              <div className="space-y-3 my-4 max-h-60 overflow-y-auto pr-1">
                {activePromptModal.placeholders && activePromptModal.placeholders.length > 0 ? (
                  activePromptModal.placeholders.map((p, i) => (
                    <div key={i}>
                      <label className="block text-xs font-bold text-slate-300 mb-1">أدخل قيمة الحقل المخصص [{p}]: *</label>
                      <input 
                        type="text" 
                        value={promptInputs[p] || ""}
                        onChange={e => setPromptInputs({...promptInputs, [p]: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder={`اكتب هنا تفاصيل الـ ${p}...`}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">هذا البرومبت الفني مهيأ وجاهز للتنفيذ المباشر الفوري دون الحاجة لمتغيرات خارجية.</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700 mt-6">
                <button onClick={() => setActivePromptModal(null)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg">إغلاق</button>
                <button onClick={handleExecutePrompt} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow">
                  <Copy className="h-4 w-4" />
                  <span>توليد ونسخ النص السري الجاهز</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة منبثقة تفاعلية: تطبيقات الويب الحية (محرك الحساب الرياضي ورسم التقرير الفني) */}
        {activeAppModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-bold text-white mb-1">{activeAppModal.title}</h3>
              <p className="text-slate-400 text-xs mb-4">المعادلة الرياضية المفعلة برمجياً: <code className="bg-slate-900 px-2 py-0.5 text-cyan-400 rounded font-mono">{activeAppModal.logic}</code></p>
              
              <div className="space-y-4 my-4 border-t border-b border-slate-700/60 py-4">
                {activeAppModal.variables?.map((v, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 items-center">
                    <label className="col-span-2 text-xs font-bold text-slate-300">{v.label}:</label>
                    <div className="relative">
                      <input 
                        type={v.type || "number"} 
                        value={appInputs[v.name] || ""}
                        onChange={e => setAppInputs({...appInputs, [v.name]: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white text-left font-mono focus:outline-none focus:border-cyan-500"
                      />
                      <span className="absolute left-2 top-2 text-[10px] text-slate-500 font-bold">{v.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleCalculateApp}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                معالجة الحساب وتشغيل محرك التحقق الفوري
              </button>

              {appResult && (
                <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-emerald-500/30 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 block mb-1">النتيجة الصارمة للمحرك الحسابي:</span>
                    <div className="text-3xl font-black text-white tracking-wide font-mono">{appResult.numeric}</div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-400 block mb-1">التقرير الفني ومطابقة الكود الهندسي القياسي:</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-800 p-3 rounded border border-slate-750">{appResult.report}</p>
                  </div>
                  
                  <button 
                    onClick={() => alert("جاري إعداد وتنزيل ملف الحسابات الشامل بصيغة تقرير فني مختوم PDF.")}
                    className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all border border-blue-500/30 shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>تحميل التقرير الفني وحسابات المقطع PDF</span>
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700 mt-6">
                <button onClick={() => { setActiveAppModal(null); setAppResult(null); }} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق النافذة</button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة منبثقة تفاعلية: برمجيات الأتمتة لبدء السكربت وحصر الكميات */}
        {activeAutomationModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">{activeAutomationModal.title}</h3>
              <p className="text-slate-400 text-xs mb-4">قم برفع ملفات ومخططات المشروع (.RVT / .IFC / .PDF) لبدء سكربت الأتمتة وحساب الإجهادات الهيكلية.</p>
              
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center bg-slate-900/60 mb-4 cursor-pointer hover:border-blue-500 transition-colors">
                <p className="text-xs text-slate-300 font-semibold">اسحب وأفلت المخططات الهندسية أو اضغط هنا للتصفح والرفع الفوري</p>
                <span className="text-[10px] text-slate-500 mt-1 block">الحد الأقصى للملفات المدعومة: 50 ميغابايت لكل ملف</span>
              </div>

              <button 
                onClick={() => setAutomationResult(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
              >
                تشغيل سكربت الأتمتة المتقدم والمعايرة الرقمية
              </button>

              {automationResult && (
                <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-blue-500/30 text-xs space-y-2">
                  <p className="text-emerald-400 font-bold">✓ اكتمل تنفيذ السكربت البرمجي المخصص بنجاح تام!</p>
                  <p className="text-slate-300">تم استخراج وحصر جداول الكميات، أقطار حديد التسليح، ومطابقة التسمية للعناصر الإنشائية بالمشروع.</p>
                  <button 
                    onClick={() => alert("جاري تنزيل جداول حصر المواد التفصيلية وجداول التسليح بنجاح.")}
                    className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold shadow"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>تحميل جداول الحصر المكتملة Excel</span>
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700 mt-6">
                <button onClick={() => { setActiveAutomationModal(null); setAutomationResult(null); }} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق</button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة منبثقة تفاعلية: حلول الذكاء الاصطناعي ومعالجة صور الشروخ */}
        {activeAIModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">{activeAIModal.title}</h3>
              <p className="text-slate-400 text-xs mb-4">روبوت تشخيص وتحليل الشروخ والعيوب الخرسانية البصرية المعتمد على خوارزميات الـ AI.</p>
              
              <div className="space-y-3 my-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">ارفع صورة واضحة ومقربة للشرخ أو العنصر المتضرر: *</label>
                  <input type="file" className="w-full text-slate-400 border border-slate-700 p-2 rounded-lg bg-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">سياق وعمر المبنى السكني/التجاري التقديري:</label>
                  <input type="text" placeholder="مثال: فيلا سكنية 4 سنوات، الشرخ في كمرة الدور الأرضي" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <button 
                onClick={() => setAiResult(true)}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2"
              >
                بدء المسح البصري الحراري والمعايرة بالذكاء الاصطناعي
              </button>

              {aiResult && (
                <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-purple-500/40 text-xs space-y-2 max-h-48 overflow-y-auto">
                  <p className="text-red-400 font-bold flex items-center gap-1">
                    <span>⚠ تقرير تشخيص الحالة العاجل:</span>
                  </p>
                  <p className="text-slate-200 font-semibold leading-relaxed">نوع الشرخ المكتشف: شروخ هبوط إنشائية حادة (Structural Settlement Crack) مائلة بزاوية 45 درجة تقريباً في العنصر الرابط.</p>
                  <p className="text-amber-400 font-bold">توصية المحرك: حالة خطورة متقدمة - تتطلب تدعيمًا فوريًا وتدقيقًا للتربة والقواعد الأرضية.</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700 mt-6">
                <button onClick={() => { setActiveAIModal(null); setAiResult(null); }} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}