"use client";

import React, { useState } from 'react';

export default function AdvertisePage() {
    // دمج كامل ومتوافق لجميع حقول الحالات (State) من الكودين لمنع إرسال قيم فارغة
    const [form, setForm] = useState({ 
        title: '', 
        company: '', 
        companyName: '', // مدمج لضمان توافق الواجهة الخلفية
        email: '',       // مدمج من الكود الأول
        type: 'job', 
        description: '', 
        details: '',     // مدمج من الكود الأول
        contact: '' 
    });
    
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // دالة التعامل مع التغيير الموحدة لضمان مزامنة البيانات المتطابقة بسلاسة
    const handleInputChange = (field, value) => {
        setForm(prev => {
            const updated = { ...prev, [field]: value };
            
            // مزامنة الحقول التناظرية لضمان عدم إرسال حقول فارغة (undefined) للخلفية
            if (field === 'company') updated.companyName = value;
            if (field === 'companyName') updated.company = value;
            if (field === 'description') updated.details = value;
            if (field === 'details') updated.description = value;
            
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // التحقق الأولي الصارم في المتصفح قبل إرسال الطلب للسيرفر لمنع خطأ 400
        if (!form.title.trim() || !(form.company.trim() || form.companyName.trim()) || !(form.description.trim() || form.details.trim()) || !form.contact.trim()) {
            setMessage({ type: 'error', text: 'خطأ: يرجى ملء جميع الحقول الجوهرية المطلوبة أولاً' });
            setLoading(false);
            return;
        }

        // تجهيز الحمولة (Payload) المدمجة والمضمونة لتلبية متطلبات الـ API الخلفي بالكامل دفعة واحدة
        const payload = {
            actionType: 'ADVERTISE',
            category: 'إعلان جديد',
            title: form.title,
            company: form.company || form.companyName,
            companyName: form.companyName || form.company,
            email: form.email || form.contact,
            type: form.type,
            description: form.description || form.details,
            details: form.details || form.description,
            contact: form.contact
        };

        try {
            // توجيه الطلب إلى نقطة النهاية الموحدة لـ API الإعلانات
            const res = await fetch('/api/advertise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ 
                    type: 'success', 
                    text: data.message || 'تم إرسال إعلانك بنجاح وهو قيد المراجعة والاعتماد حالياً من قبل الإدارة.' 
                });
                // إعادة تعيين الحقول الافتراضية كاملة بعد النجاح لمنع التكرار
                setForm({ title: '', company: '', companyName: '', email: '', type: 'job', description: '', details: '', contact: '' });
            } else {
                setMessage({ type: 'error', text: data.error || 'حدث خطأ في استقبال البيانات برمز 400، يرجى مراجعة الحقول.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'فشل الاتصال بخادم المنصة الرئيسي، يرجى التحقق من الشبكة.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex items-center justify-center" dir="rtl">
            <div className="w-full max-w-2xl border border-blue-900 bg-gray-950 p-6 rounded-xl shadow-xl">
                <h1 className="text-2xl font-bold mb-6 text-blue-500 border-b border-gray-800 pb-2 text-right">
                    طلب نشر وظيفة أو مناقصة هندسية (أعلن معنا)
                </h1>
                
                {/* صندوق عرض الرسائل المشترك والذكي للحالات */}
                {message.text && (
                    <div className={`p-3 rounded mb-4 text-center text-sm font-medium border transition-all duration-300 ${
                        message.type === 'success' 
                            ? 'bg-green-950 text-green-400 border-green-800' 
                            : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* الحقول المدمجة في شبكة متوافقة ومستجيبة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1 text-gray-400 text-right">اسم الشركة / الجهة المعلنة</label>
                            <input 
                                type="text"
                                className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-right text-sm" 
                                placeholder="اسم المكتب الاستشاري أو شركة المقاولات" 
                                onChange={e => handleInputChange('company', e.target.value)} 
                                value={form.company} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 text-gray-400 text-right">البريد الإلكتروني الرسمي للتواصل</label>
                            <input 
                                type="email"
                                className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-left placeholder-gray-600 text-sm" 
                                placeholder="example@domain.com" 
                                onChange={e => handleInputChange('email', e.target.value)} 
                                value={form.email} 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-400 text-right">العنوان الرئيسي للإعلان / المناقصة</label>
                        <input 
                            type="text"
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-right text-sm" 
                            placeholder="مثال: مطلوب مهندس مدني تصاميم إنشائية" 
                            onChange={e => handleInputChange('title', e.target.value)} 
                            value={form.title} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-400 text-right">تصنيف الإعلان الهندسي</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-right text-sm cursor-pointer" 
                            onChange={e => handleInputChange('type', e.target.value)} 
                            value={form.type}
                        >
                            <option value="job">فرصة عمل / توظيف هندسي</option>
                            <option value="tender">مناقصة توريد / تنفيذ مشروع</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-400 text-right">الشروط والتفاصيل الكاملة للإعلان</label>
                        <textarea 
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white h-36 text-right text-sm" 
                            placeholder="اكتب الشروط، المتطلبات، المخططات المطلوبة، والموقع الجغرافي بالتفصيل..." 
                            onChange={e => handleInputChange('description', e.target.value)} 
                            value={form.description} 
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-400 text-right">طريقة التقديم وقنوات التواصل المعروضة للجمهور</label>
                        <input 
                            type="text"
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-right text-sm" 
                            placeholder="رقم الهاتف، إيميل استقبال السير الذاتية..." 
                            onChange={e => handleInputChange('contact', e.target.value)} 
                            value={form.contact} 
                            required 
                        />
                    </div>

                    {/* زر الإرسال الموحد بحالات التحميل الفعّالة */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white p-3 rounded-lg font-bold transition duration-200 mt-2"
                    >
                        {loading ? 'جاري معالجة الطلب وإرساله للتدقيق...' : 'إرسال الإعلان للمراجعة والتأكيد'}
                    </button>
                </form>
            </div>
        </div>
    );
}