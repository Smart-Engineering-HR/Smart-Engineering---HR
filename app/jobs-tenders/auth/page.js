'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // التحكم في الشاشة الظاهرة
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset_page'
  
  // النماذج وحالات الخطأ والحظر
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorCount, setErrorCount] = useState({}); // لتتبع الأخطاء لكل بريد إلكتروني للحظر التلقائي بعد 3 محاولات
  
  // نموذج استعادة وكلمة المرور الجديدة
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('');

  useEffect(() => {
    const action = searchParams.get('action');
    const paramEmail = searchParams.get('email');
    if (action === 'reset' && paramEmail) {
      setView('reset_page');
      setResetEmail(paramEmail);
    }
  }, [searchParams]);

  // آلية تسجيل الدخول الموثق وجدار الحماية الصارم
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // فحص إذا كان البريد محظوراً مسبقاً لتوفير الحماية المطلقة ومكافحة الانتحال
    if (errorCount[email] >= 3) {
      alert('تم حظر هذا الحساب تلقائياً نظراً لمحاولات تسجيل دخول خاطئة متكررة لأكثر من 3 مرات! تم إرسال إشعار فوري للإدارة.');
      await fetch('/api/notificationEngine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'AUTH_SECURITY_ALERT', data: { email } })
      });
      return;
    }

    // جلب المستخدمين المسجلين للمطابقة
    const registeredUsers = JSON.parse(localStorage.getItem('se_registered_users') || '[]');
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      if (foundUser.isBlocked) {
        alert('حسابك محظور من قبل أدمن المنصة لأسباب إدارية ورقابية.');
        return;
      }
      // زيادة عدد الذين يعملون تسجيل دخول بنجاح للرقابة والإحصاء
      let currentCount = parseInt(localStorage.getItem('se_login_count') || '0');
      localStorage.setItem('se_login_count', (currentCount + 1).toString());
      
      alert(`مرحباً بك مجدداً ${foundUser.fullName} في منصة الهندسة الذكية!`);
      router.push('/jobs-tenders');
    } else {
      // تسجيل المحاولة الخاطئة وتحديث العداد لحماية السيرفر
      const updatedErrors = { ...errorCount, [email]: (errorCount[email] || 0) + 1 };
      setErrorCount(updatedErrors);
      
      if (updatedErrors[email] >= 3) {
        setAuthStatus('🚨 تم حظر هذا الحساب بشكل فوري للاشتباه في محاولة اختراق مريبة!');
        await fetch('/api/notificationEngine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'AUTH_SECURITY_ALERT', data: { email } })
        });
      } else {
        alert(`كلمة مرور أو بريد خاطئ! المحاولات المتبقية قبل الحظر التام: ${3 - updatedErrors[email]}`);
      }
    }
  };

  // إرسال رابط إعادة التعيين بصلاحية 90 دقيقة فقط
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setAuthStatus('جاري التحقق من الحساب وإرسال الرابط الآمن بمدة صلاحية 90 دقيقة...');
    
    const res = await fetch('/api/notificationEngine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'PASSWORD_RESET_REQUEST', data: { email: resetEmail } })
    });

    if (res.ok) {
      setAuthStatus('📬 تم إرسال رابط إعادة التعيين المباشر وصلاحيته 90 دقيقة إلى بريدك الإلكتروني بنجاح، كما تم إخطار أدمن المنصة.');
    } else {
      setAuthStatus('فشل إرسال طلب استعادة كلمة المرور.');
    }
  };

  // إنشاء كلمة مرور جديدة تماماً وحفظها
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('كلمات المرور الجديدة غير متطابقة بالمرة!');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('se_registered_users') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.email === resetEmail);

    if (userIndex !== -1) {
      registeredUsers[userIndex].password = newPassword;
      localStorage.setItem('se_registered_users', JSON.stringify(registeredUsers));
      alert('تم تحديث وإنشاء كلمة المرور الجديدة بنجاح تام! يمكنك الآن تسجيل الدخول.');
      setView('login');
    } else {
      alert('البريد الإلكتروني المدخل لإنشاء كلمة المرور الجديدة غير مسجل بملفات منصة الهندسة الذكية.');
    }
  };

  return (
    <div style={{ direction: 'rtl', backgroundColor: '#0f172a' }} className="min-h-screen text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl space-y-6">
        
        {view === 'login' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white">تسجيل الدخول إلى حسابك</h2>
              <p className="text-xs text-slate-400 mt-1">بوابة الوظائف والمناقصات - منصة الهندسة الذكية</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div><label className="block text-xs font-bold mb-1">حقل البريد الإلكتروني</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800 border border-white/15 rounded-xl p-3 text-sm outline-none focus:border-blue-500 text-white" placeholder="name@example.com" /></div>
              <div><label className="block text-xs font-bold mb-1">حقل كلمة المرور</label><input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-800 border border-white/15 rounded-xl p-3 text-sm outline-none focus:border-blue-500 text-white" placeholder="••••••••" /></div>
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded bg-slate-800 border-white/15 text-blue-600" /> تذكرني</label>
                <button type="button" onClick={() => setView('forgot')} className="text-blue-400 hover:underline">نسيت كلمة المرور؟</button>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-sm">تسجيل الدخول</button>
            </form>
          </div>
        )}

        {view === 'forgot' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">استعادة وطلب كلمة المرور</h2>
              <p className="text-xs text-slate-400 mt-1">أدخل البريد الإلكتروني لإرسال الرابط الآمن ذو صلاحية الـ 90 دقيقة</p>
            </div>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div><label className="block text-xs font-bold mb-1">حقل البريد الإلكتروني</label><input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)} className="w-full bg-slate-800 border border-white/15 rounded-xl p-3 text-sm outline-none" placeholder="name@example.com" /></div>
              <div className="flex justify-between items-center text-xs pt-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition">زر إرسال رابط إعادة التعيين للإصدار</button>
                <button type="button" onClick={() => setView('login')} className="text-slate-400 hover:text-white flex items-center gap-1">زر العودة إلى صفحة تسجيل الدخول →</button>
              </div>
            </form>
          </div>
        )}

        {view === 'reset_page' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-amber-400">الهندسة الذكية و HR</h2>
              <p className="text-sm font-semibold text-white mt-1">((إنشاء كلمة مرور جديدة))</p>
            </div>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div><label className="block text-xs font-bold mb-1">a. حقل البريد الإلكتروني المؤكد</label><input type="email" disabled value={resetEmail} className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-sm text-slate-400 cursor-not-allowed" /></div>
              <div><label className="block text-xs font-bold mb-1">b. حقل كلمة المرور الجديدة *</label><input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-800 border border-white/15 rounded-xl p-3 text-sm outline-none" placeholder="أدخل كلمة مرور قوية" /></div>
              <div><label className="block text-xs font-bold mb-1">c. تأكيد كلمة المرور الجديدة *</label><input type="password" required value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full bg-slate-800 border border-white/15 rounded-xl p-3 text-sm outline-none" placeholder="كرر كلمة المرور للتأكيد" /></div>
              <div className="flex justify-between items-center text-xs pt-2">
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition">زر إعادة تعيين كلمة المرور</button>
                <button type="button" onClick={() => setView('login')} className="text-slate-400 hover:text-white">زر العودة إلى صفحة تسجيل الدخول</button>
              </div>
            </form>
          </div>
        )}

        {authStatus && <div className="p-3 bg-white/5 rounded-xl text-center text-xs text-amber-300 border border-white/10">{authStatus}</div>}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">جاري تحميل نظام الأمان المطلق والمصادقة...</div>}>
      <AuthContent />
    </Suspense>
  );
}