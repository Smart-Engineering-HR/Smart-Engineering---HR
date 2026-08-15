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

const adminEmails = [
  'smartengineering.hr.global@gmail.com',
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io'
];

// دالة مساعدة لتفكيك وتحويل الملفات سواء كانت روابط أو Base64 أو كائنات
function parseFileField(field, defaultName) {
  if (!field) return null;
  let fileName = defaultName;
  let rawData = '';

  if (typeof field === 'string') {
    rawData = field;
  } else if (typeof field === 'object') {
    fileName = field.name || defaultName;
    rawData = field.data || field.url || field.path || '';
  }

  if (!rawData) return null;

  if (rawData.startsWith('data:')) {
    const matches = rawData.match(/^data:(.+);base64,(.+)$/);
    if (matches) {
      return {
        fileName,
        contentType: matches[1],
        buffer: Buffer.from(matches[2], 'base64'),
        isBase64: true
      };
    }
  }

  return { fileName, url: rawData, isBase64: false };
}

// 1. GET: جلب جميع الطلبات للوحة التحكم
export async function GET() {
  try {
    const dbModel = prisma.academyApplication || prisma.AcademyApplication;
    if (!dbModel) return NextResponse.json([]);

    const applications = await dbModel.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formattedApps = applications.map(app => {
      let extra = {};
      if (app.details) {
        try {
          extra = typeof app.details === 'string' ? JSON.parse(app.details) : app.details;
        } catch (e) {
          extra = {};
        }
      }
      return { ...app, ...extra };
    });

    return NextResponse.json(formattedApps, { status: 200 });
  } catch (error) {
    console.error("GET Applications Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// 2. POST: معالجة الطلب، تحويل الملفات لمرفقات البريد، والحفظ في DB
export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let bodyData = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        bodyData[key] = value;
      }
    } else {
      bodyData = await req.json();
    }

    const fullName = bodyData.fullName || bodyData.fullNameAr || bodyData.applicantName || bodyData.name || 'متقدم جديد';
    const email = bodyData.email || 'غير محدد';
    const phone = bodyData.phone || bodyData.mobile || 'غير محدد';
    const scholarshipName = bodyData.scholarshipName || bodyData.scholarshipTitle || bodyData.itemTitle || 'منحة / برنامج أكاديمي';

    // فحص جميع مسميات حقول الملفات المتوقعة من الفرونت إند
    const fileFields = {
      passport: bodyData.passportUrl || bodyData.passport || bodyData.passportCopy || bodyData.passportFile,
      cv: bodyData.cvUrl || bodyData.cv || bodyData.cvResume || bodyData.cvFile,
      motivation: bodyData.motivationUrl || bodyData.motivation || bodyData.motivationLetter || bodyData.motivationFile,
      recommendation: bodyData.recommendationUrl || bodyData.recommendation || bodyData.recommendationLetters || bodyData.recommendationFile,
      languageCert: bodyData.languageCertUrl || bodyData.languageCert || bodyData.languageCertFile,
      photo: bodyData.photoUrl || bodyData.photo || bodyData.personalPhoto || bodyData.photoFile
    };

    const attachmentsList = [];
    const htmlLinks = [];
    const detailsSaved = { itemId: bodyData.itemId || '' };

    const labels = {
      passport: "جواز السفر",
      cv: "السيرة الذاتية",
      motivation: "خطاب الدافع",
      recommendation: "خطابات التوصية",
      languageCert: "شهادة اللغة",
      photo: "الصورة الشخصية"
    };

    for (const [key, rawVal] of Object.entries(fileFields)) {
      if (!rawVal) continue;
      const label = labels[key] || key;
      const parsed = parseFileField(rawVal, `${label}.pdf`);

      if (parsed) {
        if (parsed.isBase64) {
          attachmentsList.push({
            filename: parsed.fileName,
            content: parsed.buffer,
            contentType: parsed.contentType
          });
          htmlLinks.push(`<li><strong>${label}:</strong> تم إرفاق الملف مباشرة مع هذا البريد (${parsed.fileName})</li>`);
          detailsSaved[key] = `مرفق: ${parsed.fileName}`;
        } else {
          htmlLinks.push(`<li><strong>${label}:</strong> <a href="${parsed.url}" target="_blank">اضغط هنا لعرض / تنزيل المستند</a></li>`);
          detailsSaved[key] = parsed.url;
        }
      }
    }

    // حفظ الطلب في قاعدة البيانات
    let savedApp = null;
    try {
      const dbModel = prisma.academyApplication || prisma.AcademyApplication;
      if (dbModel) {
        savedApp = await dbModel.create({
          data: {
            fullName: String(fullName),
            email: String(email),
            phone: String(phone),
            scholarshipName: String(scholarshipName),
            details: JSON.stringify({ ...detailsSaved, rawData: bodyData })
          }
        });
      }
    } catch (dbErr) {
      console.error("Database Save Error:", dbErr);
    }

    // إرسال الإيميل مع الملفات الكاملة كـ Attachments
    if (process.env.EMAIL_PASS) {
      const emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #0d9488; border-radius: 8px; background-color: #f9fafb;">
          <h2 style="color: #0d9488;">🎓 طلب تقديم جديد على منحة: ${scholarshipName}</h2>
          <hr />
          <p><strong>👤 اسم المتقدم:</strong> ${fullName}</p>
          <p><strong>📧 البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>📱 رقم الهاتف:</strong> ${phone}</p>
          <br />
          <h3 style="color: #0d9488;">📂 المستندات والروابط المرفقة:</h3>
          ${htmlLinks.length > 0 ? `<ul>${htmlLinks.join('')}</ul>` : '<p style="color: #dc2626;">لم يتم إرفاق ملفات نصية أو روابط، تم إرفاق المستندات في المرفقات السفلى إن وجدت.</p>'}
          <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">تجد كافة الملفات المرفوعة مفيشة ومرفقة بالكامل أسفل هذه الرسالة.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"منصة الهندسة الذكية 🚀" <${process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com'}>`,
        to: adminEmails.join(','),
        subject: `🎓 طلب منحة جديد: ${fullName} - ${scholarshipName}`,
        html: emailHtml,
        attachments: attachmentsList
      });
    }

    return NextResponse.json({ success: true, data: savedApp }, { status: 201 });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء معالجة الطلب" }, { status: 500 });
  }
}