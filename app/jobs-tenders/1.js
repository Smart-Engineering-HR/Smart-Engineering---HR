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
  
  // حالات البيانات (تبدأ فارغة لجلب البيانات الحقيقية فقط من Supabase)
  const [jobs, setJobs] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب كافة البيانات الحقيقية من قاعدة البيانات فوراً عند تحميل الصفحة أو التنقل
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/jobs-tenders', { 
          cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // تفكيك البيانات الواردة حسب نوعها
            const apiJobs = data.filter(item => item.itemType === 'job');
            const apiTenders = data.filter(item => item.itemType === 'tender');

            setJobs(apiJobs);
            setTenders(apiTenders);
          }
        }
      } catch (error) {
        console.error("فشل في جلب البيانات من السيرفر:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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

  // الفلترة الآمنة للوظائف والمناقصات
  const filteredJobs = jobs.filter(j => 
    (j.title && j.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (j.company && j.company.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (j.location && j.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTenders = tenders.filter(t => 
    (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (t.company && t.company.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // واجهة عرض التفاصيل الدقيقة (عند النقر على وظيفة أو مناقصة)
  if (selectedItem) {
    const isJob = selectedItem.data.itemType === 'job' || selectedItem.type === 'job';
    const item = selectedItem.data;

    return (
      <div style={{ direction: 'rtl' }} className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-6 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <button onClick={() => setSelectedItem(null)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-bold transition">
              ← العودة للقائمة السابقة
            </button>
          </div>
          <div className="p-8 space-y-6">
            {isJob ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 text-blue-900 rounded-xl font-bold text-lg border-r-4 border-blue-600">المسمى الوظيفي: {item.title}</div>
                <div><span className="font-bold text-blue-700">جهة التوظيف:</span> <p className="mt-1">{item.company}</p></div>
                <div><span className="font-bold text-blue-700">التصنيف / النوع:</span> <p className="mt-1">{item.category} - {item.type}</p></div>
                {item.location && <div><span className="font-bold text-blue-700">الموقع:</span> <p className="mt-1">{item.location}</p></div>}
                <div><span className="font-bold text-blue-700">المهام والوصف:</span> <p className="mt-1 whitespace-pre-line">{item.duties || 'لا يوجد تفاصيل إضافية مضافة.'}</p></div>
                {item.qualifications && <div><span className="font-bold text-blue-700">المؤهلات المطلوبة:</span> <p className="mt-1 whitespace-pre-line">{item.qualifications}</p></div>}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl font-bold text-lg border-r-4 border-emerald-600">إعلان المناقصة: {item.title}</div>
                <div><span className="font-bold text-emerald-700">الجهة المعلنة:</span> <p className="mt-1">{item.company}</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100 p-4 rounded-xl">
                  {item.tenderNumber && <div><span className="font-bold">رقم المناقصة:</span> {item.tenderNumber}</div>}
                  {item.publishDate && <div><span className="font-bold">تاريخ النشر:</span> {item.publishDate}</div>}
                  {item.endDate && <div><span className="font-bold">تاريخ الانتهاء:</span> {item.endDate}</div>}
                  {item.location && <div><span className="font-bold">الموقع:</span> {item.location}</div>}
                </div>
                {item.duties && <div><span className="font-bold text-emerald-700">تفاصيل وتكاليف المناقصة:</span> <p className="mt-1 whitespace-pre-line">{item.duties}</p></div>}
                {item.applyMethod && <div><span className="font-bold text-emerald-700">طريقة التقديم:</span> <p className="mt-1">{item.applyMethod}</p></div>}
                {item.documentsLink && (
                  <div>
                    <span className="font-bold text-emerald-700">رابط وثائق المناقصة:</span> 
                    <p className="mt-1"><a href={item.documentsLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">تحميل كراسة الشروط والوثائق</a></p>
                  </div>
                )}
                {item.notes && <div><span className="font-bold text-emerald-700">ملاحظات هامة:</span> <p className="mt-1">{item.notes}</p></div>}
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

        {/* قائمة الوظائف المباشرة */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2">📂 قائمة أحدث الوظائف</h2>
            {loading ? (
              <p className="text-center text-blue-400 animate-pulse py-8">جاري تحديث البيانات وجلب الفرص من السيرفر المباشر...</p>
            ) : filteredJobs.length === 0 ? (
              <p className="text-center text-slate-400 py-8">لا توجد وظائف معلنة حالياً.</p>
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

        {/* قائمة المناقصات المباشرة */}
        {activeTab === 'tenders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2">💼 قائمة أحدث المناقصات</h2>
            {loading ? (
              <p className="text-center text-emerald-400 animate-pulse py-8">جاري جلب المناقصات المباشرة من قاعدة البيانات...</p>
            ) : filteredTenders.length === 0 ? (
              <p className="text-center text-slate-400 py-8">لا توجد مناقصات معلنة حالياً.</p>
            ) : (
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
                        <td className="p-4 text-amber-400">{t.publishDate || 'غير محدد'}</td>
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
            )}
          </div>
        )}

        {/* تبويب أعلن معنا */}
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

        {/* تبويب التسجيل */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto bg-slate-900/90 p-8 rounded-2xl border border-indigo-500/30">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input type="text" required value={regForm.fullName} onChange={e => setRegForm({...regForm, fullName: e.target.value})} placeholder="الاسم الكامل *" className="w-full bg-white/5 border border-white/15 rounded-lg p-3 text-white outline-none focus:border-indigo-400" />
              <input type="email" required value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} placeholder="البريد الإلكتروني *" className="w-full bg-white/5 border border-white/15 rounded-lg p-3 text-white outline-none focus:border-indigo-400" />
              <div className="grid grid-cols-2 gap-4">
                <input type="password" required value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} placeholder="كلمة المرور *" className="w-full bg-white/5 border border-white/15 rounded-lg p-3 text-white outline-none focus:border-indigo-400" />
                <input type="password" required value={regForm.confirmPassword} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} placeholder="تأكيد كلمة المرور *" className="w-full bg-white/5 border border-white/15 rounded-lg p-3 text-white outline-none focus:border-indigo-400" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 pt-2">
                <input type="checkbox" id="terms" checked={regForm.agreeTerms} onChange={e => setRegForm({...regForm, agreeTerms: e.target.checked})} />
                <label htmlFor="terms">أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بالمنصة</label>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-xl transition">إنشاء حساب جديد</button>
              {regStatus && <p className="mt-4 text-xs text-indigo-300 text-center">{regStatus}</p>}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}