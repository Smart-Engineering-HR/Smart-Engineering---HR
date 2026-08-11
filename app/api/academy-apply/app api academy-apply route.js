import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      fullName, email, phone, scholarshipName, degree, 
      gpa, university, major, languageLevel 
    } = body;

    // إعداد ناقل البريد الإلكتروني (استخدم بيانات الـ SMTP الخاصة بإيميلك)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // أو smtp.protonmail.ch حسب المزود
      port: 587,
      secure: false,
      auth: {
        user: 'smartengineering.hr.global@gmail.com', // الإيميل المرسل منه
        pass: 'your-app-password', // كلمة مرور التطبيق (وليس كلمة مرور الإيميل العادية)
      },
    });

    // تنسيق محتوى الإيميل
    const mailOptions = {
      from: '"منصة الهندسة الذكية" <smartengineering.hr.global@gmail.com>',
      to: 'Smart.Engineering.Global@proton.me', // الإيميل الذي يستقبل الطلبات
      subject: `طلب تقديم جديد لـ: ${scholarshipName}`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; line-height: 1.6;">
          <h2 style="color: #d97706;">طلب تقديم أكاديمي جديد</h2>
          <p><strong>الاسم الكامل:</strong> ${fullName}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>رقم الهاتف:</strong> ${phone}</p>
          <hr/>
          <h3 style="color: #059669;">تفاصيل التقديم:</h3>
          <p><strong>المنحة المستهدفة:</strong> ${scholarshipName}</p>
          <p><strong>الدرجة العلمية:</strong> ${degree}</p>
          <p><strong>المعدل التراكمي:</strong> ${gpa}</p>
          <p><strong>الجامعة السابقة:</strong> ${university}</p>
          <p><strong>التخصص:</strong> ${major}</p>
          <p><strong>مستوى اللغة:</strong> ${languageLevel}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "تم إرسال طلبك بنجاح للأكاديمية!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "فشل إرسال الإيميل، يرجى المحاولة لاحقاً." }, { status: 500 });
  }
}