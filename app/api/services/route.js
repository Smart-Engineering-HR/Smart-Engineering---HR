import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'services.json');

const defaultServicesData = {
  structural: [
    { id: 's1', title: 'التصميم والتحليل الإنشائي', desc: 'إعداد المخططات الإنشائية الكاملة وفق الأكواد الدولية والمحلية.' }
  ],
  architecture: [],
  smartTech: [],
  academy: []
};

// حفظ البيانات في ذاكرة السيرفر الحية لضمان عدم اختفائها في Vercel/Serverless
if (!global._servicesDataCache) {
  global._servicesDataCache = null;
}

function getServicesData() {
  if (global._servicesDataCache) {
    return global._servicesDataCache;
  }
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultServicesData, null, 2), 'utf-8');
      global._servicesDataCache = defaultServicesData;
      return defaultServicesData;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const parsed = JSON.parse(fileData);
    global._servicesDataCache = parsed;
    return parsed;
  } catch (error) {
    console.error("Error reading services file:", error);
    return defaultServicesData;
  }
}

function saveServicesData(data) {
  global._servicesDataCache = data; // تحديث الذاكرة الحية فوراً
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving services file:", error);
  }
}

const OFFICIAL_EMAILS = [
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io',
  'smartengineering.hr.global@gmail.com'
];

export async function GET() {
  const currentData = getServicesData();
  return NextResponse.json(
    { success: true, data: currentData }, 
    { 
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, servicesData, requestData } = body;

    if (action === 'UPDATE_SERVICES') {
      if (servicesData) {
        saveServicesData(servicesData);
      }
      return NextResponse.json({ 
        success: true, 
        message: 'تم تحديث ونشر الخدمات بنجاح!',
        data: servicesData 
      }, { status: 200 });
    }

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