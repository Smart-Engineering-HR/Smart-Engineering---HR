"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [userType, setUserType] = useState('job-seeker'); 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // دالة التعامل مع المدخلات الموحدة لكافة الحقول (بما فيها خانة الاختيار Checkbox)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // 1. التحقق الصارم من تطابق كلمات المرور من الكود الأول
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
            setLoading(false);
            return;
        }

        // 2. التحقق من الموافقة الإلزامية على الشروط والأحكام
        if (!formData.agree) {
            setMessage({ type: 'error', text: 'يجب الموافقة على الشروط والأحكام للمتابعة' });
            setLoading(false);
            return;
        }

        try {
            // إرسال البيانات مباشرة للمسار الموحد والمصحح (الكود الثاني والأساسي لإنهاء الـ 404)
            const res = await fetch('/api/advertise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actionType: 'REGISTER', // إرسال نوع العملية بدقة للمحرك الموحد
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: userType
                })
            });

            const data = await res.json();

            // فحص استجابة السيرفر الموحد
            if (res.ok) {
                setMessage({ 
                    type: 'success', 
                    text: data.message || 'تم تسجيل بياناتك بنجاح في النظام وجاري إشعار الإدارة فوراً عبر البريد!' 
                });
                
                // تصفير وإعادة تعيين النموذج بالكامل بعد النجاح المطلق
                setFormData({ name: '', email: '', password: '', confirmPassword: '', agree: false });
                
                // توجيه تلقائي وآمن للمستخدم إلى صفحة تسجيل الدخول بعد انقضاء ثانيتين
                setTimeout(() => {
                    window.location.href = '/jobs-tenders/login';
                }, 2000);
            } else {
                setMessage({ 
                    type: 'error', 
                    text: `[خطأ المنصة]: ${data.error || 'فشل ربط وتخزين البيانات بالمحرك المركزي'}` 
                });
            }

        } catch (error) {
            setMessage({ type: 'error', text: 'خطأ حرج في الاتصال بقاعدة البيانات المركزية أو خادم المنصة' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6" dir="rtl">
            <div className="w-full max-w-md border border-blue-900 bg-gray-950 p-8 rounded-xl shadow-2xl">
                
                <h1 className="text-2xl font-bold text-center mb-1 text-blue-500">إنشاء حساب جديد</h1>
                <p className="text-center text-sm text-gray-400 mb-6">منصة الهندسة الذكية والمناقصات</p>
                
                {/* أزرار التبديل واختيار فئة ونوع المستخدم */}
                <div className="flex bg-gray-900 rounded-lg p-1 mb-6 border border-gray-800">
                    <button 
                        type="button" 
                        onClick={() => setUserType('job-seeker')} 
                        className={`flex-1 py-2 rounded-md font-medium transition text-sm ${userType === 'job-seeker' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        مهندس / باحث عن عمل
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setUserType('supplier')} 
                        className={`flex-1 py-2 rounded-md font-medium transition text-sm ${userType === 'supplier' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        شركة / مورد مواد هندسية
                    </button>
                </div>

                {/* صندوق الإشعارات المشترك والذكي لعرض الأخطاء والنجاح بدقة */}
                {message.text && (
                    <div className={`p-3 rounded mb-4 text-sm text-center border ${
                        message.type === 'success' 
                            ? 'bg-green-950 text-green-400 border-green-800' 
                            : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* النموذج الموحد لإدخال البيانات */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">الاسم الكامل (الرباعي)</label>
                        <input 
                            name="name"
                            type="text"
                            required 
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white placeholder-gray-600 text-sm text-right" 
                            placeholder="اكتب اسمك الكامل هنا" 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">البريد الإلكتروني المهني المعتمد</label>
                        <input 
                            name="email"
                            type="email" 
                            required 
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-left placeholder-gray-600 text-sm" 
                            placeholder="example@domain.com" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">كلمة المرور الخاصة بالحساب</label>
                        <input 
                            name="password"
                            type="password" 
                            required 
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-left placeholder-gray-600 text-sm" 
                            placeholder="••••••••" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">تأكيد كلمة المرور</label>
                        <input 
                            name="confirmPassword"
                            type="password" 
                            required 
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-left placeholder-gray-600 text-sm" 
                            placeholder="أعد كتابة كلمة المرور للتحقق" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                        />
                    </div>

                    {/* خانة الاختيار والموافقة الإلزامية على السياسات */}
                    <div className="flex items-center pt-1">
                        <input
                            id="agree"
                            name="agree"
                            type="checkbox"
                            checked={formData.agree}
                            onChange={handleChange}
                            className="h-4 w-4 bg-gray-900 border-gray-800 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <label htmlFor="agree" className="mr-2 block text-xs text-gray-300 cursor-pointer select-none">
                            أوافق على كافة الشروط والأحكام الخاصة بالمنصة
                        </label>
                    </div>

                    {/* زر الإرسال الموحد بحالات التحميل التفاعلية */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 p-3 rounded-lg font-bold text-base transition text-white mt-2"
                    >
                        {loading ? 'جاري معالجة البيانات وتخزينها...' : 'تأكيد إنشاء الحساب ورسالة النظام'}
                    </button>
                </form>

                {/* أسفل الكارت: روابط توجيه اختيارية */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/jobs-tenders/login" className="text-blue-500 hover:underline">
                        تسجيل الدخول من هنا
                    </Link>
                </p>
            </div>
        </div>
    );
}