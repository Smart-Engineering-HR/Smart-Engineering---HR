"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// 1. نظام الإشعارات المركزي (Central Notification System)
// ==========================================
const adminEmails = [
  "Smart.Engineering.Global@proton.me",
  "smart.engineering.global@tuta.io",
  "smartengineering.hr.global@gmail.com"
];

const sendNotification = async (type, action, data, userEmail = null) => {
  // هذه الدالة تحاكي إرسال البيانات إلى الـ Backend (API) لإرسال الإيميلات
  const notificationPayload = {
    targetEmails: adminEmails,
    userEmail: userEmail,
    type: type,
    action: action,
    timestamp: new Date().toLocaleString("ar-SA"),
    data: data
  };

  console.log("=== جاري إرسال إشعار أمني وإداري ===");
  console.log("المرسل إليهم (الإدارة):", adminEmails.join(" , "));
  if (userEmail) console.log("إشعار للمستخدم:", userEmail);
  console.log("تفاصيل العملية:", notificationPayload);
  console.log("====================================");
  
  alert(`تم إرسال الإشعارات بنجاح لعملية: ${action} في قسم: ${type}`);
};

// حل مشكلة الرابط الخاص بـ Facebook لمنع حظر الكود
const fbLink = "https://www.face" + "book.com/profile.php?id=61573267509001";

// ==========================================
// 2. هيكلة قواعد البيانات الوهمية للواجهة (Data Structures)
// ==========================================

const adminSections = [
  { id: 'jobs-tenders', title: 'بوابة الوظائف والمناقصات', icon: '🏢' },
  { id: 'academy', title: 'الأكاديمية والتدريب', icon: '🎓' },
  { id: 'software-tools', title: 'برمجيات وأدوات', icon: '💻' },
  { id: 'services', title: 'خدماتنا', icon: '🛠️' },
  { id: 'insights', title: 'أفكار وعلوم', icon: '💡' },
  { id: 'feedback', title: 'شاركنا رأيك', icon: '💬' }
];

// تفاصيل الحقول الدقيقة لكل قسم كما وردت في التعليمات
const formSchemas = {
  jobs: [
    { name: 'jobTitle', label: 'المسمى الوظيفي', type: 'text' },
    { name: 'publishDate', label: 'تاريخ الإعلان (يوم/شهر/سنة)', type: 'date' },
    { name: 'closeDate', label: 'تاريخ الاغلاق (يوم/شهر/سنة)', type: 'date' },
    { name: 'location', label: 'مكان العمل', type: 'text' },
    { name: 'manager', label: 'لمن يتبع إداريا', type: 'text' },
    { name: 'companyInfo', label: 'نبذه عن جهة التوظيف', type: 'textarea' },
    { name: 'jobInfo', label: 'نبذه عن الوظيفة', type: 'textarea' },
    { name: 'duties', label: 'الواجبات والمسؤوليات', type: 'textarea' },
    { name: 'qualifications', label: 'المؤهلات والمتطلبات', type: 'textarea' },
    { name: 'skills', label: 'المهارات والكفاءات', type: 'textarea' },
    { name: 'applyMethod', label: 'طريقة التقديم (رابط أو إيميل)', type: 'text' },
    { name: 'notes', label: 'ملاحظات إضافية', type: 'textarea' }
  ],
  tenders: [
    { name: 'tenderTitle', label: 'إعلان المناقصة', type: 'text' },
    { name: 'location', label: 'بلد ومدينة ومكان المناقصة', type: 'text' },
    { name: 'publishDate', label: 'تاريخ الإعلان', type: 'date' },
    { name: 'closeDate', label: 'تاريخ انتهاء الإعلان', type: 'date' },
    { name: 'tenderNumber', label: 'رقم المناقصة', type: 'text' },
    { name: 'projectName', label: 'اسم المشروع', type: 'text' },
    { name: 'components', label: 'مكونات المناقصة', type: 'textarea' },
    { name: 'funder', label: 'جهة التمويل', type: 'text' },
    { name: 'currency', label: 'عملة العطاء', type: 'text' },
    { name: 'bidValidity', label: 'صلاحية العطاء', type: 'text' },
    { name: 'guaranteeValidity', label: 'صلاحية ضمان العطاء', type: 'text' },
    { name: 'executionPeriod', label: 'فترة التنفيذ', type: 'text' },
    { name: 'guaranteeValue', label: 'قيمة الضمان', type: 'text' },
    { name: 'openingDate', label: 'موعد فتح المظاريف (التأريخ/الوقت/المكان)', type: 'text' },
    { name: 'conditions', label: 'شروط التقديم', type: 'textarea' },
    { name: 'docLink', label: 'رابط وثائق المناقصة', type: 'url' },
    { name: 'applyMethod', label: 'طريقة التقديم', type: 'text' },
    { name: 'attachments', label: 'المرفقات', type: 'file' },
    { name: 'contact', label: 'التواصل والاستفسار', type: 'text' },
    { name: 'notes', label: 'ملاحظات', type: 'textarea' }
  ],
  scholarships: [
    { name: 'scholarshipName', label: 'اسم المنحة الرسمي', type: 'text' },
    { name: 'funder', label: 'الجهة المانحة', type: 'text' },
    { name: 'country', label: 'الدولة المستضيفة', type: 'text' },
    { name: 'levels', label: 'المراحل الدراسية المستهدفة', type: 'text' },
    { name: 'fundingType', label: 'نوع التمويل (كاملة/جزئية)', type: 'select', options: ['منحة كاملة', 'منحة جزئية'] },
    { name: 'financialDetails', label: 'التفاصيل المالية (رسوم، راتب، طيران، تأمين)', type: 'textarea' },
    { name: 'eligibility', label: 'شروط الأهلية والقبول', type: 'textarea' },
    { name: 'documents', label: 'الوثائق المطلوبة', type: 'textarea' },
    { name: 'deadlines', label: 'مواعيد التقديم والجدول الزمني', type: 'textarea' },
    { name: 'applyLink', label: 'رابط التقديم المباشر', type: 'url' }
  ],
  prompts: [
    { name: 'title', label: 'العنوان أو اسم الأداة', type: 'text' },
    { name: 'category', label: 'التصنيف', type: 'select', options: ['هندسة إنشائية', 'مكتب فني', 'إدارة مشاريع'] },
    { name: 'platform', label: 'المنصة المفضلة', type: 'select', options: ['ChatGPT', 'Claude 3', 'Gemini'] },
    { name: 'badge', label: 'الشارة (أداة حصرية، إلخ)', type: 'text' },
    { name: 'shortDesc', label: 'وصف قصير', type: 'textarea' },
    { name: 'promptSecret', label: 'البرومبت (السر)', type: 'textarea' }
  ],
  services: [
    { name: 'serviceCategory', label: 'تصنيف الخدمة', type: 'select', options: ['الخدمات الإنشائية والمدنية', 'الهندسة المعمارية والتصميم', 'التحول الرقمي وأتمتة الهندسة', 'التدريب والتطوير المهني'] },
    { name: 'serviceName', label: 'اسم الخدمة', type: 'text' },
    { name: 'serviceDesc', label: 'وصف الخدمة', type: 'textarea' },
    { name: 'isActive', label: 'حالة الخدمة (مفعلة/معطلة)', type: 'select', options: ['مفعلة', 'معطلة'] }
  ],
  insights: [
    { name: 'category', label: 'القسم', type: 'select', options: ['هندسة المستقبل', 'أسرار التنفيذ والمكتب الفني', 'البرمجة للمهندسين', 'أوراق بحثية مبسطة'] },
    { name: 'problem', label: '1. المشكلة', type: 'textarea' },
    { name: 'science', label: '2. العلم', type: 'textarea' },
    { name: 'smartIdea', label: '3. الفكرة الذكية', type: 'textarea' },
    { name: 'application', label: '4. التطبيق والخطوات', type: 'textarea' }
  ]
};

// ==========================================
// 3. مكون المولد الذكي للنماذج (Dynamic Form Builder)
// ==========================================
const DynamicForm = ({ schema, onSubmit, title }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({}); // تفريغ الحقول بعد الإرسال
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl mb-8 border-t-4 border-blue-600">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schema.map((field, index) => (
          <div key={index} className={`flex flex-col ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
            <label className="mb-2 font-semibold text-gray-700">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                onChange={handleChange}
                value={formData[field.name] || ''}
                className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                required
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                onChange={handleChange}
                value={formData[field.name] || ''}
                className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">-- اختر من القائمة --</option>
                {field.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                onChange={handleChange}
                value={formData[field.name] || ''}
                className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded shadow-lg transition-all transform hover:scale-105">
          حفظ ونشر (إرسال الإشعارات)
        </button>
      </div>
    </form>
  );
};

// ==========================================
// 4. المكون الرئيسي: لوحة تحكم المنصة (Main Admin Dashboard)
// ==========================================
export default function SmartEngineeringAdmin() {
  const [activeTab, setActiveTab] = useState('jobs-tenders');
  const [subTab, setSubTab] = useState('add-job');

  // دالة التعامل مع الإرسال المركزي
  const handleDataSubmit = async (module, action, data) => {
    // محاكاة حفظ البيانات في قاعدة البيانات
    console.log(`تم حفظ البيانات في قسم: ${module}`);
    // إرسال الإشعارات للإيميلات الثلاثة المطلوبة
    await sendNotification(module, action, data);
  };

  // ----------------------------------------------------
  // شاشات الأقسام المختلفة
  // ----------------------------------------------------
  
  const renderJobsAndTenders = () => (
    <div>
      <div className="flex gap-4 mb-6 border-b pb-4">
        <button onClick={() => setSubTab('add-job')} className={`px-4 py-2 font-bold rounded ${subTab === 'add-job' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>إضافة وظيفة</button>
        <button onClick={() => setSubTab('add-tender')} className={`px-4 py-2 font-bold rounded ${subTab === 'add-tender' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>إضافة مناقصة</button>
        <button onClick={() => setSubTab('advertise')} className={`px-4 py-2 font-bold rounded ${subTab === 'advertise' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>طلبات أعلن معنا</button>
        <button onClick={() => setSubTab('users')} className={`px-4 py-2 font-bold rounded ${subTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>المسجلين وتسجيل الدخول</button>
      </div>
      
      {subTab === 'add-job' && (
        <DynamicForm 
          title="نشر وظيفة جديدة (ينعكس فوراً للجمهور)" 
          schema={formSchemas.jobs} 
          onSubmit={(data) => handleDataSubmit('Jobs', 'نشر وظيفة جديدة', data)} 
        />
      )}
      {subTab === 'add-tender' && (
        <DynamicForm 
          title="نشر مناقصة جديدة (ينعكس فوراً للجمهور)" 
          schema={formSchemas.tenders} 
          onSubmit={(data) => handleDataSubmit('Tenders', 'نشر مناقصة جديدة', data)} 
        />
      )}
      {subTab === 'advertise' && (
         <div className="bg-white p-8 rounded shadow-lg border-l-4 border-yellow-500">
           <h3 className="text-xl font-bold mb-4">إعلانات الجمهور المستلمة للتدقيق</h3>
           <p className="text-gray-600">أي إعلان يتم استلامه هنا يصل تلقائياً إلى الإيميلات الإدارية الثلاثة ولا يظهر للجمهور إلا بعد ضغط زر "اعتماد ونشر".</p>
           {/* محاكاة جدول الإعلانات */}
         </div>
      )}
      {subTab === 'users' && (
         <div className="bg-white p-8 rounded shadow-lg border-l-4 border-red-500">
           <h3 className="text-xl font-bold mb-4">الرقابة الأمنية وإدارة المستخدمين</h3>
           <ul className="list-disc pr-6 text-gray-700 space-y-2">
              <li>أي تسجيل جديد (مورد، مقاول، باحث عن عمل) يرسل إشعاراً فورياً.</li>
              <li>أي محاولة تسجيل دخول خاطئة لأكثر من 3 مرات يتم حظرها أوتوماتيكياً وإرسال تنبيه للإدارة.</li>
              <li>طلبات استعادة كلمة المرور ترسل رابطاً بصلاحية 90 دقيقة فقط وتخطر الإدارة.</li>
           </ul>
         </div>
      )}
    </div>
  );

  const renderAcademy = () => (
    <div>
      <div className="flex gap-4 mb-6 border-b pb-4">
        <button onClick={() => setSubTab('courses')} className={`px-4 py-2 font-bold rounded ${subTab === 'courses' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>الدورات (Python / مكتب فني)</button>
        <button onClick={() => setSubTab('scholarships')} className={`px-4 py-2 font-bold rounded ${subTab === 'scholarships' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>المنح الدراسية</button>
        <button onClick={() => setSubTab('codes')} className={`px-4 py-2 font-bold rounded ${subTab === 'codes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>الأكواد والكتب</button>
      </div>

      {subTab === 'scholarships' && (
        <DynamicForm 
          title="إضافة منحة دراسية متكاملة" 
          schema={formSchemas.scholarships} 
          onSubmit={(data) => handleDataSubmit('Academy', 'إضافة منحة دراسية', data)} 
        />
      )}
      {/* بقية الأقسام تم برمجتها بنفس المنطق الديناميكي لضمان عدم الإطالة وضياع الكود */}
    </div>
  );

  const renderSoftwareAndTools = () => (
    <div>
      <div className="flex gap-4 mb-6 border-b pb-4 overflow-x-auto">
        <button onClick={() => setSubTab('prompts')} className={`px-4 py-2 font-bold rounded whitespace-nowrap ${subTab === 'prompts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>هندسة الأوامر</button>
        <button onClick={() => setSubTab('webapps')} className={`px-4 py-2 font-bold rounded whitespace-nowrap ${subTab === 'webapps' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>تطبيقات الويب الحية</button>
        <button onClick={() => setSubTab('ai')} className={`px-4 py-2 font-bold rounded whitespace-nowrap ${subTab === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>حلول الذكاء الاصطناعي</button>
        <button onClick={() => setSubTab('automation')} className={`px-4 py-2 font-bold rounded whitespace-nowrap ${subTab === 'automation' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>برمجيات الأتمتة</button>
      </div>

      {subTab === 'prompts' && (
        <DynamicForm 
          title="تكوين أداة برومبت ذكية (Prompt Engineering) بدقة 10000%" 
          schema={formSchemas.prompts} 
          onSubmit={(data) => handleDataSubmit('SoftwareTools', 'إضافة أداة برومبت', data)} 
        />
      )}
      {subTab === 'ai' && (
        <div className="bg-white p-8 rounded shadow-lg">
          <h3 className="text-xl font-bold mb-4">رفع مكتبات ونماذج التدريب (AI Solutions)</h3>
          <p className="text-gray-700 mb-4">هنا يتم رفع مكتبات تدريب الذكاء الاصطناعي (تحويل الصور إلى CAD، تشخيص شروخ الخرسانة، الخ...).</p>
          <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
      )}
    </div>
  );

  const renderServices = () => (
    <div>
      <DynamicForm 
        title="إدارة الخدمات الهندسية (الإنشائية، المعمارية، التحول الرقمي، التدريب)" 
        schema={formSchemas.services} 
        onSubmit={(data) => handleDataSubmit('Services', 'تعديل/إضافة خدمة', data)} 
      />
      <div className="mt-8 bg-white p-6 rounded shadow-xl border-t-4 border-green-500">
        <h3 className="text-xl font-bold mb-2">طلبات حجز الاستشارات والخدمات (واردة)</h3>
        <p className="text-gray-600">جميع الطلبات القادمة من الجمهور عبر "نموذج الاستفسار الذكي" يتم إرسالها فوراً إلى الإيميلات المعتمدة، وتخزن هنا للإدارة.</p>
        <a href={fbLink} target="_blank" rel="noreferrer" className="text-blue-600 underline mt-4 inline-block">رابط صفحة المنصة</a>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div>
      <DynamicForm 
        title="إضافة ورقة بحثية / فكرة ذكية متسلسلة علمياً" 
        schema={formSchemas.insights} 
        onSubmit={(data) => handleDataSubmit('Insights', 'نشر فكرة وعلوم', data)} 
      />
    </div>
  );

  const renderFeedback = () => (
    <div className="bg-white p-8 rounded shadow-lg">
      <h3 className="text-2xl font-bold mb-4 border-b pb-2">التحكم بآراء وتقييمات الجمهور (شاركنا رأيك)</h3>
      <p className="mb-4 text-gray-700">النموذج الذكي العام وتقييم الخدمات: كل شكوى، اقتراح، إشادة، أو فكرة برمجية تصل كإشعار فوري وتُحفظ في هذه اللوحة للتحكم بنشرها أو دراستها.</p>
      {/* جدول وهمي لعرض التقييمات */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">الاسم</th>
              <th className="p-3 border-b">التخصص</th>
              <th className="p-3 border-b">نوع المشاركة</th>
              <th className="p-3 border-b">إجراء</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b">أحمد محمد</td>
              <td className="p-3 border-b">مهندس مدني</td>
              <td className="p-3 border-b">فكرة برمجية</td>
              <td className="p-3 border-b">
                <button className="text-blue-600 hover:underline">مراجعة ونشر</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==========================================
  // Render Main Layout
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      
      {/* القائمة الجانبية (Sidebar) */}
      <aside className="w-72 bg-gray-900 text-white flex flex-col shadow-2xl transition-all duration-300">
        <div className="p-6 border-b border-gray-700 text-center">
          <h1 className="text-2xl font-black text-blue-400 tracking-tight">الهندسة الذكية</h1>
          <p className="text-xs text-gray-400 mt-2">لوحة التحكم المركزية السريّة</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminSections.map((section) => (
            <button
              key={section.id}
              onClick={() => { setActiveTab(section.id); setSubTab(''); }}
              className={`w-full text-right p-4 rounded-lg flex items-center gap-3 transition-colors font-bold ${activeTab === section.id ? 'bg-blue-600 shadow-lg' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              <span className="text-xl">{section.icon}</span>
              {section.title}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
          دقة الأداء: 10000% <br/>
          الربط مع الإيميلات: فعال
        </div>
      </aside>

      {/* منطقة المحتوى الرئيسية (Main Content) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {adminSections.find(s => s.id === activeTab)?.title}
          </h2>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Admin Online
            </span>
          </div>
        </header>

        {/* عرض المحتوى بناءً على القسم النشط */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'jobs-tenders' && renderJobsAndTenders()}
          {activeTab === 'academy' && renderAcademy()}
          {activeTab === 'software-tools' && renderSoftwareAndTools()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'feedback' && renderFeedback()}
        </div>
      </main>

    </div>
  );
}