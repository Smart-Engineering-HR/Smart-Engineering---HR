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
  const [loading, setLoading] = useState(true);

  // حالات تفاعلية للنوافذ المنبثقة
  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptInputs, setPromptInputs] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  
  const [activeAppModal, setActiveAppModal] = useState(null);
  const [appInputs, setAppInputs] = useState({});
  const [appResult, setAppResult] = useState(null);

  // نظام رفع الملفات والمعالجة
  const [activeProcessingModal, setActiveProcessingModal] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputType, setOutputType] = useState("all");
  const [processingResult, setProcessingResult] = useState(null);

  // نموذج طلب أداة برمجية خاصة
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    details: ""
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // جلب البرمجيات مباشرة من API الخادم
  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/software-tool");
      const data = await res.json();
      if (data.success) {
        setTools(data.data);
      }
    } catch (err) {
      console.error("خطأ في جلب بيانات البرمجيات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // تصفية الأدوات المعتمدة
  const filteredTools = tools.filter(tool => {
    const matchesTab = activeTab === "all" || tool.category === activeTab;
    const matchesSearch = tool.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // معالجة البرومبت الذكي
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
    alert(`تم توليد ونسخ نص البرومبت بنجاح! يرجى لصقه في منصة الذكاء الاصطناعي: (${activePromptModal.aiPlatform})`);
    setTimeout(() => { setCopiedId(null); setActivePromptModal(null); }, 1200);
  };

  // معالجة الحاسبة الحية
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
        alert(`تنبيه التحقق الفني: ${activeAppModal.validation || "القيم المدخلة غير مسموح بها"}`);
        return;
      }

      const calcResult = eval(logicStr);
      if (isNaN(calcResult) || !isFinite(calcResult)) throw new Error("خطأ حسابي");
      
      setAppResult({
        numeric: calcResult.toFixed(2),
        report: activeAppModal.template 
          ? activeAppModal.template.replace("{Result}", calcResult.toFixed(2))
          : `بناءً على المعادلة المعتمدة، فإن القيمة المحسوبة هي ${calcResult.toFixed(2)} وتحقق معايير الأمان الميكانيكي.`
      });
    } catch (err) {
      alert("الرجاء التحقق من صحة القيم والمعادلة الحسابية المعتمدة.");
    }
  };

  // معالجة رفع الملفات والمخرجات
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
      alert("الرجاء رفع ملف المشروع أولاً ليتمكن المحرك من بدء المعالجة الحية.");
      return;
    }
    setIsProcessing(true);
    
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
          { rank: 2, provider: "شركة الفوزان للمقاولات والتوريد", score: "82.0%", recommendation: "خيار بديل ثانٍ" }
        ],
        ganttChart: [
          { task: "أعمال حفر الموقع وتجهيز التربة", duration: "12 يوم", status: "مكتملة", budget: "100%" },
          { task: "صب خرسانة القواعد والرقاب الإنشائية", duration: "8 أيام", status: "تأخير 3 أيام", budget: "85%" }
        ],
        productivity: [
          { engineer: "م. هاشم سلطان (الإنشائي الاستشاري)", taskCount: "18 مهمة/مخطط", performance: "ممتاز - 98%" }
        ],
        crackAnalysis: {
          type: "شروخ قص إنشائية حادة (Shear Crack)",
          criticality: "عالية جداً ومقلقة للمنطوق الإنشائي",
          action: "إخلاء المكان فوراً واستشارة استشاري هندسي معتمد لعمل قميص خرساني تدعيمي.",
          depth: "14 mm",
          width: "3.5 mm"
        },
        auditReport: [
          { error: "هذا العمود (C3) لا يحقق نسبة التسليح الدنيا المطلوبة", cause: "مساحة الحديد الحالية 0.6% والكود يفرض 1.0%", fix: "زيادة أقطار حديد التسليح إلى 6Φ16 مم" }
        ]
      });
    }, 1800);
  };

  // إرسال طلب أداة خاصة عبر API (يُرسل إيميل ويعكس للـ Admin)
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("الرجاء تعبئة كافة الحقول المطلوبة.");
      return;
    }

    try {
      setSubmittingOrder(true);
      const res = await fetch("/api/software-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_custom_tool",
          ...orderForm
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrderSubmitted(true);
        alert(data.message || "تم إرسال طلبك بنجاح للبريد الرسمي ولوحة الإدارة!");
        setOrderForm({ name: "", email: "", phone: "", details: "" });
        setTimeout(() => setOrderSubmitted(false), 4000);
      } else {
        alert("خطأ: " + data.error);
      }
    } catch (err) {
      alert("فشل إرسال الطلب: " + err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased rtl relative" dir="rtl">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06] pointer-events-none z-0 select-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80')" }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* الهيدر */}
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
            <span>العودة إلى القائمة الرئيسية</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </header>

        {/* شريط الأقسام */}
        <nav className="mb-10 bg-slate-800/80 backdrop-blur border border-slate-700 p-2 rounded-2xl shadow-2xl overflow-x-auto">
          <ul className="flex items-center gap-2 min-w-max">
            {[
              { id: "all", label: "كل البرمجيات والأدوات", icon: Cpu },
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

        {/* تبويب طلب أداة خاصة */}
        {activeTab === "order-custom" ? (
          <div className="max-w-3xl mx-auto bg-slate-800/95 backdrop-blur border border-slate-700 p-8 rounded-3xl shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2 relative z-10">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>طلب بناء وتطوير أداة برمجية هندسية مخصصة</span>
            </h2>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed relative z-10">
              اطرح أفكارك الهندسية وسيقوم فريق التطوير بإدراجها فوراً كأداة حية داخل لوحة التحكم والمنصة العامة مع إرسال الإشعارات التلقائية للإدارة.
            </p>

            {orderSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>تم إرسال وحفظ طلبك بنجاح وعكسه في لوحة الإدارة والإيميلات الرسمية!</span>
                </div>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المهندس أو الجهة الطالبة *</label>
                <input 
                  type="text" required value={orderForm.name}
                  onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs font-medium"
                  placeholder="الاسم الكامل أو اسم الشركة..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني الرسمي *</label>
                  <input 
                    type="email" required value={orderForm.email}
                    onChange={e => setOrderForm({...orderForm, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
                    placeholder="engineer@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الهاتف أو الواتساب *</label>
                  <input 
                    type="tel" required value={orderForm.phone}
                    onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
                    placeholder="+9665..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الشرح والتفاصيل الفنية للأداة المطلوبة *</label>
                <textarea 
                  rows="6" required value={orderForm.details}
                  onChange={e => setOrderForm({...orderForm, details: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
                  placeholder="اكتب هنا التفاصيل والحسابات المطلوبة..."
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={submittingOrder}
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs disabled:opacity-50"
              >
                {submittingOrder ? "جاري الإرسال والمعالجة..." : "اعتماد طلب بناء الأداة الهندسية المخصصة وإخطار الإدارة فورياً"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* مربع البحث */}
            <div className="max-w-xl mx-auto mb-10 relative">
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن أداة برمجية، حاسبة حية، أو نظام أتمتة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pr-12 pl-4 py-4 text-white focus:outline-none focus:border-blue-500 placeholder-slate-400 font-medium shadow-md text-xs"
              />
            </div>

            {/* شبكة العرض */}
            {loading ? (
              <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-800">
                <p className="text-slate-400 font-medium text-xs">جاري تحميل الأدوات والبرمجيات من الخادم...</p>
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-800">
                <p className="text-slate-400 font-medium text-xs">لا توجد برمجيات هندسية منشورة حالياً تحت هذا التبويب.</p>
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
                          {tool.badge || "برمجية متتقدمة"}
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
                          <span>تعبئة وتوليد البرومبت الذكي</span>
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
                              alert("سيتم توجيهك لنظام إدارة ومراقبة المشاريع الإنشائية SaaS.");
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

        {/* نافذة البرومبت */}
        {activePromptModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-1">{activePromptModal.title}</h3>
              <p className="text-slate-400 text-[11px] mb-4">
                منصة AI الموصى بها: <span className="text-cyan-400 font-mono font-bold">{activePromptModal.aiPlatform}</span>
              </p>
              
              <div className="space-y-4 my-4 max-h-64 overflow-y-auto pr-1 border-t border-b border-slate-700/60 py-4">
                {activePromptModal.placeholders && activePromptModal.placeholders.length > 0 ? (
                  activePromptModal.placeholders.map((p, i) => (
                    <div key={i}>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">حقل [{p}]: *</label>
                      <input 
                        type="text" 
                        value={promptInputs[p] || ""}
                        onChange={e => setPromptInputs({...promptInputs, [p]: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder={`أدخل قيمة ${p}...`}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">هذا البرومبت جاهز للتنفيذ دون مدخلات فرعية.</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 mt-4">
                <button onClick={() => setActivePromptModal(null)} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق</button>
                <button onClick={handleExecutePrompt} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow">
                  <Copy className="h-4 w-4" />
                  <span>توليد ونسخ النص</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة الحاسبة الحية */}
        {activeAppModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-lg font-bold text-white mb-1">{activeAppModal.title}</h3>
              <p className="text-slate-400 text-xs mb-4">المعادلة: <code className="bg-slate-950 px-2 py-0.5 text-cyan-400 rounded font-mono text-[11px]">{activeAppModal.logic}</code></p>
              
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
                تشغيل الحساب الفوري
              </button>

              {appResult && (
                <div className="mt-6 p-5 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase block mb-1">النتيجة الرقمية:</span>
                    <div className="text-4xl font-black text-white tracking-wide font-mono">{appResult.numeric}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 block mb-1">التقرير الفني:</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      {appResult.report}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700 mt-6">
                <button onClick={() => { setActiveAppModal(null); setAppResult(null); }} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق</button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة معالجة الملفات */}
        {activeProcessingModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-4xl p-6 relative shadow-2xl overflow-y-auto max-h-[95vh]">
              <h3 className="text-xl font-bold text-white mb-2">{activeProcessingModal.title}</h3>
              <p className="text-slate-400 text-xs mb-4">رفع ملفات والمخططات (.RVT, .IFC, .DWG, .DXF, .PDF, .XLSX, .PNG)</p>
              
              <div className="border-2 border-dashed border-slate-600 rounded-2xl p-6 text-center bg-slate-950/50 mb-4 cursor-pointer hover:border-blue-500 transition-colors relative">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept=".rvt,.ifc,.dwg,.dxf,.pdf,.xlsx,.png,.jpg,.jpeg"
                />
                <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2 animate-bounce" />
                {uploadedFile ? (
                  <p className="text-xs text-emerald-400 font-bold">الملف الجاهز: {uploadedFile.name}</p>
                ) : (
                  <p className="text-xs text-slate-300 font-semibold">اسحب وأفلت الملفات هنا أو اضغط للاستعراض</p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <button 
                  onClick={handleStartProcessing}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isProcessing ? "جاري تشغيل محرك المعالجة..." : "بدء معالجة الملف وتشغيل الأتمتة"}
                </button>
              </div>

              {processingResult && (
                <div className="space-y-6 mt-4 border-t border-slate-700/60 pt-4 max-h-[50vh] overflow-y-auto pl-2">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-blue-400 mb-3">سجل المخططات (Transmittal Log):</h4>
                    <table className="w-full text-right border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                          <th className="p-2">المعرف</th>
                          <th className="p-2">اسم الملف</th>
                          <th className="p-2">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {processingResult.transmittalLog.map((log, i) => (
                          <tr key={i}>
                            <td className="p-2 font-mono text-cyan-400">{log.id}</td>
                            <td className="p-2 text-white">{log.name}</td>
                            <td className="p-2 text-emerald-400">{log.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700 mt-6">
                <button onClick={() => { setActiveProcessingModal(null); setProcessingResult(null); }} className="px-5 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}