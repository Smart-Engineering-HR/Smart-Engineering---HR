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

const externalAdminEmails = ['Smart.Engineering.Global@proton.me', 'smart.engineering.global@tuta.io'];
const gmailAdminEmail = 'smartengineering.hr.global@gmail.com';

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

export async function POST(req) {
  try {
    const body = await req.json();

    const fullName = body.fullNameAr || body.fullName || "غير محدد";
    const email = body.email || "no-email@provided.com";
    const phone = body.phone || "000000000";
    const scholarshipName = body.scholarshipTitle || body.scholarshipName || "منحة عامة";

    // تجميع الكائن الشامل للتخزين في قاعدة البيانات
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

    // 1. التخزين المباشر في قاعدة البيانات Prisma
    let newApplication;
    try {
      newApplication = await prisma.academyApplication.create({ data: dataToSave });
    } catch (e) {
      console.error("Prisma Save Error:", e);
      return NextResponse.json({ error: "فشل التخزين في قاعدة البيانات: " + e.message }, { status: 500 });
    }

    // 2. معالجة وتضمين المرفقات الفعلية في البريد الإلكتروني
    const emailAttachments = [];
    const fileKeys = [
      { key: 'passportCopy', label: 'جواز_السفر' },
      { key: 'academicCertificates', label: 'الشهادات_الأكاديمية' },
      { key: 'motivationLetter', label: 'خطاب_الدافع' },
      { key: 'cvResume', label: 'السيرة_الذاتية' },
      { key: 'recommendationLetters', label: 'خطابات_التوصية' },
      { key: 'languageCert', label: 'شهادة_اللغة' },
      { key: 'personalPhoto', label: 'الصورة_الشخصية' }
    ];

    fileKeys.forEach(item => {
      const fileObj = body[item.key];
      if (fileObj && fileObj.data && typeof fileObj.data === 'string') {
        const parts = fileObj.data.split(';base64,');
        if (parts.length === 2) {
          emailAttachments.push({
            filename: `${item.label}_${fileObj.name || 'document'}`,
            content: parts[1],
            encoding: 'base64'
          });
        }
      }
    });

    // 3. إرسال البريد الإلكتروني إلى كافة إيميلات الإدارة المعتمدة
    const mailOptions = {
      from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
      to: [gmailAdminEmail, ...externalAdminEmails].join(','),
      subject: `📥 طلب تقديم جديد للمنحة: ${scholarshipName} - ${fullName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #1e293b;">
          <div style="background: #0f172a; color: #64ffda; padding: 20px; border-radius: 8px;">
            <h2 style="margin: 0;">طلب تقديم أكاديمي جديد عبر المنصة</h2>
            <p style="color: #94a3b8; margin: 5px 0 0 0;">تم استلام الملفات والبيانات وتخزينها في قاعدة البيانات بنجاح.</p>
          </div>

          <h3 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 20px;">1. البيانات الشخصية:</h3>
          <p><strong>الاسم بالعربية:</strong> ${body.fullNameAr || fullName}</p>
          <p><strong>Full Name in English:</strong> ${body.fullNameEn || '-'}</p>
          <p><strong>تاريخ الميلاد والمنشأ:</strong> ${body.birthDate || '-'}</p>
          <p><strong>الجنسية الحالية:</strong> ${body.nationality || '-'}</p>
          <p><strong>بلد الإقامة:</strong> ${body.residence || '-'}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>رقم الهاتف:</strong> ${phone}</p>

          <h3 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">2. الخلفية الأكاديمية والبرنامج:</h3>
          <p><strong>المنحة المستهدفة:</strong> ${scholarshipName}</p>
          <p><strong>آخر مؤهل علمي:</strong> ${body.lastDegree || '-'}</p>
          <p><strong>المعدل التراكمي (GPA):</strong> ${body.gpa || '-'}</p>
          <p><strong>الجامعة / المؤسسة:</strong> ${body.institute || '-'}</p>
          <p><strong>التخصص الحالي / السابق:</strong> ${body.currentSpecialty || '-'}</p>
          <p><strong>الدرجة العلمية المستهدفة:</strong> ${body.targetDegree || '-'}</p>
          <p><strong>التخصص المرغوب (خيار 1):</strong> ${body.targetSpecialty1 || '-'}</p>
          <p><strong>التخصص المرغوب (خيار 2):</strong> ${body.targetSpecialty2 || '-'}</p>
          <p><strong>مستوى اللغة الإنجليزية:</strong> ${body.englishProficiency || '-'}</p>

          <h3 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">3. الملفات والمستندات:</h3>
          <p style="color: #059669; font-weight: bold;">📎 تم إرفاق كافة المستندات المرفوعة مباشرة في هذا البريد مع حفظها في لوحة تحكم الأدمن.</p>

          <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;"/>
          <p style="font-size: 12px; color: #64748b;">تاريخ التقديم: ${new Date().toLocaleString('ar-EG')}</p>
        </div>
      `,
      attachments: emailAttachments
    };

    try {
      if (process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
      }
    } catch (mailErr) {
      console.error("Email Sending Error:", mailErr);
    }

    return NextResponse.json({ success: true, item: newApplication }, { status: 201 });
  } catch (error) {
    console.error("Error in Academy Apply POST API:", error);
    return NextResponse.json({ error: "فشل معالجة الطلب: " + error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    const updated = await prisma.academyApplication.update({
      where: { id: id },
      data: { status: status || "APPROVED" }
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in Academy Apply PUT API:", error);
    return NextResponse.json({ error: "فشل التعديل" }, { status: 500 });
  }
}

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