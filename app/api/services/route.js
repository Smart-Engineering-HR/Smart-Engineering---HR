import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const tmpDataFilePath = path.join('/tmp', 'services.json');
const tmpRequestsFilePath = path.join('/tmp', 'requests.json');

const defaultServicesData = {
  structural: [
    { id: 's1', title: 'التصميم والتحليل الإنشائي', desc: 'إعداد المخططات الإنشائية الكاملة وفق الأكواد الدولية والمحلية.' }
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

// دالة تنفيذ الأوامر القياسية في Upstash Redis لمنع تلف الـ JSON
async function redisCommand(commandArray) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commandArray),
      cache: 'no-store'
    });
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error('Upstash Redis Command Error:', err);
    return null;
  }
}

// جلب الخدمات من السحابة مع التحقق الصارم
async function getServicesData() {
  const rawResult = await redisCommand(['GET', 'app_services_data']);
  if (rawResult) {
    try {
      const parsed = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {
      console.error('Error parsing cloud services data:', e);
    }
  }

  try {
    if (fs.existsSync(tmpDataFilePath)) {
      return JSON.parse(fs.readFileSync(tmpDataFilePath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading tmp services:', e);
  }

  return defaultServicesData;
}

// حفظ الخدمات سحابياً
async function saveServicesData(data) {
  await redisCommand(['SET', 'app_services_data', JSON.stringify(data)]);
  try {
    fs.writeFileSync(tmpDataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing tmp services:', e);
  }
}

// جلب طلبات العملاء والرسائل بأمان تام
async function getRequestsData() {
  const rawResult = await redisCommand(['GET', 'app_requests_data']);
  if (rawResult) {
    try {
      const parsed = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Error parsing cloud requests:', e);
    }
  }

  try {
    if (fs.existsSync(tmpRequestsFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(tmpRequestsFilePath, 'utf-8'));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading tmp requests:', e);
  }

  return [];
}

// حفظ طلبات العملاء بشكل مؤكد
async function saveRequestsData(requests) {
  if (!Array.isArray(requests)) return;
  await redisCommand(['SET', 'app_requests_data', JSON.stringify(requests)]);
  try {
    fs.writeFileSync(tmpRequestsFilePath, JSON.stringify(requests, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing tmp requests:', e);
  }
}

export async function GET() {
  const [currentServices, currentRequests] = await Promise.all([
    getServicesData(),
    getRequestsData()
  ]);

  return NextResponse.json(
    { success: true, data: currentServices, requests: currentRequests },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache'
      }
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, servicesData, requestData, requestId, backupRequests } = body;

    if (action === 'UPDATE_SERVICES') {
      if (servicesData) await saveServicesData(servicesData);
      return NextResponse.json({ success: true, message: 'تم تحديث الخدمات بنجاح!', data: servicesData }, { status: 200 });
    }

    if (action === 'SUBMIT_REQUEST') {
      const currentRequests = await getRequestsData();
      const updatedRequests = [requestData, ...currentRequests];
      await saveRequestsData(updatedRequests);

      // إرسال البريد الإلكتروني في الخلفية
      if (process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
            pass: process.env.EMAIL_PASS
          }
        });

        const mailSubject = `[طلب خدمة/استشارة جديدة] - ${requestData.subject === 'اخر' ? requestData.customSubject : requestData.subject}`;
        const mailBody = `
==============================================
طلب خدمة جديدة من منصة الهندسة الذكية
==============================================
نوع الطلب: ${requestData.type}
القسم: ${requestData.serviceCategory}
الخدمة المطلوبة: ${requestData.serviceName}

بيانات التواصل:
- الاسم: ${requestData.fullName}
- البريد: ${requestData.email}
- الهاتف/واتساب: ${requestData.phone}
${requestData.dateTime ? `- الموعد المفضل: ${requestData.dateTime}` : ''}

الرسالة:
${requestData.message}
==============================================
        `;

        transporter.sendMail({
          from: `"Smart Engineering Platform" <smartengineering.hr.global@gmail.com>`,
          to: OFFICIAL_EMAILS.join(','),
          subject: mailSubject,
          text: mailBody
        }).catch(err => console.error("Nodemailer Async Error:", err));
      }

      return NextResponse.json({ success: true, message: 'تم حفظ ووضع الطلب في اللوحة وإرساله بنجاح.' }, { status: 200 });
    }

    if (action === 'DELETE_REQUEST') {
      const currentRequests = await getRequestsData();
      const filteredRequests = currentRequests.filter(req => req.id !== requestId);
      await saveRequestsData(filteredRequests);
      return NextResponse.json({ success: true, requests: filteredRequests }, { status: 200 });
    }

    // مزامنة لاستعادة طلبات النسخ الاحتياطي للأدمن إن وُجدت
    if (action === 'SYNC_BACKUP_REQUESTS' && Array.isArray(backupRequests)) {
      await saveRequestsData(backupRequests);
      return NextResponse.json({ success: true, requests: backupRequests }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}