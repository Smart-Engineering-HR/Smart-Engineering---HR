'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const revalidate = 0; // إجبار الصفحة على جلب أحدث البيانات دائماً (Dynamic Rendering)
export const dynamic = 'force-dynamic';
export default function JobsTendersPublic() {
  const router = useRouter();
  
  // حالات التبويب والبيانات والبحث
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'tenders' | 'advertise' | 'register' | 'login'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // لعرض تفاصيل الوظيفة أو المناقصة بالكامل في صفحة جديدة/عرض منفصل

  // مصفوفات البيانات التي يتم ربطها وتحكم الأدمن بها ديناميكياً (مخزنة محلياً للمثال لتعمل فوراً)
  const [jobs, setJobs] = useState([
    { id: 1, title: 'مهندس موقع مدني أول', company: 'شركة الإعمار الذكي للإنشاءات', publishDate: '2026/06/25', endDate: '2026/07/25', category: 'الهندسة المدنية', location: 'الموقع الرئيسي - صنعاء', reportsTo: 'مدير المشاريع الإنشائية', companyBio: 'شركة رائدة في مجال التطوير العقاري والبنية التحتية والمباني الذكية.', jobBio: 'الإشراف الكامل على التنفيذ الهندسي ومطابقة المخططات في الموقع.', duties: 'متابعة المقاولين، رفع التقارير الدورية، ضبط الجودة، وفحص المواد المستلمة.', qualifications: 'بكالوريوس هندسة مدنية + خبرة لا تقل عن 7 سنوات في المشاريع الكبرى.', skills: 'إجادة برامج AutoCAD, Primavera، ومهارات قيادة فرق العمل الميدانية.', notes: 'الأولوية لمن يمتلك سيارة خاصة ورخصة قيادة سارية المفعول.', applyMethod: 'email', applyEmail: 'smartengineering.hr.global@gmail.com' },
    { id: 2, title: 'مطور واجهات Next.js محترف', company: 'منصة الهندسة الذكية التقنية', publishDate: '2026/06/28', endDate: '2026/08/10', category: 'تكنولوجيا المعلومات', location: 'عن بعد / الهجين', reportsTo: 'رئيس قسم التطوير البرمجي', companyBio: 'منصة هندسية تقنية متكاملة تهدف لأتمتة العمليات الهندسية وقطاع التوظيف.', jobBio: 'بناء وتطوير واجهات برمجية سريعة ومتجاوبة ومستقرة للبوابات الإلكترونية.', duties: 'تحويل التصاميم إلى أكواد، تحسين أداء الصفحات، وتكامل الـ APIs مع محركات الإشعارات.', qualifications: 'خبرة عملية مثبته لا تقل عن 3 سنوات في React وNext.js App Router.', skills: 'اتقان Tailwind CSS، التعامل مع معالجة الحالات المستقرة، وتحسين SEO.', notes: 'يجب إرفاق معرض الأعمال السابقة والمشاريع التي تم تنفيذها بالكامل.', applyMethod: 'url', applyUrl: 'http://localhost:3000/jobs-tenders/apply' }
  ]);

  const [tenders, setTenders] = useState([
    { id: 1, title: 'توريد وتركيب منظومات طاقة شمسية ذكية للمجمع الهندسي', company: 'وزارة الأشغال العامة والمشاريع', publishDate: '2026/06/20', endDate: '2026/07/30', location: 'تعز، اليمن', announcement: 'تعلن الوزارة عن طرح مناقصة عامة للشركات المؤهلة لتوريد منظومات طاقة نظيفة ومتكاملة.', tenderNumber: 'SE-TEND-2026-004', projectName: 'مشروع الطاقة المستدامة للمرافق الحيوية', components: 'ألواح شمسية عالية الجودة، إنفرترات ذكية، بطاريات ليثيوم، كابلات وهياكل تثبيت مجلفنة.', fundingBody: 'صندوق الدعم الإنمائي المشترك', currency: 'دولار أمريكي', validity: '90 يوماً من تاريخ فتح المظاريف', guaranteeValidity: '120 يوماً من تاريخ التقديم', executionPeriod: '60 يوماً تقويمياً', guaranteeValue: '5000 دولار أمريكي كضمان بنكي مشروط', openingDetails: 'التاريخ: 2026/08/01 - الوقت: 10:00 صباحاً - المكان: قاعة الاجتماعات الرئيسية بمبنى الوزارة.', conditions: 'تقديم السجل التجاري والبطاقة الضريبية والتأمينية سارية المفعول، وخبرة سابقة في مجالات مشابهة.', documentsLink: 'https://smart-engineering.com/docs/tender-004', applyMethod: 'تسليم يدوي في مظاريف مغلقة بالشمع الأحمر إلى مقر اللجنة العليا للمناقصات.', attachments: 'كراسة الشروط والمواصفات وجداول الكميات التفصيلية.', accessLink: 'https://smart-engineering.com/tenders/buy-004', contactInfo: 'Smart.Engineering.Global@proton.me', notes: 'لا تقبل العطاءات التي ترد بعد الموعد المحدد أو غير المصحوبة بضمان العطاء.' }
  ]);

  // تحديث البيانات من LocalStorage بشكل دوري لمزامنة تحكم الأدمن فوراً دون تعديل كود
  useEffect(() => {
    const savedJobs = localStorage.getItem('se_jobs');
    const savedTenders = localStorage.getItem('se_tenders');
    if (savedJobs) setJobs(JSON.parse(savedJobs));
    if (savedTenders) setTenders(JSON.parse(savedTenders));
  }, [activeTab]);

  // نموذج أعلن معنا
  const [advForm, setAdvForm] = useState({ companyName: '', contactPerson: '', phone: '', email: '', address: '', website: '', adType: 'وظيفة', moreInfo: '' });
  const [advStatus, setAdvStatus] = useState('');

  const handleAdvSubmit = async (e) => {
    e.preventDefault();
    setAdvStatus('جاري إرسال طلب الإعلان والتدقيق الأمني...');
    const res = await fetch('/api/notificationEngine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'CLIENT_ADVERTISEMENT_REQUEST', data: advForm })
    });
    if (res.ok) {
      setAdvStatus('تم إرسال البيانات بنجاح! يرجى تعبئة البيانات وارسالها وسيتم التواصل معكم قريباً بعد مراجعة الأدمن وتصنيفها ونشرها للجمهور.');
      // حفظ الإعلان في المسودة المؤقتة للأدمن ليقوم بمراجعته
      const tempRequests = JSON.parse(localStorage.getItem('se_adv_requests') || '[]');
      tempRequests.push({ ...advForm, id: Date.now() });
      localStorage.setItem('se_adv_requests', JSON.stringify(tempRequests));
      setAdvForm({ companyName: '', contactPerson: '', phone: '', email: '', address: '', website: '', adType: 'وظيفة', moreInfo: '' });
    } else {
      setAdvStatus('فشل في إرسال الإعلان، يرجى المحاولة لاحقاً.');
    }
  };

  // نموذج سجل (باحث عن عمل / مورد)
  const [regType, setRegType] = useState('seeker'); // 'seeker' | 'vendor'
  const [regForm, setRegForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
  const [regStatus, setRegStatus] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirmPassword) {
      alert('كلمة المرور وتأكيدها غير متطابقين!');
      return;
    }
    if (!regForm.agreeTerms) {
      alert('يجب الموافقة على شروط الخصوصية للمنصة!');
      return;
    }
    setRegStatus('جاري تسجيل حسابك وإرسال الإشعارات المشددة...');
    
    const newUser = { ...regForm, role: regType, id: Date.now() };
    const res = await fetch('/api/notificationEngine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'NEW_USER_REGISTRATION', data: newUser })
    });

    if (res.ok) {
      const existingUsers = JSON.parse(localStorage.getItem('se_registered_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('se_registered_users', JSON.stringify(existingUsers));
      setRegStatus('تم التسجيل بنجاح تام وتم إرسال كافة بياناتك الآمنة إلى الإدارة لمراجعتها وتصنيفها برمجياً وبإيميلات المنصة الثابتة.');
      setRegForm({ fullName: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
    } else {
      setRegStatus('حدث خطأ أثناء التسجيل.');
    }
  };

  // الفلترة والبحث للجمهور
  const filteredJobs = jobs.filter(j => j.title.includes(searchQuery) || j.company.includes(searchQuery) || j.location.includes(searchQuery));
  const filteredTenders = tenders.filter(t => t.title.includes(searchQuery) || t.company.includes(searchQuery) || t.location.includes(searchQuery));

  // شاشات التفاصيل المستقلة لكل وظيفة أو مناقصة عند النقر
  if (selectedItem) {
    const isJob = selectedItem.type === 'job';
    return (
      <div style={{ direction: 'rtl' }} className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-6 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">{isJob ? selectedItem.data.title : selectedItem.data.title}</h1>
            <button onClick={() => setSelectedItem(null)} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold transition">
              ← العودة للقائمة السابقة
            </button>
          </div>
          <div className="p-8 space-y-6">
            {isJob ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 text-blue-900 rounded-xl font-bold text-lg border-r-4 border-blue-600">المسمى الوظيفي: {selectedItem.data.title}</div>
                <div><span className="font-bold text-blue-700">مكان العمل:</span> <p className="mt-1 text-slate-700">{selectedItem.data.location}</p></div>
                <div><span className="font-bold text-blue-700">يتبع إدارياً إلى:</span> <p className="mt-1 text-slate-700">{selectedItem.data.reportsTo}</p></div>
                <div><span className="font-bold text-blue-700">جهة التوظيف:</span> <p className="mt-1 text-slate-700">{selectedItem.data.company}</p></div>
                <div><span className="font-bold text-blue-700">نبذة عن جهة التوظيف:</span> <p className="mt-1 text-slate-700">{selectedItem.data.companyBio}</p></div>
                <div><span className="font-bold text-blue-700">نبذة عن الوظيفة:</span> <p className="mt-1 text-slate-700">{selectedItem.data.jobBio}</p></div>
                <div><span className="font-bold text-blue-700">الواجبات والمسؤوليات:</span> <p className="mt-1 text-slate-700">{selectedItem.data.duties}</p></div>
                <div><span className="font-bold text-blue-700">المؤهلات والمتطلبات:</span> <p className="mt-1 text-slate-700">{selectedItem.data.qualifications}</p></div>
                <div><span className="font-bold text-blue-700">المهارات والكفاءات:</span> <p className="mt-1 text-slate-700">{selectedItem.data.skills}</p></div>
                <div><span className="font-bold text-blue-700">ملاحظات إضافية:</span> <p className="mt-1 text-slate-700">{selectedItem.data.notes}</p></div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-800 text-lg">طريقة التقديم:</span>
                  {selectedItem.data.applyMethod === 'email' ? (
                    <p className="mt-1 font-mono text-emerald-700">يرجى إرسال السيرة الذاتية مباشرة إلى البريد الإلكتروني: {selectedItem.data.applyEmail}</p>
                  ) : (
                    <p className="mt-1"><a href={selectedItem.data.applyUrl} target="_blank" className="text-blue-600 underline font-bold">اضغط هنا لفتح رابط التقديم المباشر للمنصة</a></p>
                  )}
                </div>
                <div><span className="font-bold text-slate-500">ملاحظات ختامية:</span> <p className="mt-1 text-slate-600">تاريخ انتهاء التقديم النهائي لهذه الفرصة هو: {selectedItem.data.endDate}</p></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl font-bold text-lg border-r-4 border-emerald-600">إعلان المناقصة: {selectedItem.data.title}</div>
                <div><span className="font-bold text-emerald-700">الجهة المعلنة:</span> <p className="mt-1 text-slate-700">{selectedItem.data.company}</p></div>
                <div><span className="font-bold text-emerald-700">بلد ومدينة ومكان المناقصة:</span> <p className="mt-1 text-slate-700">{selectedItem.data.location}</p></div>
                <div className="grid grid-cols-2 gap-4 bg-slate-100 p-4 rounded-xl">
                  <div><span className="font-bold">تاريخ الإعلان:</span> {selectedItem.data.publishDate}</div>
                  <div><span className="font-bold">تاريخ انتهاء الإعلان:</span> {selectedItem.data.endDate}</div>
                  <div><span className="font-bold">رقم المناقصة:</span> {selectedItem.data.tenderNumber}</div>
                  <div><span className="font-bold">اسم المشروع:</span> {selectedItem.data.projectName}</div>
                </div>
                <div><span className="font-bold text-emerald-700">مكونات المناقصة:</span> <p className="mt-1 text-slate-700">{selectedItem.data.components}</p></div>
                <div><span className="font-bold text-emerald-700">جهة التمويل:</span> <p className="mt-1 text-slate-700">{selectedItem.data.fundingBody}</p></div>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border text-center">
                  <div><span className="block font-bold">عملة العطاء</span> {selectedItem.data.currency}</div>
                  <div><span className="block font-bold">صلاحية العطاء</span> {selectedItem.data.validity}</div>
                  <div><span className="block font-bold">فترة التنفيذ</span> {selectedItem.data.executionPeriod}</div>
                </div>
                <div><span className="font-bold text-emerald-700">صلاحية ضمان العطاء وقيمته:</span> <p className="mt-1 text-slate-700">القيمة: {selectedItem.data.guaranteeValue} | الصلاحية: {selectedItem.data.guaranteeValidity}</p></div>
                <div className="p-4 bg-amber-50 text-amber-900 rounded-xl border border-amber-200"><strong>موعد فتح المظاريف:</strong> {selectedItem.data.openingDetails}</div>
                <div><span className="font-bold text-emerald-700">شروط التقديم الصارمة:</span> <p className="mt-1 text-slate-700">{selectedItem.data.conditions}</p></div>
                <div><span className="font-bold text-emerald-700">رابط وثائق المناقصة:</span> <p className="mt-1"><a href={selectedItem.data.documentsLink} target="_blank" className="text-blue-600 underline font-mono">{selectedItem.data.documentsLink}</a></p></div>
                <div><span className="font-bold text-emerald-700">طريقة التقديم المعتمدة:</span> <p className="mt-1 text-slate-700">{selectedItem.data.applyMethod}</p></div>
                <div><span className="font-bold text-emerald-700">المرفقات المطلوبة:</span> <p className="mt-1 text-slate-700">{selectedItem.data.attachments}</p></div>
                <div><span className="font-bold text-emerald-700">رابط الحصول الفوري على المناقصة:</span> <p className="mt-1"><a href={selectedItem.data.accessLink} target="_blank" className="text-emerald-600 underline font-mono">{selectedItem.data.accessLink}</a></p></div>
                <div><span className="font-bold text-emerald-700">التواصل والاستفسار المباشر:</span> <p className="mt-1 font-mono text-slate-800">{selectedItem.data.contactInfo}</p></div>
                <div><span className="font-bold text-slate-500">ملاحظات الأدمن العامة:</span> <p className="mt-1 text-slate-600">{selectedItem.data.notes}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl', backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} className="min-h-screen text-white font-sans antialiased">
      
      {/* الشريط العلوي الشامل والموزع باحترافية كاملة */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-reverse space-x-8">
          <span className="text-xl font-black bg-gradient-to-l from-amber-400 to-orange-400 bg-clip-text text-transparent">منصة الهندسة الذكية 🚀</span>
          <nav className="hidden md:flex space-x-reverse space-x-4 text-sm font-medium">
            <button onClick={() => setActiveTab('jobs')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'}`}>قائمة الوظائف</button>
            <button onClick={() => setActiveTab('tenders')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'tenders' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-white/5'}`}>قائمة المناقصات</button>
            <button onClick={() => setActiveTab('advertise')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'advertise' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-white/5'}`}>أعلن معنا</button>
            <button onClick={() => setActiveTab('register')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5'}`}>سجل</button>
            <button onClick={() => router.push('/jobs-tenders/auth')} className="px-3 py-2 text-slate-300 hover:bg-white/5 rounded-lg transition">تسجيل الدخول</button>
          </nav>
        </div>
        {/* زر العودة للرئيسية في أقصى اليسار على شكل رمز فعال */}
        <button onClick={() => router.push('/')} title="العودة للقائمة الرئيسية للمنصة" className="p-3 bg-white/10 hover:bg-rose-600 rounded-full transition text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* العبارة العملاقة الفنية المحددة سلفاً */}
        <div className="text-center my-8 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400">
            عملاق الوظائف والمناقصات
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">البوابة الاحترافية والأولى لمهندسي ومقاولي العالم العربي تحت رعاية منصة الهندسة الذكية.</p>
        </div>

        {/* شريط البحث المتقدم حسب التسمية أو الشركة أو الموقع */}
        {(activeTab === 'jobs' || activeTab === 'tenders') && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-2xl flex items-center">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="🔍 ابحث عن الفرص الآن بالمسمى الوظيفي، اسم الشركة، أو موقع العمل..." className="w-full bg-transparent border-0 outline-none text-white px-4 py-3 placeholder:text-slate-400 focus:ring-0" />
            </div>
          </div>
        )}

        {/* بطاقات متحركة تفاعلية لأحدث الوظائف */}
        {activeTab === 'jobs' && (
          <div className="mb-12 overflow-hidden relative">
            <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">🔥 أحدث الوظائف النشطة الآن:</h3>
            <div className="flex space-x-reverse space-x-4 animate-pulse">
              {jobs.map(j => (
                <div key={j.id} className="min-w-[280px] bg-gradient-to-br from-blue-900/60 to-slate-800/60 p-4 rounded-xl border border-blue-500/30">
                  <span className="text-xs text-blue-300 font-mono">{j.publishDate}</span>
                  <h4 className="font-bold text-white truncate">{j.title}</h4>
                  <p className="text-xs text-slate-300 truncate">{j.company}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* محتوى التبويبات بالكامل */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2">📂 قائمة أحدث الوظائف الهندسية المتاحة</h2>
            <div className="overflow-x-auto bg-slate-900/80 rounded-2xl border border-white/10 backdrop-blur-md">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm">
                    <th className="p-4">تاريخ النشر</th>
                    <th className="p-4">الشركة/الجهة المعلنة</th>
                    <th className="p-4">عنوان الوظيفة (المسمى)</th>
                    <th className="p-4">فئة التخصص</th>
                    <th className="p-4">موقع الوظيفة</th>
                    <th className="p-4">تاريخ انتهاء التقديم</th>
                    <th className="p-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredJobs.map(j => (
                    <tr key={j.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono text-amber-400">{j.publishDate}</td>
                      <td className="p-4 font-bold">{j.company}</td>
                      <td className="p-4 text-blue-300 font-semibold">{j.title}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">{j.category}</span></td>
                      <td className="p-4 text-slate-300">{j.location}</td>
                      <td className="p-4 font-mono text-rose-400">{j.endDate}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => setSelectedItem({ type: 'job', data: j })} className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition">عرض التفاصيل بالكامل</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tenders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2">💼 قائمة أحدث المناقصات والعطاءات الهندسية</h2>
            <div className="overflow-x-auto bg-slate-900/80 rounded-2xl border border-white/10 backdrop-blur-md">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm">
                    <th className="p-4">تاريخ النشر</th>
                    <th className="p-4">الشركة / المنظمة المعلنة</th>
                    <th className="p-4">عنوان المناقصة الرئيسي</th>
                    <th className="p-4">موقع المناقصة الجغرافي</th>
                    <th className="p-4">تاريخ انتهاء التقديم</th>
                    <th className="p-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredTenders.map(t => (
                    <tr key={t.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono text-amber-400">{t.publishDate}</td>
                      <td className="p-4 font-bold">{t.company}</td>
                      <td className="p-4 text-emerald-300 font-semibold">{t.title}</td>
                      <td className="p-4 text-slate-300">{t.location}</td>
                      <td className="p-4 font-mono text-rose-400">{t.endDate}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => setSelectedItem({ type: 'tender', data: t })} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold transition">فتح كراسة الشروط</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'advertise' && (
          <div className="max-w-2xl mx-auto bg-slate-900/90 p-8 rounded-2xl border border-amber-500/30 backdrop-blur-xl shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-amber-400">يرجى تعبئة البيانات وارسالها وسيتم التواصل معكم قريباً</h3>
              <p className="text-xs text-slate-400 mt-1">تخضع جميع الطلبات لرقابة صارمة من الإدارة قبل النشر العلني.</p>
            </div>
            <form onSubmit={handleAdvSubmit} className="space-y-4 text-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">اسم الشركة (إلزامي) *</label><input type="text" required value={advForm.companyName} onChange={e => setAdvForm({...advForm, companyName: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" /></div>
                <div><label className="block text-xs font-bold mb-1">الشخص المسؤول عن الاتصال (إلزامي) *</label><input type="text" required value={advForm.contactPerson} onChange={e => setAdvForm({...advForm, contactPerson: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">رقم التليفون (إلزامي) *</label><input type="tel" required value={advForm.phone} onChange={e => setAdvForm({...advForm, phone: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" /></div>
                <div><label className="block text-xs font-bold mb-1">بريد إلكتروني حقيقي (إلزامي) *</label><input type="email" required value={advForm.email} onChange={e => setAdvForm({...advForm, email: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" /></div>
              </div>
              <div><label className="block text-xs font-bold mb-1">عنوان الجهة بالكامل *</label><input type="text" required value={advForm.address} onChange={e => setAdvForm({...advForm, address: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" /></div>
              <div><label className="block text-xs font-bold mb-1">الموقع الإلكتروني (اختياري)</label><input type="url" value={advForm.website} onChange={e => setAdvForm({...advForm, website: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" placeholder="https://example.com" /></div>
              <div>
                <label className="block text-xs font-bold mb-1">ماذا تريد الإعلان عنه؟ *</label>
                <select value={advForm.adType} onChange={e => setAdvForm({...advForm, adType: e.target.value})} className="w-full bg-slate-800 border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-amber-400">
                  <option value="وظيفة">الخيار الأول: وظيفة شاغرة</option>
                  <option value="مناقصة">الخيار الثاني: مناقصة عامة</option>
                  <option value="وظيفة ومناقصة">الخيار الثالث: وظيفة ومناقصة معاً</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold mb-1">مزيد من المعلومات للشرح</label><textarea rows={3} value={advForm.moreInfo} onChange={e => setAdvForm({...advForm, moreInfo: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" /></div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg shadow-xl transition">إرسال الطلب بشكل رسمي ومراجعة الأمان</button>
              {advStatus && <p className="mt-4 text-xs text-amber-300 text-center p-2 bg-white/5 rounded">{advStatus}</p>}
            </form>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="max-w-xl mx-auto bg-slate-900/90 p-8 rounded-2xl border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-center bg-white/5 p-1 rounded-xl mb-6">
              <button onClick={() => setRegType('seeker')} className={`w-1/2 text-center py-2 text-sm font-bold rounded-lg transition ${regType === 'seeker' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>باحث عن عمل</button>
              <button onClick={() => setRegType('vendor')} className={`w-1/2 text-center py-2 text-sm font-bold rounded-lg transition ${regType === 'vendor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>مورد / مقاول هندسي</button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div><label className="block text-xs font-bold mb-1">الاسم الكامل المعتمد</label><input type="text" required value={regForm.fullName} onChange={e => setRegForm({...regForm, fullName: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none" /></div>
              <div><label className="block text-xs font-bold mb-1">البريد الإلكتروني الحقيقي</label><input type="email" required value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none" /></div>
              <div><label className="block text-xs font-bold mb-1">كلمة المرور المشفرة</label><input type="password" required value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none" /></div>
              <div><label className="block text-xs font-bold mb-1">تأكيد كلمة المرور المطابقة</label><input type="password" required value={regForm.confirmPassword} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-lg p-2.5 text-white outline-none" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="terms" checked={regForm.agreeTerms} onChange={e => setRegForm({...regForm, agreeTerms: e.target.checked})} className="rounded bg-white/5 border-white/15 text-indigo-600" /><label htmlFor="terms" className="text-xs text-slate-300 cursor-pointer">أوافق وأتعهد بكافة شروط الخصوصية والاستخدام في منصة الهندسة الذكية.</label></div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-xl transition">سجل الآن كباحث عن وظيفة وإرسال البيانات آلياً</button>
              {regStatus && <p className="mt-4 text-xs text-indigo-300 text-center p-2 bg-white/5 rounded">{regStatus}</p>}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}