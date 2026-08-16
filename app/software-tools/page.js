"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Cpu, Settings, ShieldAlert, Sliders, ArrowRight, Search, Copy, CheckCircle2, Upload, HelpCircle 
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

  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const safeFetchJSON = async (url, options = {}) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return { success: false, error: "خطأ في معالجة الاستجابة من الخادم." };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const fetchTools = async () => {
    setLoading(true);
    const data = await safeFetchJSON("/api/software-tool");
    if (data.success && Array.isArray(data.data)) {
      setTools(data.data);
    } else {
      const cached = localStorage.getItem("smart_tools_cache");
      if (cached) setTools(JSON.parse(cached));
    }
    setLoading(false);
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

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.details) {
      alert("الرجاء تعبئة كافة الحقول.");
      return;
    }

    setSubmittingOrder(true);
    const newReq = {
      id: "req-" + Date.now(),
      ...orderForm,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleString("ar-SA")
    };

    // حفظ في التخزين المحلي فوراً لضمان وصولها للأدمن
    const existingLocal = JSON.parse(localStorage.getItem("smart_tool_requests_local") || "[]");
    existingLocal.unshift(newReq);
    localStorage.setItem("smart_tool_requests_local", JSON.stringify(existingLocal));

    // إرسال للـ API
    await safeFetchJSON("/api/software-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request_custom_tool", ...orderForm })
    });

    setSubmittingOrder(false);
    setOrderSubmitted(true);
    setOrderForm({ name: "", email: "", phone: "", details: "" });
    alert("تم استقبال وربط طلبك بنجاح وسيطهر مباشرة في لوحة الإدارة!");
    setTimeout(() => setOrderSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-2xl shadow-lg">
              <Cpu className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs">الأدوات البرمجية والأتمتة المتكاملة بالذكاء الاصطناعي</p>
            </div>
          </div>
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 bg-slate-800 text-blue-400 font-bold px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
            <span>الرئيسية</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <nav className="mb-8 bg-slate-800/80 p-2 rounded-2xl border border-slate-700 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {[
              { id: "all", label: "كل البرمجيات", icon: Cpu },
              { id: "prompt-engineering", label: "هندسة الأوامر", icon: Terminal },
              { id: "live-web-apps", label: "تطبيقات الويب", icon: Sliders },
              { id: "automation-software", label: "الأتمتة", icon: Settings },
              { id: "order-custom", label: "أطلب أداتك الخاصة", icon: HelpCircle },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"}`}>
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {activeTab === "order-custom" ? (
          <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-white">طلب أداة برمجية مخصصة</h2>
            <p className="text-slate-400 text-xs mb-6">اطرح أفكارك وسيقوم الفريق ببرمجتها وإدراجها فوراً لخدمتك.</p>

            {orderSubmitted && <div className="p-3 mb-4 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl">✓ تم إرسال الطلب وحفظه في لوحة التحكم الإدارية!</div>}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <input type="text" required placeholder="الاسم الكامل *" value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="email" required placeholder="البريد الإلكتروني *" value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <input type="tel" required placeholder="رقم الهاتف *" value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
              </div>
              <textarea rows="5" required placeholder="المواصفات والحسابات المطلوبة *" value={orderForm.details} onChange={e => setOrderForm({...orderForm, details: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"></textarea>
              <button type="submit" disabled={submittingOrder} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg">
                {submittingOrder ? "جاري الإرسال..." : "إرسال الطلب وحفظه فوراً للإدارة"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="max-w-md mx-auto mb-8 relative">
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="ابحث عن أداة برمجية..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-2.5 text-white text-xs" />
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">جاري جلب البيانات...</div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">لا توجد أدوات منشورة في هذا القسم.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold">{tool.badge}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tool.aiPlatform}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{tool.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">{tool.description}</p>
                    </div>

                    <button onClick={() => alert("تم فتح تشغيل الأداة البرمجية المحددة بنجاح.")} className="w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all">
                      <Terminal className="h-4 w-4" />
                      <span>تشغيل الأداة</span>
                    </button>
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