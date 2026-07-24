"use client";
import { useState } from 'react';

export default function NewPasswordPage() {
  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white shadow-2xl rounded-xl border-t-4 border-blue-600" dir="rtl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">الهندسة الذكية & HR</h1>
        <p className="text-gray-500 mt-2">إنشاء كلمة مرور جديدة</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">البريد الإلكتروني</label>
          <input type="email" placeholder="example@mail.com" className="w-full p-3 border rounded-lg bg-gray-50" required />
        </div>
        
        <div>
          <label className="block text-sm mb-1">كلمة المرور الجديدة</label>
          <input type="password" placeholder="********" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
        </div>

        <div>
          <label className="block text-sm mb-1">تأكيد كلمة المرور الجديدة</label>
          <input type="password" placeholder="********" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            إعادة تعيين كلمة المرور
          </button>
          <button type="button" onClick={() => window.location.href='/jobs-tenders/login'} className="w-full text-gray-600 text-sm flex items-center justify-center gap-2">
             العودة إلى صفحة تسجيل الدخول <span>&larr;</span>
          </button>
        </div>
      </form>
    </div>
  );
}