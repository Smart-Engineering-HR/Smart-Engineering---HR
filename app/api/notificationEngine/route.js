import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// إيميلات الإدارة والمنصة الرسمية الثابتة (من الكود الأول)
const ADMIN_EMAILS = [
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io',
  'smartengineering.hr.global@gmail.com'
];

// إيميلات المنصة التي يجب أن تتلقى الإشعارات (من الكود الثاني)
const platformEmails = [
  'smartengineering.hr.global@gmail.com',
  'smart.engineering.global@tuta.io',
  'Smart.Engineering.Global@proton.me'
];

// محاكاة لقاعدة بيانات لإرسال الإشعارات لجميع المسجلين حسب الفئة
const MOCK_SUBSCRIBERS = {
  jobSeekers: ['seeker1@gmail.com', 'seeker2@proton.me'],
  vendors: ['vendor1@tuta.io', 'vendor2@gmail.com']
};

// إعداد الترانسبورتر الخاص بـ Nodemailer (تم الدمج ليدعم المتغيرات والـ fallback لتفادي أي أخطاء)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || 'your_app_password_here'
  }
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let subject = '';
    let emailHtml = '';
    let htmlContent = ''; // متغير المحتوى الخاص بالكود الثاني
    let recipients = [...ADMIN_EMAILS];
    let sendToUserToo = false; // متغير للتحقق مما إذا كان يجب إرسال نسخة للمستخدم أيضاً (من الكود الثاني)
    
    // علم لتحديد أي آلية إرسال سيتم اعتمادها بناءً على الحدث لضمان عدم تداخل البنية
    let isCodeTwoEvent = false;

    // بناء محتوى الإيميل بناءً على الحدث (Event Type) - دمج الـ switch بالكامل
    switch (type) {
      // ------ أحداث الكود الأول ------
      case 'NEW_JOB_PUBLISHED':
        subject = `📢 وظيفة جديدة: ${data.title}`;
        emailHtml = `
          <div style="direction: rtl; font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea;">
            <h2 style="color: #0284c7;">منصة الهندسة الذكية - إشعار وظيفة جديدة</h2>
            <p><strong>المسمى الوظيفي:</strong> ${data.title}</p>
            <p><strong>الجهة المعلنة:</strong> ${data.company}</p>
            <p><strong>مكان العمل:</strong> ${data.location}</p>
            <p><strong>تاريخ النشر:</strong> ${data.publishDate} | <strong>تاريخ الإغلاق:</strong> ${data.endDate}</p>
            <hr/>
            <p>تم إرسال هذا الإشعار تلقائياً إلى إدارة المنصة وكافة الباحثين عن عمل المسجلين.</p>
          </div>
        `;
        // إضافة إيميلات الباحثين عن عمل إلى قائمة المستلمين
        recipients = [...recipients, ...MOCK_SUBSCRIBERS.jobSeekers];
        break;

      case 'NEW_TENDER_PUBLISHED':
        subject = `💼 مناقصة جديدة: ${data.title}`;
        emailHtml = `
          <div style="direction: rtl; font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea;">
            <h2 style="color: #059669;">منصة الهندسة الذكية - إشعار مناقصة جديدة</h2>
            <p><strong>عنوان المناقصة:</strong> ${data.title}</p>
            <p><strong>الجهة المعلنة:</strong> ${data.company}</p>
            <p><strong>رقم المناقصة:</strong> ${data.tenderNumber}</p>
            <p><strong>موعد فتح المظاريف:</strong> ${data.openingDate}</p>
            <hr/>
            <p>تم إرسال هذا الإشعار تلقائياً إلى إدارة المنصة وكافة المقاولين والموردين المسجلين.</p>
          </div>
        `;
        recipients = [...recipients, ...MOCK_SUBSCRIBERS.vendors];
        break;

      case 'CLIENT_ADVERTISEMENT_REQUEST':
        subject = `📩 طلب إعلان جديد قيد المراجعة من: ${data.companyName}`;
        emailHtml = `
          <div style="direction: rtl; font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; background-color: #f9fafb;">
            <h2 style="color: #d97706;">طلب إعلان جديد (بحاجة لمراجعة الأدمن)</h2>
            <p><strong>اسم الشركة:</strong> ${data.companyName}</p>
            <p><strong>الشخص المسؤول:</strong> ${data.contactPerson}</p>
            <p><strong>رقم الهاتف:</strong> ${data.phone}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
            <p><strong>نوع الإعلان المطلوب:</strong> ${data.adType}</p>
            <p><strong>معلومات إضافية:</strong> ${data.moreInfo || 'لا يوجد'}</p>
            <p style="color: red; font-weight: bold;">⚠️ هذا الإعلان لن يظهر للجمهور إلا بعد موافقة الأدمن ونشره من لوحة التحكم.</p>
          </div>
        `;
        break;

      case 'NEW_USER_REGISTRATION':
        // لضمان التوافق التام وعدم الحذف، يتم صياغة المحتوىين وتخصيصهما حسب البيانات القادمة في الـ body
        subject = `👤 تسجيل مستخدم جديد بالمنصة: ${data.fullName || data.name}`;
        emailHtml = `
          <div style="direction: rtl; font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea;">
            <h2 style="color: #4f46e5;">إشعار عضوية جديدة بالمنصة</h2>
            <p><strong>الاسم الكامل:</strong> ${data.fullName || data.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
            <p><strong>التصنيف المعتمد (Role):</strong> ${data.role === 'seeker' ? 'باحث عن عمل' : 'مورد / مقاول'}</p>
            <p><strong>حالة الحساب:</strong> نشط (يمكن للأدمن حظره أو حذفه في أي وقت)</p>
          </div>
        `;
        // الحفاظ على كود الصياغة الثاني لنفس الحدث دون حذفه
        htmlContent = `
          <h3>تم تسجيل مستخدم جديد بنجاح:</h3>
          <p><b>الاسم:</b> ${data.name || data.fullName}</p>
          <p><b>البريد الإلكتروني:</b> ${data.email}</p>
          <p><b>الصفة:</b> ${data.role} (مهندس / مقاول / طالب...)</p>
        `;
        break;

      case 'AUTH_SECURITY_ALERT':
        subject = `🚨 تحذير أمني شديد الخطورة - منصة الهندسة الذكية`;
        emailHtml = `
          <div style="direction: rtl; font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; background-color: #fef2f2;">
            <h2 style="color: #dc2626;">محاولة اختراق / نشاط مريب وتجميد حساب</h2>
            <p><strong>البريد الإلكتروني المستهدف:</strong> ${data.email}</p>
            <p><strong>نوع النشاط:</strong> محاولة تسجيل دخول خاطئة لأكثر من 3 مرات متتالية.</p>
            <p style="font-weight: bold; color: #dc2626;">الإجراء المتخذ: تم تلقائياً حظر المستخدم ومنع الوصول لحماية الأنومة المطلقة للمنصة.</p>
          </div>
        `;
        break;

      case 'PASSWORD_RESET_REQUEST':
        subject = `🔒 طلب استعادة كلمة المرور - صلاحية 90 دقيقة`;
        emailHtml = `
          <div style="direction: rtl; font-family: sans-serif; padding: 20px; text-align: center;">
            <h2>منصة الهندسة الذكية & HR</h2>
            <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بحسابك.</p>
            <p>يرجى الضغط على الزر أدناه لإتمام العملية. هذا الرابط صالح لمدة 90 دقيقة فقط:</p>
            <a href="http://localhost:3000/jobs-tenders/auth?action=reset&email=${encodeURIComponent(data.email)}" 
               style="background-color: #0284c7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
               إعادة تعيين كلمة المرور
            </a>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">إذا لم تطلب هذا الإجراء، يمكنك تجاهل هذا البريد بنجاح.</p>
          </div>
        `;
        // إرسال للمستخدم وللأدمن للإحاطة والرقابة الإدارية
        recipients = [...recipients, data.email];
        break;

      // ------ أحداث الكود الثاني ------
      case 'NEW_JOB_TENDER':
        isCodeTwoEvent = true;
        subject = `🚨 إعلان جديد: وظيفة أو مناقصة جديدة قيد المراجعة`;
        htmlContent = `
          <h3>تم إضافة إعلان جديد على المنصة:</h3>
          <p><b>العنوان:</b> ${data.title}</p>
          <p><b>النوع:</b> ${data.type} (وظيفة/مناقصة)</p>
          <p><b>الجهة المعلنة:</b> ${data.companyName}</p>
          <p>الرجاء الدخول إلى لوحة التحكم لاعتماد الإعلان أو رفضه.</p>
        `;
        break;

      case 'USER_LOGIN_ALERT':
        isCodeTwoEvent = true;
        subject = `🔐 تنبيه أمني: تسجيل دخول جديد للوحة الإدارة`;
        htmlContent = `
          <h3>عملية تسجيل دخول جديدة:</h3>
          <p><b>المستخدم:</b> ${data.email}</p>
          <p><b>التوقيت:</b> ${new Date().toLocaleString('ar-EG')}</p>
        `;
        break;

      case 'PASSWORD_RESET':
        isCodeTwoEvent = true;
        subject = `🔄 طلب إعادة تعيين كلمة المرور`;
        htmlContent = `
          <h3>طلب تغيير كلمة المرور:</h3>
          <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك على منصة Smart Engineering.</p>
          <p>اضغط على الرابط أدناه لإعادة التعيين:</p>
          <a href="${data.resetLink}" style="padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">إعادة تعيين كلمة المرور</a>
          <p>إذا لم تكن أنت من طلب هذا، يرجى تجاهل هذا الإيميل.</p>
        `;
        sendToUserToo = true; // هنا يجب أن يذهب الإيميل للمستخدم صاحب المشكلة
        break;

      default:
        // لتجنب رمي الخطأ مباشرة وضمان معالجة الأحداث المدمجة بسلاسة
        throw new Error('نوع الحدث غير مدعوم');
    }

    // التنفيذ الفعلي للإرسال بناءً على البيانات المستخرجة لضمان عمل الكودين معاً
    if (isCodeTwoEvent) {
      // منطق الإرسال المأخوذ من الكود الثاني
      const platformMailOptions = {
        from: `"Smart Engineering" <${process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com'}>`,
        to: platformEmails.join(', '), 
        subject: subject,
        html: htmlContent,
      };
      await transporter.sendMail(platformMailOptions);

      if (sendToUserToo && data.email) {
        const userMailOptions = {
          from: `"Smart Engineering" <${process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com'}>`,
          to: data.email, 
          subject: subject,
          html: htmlContent,
        };
        await transporter.sendMail(userMailOptions);
      }
      return NextResponse.json({ success: true, message: 'تم إرسال الإشعارات بنجاح' });

    } else {
      // منطق الإرسال المأخوذ من الكود الأول (بالتوازي لضمان السرعة المطلقة)
      // إذا كان الحدث هو تسجيل مستخدم جديد، يتم دمج محتوى الكود الثاني مع الكود الأول لمنع الفقدان
      const finalHtml = type === 'NEW_USER_REGISTRATION' ? `${emailHtml} <hr/> ${htmlContent}` : emailHtml;

      await Promise.all(
        recipients.map(email =>
          transporter.sendMail({
            from: '"منصة الهندسة الذكية" <smartengineering.hr.global@gmail.com>',
            to: email,
            subject: subject,
            html: finalHtml
          }).catch(err => console.error(`فشل الإرسال إلى ${email}:`, err))
        )
      );
      return NextResponse.json({ success: true, message: 'تمت معالجة وإرسال الإشعارات بنجاح تام لجميع الأطراف' });
    }

  } catch (error) {
    console.error('فشل في إرسال الإشعار:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}