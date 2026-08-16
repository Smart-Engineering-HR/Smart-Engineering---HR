"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Cpu, Settings, Sliders, Search, Copy, Upload, HelpCircle } from "lucide-react";

export default function SoftwareToolsPublic() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptInputs, setPromptInputs] = useState({});
  
  const [activeAppModal, setActiveAppModal] = useState(null);
  const [appInputs, setAppInputs] = useState({});
  const [appResult, setAppResult] = useState(null);

  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/software-tools");
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.success) setTools(data.data);
      } catch (err) {}
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesTab = activeTab === "all" || tool.category === activeTab;
    const matchesSearch = tool.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenPrompt = (tool) => {
    setActivePromptModal(tool);
    const inputs = {};
    tool.placeholders?.forEach((p) => { inputs[p] = ""; });
    setPromptInputs(inputs);
  };

  const handleExecutePrompt = () => {
    let finalPrompt = activePromptModal.secretPrompt;
    Object.keys(promptInputs).forEach((key) => {
      finalPrompt = finalPrompt.replace(`[${key}]`, promptInputs[key]);
    });
    navigator.clipboard.writeText(finalPrompt);
    alert("تم نسخ البرومبت بنجاح إلى الحافظة!");
    setActivePromptModal(null);
  };

  const handleOpenApp = (tool) => {
    setActiveAppModal(tool);
    const inputs = {};
    tool.variables?.forEach((v) => { inputs[v.name] = ""; });
    setAppInputs(inputs);
    setAppResult(null);
  };

  const handleCalculateApp = () => {
    try {
      let logicStr = activeAppModal.logic;
      Object.keys(appInputs).forEach((key) => {
        const val = parseFloat(appInputs[key]) || 0;
        logicStr = logicStr.replaceAll(key, val.toString());
      });
      const calcResult = eval(logicStr);
      setAppResult({
        numeric: calcResult.toFixed(2),
        report: activeAppModal.template ? activeAppModal.template.replace("{Result}", calcResult.toFixed(2)) : `النتيجة: ${calcResult.toFixed(2)}`
      });
    } catch (err) {
      alert("يرجى التأكد من صحة المدخلات الحسابية.");
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("جميع الحقول مطلوبة.");
      return;
    }

    setSubmittingOrder(true);
    const newReq = {
      id: "req-" + Date.now(),
      ...orderForm,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem("smart_tools_custom_requests") || "[]");
      existing.unshift(newReq);
      localStorage.setItem("smart_tools_custom_requests", JSON.stringify(existing));
    } catch (err) {}

    try {
      await fetch("/api/software-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_custom_tool", ...orderForm })
      });
    } catch (err) {}

    setSubmittingOrder(false);
    alert("تم إرسال الطلب بنجاح للإدارة!");
    setOrderForm({ name: "", email: "", phone: "", details: "" });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3.5 rounded-2xl shadow-xl">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-1">بوابة البرمجيات والأدوات الهندسيّة التفاعلية</p>
            </div>
          </div>
          <button onClick={() => window.location.href = "/"} className="bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-6 py-3 rounded-xl border border-slate-700 text-sm">
            العودة إلى القائمة الرئيسية ↗
          </button>
        </header>

        <nav className="mb-10 bg-slate-800/80 border border-slate-700 p-2 rounded-2xl overflow-x-auto">
          <ul className="flex items-center gap-2 min-w-max">
            {[
              { id: "all", label: "كل البرمجيات والأدوات", icon: Cpu },
              { id: "prompt-engineering", label: "هندسة الأوامر الذكية", icon: Terminal },
              { id: "live-web-apps", label: "تطبيقات الويب الحية", icon: Sliders },
              { id: "automation-software", label: "برمجيات الأتمتة المتقدمة", icon: Settings },
              { id: "order-custom", label: "أطلب أداتك الخاصة", icon: HelpCircle },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all ${
                    activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {activeTab === "order-custom" ? (
          <div className="max-w-2xl mx-auto bg-slate-800/90 border border-slate-700 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>طلب بناء وتطوير أداة برمجية مخصصة</span>
            </h2>
            <form onSubmit={handleOrderSubmit} className="space-y-4 mt-6">
              <input type="text" required placeholder="اسم المهندس أو الشركة *" value={orderForm.name} onChange={(e) => setOrderForm({...orderForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="email" required placeholder="البريد الإلكتروني *" value={orderForm.email} onChange={(e) => setOrderForm({...orderForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <input type="tel" required placeholder="رقم الهاتف/الواتساب *" value={orderForm.phone} onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
              </div>
              <textarea rows={5} required placeholder="الشرح والتفاصيل الفنية *" value={orderForm.details} onChange={(e) => setOrderForm({...orderForm, details: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"></textarea>
              <button type="submit" disabled={submittingOrder} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow">
                {submittingOrder ? "جاري الإرسال..." : "إرسال الطلب فورياً للإدارة"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="max-w-xl mx-auto mb-8 relative">
              <Search className="absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="ابحث عن أداة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-11 pl-4 py-3.5 text-xs text-white" />
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">جاري التحميل...</div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">لا توجد أدوات حالياً.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold">{tool.badge}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tool.aiPlatform}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{tool.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">{tool.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-700/60">
                      {tool.category === "prompt-engineering" && (
                        <button onClick={() => handleOpenPrompt(tool)} className="w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                          <Terminal className="h-4 w-4" /><span>توليد البرومبت</span>
                        </button>
                      )}
                      {tool.category === "live-web-apps" && (
                        <button onClick={() => handleOpenApp(tool)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                          <Sliders className="h-4 w-4" /><span>تشغيل الحاسبة الحية</span>
                        </button>
                      )}
                      {(tool.category !== "prompt-engineering" && tool.category !== "live-web-apps") && (
                        <button onClick={() => alert("رفع الملف للمعالجة")} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                          <Upload className="h-4 w-4" /><span>تشغيل الأتمتة</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activePromptModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
              <h3 className="text-base font-bold text-white mb-4">{activePromptModal.title}</h3>
              <div className="space-y-3 mb-6">
                {activePromptModal.placeholders?.map((p, i) => (
                  <div key={i}>
                    <label className="block text-xs font-bold text-slate-300 mb-1">حقل [{p}]:</label>
                    <input type="text" value={promptInputs[p] || ""} onChange={(e) => setPromptInputs({...promptInputs, [p]: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setActivePromptModal(null)} className="px-4 py-2 bg-slate-700 text-xs text-white font-bold rounded-lg">إلغاء</button>
                <button onClick={handleExecutePrompt} className="px-5 py-2 bg-blue-600 text-xs text-white font-bold rounded-lg flex items-center gap-1.5"><Copy className="h-4 w-4" /><span>توليد ونسخ</span></button>
              </div>
            </div>
          </div>
        )}

        {activeAppModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
              <h3 className="text-base font-bold text-white mb-4">{activeAppModal.title}</h3>
              <div className="space-y-3 mb-4">
                {activeAppModal.variables?.map((v, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <label className="text-xs font-bold text-slate-300">{v.label}:</label>
                    <input type="number" value={appInputs[v.name] || ""} onChange={(e) => setAppInputs({...appInputs, [v.name]: e.target.value})} className="w-28 bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white text-left font-mono" />
                  </div>
                ))}
              </div>
              <button onClick={handleCalculateApp} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs mb-4">حساب الآن</button>
              {appResult && (
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-xs text-slate-200">
                  <div className="text-2xl font-black text-emerald-400 font-mono mb-1">{appResult.numeric}</div>
                  <p>{appResult.report}</p>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <button onClick={() => setActiveAppModal(null)} className="px-4 py-2 bg-slate-700 text-xs text-white font-bold rounded-lg">إغلاق</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}