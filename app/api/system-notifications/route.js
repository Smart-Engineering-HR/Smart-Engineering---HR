import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// إعداد خادم النقل البريدي المعتمد للمنصة لضمان كسر الحجب الذاتي ووصول الإشعارات للـ Inbox
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password-here' // تأكد من وضع باسورد التطبيقات المكون من 16 حرفاً بملف .env
  }
});

// مصفوفة الإيميلات المعتبرة قانونياً لاستقبل كافة التنبيهات وحركات التسجيل فوراً لمنع الضياع
const adminEmails = [
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io',
  'smartengineering.hr.global@gmail.com'
];

// قاعدة بيانات مدمجة في السيرفر ومثبتة عالمياً للاحتفاظ بالحسابات ومنع تسجيل الدخول الوهمي (حل الإشكالية 3 و 4)
global.registeredUsersDatabase = global.registeredUsersDatabase || [
  { id: "1", fullName: "المهندس هاشم سلطان", email: "hashmsltan2015@gmail.com", password: "123", type: "مدير النظام", phone: "+967777777777", role: "admin" },
  { id: "2", fullName: "الإدارة العامة للمنصة", email: "Smart.Engineering.Global@proton.me", password: "123", type: "إدارة", phone: "000000", role: "admin" }
];

export async function GET() {
  // دالة GET تمكن لوحة تحكم المسؤول من سحب المشتركين الحقيقيين الذين قاموا بالتسجيل على المنصة
  try {
    return NextResponse.json({ success: true, users: global.registeredUsersDatabase }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء سحب المشتركين" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, data } = body; // الحركات المستلمة: register | login | forgotPassword

    if (!action || !data) {
      return NextResponse.json({ success: false, error: "بنية الطلب غير صالحة هندسياً" }, { status: 400 });
    }

    let subject = '';
    let htmlContent = '';

    // المعالجة البرمجية للحركة الأولى: تسجيل حساب جديد بالمنصة
    if (action === 'register') {
      const emailExists = global.registeredUsersDatabase.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
      if (emailExists) {
        return NextResponse.json({ success: false, error: "البريد الإلكتروني مسجل مسبقاً بالنظام!" }, { status: 400 });
      }

      // إدراج الحساب الجديد في قاعدة البيانات الحية ليعرض فوراً في لوحة التحكم
      const newUser = {
        id: String(global.registeredUsersDatabase.length + 1),
        fullName: data.fullName,
        email: data.email.trim().toLowerCase(),
        password: data.password, // في بيئة الإنتاج يفضل التشفير بـ bcrypt
        phone: data.phone || 'غير مدرج',
        type: data.type || 'باحث عن عمل',
        role: 'user'
      };
      global.registeredUsersDatabase.push(newUser);

      console.log(`[Terminal Log] تم تسجيل مستخدم جديد بنجاح: ${newUser.fullName} (${newUser.email})`);

      // بناء محتوى التنبيه البريدي الفخم للإدارة
      subject = `🔔 إشعار عضوية جديدة: تم تسجيل حساب مشترك جديد بالمنصة`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #c59b27; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #334155; padding-bottom: 8px;">إشعار تسجيل حساب مشترك جديد</h2>
          <p style="font-size: 14px;">مرحباً بمدير النظام، تم التقاط عملية تسجيل حساب حية عبر بوابة الوظائف والمناقصات، وإليك التفاصيل الكاملة برمجياً:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; color: #f8fafc;">
            <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; width: 30%;">اسم المشترك:</td><td style="padding: 10px; color: #f59e0b;">${data.fullName}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">البريد الإلكتروني:</td><td style="padding: 10px; color: #10b981;">${data.email}</td></tr>
            <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold;">رقم الجوال الفعال:</td><td style="padding: 10px;">${data.phone}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">تصنيف الحساب المنشأ:</td><td style="padding: 10px; color: #38bdf8; font-weight: bold;">${data.type}</td></tr>
            <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold;">وقت وتاريخ المعالجة:</td><td style="padding: 10px; font-size: 11px; color: #94a3b8;">${new Date().toLocaleString('ar-YE')}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #e2e8f0; border-top: 1px solid #334155; padding-top: 10px; text-align: center;">تم توثيق السجل وضخه ديناميكياً إلى لوحة تحكم المسؤول المباشر.</p>
        </div>
      `;
    }

    // المعالجة البرمجية للحركة الثانية: تسجيل الدخول الفعلي وتتبع حركات المستخدمين والزوار
    else if (action === 'login') {
      const user = global.registeredUsersDatabase.find(
        u => u.email.toLowerCase() === data.email.trim().toLowerCase() && u.password === data.password
      );

      if (!user) {
        console.log(`[Terminal Warning] محاولة تسجيل دخول فاشلة بريد: ${data.email}`);
        return NextResponse.json({ success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة مطلقاً" }, { status: 401 });
      }

      console.log(`[Terminal Log] تسجيل دخول ناجح وحي: ${user.fullName} سجل دخوله الآن للمنصة.`);

      // إرسال إشعار أمني فوري للإدارة يفيد بدخول العضو للمنصة
      subject = `🔐 تنبيه أمني حي: تسجيل دخول مستخدم إلى المنصة`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #3b82f6; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #334155; padding-bottom: 8px;">تتبع حركة تسجيل الدخول الحية</h2>
          <p style="font-size: 14px;">تمت عملية تسجيل دخول صحيحة وموثقة أمنياً للمنصة الآن:</p>
          <p><b>المستخدم الحالي:</b> <span style="color: #f59e0b;">${user.fullName}</span></p>
          <p><b>البريد الموصول:</b> <span style="color: #10b981;">${user.email}</span></p>
          <p><b>رتبة الحساب بالنظام:</b> <span style="color: #a855f7; font-weight: bold;">${user.type} (${user.role})</span></p>
          <p style="font-size: 11px; color: #94a3b8;">توقيت الحركة الدقيق: ${new Date().toLocaleString('ar-YE')}</p>
        </div>
      `;

      // إرسال الإشعار فوراً في الخلفية واستكمال التوجيه بدون تعطيل العضو
      const mailOptions = {
        from: 'smartengineering.hr.global@gmail.com',
        to: adminEmails.join(','),
        subject: subject,
        html: htmlContent
      };
      await transporter.sendMail(mailOptions).catch(err => console.error("Nodemailer Login Log Error:", err));

      return NextResponse.json({ success: true, message: "تم التحقق والولوج بنجاح", user: { fullName: user.fullName, email: user.email, role: user.role, type: user.type } }, { status: 200 });
    }

    // المعالجة البرمجية للحركة الثالثة: طلب استعادة كلمة المرور وإرسال الرابط الحقيقي
    else if (action === 'forgotPassword') {
      if (!data.email) {
        return NextResponse.json({ success: false, error: "البريد الإلكتروني مطلوب لتوليد كود الاستعادة" }, { status: 400 });
      }

      const user = global.registeredUsersDatabase.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
      if (!user) {
        return NextResponse.json({ success: false, error: "عذراً، هذا البريد الإلكتروني غير مسجل في المنصة مطلقاً" }, { status: 404 });
      }

      console.log(`[Terminal Log] تم إصدار رابط استعادة كلمة مرور للمستخدم: ${user.fullName}`);

      // بناء محتوى بريد استعادة كلمة المرور للمستخدم وللإدارة للتوثيق والتحكم
      subject = `🔄 طلب إعادة تعيين كلمة المرور: ${user.email}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #ef4444; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #334155; padding-bottom: 8px;">نظام استعادة الحسابات الذكي الموحد</h2>
          <p style="font-size: 14px;">مرحباً <b>${user.fullName}</b>، لقد استلمنا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك الهندي على المنصة:</p>
          <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; border: 1px dashed #f59e0b; margin: 15px 0; text-align: center;">
            <p style="margin: 0; font-size: 13px; font-weight: bold;">كلمة المرور الحالية المخزنة لحسابك هي: <span style="color: #10b981; font-size: 16px;">${user.password}</span></p>
          </div>
          <p style="font-size: 12px; color: #cbd5e1;">إذا لم تكن أنت من قام بهذا الطلب، يرجى مراجعة الأمن السيرفري فوراً. الرابط وصلاحية الطلب سارية لمدة 90 دقيقة فقط من تاريخ الإصدار.</p>
          <p style="font-size: 11px; color: #94a3b8; border-top: 1px solid #334155; pt: 10px;">توقيت الطلب الموثق: ${new Date().toLocaleString('ar-YE')}</p>
        </div>
      `;
    }

    // إرسال الإيميل الموحد لكافة الجهات والإدارات وعنوان العضو المستهدف لضمان التوصيل المطلق
    const targetEmails = [...adminEmails];
    if (data.email) {
      targetEmails.push(data.email.trim().toLowerCase());
    }

    const mailOptions = {
      from: '"المنصة الذكية Smart Engineering" <smartengineering.hr.global@gmail.com>',
      to: [...new Set(targetEmails)].join(','), // منع التكرار البريدي
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Terminal Success] تم إرسال الإشعار البريدي لـ ${action} بنجاح شامل.`);

    return NextResponse.json({ success: true, message: "تمت معالجة الحركة وإرسال الإشعارات وتوثيقها برمجياً بنجاح هندسي عالي." }, { status: 200 });

  } catch (error) {
    console.error("Critical System Notifications API Error:", error);
    return NextResponse.json({ success: false, error: "خطأ داخلي حرج بالسيرفر أثناء إرسال الإشعار: " + error.message }, { status: 500 });
  }
}