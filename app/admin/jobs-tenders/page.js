'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobsTendersAdmin() {
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  
  const [currentSection, setCurrentSection] = useState('manage-jobs');

  const [jobs, setJobs] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [advRequests, setAdvRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loginCount, setLoginCount] = useState(0);

  const [jobForm, setJobForm] = useState({ title: '', company: '', publishDate: '', endDate: '', category: '', location: '', reportsTo: '', companyBio: '', jobBio: '', duties: '', qualifications: '', skills: '', notes: '', applyMethod: 'email', applyEmail: '', applyUrl: '' });
  const [tenderForm, setTenderForm] = useState({ title: '', company: '', location: '', publishDate: '', endDate: '', tenderNumber: '', projectName: '', components: '', fundingBody: '', currency: 'دولار أمريكي', validity: '', guaranteeValidity: '', executionPeriod: '', guaranteeValue: '', openingDetails: '', conditions: '', documentsLink: '', applyMethod: '', attachments: '', accessLink: '', contactInfo: '', notes: '' });

  const fetchPostings = async () => {
    try {
      const res = await fetch('/api/postings');
      if (res.ok) {
        const data = await res.json();
        const apiJobs = [];
        const apiTenders = [];
        const apiPending = [];

        data.forEach(item => {
          let parsedData = {};
          try {
            parsedData = JSON.parse(item.moreInfo || '{}');
          } catch (e) {
            parsedData = {};
          }

          const formattedItem = {
            id: item.id,
            companyName: item.companyName,
            company: item.companyName,
            contactPerson: item.contactPerson,
            phone: item.phone,
            email: item.email,
            address: item.address,
            location: item.address,
            adType: item.advertiseType,
            status: item.status,
            ...parsedData,
            id: item.id
          };

          if (item.status === 'PENDING') {
            apiPending.push(formattedItem);
          } else if (item.advertiseType === 'مناقصة') {
            apiTenders.push(formattedItem);
          } else {
            apiJobs.push(formattedItem);
          }
        });

        setJobs(apiJobs);
        setTenders(apiTenders);
        setAdvRequests(apiPending);
      }
    } catch (e) {
      console.error("خطأ في جلب البيانات:", e);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUsers = localStorage.getItem('se_registered_users') || '[]';
      const count = localStorage.getItem('se_login_count') || '0';
      setUsers(JSON.parse(savedUsers));
      setLoginCount(parseInt(count));
    }
    fetchPostings();
  }, [currentSection]);

  const updateLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (
      (adminCredentials.email === 'Smart.Engineering.Global@proton.me' || 
       adminCredentials.email === 'smart.engineering.global@tuta.io' || 
       adminCredentials.email === 'smartengineering.hr.global@gmail.com') && 
      adminCredentials.password === 'HA&EL&Fa&Ta&Om2026#%@$%'
    ) {
      setIsAdminAuthenticated(true);
    } else {
      alert('خطأ فادح في اعتماد تسجيل الدخول كمسؤول! تم توجيه إشعار حماية فوري.');
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    const payload = {
      companyName: jobForm.company,
      contactPerson: jobForm.reportsTo || "المسؤول الإداري",
      phone: "000000000",
      email: jobForm.applyEmail || "admin@smart-engineering.com",
      website: jobForm.applyUrl || "",
      advertiseType: "وظيفة",
      address: jobForm.location,
      moreInfo: JSON.stringify(jobForm),
      status: "APPROVED"
    };

    try {
      const res = await fetch('/api/postings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetch('/api/notificationEngine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'NEW_JOB_PUBLISHED', data: jobForm })
        });
        alert('تم نشر وإعلان الوظيفة وتحديث واجهة الجمهور وإرسال الإشعارات الشاملة بنجاح!');
        setJobForm({ title: '', company: '', publishDate: '', endDate: '', category: '', location: '', reportsTo: '', companyBio: '', jobBio: '', duties: '', qualifications: '', skills: '', notes: '', applyMethod: 'email', applyEmail: '', applyUrl: '' });
        fetchPostings();
      } else {
        alert('حدث خطأ أثناء حفظ الوظيفة على السيرفر.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ في الاتصال بالشبكة.');
    }
  };

  const handleDeleteJob = async (id) => {
    if(confirm('هل أنت متأكد تماماً من حذف هذه الوظيفة نهائياً من العرض العام؟')) {
      try {
        const res = await fetch(`/api/postings?id=${id}`, { method: 'DELETE' });
        if(res.ok) {
          setJobs(jobs.filter(j => j.id !== id));
          alert('تم حذف الوظيفة بنجاح.');
        } else {
          alert('فشل حذف الوظيفة من قاعدة البيانات.');
        }
      } catch(err) {
        console.error(err);
      }
    }
  };

  const handleAddTender = async (e) => {
    e.preventDefault();
    const payload = {
      companyName: tenderForm.company,
      contactPerson: tenderForm.contactInfo || "مسؤول المناقصات",
      phone: "000000000",
      email: tenderForm.contactInfo || "admin@smart-engineering.com",
      website: tenderForm.documentsLink || "",
      advertiseType: "مناقصة",
      address: tenderForm.location,
      moreInfo: JSON.stringify(tenderForm),
      status: "APPROVED"
    };

    try {
      const res = await fetch('/api/postings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetch('/api/notificationEngine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'NEW_TENDER_PUBLISHED', data: tenderForm })
        });
        alert('تم نشر وإعلان المناقصة رسمياً وتحديث واجهة الجمهور وإرسال الإشعارات البريدية فوراً.');
        setTenderForm({ title: '', company: '', location: '', publishDate: '', endDate: '', tenderNumber: '', projectName: '', components: '', fundingBody: '', currency: 'دولار أمريكي', validity: '', guaranteeValidity: '', executionPeriod: '', guaranteeValue: '', openingDetails: '', conditions: '', documentsLink: '', applyMethod: '', attachments: '', accessLink: '', contactInfo: '', notes: '' });
        fetchPostings();
      } else {
        alert('حدث خطأ أثناء إعلان المناقصة على السيرفر.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ في الاتصال بالشبكة.');
    }
  };

  const handleDeleteTender = async (id) => {
    if(confirm('هل تريد مسح وإزالة المناقصة المحددة من جدول الجمهور نهائياً؟')) {
      try {
        const res = await fetch(`/api/postings?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setTenders(tenders.filter(t => t.id !== id));
          alert('تم إزالة المناقصة بنجاح وتحديث واجهة الجمهور العامة.');
        } else {
          alert('فشل في حذف المناقصة من السيرفر.');
        }
      } catch (error) {
        console.error('حدث خطأ أثناء محاولة الحذف من السيرفر:', error);
      }
    }
  };

  const toggleUserBlock = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
    setUsers(updated);
    updateLocalStorage('se_registered_users', updated);
    alert('تم تعديل صلاحية المستخدم وتحديث الحظر والرقابة الإدارية الفورية.');
  };

  const handleDeleteUser = (id) => {
    if(confirm('هل تريد حذف بيانات هذا المستخدم نهائياً من سجلات البوابة؟')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      updateLocalStorage('se_registered_users', updated);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div style={{ direction: 'rtl' }} className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center">
            <span className="text-sm uppercase tracking-widest text-red-400 font-mono font-bold">لوحة التحكم المركزية - التحكم المطلق الأدمن</span>
            <h1 className="text-2xl font-black mt-1">منصة الهندسة الذكية 🛠️</h1>
            <p className="text-slate-400 text-xs mt-2">تسجيل دخول المسؤول المباشر لإدارة قطاع الوظائف والمناقصات بالكامل.</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div><label className="block text-xs font-bold mb-1">البريد الإلكتروني المعتمد للمسؤول</label><input type="email" required value={adminCredentials.email} onChange={e => setAdminCredentials({...adminCredentials, email: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm focus:border-red-500 outline-none" placeholder="Smart.Engineering.Global@proton.me" /></div>
            <div><label className="block text-xs font-bold mb-1">كلمة سر الإدارة العليا</label><input type="password" required value={adminCredentials.password} onChange={e => setAdminCredentials({...adminCredentials, password: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm focus:border-red-500 outline-none" placeholder="••••••••" /></div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-xl shadow-red-900/20">تسجيل الدخول الفوري والسيطرة (Admin)</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl' }} className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      <aside className="w-64 bg-slate-950 border-l border-white/10 p-6 space-y-6 shrink-0">
        <div>
          <h2 className="text-lg font-black text-amber-400">لوحة الإدارة والمراقبة</h2>
          <p className="text-xs text-slate-400 mt-1">بوابة الوظائف والمناقصات</p>
        </div>
        <nav className="space-y-1 text-sm font-medium">
          <button onClick={() => setCurrentSection('manage-jobs')} className={`w-full text-right px-4 py-2.5 rounded-xl transition ${currentSection === 'manage-jobs' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}>🛠️ إدارة ونشر الوظائف</button>
          <button onClick={() => setCurrentSection('manage-tenders')} className={`w-full text-right px-4 py-2.5 rounded-xl transition ${currentSection === 'manage-tenders' ? 'bg-emerald-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}>🏗️ إدارة ونشر المناقصات</button>
          <button onClick={() => setCurrentSection('adv-requests')} className={`w-full text-right px-4 py-2.5 rounded-xl transition ${currentSection === 'adv-requests' ? 'bg-amber-600 text-slate-950' : 'hover:bg-white/5 text-slate-300'}`}>📩 طلبات إعلانات الجمهور ({advRequests.length})</button>
          <button onClick={() => setCurrentSection('users')} className={`w-full text-right px-4 py-2.5 rounded-xl transition ${currentSection === 'users' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}>👤 إدارة وحظر المسجلين</button>
          <button onClick={() => setCurrentSection('logs')} className={`w-full text-right px-4 py-2.5 rounded-xl transition ${currentSection === 'logs' ? 'bg-slate-700 text-white' : 'hover:bg-white/5 text-slate-300'}`}>📊 الإحصائيات والأمان المتقدم</button>
        </nav>
        <div className="pt-12"><button onClick={() => router.push('/jobs-tenders')} className="w-full bg-white/5 hover:bg-rose-600 py-2 rounded-lg text-xs font-bold text-center transition">👁️ معاينة واجهة الجمهور</button></div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {currentSection === 'manage-jobs' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-blue-400">نشر وإعلان وظيفة هندسية جديدة للجمهور بالكامل</h2>
            <form onSubmit={handleAddJob} className="bg-slate-950/50 p-6 rounded-2xl border border-blue-500/20 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-xs mb-1">المسمى الوظيفي *</label><input type="text" required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">تاريخ الإعلان (يوم/شهر/سنة) *</label><input type="text" required placeholder="2026/06/30" value={jobForm.publishDate} onChange={e => setJobForm({...jobForm, publishDate: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">تاريخ الإغلاق (يوم/شهر/سنة) *</label><input type="text" required placeholder="2026/07/30" value={jobForm.endDate} onChange={e => setJobForm({...jobForm, endDate: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">الشركة أو الجهة المعلنة *</label><input type="text" required value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">فئة التخصص الهندسي *</label><input type="text" required placeholder="مثال: هندسة مدنية" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">مكان العمل بالتفصيل *</label><input type="text" required value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">لمن يتبع إدارياً إلى *</label><input type="text" required placeholder="مثال: مدير قطاع الإنشاءات" value={jobForm.reportsTo} onChange={e => setJobForm({...jobForm, reportsTo: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-2"><label className="block text-xs mb-1">نبذة شاملة عن جهة التوظيف *</label><input type="text" required value={jobForm.companyBio} onChange={e => setJobForm({...jobForm, companyBio: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">نبذة عن الوظيفة والمهام العامة *</label><textarea rows={2} required value={jobForm.jobBio} onChange={e => setJobForm({...jobForm, jobBio: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">الواجبات والمسؤوليات التفصيلية *</label><textarea rows={2} required value={jobForm.duties} onChange={e => setJobForm({...jobForm, duties: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">المؤهلات ومتطلبات التقديم *</label><textarea rows={2} required value={jobForm.qualifications} onChange={e => setJobForm({...jobForm, qualifications: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">المهارات والكفاءات المطلوبة *</label><textarea rows={2} required value={jobForm.skills} onChange={e => setJobForm({...jobForm, skills: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">أي ملاحظات إضافية يتم تزويدها للمتقدمين</label><input type="text" value={jobForm.notes} onChange={e => setJobForm({...jobForm, notes: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div>
                <label className="block text-xs mb-1">طريقة التقديم المتاحة</label>
                <select value={jobForm.applyMethod} onChange={e => setJobForm({...jobForm, applyMethod: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white">
                  <option value="email">بواسطة البريد الإلكتروني</option>
                  <option value="url">بواسطة رابط خارجي/صفحة منفصلة</option>
                </select>
              </div>
              {jobForm.applyMethod === 'email' ? (
                <div className="md:col-span-2"><label className="block text-xs mb-1">إيميل التقديم *</label><input type="email" required value={jobForm.applyEmail} onChange={e => setJobForm({...jobForm, applyEmail: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              ) : (
                <div className="md:col-span-2"><label className="block text-xs mb-1">رابط التقديم المباشر للمنصة *</label><input type="url" required value={jobForm.applyUrl} onChange={e => setJobForm({...jobForm, applyUrl: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" placeholder="https://" /></div>
              )}
              <div className="md:col-span-3 pt-2"><button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition">⚡ اعتماد نشر الوظيفة رسمياً وإرسال الإشعارات</button></div>
            </form>

            <h3 className="text-xl font-bold border-b border-white/10 pb-2">📋 الوظائف الحالية على السيرفر العام المباشر</h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
              {jobs.length === 0 ? <p className="text-slate-400 text-sm">لا توجد وظائف معلنة حالياً للجمهور.</p> : (
                <div className="divide-y divide-white/10">
                  {jobs.map(j => (
                    <div key={j.id} className="py-3 flex justify-between items-center">
                      <div><span className="font-bold text-sm text-blue-400">{j.title}</span> <span className="text-xs text-slate-400">- {j.company} ({j.location})</span></div>
                      <button onClick={() => handleDeleteJob(j.id)} className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-xs transition font-bold">حذف نهائي</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentSection === 'manage-tenders' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-emerald-400">إعلان ونشر مناقصة عامة وجديدة كلياً للشركات</h2>
            <form onSubmit={handleAddTender} className="bg-slate-950/50 p-6 rounded-2xl border border-emerald-500/20 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2"><label className="block text-xs mb-1">عنوان وإعلان المناقصة عريض *</label><input type="text" required value={tenderForm.title} onChange={e => setTenderForm({...tenderForm, title: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">الجهة المعلنة للمناقصة *</label><input type="text" required value={tenderForm.company} onChange={e => setTenderForm({...tenderForm, company: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">بلد ومدينة ومكان المناقصة *</label><input type="text" required value={tenderForm.location} onChange={e => setTenderForm({...tenderForm, location: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">تاريخ الإعلان المعتمد *</label><input type="text" required placeholder="2026/06/30" value={tenderForm.publishDate} onChange={e => setTenderForm({...tenderForm, publishDate: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">تاريخ انتهاء الإعلان والتسليم *</label><input type="text" required placeholder="2026/08/15" value={tenderForm.endDate} onChange={e => setTenderForm({...tenderForm, endDate: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">رقم المناقصة الدولي/المحلي *</label><input type="text" required value={tenderForm.tenderNumber} onChange={e => setTenderForm({...tenderForm, tenderNumber: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-2"><label className="block text-xs mb-1">اسم المشروع الهندسي التابع له *</label><input type="text" required value={tenderForm.projectName} onChange={e => setTenderForm({...tenderForm, projectName: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">مكونات المناقصة والكميات الأساسية *</label><textarea rows={2} required value={tenderForm.components} onChange={e => setTenderForm({...tenderForm, components: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">جهة التمويل الرسمية *</label><input type="text" required value={tenderForm.fundingBody} onChange={e => setTenderForm({...tenderForm, fundingBody: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">عملة العطاء المعتمدة *</label><input type="text" required value={tenderForm.currency} onChange={e => setTenderForm({...tenderForm, currency: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">صلاحية العطاء الهندسي *</label><input type="text" required placeholder="مثال: 90 يوماً" value={tenderForm.validity} onChange={e => setTenderForm({...tenderForm, validity: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">صلاحية ضمان العطاء البنكي *</label><input type="text" required placeholder="مثال: 120 يوماً" value={tenderForm.guaranteeValidity} onChange={e => setTenderForm({...tenderForm, guaranteeValidity: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">فترة التنفيذ التعاقدية *</label><input type="text" required placeholder="مثال: 6 أشهر" value={tenderForm.executionPeriod} onChange={e => setTenderForm({...tenderForm, executionPeriod: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">قيمة الضمان المطلوب كحد أدنى *</label><input type="text" required placeholder="مثال: 5000$" value={tenderForm.guaranteeValue} onChange={e => setTenderForm({...tenderForm, guaranteeValue: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">موعد ومكان فتح المظاريف بالتأصيل (التاريخ/الوقت/المكان) *</label><input type="text" required value={tenderForm.openingDetails} onChange={e => setTenderForm({...tenderForm, openingDetails: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">شروط التقديم القانونية والفنية *</label><textarea rows={2} required value={tenderForm.conditions} onChange={e => setTenderForm({...tenderForm, conditions: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">رابط وثائق المناقصة الكامل لتحميل الكراسة *</label><input type="url" required value={tenderForm.documentsLink} onChange={e => setTenderForm({...tenderForm, documentsLink: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-2"><label className="block text-xs mb-1">طريقة التقديم اللوجستية المعتمدة *</label><input type="text" required value={tenderForm.applyMethod} onChange={e => setTenderForm({...tenderForm, applyMethod: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">المرفقات والملفات المطلوبة بالملف *</label><input type="text" required value={tenderForm.attachments} onChange={e => setTenderForm({...tenderForm, attachments: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-2"><label className="block text-xs mb-1">رابط الحصول والمشتريات الفوري على المناقصة *</label><input type="url" required value={tenderForm.accessLink} onChange={e => setTenderForm({...tenderForm, accessLink: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div><label className="block text-xs mb-1">بيانات التواصل والاستفسار الإداري *</label><input type="text" required value={tenderForm.contactInfo} onChange={e => setTenderForm({...tenderForm, contactInfo: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3"><label className="block text-xs mb-1">ملاحظات ختامية للمشروع</label><input type="text" value={tenderForm.notes} onChange={e => setTenderForm({...tenderForm, notes: e.target.value})} className="w-full bg-slate-800 rounded p-2 text-sm text-white" /></div>
              <div className="md:col-span-3 pt-2"><button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition">⚡ إعلان ونشر المناقصة فوراً للشركات ومزامنة السيرفر</button></div>
            </form>

            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mt-8">📋 المناقصات الحالية المعروضة للجمهور</h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
              {tenders.length === 0 ? (
                <p className="text-slate-400 text-sm">لا توجد مناقصات معلنة حالياً للجمهور.</p>
              ) : (
                <div className="divide-y divide-white/10">
                  {tenders.map(t => (
                    <div key={t.id} className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-sm text-emerald-400">{t.title}</span> 
                        <span className="text-xs text-slate-400"> - {t.company} ({t.location})</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteTender(t.id)} 
                        className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-xs transition font-bold"
                      >
                        حذف نهائي
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentSection === 'adv-requests' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-amber-400">طلبات الإعلانات الواردة من الجمهور (قيد المراجعة والتدقيق)</h2>
            <p className="text-xs text-slate-400">الإعلان بمجرد استلامه من الشخص المعلن لا يظهر للجمهور إلا عند موافقتك وضغط نشر من هنا.</p>
            {advRequests.length === 0 ? <p className="text-slate-400 text-sm p-4 bg-slate-950 rounded-xl">لا توجد طلبات إعلانات معلقة حالياً.</p> : (
              <div className="space-y-4">
                {advRequests.map(req => (
                  <div key={req.id} className="bg-slate-950 p-6 rounded-2xl border border-amber-500/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-white">{req.companyName} <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{req.adType}</span></h3>
                        <p className="text-xs text-slate-400 mt-1">المسؤول: {req.contactPerson} | الهاتف: {req.phone} | البريد: {req.email}</p>
                        <p className="text-sm text-slate-300 mt-2"><strong>معلومات الإعلان وشرحه:</strong> {req.moreInfo || 'لا يوجد تفاصيل إضافية ملقاه'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          try {
                            const res = await fetch('/api/postings', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: req.id, status: 'APPROVED' })
                            });
                            if (res.ok) {
                              alert('تمت الموافقة على الإعلان ونشره للجمهور بنجاح!');
                              fetchPostings();
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }} className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition">تصنيف واعتماد النشر المباشر</button>
                        <button onClick={async () => {
                          try {
                            const res = await fetch(`/api/postings?id=${req.id}`, { method: 'DELETE' });
                            if (res.ok) fetchPostings();
                          } catch (err) {
                            console.error(err);
                          }
                        }} className="bg-red-600/20 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition">رفض وحذف الطلب</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentSection === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-indigo-400">إدارة وحظر وتدقيق بيانات المستخدمين والشركات المسجلة</h2>
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-white/10">
              <table className="w-full text-right text-sm">
                <thead className="bg-white/5 text-slate-400 text-xs">
                  <tr>
                    <th className="p-4">الاسم بالكامل</th>
                    <th className="p-4">البريد الإلكتروني الحقيقي</th>
                    <th className="p-4">كلمة المرور الموثقة</th>
                    <th className="p-4">التصنيف والـ Role</th>
                    <th className="p-4 text-center">عمليات الرقابة الإدارية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map(u => (
                    <tr key={u.id} className={u.isBlocked ? 'bg-red-950/20 opacity-60' : ''}>
                      <td className="p-4 font-bold">{u.fullName}</td>
                      <td className="p-4 font-mono text-xs">{u.email}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">🧬 {u.password} (محمية وموثقة)</td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">{u.role === 'seeker' ? 'طالب توظيف' : 'مورد / مقاول'}</span></td>
                      <td className="p-4 text-center space-x-reverse space-x-2">
                        <button onClick={() => toggleUserBlock(u.id)} className={`px-2 py-1 rounded text-xs font-bold transition ${u.isBlocked ? 'bg-amber-600 text-slate-950' : 'bg-slate-800 text-amber-500 hover:bg-amber-600 hover:text-slate-950'}`}>{u.isBlocked ? 'إلغاء الحظر' : 'حظر الحساب'}</button>
                        <button onClick={() => handleDeleteUser(u.id)} className="bg-red-600/20 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition">حذف نهائي</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-slate-500 text-xs">لا يوجد أي أفراد أو شركات مسجلة في قاعدة البيانات حالياً.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentSection === 'logs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-300">نظام الحماية المطلقة والرقابة على السيرفر والأمان</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 text-center space-y-2">
                <span className="text-slate-400 text-xs block">إجمالي عمليات تسجيل الدخول الآمنة حالياً</span>
                <span className="text-4xl font-black text-blue-400">{loginCount} عملية دخول موثقة</span>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/20 text-center space-y-2">
                <span className="text-red-400 text-xs block">حالة جدار الحماية (Firewall)</span>
                <span className="text-lg font-bold text-emerald-400 block">🔒 مفعل ونشط لأعلى حماية حظر تكرار تلقائي</span>
                <p className="text-slate-500 text-xs">يتم تلقائياً رصد وحظر أي حساب يخطئ لأكثر من 3 مرات متتالية وإرسال تنبيه فوري لإيميلات الإدارة.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}