// المسار: app/jobs-tenders/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobsTendersPublic() {
  const router = useRouter();
  
  // حالات التبويب والبيانات والبحث
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // حالات البيانات
  const [jobs, setJobs] = useState([]);
  const [tenders, setTenders] = useState([
    { id: 1, title: 'توريد وتركيب منظومات طاقة شمسية ذكية للمجمع الهندسي', company: 'وزارة الأشغال العامة والمشاريع', publishDate: '2026/06/20', endDate: '2026/07/30', location: 'تعز، اليمن', announcement: 'تعلن الوزارة عن طرح مناقصة عامة للشركات المؤهلة لتوريد منظومات طاقة نظيفة ومتكاملة.', tenderNumber: 'SE-TEND-2026-004', projectName: 'مشروع الطاقة المستدامة للمرافق الحيوية', components: 'ألواح شمسية عالية الجودة، إنفرترات ذكية، بطاريات ليثيوم، كابلات وهياكل تثبيت مجلفنة.', fundingBody: 'صندوق الدعم الإنمائي المشترك', currency: 'دولار أمريكي', validity: '90 يوماً من تاريخ فتح المظاريف', guaranteeValidity: '120 يوماً من تاريخ التقديم', executionPeriod: '60 يوماً تقويمياً', guaranteeValue: '5000 دولار أمريكي كضمان بنكي مشروط', openingDetails: 'التاريخ: 2026/08/01 - الوقت: 10:00 صباحاً - المكان: قاعة الاجتماعات الرئيسية بمبنى الوزارة.', conditions: 'تقديم السجل التجاري والبطاقة الضريبية والتأمينية سارية المفعول، وخبرة سابقة في مجالات مشابهة.', documentsLink: 'https://smart-engineering.com/docs/tender-004', applyMethod: 'تسليم يدوي في مظاريف مغلقة بالشمع الأحمر إلى مقر اللجنة العليا للمناقصات.', attachments: 'كراسة الشروط والمواصفات وجداول الكميات التفصيلية.', accessLink: 'https://smart-engineering.com/tenders/buy-004', contactInfo: 'Smart.Engineering.Global@proton.me', notes: 'لا تقبل العطاءات التي ترد بعد الموعد المحدد أو غير المصحوبة بضمان العطاء.' }
  ]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات من قاعدة البيانات فوراً عند تحميل الصفحة
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/jobs', { cache: 'no-store' }); // منع الكاش في المتصفح
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Failed to load jobs from server", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // جلب المناقصات من LocalStorage كحل مؤقت إذا كان الأدمن يستخدمها للمناقصات
    const savedTenders = localStorage.getItem('se_tenders');
    if (savedTenders) setTenders(JSON.parse(savedTenders));
    
  }, [activeTab]);

  // نماذج الإعلان والتسجيل
  const [advForm, setAdvForm] = useState({ companyName: '', contactPerson: '', phone: '', email: '', address: '', website: '', adType: 'وظيفة', moreInfo: '' });
  const [advStatus, setAdvStatus] = useState('');
  const [regType, setRegType] = useState('seeker');
  const [regForm, setRegForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
  const [regStatus, setRegStatus] = useState('');

  const handleAdvSubmit = async (e) => {
    e.preventDefault();
    setAdvStatus('جاري إرسال طلب الإعلان والتدقيق الأمني...');
    try {
      const res = await fetch('/api/notificationEngine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CLIENT_ADVERTISEMENT_REQUEST', data: advForm })
      });
      if (res.ok) {
        setAdvStatus('تم إرسال البيانات بنجاح! سيتم التواصل معكم قريباً بعد مراجعة الأدمن.');
        const tempRequests = JSON.parse(localStorage.getItem('se_adv_requests') || '[]');
        tempRequests.push({ ...advForm, id: Date.now() });
        localStorage.setItem('se_adv_requests', JSON.stringify(tempRequests));
        setAdvForm({ companyName: '', contactPerson: '', phone: '', email: '', address: '', website: '', adType: 'وظيفة', moreInfo: '' });
      } else {
        setAdvStatus('فشل في إرسال الإعلان، يرجى المحاولة لاحقاً.');
      }
    } catch (err) {
      setAdvStatus('حدث خطأ في الاتصال بالخادم.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirmPassword) return alert('كلمة المرور وتأكيدها غير متطابقين!');
    if (!regForm.agreeTerms) return alert('يجب الموافقة على شروط الخصوصية للمنصة!');
    
    setRegStatus('جاري تسجيل حسابك...');
    const newUser = { ...regForm, role: regType, id: Date.now() };
    
    try {
      const res = await fetch('/api/notificationEngine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NEW_USER_REGISTRATION', data: newUser })
      });

      if (res.ok) {
        const existingUsers = JSON.parse(localStorage.getItem('se_registered_users') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('se_registered_users', JSON.stringify(existingUsers));
        setRegStatus('تم التسجيل بنجاح وتم إرسال بياناتك للإدارة.');
        setRegForm({ fullName: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
      } else {
        setRegStatus('حدث خطأ أثناء التسجيل.');
      }
    } catch (err) {
      setRegStatus('حدث خطأ في الاتصال بالسيرفر.');
    }
  };

  // الفلترة الآمنة (مع التأكد من وجود الحقل قبل تطبيق includes)
  const filteredJobs = jobs.filter(j => 
    (j.title && j.title.includes(searchQuery)) || 
    (j.company && j.company.includes(searchQuery)) || 
    (j.location && j.location.includes(searchQuery))
  );

  const filteredTenders = tenders.filter(t => 
    (t.title && t.title.includes(searchQuery)) || 
    (t.company && t.company.includes(searchQuery)) || 
    (t.location && t.location.includes(searchQuery))
  );

  // واجهة عرض التفاصيل (عند النقر على وظيفة أو مناقصة)
  if (selectedItem) {
    const isJob = selectedItem.type === 'job';
    return (
      <div style={{ direction: 'rtl' }} className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-6 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">{selectedItem.data.title}</h1>
            <button onClick={() => setSelectedItem(null)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-bold transition">
              ← العودة للقائمة السابقة
            </button>
          </div>
          <div className="p-8 space-y-6">
            {isJob ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 text-blue-900 rounded-xl font-bold text-lg border-r-4 border-blue-600">المسمى الوظيفي: {selectedItem.data.title}</div>
                <div><span className="font-bold text-blue-700">جهة التوظيف:</span> <p className="mt-1">{selectedItem.data.company}</p></div>
                <div><span className="font-bold text-blue-700">التصنيف / النوع:</span> <p className="mt-1">{selectedItem.data.category} - {selectedItem.data.type}</p></div>
                <div><span className="font-bold text-blue-700">المهام / الوصف:</span> <p className="mt-1">{selectedItem.data.duties || selectedItem.data.jobBio || 'لا يوجد تفاصيل إضافية مضافة.'}</p></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl font-bold text-lg border-r-4 border-emerald-600">إعلان المناقصة: {selectedItem.data.title}</div>
                <div><span className="font-bold text-emerald-700">الجهة المعلنة:</span> <p className="mt-1">{selectedItem.data.company}</p></div>
                <div className="grid grid-cols-2 gap-4 bg-slate-100 p-4 rounded-xl">
                  <div><span className="font-bold">رقم المناقصة:</span> {selectedItem.data.tenderNumber}</div>
                  <div><span className="font-bold">تاريخ الانتهاء:</span> {selectedItem.data.endDate}</div>
                </div>
                <div><span className="font-bold text-emerald-700">تفاصيل:</span> <p className="mt-1">{selectedItem.data.announcement}</p></div>
                <div><span className="font-bold text-emerald-700">طريقة التقديم:</span> <p className="mt-1">{selectedItem.data.applyMethod}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl', backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} className="min-h-screen text-white font-sans antialiased">
      
      {/* الشريط العلوي */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-reverse space-x-8">
          <span className="text-xl font-black bg-gradient-to-l from-amber-400 to-orange-400 bg-clip-text text-transparent">منصة الهندسة الذكية 🚀</span>
          <nav className="hidden md:flex space-x-reverse space-x-4 text-sm font-medium">
            <button onClick={() => setActiveTab('jobs')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'jobs' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>الوظائف</button>
            <button onClick={() => setActiveTab('tenders')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'tenders' ? 'bg-emerald-600' : 'hover:bg-white/5'}`}>المناقصات</button>
            <button onClick={() => setActiveTab('advertise')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'advertise' ? 'bg-amber-600' : 'hover:bg-white/5'}`}>أعلن معنا</button>
            <button onClick={() => setActiveTab('register')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'register' ? 'bg-indigo-600' : 'hover:bg-white/5'}`}>سجل</button>
          </nav>
        </div>
        <button onClick={() => router.push('/')} className="p-3 bg-white/10 hover:bg-rose-600 rounded-full transition flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center my-8 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400">عملاق الوظائف والمناقصات</h1>
        </div>

        {(activeTab === 'jobs' || activeTab === 'tenders') && (
          <div className="max-w-3xl mx-auto mb-12">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="🔍 ابحث عن الفرص الآن..." className="w-full rounded-2xl bg-white/10 border border-white/20 p-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        {/* قائمة الوظائف */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2">📂 قائمة أحدث الوظائف</h2>
            {loading ? (
              <p className="text-center text-blue-400 animate-pulse">جاري تحديث البيانات وجلب الفرص من السيرفر مباشر...</p>
            ) : filteredJobs.length === 0 ? (
              <p className="text-center text-slate-400">لا توجد وظائف متاحة حالياً.</p>
            ) : (
              <div className="overflow-x-auto bg-slate-900/80 rounded-2xl border border-white/10">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-sm">
                      <th className="p-4">الشركة</th>
                      <th className="p-4">المسمى الوظيفي</th>
                      <th className="p-4">النوع</th>
                      <th className="p-4 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredJobs.map(j => (
                      <tr key={j.id} className="hover:bg-white/5 transition">
                        <td className="p-4 font-bold">{j.company}</td>
                        <td className="p-4 text-blue-300 font-semibold">{j.title}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">{j.type || 'دوام كامل'}</span></td>
                        <td className="p-4 text-center">
                          <button onClick={() => setSelectedItem({ type: 'job', data: j })} className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition">عرض التفاصيل</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* قائمة المناقصات */}
        {activeTab === 'tenders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2">💼 قائمة أحدث المناقصات</h2>
            <div className="overflow-x-auto bg-slate-900/80 rounded-2xl border border-white/10">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-sm">
                    <th className="p-4">تاريخ النشر</th>
                    <th className="p-4">الجهة المعلنة</th>
                    <th className="p-4">عنوان المناقصة</th>
                    <th className="p-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredTenders.map(t => (
                    <tr key={t.id} className="hover:bg-white/5 transition">
                      <td className="p-4 text-amber-400">{t.publishDate}</td>
                      <td className="p-4 font-bold">{t.company}</td>
                      <td className="p-4 text-emerald-300 font-semibold">{t.title}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => setSelectedItem({ type: 'tender', data: t })} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold transition">التفاصيل</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* تبويب أعلن معنا وتكويناتها تبقى كما هي في الكود الأصلي */}
        {activeTab === 'advertise' && (
          <div className="max-w-2xl mx-auto bg-slate-900/90 p-8 rounded-2xl border border-amber-500/30">
            <form onSubmit={handleAdvSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required value={advForm.companyName} onChange={e => setAdvForm({...advForm, companyName: e.target.value})} placeholder="اسم الشركة *" className="w-full bg-white/5 border border-white/15 rounded-lg p-3 text-white outline-none focus:border-amber-400" />
                <input type="email" required value={advForm.email} onChange={e => setAdvForm({...advForm, email: e.target.value})} placeholder="البريد الإلكتروني *" className="w-full bg-white/5 border border-white/15 rounded-lg p-3 text-white outline-none focus:border-amber-400" />
              </div>
              <textarea rows={3} value={advForm.moreInfo} onChange={e => setAdvForm({...advForm, moreInfo: e.target.value})} placeholder="تفاصيل الإعلان..." className="w-full bg-white/5 border border-white/15 rounded-lg p-3 text-white outline-none focus:border-amber-400" />
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg shadow-xl transition">إرسال الطلب</button>
              {advStatus && <p className="mt-4 text-xs text-amber-300 text-center">{advStatus}</p>}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}