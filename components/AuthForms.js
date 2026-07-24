'use client';
import React, { useState } from 'react';

export const AuthForms = ({ type }) => {
  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-lg shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {type === 'login' ? 'تسجيل الدخول إلى حسابك' : 
         type === 'register' ? 'إنشاء حساب جديد' : 'أعلن معنا'}
      </h2>
      
      {/* مثال للحقول (سيتم تكرارها حسب نوع النموذج) */}
      <div className="space-y-4">
        <input className="w-full p-4 bg-slate-950 rounded-xl border border-slate-700" placeholder="البريد الإلكتروني" />
        <input className="w-full p-4 bg-slate-950 rounded-xl border border-slate-700" type="password" placeholder="كلمة المرور" />
        
        <button className="w-full bg-emerald-600 p-4 rounded-xl font-bold hover:bg-emerald-500 transition">
          {type === 'login' ? 'تسجيل الدخول' : 'إرسال البيانات'}
        </button>
      </div>
    </div>
  );
};