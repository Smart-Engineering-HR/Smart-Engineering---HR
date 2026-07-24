"use client";
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="mb-8 text-center">
         <h1 className="text-2xl font-black text-cyan-500">الهندسة الذكية & HR</h1>
         <div className="h-1 w-20 bg-cyan-600 mx-auto mt-2 rounded-full"></div>
      </div>
      
      <div className="w-full max-w-md bg-slate-900 border border-cyan-900/30 p-8 rounded-3xl shadow-2xl shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-white mb-8 text-center">إنشاء كلمة مرور جديدة</h2>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400 mr-2">البريد الإلكتروني</label>
            <input type="email" placeholder="بريدك الإلكتروني للتأكيد" className="w-full bg-slate-800/50 border border-slate-700 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400 mr-2">كلمة المرور الجديدة</label>
            <input type="password" placeholder="********" className="w-full bg-slate-800/50 border border-slate-700 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400 mr-2">تأكيد كلمة المرور الجديدة</label>
            <input type="password" placeholder="********" className="w-full bg-slate-800/50 border border-slate-700 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-4 rounded-2xl font-bold text-white shadow-lg shadow-cyan-600/30 hover:brightness-110 active:scale-[0.98] transition-all">
              إعادة تعيين كلمة المرور
            </button>
            <a href="/jobs-tenders/login" className="text-center text-slate-500 hover:text-white text-sm transition-colors font-medium">
              العودة إلى صفحة تسجيل الدخول
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}