import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// استخدام مسار /tmp المتاح للكتابة في بيئات Vercel / Serverless
const tmpDataFilePath = path.join('/tmp', 'services.json');
const tmpRequestsFilePath = path.join('/tmp', 'requests.json');
const localDataFilePath = path.join(process.cwd(), 'data', 'services.json');

const defaultServicesData = {
  structural: [
    { id: 's1', title: 'التصميم والتحليل الإنشائي', desc: 'إعداد المخططات الإنشائية الكاملة وفق الأكواد الدولية والمحلية.' }
  ],
  architecture: [],
  smartTech: [],
  academy: []
};

// الذاكرة المؤقتة العالمية لضمان سرعة الاستجابة
if (!global._servicesDataCache) {
  global._servicesDataCache = null;
}
if (!global._requestsDataCache) {
  global._requestsDataCache = [];
}

function getServicesData() {
  if (global._servicesDataCache !== null) {
    return global._servicesDataCache;
  }

  // 1. المحاولة الأولى: قراءة البيانات من /tmp
  try {
    if (fs.existsSync(tmpDataFilePath)) {
      const fileData = fs.readFileSync(tmpDataFilePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      global._servicesDataCache = parsed;
      return parsed;
    }
  } catch (e) {
    console.error("Error reading tmp services file:", e);
  }

  // 2. المحاولة الثانية: قراءة البيانات من ملف المشروع إن وجد
  try {
    if (fs.existsSync(localDataFilePath)) {
      const fileData = fs.readFileSync(localDataFilePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      global._servicesDataCache = parsed;
      return parsed;
    }
  } catch (e) {
    console.error("Error reading local services file:", e);
  }

  global._servicesDataCache = defaultServicesData;
  return defaultServicesData;
}

function saveServicesData(data) {
  global._servicesDataCache = data;
  
  // حفظ في /tmp السريع
  try {
    fs.writeFileSync(tmpDataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error writing to tmp services file:", e);
  }

  // حفظ في مسار المشروع إن سمحت بيئة الاستضافة
  try {
    const dirPath = path.dirname(localDataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(localDataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // تتجاهل بيئة Vercel إذا كان المسار محمي من الكتابة
  }
}

function getRequestsData() {
  if (global._requestsDataCache && global._requestsDataCache.length > 0) {
    return global._requestsDataCache;
  }
  try {
    if (fs.existsSync(tmpRequestsFilePath)) {
      const fileData = fs.readFileSync(tmpRequestsFilePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      global._requestsDataCache = parsed;
      return parsed;
    }
  } catch (e) {
    console.error("Error reading requests file:", e);
  }
  return global._requestsDataCache || [];
}

function saveRequestsData(requests) {
  global._requestsDataCache = requests;
  try {
    fs.writeFileSync(tmpRequestsFilePath, JSON.stringify(requests, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error writing requests file:", e);
  }
}

const OFFICIAL_EMAILS = [
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io',
  'smartengineering.hr.global@gmail.com'
];

export async function GET() {
  const currentServices = getServicesData();
  const currentRequests = getRequestsData();
  return NextResponse.json(
    { success: true, data: currentServices, requests: currentRequests }, 
    { 
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, servicesData, requestData, requestId } = body;

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
      const currentRequests = getRequestsData();
      const updatedRequests = [requestData, ...currentRequests];
      saveRequestsData(updatedRequests);

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

    if (action === 'DELETE_REQUEST') {
      const currentRequests = getRequestsData();
      const filteredRequests = currentRequests.filter(req => req.id !== requestId);
      saveRequestsData(filteredRequests);
      return NextResponse.json({ success: true, requests: filteredRequests }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}