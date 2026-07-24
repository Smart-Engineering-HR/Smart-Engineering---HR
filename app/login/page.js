"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // منطق تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // نستخدم نافذة المتصفح لضمان الانتقال الكامل والنهائي للوحة الإدارة
        window.location.href = '/admin/dashboard';
      } else {
        alert('فشل تسجيل الدخول: يرجى التأكد من البريد الإلكتروني وكلمة المرور');
      }
    } catch (err) {
      console.error("خطأ أثناء تسجيل الدخول:", err);
      alert('حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  // واجهة استعادة كلمة المرور
  if (view === 'forgot') {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border rounded-xl shadow-2xl text-right bg-white" dir="rtl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 transition">
          <ArrowRight size={20} /> العودة للخلف
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">استعادة الوصول للحساب</h2>
        <p className="text-gray-600 mb-4 text-sm">أدخل بريدك الإلكتروني لإرسال تعليمات استعادة كلمة المرور.</p>
        <div className="space-y-4">
          <input 
            type="email" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="example@mail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            onClick={() => setView('reset-sent')}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            إرسال رابط الاستعادة
          </button>
          <button onClick={() => setView('login')} className="w-full text-blue-600 mt-2 hover:underline">
            ← العودة إلى تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // واجهة تأكيد إرسال رابط الاستعادة
  if (view === 'reset-sent') {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border rounded-xl shadow-2xl text-center bg-white" dir="rtl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 transition">
          <ArrowRight size={20} /> العودة للخلف
        </button>
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-xl font-bold mb-4">تم إرسال الرابط!</h2>
        <p className="text-gray-600 mb-6 text-sm">
          تم إرسال تعليمات استعادة كلمة المرور إلى البريد: <b>{email}</b>.
        </p>
        <button onClick={() => setView('login')} className="w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-black transition">
          العودة لتسجيل الدخول
        </button>
      </div>
    );
  }

  // الواجهة الرئيسية (تسجيل الدخول)
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-xl shadow-2xl text-right bg-white" dir="rtl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 transition">
        <ArrowRight size={20} /> العودة للخلف
      </button>
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">تسجيل الدخول</h2>
      <p className="text-gray-500 text-center mb-8 text-sm italic">الهندسة الذكية و HR</p>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">البريد الإلكتروني</label>
          <input 
            type="email" 
            required 
            className="w-full p-3 border rounded-lg outline-none focus:border-blue-500" 
            placeholder="admin@smart-eng.com" 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">كلمة المرور</label>
          <input 
            type="password" 
            required 
            className="w-full p-3 border rounded-lg outline-none focus:border-blue-500" 
            placeholder="••••••••" 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600">
            <input type="checkbox" className="w-4 h-4" /> تذكرني
          </label>
          <button type="button" onClick={() => setView('forgot')} className="text-red-500 hover:underline">نسيت كلمة المرور؟</button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-700 text-white p-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-blue-400"
        >
          {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t text-center">
        <p className="text-gray-600 text-sm">ليس لديك حساب؟</p>
        <Link href="/register" className="text-blue-600 font-bold hover:underline">سجل الآن كباحث عن عمل أو مورد</Link>
      </div>
    </div>
  );
}