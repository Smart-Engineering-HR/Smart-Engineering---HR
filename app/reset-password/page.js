"use client";
export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-xl shadow-2xl text-right bg-blue-50" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-2 text-blue-900 border-b pb-2">الهندسة الذكية و HR</h2>
        <h3 className="text-lg font-semibold mb-6 text-gray-700 text-center">إنشاء كلمة مرور جديدة</h3>
        
        <form className="space-y-4">
          <div>
            <label className="block mb-1 text-xs text-gray-500">البريد الإلكتروني</label>
            <input type="email" className="w-full p-2 border rounded bg-gray-50" placeholder="تأكيد البريد" required />
          </div>
          <div>
            <label className="block mb-1 text-xs text-gray-500">كلمة المرور الجديدة</label>
            <input type="password" className="w-full p-2 border rounded shadow-sm focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block mb-1 text-xs text-gray-500">تأكيد كلمة المرور الجديدة</label>
            <input type="password" className="w-full p-2 border rounded shadow-sm" required />
          </div>

          <div className="flex gap-2 pt-4">
            <button className="flex-1 bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700 transition">
              إعادة تعيين كلمة المرور
            </button>
            <a href="/login" className="flex-1 bg-gray-200 text-gray-800 p-2 rounded text-center font-bold hover:bg-gray-300 transition">
              العودة للدخول
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}