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

if (!global._servicesDataCache) global._servicesDataCache = null;
if (!global._requestsDataCache) global._requestsDataCache = [];

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
    return null;
  }
}

async function getServicesData() {
  const rawResult = await redisCommand(['GET', 'app_services_data']);
  if (rawResult) {
    try {
      const parsed = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
      if (parsed && typeof parsed === 'object') {
        global._servicesDataCache = parsed;
        return parsed;
      }
    } catch (e) {}
  }

  if (global._servicesDataCache) return global._servicesDataCache;

  try {
    if (fs.existsSync(tmpDataFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(tmpDataFilePath, 'utf-8'));
      if (parsed && typeof parsed === 'object') {
        global._servicesDataCache = parsed;
        return parsed;
      }
    }
  } catch (e) {}

  return defaultServicesData;
}

async function saveServicesData(data) {
  if (!data || typeof data !== 'object') return;
  global._servicesDataCache = data;
  await redisCommand(['SET', 'app_services_data', JSON.stringify(data)]);
  try {
    fs.writeFileSync(tmpDataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

async function getRequestsData() {
  const rawResult = await redisCommand(['GET', 'app_requests_data']);
  if (rawResult) {
    try {
      const parsed = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
      if (Array.isArray(parsed)) {
        global._requestsDataCache = parsed;
        return parsed;
      }
    } catch (e) {}
  }

  if (global._requestsDataCache && global._requestsDataCache.length > 0) {
    return global._requestsDataCache;
  }

  try {
    if (fs.existsSync(tmpRequestsFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(tmpRequestsFilePath, 'utf-8'));
      if (Array.isArray(parsed) && parsed.length > 0) {
        global._requestsDataCache = parsed;
        return parsed;
      }
    }
  } catch (e) {}

  return global._requestsDataCache || [];
}

async function saveRequestsData(requests) {
  if (!Array.isArray(requests)) return;
  global._requestsDataCache = requests;
  await redisCommand(['SET', 'app_requests_data', JSON.stringify(requests)]);
  try {
    fs.writeFileSync(tmpRequestsFilePath, JSON.stringify(requests, null, 2), 'utf-8');
  } catch (e) {}
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
    const { action, servicesData, requestData, requestId, backupRequests, backupServices } = body;

    if (action === 'UPDATE_SERVICES') {
      if (servicesData) await saveServicesData(servicesData);
      return NextResponse.json({ success: true, message: 'تم تحديث الخدمات بنجاح', data: servicesData });
    }

    if (action === 'SUBMIT_REQUEST') {
      const currentRequests = await getRequestsData();
      const updatedRequests = [requestData, ...currentRequests];
      await saveRequestsData(updatedRequests);

      // إرسال الإيميل مع await المؤكد لضمان التسليم في بيئة Vercel
      if (process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
              pass: process.env.EMAIL_PASS
            }
          });

          const mailSubject = `[طلب جديد] ${requestData.type} - ${requestData.fullName}`;
          const mailBody = `
تفاصيل الطلب المستلم من المنصة:
--------------------------------
نوع الطلب: ${requestData.type}
القسم: ${requestData.serviceCategory}
الخدمة: ${requestData.serviceName}
الاسم: ${requestData.fullName}
البريد الإلكتروني: ${requestData.email}
الهاتف/الواتساب: ${requestData.phone}
الموعد: ${requestData.dateTime || 'غير محدد'}
الموضوع: ${requestData.subject === 'اخر' ? requestData.customSubject : requestData.subject}

نص الرسالة:
${requestData.message}
          `;

          await transporter.sendMail({
            from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com'}>`,
            to: OFFICIAL_EMAILS.join(','),
            subject: mailSubject,
            text: mailBody
          });
        } catch (mailError) {
          console.error("Nodemailer Sending Failed:", mailError);
        }
      }

      return NextResponse.json({ success: true, message: 'تم الحفظ والإرسال بنجاح' });
    }

    if (action === 'DELETE_REQUEST') {
      const currentRequests = await getRequestsData();
      const filteredRequests = currentRequests.filter(req => req.id !== requestId);
      await saveRequestsData(filteredRequests);
      return NextResponse.json({ success: true, requests: filteredRequests });
    }

    if (action === 'SYNC_BACKUP_REQUESTS' && Array.isArray(backupRequests)) {
      const currentRequests = await getRequestsData();
      // دمج الطلبات المحفوظة محلياً مع السيرفر بدون تكرار
      const map = new Map();
      [...currentRequests, ...backupRequests].forEach(item => map.set(item.id, item));
      const mergedRequests = Array.from(map.values());
      await saveRequestsData(mergedRequests);
      return NextResponse.json({ success: true, requests: mergedRequests });
    }

    if (action === 'SYNC_BACKUP_SERVICES' && backupServices) {
      await saveServicesData(backupServices);
      return NextResponse.json({ success: true, data: backupServices });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}