import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

// منع إنشاء نسخ متعددة من Prisma في بيئة التطوير وتجنب استهلاك موارد السيرفر (Singleton Pattern)
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// إعداد محرك الإرسال الموحد للنظام بالاعتماد على المتغيرات البيئية الفعّالة لـ Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password الخاص بالسيستم المكون من 16 حرفاً
    },
});

// البريد الإلكتروني المعتمد والمحمي لاستلام إشعارات المنصة الفورية
const ADMIN_EMAILS = 'Smart.Engineering.Global@proton.me, smart.engineering.global@tuta.io';

export async function POST(req) {
    try {
        const body = await req.json();

        // 🔍 [API Logger] طباعة البيانات القادمة في الـ CMD لمراقبة وتحليل الخلل حياً فوراً قبل الفحص
        console.log("\n=== 📥 [Smart Engineering] بيانات الطلب الواردة للسيرفر ===");
        console.log(JSON.stringify(body, null, 2));
        console.log("=========================================================\n");

        const { 
            actionType, 
            // حقول ومحددات الإعلانات والمناقصات الواردة من واجهات الاستمارات المختلفة
            companyName, email, phone, contactPerson, advertiseType, moreInfo, website, 
            title, company, type, description, contact, details,
            // حقول ومحددات الحسابات والتسجيل والدخول والتعديل
            role, fullName, name, password, status
        } = body;

        // دالة تحويل وتحويل ذكية: إذا كان حقل actionType مفقوداً، وكانت الحقول تحتوي على بيانات الإعلانات
        let currentAction = actionType;
        if (!currentAction && (companyName || title || advertiseType)) {
            currentAction = 'ADVERTISE';
        }

        // فحص وجود نوع الإجراء أولاً قبل البدء بالمعالجة لمنع انهيار الـ Route
        if (!currentAction) {
            return NextResponse.json({ error: "خطأ 400: حقل نوع العملية (actionType) مفقود تماماً من الطلب" }, { status: 400 });
        }

        // توحيد البريد الإلكتروني والاسم القادم من النماذج المختلفة والواجهات المتعددة
        const userEmail = email || body.email || ""; 
        const finalName = name || fullName || contactPerson || "مستخدم هندسي";

        // ==========================================
        // 1. معالجة الإعلانات والمناقصات (ADVERTISE)
        // ==========================================
        if (currentAction === 'ADVERTISE') {
            // المعالجة الذكية والبديلة للحقول المتناظرة لضمان عدم رفض الطلب بسبب اختلاف مسميات الواجهة
            const finalTitle = title || (companyName ? `طلب إعلان من ${companyName}` : null) || advertiseType || "إعلان هندسي جديد";
            const finalCompany = company || companyName || "جهة غير معلومة";
            
            // تجميع محتوى التفاصيل والوصف ليتماشى مع قاعدة البيانات بصيغة نصية واضحة
            const finalDescription = description || details || moreInfo || `طلب نشر إعلان من المسؤول: ${contactPerson || 'غير محدد'}`;
            const finalContact = contact || phone || userEmail || "لا توجد بيانات اتصال";
            const finalLocation = website || "غير محدد";
            const finalType = type || ((advertiseType && advertiseType.includes('مناقصة')) ? 'tender' : 'job');

            // التحقق الصارم من توفر الحقول الجوهرية لمنع تخزين سجلات فارغة ومبهمة
            if (!finalTitle || !finalCompany || !finalDescription || !finalContact) {
                return NextResponse.json({ error: "خطأ 400: جميع حقول الإعلان الأساسية مطلوبة (العنوان، الشركة، الوصف، أو الاتصال)" }, { status: 400 });
            }

            // إنشاء وتثبيت سجل الإعلان بداخل قاعدة البيانات بوضع الانتظار المبدئي PENDING
            const newAd = await prisma.advertisement.create({
                data: {
                    title: finalTitle,
                    company: finalCompany,
                    type: finalType,
                    description: finalDescription,
                    location: finalLocation,
                    contact: finalContact,
                    status: "PENDING", 
                },
            });

            // صياغة وإرسال التنبيه البريدي المنسق والمبهر للإدارة فوراً باستخدام صيغة HTML المعتمدة
            try {
                await transporter.sendMail({
                    from: '"المنصة الهندسية الذكية" <system@smart-engineering.com>',
                    to: ADMIN_EMAILS,
                    subject: `📢 طلب إعلان / مناقصة جديدة بانتظار المراجعة: ${finalTitle}`,
                    html: generateEmailTemplate(`طلب إعلان جديد من: ${finalCompany}`, {
                        "عنوان الإعلان الرئيسي": finalTitle,
                        "الشركة / الجهة المعلنة": finalCompany,
                        "نوع التصنيف الهندسي": finalType === 'tender' ? 'مناقصة / توريد مشروع' : 'فرصة عمل / توظيف',
                        "تفاصيل الشروط والوصف": finalDescription,
                        "قنوات الاتصال والتقديم": finalContact,
                        "الموقع الإلكتروني أو الرابط": finalLocation
                    })
                });
            } catch (mailErr) {
                console.error("Mail Error ignored:", mailErr.message);
            }

            return NextResponse.json({ success: true, message: "تم استقبال طلب الإعلان بنجاح وهو قيد المراجعة الإدارية الآن", data: newAd }, { status: 200 });
        }

        // ==========================================
        // 2. معالجة حسابات الأعضاء الجدد (REGISTER)
        // ==========================================
        if (currentAction === 'REGISTER') {
            const userPassword = password || body.password;
            const userRole = role || "job-seeker";

            if (!userEmail || !finalName || !userPassword) {
                return NextResponse.json({ error: "خطأ 400: بعض حقول التسجيل مفقودة (الاسم، الإيميل، أو كلمة المرور)" }, { status: 400 });
            }

            // التحقق الاستباقي من فرادة البريد الإلكتروني لمنع تكرار الحسابات وانهيار قاعدة البيانات
            const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
            if (existingUser) {
                return NextResponse.json({ error: "عذراً، البريد الإلكتروني هذا مسجل مسبقاً في النظام" }, { status: 400 });
            }

            // تخزين بيانات العضو الجديد بأمان داخل جدول الـ Users
            const newUser = await prisma.user.create({
                data: {
                    name: finalName,
                    email: userEmail,
                    password: userPassword, 
                    role: userRole, 
                    phone: phone || "",
                },
            });

            // إشعار الإدارة بانضمام طاقة هندسية جديدة للمنصة عبر البريد
            try {
                await transporter.sendMail({
                    from: '"المنصة الهندسية الذكية" <system@smart-engineering.com>',
                    to: ADMIN_EMAILS,
                    subject: `👤 عضو جديد انضم للمنصة: ${userRole}`,
                    html: generateEmailTemplate("بيانات تسجيل عضو جديد بالنظام", {
                        "الاسم الكامل للمستخدم": finalName,
                        "البريد الإلكتروني المعتمد": userEmail,
                        "الدور البرمجي والصلاحية": userRole,
                        "رقم الهاتف المحمول": phone || "غير متوفر"
                    })
                });
            } catch (mailErr) {
                console.error("Mail Send Error:", mailErr.message);
            }

            return NextResponse.json({ success: true, message: "تم إنشاء الحساب البرمجي بنجاح وتخزينه بالنظام", data: newUser }, { status: 200 });
        }

        // ==========================================
        // 3. معالجة عمليات تسجيل الدخول (LOGIN)
        // ==========================================
        if (currentAction === 'LOGIN') {
            const userPassword = password || body.password;

            if (!userEmail || !userPassword) {
                return NextResponse.json({ error: "خطأ 400: يرجى إدخل البريد الإلكتروني وكلمة المرور كاملة" }, { status: 400 });
            }

            // البحث والمطابقة الأمنية في قاعدة البيانات الحية للمشروع
            const user = await prisma.user.findUnique({ where: { email: userEmail } });
            
            // [حالة عبور طارئة]: إذا كانت قاعدة البيانات جديدة وخالية من حساب المطور والمدير التنفيذي
            if (!user && userEmail === "hashmsltan2015@gmail.com" && userPassword === "yemen2021") {
                return NextResponse.json({ 
                    success: true, 
                    message: "تم تسجيل الدخول الاستثنائي بنجاح بصلاحية مطور النظام الرئيسي",
                    user: { id: "master-admin", name: "Hashem Sultan", email: userEmail, role: "admin" } 
                }, { status: 200 });
            }

            // التحقق من صحة كلمة المرور المدخلة ومطابقتها للمخزن
            if (!user || user.password !== userPassword) {
                return NextResponse.json({ error: "عذراً، البريد الإلكتروني أو كلمة المرور غير مطابقة للبيانات المسجلة لدينا" }, { status: 401 });
            }

            // إرسال تنبيه أمني سريع للإدارة يفيد بتسجيل دخول ناجح للحساب عبر البريد الاستشاري
            try {
                await transporter.sendMail({
                    from: '"المنصة الهندسية الذكية" <system@smart-engineering.com>',
                    to: ADMIN_EMAILS,
                    subject: `🔐 تنبيه أمني: تسجيل دخول ناجح للنظام الأدمين`,
                    html: `<div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; padding: 22px; border: 1px solid #cbd5e1; border-radius: 10px; background-color: #fafafa;">
                            <h3 style="color: #1e40af; margin-top: 0;">إشعار دخول منصة الذكاء الهندسي للمسؤولين</h3>
                            <p style="font-size: 14px; color: #334155;">تمت عملية الولوج بنجاح للمستخدم القيادي: <b style="color: #0f172a;">${user.name}</b></p>
                            <p style="font-size: 14px; color: #334155;">البريد الإلكتروني المستخدم: <span style="color: #2563eb; font-weight: bold;">${user.email}</span></p>
                            <p style="font-size: 14px; color: #334155;">فئة الصلاحية الممنوحة: <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${user.role}</span></p>
                            <p style="font-size: 12px; color: #64748b; margin-bottom: 0; padding-top: 10px; border-top: 1px dashed #e2e8f0;">توقيت العملية في السيرفر: <b>${new Date().toLocaleString('ar-EG')}</b></p>
                           </div>`
                });
            } catch (mailErr) {
                console.error("Mail Security Log Error:", mailErr.message);
            }

            return NextResponse.json({ 
                success: true, 
                message: "تم تسجيل الدخول بنجاح تام", 
                user: { id: user.id, name: user.name, email: user.email, role: user.role } 
            }, { status: 200 });
        }

        // ==========================================
        // 4. استعادة كلمة المرور (FORGOT_PASSWORD)
        // ==========================================
        if (currentAction === 'FORGOT_PASSWORD') {
            if (!userEmail) {
                return NextResponse.json({ error: "خطأ 400: يرجى كتابة البريد الإلكتروني الخاص بحسابك أولاً" }, { status: 400 });
            }

            try {
                await transporter.sendMail({
                    from: '"دعم الهندسة الذكية" <system@smart-engineering.com>',
                    to: userEmail,
                    subject: '🔐 طلب إعادة تعيين واستعادة كلمة المرور',
                    text: `مرحباً مهندس، لقد استلمنا طلباً لإعادة تعيين كلمة المرور الخاصة بك على منصة المهندس الذكي. إذا كنت أنت من طلب هذا، يمكنك استخدام كلمة مرورك الحالية لتسجيل الدخول أو مراجعة الإدارة الاستشارية والتقنية للمشروع لحمايتك.`
                });
                return NextResponse.json({ success: true, message: "تم إرسال تعليمات الاستعادة بنجاح إلى بريدك الإلكتروني" }, { status: 200 });
            } catch (mailErr) {
                console.error("Forgot Password Mail Error:", mailErr.message);
                return NextResponse.json({ error: "فشل في إرسال البريد الإلكتروني، يرجى التحقق من إعدادات الـ SMTP وملفات الـ Environment الخاص بالسيرفر" }, { status: 500 });
            }
        }

        // ==========================================
        // 5. منطق لوحة تحكم الإدارة (ADMIN_CONTROL)
        // ========================================== 
        if (currentAction === 'ADMIN_CONTROL') {
            const { subAction, targetId, targetType, newStatus } = body;

            if (!subAction || !targetId || !targetType) {
                return NextResponse.json({ error: "خطأ 400: حقول التحكم الإدارية ناقصة أو مفقودة" }, { status: 400 });
            }

            if (subAction === 'UPDATE_STATUS') {
                if (targetType === 'AD') {
                    await prisma.advertisement.update({ where: { id: targetId }, data: { status: newStatus } });
                } else if (targetType === 'USER') {
                    await prisma.user.update({ where: { id: targetId }, data: { role: newStatus } }); 
                }
                return NextResponse.json({ success: true, message: "تم تحديث حالة السجل بنجاح في قاعدة البيانات حياً" });
            }

            if (subAction === 'DELETE') {
                if (targetType === 'AD') {
                    await prisma.advertisement.delete({ where: { id: targetId } });
                } else if (targetType === 'USER') {
                    await prisma.user.delete({ where: { id: targetId } });
                }
                return NextResponse.json({ success: true, message: "تم حذف السجل نهائياً وتطهير الحقل بنجاح" });
            }
        }

        return NextResponse.json({ error: "نوع العملية المطلوبة (actionType) غير معرّف أو مدعوم بالنظام الحالي" }, { status: 400 });

    } catch (error) {
        // حماية السيرفر من الانهيار التام (Crash) عن طريق معالجة الخطأ وإمساكه بشكل نظيف وإرجاع رمز الاستجابة 500 للمتصفح
        console.error("Global Backend Error:", error);
        return NextResponse.json({ 
            error: "حدث خطأ داخلي غير متوقع في معالجة خادم المنصة الذكية: " + error.message, 
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * دالة هندسية برمجية مخصصة لبناء القوالب البريدية بصيغة HTML متطورة، متجاوبة وجذابة للمسؤولين
 */
function generateEmailTemplate(title, data) {
    const rows = Object.entries(data)
        .filter(([key]) => !['actionType', 'password'].includes(key)) 
        .map(([key, val]) => `
            <tr>
                <td style="padding:12px; border-bottom:1px solid #eaeaea; background-color:#fbfbfb; width:35%; text-align:right; font-size: 13px; color:#444;"><b>${key}</b></td>
                <td style="padding:12px; border-bottom:1px solid #eaeaea; text-align:right; font-size: 13px; color:#111; line-height: 1.5;">${val || '---'}</td>
            </tr>
        `).join('');

    return `
        <div dir="rtl" style="font-family: Arial, Tahoma, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: right;">
            <div style="background-color: #1e40af; color: white; padding: 24px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">${title}</h2>
            </div>
            <div style="padding: 24px; background-color: #ffffff;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    ${rows}
                </table>
                <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; background-color: #f8fafc; padding: 15px; border-radius: 6px;">
                    منصة المهندس الذكي لإدارة الحلول والبيانات المتكاملة &copy; ${new Date().getFullYear()}
                </div>
            </div>
        </div>
    `;
}