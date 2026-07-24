"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    // توحيد الأدوار والحالات
    const [role, setRole] = useState('JOB_SEEKER'); 
    const [formData, setFormData] = useState({ 
        fullName: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        adminKey: '' 
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    // دالة لجلب نص الدور المختار (للعرض فقط)
    const getRoleLabel = (r) => {
        switch (r) {
            case 'JOB_SEEKER': return 'باحث عن وظيفة';
            case 'SUPPLIER': return 'مورد / مقاول';
            case 'ADMIN': return 'مدير النظام (Admin)';
            default: return '';
        }
    };

    // معالجة تغيير المدخلات بشكل ديناميكي
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // منطق الإرسال إلى API
    const handleAction = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });

        // التحقق من تطابق كلمة المرور
        if (formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', msg: 'كلمات المرور غير متطابقة!' });
            return;
        }

        setLoading(true);
        setStatus({ type: 'info', msg: 'جاري معالجة طلب التسجيل...' });

        try {
            const res = await fetch('/api/advertise', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...formData, 
                    role: role, 
                    actionType: 'REGISTER' 
                })
            });

            const result = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', msg: 'تم التسجيل بنجاح! الإدارة تراجع بياناتك الآن.' });
                setFormData({ fullName: '', email: '', password: '', confirmPassword: '', adminKey: '' });
            } else {
                setStatus({ type: 'error', msg: result.error || 'خطأ في عملية التسجيل، حاول مجدداً.' });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'فشل الاتصال بالخادم. تحقق من الإنترنت.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans" dir="rtl">
            <div className="w-full max-w-xl border border-blue-900 bg-gray-950 p-8 rounded-2xl shadow-2xl">
                
                {/* زر العودة المدمج */}
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-blue-500 hover:text-white mb-6 transition"
                >
                    <ArrowRight size={20} /> العودة للخلف
                </button>
                
                <h1 className="text-3xl font-bold text-center mb-2 text-blue-500">Smart Engineering</h1>
                <p className="text-center text-gray-400 mb-8">إنشاء حساب مهندس ذكي جديد</p>
                
                {/* اختيار نوع الحساب */}
                <div className="flex flex-wrap gap-2 bg-gray-900 rounded-xl p-2 mb-8 border border-gray-800">
                    <button 
                        type="button"
                        onClick={() => setRole('JOB_SEEKER')} 
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${role === 'JOB_SEEKER' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        باحث عن عمل
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('SUPPLIER')} 
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${role === 'SUPPLIER' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        مورد / مقاول
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('ADMIN')} 
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${role === 'ADMIN' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        مسؤول (Admin)
                    </button>
                </div>

                <h2 className="text-xl font-semibold mb-6 text-blue-400 border-r-4 border-blue-500 pr-3">
                    نموذج: {getRoleLabel(role)}
                </h2>

                <form onSubmit={handleAction} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">الاسم الكامل</label>
                            <input 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
                                placeholder="أدخل اسمك الكامل" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">البريد الإلكتروني</label>
                            <input 
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
                                placeholder="name@example.com" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">كلمة المرور</label>
                            <input 
                                name="password"
                                type="password" 
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
                                placeholder="••••••••" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">تأكيد كلمة المرور</label>
                            <input 
                                name="confirmPassword"
                                type="password" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
                                placeholder="••••••••" 
                                required 
                            />
                        </div>
                    </div>

                    {role === 'ADMIN' && (
                        <div className="bg-red-950/30 p-4 rounded-lg border border-red-900/50">
                            <label className="block mb-1 text-sm font-bold text-red-400">مفتاح صلاحية الإدارة</label>
                            <input 
                                name="adminKey"
                                type="password" 
                                value={formData.adminKey}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-red-900/50 p-3 rounded-lg outline-none focus:border-red-500 text-red-200" 
                                placeholder="كود التحقق الخاص بالمدراء" 
                                required 
                            />
                        </div>
                    )}

                    <label className="flex items-center gap-3 mt-4 cursor-pointer select-none group">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-blue-500" required /> 
                        <span className="text-sm text-gray-400 group-hover:text-gray-200 transition">أوافق على شروط الخدمة وسياسة الخصوصية</span>
                    </label>

                    <button 
                        disabled={loading}
                        className={`w-full p-4 rounded-xl font-bold text-lg transition duration-300 transform active:scale-95 flex justify-center items-center ${
                            loading ? 'bg-gray-700 cursor-not-allowed' : 
                            role === 'ADMIN' ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
                        } shadow-xl`}
                    >
                        {loading ? 'جاري الإرسال...' : `سجل الآن كـ ${getRoleLabel(role)}`}
                    </button>
                </form>

                {status.msg && (
                    <div className={`mt-6 p-4 rounded-lg text-center font-medium border ${
                        status.type === 'error' ? 'bg-red-900/20 border-red-800 text-red-400' : 
                        status.type === 'success' ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-blue-900/20 border-blue-800 text-blue-400'
                    }`}>
                        {status.msg}
                    </div>
                )}

                <div className="mt-8 text-center text-sm text-gray-500">
                    لديك حساب بالفعل؟ <a href="/login" className="text-blue-500 hover:text-blue-400 font-bold underline underline-offset-4">تسجيل الدخول</a>
                </div>
            </div>
        </div>
    );
}