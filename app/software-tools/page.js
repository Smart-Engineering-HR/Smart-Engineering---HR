"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, ArrowRight, Search, Copy, Download, HelpCircle, Upload, Sliders, CheckCircle2, MessageSquare, RefreshCw, Calculator, Wrench, Play, Send, Zap, FileText, Activity
} from "lucide-react";

export default function SoftwareToolsPublic() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeStage, setActiveStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptValues, setPromptValues] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const [activeAppModal, setActiveAppModal] = useState(null);
  const [dynamicInputs, setDynamicInputs] = useState({});
  const [calcResult, setCalcResult] = useState(null);

  // Order Custom Tool
  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // AI Assistant Chat
  const [aiSpecialization, setAiSpecialization] = useState("🤖 مساعد مهندس مدني");
  const [aiQuery, setAiQuery] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Unit & File Converter
  const [unitCategory, setUnitCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [inputValue, setInputValue] = useState(10);
  const [convertedValue, setConvertedValue] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileConverting, setFileConverting] = useState(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);

  // Management & Control EVM State
  const [evmInputs, setEvmInputs] = useState({ PV: 100000, EV: 85000, AC: 90000 });
  const [evmResults, setEvmResults] = useState(null);

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

  // Unit Converter Logic
  useEffect(() => {
    let val = parseFloat(inputValue) || 0;
    let res = 0;

    if (unitCategory === "length") {
      let meters = val;
      if (fromUnit === "ft") meters = val * 0.3048;
      if (fromUnit === "in") meters = val * 0.0254;
      if (fromUnit === "mm") meters = val / 1000;

      if (toUnit === "m") res = meters;
      if (toUnit === "ft") res = meters / 0.3048;
      if (toUnit === "in") res = meters / 0.0254;
      if (toUnit === "mm") res = meters * 1000;
    } else if (unitCategory === "area") {
      let sqMeters = val;
      if (fromUnit === "sqft") sqMeters = val * 0.092903;
      if (toUnit === "sqm") res = sqMeters;
      if (toUnit === "sqft") res = sqMeters / 0.092903;
    } else if (unitCategory === "pressure") {
      let mpa = val;
      if (fromUnit === "bar") mpa = val * 0.1;
      if (fromUnit === "psi") mpa = val * 0.00689476;

      if (toUnit === "mpa") res = mpa;
      if (toUnit === "bar") res = mpa * 10;
      if (toUnit === "psi") res = mpa / 0.00689476;
    } else {
      res = val * 1;
    }
    setConvertedValue(res.toFixed(3));
  }, [inputValue, fromUnit, toUnit, unitCategory]);

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
    const currentQuery = aiQuery;
    setAiQuery("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/software-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ai_engineer_chat", specialization: aiSpecialization, prompt: currentQuery }),
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

  // Dynamic Prompt Engineering Generator
  const openPromptModal = (tool) => {
    setActivePromptModal(tool);
    const initialVals = {};
    const placeholders = tool.placeholders && tool.placeholders.length > 0 
      ? tool.placeholders 
      : (tool.secretPrompt.match(/\[(.*?)\]/g) || []).map(p => p.replace(/[\[\]]/g, ""));

    placeholders.forEach(p => initialVals[p] = "");
    setPromptValues(initialVals);
    setGeneratedPrompt(tool.secretPrompt || "");
  };

  const handlePromptInputChange = (key, value) => {
    const updated = { ...promptValues, [key]: value };
    setPromptValues(updated);

    let result = activePromptModal.secretPrompt || "";
    Object.keys(updated).forEach(k => {
      result = result.replaceAll(`[${k}]`, updated[k] || `[${k}]`);
    });
    setGeneratedPrompt(result);
  };

  // Dynamic Calculation Engine for Live Web Apps & Calculators
  const openAppModal = (tool) => {
    setActiveAppModal(tool);
    let parsedVars = [];
    if (tool.variables) {
      try {
        parsedVars = typeof tool.variables === "string" ? JSON.parse(tool.variables) : tool.variables;
      } catch (e) {
        parsedVars = [];
      }
    }
    
    if (!Array.isArray(parsedVars) || parsedVars.length === 0) {
      parsedVars = [
        { name: "b", label: "عرض القطاع (mm)", default: 300 },
        { name: "h", label: "عمق القطاع (mm)", default: 600 },
        { name: "fc", label: "إجهاد الخرسانة (MPa)", default: 30 },
        { name: "fy", label: "إجهاد حديد التسليح (MPa)", default: 420 }
      ];
    }

    const initVals = {};
    parsedVars.forEach(v => { initVals[v.name] = v.default; });
    setDynamicInputs(initVals);
    calculateDynamicResult(tool.logic, initVals);
  };

  const calculateDynamicResult = (logicFormula, inputs) => {
    try {
      if (!logicFormula) {
        // Default Column Formula
        const { b, h, fc, fy } = inputs;
        const res = (((0.85 * (fc || 30) * ((b || 300) * (h || 600))) + (0.01 * ((b || 300) * (h || 600)) * (fy || 420))) / 1000).toFixed(2);
        setCalcResult(res + " kN");
        return;
      }

      const keys = Object.keys(inputs);
      const vals = Object.values(inputs).map(Number);
      const evalFunc = new Function(...keys, `return ${logicFormula};`);
      const res = evalFunc(...vals);
      setCalcResult(typeof res === "number" ? res.toFixed(2) : res);
    } catch (err) {
      setCalcResult("خطأ في صيغة الحساب");
    }
  };

  const handleCalculateEVM = () => {
    const { PV, EV, AC } = evmInputs;
    const CV = EV - AC;
    const SV = EV - PV;
    const CPI = (EV / (AC || 1)).toFixed(2);
    const SPI = (EV / (PV || 1)).toFixed(2);

    let status = "المشروع يسير بحالة ممتازة";
    if (CPI < 1) status = "تجاوز في الميزانية (Cost Overrun)";
    if (SPI < 1) status += " - تأخير في الجدول الزمني (Behind Schedule)";

    setEvmResults({ CV, SV, CPI, SPI, status });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileConverting(true);
      setTimeout(() => {
        setFileConverting(false);
        setConvertedFileUrl("#");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl relative" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3.5 rounded-2xl shadow-xl">
              <Cpu className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">منصة الهندسة الذكية والموارد البشرية</h1>
              <p className="text-slate-400 text-xs mt-1 font-medium">دليل البرمجيات الذكية، الحاسبات، والوكلاء التفاعليين للجمهور</p>
            </div>
          </div>
          
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-6 py-3 rounded-xl border border-slate-700 transition-all text-sm">
            <span>الرئيسية</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        {/* Navigation Tabs (A through H) */}
        <nav className="mb-6 bg-slate-900 border border-slate-800 p-2 rounded-2xl overflow-x-auto flex gap-2">
          {[
            { id: "all", label: "🌐 كل الأدوات والبرمجيات" },
            { id: "prompt-engineering", label: "A. هندسة الأوامر" },
            { id: "live-web-apps", label: "B. تطبيقات الويب الحية" },
            { id: "automation-software", label: "C. برمجيات الأتمتة" },
            { id: "ai-solutions", label: "D. حلول الذكاء الاصطناعي" },
            { id: "management-control", label: "E. الإدارة والتحكم" },
            { id: "quick-calculators", label: "F. الحاسبات الذكية Online" },
            { id: "ai-engineer", label: "G. المهندس الذكي AI" },
            { id: "file-converter", label: "H. محول الملفات والوحدات" },
            { id: "order-custom", label: "📥 اطلب أداتك الخاصة" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Search and Stage Filter */}
        {activeTab !== "order-custom" && activeTab !== "ai-engineer" && activeTab !== "file-converter" && activeTab !== "quick-calculators" && activeTab !== "management-control" && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Sliders className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-300">مرحلة المشروع:</span>
              {[
                { id: "all", label: "جميع المراحل" },
                { id: "design", label: "أدوات مرحلة التصميم" },
                { id: "execution", label: "أدوات التنفيذ والموقع" },
                { id: "technical-office", label: "المكتب الفني والحصر" },
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

        {/* TAB E: Management & Control Section */}
        {activeTab === "management-control" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Activity className="h-6 w-6 text-emerald-400" />
                <span>E. حاسبة لوحة التحكم وإدارة المشاريع (EVM Analysis)</span>
              </h2>
              <p className="text-slate-400 text-xs mb-6">تحليل إدارة القيمة المكتسبة للمشروع لحساب الأداء الزمني والمالي فورياً.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">القيمة المخططة (PV)</label>
                  <input 
                    type="number" value={evmInputs.PV} onChange={e => setEvmInputs({...evmInputs, PV: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">القيمة المكتسبة (EV)</label>
                  <input 
                    type="number" value={evmInputs.EV} onChange={e => setEvmInputs({...evmInputs, EV: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">التكلفة الفعلية (AC)</label>
                  <input 
                    type="number" value={evmInputs.AC} onChange={e => setEvmInputs({...evmInputs, AC: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              <button onClick={handleCalculateEVM} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-all mb-6">
                حساب مؤشرات أداء المشروع الحالية
              </button>

              {evmResults && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">انحراف التكلفة (CV)</span>
                    <span className={`text-base font-bold ${evmResults.CV >= 0 ? "text-emerald-400" : "text-red-400"}`}>{evmResults.CV}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">انحراف الجدول (SV)</span>
                    <span className={`text-base font-bold ${evmResults.SV >= 0 ? "text-emerald-400" : "text-red-400"}`}>{evmResults.SV}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">مؤشر التكلفة (CPI)</span>
                    <span className="text-base font-bold text-cyan-400">{evmResults.CPI}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">مؤشر الجدول (SPI)</span>
                    <span className="text-base font-bold text-cyan-400">{evmResults.SPI}</span>
                  </div>
                  <div className="col-span-2 md:col-span-4 mt-2 p-2 bg-slate-900 rounded-xl text-xs text-amber-300 font-bold text-center border border-amber-500/20">
                    التقييم: {evmResults.status}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB F: Quick Calculators Section */}
        {activeTab === "quick-calculators" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-cyan-400" />
              <span>F. الحاسبات الهندسية الذكية التفاعلية أونلاين</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "🏗️ الهندسة المدنية والإنشائية", items: ["حاسبة كميات الخرسانة المسلحة", "حاسبة أوزان حديد التسليح", "حاسبة أبعاد الكمرات والأعمدة", "حاسبة قوى القشط والإنحناء", "حاسبة كميات الردم والحفر"] },
                { title: "⚡ الهندسة الكهربائية", items: ["حاسبة هبوط الجهد (Voltage Drop)", "حاسبة مقطع الكابلات والقواطع", "حاسبة الأحمال والقدرة KVA", "حاسبة معامل القدرة Power Factor"] },
                { title: "⚙️ الهندسة الميكانيكية", items: ["حاسبة معدل التدفق والضغط", "حاسبة قدرة المضخات والمحركات", "حاسبة أبعاد مجاري الهواء HVAC"] },
                { title: "🏛️ الهندسة المعمارية", items: ["حاسبة المساحات والنسب البنائية", "حاسبة تصميم السلالم والأدراج", "حاسبة الإضاءة والفتحات المعمارية"] }
              ].map((cat, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <h3 className="font-bold text-sm text-cyan-400 mb-3">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.items.map((it, i) => (
                      <li key={i} onClick={() => openAppModal({ title: it, logic: "(b * h * 0.001)", variables: null })} className="text-xs text-slate-300 flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-850 hover:border-cyan-500/50 cursor-pointer transition-all group">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 group-hover:text-cyan-400" />
                          <span>{it}</span>
                        </span>
                        <Play className="h-3 w-3 text-slate-600 group-hover:text-cyan-400" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB G: AI Engineer Section */}
        {activeTab === "ai-engineer" && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-7 w-7 text-cyan-400 animate-pulse" />
                <div>
                  <h2 className="text-lg font-bold text-white">G. مساعد المهندس الذكي AI</h2>
                  <p className="text-xs text-slate-400">محرك تحليلي واستشارات هندسية سريعة</p>
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

            <div className="min-h-[280px] max-h-[380px] overflow-y-auto space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-850 mb-4">
              {aiChatHistory.length === 0 ? (
                <div className="text-center text-slate-500 text-xs py-16">
                  <Zap className="h-8 w-8 text-cyan-500/40 mx-auto mb-2" />
                  أدخل سؤالك الهندسي مثل: "كيف أحسب كمية التسليح لبلاطة هوردي مساحتها 150 م²؟"
                </div>
              ) : (
                aiChatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] text-xs p-3.5 rounded-2xl leading-relaxed ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200 border border-slate-700"}`}>
                      {msg.text.split("\n").map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAiAsk} className="flex gap-2">
              <input 
                type="text" placeholder="اسأل المهندس الذكي عن الحسابات والمواصفات والأكواد..." 
                value={aiQuery} onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" disabled={isAiLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-1.5 transition-all">
                {isAiLoading ? "جاري التحليل..." : <><span>إرسال</span><Send className="h-3.5 w-3.5"/></>}
              </button>
            </form>
          </div>
        )}

        {/* TAB H: File & Unit Converter Section */}
        {activeTab === "file-converter" && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <RefreshCw className="h-5 w-5 text-emerald-400" />
              <span>H. محول الملفات والوحدات الهندسي الشامل</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Converter */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>تحويل صيغ CAD/DWG و PDF</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4">رفع ملفات DWG, DXF, PDF للتحويل التلقائي واستخراج الجداول</p>
                  
                  <label className="border-2 border-dashed border-slate-800 p-6 text-center rounded-2xl hover:border-emerald-500/50 cursor-pointer block transition-all bg-slate-900/50">
                    <input type="file" accept=".dwg,.dxf,.pdf" onChange={handleFileUpload} className="hidden" />
                    <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-xs text-slate-300 font-bold block">{selectedFile ? selectedFile.name : "اضغط لرفع الملف"}</span>
                    <span className="text-[10px] text-slate-500">دعم صيغ DWG, DXF, PDF</span>
                  </label>
                </div>

                {fileConverting && <div className="text-xs text-cyan-400 font-bold text-center mt-4">جاري المعالجة وتحويل الملف...</div>}
                {convertedFileUrl && !fileConverting && (
                  <a href="#" download className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>تحميل الملف المحوّل جاهز</span>
                  </a>
                )}
              </div>

              {/* Dynamic Unit Converter */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 mb-2">📏 محول الوحدات المباشر</h3>
                
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">نوع الكمية الفيزيائية</label>
                  <select value={unitCategory} onChange={e => { setUnitCategory(e.target.value); if(e.target.value==='area'){setFromUnit('sqm'); setToUnit('sqft');} if(e.target.value==='pressure'){setFromUnit('mpa'); setToUnit('bar');} }} className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-xl">
                    <option value="length">الطول (متر / قدم / بوصة / مم)</option>
                    <option value="area">المساحة (م² / قدم²)</option>
                    <option value="pressure">الضغط والإجهاد (MPa / Bar / PSI)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">من وحدة</label>
                    <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded-xl">
                      {unitCategory === "length" && <><option value="m">متر (m)</option><option value="ft">قدم (ft)</option><option value="in">بوصة (in)</option><option value="mm">مليمتر (mm)</option></>}
                      {unitCategory === "area" && <><option value="sqm">متر مربع (m²)</option><option value="sqft">قدم مربع (sq ft)</option></>}
                      {unitCategory === "pressure" && <><option value="mpa">ميجاباسكال (MPa)</option><option value="bar">بار (Bar)</option><option value="psi">PSI</option></>}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">إلى وحدة</label>
                    <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded-xl">
                      {unitCategory === "length" && <><option value="ft">قدم (ft)</option><option value="m">متر (m)</option><option value="in">بوصة (in)</option><option value="mm">مليمتر (mm)</option></>}
                      {unitCategory === "area" && <><option value="sqft">قدم مربع (sq ft)</option><option value="sqm">متر مربع (m²)</option></>}
                      {unitCategory === "pressure" && <><option value="bar">بار (Bar)</option><option value="mpa">ميجاباسكال (MPa)</option><option value="psi">PSI</option></>}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">القيمة</label>
                  <input 
                    type="number" value={inputValue} onChange={e => setInputValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-xl font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">النتيجة المحولة: </span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{convertedValue} {toUnit}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Tool Request Form */}
        {activeTab === "order-custom" && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>اطلب أداتك البرمجية الخاصة</span>
            </h2>
            <p className="text-slate-400 text-xs mb-6">سيتم إرسال الطلب فوراً للإدارة والبريد الإلكتروني الرسمي للتنفيذ.</p>

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

        {/* Published Tools Grid for Categories A, B, C, D */}
        {activeTab !== "order-custom" && activeTab !== "ai-engineer" && activeTab !== "file-converter" && activeTab !== "quick-calculators" && activeTab !== "management-control" && (
          isLoading ? (
            <div className="text-center py-12 text-slate-500 text-xs">جاري جلب البرمجيات المحدثة...</div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">لا توجد برمجيات حالياً وفق محددات البحث. يمكنك إضافة المزيد من لوحة التحكم.</div>
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
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    {tool.category === "prompt-engineering" ? (
                      <button 
                        onClick={() => openPromptModal(tool)}
                        className="w-full bg-slate-800 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>توليد وتجربة البرومبت</span>
                      </button>
                    ) : tool.category === "live-web-apps" ? (
                      <button 
                        onClick={() => openAppModal(tool)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Wrench className="h-4 w-4" />
                        <span>تشغيل الحاسبة والتطبيق الحاضر</span>
                      </button>
                    ) : tool.category === "automation-software" ? (
                      <button 
                        onClick={() => alert(`جاري تنزيل وتفعيل سكربت الأتمتة: ${tool.title}`)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>تشغيل / تنزيل السكربت</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setActiveTab("ai-engineer"); setAiQuery(`استفسار بخصوص ${tool.title}: `); }}
                        className="w-full bg-slate-800 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Cpu className="h-4 w-4" />
                        <span>تشغيل حل الذكاء الاصطناعي</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Modal: Dynamic Prompt Engineering Modal */}
        {activePromptModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 rtl" dir="rtl">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4">
              <h3 className="text-base font-bold text-white">{activePromptModal.title}</h3>
              <p className="text-xs text-slate-400">{activePromptModal.description}</p>

              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <label className="block text-xs text-slate-300 font-bold">تخصيص مدخلات البرومبت:</label>
                {Object.keys(promptValues).length === 0 ? (
                  <p className="text-[11px] text-slate-500">لا توجد حقول متغيرة محددة، سيتم استخدام البرومبت مباشرة.</p>
                ) : (
                  Object.keys(promptValues).map((key) => (
                    <div key={key}>
                      <label className="text-[10px] text-slate-400 block mb-1">{key}</label>
                      <input 
                        type="text" 
                        placeholder={`أدخل قيمة ${key}`}
                        value={promptValues[key]}
                        onChange={e => handlePromptInputChange(key, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded-xl"
                      />
                    </div>
                  ))
                )}
              </div>

              {generatedPrompt && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-cyan-400 font-bold">البرومبت النهائي المولد:</span>
                    <button onClick={() => navigator.clipboard.writeText(generatedPrompt)} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
                      <Copy className="h-3 w-3"/> نسخ النص
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">{generatedPrompt}</p>
                </div>
              )}

              <button onClick={() => setActivePromptModal(null)} className="w-full bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs">إغلاق</button>
            </div>
          </div>
        )}

        {/* Modal: Dynamic Calculator / Web App Modal */}
        {activeAppModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 rtl" dir="rtl">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4">
              <h3 className="text-base font-bold text-white">{activeAppModal.title}</h3>

              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                {Object.keys(dynamicInputs).map((varName) => (
                  <div key={varName}>
                    <label className="text-[11px] text-slate-400 block mb-1">{varName}</label>
                    <input 
                      type="number" 
                      value={dynamicInputs[varName]} 
                      onChange={e => {
                        const updated = { ...dynamicInputs, [varName]: Number(e.target.value) };
                        setDynamicInputs(updated);
                        calculateDynamicResult(activeAppModal.logic, updated);
                      }} 
                      className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-xl font-mono" 
                    />
                  </div>
                ))}
              </div>

              {calcResult !== null && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">النتيجة الإنشائية / الحسابية المباشرة:</span>
                  <span className="text-2xl font-black text-white font-mono">{calcResult}</span>
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