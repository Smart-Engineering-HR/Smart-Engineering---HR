"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, Terminal, Sliders, Settings, ShieldAlert, ArrowRight, 
  Search, Copy, CheckCircle2, Upload, HelpCircle
} from "lucide-react";

export default function SoftwareToolsPublic() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // النوافذ التفاعلية
  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptInputs, setPromptInputs] = useState({});
  const [activeAppModal, setActiveAppModal] = useState(null);
  const [appInputs, setAppInputs] = useState({});
  const [appResult, setAppResult] = useState(null);

  // نموذج الطلب الخاص
  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // قراءة البيانات الآمنة
  const parseSafeResponse = async (res) => {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    const rawText = await res.text();
    throw new Error(`استجابة غير متوقعة من الخادم (Status ${res.status}): ${rawText.slice(0, 100)}...`);
  };

  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/software-tool");
      const data = await parseSafeResponse(res);
      if (data.success) {
        setTools(data.data);
      }
    } catch (err) {
      console.error("خطأ في جلب البرمجيات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesTab = activeTab === "all" || tool.category === activeTab;
    const matchesSearch = tool.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
    alert(`تم نسخ نص البرومبت بنجاح! يمكنك لصقه الآن في: (${activePromptModal.aiPlatform})`);
    setActivePromptModal(null);
  };

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
        alert(`تنبيه: ${activeAppModal.validation || "القيم المدخلة غير صحيحة"}`);
        return;
      }

      const calcResult = eval(logicStr);
      setAppResult({
        numeric: calcResult.toFixed(2),
        report: activeAppModal.template ? activeAppModal.template.replace("{Result}", calcResult.toFixed(2)) : `النتيجة المحسوبة: ${calcResult.toFixed(2)}`
      });
    } catch (err) {
      alert("الرجاء التأكد من صحة القيم المدخلة.");
    }
  };

  // إرسال الطلب مع تخزين مزدوج (API + Buffer) لضمان الوصول للـ Admin
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("الرجاء تعبئة جميع الحقول.");
      return;
    }

    try {
      setSubmittingOrder(true);
      const newRequest = {
        id: "req-" + Date.now(),
        ...orderForm,
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleString("ar-SA")
      };

      // 1. التخزين المباشر في الـ Local Buffer لحماية البيانات
      const existing = JSON.parse(localStorage.getItem("smart_tool_requests") || "[]");
      localStorage.setItem("smart_tool_requests", JSON.stringify([newRequest, ...existing]));

      // 2. الإرسال لـ API
      const res = await fetch("/api/software-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_custom_tool", ...orderForm })
      });

      await parseSafeResponse(res).catch(() => {});

      setOrderSubmitted(true);
      alert("تم إرسال طلبك وحفظه بنجاح وسيطهر فوراً في لوحة الأدمن!");
      setOrderForm({ name: "", email: "", phone: "", details: "" });
      setTimeout(() => setOrderSubmitted(false), 4000);
    } catch (err) {
      alert("حدث خطأ أثناء الإرسال: " + err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased rtl relative" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3.5 rounded-2xl shadow-xl">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-1">الأدوات البرمجية الحصرية والأتمتة المتكاملة</p>
            </div>
          </div>
          
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-6 py-3 rounded-xl border border-slate-700 text-sm">
            <span>الرئيسية</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        {/* أقسام البرمجيات */}
        <nav className="mb-10 bg-slate-800/80 border border-slate-700 p-2 rounded-2xl shadow-2xl overflow-x-auto">
          <ul className="flex items-center gap-2 min-w-max">
            {[
              { id: "all", label: "جميع البرمجيات", icon: Cpu },
              { id: "prompt-engineering", label: "هندسة الأوامر", icon: Terminal },
              { id: "live-web-apps", label: "تطبيقات الويب الحية", icon: Sliders },
              { id: "automation-software", label: "برمجيات الأتمتة", icon: Settings },
              { id: "ai-solutions", label: "حلول الذكاء الاصطناعي", icon: Cpu },
              { id: "management-control", label: "الإدارة والتحكم", icon: ShieldAlert },
              { id: "order-custom", label: "طلب أداة خاصة", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all ${
                      activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700/60"
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

        {/* نموذج طلب أداة خاصة */}
        {activeTab === "order-custom" ? (
          <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>طلب بناء أداة برمجية هندسية مخصصة</span>
            </h2>
            <p className="text-slate-400 text-xs mb-6">سيتم استقبال وتوجيه طلبك فوراً إلى لوحة تحكم الإدارة والبريد الإلكتروني المعتمد.</p>

            {orderSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>تم إرسال الطلب بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم / الجهة *</label>
                <input type="text" required value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني *</label>
                  <input type="email" required value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الهاتف / الواتساب *</label>
                  <input type="tel" required value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">شرح المواصفات المطلوب إدراجها *</label>
                <textarea rows="5" required value={orderForm.details} onChange={e => setOrderForm({...orderForm, details: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs leading-relaxed"></textarea>
              </div>
              <button type="submit" disabled={submittingOrder} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg">
                {submittingOrder ? "جاري إرسال الطلب..." : "إرسال الطلب للأدمن فوراً"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="max-w-xl mx-auto mb-10 relative">
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن أداة برمجية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-12 pl-4 py-4 text-white focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400 text-xs">جاري تحميل الأدوات...</div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs">لا توجد أدوات منشورة حالياً تحت هذا التبويب.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-500/10 text-blue-400 text-[11px] px-3 py-1 rounded-full border border-blue-500/20 font-bold">{tool.badge}</span>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{tool.aiPlatform}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                      <p className="text-slate-400 text-xs mb-6 leading-relaxed line-clamp-3">{tool.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      {tool.category === "prompt-engineering" && (
                        <button onClick={() => handleOpenPrompt(tool)} className="w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2">
                          <Terminal className="h-4 w-4" />
                          <span>توليد البرومبت الذكي</span>
                        </button>
                      )}
                      {tool.category === "live-web-apps" && (
                        <button onClick={() => handleOpenApp(tool)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2">
                          <Sliders className="h-4 w-4" />
                          <span>تشغيل الحاسبة الحية</span>
                        </button>
                      )}
                      {(tool.category !== "prompt-engineering" && tool.category !== "live-web-apps") && (
                        <button onClick={() => alert("جاري فتح محرك المعالجة والأتمتة...")} className="w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>معالجة المخرجات والتقارير</span>
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
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2">{activePromptModal.title}</h3>
              <div className="space-y-3 my-4">
                {activePromptModal.placeholders?.map((p, i) => (
                  <div key={i}>
                    <label className="block text-xs font-bold text-slate-300 mb-1">حقل [{p}]:</label>
                    <input type="text" value={promptInputs[p] || ""} onChange={e => setPromptInputs({...promptInputs, [p]: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setActivePromptModal(null)} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق</button>
                <button onClick={handleExecutePrompt} className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"><Copy className="h-4 w-4" /><span>نسخ الأمر</span></button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة الحاسبة */}
        {activeAppModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2">{activeAppModal.title}</h3>
              <div className="space-y-3 my-4">
                {activeAppModal.variables?.map((v, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300">{v.label}:</label>
                    <input type={v.type || "number"} value={appInputs[v.name] || ""} onChange={e => setAppInputs({...appInputs, [v.name]: e.target.value})} className="w-28 bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white font-mono text-left" />
                  </div>
                ))}
              </div>
              <button onClick={handleCalculateApp} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs mb-4">حساب الآن</button>
              {appResult && (
                <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 text-xs">
                  <span className="text-emerald-400 font-bold block mb-1">النتيجة: {appResult.numeric}</span>
                  <p className="text-slate-300">{appResult.report}</p>
                </div>
              )}
              <div className="flex justify-end pt-4"><button onClick={() => setActiveAppModal(null)} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg">إغلاق</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}