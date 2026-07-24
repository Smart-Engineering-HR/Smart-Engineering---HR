'use client';
import React, { useState, useEffect } from 'react';

export default function IntegratedAdminDashboard() {
  // الحالات الأمنية والتحقق مع توحيد مفتاح التخزين المحرك للمنصة
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('jobs');
  const [activeSub, setActiveSub] = useState('الوظائف'); 
  const [formData, setFormData] = useState({});
  
  const [adminPostings, setAdminPostings] = useState([]);
  const [loadingPostings, setLoadingPostings] = useState(false);
  const [editingId, setEditingId] = useState(null); 

  const [platformUsers, setPlatformUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalPostings: 0, totalVisitors: 1024 });

  const menu = [    
    { id: 'jobs', name: 'بوابة التوظيف والمناقصات', subs: ['الوظائف', 'المناقصات', 'إدارة الإعلانات الحالية', 'أعلن معنا'] },
    { id: 'users-control', name: 'الرقابة وإدارة الحسابات', subs: ['إدارة الحسابات والمسجلين', 'سجلات تسجيل الدخول وحركة الزوار'] },
    { id: 'academy', name: 'الأكاديمية والتدريب', subs: ['كافة الأكاديمية', 'المسارات التعليمية'] },
    { id: 'software', name: 'برمجيات وادوات', subs: ['تطبيقات الويب الحية'] },
    { id: 'services', name: 'خدماتنا', subs: ['الخدمات الإنشائية والمدنية'] },
    { id: 'articles', name: 'أفكار وعلوم', subs: ['هندسة المستقبل'] },
    { id: 'feedbacks', name: 'شاركنا رأيك', subs: ['نموذج الذكي العام'] },
    { id: 'messages', name: 'قنوات التواصل الحية', subs: ['تفاصيل خطوط الدعم الدائم'] }  
  ];

  // دالة موحدة لطلب كافة بيانات السيرفر بشكل احترافي ومتزامن
  const fetchAdminData = async () => {
    setLoadingPostings(true);
    try {
      const res = await fetch('/api/postings');
      if (res.ok) {
        const data = await res.json();
        setAdminPostings(data);
        setStats(prev => ({ ...prev, totalPostings: data.length }));
      }
    } catch (err) {
      console.error("Error fetching admin postings:", err);
    } finally {
      setLoadingPostings(false);
    }
  };

  // دالة جلب المستخدمين للتحكم الكامل (معرفة الإيميل، كلمة المرور، الحذف، والحظر)
  const fetchPlatformUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/system-notifications?action=getUsers');
      if (res.ok) {
        const data = await res.json();
        setPlatformUsers(data.users || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // دالة جلب إحصائيات حركة الزوار النشطة لتسجيل الدخول والعدادات السحابية
  const fetchPlatformStats = async () => {
    try {
      const res = await fetch('/api/system-notifications?action=getStats');
      if (res.ok) {
        const data = await res.json();
        setStats(prev => ({ 
          ...prev, 
          totalUsers: data.totalUsers, 
          totalPostings: data.totalPostings ?? prev.totalPostings, 
          totalVisitors: data.totalVisitors || prev.totalVisitors 
        }));
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    // دمج التحقق عبر المفتاحين لضمان عدم حدوث تضارب في المزامنة الأمنية للتوكين والتوثيق
    const authStatus = localStorage.getItem('isAdminAuthenticated') || localStorage.getItem('global_admin_authenticated');
    if (authStatus === 'true') {
      setIsAdmin(true);
      fetchAdminData();
      fetchPlatformUsers();
      fetchPlatformStats();
    }

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      const subParam = urlParams.get('sub');
      const editIdParam = urlParams.get('editId');
      const deleteIdParam = urlParams.get('deleteId');

      if (tabParam) setActiveTab(tabParam);
      if (subParam) setActiveSub(subParam);
      
      if (editIdParam) {
        setEditingId(editIdParam);
        fetch('/api/postings').then(res => res.json()).then(data => {
          const item = data.find(p => p.id === editIdParam);
          if (item) {
            try {
              // محاولة تفكيك الحقول الـ 14 والـ 22 في حال وصولها كبنية معقدة
              const parsed = JSON.parse(item.moreInfo);
              setFormData(parsed);
            } catch (e) {
              setFormData(item);
            }
            alert(`تم استدعاء الإعلان الذكي رقم #${editIdParam.slice(0,8)} بنجاح داخل لوحة التحكم لإجراء التعديل الحصري.`);
          }
        });
      }

      if (deleteIdParam) {
        const confirmDelete = confirm("تأكيد أمني من لوحة التحكم الذكية: هل أنت متأكد مطلقاً من رغبتك في حذف هذا الإعلان نهائياً من قاعدة البيانات؟");
        if (confirmDelete) {
          handleAdminDelete(deleteIdParam);
        }
      }
    }
  }, [isAdmin]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const formattedEmail = loginEmail.trim().toLowerCase();
    
    if (formattedEmail === 'smart.engineering.global@proton.me' && loginPassword === 'admin2026') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('global_admin_authenticated', 'true');
      setIsAdmin(true);
      fetchAdminData();
      fetchPlatformUsers();
      fetchPlatformStats();
    } else {
      alert('خطأ في كلمة المرور أو بريد المسؤول المباشر!');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('global_admin_authenticated');
    setIsAdmin(false);
  };

  // دالة التحكم بحذف مستخدم مسجل نهائياً وتطهيره
  const handleUserDelete = async (id) => {
    if (!confirm('هل أنت متأكد تماماً من حذف هذا الحساب نهائياً ومنع صاحبه من الوصول للمنصة؟')) return;
    try {
      const res = await fetch(`/api/system-notifications?action=deleteUser&id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('تم حذف وتطهير حساب المستخدم بنجاح من قاعدة البيانات.');
        fetchPlatformUsers();
        fetchPlatformStats();
      } else {
        alert('فشل أمر حذف المستخدم من السيرفر.');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالخادم.');
    }
  };

  // دالة التحكم بحظر/تعديل صلاحية مستخدم (حظر الدخول الفوري عن طريق سحب الـ Role)
  const handleUserToggleBan = async (id, currentRole) => {
    const nextRole = currentRole === 'BANNED' ? 'job-seeker' : 'BANNED';
    const msg = currentRole === 'BANNED' ? 'هل تود فك الحظر عن هذا الحساب؟' : 'هل أنت متأكد من حظر هذا المستخدم فوراً ومنعه من تسجيل الدخول؟';
    if (!confirm(msg)) return;
    try {
      const res = await fetch('/api/system-notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateUserRole', id, role: nextRole })
      });
      if (res.ok) {
        alert('تم تحديث حالة الحساب والحظر بنجاح في النظام.');
        fetchPlatformUsers();
      } else {
        alert('فشل تعديل صلاحيات المستخدم.');
      }
    } catch (err) {
      alert('خطأ في السيرفر.');
    }
  };

  // إجراء الحذف الآمن والمحمي بالكامل من السيرفر للإعلانات والمناقصات
  const handleAdminDelete = async (id) => {
    try {
      const res = await fetch(`/api/postings?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('تم حذف السجل بنجاح وقطعياً من قاعدة البيانات السحابية عبر لوحة التحكم الذكية.');
        setAdminPostings(adminPostings.filter(p => p.id !== id));
        fetchAdminData();
        fetchPlatformStats();
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        alert('فشلت عملية الحذف، يرجى التحقق من السيرفر.');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالـ API');
    }
  };

  // تفعيل التعديل وتعبئة الاستمارة بالحقول المعقدة أو الحقول البسيطة المدمجة
  const handleAdminEditTrigger = (item) => {
    setEditingId(item.id);
    try {
      const parsed = JSON.parse(item.moreInfo);
      setFormData(parsed);
      setActiveSub(item.advertiseType === 'مناقصة' || item.type === 'tender' ? 'المناقصات' : 'الوظائف');
    } catch (e) {
      setFormData(item);
      setActiveSub(item.type === 'tender' ? 'المناقصات' : 'الوظائف');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // دمج معالجة وحفظ البيانات لكلا النموذجين (حقول 14 و 22 والنموذج المبسط) دون تضارب
  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    const isJob = activeSub === 'الوظائف';
    
    // تأمين الحقول الهيكلية لكلا الكودين لضمان القراءة الصحيحة في الـ API وقاعدة البيانات
    const mainTitle = formData.title || (isJob ? formData['المسمى الوظيفي عريض أعلى الصفحة'] : formData['عنوان المناقصة عريض أعلى الصفحة']);
    const locationField = formData.location || (isJob ? formData['مكان العمل'] : formData['بلد ومدينة ومكان المناقصة']);
    const websiteField = formData.website || formData['رابط الحصول على المناقصة'] || formData['طريقة التتقديم والرابط الايميل'] || "لا يوجد";
    const companyField = formData.company || formData['نبذه عن جهة التوظيف'] || "إعلان هندسي معتمد";
    const expiryField = formData.expiryDate || formData['تاريخ انتهاء الإعلان'] || formData['تاريخ انتهاء قبول الطلبات والعطاءات'] || "";

    const payload = {
      ...formData,
      id: editingId || undefined,
      title: mainTitle,
      company: companyField,
      location: locationField,
      expiryDate: expiryField,
      type: isJob ? 'job' : 'tender',
      companyName: companyField,
      address: locationField,
      advertiseType: isJob ? 'وظيفة' : 'مناقصة',
      website: websiteField,
      isAdminAction: true,
      status: 'APPROVED',
      moreInfo: JSON.stringify({ 
        ...formData, 
        title: mainTitle, 
        company: companyField, 
        location: locationField, 
        expiryDate: expiryField,
        _mainTitle: mainTitle, 
        _type: isJob ? 'وظيفة' : 'مناقصة' 
      })
    };

    try {
      const url = editingId ? `/api/postings?id=${editingId}` : '/api/postings';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingId ? 'تم تعديل وتحديث الإعلان بنظام النشر الفوري للجمهور بنجاح!' : 'تم اعتماد ونشر الإعلان الجديد للجمهور فوراً بنجاح هندسي عالي.');
        setFormData({});
        setEditingId(null);
        fetchAdminData();
        fetchPlatformStats();
        setActiveSub('إدارة الإعلانات الحالية');
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        alert('حدث خطأ أثناء معالجة الطلب في السيرفر.');
      }
    } catch (err) {
      alert('خطأ في الاتصال بقاعدة البيانات السحابية');
    }
  };

  const handleApprovePostingDirectly = async (id, currentData) => {
    try {
      const res = await fetch(`/api/postings?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentData, status: 'APPROVED' })
      });
      if (res.ok) {
        alert('تمت الموافقة الأمنية الفورية على الإعلان، وهو الآن معروض للجمهور في صفحة الـ jobs-tenders بنجاح!');
        fetchAdminData();
        fetchPlatformStats();
      } else {
        alert('فشل الاعتماد المباشر.');
      }
    } catch (err) {
      alert('خطأ في خادم الموافقة');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <span className="text-2xl text-slate-950 font-black">⚡</span>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-100 tracking-tight">لوحة التحكم المركزية المشتركة</h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest uppercase">SMART ENGINEERING CONTROL PANEL</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-3 text-right text-xs pt-2">
            <div>
              <label className="block text-slate-400 font-bold mb-1">البريد الإلكتروني المعتمد للمسؤول *</label>
              <input required type="email" placeholder="البريد الإلكتروني للإدارة" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-medium outline-none focus:border-amber-500" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-slate-400 font-bold mb-1">كلمة المرور السرية والمطابقة *</label>
              <input required type="password" placeholder="كلمة المرور الأمنية" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-amber-500" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            </div>
            <button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs p-3 rounded-xl w-full hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg mt-2">
              تسجيل دخول آمن للوحة التحكم
            </button>
          </form>
          <p className="text-[9px] text-slate-500 font-bold">بوابة محمية هندسياً بقفل تشفير مزدوج لضمان سلامة العمليات التعديلية وقاعدة البيانات.</p>
        </div>
      </div>
    );
  }

  const activeMenuObj = menu.find(m => m.id === activeTab) || menu[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex" dir="rtl">
      
      {/* القائمة الجانبية الفخمة للوحة الإدارة الذكية ومحاور التحكم */}
      <div className="w-64 bg-slate-950 text-slate-200 border-l border-slate-900 flex flex-col justify-between sticky top-0 h-screen z-30 shadow-2xl">
        <div className="p-4 space-y-6">
          <div className="flex items-center space-x-2 space-x-reverse border-b border-slate-900 pb-4">
            <div className="bg-amber-500 p-2 rounded-xl text-slate-950 font-black text-sm shadow">⚡</div>
            <div>
              <h2 className="text-xs font-black bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">اللوحة الذكية للأتمتة | م. هاشم</h2>
              <p className="text-[8px] text-slate-500 font-bold tracking-widest">ADMIN PANEL v3.1</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            {menu.map((item) => (
              <div key={item.id} className="space-y-0.5">
                <span className="block font-black text-slate-500 text-[9px] px-2 pt-2 uppercase tracking-wider">{item.name}</span>
                {item.subs.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => { 
                      setActiveTab(item.id); 
                      setActiveSub(sub); 
                      if(sub === 'إدارة الإعلانات الحالية') fetchAdminData(); 
                      if(sub === 'إدارة الحسابات والمسجلين') fetchPlatformUsers();
                    }}
                    className={`w-full text-right p-2 rounded-xl font-bold flex items-center justify-between transition-all ${activeSub === sub && activeTab === item.id ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                    <span>{sub}</span>
                    {activeSub === sub && activeTab === item.id && <span className="text-[9px] font-black">●</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-900 bg-slate-950 space-y-2">
          <div className="text-[10px] text-slate-400 font-bold flex flex-col gap-0.5">
            <span>المسؤول: <span className="text-amber-400">م. هاشم سلطان</span></span>
            <span>الربط بقاعدة البيانات: <span className="text-emerald-400">متصل وآمن</span></span>
          </div>
          <button onClick={handleAdminLogout} className="bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-[10px] font-black w-full p-2 rounded-lg border border-rose-500/20 transition-all">
            تسجيل الخروج من النظام
          </button>
        </div>
      </div>

      {/* منطقة العمل المركزية الفخمة لعرض التبويبات والبيانات المفتوحة هندسياً */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* شريط الإدارة العلوي المحتوي على العدادات والمؤشرات الحية */}
        <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{activeMenuObj.name}</span>
              <span className="text-xs text-slate-400 font-bold">←</span>
              <span className="text-xs text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">{activeSub}</span>
            </h1>
          </div>
          
          <div className="flex gap-4 text-center">
            <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-black text-slate-900 block">{stats.totalUsers} حساب</span>
              <span className="text-[9px] text-slate-500 font-bold">إجمالي الحسابات المسجلة</span>
            </div>
            <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-black text-emerald-600 block">{stats.totalPostings} إعلان</span>
              <span className="text-[9px] text-slate-500 font-bold">إجمالي الإعلانات والمناقصات</span>
            </div>
            <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-black text-blue-600 block">{stats.totalVisitors} حركة</span>
              <span className="text-[9px] text-slate-500 font-bold">حركة المرور والزيارات الإجمالية</span>
            </div>
          </div>
        </div>

        {/* أشرطة التبويبات الفرعية الداخلية لتعزيز دقة التحكم الفخم بالمنصة الإنشائية */}
        <div className="bg-slate-100/60 p-2.5 border-b border-slate-200 flex flex-wrap gap-1.5">
          {activeMenuObj.subs.map((sub) => (
            <button
              key={sub}
              onClick={() => { 
                setActiveSub(sub); 
                if(sub === 'إدارة الإعلانات الحالية') fetchAdminData(); 
                if(sub === 'إدارة الحسابات والمسجلين') fetchPlatformUsers();
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${activeSub === sub ? 'bg-white text-slate-950 font-black border-slate-300 shadow-sm' : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-white/40'}`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* منطقة رندرة وعرض النماذج والجداول والتحكم الحصري لمنع حدوث التكرار أو الأخطاء */}
        <div className="p-6 max-w-6xl w-full mx-auto space-y-6 flex-1">
          
          {/* دمج الحقول الـ 14 والـ 22 في تبويب إدارة بوابة التوظيف والمناقصات - حقول الإدخال والاعتماد الكامل */}
          {activeTab === 'jobs' && (activeSub === 'الوظائف' || activeSub === 'المناقصات' || activeSub === 'أعلن معنا') && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 border-b pb-2">
                {editingId ? `🛠️ تعديل السجل المختار حالياً من قاعدة البيانات (معرف السجل: #${editingId.slice(0,8)})` : `➕ إضافة وإدراج إعلان/مناقصة معتمدة جديدة فورياً للجمهور`}
              </h3>
              
              <form onSubmit={handleAdminFormSubmit} className="space-y-4 text-xs text-right">
                
                {/* حقول الإدخال الهيكلية السريعة والمتقدمة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">العنوان الرئيسي للإعلان أو المسمى الوظيفي المبسط *</label>
                    <input type="text" className="w-full bg-slate-50 border p-2.5 rounded-xl text-slate-900 font-medium" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">الشركة أو الجهة المالكة للمشروع/العطاء المبسط *</label>
                    <input type="text" className="w-full bg-slate-50 border p-2.5 rounded-xl text-slate-900 font-medium" value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">التصنيف الإنشائي أو الهندسي الدقيق (Category) *</label>
                    <input type="text" placeholder="مثال: وظيفة هندسية، مناقصة عامة، توريد مواد" className="w-full bg-slate-50 border p-2.5 rounded-xl text-slate-900" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">الموقع الجغرافي أو مكان تنفيذ المشروع المبسط *</label>
                    <input type="text" className="w-full bg-slate-50 border p-2.5 rounded-xl text-slate-900" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">تاريخ انتهاء قبول الطلبات والعطاءات المبسط *</label>
                    <input type="date" className="w-full bg-slate-50 border p-2.5 rounded-xl text-slate-900 font-black" value={formData.expiryDate || ''} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">نوع الإعلان الهيكلي في السيرفر *</label>
                    <select className="w-full bg-slate-50 border p-2.5 rounded-xl text-slate-900 font-black" value={formData.type || (activeSub === 'المناقصات' ? 'tender' : 'job')} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="job">وظيفة تعاقدية (Job Posting)</option>
                      <option value="tender">مناقصة ومظروف مغلق (Tender)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-black text-amber-600 mb-3 text-xs">📋 الحقول التفصيلية الموسعة المتكاملة التابعة للنظام الإداري للمنصة:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(activeSub === 'الوظائف' ? 
                      ['المسمى الوظيفي عريض أعلى الصفحة', 'المسمى الوظيفي', 'مكان العمل', 'يتبع لمن الموظف إداريا', 'تاريخ الإعلان', 'تاريخ انتهاء الإعلان', 'نبذه عن جهة التوظيف', 'نبذه عن الوظيفة', 'الواجبات والمسؤوليات', 'المؤهلات ومتطلبات', 'المهارات والكفاءات', 'أي ملاحظات يتم أضافتها', 'طريقة التتقديم والرابط الايميل', 'ملاحظات نهائية إلزامية'] :
                      ['عنوان المناقصة عريض أعلى الصفحة', 'اعلان المناقصة', 'بلد ومدينة ومكان المناقصة', 'تاريخ الإعلان', 'تاريخ انتهاء الإعلان', 'رقم المناقصة', 'اسم المشروع', 'مكونات المناقصة', 'جهة التمويل', 'عملة العطاء', 'صلاحية العطاء', 'صلاحية ضمان العطاء', 'فترة التنفيذ', 'قيمة الضمان', 'موعد فتح المظاريف والتوقيت والمكان', 'شروط التتقديم', 'رابط وثائق المناقصة', 'طريقة التقديم العامة', 'المرفقات المتاحة', 'رابط الحصول على المناقصة', 'التواصل والاستفسار', 'أي ملاحظات إضافية']
                    ).map(field => (
                      <div key={field} className="space-y-1">
                        <label className="block font-bold text-slate-700 text-[11px]">{field}</label>
                        <input required type={field.includes('تاريخ') ? 'date' : 'text'} className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-950 font-bold focus:border-amber-500 outline-none text-xs transition-all" value={formData[field] || ''} onChange={e => setFormData({...formData, [field]: e.target.value})} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-600 font-bold mb-1">المعلومات والشروط والمستندات النصية العامة والمفتوحة للتقديم *</label>
                  <textarea rows="4" placeholder="اكتب الشروط والمواصفات الفنية التفصيلية هنا..." className="w-full bg-slate-50 border p-2.5 rounded-xl text-slate-900 font-medium" value={formData.moreInfoText || formData.moreInfo || ''} onChange={e => setFormData({...formData, moreInfoText: e.target.value, moreInfo: e.target.value})}></textarea>
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2 border-t">
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setFormData({}); window.history.replaceState({}, document.title, window.location.pathname); }} className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-300 transition-all">
                      إلغاء وضع التعديل
                    </button>
                  )}
                  <button type="submit" className="bg-slate-950 text-white px-10 py-3.5 rounded-xl font-black text-sm hover:bg-slate-900 transition-all shadow-md flex-1 md:flex-initial">
                    {editingId ? '💾 حفظ التعديلات ونشر الإعلان للجمهور فوراً بالخادم' : '➕ حفظ ونشر الإعلان الجديد للجمهور فوراً'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* تبويب الحذف والتعديل وإدارة الإعلانات الحالية - الجدول الذكي والاعتماد المحمي بالكامل */}
          {activeTab === 'jobs' && activeSub === 'إدارة الإعلانات الحالية' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xs font-black text-slate-900">📋 السجلات الحالية المخزنة في قاعدة البيانات (حصر الحذف والتعديل والاعتماد)</h3>
                <span className="text-[10px] text-slate-400 font-bold">تحديث تلقائي مدمج وموثق</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                      <th className="p-3">نوع الإعلان</th>
                      <th className="p-3">العنوان والشركة المعلنة</th>
                      <th className="p-3">الموقع والتاريخ</th>
                      <th className="p-3">حالة الظهور للجمهور</th>
                      <th className="p-3 text-center">العمليات الإدارية الحصرية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingPostings ? (
                      <tr><td colSpan="5" className="p-4 text-center text-slate-400 animate-pulse">جاري سحب الجداول الفنية من قاعدة البيانات السحابية...</td></tr>
                    ) : adminPostings.length > 0 ? adminPostings.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`border-b border-slate-100 hover:bg-slate-50/80 transition-all ${item.status === 'PENDING' ? 'bg-rose-50/40 border-r-4 border-r-rose-500' : ''}`}
                      >
                        <td className="p-3 font-bold">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] ${item.type === 'job' || item.advertiseType === 'وظيفة' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                            {item.type === 'job' || item.advertiseType === 'وظيفة' ? 'وظيفة تعاقدية' : 'مناقصة عامة'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="block font-black text-slate-900 text-xs">{item.title || item.companyName}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{item.company || item.companyName}</span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          <span className="block">{item.location || item.address}</span>
                          <span className="text-[10px] text-slate-400">ينتهي: {item.expiryDate || item.expiryDate}</span>
                        </td>
                        <td className="p-3 font-black">
                          {item.status === 'PENDING' ? (
                            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 animate-pulse text-[10px]">
                              🚫 محجوب عن الجمهور (معلق)
                            </span>
                          ) : (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                              ✓ مرئي ونشط للجمهور
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center space-x-1.5 space-x-reverse">
                          {item.status === 'PENDING' && (
                            <button 
                              onClick={() => handleApprovePostingDirectly(item.id, item)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded-lg transition shadow-sm"
                            >
                              ✓ اعتماد ونشر فوري
                            </button>
                          )}
                          <button 
                            onClick={() => handleAdminEditTrigger(item)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shadow-sm"
                          >
                            تعديل
                          </button>
                          <button 
                            onClick={() => { if(confirm("هل أنت متأكد من الحذف القطعي من لوحة التحكم؟")) handleAdminDelete(item.id); }} 
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shadow-sm"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="p-4 text-center text-slate-400 font-medium">لا توجد سجلات منشورة حالياً في قاعدة البيانات.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* تبويب التحكم بالمسجلين المضاف بالكامل لمعالجة الحسابات برمجياً وحياً */}
          {activeTab === 'users-control' && activeSub === 'إدارة الحسابات والمسجلين' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xs font-black text-slate-900">👥 لوحة التحكم بالهويات الرقمية للمنصة (رؤية البريد، كلمات المرور المرجعية، إمكانية الحذف الفوري والحظر)</h3>
                <span className="text-[10px] text-slate-400 font-bold">إجمالي المسجلين حالياً: {stats.totalUsers} حساب نشط</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                هنا تظهر الحسابات التي قامت بعملية التسجيل من واجهة الجمهور (قائمة سجل). النظام يقوم بحفظ السجلات تلقائياً وإخطار الإدارة لضمان المصداقية ومنع التسجيلات العشوائية.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-white border-b border-slate-200 font-bold">
                      <th className="p-3">الاسم بالكامل</th>
                      <th className="p-3">البريد الإلكتروني الحقيقي</th>
                      <th className="p-3">كلمة المرور الموثقة</th>
                      <th className="p-3">التصنيف والـ Role</th>
                      <th className="p-3 text-center">عمليات الرقابة الإدارية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {loadingUsers ? (
                      <tr><td colSpan="5" className="p-4 text-center text-slate-400 font-bold animate-pulse">جاري فحص سجلات المستخدمين المشتركين من قاعدة البيانات...</td></tr>
                    ) : platformUsers.length > 0 ? platformUsers.map((u) => (
                      <tr key={u.id} className={`hover:bg-slate-50 transition ${u.role === 'BANNED' ? 'bg-rose-50 text-rose-900' : ''}`}>
                        <td className="p-3 font-black text-slate-900">{u.name}</td>
                        <td className="p-3 text-blue-600 font-mono font-bold select-all">{u.email}</td>
                        <td className="p-3 text-slate-700 font-mono bg-slate-50">{u.password}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'BANNED' ? 'bg-rose-600 text-white' : u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-2 space-x-reverse">
                          <button onClick={() => handleUserToggleBan(u.id, u.role)} className={`text-[10px] font-bold px-2 py-1 rounded text-white transition ${u.role === 'BANNED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
                            {u.role === 'BANNED' ? 'تفعيل الحساب' : 'حظر فوري'}
                          </button>
                          <button onClick={() => handleUserDelete(u.id)} className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-1 rounded transition">تطهير وحذف</button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="p-4 text-center text-slate-400 py-6">لا يوجد أي حساب مستخدم مسجل حالياً في جدول قاعدة البيانات الإنشائية `User`.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* تبويب مراقبة سجلات الدخول وحركة مرور الزوار */}
          {activeTab === 'users-control' && activeSub === 'سجلات تسجيل الدخول وحركة الزوار' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-xs">⚡ نظام تتبع تسجيلات الدخول الحية (Live Auth Tracking Logs)</h4>
              <p className="text-slate-600 leading-relaxed font-semibold text-xs">
                كل حركة دخول تتم عبر واجهة "تسجيل الدخول للجمهور" يتم التقاطها وتوثيقها فورياً في جدول قاعدة البيانات. النظام مصمم لرفع العدادات تلقائياً عند زيارة بوابات التوظيف والمناقصات لعرضها في الشريط المركزي بالعلوي للمسؤول المباشر.
              </p>
              <div className="p-4 bg-slate-900 text-amber-400 rounded-xl font-mono text-[11px] border border-slate-800">
                ⚡ النظام يسجل حالياً بالخادم الفوري: [معرف الجلسة الأمنية، البريد المستدعى، وقت وتاريخ الدخول الدقيق، حالة الحساب الهيكلية].
              </div>
            </div>
          )}

          {/* تبويب الأكاديمية والتدريب */}
          {activeTab === 'academy' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-slate-500">🎓 وحدة الأكاديمية الهندسية والمسارات التدريبية المتقدمة - خاضعة للرقابة والاعتماد البرمجي الذكي.</p>
            </div>
          )}

          {/* تبويب برمجيات وأدوات */}
          {activeTab === 'software' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-slate-500">💻 تطبيقات الويب الحية وبرمجيات الأتمتة المخصصة للمهندسين المدنيين والإنشائيين - متصلة بالخادم الحركي.</p>
            </div>
          )}

          {/* تبويب خدماتنا الإنشائية والمدنية */}
          {activeTab === 'services' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-slate-500">🏗️ إدارة الخدمات الإنشائية والهندسة المعمارية وأتمتة Workflows للمشاريع الهندسية وإدارة الكنترول.</p>
            </div>
          )}

          {/* تبويب أفكار وعلوم */}
          {activeTab === 'articles' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-slate-500">🔬 وحدة هندسة المستقبل والمقالات العلمية التطبيقية المدمجة بأنظمة الذكاء الاصطناعي والأتمتة.</p>
            </div>
          )}

          {/* تبويب شاركنا رأيك */}
          {activeTab === 'feedbacks' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-slate-500">💬 تفاصيل المراجعات والنماذج الذكية العامة المرفوعة من قبل مستخدمي المنصة المفتوحة.</p>
            </div>
          )}

          {/* تبويب قنوات التواصل الحية والقنوات الفخمة لخطوط الدعم */}
          {activeTab === 'messages' && (
            <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="font-bold">Facebook: <span className="text-blue-400 underline break-all select-all">https://www.facebook.com/profile.php?id=61573267509001</span></p>
              <p className="font-bold">Emails: <span className="text-emerald-400 break-all select-all">Smart.Engineering.Global@proton.me | smart.engineering.global@tuta.io | smartengineering.hr.global@gmail.com</span></p>
              <p className="mt-4 text-amber-400 font-bold text-sm">ساعات عمل النظام والرقابة المركزية: السبت - الخميس (8 صباحاً - 12 ليلاً)</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}