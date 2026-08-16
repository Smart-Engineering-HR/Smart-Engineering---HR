"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, Settings, ShieldAlert, Sliders, ArrowRight, Search, Copy, Download,
  HelpCircle, FileText, Upload, BarChart2, AlertTriangle, Layers, Grid, FileSpreadsheet, CheckCircle2
} from "lucide-react";

export default function SoftwareToolsPublic() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activePromptModal, setActivePromptModal] = useState(null);
  const [promptInputs, setPromptInputs] = useState({});
  const [activeAppModal, setActiveAppModal] = useState(null);
  const [appInputs, setAppInputs] = useState({});
  const [appResult, setAppResult] = useState(null);

  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // جلب البيانات الحية المباشرة من الأدمن عبر الـ API
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
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // معالجة إرسال طلب أداة خاصة وربطها بالبريد الإلكتروني
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
        body: JSON.stringify({
          action: "request_custom_tool",
          ...orderForm
        }),
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl relative" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3.5 rounded-2xl shadow-xl">
              <Cpu className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-1 font-medium">الأدوات البرمجية التفاعلية المباشرة المعتمدة</p>
            </div>
          </div>
          
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-6 py-3 rounded-xl border border-slate-700 transition-all text-sm">
            <span>الرئيسية</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <nav className="mb-8 bg-slate-900 border border-slate-800 p-2 rounded-2xl overflow-x-auto flex gap-2">
          {[
            { id: "all", label: "كل البرمجيات والأدوات" },
            { id: "prompt-engineering", label: "هندسة الأوامر الذكية" },
            { id: "live-web-apps", label: "تطبيقات الويب الحية" },
            { id: "automation-software", label: "برمجيات الأتمتة" },
            { id: "ai-solutions", label: "حلول الذكاء الاصطناعي" },
            { id: "order-custom", label: "أطلب أداتك البرمجية الخاصة" },
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

        {activeTab === "order-custom" ? (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>طلب بناء أداة برمجية هندسية خاصة</span>
            </h2>
            <p className="text-slate-400 text-xs mb-6">سيتم تحويل المواصفات المطلوبة فورياً لإدارة المنصة والإيميلات المعتمدة.</p>

            {orderSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="h-5 w-5" />
                <span>تم إرسال طلبك بنجاح وتحويل إشعار آلي للإيميلات الرسمية!</span>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <input 
                type="text" required placeholder="الاسم الكامل / الجهة الطالبة" 
                value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="email" required placeholder="البريد الإلكتروني" 
                  value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                />
                <input 
                  type="tel" required placeholder="رقم الهاتف / الواتساب" 
                  value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                />
              </div>
              <textarea 
                rows="5" required placeholder="اشرح بالتفصيل المعادلة أو الأداة البرمجية المطلوبة..."
                value={orderForm.details} onChange={e => setOrderForm({...orderForm, details: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs"
              ></textarea>
              <button 
                type="submit" disabled={isSubmittingOrder}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs"
              >
                {isSubmittingOrder ? "جاري الإرسال..." : "إرسال الطلب وإشعار الإدارة فوراً"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="max-w-md mx-auto mb-8 relative">
              <Search className="absolute right-4 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text" placeholder="ابحث عن أداة برمجية..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-slate-500 text-xs">جاري تحميل أدوات المنصة المحدثة...</div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">لا توجد برمجيات منشورة حالياً في هذا القسم.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2.5 py-1 rounded border border-blue-500/20 font-bold">{tool.badge}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tool.aiPlatform}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{tool.title}</h3>
                      <p className="text-slate-400 text-xs line-clamp-3 mb-6 leading-relaxed">{tool.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      {tool.category === "prompt-engineering" ? (
                        <button onClick={() => { setActivePromptModal(tool); setPromptInputs({}); }} className="w-full bg-slate-800 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors">تعبئة وتوليد البرومبت</button>
                      ) : (
                        <button onClick={() => { setActiveAppModal(tool); setAppInputs({}); setAppResult(null); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors">تشغيل الحاسبة التفاعلية</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}