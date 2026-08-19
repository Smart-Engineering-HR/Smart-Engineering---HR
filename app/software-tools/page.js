"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, ArrowRight, Search, Copy, Download, HelpCircle, Upload, Sliders, CheckCircle2, MessageSquare, RefreshCw, Calculator, Wrench, Play 
} from "lucide-react";

export default function SoftwareToolsPublic() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeStage, setActiveStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptValues, setPromptValues] = useState({ input_area: "", input_price: "" });
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const [activeAppModal, setActiveAppModal] = useState(null);
  const [calcInputs, setCalcInputs] = useState({ b: 300, h: 600, fc: 30, fy: 420 });
  const [calcResult, setCalcResult] = useState(null);

  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const [aiSpecialization, setAiSpecialization] = useState("🤖 مساعد مهندس مدني");
  const [aiQuery, setAiQuery] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

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
      console.error("فشل جلب البيانات:", err);
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
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStage && matchesSearch;
  });

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("الرجاء تعبئة كافة الحقول المطلوب إدخالها.");
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
      alert("تعذر الاتصال بالخادم إرسال الطلب.");
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl relative" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3.5 rounded-2xl shadow-xl">
              <Cpu className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">منصة الهندسة الذكية والموارد البشرية</h1>
              <p className="text-slate-400 text-xs mt-1 font-medium">دليل وحاسبات والوكلاء الذكيين لـ قائمة البرمجيات والأدوات</p>
            </div>
          </div>
          
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-6 py-3 rounded-xl border border-slate-700 transition-all text-sm">
            <span>الرئيسية</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <nav className="mb-6 bg-slate-900 border border-slate-800 p-2 rounded-2xl overflow-x-auto flex gap-2">
          {[
            { id: "all", label: "كل البرمجيات والأدوات" },
            { id: "prompt-engineering", label: "A. هندسة الأوامر" },
            { id: "live-web-apps", label: "B. تطبيقات الويب الحية" },
            { id: "automation-software", label: "C. برمجيات الأتمتة" },
            { id: "ai-solutions", label: "D. حلول الذكاء الاصطناعي" },
            { id: "management-control", label: "E. الإدارة والتحكم" },
            { id: "quick-calculators", label: "F. الحاسبات الذكية Online" },
            { id: "ai-engineer", label: "G. المهندس الذكي AI" },
            { id: "file-converter", label: "H. محول الملفات والوحدات" },
            { id: "order-custom", label: "📥 اطلب أداتك البرمجية الخاصة" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab !== "order-custom" && activeTab !== "ai-engineer" && activeTab !== "file-converter" && activeTab !== "quick-calculators" && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-300">مرحلة المشروع:</span>
              {[
                { id: "all", label: "جميع المراحل" },
                { id: "design", label: "أدوات مرحلة التصميم" },
                { id: "execution", label: "أدوات التنفيذ والموقع" },
                { id: "technical-office", label: "أدوات المكتب الفني (حصر وكميات)" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStage(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    activeStage === st.id ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text" placeholder="بحث عن أداة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === "order-custom" && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>اطلب أداتك البرمجية الخاصة</span>
            </h2>
            <p className="text-slate-400 text-xs mb-6">سيتم إرسال الطلب فوراً للإدارة والإيميلات الرسمية المعنية للتحكم والتنفيذ.</p>

            {orderSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="h-5 w-5" />
                <span>تم إرسال طلبك بنجاح وتحويل الإشعارات للبريد الإلكتروني للإدارة!</span>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل</label>
                <input 
                  type="text" required placeholder="مثال: م. أحمد الهندسية" 
                  value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" required placeholder="name@example.com" 
                    value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف / الواتساب</label>
                  <input 
                    type="tel" required placeholder="+967..." 
                    value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">شرح وتفاصيل الأداة</label>
                <textarea 
                  rows="5" required placeholder="اشرح بالتفصيل الوظيفة أو المعادلة الإنشائية أو السكربت المطلوب..."
                  value={orderForm.details} onChange={e => setOrderForm({...orderForm, details: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs"
                ></textarea>
              </div>

              <button 
                type="submit" disabled={isSubmittingOrder}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs"
              >
                {isSubmittingOrder ? "جاري الإرسال..." : "إرسال الطلب وإشعار الإدارة فوراً"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "quick-calculators" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-cyan-400" />
              <span>الحاسبات الهندسية الذكية أونلاين</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "🏗️ الهندسة المدنية", items: ["حاسبة كميات الخرسانة", "حاسبة حديد التسليح", "حاسبة الأحمال والكمرات", "حاسبة الأساسات والأعمدة", "حاسبة الطرق والمساحة"] },
                { title: "⚡ الهندسة الكهربائية", items: ["حاسبة الأحمال الكهربائية", "حاسبة التيار وهبوط الجهد", "حاسبة مقطع الكابل والقواطع", "حاسبة القدرة ومعامل القدرة"] },
                { title: "⚙️ الهندسة الميكانيكية", items: ["حاسبات الضغط والتدفق", "حاسبة المضخات والأنابيب", "حاسبات القدرة وتحويل الطاقة"] },
                { title: "🏛️ الهندسة المعمارية", items: ["حاسبة المساحات والنسب", "حاسبة الإضاءة والسلالم", "حاسبة أبعاد الأبواب والنوافذ"] }
              ].map((cat, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <h3 className="font-bold text-sm text-cyan-400 mb-3">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.items.map((it, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ai-engineer" && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-7 w-7 text-cyan-400 animate-pulse" />
                <div>
                  <h2 className="text-lg font-bold text-white">مساعد المهندس الذكي AI</h2>
                  <p className="text-xs text-slate-400">تحليل فني للمخططات واستخراج الكميات</p>
                </div>
              </div>

              <select 
                value={aiSpecialization} onChange={(e) => setAiSpecialization(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold px-3 py-2 rounded-xl"
              >
                <option value="🤖 مساعد مهندس مدني">🤖 مساعد مهندس مدني</option>
                <option value="🤖 مساعد معماري">🤖 مساعد معماري</option>
                <option value="🤖 مساعد كهربائي">🤖 مساعد كهربائي</option>
                <option value="🤖 مساعد ميكانيكي">🤖 مساعد ميكانيكي</option>
                <option value="🤖 مساعد إدارة مشاريع">🤖 مساعد إدارة مشاريع</option>
                <option value="🤖 مساعد BIM">🤖 مساعد BIM</option>
                <option value="🤖 مساعد مسّاح">🤖 مساعد مسّاح</option>
              </select>
            </div>

            <div className="min-h-[250px] max-h-[350px] overflow-y-auto space-y-3 p-3 bg-slate-950 rounded-2xl border border-slate-850 mb-4">
              {aiChatHistory.length === 0 ? (
                <div className="text-center text-slate-500 text-xs py-12">أدخل سؤالك التخصصي مثل: "أريد حساب كمية الخرسانة لبلاطة مساحتها 120 م² وسماكتها 15 سم"</div>
              ) : (
                aiChatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] text-xs p-3.5 rounded-2xl ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200 border border-slate-700"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAiAsk} className="flex gap-2">
              <input 
                type="text" placeholder="اسأل المهندس الذكي عن الحسابات والمخططات..." 
                value={aiQuery} onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
              />
              <button type="submit" disabled={isAiLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-3 rounded-xl text-xs">
                {isAiLoading ? "جاري التحليل..." : "إرسال"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "file-converter" && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-emerald-400" />
              <span>محول الملفات والوحدات الهندسي الشامل</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <h3 className="text-xs font-bold text-emerald-400 mb-2">🔄 تحويل الصيغ والملفات</h3>
                <p className="text-[11px] text-slate-400 mb-3">دعم تحويل CAD/BIM و DWG/DXF إلى PDF أو Excel/CSV</p>
                <div className="border-2 border-dashed border-slate-800 p-6 text-center rounded-xl hover:border-emerald-500/50 cursor-pointer">
                  <Upload className="h-6 w-6 text-slate-500 mx-auto mb-2" />
                  <span className="text-xs text-slate-400">اختر ملف DWG أو PDF للتحويل</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400">📏 محول الوحدات المباشر</h3>
                <select value={unitCategory} onChange={e => setUnitCategory(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-xl">
                  <option value="length">الطول (متر / قدم / بوصة)</option>
                  <option value="area">المساحة (م² / قدم²)</option>
                  <option value="volume">الحجم (م³ / لتر)</option>
                  <option value="pressure">الضغط (Bar / Mpa / PSI)</option>
                </select>
                <input 
                  type="number" value={unitValue} onChange={e => setUnitValue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-xl"
                />
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">النتيجة المحولة: </span>
                  <span className="text-sm font-bold text-emerald-400">{(unitValue * 3.28084).toFixed(2)} قدم</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "order-custom" && activeTab !== "ai-engineer" && activeTab !== "file-converter" && activeTab !== "quick-calculators" && (
          isLoading ? (
            <div className="text-center py-12 text-slate-500 text-xs">جاري جلب البرمجيات المحدثة...</div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">لا توجد برمجيات حالياً وفق محددات البحث.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group relative">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded font-bold border ${
                        tool.badge === "Pro" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        tool.badge === "تجريبية" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {tool.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{tool.aiPlatform}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{tool.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-3 mb-6 leading-relaxed">{tool.description}</p>
                    
                    <div className="mb-4 p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5"><Play className="h-3.5 w-3.5 text-cyan-400" /> معاينة سريعة لكيفية العمل</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-300">محاكاة AI</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    {tool.category === "prompt-engineering" ? (
                      <button 
                        onClick={() => { setActivePromptModal(tool); generatePromptResult(tool); }}
                        className="w-full bg-slate-800 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>جرب البرومبت الآن</span>
                      </button>
                    ) : tool.category === "live-web-apps" ? (
                      <button 
                        onClick={() => { setActiveAppModal(tool); calculateColumnCapacity(); }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Wrench className="h-4 w-4" />
                        <span>تشغيل الحاسبة التفاعلية</span>
                      </button>
                    ) : (
                      <button className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold py-2.5 rounded-xl text-xs transition-colors">
                        تحميل واستخدام الأداة ↗
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activePromptModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 rtl" dir="rtl">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4">
              <h3 className="text-base font-bold text-white">{activePromptModal.title}</h3>
              <p className="text-xs text-slate-400">{activePromptModal.description}</p>

              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <label className="block text-xs text-slate-300 font-bold">الحقول المحددة:</label>
                <input 
                  type="number" placeholder="المساحة (input_area)" value={promptValues.input_area}
                  onChange={e => setPromptValues({...promptValues, input_area: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded-xl"
                />
                <input 
                  type="number" placeholder="الميزانية (input_price)" value={promptValues.input_price}
                  onChange={e => setPromptValues({...promptValues, input_price: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded-xl"
                />
                <button onClick={() => generatePromptResult(activePromptModal)} className="w-full bg-cyan-600 text-white text-xs font-bold py-2 rounded-xl">توليد البرومبت الآن</button>
              </div>

              {generatedPrompt && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-cyan-400 font-bold">البرومبت الاحترافي المولد:</span>
                    <button onClick={() => navigator.clipboard.writeText(generatedPrompt)} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"><Copy className="h-3 w-3"/> نسخ</button>
                  </div>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed">{generatedPrompt}</p>
                </div>
              )}

              <button onClick={() => setActivePromptModal(null)} className="w-full bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs">إغلاق</button>
            </div>
          </div>
        )}

        {activeAppModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 rtl" dir="rtl">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4">
              <h3 className="text-base font-bold text-white">{activeAppModal.title}</h3>

              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عرض العمود (mm)</label>
                  <input type="number" value={calcInputs.b} onChange={e => setCalcInputs({...calcInputs, b: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عمق العمود (mm)</label>
                  <input type="number" value={calcInputs.h} onChange={e => setCalcInputs({...calcInputs, h: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">خرسانة fc' (MPa)</label>
                  <input type="number" value={calcInputs.fc} onChange={e => setCalcInputs({...calcInputs, fc: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">حديد fy (MPa)</label>
                  <input type="number" value={calcInputs.fy} onChange={e => setCalcInputs({...calcInputs, fy: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl" />
                </div>
              </div>

              <button onClick={calculateColumnCapacity} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs">احسب قوة التحمل الآن</button>

              {calcResult && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">نتيجة التحمل الاسمية القصوى:</span>
                  <span className="text-xl font-black text-white">{calcResult} kN</span>
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