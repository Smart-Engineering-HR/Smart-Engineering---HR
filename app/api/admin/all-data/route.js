import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

// منع تكرار إنشاء كائن Prisma في بيئة التطوير المحلية
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// رسائل المسؤولين الموحدة
const ADMIN_EMAILS = 'Smart.Engineering.Global@proton.me, smart.engineering.global@tuta.io';

// إعداد سرفر إرسال البريد الإلكتروني عبر Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * دالة توليد القوالب البريدية للمسؤولين بصيغة HTML متوافقة مع الاتجاه العربي RTL
 */
function generateAdminEmailHTML(title, section, data) {
    const rows = Object.entries(data)
        .map(([key, val]) => `
            <tr>
                <td style="padding:12px; border-bottom:1px solid #e2e8f0; background-color:#f8fafc; width:35%; text-align:right; font-size:13px; color:#334155; font-weight:bold;">${key}</td>
                <td style="padding:12px; border-bottom:1px solid #e2e8f0; text-align:right; font-size:13px; color:#0f172a; line-height:1.6;">${val || '---'}</td>
            </tr>
        `).join('');

    return `
        <div dir="rtl" style="font-family:Tahoma, Arial, sans-serif; max-width:650px; margin:20px auto; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 10px 15px -3px rgba(0,0,0,0.05); text-align:right; background-color:#ffffff;">
            <div style="background-color:#1e3a8a; color:white; padding:24px; text-align:center;">
                <span style="background-color:#2563eb; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">المنصة الهندسية الذكية</span>
                <h2 style="margin:8px 0 0 0; font-size:20px; font-weight:bold;">${title}</h2>
                <p style="margin:4px 0 0 0; font-size:12px; color:#93c5fd;">قسم التحكم والسيطرة: ${section}</p>
            </div>
            <div style="padding:24px;">
                <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
                    ${rows}
                </table>
                <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e2e8f0; font-size:11px; color:#64748b; text-align:center; background-color:#f8fafc; padding:15px; border-radius:8px;">
                    جميع الحقوق محفوظة للمكتب الاستشاري والتقني للمنصة الذكية &copy; ${new Date().getFullYear()}
                </div>
            </div>
        </div>
    `;
}

// 🟢 GET: جلب البيانات مع نظام الفحص الشامل للاحتمالات المتعددة وحماية الجداول الأساسية والفرعية
export async function GET() {
    try {
        const result = {
            users: [],
            ads: [],
            postings: [],
            academy: [],
            tools: [],
            services: [],
            articles: [],
            feedbacks: [],
            messages: []
        };

        // مصفوفة احتمالات ذكية تفحص كل الأشكال المتوقعة للاستدعاء داخل كائن prisma لحماية السكيما من الانهيار
        const fetchWithFallback = async (possibleNames) => {
            for (const name of possibleNames) {
                if (prisma[name] && typeof prisma[name].findMany === 'function') {
                    try {
                        return await prisma[name].findMany({ orderBy: { createdAt: 'desc' } });
                    } catch (e) {
                        continue; // انتقال للاسم البديل فوراً في حال عدم وجود الجدول في السكيما الحالية
                    }
                }
            }
            console.warn(`⚠️ تنبيه: لم نتمكن من الوصول للجدول بأي من المسميات التالية: [${possibleNames.join(', ')}]`);
            return [];
        };

        // 1. حسابات المستخدمين
        result.users = await fetchWithFallback(['user', 'users', 'User']);
        
        // 2. بوابة الإعلانات التجارية والمؤسسية 
        result.ads = await fetchWithFallback(['advertisement', 'advertisements', 'Advertisement']);
        
        // 3. بوابة التوظيف والمناقصات (المنشورات الهندسية المخصصة للاستقطاب)
        result.postings = await fetchWithFallback(['posting', 'postings', 'Posting']);
        
        // 4. الأكاديمية والتدريب الهندسي
        result.academy = await fetchWithFallback(['academyItem', 'academyItems', 'academy', 'academies', 'AcademyItem', 'training', 'trainings']);
        
        // 5. الأدوات والبرمجيات الذكية
        result.tools = await fetchWithFallback(['softwareTool', 'softwareTools', 'tool', 'tools', 'SoftwareTool', 'rebarTool']);
        
        // 6. الخدمات الهندسية والاستشارية
        result.services = await fetchWithFallback(['engineeringService', 'engineeringServices', 'service', 'services', 'EngineeringService']);
        
        // 7. أفكار وعلوم (المقالات والتدوينات)
        result.articles = await fetchWithFallback(['article', 'articles', 'post', 'posts', 'Article']);
        
        // 8. استمارات شاركنا رأيك وتجربة الـ UX
        result.feedbacks = await fetchWithFallback(['userFeedback', 'userFeedbacks', 'feedback', 'feedbacks', 'UserFeedback']);
        
        // 9. مراسلات اتصل بنا وحجز الاستشارات
        result.messages = await fetchWithFallback(['contactMessage', 'contactMessages', 'message', 'messages', 'ContactMessage']);

        return NextResponse.json({ success: true, data: result }, { status: 200 });

    } catch (error) {
        console.error("Critical Admin GET Error:", error);
        return NextResponse.json({ error: "خطأ داخلي في الخادم عند معالجة طلب جلب البيانات الشامل: " + error.message }, { status: 500 });
    }
}

// 🔵 POST: المعالجة المركزية لعمليات النشر، الإضافة، التعديل، الحذف وعمليات التوثيق والمصادقة
export async function POST(req) {
    try {
        const body = await req.json();
        
        // استخلاص المتغيرات من كلا الكودين بالتوافق الكامل
        const { globalAction, targetSection, recordId, payload, action } = body;

        // دالة ديناميكية للحصول على الموديل الفعال بناءً على مصفوفة الاحتمالات المعتمدة
        const resolveModel = (section) => {
            const mappings = {
                USER: ['user', 'users', 'User'],
                AD: ['advertisement', 'advertisements', 'Advertisement'],
                POSTING: ['posting', 'postings', 'Posting'],
                ACADEMY: ['academyItem', 'academyItems', 'academy', 'academies', 'AcademyItem'],
                TOOL: ['softwareTool', 'softwareTools', 'tool', 'tools', 'SoftwareTool'],
                SERVICE: ['engineeringService', 'engineeringServices', 'service', 'services', 'EngineeringService'],
                ARTICLE: ['article', 'articles', 'post', 'posts', 'Article'],
                FEEDBACK: ['userFeedback', 'userFeedbacks', 'feedback', 'feedbacks', 'UserFeedback'],
                MESSAGE: ['contactMessage', 'contactMessages', 'message', 'messages', 'ContactMessage']
            };

            const targets = mappings[section] || [];
            for (const name of targets) {
                if (prisma[name] && typeof prisma[name].findMany === 'function') {
                    return prisma[name];
                }
            }
            return null;
        };

        // ==========================================
        // أولاً: معالجة الإجراءات المباشرة الواردة من الكود الثاني (Authentication & Form Actions)
        // ==========================================
        if (action) {
            
            // 1. تسجيل مستخدم جديد (باحث عن عمل أو مورد) عبر لوحة التحكم العامة
            if (action === 'REGISTER') {
                const { name, email, password, role, phone } = payload;
                if (!name || !email || !password || !role) {
                    return NextResponse.json({ error: "جميع الحقول الإلزامية للتسجيل مطلوبة" }, { status: 400 });
                }

                const targetUserModel = resolveModel('USER');
                if (!targetUserModel) return NextResponse.json({ error: "جدول المستخدمين غير متوفر بقاعدة البيانات حالياً" }, { status: 500 });

                const finalEmail = email.trim();
                const exist = await targetUserModel.findUnique({ where: { email: finalEmail } });
                if (exist) return NextResponse.json({ error: "البريد الإلكتروني مسجل مسبقاً في النظام" }, { status: 400 });

                const user = await targetUserModel.create({
                    data: { name, email: finalEmail, password, role, phone: phone || "" }
                });

                try {
                    await transporter.sendMail({
                        from: '"نظام الحسابات الذكي" <system@smart-engineering.com>',
                        to: ADMIN_EMAILS,
                        subject: `👤 عضوية جديدة بالنظام: فئة ${role === 'supplier' ? 'مورد ومقاول' : 'باحث عن عمل'}`,
                        html: generateAdminEmailHTML("انضمام مستخدم جديد", "إدارة العضويات والتراخيص", {
                            "الاسم الكامل للمشترك": name,
                            "البريد الإلكتروني المعتمد": finalEmail,
                            "فئة الحساب الهندسية": role === 'supplier' ? 'مورد / شركة مقاولات تخصصية' : 'مهندس باحث عن فرصة عمل',
                            "رقم الهاتف": phone || "غير متوفر",
                            "تاريخ التسجيل الإلكتروني": new Date().toLocaleString('ar-EG')
                        })
                    });
                } catch (mErr) { console.error("Mail Send Failure (REGISTER):", mErr.message); }

                return NextResponse.json({ success: true, user, message: "تم التسجيل وحفظ مستنداتكم في قاعدة البيانات بنجاح" });
            }

            // 2. تسجيل الدخول المركزي بالنظام
            if (action === 'LOGIN') {
                const { email, password } = payload;
                const targetUserModel = resolveModel('USER');
                if (!targetUserModel) return NextResponse.json({ error: "جدول المستخدمين غير متوفر" }, { status: 500 });

                const user = await targetUserModel.findUnique({ where: { email: email?.trim() } });
                if (!user || user.password !== password) {
                    return NextResponse.json({ error: "فشل تسجيل الدخول: البريد الإلكتروني أو كلمة المرور خاطئة" }, { status: 401 });
                }
                return NextResponse.json({ success: true, user, message: "تم تسجيل الدخول بنجاح" });
            }

            // 3. أعلن معنا (إنشاء نموذج طلب إعلاني خارجي وبث بريدي فوري)
            if (action === 'CREATE_AD') {
                const { companyName, contactPerson, phone, email, address, website, advertiseType, moreInfo } = payload;
                if (!companyName || !contactPerson || !phone || !email || !advertiseType) {
                    return NextResponse.json({ error: "الرجاء ملء الحقول الإلزامية المسمية بعلامة خط أحمر" }, { status: 400 });
                }

                const targetAdModel = resolveModel('AD');
                if (!targetAdModel) return NextResponse.json({ error: "جدول الإعلانات غير متوفر بالسكيما" }, { status: 500 });

                const ad = await targetAdModel.create({
                    data: { companyName, contactPerson, phone, email, address, website, advertiseType, moreInfo }
                });

                try {
                    await transporter.sendMail({
                        from: '"بوابة إعلانات المنصة" <system@smart-engineering.com>',
                        to: ADMIN_EMAILS,
                        subject: `📢 طلب إعلان ونشر جديد: ${advertiseType}`,
                        html: generateAdminEmailHTML("طلب إعلان تجاري / مؤسسي جديد", "بوابة النشر الخارجي", {
                            "اسم الشركة / المنظمة": companyName,
                            "اسم الشخص المسؤول": contactPerson,
                            "رقم التليفون": phone,
                            "البريد الإلكتروني للجهة": email,
                            "عنوان المقر الرئيسي": address || "غير محدد",
                            "الموقع الإلكتروني": website || "لا يوجد",
                            "ماذا يريد الإعلان عنه؟": advertiseType,
                            "مزيد من المعلومات / الشروط": moreInfo || "لا يوجد تفاصيل إضافية"
                        })
                    });
                } catch (mErr) { console.error("Mail Send Failure (CREATE_AD):", mErr.message); }

                return NextResponse.json({ success: true, ad });
            }

            // 4. طلب رابط استعادة وإعادة تعيين كلمة المرور عبر الـ UUID Token
            if (action === 'FORGOT_PASSWORD') {
                const { email } = payload;
                const targetUserModel = resolveModel('USER');
                if (!targetUserModel) return NextResponse.json({ error: "جدول الحسابات غير متاح للربط الحركي" }, { status: 500 });

                const user = await targetUserModel.findUnique({ where: { email: email?.trim() } });
                if (!user) return NextResponse.json({ error: "البريد الإلكتروني هذا غير مسجل في نظامنا للأسف" }, { status: 404 });

                const token = uuidv4();
                const expiry = new Date(Date.now() + 90 * 60 * 1000); // 90 دقيقة صلاحية قاطعة وحازمة

                await targetUserModel.update({
                    where: { email: email.trim() },
                    data: { resetToken: token, resetTokenExpiry: expiry }
                });

                const resetLink = `http://localhost:3000/jobs-tenders?page=reset-password&token=${token}&email=${encodeURIComponent(email.trim())}`;
                try {
                    await transporter.sendMail({
                        from: '"الدعم التقني للمنصة الذكية" <system@smart-engineering.com>',
                        to: email.trim(),
                        subject: `🔒 طلب إعادة تعيين كلمة المرور الخاصة بك`,
                        html: `
                            <div dir="rtl" style="font-family:Tahoma, Arial, sans-serif; max-width:500px; margin:20px auto; padding:20px; border:1px solid #e2e8f0; border-radius:8px; text-align:right;">
                                <h3 style="color:#1e3a8a;">الهندسة الذكية و HR</h3>
                                <p>تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك الهندسي. هذا الرابط صالح لمدة <b>90 دقيقة فقط</b>.</p>
                                <div style="text-align:center; margin:30px 0;">
                                    <a href="${resetLink}" style="background-color:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">إعادة تعيين كلمة المرور</a>
                                </div>
                                <p style="font-size:11px; color:#64748b;">إذا لم تطلب هذا التغيير، يرجى تجاهل هذا الإيميل فوراً لحماية أمان حسابك.</p>
                            </div>
                        `
                    });
                } catch (mErr) { console.error("Forgot Pass Mail Failure:", mErr.message); }

                return NextResponse.json({ success: true, message: "تم إرسال رابط إعادة التعيين بنجاح، تفقد بريدك الإلكتروني" });
            }

            // 5. تأكيد تعيين كلمة المرور الجديدة الفعلي
            if (action === 'RESET_PASSWORD_CONFIRM') {
                const { email, token, newPassword } = payload;
                const targetUserModel = resolveModel('USER');
                if (!targetUserModel) return NextResponse.json({ error: "خطأ بالاتصال مع جدول المستخدمين" }, { status: 500 });

                const user = await targetUserModel.findFirst({
                    where: {
                        email: email?.trim(),
                        resetToken: token,
                        resetTokenExpiry: { gte: new Date() }
                    }
                });

                if (!user) return NextResponse.json({ error: "انتهت صلاحية الرابط الأمنية (90 دقيقة) أو البيانات غير متطابقة" }, { status: 400 });

                await targetUserModel.update({
                    where: { email: email.trim() },
                    data: { password: newPassword, resetToken: null, resetTokenExpiry: null }
                });

                return NextResponse.json({ success: true, message: "تم إنشاء وتحديث كلمة مرورك الجديدة بنجاح" });
            }

            // 6. ميكانيكيات معالجة الإعلانات / الوظائف للأدمن من الكود الثاني لقسم POSTING
            if (action === 'ADMIN_CREATE_POSTING') {
                const targetPostingModel = resolveModel('POSTING');
                if (!targetPostingModel) return NextResponse.json({ error: "جدول المنشورات والوظائف غير متاح بالسكيما" }, { status: 500 });
                const posting = await targetPostingModel.create({ data: payload });
                return NextResponse.json({ success: true, posting });
            }

            if (action === 'ADMIN_UPDATE_POSTING') {
                const targetPostingModel = resolveModel('POSTING');
                if (!targetPostingModel) return NextResponse.json({ error: "جدول المنشورات غير متاح للتعديل" }, { status: 500 });
                const { id, ...data } = payload;
                const posting = await targetPostingModel.update({ where: { id }, data });
                return NextResponse.json({ success: true, posting });
            }

            if (action === 'ADMIN_DELETE_POSTING') {
                const targetPostingModel = resolveModel('POSTING');
                if (!targetPostingModel) return NextResponse.json({ error: "جدول المنشورات غير متاح للحذف" }, { status: 500 });
                await targetPostingModel.delete({ where: { id: payload.id } });
                return NextResponse.json({ success: true, message: "تم الحذف النهائي للسجل من قاعدة البيانات" });
            }
        }

        // ==========================================
        // ثانياً: معالجة الإجراءات المركزية المتقدمة للكود الأول والأساسي (globalAction)
        // ==========================================
        if (!globalAction || !targetSection) {
            return NextResponse.json({ error: "خطأ: المعاملات البرمجية الأساسية مطلوبة (globalAction & targetSection)" }, { status: 400 });
        }

        const currentModel = resolveModel(targetSection);

        // --- ميكانيكية الحذف المركزية الكبرى ---
        if (globalAction === 'DELETE') {
            if (!recordId) return NextResponse.json({ error: "معرف السجل مطلوب للتنفيذ الإقصائي" }, { status: 400 });
            if (!currentModel) return NextResponse.json({ error: "الجدول المطلوب حذفه غير متوفر حالياً بملف السكيما" }, { status: 400 });
            
            await currentModel.delete({ where: { id: recordId } });
            return NextResponse.json({ success: true, message: "تم حذف السجل بنجاح من قاعدة البيانات" });
        }

        // --- ميكانيكية الإنشاء المركزية الكبرى (CREATE) ---
        if (globalAction === 'CREATE') {
            if (!payload) return NextResponse.json({ error: "البيانات المرسلة مطلوبة لعملية الإنشاء" }, { status: 400 });
            
            let createdRecord = null;

            if (targetSection === 'AD') {
                const targetAdModel = resolveModel('AD');
                if (!targetAdModel) return NextResponse.json({ error: "جدول الإعلانات غير معرف بملف السكيما" }, { status: 500 });

                const { companyName, contactPerson, phone, email, website, advertiseType, moreInfo, title, company, type, description, contact, location, expiryDate, category } = payload;
                const finalTitle = title || (companyName ? `طلب إعلان من شركة: ${companyName}` : null) || advertiseType || "فرصة هندسية جديدة";
                const finalCompany = company || companyName || "جهة غير محددة";
                const finalDesc = description || moreInfo || `طلب تفصيلي من المهندس المسؤول ${contactPerson || ''}`;
                const finalContact = contact || `هاتف: ${phone || ''} | إيميل: ${email || ''}`;

                createdRecord = await targetAdModel.create({
                    data: {
                        title: finalTitle,
                        company: finalCompany,
                        type: type || (advertiseType?.includes('مناقصة') ? 'tender' : 'job'),
                        category: category || "عام",
                        description: finalDesc,
                        location: location || website || "اليمن / عن بعد",
                        contact: finalContact,
                        expiryDate: expiryDate || "مفتوح",
                        status: "PENDING"
                    }
                });

                try {
                    await transporter.sendMail({
                        from: '"إعلانات الهندسة الذكية" <system@smart-engineering.com>',
                        to: ADMIN_EMAILS,
                        subject: `📢 طلب نشر جديد بانتظار الاعتماد: ${finalTitle}`,
                        html: generateAdminEmailHTML(`إشعار طلب إعلان ومناقصة وبث مركزي`, `بوابة التوظيف والمناقصات`, {
                            "اسم المنشأة المعلنة": finalCompany,
                            "المسمى / العنوان الرئيسي": finalTitle,
                            "نوع التصنيف المختار": type || advertiseType,
                            "بيانات الاتصال والتواصل": finalContact,
                            "رابط الموقع الإلكتروني": website || "لا يوجد",
                            "تفاصيل الشروط والوصف الإنشائي": finalDesc
                        })
                    });
                } catch (mErr) { console.error("Mail Log Error (Global CREATE AD):", mErr.message); }
            }

            else if (targetSection === 'USER') {
                const targetUserModel = resolveModel('USER');
                if (!targetUserModel) return NextResponse.json({ error: "جدول المستخدمين غير معرف بالسكيما" }, { status: 500 });

                const { name, fullName, email, password, role, phone } = payload;
                const finalEmail = email?.trim();

                const exist = await targetUserModel.findUnique({ where: { email: finalEmail } });
                if (exist) return NextResponse.json({ error: "البريد الإلكتروني مسجل مسبقاً في النظام" }, { status: 400 });

                createdRecord = await targetUserModel.create({
                    data: {
                        name: name || fullName || "مستخدم هندسي مجهول",
                        email: finalEmail,
                        password: password,
                        role: role || "job-seeker",
                        phone: phone || ""
                    }
                });

                try {
                    await transporter.sendMail({
                        from: '"إدارة الحسابات الذكية" <system@smart-engineering.com>',
                        to: ADMIN_EMAILS,
                        subject: `👤 عضوية جديدة بالنظام: فئة ${role === 'supplier' ? 'مورد ومقاول' : 'باحث عن عمل'}`,
                        html: generateAdminEmailHTML(`انضمام طاقة هندسية جديدة`, `إدارة العضويات`, {
                            "الاسم الكامل للمشترك": name || fullName,
                            "البريد الإلكتروني المعتمد": finalEmail,
                            "طبيعة وصلاحية الحساب": role === 'supplier' ? 'مورد ومقاول / كادر شركات مقاولات' : 'مهندس باحث عن فرصة عمل',
                            "تاريخ التسجيل المباشر": new Date().toLocaleString('ar-EG')
                        })
                    });
                } catch (mErr) { console.error("Mail Log Error (Global CREATE USER):", mErr.message); }
            }

            else {
                if (!currentModel) return NextResponse.json({ error: `القسم المستهدف [${targetSection}] غير معرف بملف السكيما البرمجي` }, { status: 400 });
                createdRecord = await currentModel.create({ data: payload });

                if (targetSection === 'FEEDBACK') {
                    try {
                        await transporter.sendMail({
                            from: '"استبيانات الهندسة الذكية" <system@smart-engineering.com>',
                            to: ADMIN_EMAILS,
                            subject: `📊 مشاركة رأي وتجربة مستخدم جديدة: ${payload.type || ''}`,
                            html: generateAdminEmailHTML(`استقبال استمارة شاركنا رأيك`, `التطوير وتجربة المستخدم الـ UX`, {
                                "اسم المشارك / اختياري": payload.name || "مجهول الهوية لخصوصيته",
                                "تخصص وفئة المستخدم": payload.specialty || "غير محدد",
                                "نوع الاستمارة والمشاركة": payload.type || "رأي عام",
                                "رأي العميل في الخدمة": payload.serviceName || "لم يحدد خدمة معينة",
                                "معيار جودة التنفيذ": `${payload.quality || 0} / 5 نجوم`,
                                "معيار الالتزام بالمواعيد": `${payload.commitment || 0} / 5 نجوم`,
                                "ركن المقترح البرمجي / السكريبت": payload.scriptIdea || "لا يوجد مقترح برمجيات",
                                "تقييم سهولة واجهة الـ UX": payload.uxRating || "لم يقم بالاختيار",
                                "نص الرسالة أو الشكوى": payload.message || "لا يوجد نص"
                            })
                        });
                    } catch (mErr) { console.error("Mail Log Error (FEEDBACK):", mErr.message); }
                }

                if (targetSection === 'MESSAGE') {
                    try {
                        await transporter.sendMail({
                            from: '"مراسلات الهندسة الذكية" <system@smart-engineering.com>',
                            to: ADMIN_EMAILS,
                            subject: `✉️ نموذج مراسلة هندسي جديد: ${payload.subject || ''}`,
                            html: generateAdminEmailHTML(`طلب تواصل مباشر واستشارة هندسية`, `بوابة اتصل بنا وحجز المواعيد`, {
                                "اسم العميل أو المهندس": payload.fullName || "غير محدد",
                                "البريد الإلكتروني للمرسل": payload.email || "لا يوجد",
                                "موضوع المراسلة الرئيسي": payload.subject || "طلب عام",
                                "موعد حجز الاستشارة المجانية": payload.bookingDate || "تواصل بدون حجز موعد",
                                "محتوى ونص الرسالة بالكامل": payload.message || "فارغ"
                            })
                        });
                    } catch (mErr) { console.error("Mail Log Error (MESSAGE):", mErr.message); }
                }
            }

            return NextResponse.json({ success: true, data: createdRecord, message: "تم الحفظ والإنشاء بنجاح!" }, { status: 201 });
        }

        // --- ميكانيكية التعديل الشاملة (UPDATE) ---
        if (globalAction === 'UPDATE') {
            if (!recordId) return NextResponse.json({ error: "معرف السجل مطلوب لإجراء التحديث" }, { status: 400 });
            if (!payload) return NextResponse.json({ error: "بيانات التعديل والـ Payload مطلوبة" }, { status: 400 });
            if (!currentModel) return NextResponse.json({ error: "الجدول المطلوب للتعديل غير موجود بقواعد البيانات" }, { status: 400 });

            let updateData = payload;
            if (targetSection === 'USER') updateData = { role: payload.role }; // حظر أمني لمنع تعديل كلمات المرور بالخطأ أثناء تعديل الصلاحية

            const updatedRecord = await currentModel.update({ where: { id: recordId }, data: updateData });
            return NextResponse.json({ success: true, data: updatedRecord, message: "تم تحديث السجل بنجاح!" });
        }

        return NextResponse.json({ error: "الإجراء التنفيذي المطلوب غير مدعوم في هذا المسار" }, { status: 400 });

    } catch (error) {
        console.error("Critical Admin API Main Processor Error:", error);
        return NextResponse.json({ error: "خطأ داخلي حرج في نظام خادم الإدارة المركزية الشامل للمنصة الذكية: " + error.message }, { status: 500 });
    }
}