"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Cpu, Settings, ShieldAlert, Sliders, PlusCircle, 
  Trash2, Edit, Save, Eye, User, Mail, Phone, FileText, Grid, Layers
} from "lucide-react";

export default function SoftwareToolsAdmin() {
  // 1. ضع هذه الأسطر في بداية الدالة مباشرة
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loginError, setLoginError] = useState("");
  const [tools, setTools] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("tools-list");

  // نموذج إضافة وتحديث البيانات الهيكلية للأدوات
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "prompt-engineering",
    badge: "أداة حصرية",
    aiPlatform: "ChatGPT / Claude 3",
    description: "",
    secretPrompt: "",
    placeholdersInput: "", // يتم تفكيك الكلمات المفصولة بفاصلة لمصفوفة
    logic: "",
    variablesInput: "", // حقول إدخال المتغيرات بصيغة مصفوفة JSON معيارية
    validation: "",
    template: ""
  });

  // المزامنة التزامية الفورية عبر الـ localStorage لضمان التناسق دون لمس الأكواد
  useEffect(() => {
    // 2. يوضع داخل الـ useEffect للحفاظ على بقاء الجلسة عند تحديث الصفحة
const authStatus = localStorage.getItem("smart_admin_logged_in");
if (authStatus === "true") {
  setIsLoggedIn(true);
}
    const storedTools = localStorage.getItem("smart_engineering_tools");
    if (storedTools) setTools(JSON.parse(storedTools));

    const storedRequests = localStorage.getItem("smart_engineering_requests");
    if (storedRequests) setRequests(JSON.parse(storedRequests));
  }, []);

  const saveToolsToStorage = (updatedTools) => {
    setTools(updatedTools);
    localStorage.setItem("smart_engineering_tools", JSON.stringify(updatedTools));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // معالجة وحفظ الأداة الهندسية وتخزينها للمزامنة مع صفحة الجمهور
  const handleSaveTool = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("الرجاء تعبئة الحقول الأساسية مثل العنوان والوصف التفصيلي.");
      return;
    }

    // تفكيك الكلمات لاستخراج حقول المتغيرات الممثلة بالأقواس المربعة
    const placeholders = formData.placeholdersInput
      ? formData.placeholdersInput.split(",").map(p => p.trim())
      : [];

    // التحقق الفني الصارم من سلامة مصفوفة متغيرات تطبيقات الويب الحية
    let variables = [];
    if (formData.category === "live-web-apps" && formData.variablesInput) {
      try {
        variables = JSON.parse(formData.variablesInput);
      } catch (err) {
        alert("تنبيه: صياغة الـ JSON المخصصة لتعريف الحقول ليست صحيحة، سيقوم النظام تلقائياً باعتماد مصفوفة المتغيرات الافتراضية للخرسانة.");
        variables = [
          { name: "Ac", label: "مساحة المقطع الخرساني الإجمالي (mm²)", type: "number", unit: "mm²" },
          { name: "fc", label: "المقاومة المميزة للخرسانة fc' (MPa)", type: "number", unit: "MPa" }
        ];
      }
    }

    let updatedTools = [...tools];

    if (editingId) {
      // تعديل ومواءمة الأداة الحالية
      updatedTools = updatedTools.map(t => t.id === editingId ? {
        ...t,
        title: formData.title,
        category: formData.category,
        badge: formData.badge,
        aiPlatform: formData.aiPlatform,
        description: formData.description,
        secretPrompt: formData.secretPrompt,
        placeholders,
        logic: formData.logic,
        variables: variables.length > 0 ? variables : t.variables,
        validation: formData.validation,
        template: formData.template
      } : t);
      setEditingId(null);
      alert("تمت مواءمة وتحديث تفاصيل الأداة البرمجية وعكسها تزامناً لصفحة الجمهور.");
    } else {
      // إضافة أداة هندسية برمجية جديدة بالكامل للجمهور
      const newTool = {
        id: "tool-" + Date.now(),
        title: formData.title,
        category: formData.category,
        badge: formData.badge,
        aiPlatform: formData.aiPlatform,
        description: formData.description,
        secretPrompt: formData.secretPrompt,
        placeholders,
        logic: formData.logic || "(0.85 * fc * Ac) / 1000",
        variables: variables.length > 0 ? variables : [
          { name: "Ac", label: "مساحة المقطع الخرساني الإجمالي (mm²)", type: "number", unit: "mm²" },
          { name: "fc", label: "المقاومة المميزة للخرسانة fc' (MPa)", type: "number", unit: "MPa" }
        ],
        validation: formData.validation || "المبادئ والقيم الرياضية يجب أن تكون إيجابية أكبر من الصفر",
        template: formData.template || "قوة تحمل العنصر الإنشائية الاسمية هي: {Result} كيلو نيوتن"
      };
      updatedTools.push(newTool);
      alert("تم بنجاح نشر وإتاحة الأداة البرمجية الإنشائية الجديدة في قائمة قنوات الجمهور.");
    }

    saveToolsToStorage(updatedTools);
    resetForm();
    setActiveTab("tools-list");
  };

  const handleEditClick = (tool) => {
    setEditingId(tool.id);
    setFormData({
      title: tool.title,
      category: tool.category,
      badge: tool.badge || "أداة حصرية",
      aiPlatform: tool.aiPlatform || "ChatGPT / Claude 3",
      description: tool.description,
      secretPrompt: tool.secretPrompt || "",
      placeholdersInput: tool.placeholders ? tool.placeholders.join(", ") : "",
      logic: tool.logic || "",
      variablesInput: tool.variables ? JSON.stringify(tool.variables, null, 2) : "",
      validation: tool.validation || "",
      template: tool.template || ""
    });
    setActiveTab("add-tool");
  };

  const handleDeleteClick = (id) => {
    if (confirm("هل أنت متأكد تماماً وبشكل صارم من رغبتك بحذف هذه الأداة البرمجية نهائياً من قاعدة البيانات العامة لصفحة الجمهور؟")) {
      const updatedTools = tools.filter(t => t.id !== id);
      saveToolsToStorage(updatedTools);
      alert("تمت إزالة وحذف الأداة الهندسية وتزامن الواجهات بنجاح.");
    }
  };

  const handleDeleteRequest = (id) => {
    if (confirm("هل تود أرشفة وإزالة هذا الطلب الإستقصائي الوارد من صندوق الإدارة؟")) {
      const updatedRequests = requests.filter(r => r.id !== id);
      setRequests(updatedRequests);
      localStorage.setItem("smart_engineering_requests", JSON.stringify(updatedRequests));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "prompt-engineering",
      badge: "أداة حصرية",
      aiPlatform: "ChatGPT / Claude 3",
      description: "",
      secretPrompt: "",
      placeholdersInput: "",
      logic: "",
      variablesInput: "",
      validation: "",
      template: ""
    });
    setEditingId(null);
  };
// 3. اصق هذا الجزء بالكامل فوق الـ return الأساسية للملف

// دالة التحقق من البيانات
const handleLoginSubmit = (e) => {
  e.preventDefault();
  if (loginEmail === "admin@smartacademy.com" && loginPassword === "AdminPassword2026") {
    localStorage.setItem("smart_admin_logged_in", "true");
    setIsLoggedIn(true);
    setLoginError("");
  } else {
    setLoginError("❌ البيانات خاطئة!");
  }
};

// حاجز الحماية: إذا لم يسجل الدخول، اقطع الكود واعرض صفحة اللوجن فقط
if (!isLoggedIn) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a192f", direction: "rtl" }}>
      <form onSubmit={handleLoginSubmit} style={{ background: "#112240", padding: "40px", borderRadius: "10px", width: "100%", maxWidth: "400px" }}>
        <h2 style={{ color: "#64ffda", textAlign: "center" }}>🔐 تسجيل الدخول</h2>
        {loginError && <p style={{ color: "red", textAlign: "center" }}>{loginError}</p>}
        
        <input type="email" placeholder="الإيميل" required onChange={(e) => setLoginEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px" }} />
        <input type="password" placeholder="كلمة السر" required onChange={(e) => setLoginPassword(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px" }} />
        
        <button type="submit" style={{ width: "100%", padding: "12px", background: "#64ffda", color: "#0a192f", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer" }}>دخول</button>
      </form>
    </div>
  );
}

// 👈 الـ return الأساسية للوحة التحكم الخاصة بك تأتي هنا تلقائياً...
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        {/* الهيدر الفني للوحة التحكم المطلقة */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600/15 p-3 rounded-xl border border-red-500/30 shadow-lg">
              <ShieldAlert className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">لوحة تحكم وإدارة برمجيات منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-0.5">التحكم الفوري الشامل بتبويبات البرمجيات والأدوات، تعديل حقول المعادلات ومعالجة الملفات الواردة من الجمهور</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { resetForm(); setActiveTab("add-tool"); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
            >
              <PlusCircle className="h-4 w-4" />
              <span>إدراج أداة برمجية جديدة للجمهور</span>
            </button>
            <button
              onClick={() => window.open("/software-tools", "_blank")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <Eye className="h-4 w-4" />
              <span>معاينة واجهة الجمهور الحية ↗</span>
            </button>
          </div>
        </header>

        {/* علامات تبويب الإدارة والتحكم الداخلي */}
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("tools-list")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${activeTab === "tools-list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            استعراض وتعديل الأدوات المنشورة بقائمة الجمهور ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab("add-tool")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${activeTab === "add-tool" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            {editingId ? "مواءمة وتعديل معايير الأداة المحددة" : "نشر وإدراج أداة تخصصية جديدة"}
          </button>
          <button
            onClick={() => setActiveTab("received-requests")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all relative ${activeTab === "received-requests" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            طلبات الأدوات الخاصة المستلمة من الجمهور ({requests.length})
            {requests.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse font-bold">!</span>}
          </button>
        </div>

        {/* التبويب 1: جدول إدارة وتعديل وحذف برمجيات الجمهور */}
        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {tools.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                لا توجد أدوات أو برمجيات منشورة حالياً بقائمة الجمهور العامة. يرجى التوجه لعلامة تبويب الإضافة لإدراج أول مادة هندسية برمجية.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-800 text-slate-300 font-bold">
                      <th className="p-4">اسم وعنوان الأداة البرمجية</th>
                      <th className="p-4">القسم والتصنيف المندرج</th>
                      <th className="p-4">الشارة الترويجية</th>
                      <th className="p-4">بيئة الحساب / الذكاء الاصطناعي</th>
                      <th className="p-4 text-center">العمليات الإدارية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-bold text-white">{tool.title}</td>
                        <td className="p-4 text-slate-400 font-medium">
                          {tool.category === "prompt-engineering" && "هندسة الأوامر الذكية"}
                          {tool.category === "live-web-apps" && "تطبيقات الويب الحية"}
                          {tool.category === "automation-software" && "برمجيات الأتمتة المتقدمة"}
                          {tool.category === "ai-solutions" && "حلول الذكاء الاصطناعي موجه"}
                          {tool.category === "management-control" && "الإدارة والتحكم الفني"}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-800 px-2.5 py-1 text-[11px] rounded border border-slate-700 font-bold text-amber-400">
                            {tool.badge}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-cyan-400 font-medium">{tool.aiPlatform}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(tool)}
                              className="p-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-colors"
                              title="تعديل ومواءمة فنية"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(tool.id)}
                              className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                              title="حذف وإلغاء نهائي"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* التبويب 2: استمارة نشر وتعديل الأدوات والبرمجيات وضبط قيود التحقق والمعادلات السحابية */}
        {activeTab === "add-tool" && (
          <form onSubmit={handleSaveTool} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl max-w-4xl mx-auto">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                {editingId ? "تعديل ومواءمة محددات الأداة البرمجية القائمة" : "نشر وإعلان أداة هندسية أو برمجية حصرية جديدة للجمهور"}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">يرجى ملء كافة المعايير الهيكلية وتعبئة الفراغات بدقة متناهية لضمان عمل محركات معالجة المخططات، والخرائط الحرارية، ومحرك المعادلات الحسابية المباشر بكفاءة مطلقة تزامناً مع واجهات الجمهور.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الأداة البرمجية التفصيلي (يظهر للجمهور) *</label>
                <input 
                  type="text" required name="title" value={formData.title} onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="مثال: حاسبة هبوط القواعد الإنشائية أو نظام التدقيق الآلي للمخططات"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">التصنيف والتبويب المندرج في شريط التنقل الشامل *</label>
                <select 
                  name="category" value={formData.category} onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-300"
                >
                  <option value="prompt-engineering">هندسة الأوامر الذكية (Prompt Engineering)</option>
                  <option value="live-web-apps">تلييقات الويب الحية (Live Web Apps)</option>
                  <option value="automation-software">برمجيات الأتمتة المتقدمة (Automation Software)</option>
                  <option value="ai-solutions">حلول الذكاء الاصطناعي الموجه (AI Solutions)</option>
                  <option value="management-control">الإدارة والتحكم الفني الشامل (Management & Control)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الشارة التسويقية والترويجية لبطاقة العرض *</label>
                <input 
                  type="text" name="badge" value={formData.badge} onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="مثال: أداة حصرية، معتمد كودياً، معالجة حية..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">بيئة المعالجة أو منصة الـ AI الموصى بها *</label>
                <input 
                  type="text" name="aiPlatform" value={formData.aiPlatform} onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500 font-mono text-cyan-400"
                  placeholder="ChatGPT / Claude 3, Python SaaS Engine, Computer Vision..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">وصف فني جاذب يوضح الفائدة الهندسية والعملية للأداة بالتفصيل *</label>
              <textarea 
                rows="3" required name="description" value={formData.description} onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
                placeholder="اشرح للمكاتب والمهندسين آلية عمل الأداة وكيف تختصر أعمال الحصر والتدقيق الإنشائي بما يتوافق مع المعايير القياسية..."
              ></textarea>
            </div>

            {/* حقول تكوين هندسة الأوامر الذكية واكتشاف الأقواس */}
            {formData.category === "prompt-engineering" && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-blue-400">تطوير وتكوين نص الـ Prompt السري والكلمات المتغيرة</h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">نص الأمر الهندسي السري الكامل (استخدم الأقواس المربعة لإسناد الفراغات مثل [المادة]):</label>
                  <textarea 
                    rows="4" name="secretPrompt" value={formData.secretPrompt} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono leading-relaxed"
                    placeholder="مثال: أنت مهندس مواد مستشار، قم بتحليل جودة مادة [اسم المادة] الموردة لعنصر [العنصر الإنشائي] طبقاً لكود التصميم..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المتغيرات المستخرجة والمطابقة للبرومبت الخفي (مفصولة بفواصل , ):</label>
                  <input 
                    type="text" name="placeholdersInput" value={formData.placeholdersInput} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    placeholder="اسم المادة, العنصر الإنشائي"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">سيقوم النظام تلقائياً بقراءة المدخلات وتوليد حقول ديناميكية منسقة ومستقلة للجمهور قبل عملية التصدير والنسخ.</span>
                </div>
              </div>
            )}

            {/* حقول ربط وتغذية المعادلات الرياضية والـ JSON لتطبيقات الويب الحية */}
            {formData.category === "live-web-apps" && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-cyan-400">محرك تخطيط الحسابات الهندسية والمعادلات المباشرة (Math Engine Mapping)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المعادلة المنطقية الرياضية القابلة للتنفيذ المباشر (JavaScript Syntax):</label>
                    <input 
                      type="text" name="logic" value={formData.logic} onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono text-left"
                      placeholder="مثال: (0.85 * fc * Ac) / 1000"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5">شروط وقيود التحقق الصارمة للواجهة (Validation Rules):</label>
                    <input 
                      type="text" name="validation" value={formData.validation} onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                      placeholder="مثال: يجب أن تكون قيم مساحة المقطع والمقاومة موجبة"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">قالب صياغة التقرير الفني النهائي المظهر للمستخدم بالمتصفح:</label>
                  <input 
                    type="text" name="template" value={formData.template} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    placeholder="قوة تحمل العنصر الخرساني طبقاً لكود ACI هي: {Result} kN"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">هيكلية وأسماء حقول المتغيرات والوحدات للواجهة العامة (بنية مصفوفة JSON المعيارية):</label>
                  <textarea 
                    rows="5" name="variablesInput" value={formData.variablesInput} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono text-left leading-relaxed"
                    placeholder={`[\n  { "name": "Ac", "label": "مساحة المقطع الإجمالية", "type": "number", "unit": "mm²" },\n  { "name": "fc", "label": "مقاومة الخرسانة المميزة fc'", "type": "number", "unit": "MPa" }\n]`}
                  ></textarea>
                </div>
              </div>
            )}

            {/* تفعيل وتوجيه المحركات الخلفية وسكربتات البايثون المخصصة للمخططات لبرمجيات الأتمتة وحلول الذكاء الاصطناعي والإدارة */}
            {(formData.category === "automation-software" || formData.category === "ai-solutions" || formData.category === "management-control") && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-emerald-400">إعدادات محركات الأتمتة السحابية وتوجيه معالجة المخططات (SaaS Engine Mapping)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">تتيح لك هذه الخانات التكوينية ربط الواجهة التفاعلية بسكربتات Python ونماذج تشخيص ومعايرة المخططات والصور المرفوعة من الجمهور، لتوليد مخرجات معقدة تلقائياً (مثل جداول الحصر Excel، سجلات المخططات Transmittal Log، والخرائط الحرارية Heatmaps للتصدير بنظام الـ SaaS المعمول به في موقع الهندسة الذكية).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">اسم سكربت المعالجة الموجه خلفياً:</label>
                    <input type="text" placeholder="structural_audit_engine.py" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">الصيغ والامتدادات المقبولة للرفع والتدقيق:</label>
                    <input type="text" placeholder=".rvt, .ifc, .dwg, .dxf, .pdf, .png" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                type="button" onClick={() => { resetForm(); setActiveTab("tools-list"); }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
              >
                إلغاء العملية
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>حفظ الأداة البرمجية وتحديث واجهة الجمهور فوراً</span>
              </button>
            </div>
          </form>
        )}

        {/* التبويب 3: استعراض وإدارة طلبات الأدوات البرمجية الخاصة المستلمة والمربوطة بالإيميلات الرسمية الثلاثة */}
        {activeTab === "received-requests" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-800 pb-5 mb-6 gap-4">
              <div>
                <h2 className="text-base font-bold text-white">صندوق طلبات بناء الأدوات والبرمجيات الخاصة الواردة من الجمهور</h2>
                <p className="text-slate-400 text-xs mt-0.5">يتم رصد وحفظ هذه البيانات الواردة برمجياً وتوجيه الإشعارات فورياً للإيميلات الثلاثة المعتمدة التابعة للمنصة:</p>
              </div>
              <div className="flex flex-col text-left font-mono text-[10px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-0.5 select-all">
                <span className="text-blue-400 font-bold">✓ Smart.Engineering.Global@proton.me</span>
                <span className="text-cyan-400">✓ smart.engineering.global@tuta.io</span>
                <span className="text-emerald-400">✓ smartengineering.hr.global@gmail.com</span>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                صندوق الوارد فارغ. لم يتم تلقي أو استقبال أي طلبات خارجية لتطوير أدوات مخصصة من المكاتب الهندسية والجمهور حتى اللحظة.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-3 relative group hover:border-slate-700 transition-colors">
                    <button 
                      onClick={() => handleDeleteRequest(req.id)}
                      className="absolute left-4 top-4 text-slate-500 hover:text-red-400 p-1.5 rounded transition-colors"
                      title="أرشفة وإزالة الطلب النهائي من لوحة الأدمن"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <User className="h-4 w-4 text-blue-400" />
                        <span>{req.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-cyan-400" />
                        <span>{req.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-emerald-400" />
                        <span>{req.phone}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mr-auto">{req.date}</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-amber-400" />
                        <span>المواصفات الفنية والشرح التفصيلي البرمجي للأداة الهندسية المطلوبة:</span>
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{req.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}