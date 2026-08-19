"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, Sliders, ArrowRight, Search, Copy, Upload, 
  HelpCircle, CheckCircle2, MessageSquare, RefreshCw, 
  Calculator, Wrench, Play, Sparkles, Layers, Zap, ExternalLink
} from "lucide-react";

export default function SoftwareToolsPublic() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeStage, setActiveStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // حالة النوافذ التفاعلية
  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptValues, setPromptValues] = useState({ input_area: "", input_price: "" });
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const [activeAppModal, setActiveAppModal] = useState(null);
  const [calcInputs, setCalcInputs] = useState({ b: 300, h: 600, fc: 30, fy: 420 });
  const [calcResult, setCalcResult] = useState(null);

  // نموذج طلب أداة خاصة
  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // المهندس الذكي AI
  const [aiSpecialization, setAiSpecialization] = useState("🤖 مهندس مدني");
  const [aiQuery, setAiQuery] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // محول الوحدات والملفات
  const [unitCategory, setUnitCategory] = useState("length");
  const [unitValue, setUnitValue] = useState(10);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/software-tools");
      const result = await res.json();
      if (result.success && result.data) {
        setTools(result.data);
      }
    } catch (err) {
      console.error("فشل جلب البرمجيات:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesTab = activeTab === "all" || tool.category === activeTab;
    const matchesStage = activeStage === "all" || tool.stage === activeStage;
    const matchesSearch = tool.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStage && matchesSearch;
  });

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("الرجاء تعبئة كافة الحقول المطلوبة.");
      return;
    }

    try {
      setIsSubmittingOrder(true);
      const res = await fetch("/api/software-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_custom_tool", ...orderForm }),
      });

      const result = await res.json();
      if (result.success) {
        setOrderSubmitted(true);
        setOrderForm({ name: "", email: "", phone: "", details: "" });
        setTimeout(() => setOrderSubmitted(false), 5000);
      } else {
        alert("حدث خطأ: " + result.error);
      }
    } catch (err) {
      alert("تعذر الاتصال بالخادم لإرسال الطلب.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleAiAsk = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userMessage = { sender: "user", text: aiQuery };
    setAiChatHistory(prev => [...prev, userMessage]);
    setAiQuery("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/software-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ai_engineer_chat", specialization: aiSpecialization, prompt: aiQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setAiChatHistory(prev => [...prev, { sender: "ai", text: data.answer }]);
      }
    } catch (err) {
      setAiChatHistory(prev => [...prev, { sender: "ai", text: "تعذر الاتصال بالمساعد الذكي حالياً." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const generatePromptResult = (tool) => {
    let resultPrompt = tool.secretPrompt || "";
    resultPrompt = resultPrompt.replace("[input_area]", promptValues.input_area || "---");
    resultPrompt = resultPrompt.replace("[input_price]", promptValues.input_price || "---");
    setGeneratedPrompt(resultPrompt);
  };

  const calculateColumnCapacity = () => {
    const { b, h, fc, fy } = calcInputs;
    const res = (((0.85 * fc * (b * h)) + (0.01 * (b * h) * fy)) / 1000).toFixed(2);
    setCalcResult(res);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl selection:bg-cyan-500 selection:text-black" dir="rtl">
      
      {/* Background Decorator */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900 via-slate-950 to-black"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800/80 pb-6 mb-8 gap-4 bg-slate-900/40 p-6 rounded-3xl backdrop-blur-xl border border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-cyan-500/20">
              <Cpu className="h-9 w-9 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
                  منصة الهندسة الذكية والموارد البشرية
                </h1>
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> PRO V2.6
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1 font-medium">دليل وحاسبات والوكلاء الذكيين لـ قائمة البرمجيات والأدوات الهندسيّة</p>
            </div>
          </div>
          
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 font-bold px-6 py-3 rounded-2xl border border-slate-700/60 transition-all text-xs shadow-lg hover:border-cyan-500/40">
            <span>الرئيسية</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        {/* Navigation Tabs */}
        <nav className="mb-6 bg-slate-900/60 border border-slate-800/80 p-2 rounded-2xl overflow-x-auto flex gap-2 backdrop-blur-md">
          {[
            { id: "all", label: "🌐 كل الأدوات والبرمجيات" },
            { id: "prompt-engineering", label: "⚡ A. هندسة الأوامر" },
            { id: "live-web-apps", label: "💻 B. تطبيقات الويب الحية" },
            { id: "automation-software", label: "🤖 C. برمجيات الأتمتة" },
            { id: "ai-solutions", label: "🧠 D. حلول الذكاء الاصطناعي" },
            { id: "management-control", label: "📊 E. الإدارة والتحكم" },
            { id: "quick-calculators", label: "🧮 F. الحاسبات الذكية Online" },
            { id: "ai-engineer", label: "👨‍💻 G. المهندس الذكي AI" },
            { id: "file-converter", label: "🔄 H. محول الملفات والوحدات" },
            { id: "order-custom", label: "📥 اطلب أداتك البرمجية الخاصة" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Filter Bar */}
        {activeTab !== "order-custom" && activeTab !== "ai-engineer" && activeTab !== "file-converter" && activeTab !== "quick-calculators" && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-300">مرحلة المشروع:</span>
              {[
                { id: "all", label: "الجميع" },
                { id: "design", label: "🎨 التصميم" },
                { id: "execution", label: "🏗️ التنفيذ والموقع" },
                { id: "technical-office", label: "📐 المكتب الفني والكميات" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStage(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    activeStage === st.id ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text" placeholder="بحث باسم الأداة أو الوصف..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Form: Order Custom Tool */}
        {activeTab === "order-custom" && (
          <div className="max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-cyan-400" />
              <span>اطلب أداتك البرمجية الخاصة</span>
            </h2>
            <p className="text-slate-400 text-xs mb-6">سيتم إرسال المواصفات مباشرة لوحة التحكم والبريد الإلكتروني للتحكم والتطوير الفوري.</p>

            {orderSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="h-5 w-5" />
                <span>تم إرسال طلبك بنجاح ونقله إلى لوحة الإدارة!</span>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل</label>
                <input 
                  type="text" required placeholder="مثال: م. أحمد الهندسية" 
                  value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" required placeholder="name@example.com" 
                    value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف / الواتساب</label>
                  <input 
                    type="tel" required placeholder="+967..." 
                    value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">تفاصيل وشرح الأداة المطلوب برمجة حل لها</label>
                <textarea 
                  rows="4" required placeholder="اشرح المعادلات أو البرومبت أو الإضافة المطلوبة لبرمجتها..."
                  value={orderForm.details} onChange={e => setOrderForm({...orderForm, details: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:border-cyan-500 focus:outline-none"
                ></textarea>
              </div>

              <button 
                type="submit" disabled={isSubmittingOrder}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all text-xs"
              >
                {isSubmittingOrder ? "جاري الإرسال..." : "إرسال الطلب وإشعار الإدارة فوراً"}
              </button>
            </form>
          </div>
        )}

        {/* Calculators F */}
        {activeTab === "quick-calculators" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-cyan-400" />
              <span>الحاسبات الهندسية الذكية أونلاين</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "🏗️ الهندسة المدنية والإنشائية", items: ["حاسبة كميات الخرسانة المسلحة", "حاسبة أوزان حديد التسليح", "حاسبة الأحمال والكمرات", "حاسبة القواعد والأساسات"] },
                { title: "⚡ الهندسة الكهربائية", items: ["حاسبة الأحمال والقدرة الكهربائية", "حاسبة هبوط الجهد (Voltage Drop)", "حاسبة مقاطع الكابلات والقواطع", "حاسبة معامل القدرة (Power Factor)"] },
                { title: "⚙️ الهندسة الميكانيكية", items: ["حاسبات معدل التدفق والضغط", "حاسبة قدرة المضخات والأنابيب", "حاسبة أحمال التكييف والتهوية HVAC"] },
                { title: "🏛️ الهندسة المعمارية والكميات", items: ["حاسبة النسب والمساحات", "حاسبة الإضاءة المعمارية", "حاسبة تشطيبات المبانى والمحارة"] }
              ].map((cat, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md hover:border-slate-700 transition-all">
                  <h3 className="font-bold text-sm text-cyan-400 mb-3">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.items.map((it, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Assistant G */}
        {activeTab === "ai-engineer" && (
          <div className="max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-7 w-7 text-cyan-400 animate-pulse" />
                <div>
                  <h2 className="text-lg font-bold text-white">مساعد المهندس الذكي AI</h2>
                  <p className="text-xs text-slate-400">تحليل هندسي مباشر واستشارات الكود وتدقيق الحسابات</p>
                </div>
              </div>

              <select 
                value={aiSpecialization} onChange={(e) => setAiSpecialization(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold px-3 py-2 rounded-xl focus:outline-none"
              >
                <option value="🤖 مهندس مدني">🤖 مهندس مدني</option>
                <option value="🤖 مهندس معماري">🤖 مهندس معماري</option>
                <option value="🤖 مهندس كهربائي">🤖 مهندس كهربائي</option>
                <option value="🤖 مهندس ميكانيكي">🤖 مهندس ميكانيكي</option>
                <option value="🤖 إدارة مشاريع">🤖 إدارة مشاريع</option>
              </select>
            </div>

            <div className="min-h-[260px] max-h-[360px] overflow-y-auto space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 mb-4">
              {aiChatHistory.length === 0 ? (
                <div className="text-center text-slate-500 text-xs py-16">
                  اسأل المساعد الذكي، مثال: "ما هي صيغة حساب نسبة التسليح الدنيا لعمود خرساني مقاس 30×60 سم؟"
                </div>
              ) : (
                aiChatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] text-xs p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
                        : "bg-slate-800/90 text-slate-200 border border-slate-700/80"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAiAsk} className="flex gap-2">
              <input 
                type="text" placeholder="اكتب استفسارك الهندسي هنا..." 
                value={aiQuery} onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" disabled={isAiLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all">
                {isAiLoading ? "جاري التحليل..." : "إرسال الاستفسار"}
              </button>
            </form>
          </div>
        )}

        {/* Converter H */}
        {activeTab === "file-converter" && (
          <div className="max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-emerald-400" />
              <span>محول الملفات والوحدات الهندسي</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-emerald-400 mb-2">🔄 تحويل الصيغ والملفات</h3>
                <p className="text-[11px] text-slate-400 mb-3">تحويل CAD / DWG / DXF إلى PDF أو Excel</p>
                <div className="border-2 border-dashed border-slate-800 p-6 text-center rounded-xl hover:border-emerald-500/50 cursor-pointer transition-all">
                  <Upload className="h-6 w-6 text-slate-500 mx-auto mb-2" />
                  <span className="text-xs text-slate-400">اختر ملف DWG أو PDF للتحويل</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400">📏 محول الوحدات المباشر</h3>
                <select value={unitCategory} onChange={e => setUnitCategory(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-xl">
                  <option value="length">الطول (متر ↔ قدم)</option>
                  <option value="area">المساحة (م² ↔ قدم²)</option>
                  <option value="volume">الحجم (م³ ↔ لتر)</option>
                </select>
                <input 
                  type="number" value={unitValue} onChange={e => setUnitValue(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-xl"
                />
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">النتيجة: </span>
                  <span className="text-sm font-bold text-emerald-400">{(unitValue * 3.28084).toFixed(2)} قدم</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Tools Grid */}
        {activeTab !== "order-custom" && activeTab !== "ai-engineer" && activeTab !== "file-converter" && activeTab !== "quick-calculators" && (
          isLoading ? (
            <div className="text-center py-20 text-slate-500 text-xs">جاري جلب البرمجيات المحدثة...</div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xs bg-slate-900/30 rounded-3xl border border-slate-800">لا توجد برمجيات حالياً في هذا التصنيف. يمكنك إضافتها من لوحة تحكم الأدمن.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 hover:shadow-xl hover:shadow-cyan-500/5 transition-all group backdrop-blur-md relative overflow-hidden">
                  
                  {/* Top Glow Accent */}
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${
                        tool.badge === "Pro" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                        tool.badge === "تجريبية" ? "bg-purple-500/10 text-purple-400 border-purple-500/30" :
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}>
                        {tool.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{tool.aiPlatform || "المنصة"}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors leading-snug">{tool.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-3 mb-6 leading-relaxed">{tool.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    {tool.category === "prompt-engineering" ? (
                      <button 
                        onClick={() => { setActivePromptModal(tool); generatePromptResult(tool); }}
                        className="w-full bg-slate-800/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700/50"
                      >
                        <MessageSquare className="h-4 w-4 text-cyan-400" />
                        <span>جرب البرومبت الآن</span>
                      </button>
                    ) : tool.category === "live-web-apps" ? (
                      <button 
                        onClick={() => { setActiveAppModal(tool); calculateColumnCapacity(); }}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                      >
                        <Wrench className="h-4 w-4" />
                        <span>تشغيل الحاسبة التفاعلية</span>
                      </button>
                    ) : (
                      <button className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 font-bold py-2.5 rounded-xl text-xs transition-all border border-slate-700/50 flex items-center justify-center gap-1">
                        <span>تشغيل / استخدام الأداة</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Prompt Modal */}
        {activePromptModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 rtl" dir="rtl">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">{activePromptModal.title}</h3>
              <p className="text-xs text-slate-400">{activePromptModal.description}</p>

              <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <label className="block text-xs text-slate-300 font-bold">تعبئة المتغيرات:</label>
                <input 
                  type="number" placeholder="المساحة بالمتر المربع (input_area)" value={promptValues.input_area}
                  onChange={e => setPromptValues({...promptValues, input_area: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded-xl focus:outline-none focus:border-cyan-500"
                />
                <input 
                  type="number" placeholder="الميزانية بالدولار (input_price)" value={promptValues.input_price}
                  onChange={e => setPromptValues({...promptValues, input_price: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded-xl focus:outline-none focus:border-cyan-500"
                />
                <button onClick={() => generatePromptResult(activePromptModal)} className="w-full bg-cyan-600 text-white text-xs font-bold py-2.5 rounded-xl">توليد البرومبت</button>
              </div>

              {generatedPrompt && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-cyan-400 font-bold">الأمر المولد المباشر:</span>
                    <button onClick={() => copyToClipboard(generatedPrompt)} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
                      <Copy className="h-3 w-3"/> {copied ? "تم النسخ!" : "نسخ البرومبت"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed">{generatedPrompt}</p>
                </div>
              )}

              <button onClick={() => setActivePromptModal(null)} className="w-full bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs">إغلاق</button>
            </div>
          </div>
        )}

        {/* Live App Modal */}
        {activeAppModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 rtl" dir="rtl">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">{activeAppModal.title}</h3>

              <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عرض العمود (mm)</label>
                  <input type="number" value={calcInputs.b} onChange={e => setCalcInputs({...calcInputs, b: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عمق العمود (mm)</label>
                  <input type="number" value={calcInputs.h} onChange={e => setCalcInputs({...calcInputs, h: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">خرسانة fc' (MPa)</label>
                  <input type="number" value={calcInputs.fc} onChange={e => setCalcInputs({...calcInputs, fc: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">حديد fy (MPa)</label>
                  <input type="number" value={calcInputs.fy} onChange={e => setCalcInputs({...calcInputs, fy: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl focus:outline-none" />
                </div>
              </div>

              <button onClick={calculateColumnCapacity} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-2.5 rounded-xl text-xs">احسب التحمل الآن</button>

              {calcResult && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">الحمولة القصوى المسموحة للعمود:</span>
                  <span className="text-2xl font-black text-white">{calcResult} kN</span>
                </div>
              )}

              <button onClick={() => setActiveAppModal(null)} className="w-full bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs">إغلاق</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}