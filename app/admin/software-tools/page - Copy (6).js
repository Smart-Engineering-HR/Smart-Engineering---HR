"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Cpu, Settings, Bot, Layers, HelpCircle, 
  Plus, Trash2, Edit3, Save, CheckCircle, Mail, 
  Upload, Sliders, AlertCircle, FileText, Database, Layers3, RefreshCw
} from "lucide-react";

export default function SoftwareToolsAdmin() {
  // تتبع الأبواب الفرعية الأساسية داخل لوحة التحكم الشاملة للتحكم بكل الأدوات والمكونات والطلبات
  const sections = [
    { id: "prompt-engineering", name: "إدارة هندسة الأوامر", icon: Terminal },
    { id: "live-web-apps", name: "إدارة تطبيقات الويب الحية", icon: Sliders },
    { id: "automation-software", name: "إدارة برمجيات الأتمتة", icon: Settings },
    { id: "ai-solutions", name: "إدارة حلول الذكاء الاصطناعي", icon: Bot },
    { id: "management-control", name: "إدارة أنظمة SaaS والتحكم", icon: Layers },
    { id: "incoming-requests", name: "طلبات الأدوات الواردة", icon: Mail }
  ];

  const [activeSection, setActiveSection] = useState("prompt-engineering");
  const [saveNotification, setSaveNotification] = useState("");

  // الجداول الحركية للحالة لتخزين مدخلات ومكونات الأدمن الكلية
  const [prompts, setPrompts] = useState([]);
  const [webApps, setWebApps] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [aiSolutions, setAiSolutions] = useState([]);
  const [managementTools, setManagementTools] = useState([]);
  const [toolRequests, setToolRequests] = useState([]);

  // حالات الإضافة لـ "هندسة الأوامر"
  const [promptForm, setPromptForm] = useState({ title: "", category: "هندسة إنشائية", platform: "ChatGPT", badge: "أداة حصرية", description: "", secretPrompt: "" });
  
  // حالات الإضافة لـ "تطبيقات الويب الحية"
  const [webAppForm, setWebAppForm] = useState({ title: "", category: "هندسة إنشائية", variables: [], logic: "", minMax: "", template: "" });
  const [newVar, setNewVar] = useState({ name: "", type: "number", label: "", unit: "" });

  // حالات الإضافة لـ "برمجيات الأتمتة"
  const [autoForm, setAutoForm] = useState({ title: "", allowedExtensions: ".rvt, .ifc", maxSize: "50", scriptCode: "", rules: "", resultFormat: "Excel" });

  // حالات الإضافة لـ "حلول الذكاء الاصطناعي"
  const [aiForm, setAiForm] = useState({ title: "", severityThresholds: "", rulesBook: "", masterTemplateName: "", layerMapping: "" });

  // حالات الإضافة لـ "الإدارة والتحكم"
  const [mgmtForm, setMgmtForm] = useState({ title: "", docTypes: "", approvalRules: "", namingConvention: "", boqTemplate: "" });

  // تحميل ومزامنة البيانات من localStorage لضمان استقرار الانعكاس الكامل على الجمهور فورياً
  useEffect(() => {
    setPrompts(JSON.parse(localStorage.getItem("se_prompts") || "[]"));
    setWebApps(JSON.parse(localStorage.getItem("se_webapps") || "[]"));
    setAutomations(JSON.parse(localStorage.getItem("se_automations") || "[]"));
    setAiSolutions(JSON.parse(localStorage.getItem("se_aisolutions") || "[]"));
    setManagementTools(JSON.parse(localStorage.getItem("se_management") || "[]"));
    setToolRequests(JSON.parse(localStorage.getItem("se_tool_requests") || "[]"));
  }, []);

  const triggerSaveNotification = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(""), 3500);
  };

  // معالجات الحفظ للأدمن وحقنها في الـ LocalStorage لتحديث الجمهور بشكل ديناميكي
  const savePromptsToStorage = (updated) => {
    setPrompts(updated);
    localStorage.setItem("se_prompts", JSON.stringify(updated));
    triggerSaveNotification("تم تحديث وحفظ مكتبة هندسة الأوامر بنجاح وتطبيقها على واجهة الجمهور!");
  };

  const saveWebAppsToStorage = (updated) => {
    setWebApps(updated);
    localStorage.setItem("se_webapps", JSON.stringify(updated));
    triggerSaveNotification("تم تحديث وحفظ تطبيقات الويب الحية المباشرة بنجاح!");
  };

  const saveAutomationsToStorage = (updated) => {
    setAutomations(updated);
    localStorage.setItem("se_automations", JSON.stringify(updated));
    triggerSaveNotification("تم تحديث وحفظ برمجيات الأتمتة والسكربتات في المتجر المباشر!");
  };

  const saveAiSolutionsToStorage = (updated) => {
    setAiSolutions(updated);
    localStorage.setItem("se_aisolutions", JSON.stringify(updated));
    triggerSaveNotification("تم تحديث حلول ونماذج الذكاء الاصطناعي الهندسية المعتمدة!");
  };

  const saveManagementToStorage = (updated) => {
    setManagementTools(updated);
    localStorage.setItem("se_management", JSON.stringify(updated));
    triggerSaveNotification("تم تحديث محركات الإدارة ونماذج التدقيق المركزي!");
  };

  // إدارة هندسة الأوامر (حذف وإضافة)
  const addPrompt = (e) => {
    e.preventDefault();
    if (!promptForm.title || !promptForm.secretPrompt) return;
    const updated = [...prompts, { ...promptForm, id: "p_" + Date.now() }];
    savePromptsToStorage(updated);
    setPromptForm({ title: "", category: "هندسة إنشائية", platform: "ChatGPT", badge: "أداة حصرية", description: "", secretPrompt: "" });
  };

  const deletePrompt = (id) => {
    const updated = prompts.filter(p => p.id !== id);
    savePromptsToStorage(updated);
  };

  // إدارة تطبيقات الويب الحية (إضافة متغيرات ديناميكية وصياغة المعادلات الهندسية وعمل المحرك الحسابي)
  const addVariableToForm = () => {
    if (!newVar.name || !newVar.label) return;
    setWebAppForm({ ...webAppForm, variables: [...webAppForm.variables, newVar] });
    setNewVar({ name: "", type: "number", label: "", unit: "" });
  };

  const addWebApp = (e) => {
    e.preventDefault();
    if (!webAppForm.title || !webAppForm.logic) return;
    const updated = [...webApps, { ...webAppForm, id: "w_" + Date.now() }];
    saveWebAppsToStorage(updated);
    setWebAppForm({ title: "", category: "هندسة إنشائية", variables: [], logic: "", minMax: "", template: "" });
  };

  const deleteWebApp = (id) => {
    const updated = webApps.filter(w => w.id !== id);
    saveWebAppsToStorage(updated);
  };

  // إدارة برمجيات الأتمتة
  const addAutomation = (e) => {
    e.preventDefault();
    if (!autoForm.title) return;
    const updated = [...automations, { ...autoForm, id: "a_" + Date.now() }];
    saveAutomationsToStorage(updated);
    setAutoForm({ title: "", allowedExtensions: ".rvt, .ifc", maxSize: "50", scriptCode: "", rules: "", resultFormat: "Excel" });
  };

  const deleteAutomation = (id) => {
    const updated = automations.filter(a => a.id !== id);
    saveAutomationsToStorage(updated);
  };

  // إدارة حلول الذكاء الاصطناعي
  const addAiSolution = (e) => {
    e.preventDefault();
    if (!aiForm.title) return;
    const updated = [...aiSolutions, { ...aiForm, id: "ai_" + Date.now() }];
    saveAiSolutionsToStorage(updated);
    setAiForm({ title: "", severityThresholds: "", rulesBook: "", masterTemplateName: "", layerMapping: "" });
  };

  const deleteAiSolution = (id) => {
    const updated = aiSolutions.filter(ai => ai.id !== id);
    saveAiSolutionsToStorage(updated);
  };

  // إدارة الإدارة والتحكم
  const addManagementTool = (e) => {
    e.preventDefault();
    if (!mgmtForm.title) return;
    const updated = [...managementTools, { ...mgmtForm, id: "m_" + Date.now() }];
    saveManagementToStorage(updated);
    setMgmtForm({ title: "", docTypes: "", approvalRules: "", namingConvention: "", boqTemplate: "" });
  };

  const deleteManagementTool = (id) => {
    const updated = managementTools.filter(m => m.id !== id);
    saveManagementToStorage(updated);
  };

  // حذف طلبات المشتريات البرمجية الواردة من الجمهور
  const deleteRequest = (id) => {
    const updated = toolRequests.filter(r => r.id !== id);
    setToolRequests(updated);
    localStorage.setItem("se_tool_requests", JSON.stringify(updated));
    triggerSaveNotification("تم حذف الطلب المعين من قائمة المراقبة بنجاح.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-xl text-slate-950 shadow-md">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-wide">لوحة تحكم الأدمن الموحدة للمنصة</h1>
            <p className="text-xs text-amber-400 font-medium">التحكم في النشر، الحذف، التعديل والمزامنة لـ قائمة برمجيات وأدوات</p>
          </div>
        </div>
        
        <button 
          onClick={() => window.open("/software-tools", "_blank")}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> استعراض واجهة الجمهور (Live)
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* شريط التحكم والتنقل الجانبي للأدمن لضمان التغطية والسيطرة */}
        <aside className="lg:col-span-1 flex flex-col gap-2 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-black text-slate-500 px-3 tracking-wider mb-1 block">مكونات السيطرة الفنية</span>
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-right flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeSection === sec.id 
                    ? "bg-amber-500 text-slate-950 shadow-md scale-[1.02]" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sec.name}
                {sec.id === "incoming-requests" && toolRequests.length > 0 && (
                  <span className="mr-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">{toolRequests.length}</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* مساحة معالجة البيانات وبناء المحتوى للأدمن */}
        <main className="lg:col-span-3 space-y-6">
          {saveNotification && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl animate-fadeIn flex items-center gap-2 shadow-inner">
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {saveNotification}
            </div>
          )}

          {/* 1. السيطرة على هندسة الأوامر */}
          {activeSection === "prompt-engineering" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-md font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Terminal className="text-amber-400" /> إضافة أداة / برومبت سري جديد للمكتبة
              </h3>
              
              <form onSubmit={addPrompt} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">اسم الأداة (الذي يظهر للجمهور):</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500" placeholder="مثال: المولد الذكي لتقارير المواد" value={promptForm.title} onChange={e => setPromptForm({...promptForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">التصنيف الفني (قائمة منسدلة):</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500" value={promptForm.category} onChange={e => setPromptForm({...promptForm, category: e.target.value})}>
                    <option value="هندسة إنشائية">هندسة إنشائية</option>
                    <option value="تصميم معماري">تصميم معماري</option>
                    <option value="مكتب فني وحصر">مكتب فني وحصر</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">المنصة المفضلة الأنسب للتنفيذ:</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100" placeholder="مثال: ChatGPT أو Claude 3 أو Gemini" value={promptForm.platform} onChange={e => setPromptForm({...promptForm, platform: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">الشارة التوضيحية (Badge):</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100" placeholder="مثال: أداة حصرية / مميز" value={promptForm.badge} onChange={e => setPromptForm({...promptForm, badge: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">وصف قصير وشرح مبسط لعمل الأداة ليقرأه المستخدم:</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100" placeholder="شرح موجز للجمهور قبل بدء استخدام ونسخ البرومبت..." value={promptForm.description} onChange={e => setPromptForm({...promptForm, description: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-amber-400 font-bold block mb-1">نص البرومبت السري (ضع المتغيرات المراد تعبئتها بين قوسين مربعين مثل [المادة]):</label>
                  <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono leading-relaxed" placeholder="قم بتحليل تقرير اختبار المادة: [المادة] للعنصر الإنشائي: [العنصر] الكود: [الكود المستخدم]..." value={promptForm.secretPrompt} onChange={e => setPromptForm({...promptForm, secretPrompt: e.target.value})} />
                </div>
                <button type="submit" className="md:col-span-2 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
                  <Plus className="w-4 h-4" /> نشر وإدراج الأداة في واجهة الجمهور فوراً
                </button>
              </form>

              <div className="border-t border-slate-800 pt-6">
                <span className="text-xs font-bold text-slate-400 block mb-3">الأدوات المنشورة حالياً بالمكتبة للجمهور:</span>
                <div className="space-y-3">
                  {prompts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{p.title} <span className="text-[10px] text-amber-400 font-normal mr-2">({p.category})</span></p>
                        <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{p.description}</p>
                      </div>
                      <button onClick={() => deletePrompt(p.id)} className="p-2 bg-red-950/40 text-red-400 hover:bg-red-900 hover:text-white rounded-lg transition-colors border border-red-900/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {prompts.length === 0 && <p className="text-xs text-slate-600 italic">لا توجد أدوات أو برومبتات مضافة للمكتبة.</p>}
                </div>
              </div>
            </div>
          )}

          {/* 2. السيطرة على تطبيقات الويب الحية (Logic Engine) */}
          {activeSection === "live-web-apps" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-md font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Sliders className="text-emerald-400" /> بناء وتصميم تطبيق حسابي حي أونلاين (Live Web App)
              </h3>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-slate-300 block border-b border-slate-800 pb-1.5">خطوة 1: تعريف المتغيرات والحقول (Variables Schema)</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">رمز المتغير هندسياً:</label>
                    <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" placeholder="مثال: P أو Ac" value={newVar.name} onChange={e => setNewVar({...newVar, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">اسم الحقل التوضيحي:</label>
                    <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" placeholder="الحمل المحوري الأقصى" value={newVar.label} onChange={e => setNewVar({...newVar, label: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">الوحدة القياسية:</label>
                    <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" placeholder="كيلونيوتن / مم²" value={newVar.unit} onChange={e => setNewVar({...newVar, unit: e.target.value})} />
                  </div>
                  <button type="button" onClick={addVariableToForm} className="py-2 px-3 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold rounded-lg text-xs transition-colors border border-slate-700">
                    + إدراج الحقل
                  </button>
                </div>
                
                {webAppForm.variables.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {webAppForm.variables.map((v, i) => (
                      <span key={i} className="text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300">
                        <strong>{v.name}</strong>: {v.label} ({v.unit || "بلا وحدة"})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={addWebApp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">عنوان التطبيق الحسابي الحصري:</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="مثال: حاسبة تقوية الأعمدة الخرسانية" value={webAppForm.title} onChange={e => setWebAppForm({...webAppForm, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">القسم الهندسي المندرج تحتها الأداة:</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" value={webAppForm.category} onChange={e => setWebAppForm({...webAppForm, category: e.target.value})}>
                      <option value="هندسة إنشائية">هندسة إنشائية</option>
                      <option value="تصميم معماري">تصميم معماري</option>
                      <option value="مكتب فني وحصر">مكتب فني وحصر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-amber-400 font-bold block mb-1">المعادلة المحورية البرمجية الرياضية (Logic Engine):</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-emerald-400" placeholder="مثال: Result = P / (Ac * fc);" value={webAppForm.logic} onChange={e => setWebAppForm({...webAppForm, logic: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">شروط التحقق والحدود (Validation Rules):</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="مثال: Width >= 0.2" value={webAppForm.minMax} onChange={e => setWebAppForm({...webAppForm, minMax: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">قالب نص النتيجة الديناميكي (Result Template):</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="مثال: قوة تحمل العمود هي: {Result} طن" value={webAppForm.template} onChange={e => setWebAppForm({...webAppForm, template: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> نشر وتضمين التطبيق الحسابي للجمهور
                </button>
              </form>

              <div className="border-t border-slate-800 pt-6">
                <span className="text-xs font-bold text-slate-400 block mb-3">الحاسبات والتطبيقات الحية المفعلة حالياً:</span>
                <div className="space-y-2">
                  {webApps.map(w => (
                    <div key={w.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{w.title}</p>
                        <p className="text-[11px] font-mono text-emerald-400 mt-1">{w.logic}</p>
                      </div>
                      <button onClick={() => deleteWebApp(w.id)} className="p-2 bg-red-950/40 text-red-400 hover:bg-red-900 hover:text-white rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. السيطرة على برمجيات الأتمتة */}
          {activeSection === "automation-software" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-md font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Settings className="text-purple-400" /> رفع وضبط سكربت أتمتة وحصر جديد (Automation Script)
              </h3>

              <form onSubmit={addAutomation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="text-xs text-slate-400 block mb-1">اسم برمجية الأتمتة:</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="سكربت حصر الأعمدة بـ Dynamo" value={autoForm.title} onChange={e => setAutoForm({...autoForm, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">الامتدادات المسموح برفعها:</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono" placeholder="مثال: .rvt, .ifc, .pdf" value={autoForm.allowedExtensions} onChange={e => setAutoForm({...autoForm, allowedExtensions: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">الحد الأقصى للملف (ميجابايت):</label>
                    <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono" placeholder="50" value={autoForm.maxSize} onChange={e => setAutoForm({...autoForm, maxSize: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">تنسيق وصيغة الملف النهائي للمخرجات:</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" value={autoForm.resultFormat} onChange={e => setAutoForm({...autoForm, resultFormat: e.target.value})}>
                      <option value="Excel">جداول حصر محاسبية ممتلئة Excel</option>
                      <option value="PDF">تقرير فني مدمج ومفصل PDF</option>
                      <option value="Report">تقرير فني تفاعلي على المتصفح</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">خوارزمية التدقيق والقيود (قواعد الهامش):</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="مثال: تنبيه أحمر إذا كانت مساحة المقطع أصغر من الحدود الدنيا" value={autoForm.rules} onChange={e => setAutoForm({...autoForm, rules: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-purple-400 font-bold block mb-1">رفع الكود البرمجي الميكانيكي أو السكربت المحرك (Dynamo / Python Script):</label>
                  <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-purple-300" placeholder="def calculate_quantities(file_path): # analysis_engine.py logic rules..." value={autoForm.scriptCode} onChange={e => setAutoForm({...autoForm, scriptCode: e.target.value})} />
                </div>

                <button type="submit" className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs">
                  نشر وإدراج محرك الأتمتة في المتجر الإلكتروني للمنصة
                </button>
              </form>

              <div className="border-t border-slate-800 pt-6">
                <span className="text-xs font-bold text-slate-400 block mb-2">السكربتات والبرمجيات المرفوعة حالياً:</span>
                <div className="space-y-2">
                  {automations.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                      <span className="font-medium text-slate-200">{a.title}</span>
                      <button onClick={() => deleteAutomation(a.id)} className="p-2 bg-red-950/40 text-red-400 hover:bg-red-900 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. السيطرة على حلول الذكاء الاصطناعي */}
          {activeSection === "ai-solutions" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-md font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Bot className="text-blue-400" /> إعداد حلول وروبوتات تشخيص الذكاء الاصطناعي التخصصي
              </h3>

              <form onSubmit={addAiSolution} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">عنوان الأداة الذكية وروبوت التشخيص:</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="مثال: روبوت التشخيص الفوري للشروخ والتصدعات الإنشائية" value={aiForm.title} onChange={e => setAiForm({...aiForm, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">معايير الخطورة الرياضية الحاكمة (Severity Thresholds):</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="مثال: عرض الشرخ > 3mm = خطر مرتفع جداً" value={aiForm.severityThresholds} onChange={e => setAiForm({...aiForm, severityThresholds: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">قواعد الاعتماد وربط النتائج بالأكواد الهندسية القياسية:</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="ربط فوري بـ الملحق الإنشائي للكود السعودي SBC" value={aiForm.rulesBook} onChange={e => setAiForm({...aiForm, rulesBook: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">تحديد المخطط المرجعي النموذجي (Master Template):</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="اسم ملف المخطط المرجعي للمقارنة والتدقيق الذاتي" value={aiForm.masterTemplateName} onChange={e => setAiForm({...aiForm, masterTemplateName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">خارطة تعريفات الطبقات وعلاقة الألوان (Layers Mapping):</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="مثال: اللون الأسود بالبكسل = جدار خرساني مصمت في CAD" value={aiForm.layerMapping} onChange={e => setAiForm({...aiForm, layerMapping: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold rounded-xl text-xs">
                  تضمين روبوت تشخيص الذكاء الاصطناعي وتفعيله فوراً
                </button>
              </form>

              <div className="border-t border-slate-800 pt-6">
                <span className="text-xs font-bold text-slate-400 block mb-2">أدوات وروبوتات الذكاء الاصطناعي النشطة:</span>
                <div className="space-y-2">
                  {aiSolutions.map(ai => (
                    <div key={ai.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                      <span className="font-medium text-slate-200">{ai.title}</span>
                      <button onClick={() => deleteAiSolution(ai.id)} className="p-2 bg-red-950/40 text-red-400 hover:bg-red-900 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. السيطرة على أنظمة الإدارة والتحكم SaaS */}
          {activeSection === "management-control" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-md font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Layers className="text-cyan-400" /> ضبط معايير أنظمة الإدارة المكتبية المركزية (SaaS Modules)
              </h3>

              <form onSubmit={addManagementTool} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">اسم النظام السحابي لإدارة المكاتب الفنية:</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="لوحة تحكم وتتبع تسليم المخططات التنفيذية للمكتب الهندسي" value={mgmtForm.title} onChange={e => setMgmtForm({...mgmtForm, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">توصيف وتصنيف المستندات والمخططات المعتمدة في النظام:</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="Shop Drawings, As-Built, IFC Sheets" value={mgmtForm.docTypes} onChange={e => setMgmtForm({...mgmtForm, docTypes: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">قواعد ومستويات الاعتماد وحقوق الختم الهندسي:</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="الاستشاري هو المخول الحصري والوحيد بوضع الختم المعتمد" value={mgmtForm.approvalRules} onChange={e => setMgmtForm({...mgmtForm, approvalRules: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">فرض صيغة الترقيم الموحدة القياسية للملفات والمخططات:</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono" placeholder="PROJ-ZONE-TYPE-REV-NUMBER" value={mgmtForm.namingConvention} onChange={e => setMgmtForm({...mgmtForm, namingConvention: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">هيكلية وقوالب جداول الكميات (BoQ Standards):</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs" placeholder="تصميم الجداول القياسية للكميات والأسعار المعتمدة للشركة" value={mgmtForm.boqTemplate} onChange={e => setMgmtForm({...mgmtForm, boqTemplate: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl text-xs">
                  تضمين وتفعيل أداة الإدارة السحابية والسيطرة للمكاتب
                </button>
              </form>

              <div className="border-t border-slate-800 pt-6">
                <span className="text-xs font-bold text-slate-400 block mb-2">أنظمة SaaS المفعلة حالياً للجمهور:</span>
                <div className="space-y-2">
                  {managementTools.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                      <span className="font-medium text-slate-200">{m.title}</span>
                      <button onClick={() => deleteManagementTool(m.id)} className="p-2 bg-red-950/40 text-red-400 hover:bg-red-900 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. إدارة ورصد طلبات الأدوات المخصصة الواردة من الجمهور عبر لوحة التحكم */}
          {activeSection === "incoming-requests" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Mail className="text-amber-500" /> طلبات الأدوات البرمجية الخاصة الواردة والمزامنة عبر الإيميلات
                </h3>
                <p className="text-slate-400 text-xs mt-1">توضح هذه اللوحة كافة الطلبات التي صاغها الجمهور، ويتم تتبعها تزامناً مع مراسلات البريد المشترك للموقع.</p>
              </div>

              <div className="space-y-4">
                {toolRequests.map((req) => (
                  <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs space-y-3 relative group">
                    <button 
                      onClick={() => deleteRequest(req.id)}
                      className="absolute left-4 top-4 p-2 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-white rounded-lg transition-colors border border-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="حذف الطلب المعالج"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-slate-900 pb-2">
                      <p className="text-slate-300 font-bold">المرسل: <span className="text-slate-100 font-medium">{req.name}</span></p>
                      <p className="text-slate-300 font-bold">البريد: <span className="text-cyan-400 font-mono select-all">{req.email}</span></p>
                      <p className="text-slate-300 font-bold">التلفون: <span className="text-slate-400 font-mono">{req.phone || "غير مدرج"}</span></p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 block mb-1 font-bold">تفاصيل نطاق العمل والمواصفات التقنية للأداة المطلوبة:</p>
                      <p className="p-3 bg-slate-900 border border-slate-800/80 text-slate-300 rounded-lg font-sans leading-relaxed whitespace-pre-wrap">{req.details}</p>
                    </div>
                    <div className="text-[10px] text-slate-600 flex justify-between items-center pt-1">
                      <span>تاريخ تقديم الطلب الفني: {req.date}</span>
                      <span className="text-amber-400 font-medium">قيد المراجعة الإدارية المشتركة</span>
                    </div>
                  </div>
                ))}

                {toolRequests.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                    لا توجد طلبات برمجية هندسية جديدة واردة حالياً من قبل صندوق تواصل الجمهور.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}