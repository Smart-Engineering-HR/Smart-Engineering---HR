"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    // حالات التحكم في النوافذ والمراحل المتعددة (من الكود الأول)
    const [step, setStep] = useState('login'); // login, forgot, reset-confirm

    // حالات البيانات والاتصال بالخادم الموحدة والمكافئة للكودين
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [forgotEmail, setForgotEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // دالة تسجيل الدخول الموحدة والمحسنة (المسار الفعال المعتمد)
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/advertise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actionType: 'LOGIN',
                    email: credentials.email,
                    password: credentials.password
                })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ 
                    type: 'success', 
                    text: 'تم التحقق بنجاح! جاري الانتقال إلى لوحة التحكم الشخصية...' 
                });
                
                // التحويل التلقائي الآمن بعد 1200 ملي ثانية
                setTimeout(() => {
                    window.location.href = '/admin/dashboard';
                }, 1200);
            } else {
                setMessage({ 
                    type: 'error', 
                    text: data.error || 'البيانات المدخلة غير صحيحة' 
                });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'خطأ في الاتصال بالخادم المركزي للمنصة' });
        } finally {
            setLoading(false);
        }
    };

    // دالة طلب استعادة كلمة المرور (من الكود الأول)
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/advertise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: forgotEmail, 
                    actionType: 'FORGOT_PASSWORD' 
                }),
            });

            if (res.ok) {
                setStep('reset-confirm');
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'حدث خطأ ما، حاول مجدداً' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'خطأ في الاتصال بالخادم المركزي للمنصة' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6" dir="rtl">
            <div className="w-full max-w-md border border-blue-900 bg-gray-950 p-8 rounded-xl shadow-2xl">
                
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-500">بوابة تسجيل الدخول للمنصة</h1>
                
                {/* صندوق رسائل الخطأ أو النجاح الديناميكية الموحد */}
                {message.text && (
                    <div className={`p-3 rounded mb-4 text-sm text-center border transition-all duration-300 ${
                        message.type === 'success' 
                            ? 'bg-green-950 text-green-400 border-green-800' 
                            : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* المرحلة الأولى: نموذج تسجيل الدخول الرئيسي */}
                {step === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">البريد الإلكتروني</label>
                            <input 
                                type="email" 
                                placeholder="example@domain.com" 
                                value={credentials.email} 
                                onChange={e => setCredentials({...credentials, email: e.target.value})} 
                                required 
                                className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-sm text-left"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">كلمة المرور</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={credentials.password} 
                                onChange={e => setCredentials({...credentials, password: e.target.value})} 
                                required 
                                className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-sm text-left"
                            />
                        </div>

                        {/* خيارات التذكر واستعادة كلمة المرور الفرعية */}
                        <div className="flex justify-between items-center text-xs text-gray-400 px-1 py-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" className="h-4 w-4 bg-gray-900 border-gray-800 rounded text-blue-600 focus:ring-0 cursor-pointer" /> 
                                <span>تذكرني</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('forgot');
                                    setMessage({ type: '', text: '' }); // تصفير الإشعارات عند التبديل
                                }}
                                className="text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                نسيت كلمة المرور؟
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 p-3 rounded-lg font-bold text-base transition mt-2 text-white"
                        >
                            {loading ? 'جاري فحص وتأمين الدخول...' : 'تسجيل الدخول'}
                        </button>

                        <div className="text-center pt-4">
                            <Link href="/jobs-tenders/register" className="text-xs text-gray-500 hover:text-white transition-colors">
                                لا تملك حساباً؟ انضم إلينا الآن ونفّذ مشاريعك
                            </Link>
                        </div>
                    </form>
                )}

                {/* المرحلة الثانية: واجهة استعادة كلمة المرور النافذة */}
                {step === 'forgot' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-200">استعادة كلمة المرور</h2>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            أدخل بريدك الإلكتروني المعتمد لإرسال رابط إعادة التعيين الفوري بصلاحية أمان مدتها 90 دقيقة.
                        </p>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">البريد الإلكتروني المعتمد</label>
                                <input 
                                    type="email" 
                                    placeholder="example@domain.com" 
                                    value={forgotEmail} 
                                    onChange={e => setForgotEmail(e.target.value)} 
                                    required 
                                    className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-sm text-left"
                                />
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 p-3 rounded-lg font-bold text-sm transition text-white"
                                >
                                    {loading ? "جاري إرسال الطلب..." : "إرسال رابط إعادة التعيين"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('login');
                                        setMessage({ type: '', text: '' });
                                    }}
                                    className="w-full text-gray-400 hover:text-white py-2 text-xs transition-all text-center"
                                >
                                    من هنا للعودة لصفحة تسجيل الدخول الرئيسية
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* المرحلة الثالثة: تأكيد إرسال الرابط للبريد الإلكتروني */}
                {step === 'reset-confirm' && (
                    <div className="text-center py-4">
                        <div className="w-12 h-12 bg-green-950/50 text-green-400 border border-green-800 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                            ✓
                        </div>
                        <h3 className="text-white font-bold mb-2 text-base">تم الإرسال بنجاح!</h3>
                        <p className="text-gray-400 text-xs mb-6 px-4 leading-relaxed">
                            يرجى مراجعة صندوق الوارد في بريدك الإلكتروني، الرابط المرسل صالح للاستخدام لمدة 90 دقيقة فقط.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setStep('login');
                                setMessage({ type: '', text: '' });
                            }}
                            className="text-blue-500 font-bold hover:underline text-xs"
                        >
                            العودة إلى بوابة الدخول
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}