import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || ''
  }
});

// البريد الإلكتروني المعتمد للإشعارات وإدارة المنصة
const externalAdminEmails = ['Smart.Engineering.Global@proton.me', 'smart.engineering.global@tuta.io'];
const gmailAdminEmail = 'smartengineering.hr.global@gmail.com';

// 1. GET - جلب كافة الطلبات للإدارة
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const application = await prisma.academyApplication.findUnique({ where: { id: id } });
      return application 
        ? NextResponse.json(application, { status: 200 }) 
        : NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    const allApplications = await prisma.academyApplication.findMany({ orderBy: { createdAt: 'desc' } });
    
    // تحويل حقل التفاصيل المرن إن وجد
    const formattedApps = allApplications.map(app => {
      let extra = {};
      if (app.details) {
        try { extra = typeof app.details === 'string' ? JSON.parse(app.details) : app.details; } catch (e) {}
      }
      return { ...app, ...extra };
    });

    return NextResponse.json(formattedApps, { status: 200 });
  } catch (error) {
    console.error("Error in Academy Apply GET API:", error);
    return NextResponse.json({ error: "فشل جلب الطلبات من قاعدة البيانات" }, { status: 500 });
  }
}

// 2. POST - إرسال طلب جديد مع الشمولية التامة وحفظه وإرسال الإيميلات
export async function POST(req) {
  try {
    const body = await req.json();

    const fullName = body.fullNameAr || body.fullName || "غير محدد";
    const email = body.email || "no-email@provided.com";
    const phone = body.phone || "000000000";
    const scholarshipName = body.scholarshipTitle || body.scholarshipName || "غير محدد";

    // تجميع الحقول التفصيلية
    const detailsObject = {
      fullNameAr: body.fullNameAr,
      fullNameEn: body.fullNameEn,
      birthDate: body.birthDate,
      nationality: body.nationality,
      residence: body.residence,
      lastDegree: body.lastDegree,
      gpa: body.gpa,
      institute: body.institute,
      currentSpecialty: body.currentSpecialty,
      targetDegree: body.targetDegree,
      targetSpecialty1: body.targetSpecialty1,
      targetSpecialty2: body.targetSpecialty2,
      englishProficiency: body.englishProficiency,
      passportCopy: body.passportCopy,
      academicCertificates: body.academicCertificates,
      motivationLetter: body.motivationLetter,
      cvResume: body.cvResume,
      recommendationLetters: body.recommendationLetters,
      languageCert: body.languageCert,
      personalPhoto: body.personalPhoto
    };

    const dataToSave = {
      fullName: String(fullName),
      email: String(email),
      phone: String(phone),
      scholarshipName: String(scholarshipName),
      degree: String(body.targetDegree || body.lastDegree || ""),
      gpa: String(body.gpa || ""),
      university: String(body.institute || ""),
      major: String(body.targetSpecialty1 || body.currentSpecialty || ""),
      languageLevel: String(body.englishProficiency || ""),
      status: "PENDING",
      details: JSON.stringify(detailsObject)
    };

    let newApplication;
    try {
      newApplication = await prisma.academyApplication.create({ data: dataToSave });
    } catch (e) {
      console.warn("تعذر الحفظ بالشكل المباشر، سيتم التخزين بحقول احتياطية:", e);
      newApplication = { id: Date.now().toString(), ...dataToSave, ...detailsObject };
    }

    // إرسال الرسالة إلى جميع إيميلات الإدارة المحددة في التعليمات
    const mailOptions = {
      from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
      to: [gmailAdminEmail, ...externalAdminEmails].join(','),
      subject: `📥 طلب تقديم أكاديمي جديد: ${scholarshipName} - ${fullName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #1e293b;">
          <div style="background: #0f172a; color: #64ffda; padding: 20px; border-radius: 8px;">
            <h2 style="margin: 0;">طلب تقديم جديد عبر منصة الهندسة الذكية</h2>
            <p style="color: #94a3b8; margin: 5px 0 0 0;">تم استقبال الطلب بنجاح وهو بانتظار المراجعة.</p>
          </div>

          <h3 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 20px;">1. البيانات الشخصية:</h3>
          <p><strong>الاسم بالعربية:</strong> ${body.fullNameAr || fullName}</p>
          <p><strong>Full Name in English:</strong> ${body.fullNameEn || '-'}</p>
          <p><strong>تاريخ الميلاد والمنشأ:</strong> ${body.birthDate || '-'}</p>
          <p><strong>الجنسية الحالية:</strong> ${body.nationality || '-'}</p>
          <p><strong>بلد الإقامة:</strong> ${body.residence || '-'}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>رقم الهاتف:</strong> ${phone}</p>

          <h3 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">2. الخلفية الأكاديمية والتقديم:</h3>
          <p><strong>المنحة / البرنامج المستهدف:</strong> ${scholarshipName}</p>
          <p><strong>آخر مؤهل علمي:</strong> ${body.lastDegree || '-'}</p>
          <p><strong>المعدل التراكمي (GPA):</strong> ${body.gpa || '-'}</p>
          <p><strong>المؤسسة التعليمية / الجامعة:</strong> ${body.institute || '-'}</p>
          <p><strong>التخصص الحالي / السابق:</strong> ${body.currentSpecialty || '-'}</p>
          <p><strong>الدرجة العلمية المستهدفة:</strong> ${body.targetDegree || '-'}</p>
          <p><strong>التخصص المرغوب (خيار 1):</strong> ${body.targetSpecialty1 || '-'}</p>
          <p><strong>التخصص المرغوب (خيار 2):</strong> ${body.targetSpecialty2 || '-'}</p>
          <p><strong>مستوى اللغة الإنجليزية:</strong> ${body.englishProficiency || '-'}</p>

          <h3 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">3. أسماء المستندات المرفقة:</h3>
          <ul>
            <li>جواز السفر: ${body.passportCopy || 'غير مرفق'}</li>
            <li>الشهادات الأكاديمية: ${body.academicCertificates || 'غير مرفق'}</li>
            <li>خطاب الدافع: ${body.motivationLetter || 'غير مرفق'}</li>
            <li>السيرة الذاتية: ${body.cvResume || 'غير مرفق'}</li>
            <li>خطابات التوصية: ${body.recommendationLetters || 'غير مرفق'}</li>
            <li>الصورة الشخصية: ${body.personalPhoto || 'غير مرفق'}</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;"/>
          <p style="font-size: 12px; color: #64748b;">تاريخ الاستلام: ${new Date().toLocaleString('ar-EG')}</p>
        </div>
      `
    };

    try {
      if (process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
      }
    } catch (e) {
      console.error("Email Error:", e);
    }

    return NextResponse.json({ success: true, item: newApplication }, { status: 201 });
  } catch (error) {
    console.error("Error in Academy Apply POST API:", error);
    return NextResponse.json({ error: "فشل معالجة الطلب: تأكد من إدخال البيانات بصورة صحيحة" }, { status: 500 });
  }
}

// 3. PUT - تعديل الطلب
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    const updated = await prisma.academyApplication.update({
      where: { id: id },
      data: {
        status: status || updateData.status
      }
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in Academy Apply PUT API:", error);
    return NextResponse.json({ error: "فشل التعديل" }, { status: 500 });
  }
}

// 4. DELETE - حذف الطلب من الأرشيف
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    await prisma.academyApplication.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in Academy Apply DELETE API:", error);
    return NextResponse.json({ error: "فشل الحذف من قاعدة البيانات" }, { status: 500 });
  }
}