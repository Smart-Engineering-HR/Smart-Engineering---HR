"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, Terminal, Sliders, Settings, ShieldAlert, ArrowRight, 
  Search, Copy, CheckCircle2, Download, HelpCircle,
  FileText, Upload, BarChart2, AlertTriangle, Layers, Grid, FileSpreadsheet, Image as ImageIcon
} from "lucide-react";

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

  const [activeProcessingModal, setActiveProcessingModal] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputType, setOutputType] = useState("all");
  const [processingResult, setProcessingResult] = useState(null);

  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const fetchTools = async () => {
    try {
      const res = await fetch("/api/software-tools");
      const data = await res.json();
      if (data.success) {
        setTools(data.data);
      }
    } catch (err) {
      console.error("فشل جلب البيانات:", err);
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
      finalPrompt = finalPrompt.replaceAll(`[${key}]`, promptInputs[key]);
    });
    navigator.clipboard.writeText(finalPrompt);
    alert(`تم توليد ونسخ نص البرومبت بنجاح! يرجى لصقه في: (${activePromptModal.aiPlatform})`);
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
      let hasInvalid = false;
      Object.keys(appInputs).forEach(key => {
        const val = parseFloat(appInputs[key]) || 0;
        if (val <= 0) hasInvalid = true;
        logicStr = logicStr.replaceAll(key, val);
      });

      if (hasInvalid) {
        alert(`تنبيه: ${activeAppModal.validation || "القيم يجب أن تكون موجبة"}`);
        return;
      }

      const calcResult = Function(`"use strict"; return (${logicStr})`)();
      
      setAppResult({
        numeric: Number(calcResult).toFixed(2),
        report: `بناءً على المعادلات المحددة، فإن القيمة الحسابية تحقق المعايير الهندسية المطلوبة.`
      });
    } catch (err) {
      alert("يرجى التأكد من صحة البيانات المدخلة والمعادلة.");
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("الرجاء تعبئة كافة الحقول المطلوبة.");
      return;
    }

    try {
      const res = await fetch("/api/software-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_custom_tool", ...orderForm })
      });
      const data = await res.json();
      if (data.success) {
        setOrderSubmitted(true);
        setOrderForm({ name: "", email: "", phone: "", details: "" });
        setTimeout(() => setOrderSubmitted(false), 4000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("فشل إرسال الطلب، حاول لاحقاً.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased dir-rtl relative" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3.5 rounded-2xl shadow-xl">
              <Cpu className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-1">قائمة الأدوات البرمجية والأتمتة المتكاملة ومعالجة المخططات الهندسية</p>
            </div>
          </div>
          
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-6 py-3 rounded-xl border border-slate-700 text-sm">
            <span>العودة للرئيسية</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <nav className="mb-10 bg-slate-800/80 border border-slate-700 p-2 rounded-2xl shadow-2xl overflow-x-auto">
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
                      activeTab === tab.id ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" : "text-slate-300 hover:bg-slate-700/60"
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

        {activeTab === "order-custom" ? (
          <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>طلب بناء أداة برمجية هندسية مخصصة</span>
            </h2>
            <p className="text-slate-400 text-xs mb-6">سيتم استقبال وتوجيه طلبك فوراً للبريد الإلكتروني للإدارة ولوحة التحكم.</p>

            {orderSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>تم إرسال طلبك بنجاح وسيتواصل معك الفريق في أقرب وقت!</span>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم الكامل / الجهة *</label>
                <input type="text" required value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني *</label>
                  <input type="email" required value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الهاتف *</label>
                  <input type="tel" required value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">شرح ووصف الأداة البرمجية المطلوبة *</label>
                <textarea rows="5" required value={orderForm.details} onChange={e => setOrderForm({...orderForm, details: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3.5 rounded-xl shadow-lg text-xs">
                إرسال الطلب للإدارة
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="max-w-xl mx-auto mb-10 relative">
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-slate-400" />
              <input type="text" placeholder="ابحث عن أداة أو برمجية..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-12 pl-4 py-4 text-white text-xs focus:outline-none focus:border-blue-500" />
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400 text-xs">جاري تحميل الأدوات والبرمجيات...</div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">لا توجد برمجيات منشورة حالياً في هذا القسم.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-500 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-500/10 text-blue-400 text-[11px] px-3 py-1 rounded-full border border-blue-500/20 font-bold">{tool.badge || "أداة حصرية"}</span>
                        {tool.aiPlatform && <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{tool.aiPlatform}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                      <p className="text-slate-400 text-xs line-clamp-3 mb-6 leading-relaxed">{tool.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-700/60">
                      {tool.category === "prompt-engineering" && (
                        <button onClick={() => handleOpenPrompt(tool)} className="w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow">
                          <Terminal className="h-4 w-4" />
                          <span>توليد البرومبت الذكي</span>
                        </button>
                      )}

                      {tool.category === "live-web-apps" && (
                        <button onClick={() => handleOpenApp(tool)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow">
                          <Sliders className="h-4 w-4" />
                          <span>تشغيل الحاسبة التفاعلية</span>
                        </button>
                      )}

                      {(tool.category !== "prompt-engineering" && tool.category !== "live-web-apps") && (
                        <button onClick={() => setActiveProcessingModal(tool)} className="w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow">
                          <Upload className="h-4 w-4" />
                          <span>رفع ومعالجة الملفات</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal: البرومبت الذكي */}
        {activePromptModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">{activePromptModal.title}</h3>
              <div className="space-y-4 my-4 max-h-64 overflow-y-auto">
                {activePromptModal.placeholders?.map((p, i) => (
                  <div key={i}>
                    <label className="block text-xs font-bold text-slate-300 mb-1">أدخل [{p}]: *</label>
                    <input type="text" value={promptInputs[p] || ""} onChange={e => setPromptInputs({...promptInputs, [p]: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setActivePromptModal(null)} className="px-4 py-2 bg-slate-700 text-white text-xs rounded-lg font-bold">إغلاق</button>
                <button onClick={handleExecutePrompt} className="px-5 py-2 bg-blue-600 text-white text-xs rounded-lg font-bold flex items-center gap-1.5 shadow"><Copy className="h-4 w-4" /><span>نسخ البرومبت</span></button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: تطبيقات الويب الحية */}
        {activeAppModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">{activeAppModal.title}</h3>
              <div className="space-y-4 my-4">
                {activeAppModal.variables?.map((v, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 items-center">
                    <label className="col-span-2 text-xs font-bold text-slate-300">{v.label}:</label>
                    <input type={v.type || "number"} value={appInputs[v.name] || ""} onChange={e => setAppInputs({...appInputs, [v.name]: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono" />
                  </div>
                ))}
              </div>
              <button onClick={handleCalculateApp} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">احسب الآن</button>
              
              {appResult && (
                <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-400 block mb-1">النتيجة:</span>
                  <div className="text-2xl font-black text-white font-mono">{appResult.numeric}</div>
                  <p className="text-xs text-slate-300 mt-2">{appResult.report}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4"><button onClick={() => setActiveAppModal(null)} className="px-4 py-2 bg-slate-700 text-white text-xs rounded-lg font-bold">إغلاق</button></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}