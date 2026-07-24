"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Cpu, Settings, ShieldAlert, Sliders, PlusCircle, 
  Trash2, Edit, Save, Eye, User, Mail, Phone, ArrowLeft 
} from "lucide-react";

export default function SoftwareToolsAdmin() {
  const [tools, setTools] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("tools-list");

  // نموذج إضافة وتعديل الأدوات والبرمجيات للجمهور
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "prompt-engineering",
    badge: "أداة حصرية",
    aiPlatform: "ChatGPT",
    description: "",
    secretPrompt: "",
    placeholdersInput: "", // يتم معالجتها وفصلها بفواصل لمصفوفة
    logic: "",
    variablesInput: "", // هيكل حقول المتغيرات بصيغة JSON
    validation: "",
    template: ""
  });

  // مزامنة فورية تامة وقراءة من الـ localStorage لضمان التناسق دون لمس الأكواد
  useEffect(() => {
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

  // حفظ ونشر الأداة أو تعديلها مع تعبئة كافة البيانات بدون إهمال أي سياق فني
  const handleSaveTool = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("يرجى تعبئة الحقول الهيكلية الأساسية كالعنوان الفني والوصف.");
      return;
    }

    // تفكيك متغيرات البرومبت المستخرجة من الأقواس
    const placeholders = formData.placeholdersInput
      ? formData.placeholdersInput.split(",").map(p => p.trim())
      : [];

    // التحقق من تركيبة الـ JSON لمتغيرات تطبيقات الويب الحية
    let variables = [];
    if (formData.category === "live-web-apps" && formData.variablesInput) {
      try {
        variables = JSON.parse(formData.variablesInput);
      } catch (err) {
        alert("تنبيه صارم: بنية متغيرات الواجهة ليست JSON صحيحة، تم تطبيق مصفوفة نموذجية افتراضية للحقل.");
        variables = [
          { name: "Ac", label: "مساحة المقطع الخرساني (mm²)", type: "number", unit: "mm²" },
          { name: "fc", label: "المقاومة المميزة للخرسانة (MPa)", type: "number", unit: "MPa" }
        ];
      }
    }

    let updatedTools = [...tools];

    if (editingId) {
      // تعديل فوري ومواءمة للبيانات القائمة
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
      alert("تمت مواءمة وتحديث تفاصيل الأداة البرمجية وعكسها فوراً للجمهور.");
    } else {
      // إضافة أداة ونشر إعلان برمجية جديدة كلياً
      const newTool = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        badge: formData.badge,
        aiPlatform: formData.aiPlatform,
        description: formData.description,
        secretPrompt: formData.secretPrompt,
        placeholders,
        logic: formData.logic || "(0.85 * fc * Ac) / 1000",
        variables: variables.length > 0 ? variables : [
          { name: "Ac", label: "مساحة المقطع الخرساني (mm²)", type: "number", unit: "mm²" },
          { name: "fc", label: "المقاومة المميزة للخرسانة (MPa)", type: "number", unit: "MPa" }
        ],
        validation: formData.validation || "لا يقبل قيم أقل من الصفر أو سالبة",
        template: formData.template || "قوة تحمل العنصر الخرساني الإجمالية هي: {Result} kN"
      };
      updatedTools.push(newTool);
      alert("تم بنجاح نشر الأداة البرمجية الجديدة وإتاحتها فوراً في واجهة الجمهور العامة.");
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
      aiPlatform: tool.aiPlatform || "ChatGPT",
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
    if (confirm("هل أنت متأكد تماماً وبشكل صارم من حذف هذه الأداة البرمجية نهائياً من قائمة الجمهور؟")) {
      const updatedTools = tools.filter(t => t.id !== id);
      saveToolsToStorage(updatedTools);
      alert("تم حذف الأداة وتحديث واجهة قنوات الجمهور بنجاح تزامني.");
    }
  };

  const handleDeleteRequest = (id) => {
    if (confirm("هل تريد أرشفة وإزالة هذا الطلب الإستقصائي الوارد من لوحة التحكم؟")) {
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
      aiPlatform: "ChatGPT",
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        {/* هيدر لوحة التحكم الفنية الشاملة */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-3 rounded-xl shadow-lg shadow-red-500/20">
              <ShieldAlert className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">لوحة تحكم برمجيات منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-0.5">لوحة الأدمن المسؤولة عن التحكم المطلق بكل ما يظهر بقائمة أدوات الجمهور وعكس التغييرات فوراً</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { resetForm(); setActiveTab("add-tool"); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              <span>نشر وإعلان أداة جديدة</span>
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

        {/* التبويبات العلوية لإدارة الأدمن والطلبات والايميلات */}
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("tools-list")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${activeTab === "tools-list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            إدارة وتعديل الأدوات المنشورة حالياً ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab("add-tool")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${activeTab === "add-tool" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            {editingId ? "تعديل ومواءمة بيانات أداة" : "إضافة ونشر أداة هندسية جديدة"}
          </button>
          <button
            onClick={() => setActiveTab("received-requests")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all relative ${activeTab === "received-requests" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            طلبات الأدوات الخاصة المستلمة من الجمهور ({requests.length})
            {requests.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">!</span>}
          </button>
        </div>

        {/* تبويب 1: جدول استعراض وتعديل وإلغاء أدوات الجمهور */}
        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {tools.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                لا توجد أدوات أو برمجيات منشورة بقائمة الجمهور حالياً. يرجى الذهاب لتبويب النشر لإدراج أول مادة برمجية.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-800/70 border-b border-slate-800 text-slate-300 text-xs font-bold">
                      <th className="p-4">اسم الأداة البرمجية</th>
                      <th className="p-4">القسم والتصنيف المندرج</th>
                      <th className="p-4">الشارة التسويقية</th>
                      <th className="p-4">بيئة الذكاء الاصطناعي المفضلة</th>
                      <th className="p-4 text-center">التحكم والعمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-bold text-white">{tool.title}</td>
                        <td className="p-4 text-slate-400">
                          {tool.category === "prompt-engineering" && "هندسة الأوامر"}
                          {tool.category === "live-web-apps" && "تطبيقات الويب الحية"}
                          {tool.category === "automation-software" && "برمجيات الأتمتة"}
                          {tool.category === "ai-solutions" && "حلول الذكاء الاصطناعي"}
                          {tool.category === "management-control" && "الإدارة والتحكم"}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-800 px-2.5 py-1 text-[11px] rounded border border-slate-700 font-bold text-amber-400">
                            {tool.badge}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-cyan-400">{tool.aiPlatform}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(tool)}
                              className="p-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-colors"
                              title="تعديل تفصيلي ومواءمة"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(tool.id)}
                              className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                              title="حذف وإزالة"
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

        {/* تبويب 2: واجهة نشر وإعلان أداة جديدة وتعبئة كامل التفاصيل الهيكلية */}
        {activeTab === "add-tool" && (
          <form onSubmit={handleSaveTool} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-1">
              {editingId ? "تعديل ومواءمة معايير البرمجية القائمة" : "نشر وإعلان أداة هندسية برمجية جديدة بالكامل للجمهور"}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">يرجى تغذية كافة الحقول الفنية المحددة أدناه لضمان ظهور الأداة بالشكل التفاعلي اللائق والذكي للجمهور تزامناً مع الـ localStorage والمحركات الحية.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم وعنوان الأداة البرمجية (الظاهر للجمهور) *</label>
                <input 
                  type="text" required name="title" value={formData.title} onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="مثال: حاسبة التحمل القصي أو الكود الذكي لتشخيص التصدعات"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">التصنيف الإداري والتبويب المندرج *</label>
                <select 
                  name="category" value={formData.category} onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="prompt-engineering">هندسة الأوامر (Prompt Engineering)</option>
                  <option value="live-web-apps">تطبيقات الويب الحية (Live Web Apps)</option>
                  <option value="automation-software">برمجيات الأتمتة (Automation Software)</option>
                  <option value="ai-solutions">حلول الذكاء الاصطناعي (AI Solutions)</option>
                  <option value="management-control">الإدارة والتحكم (Management & Control)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الشارة التسويقية والترويجية لبطاقة العرض *</label>
                <input 
                  type="text" name="badge" value={formData.badge} onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="مثال: أداة حصرية، تفاعل فوري، توفير وقت..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">بيئة ومنصة الـ AI الموصى بها (لإشعار المستخدم) *</label>
                <input 
                  type="text" name="aiPlatform" value={formData.aiPlatform} onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="ChatGPT, Claude 3, Gemini, محرك داخلي مخصص..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">وصف تفصيلي جاذب يوضح الفائدة الهندسية العملية للأداة *</label>
              <textarea 
                rows="3" required name="description" value={formData.description} onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
                placeholder="اشرح للمهندسين والمكاتب الاستشارية كيف يختصر تشغيل هذه الأداة الخطوات التقليدية ويطابق اشتراطات الأكواد القياسية المعتمدة..."
              ></textarea>
            </div>

            {/* تفاصيل وحقول قسم هندسة الأوامر الذكية واكتشاف الأقواس */}
            {formData.category === "prompt-engineering" && (
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-blue-400">تكوين وتطوير الـ Prompt الخفي والديناميكي</h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">نص الأمر الهندسي السري والكامل (ضع الأقواس المربعة للمتغيرات):</label>
                  <textarea 
                    rows="4" name="secretPrompt" value={formData.secretPrompt} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono leading-relaxed"
                    placeholder="مثال: أنت مهندس استشاري خبير، قم بتحليل جودة مادة [اسم المادة] الموردة لمشروع [نوع العنصر]..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">المتغيرات المستخرجة والمطابقة للأقواس (مفصولة بفواصل , ):</label>
                  <input 
                    type="text" name="placeholdersInput" value={formData.placeholdersInput} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    placeholder="اسم المادة, نوع العنصر"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">سيقوم النظام تلقائياً برصد الكلمات وتوليد حقول إدخال مستقلة وجاذبة للمستخدم في واجهة الجمهور العامة.</span>
                </div>
              </div>
            )}

            {/* تفاصيل وحقول محرك المعادلات لتطبيقات الويب الحية */}
            {formData.category === "live-web-apps" && (
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-cyan-400">تغذية ومطابقة المعادلات الحسابية المباشرة (Math Engine Mapping)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">المعادلة الحسابية المنطقية القابلة للتنفيذ (JavaScript logic):</label>
                    <input 
                      type="text" name="logic" value={formData.logic} onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono text-left"
                      placeholder="مثال: (0.85 * fc * Ac) / 1000"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">قواعد قيود والتحقق من المدخلات (Validation Constraints):</label>
                    <input 
                      type="text" name="validation" value={formData.validation} onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      placeholder="مثال: المساحة والمقاومة يجب أن تكون قيماً موجبة"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">صيغة قالب النتيجة والتقرير الفني الهندسي المخرج:</label>
                  <input 
                    type="text" name="template" value={formData.template} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    placeholder="مثال: قوة تحمل العنصر الإجمالية المعتمدة بكود ACI هي: {Result} كيلو نيوتن"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">تعريف الحقول والمسميات والوحدات للواجهة العامة (بنية مصفوفة مخصصة JSON):</label>
                  <textarea 
                    rows="5" name="variablesInput" value={formData.variablesInput} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono text-left"
                    placeholder={`[\n  { "name": "Ac", "label": "مساحة المقطع الإجمالية", "type": "number", "unit": "mm²" },\n  { "name": "fc", "label": "مقاومة الخرسانة المميزة fc'", "type": "number", "unit": "MPa" }\n]`}
                  ></textarea>
                </div>
              </div>
            )}

            {/* تفاصيل الأقسام الخلفية لبرمجيات الأتمتة وحلول الذكاء الاصطناعي والإدارة والتحكم الشامل للموقع */}
            {(formData.category === "automation-software" || formData.category === "ai-solutions" || formData.category === "management-control") && (
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-purple-400">إعدادات المحرك الخلفي والربط البرمجي السحابي (SaaS Engines Config)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">من خلال هذا الحقل التكويني، يمكنك إسناد ملفات المحرك البرمجي المستقلة (مثل سكربتات Python أو نماذج معالجة المخططات الهندسية السحابية) ليتم تفعيلها فوراً في واجهة المستخدم، وتوليد مخرجات معيارية بصيغة تقارير Excel وحصر كميات دون الحاجة لتعديل الشفرة المصدرية للمنصة.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="اسم ملف السكربت الموجه (مثال: structural_mesh_ai.py)" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white font-mono" />
                  <input type="text" placeholder="امتدادات وصيغ الملفات المقبولة (مثل .rvt, .ifc, .dxf)" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                type="button" onClick={() => { resetForm(); setActiveTab("tools-list"); }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
              >
                إلغاء الإجراء
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>حفظ التعديلات ونشر البرمجية فوراً للجمهور</span>
              </button>
            </div>
          </form>
        )}

        {/* تبويب 3: استعراض وإدارة وحفظ طلبات البرمجيات الخاصة المربوطة بالايميلات الرسمية للموقع */}
        {activeTab === "received-requests" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-6 gap-2">
              <div>
                <h2 className="text-base font-bold text-white">صندوق طلبات البرمجيات الهندسية المخصصة من الجمهور</h2>
                <p className="text-slate-400 text-xs mt-0.5">يتم رصد وحفظ كافة البيانات المرسلة هنا برمجياً وتوجيه الإشعارات فورياً للإيميلات الخاصة بالموقع:</p>
              </div>
              <div className="flex flex-col text-left font-mono text-[10px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-blue-400 font-bold">✓ Smart.Engineering.Global@proton.me</span>
                <span>✓ smart.engineering.global@tuta.io</span>
                <span>✓ smartengineering.hr.global@gmail.com</span>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                لم يتم تلقي أو استقبال أي طلبات خارجية خاصة من الجمهور والمكاتب الهندسية حتى هذه اللحظة.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 relative group hover:border-slate-700 transition-colors">
                    <button 
                      onClick={() => handleDeleteRequest(req.id)}
                      className="absolute left-4 top-4 text-slate-500 hover:text-red-400 p-1.5 rounded transition-colors"
                      title="أرشفة وإزالة الطلب من القائمة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1 text-white font-bold">
                        <User className="h-3.5 w-3.5 text-blue-400" />
                        <span>{req.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{req.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{req.phone}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mr-auto">{req.date}</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">المواصفات الفنية والشرح التفصيلي للأداة المطلوبة:</span>
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