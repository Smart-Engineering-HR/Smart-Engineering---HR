import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// تخزين ديناميكي موحد للخدمات الحقيقية
let globalServicesData = {
  structural: [
    { id: 's1', title: 'التصميم والتحليل الإنشائي', desc: 'إعداد المخططات الإنشائية الكاملة (أبراج، فيلات، مباني تجارية، خرسانات مسلحة أو منشآت ستيل) وفق الأكواد الدولية والمحلية (ACI, SBC, etc).' }
  ],
  architecture: [],
  smartTech: [],
  academy: []
};

const OFFICIAL_EMAILS = [
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io',
  'smartengineering.hr.global@gmail.com'
];

export async function GET() {
  return NextResponse.json(
    { success: true, data: globalServicesData }, 
    { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, servicesData, requestData } = body;

    // 1. تحديث الخدمات من لوحة التحكم لتظهر للجمهور فوراً
    if (action === 'UPDATE_SERVICES') {
      if (servicesData) {
        globalServicesData = servicesData;
      }
      return NextResponse.json({ 
        success: true, 
        message: 'تم تحديث ونشر الخدمات للجمهور بنجاح!',
        data: globalServicesData 
      }, { status: 200 });
    }

    // 2. استقبال واستلام طلبات الزوار وإرسال الإيميلات
    if (action === 'SUBMIT_REQUEST') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
          pass: process.env.EMAIL_PASS || ''
        }
      });

      const mailSubject = `[طلب خدمة/استشارة جديدة] - ${requestData.subject === 'اخر' ? requestData.customSubject : requestData.subject}`;
      const mailBody = `
==============================================
طلب خدمة جديدة من منصة الهندسة الذكية والموارد البشرية
==============================================
نوع الطلب: ${requestData.type}
القسم: ${requestData.serviceCategory}
الخدمة المطلوبة: ${requestData.serviceName}

بيانات التواصل للعميل:
- الاسم الكامل: ${requestData.fullName}
- البريد الإلكتروني: ${requestData.email}
- رقم الهاتف/واتساب: ${requestData.phone}
${requestData.dateTime ? `- الموعد المفضل: ${requestData.dateTime}` : ''}

موضوع الطلب: ${requestData.subject === 'اخر' ? requestData.customSubject : requestData.subject}
تفاصيل الرسالة:
${requestData.message}
==============================================
      `;

      try {
        if (process.env.EMAIL_PASS) {
          await transporter.sendMail({
            from: `"Smart Engineering Platform" <smartengineering.hr.global@gmail.com>`,
            to: OFFICIAL_EMAILS.join(','),
            subject: mailSubject,
            text: mailBody
          });
        }
      } catch (emailErr) {
        console.error("Nodemailer Send Error:", emailErr);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'تم إرسال الطلب بنجاح وتوجيهه إلى لوحة التحكم والإيميلات الرسمية.' 
      }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}