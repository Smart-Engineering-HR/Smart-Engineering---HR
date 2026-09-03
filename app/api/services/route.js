import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// تهيئة عميل Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

// دالة جلب الخدمات من جدول Service
async function getServicesData() {
  try {
    const { data, error } = await supabase
      .from('Service')
      .select('*');

    if (error || !data || data.length === 0) {
      return defaultServicesData;
    }

    // تجميع الخدمات حسب الأقسام
    const formattedData = {
      structural: [],
      architecture: [],
      smartTech: [],
      academy: []
    };

    data.forEach(item => {
      const category = item.category || item.serviceCategory;
      if (formattedData[category]) {
        formattedData[category].push({
          id: item.id,
          title: item.title || item.name,
          desc: item.desc || item.description
        });
      }
    });

    return formattedData;
  } catch (err) {
    console.error('Error fetching services from Supabase:', err);
    return defaultServicesData;
  }
}

// دالة حفظ/تحديث الخدمات في Supabase
async function saveServicesData(servicesData) {
  try {
    const rowsToInsert = [];
    Object.keys(servicesData).forEach(category => {
      if (Array.isArray(servicesData[category])) {
        servicesData[category].forEach(service => {
          rowsToInsert.push({
            id: service.id,
            category: category,
            title: service.title,
            desc: service.desc
          });
        });
      }
    });

    if (rowsToInsert.length > 0) {
      await supabase.from('Service').upsert(rowsToInsert, { onConflict: 'id' });
    }
  } catch (err) {
    console.error('Error saving services to Supabase:', err);
  }
}

// دالة جلب طلبات الخدمات من جدول ServiceRequest
async function getRequestsData() {
  try {
    const { data, error } = await supabase
      .from('ServiceRequest')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching requests:', err);
    return [];
  }
}

// دالة حفظ طلب خدمة جديد في جدول ServiceRequest
async function saveSingleRequest(requestData) {
  try {
    const { data, error } = await supabase
      .from('ServiceRequest')
      .insert([
        {
          id: requestData.id || undefined,
          type: requestData.type,
          serviceCategory: requestData.serviceCategory,
          serviceName: requestData.serviceName,
          fullName: requestData.fullName,
          email: requestData.email,
          phone: requestData.phone,
          dateTime: requestData.dateTime || null,
          subject: requestData.subject === 'اخر' ? requestData.customSubject : requestData.subject,
          message: requestData.message
        }
      ]);

    if (error) {
      console.error('Error inserting request to Supabase:', error);
    }
    return data;
  } catch (err) {
    console.error('Error saving request:', err);
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
    const { action, servicesData, requestData, requestId, backupRequests, backupServices } = body;

    // 1. تحديث الخدمات
    if (action === 'UPDATE_SERVICES') {
      if (servicesData) await saveServicesData(servicesData);
      return NextResponse.json({ success: true, message: 'تم تحديث الخدمات بنجاح', data: servicesData });
    }

    // 2. تقديم طلب جديد
    if (action === 'SUBMIT_REQUEST') {
      // حفظ الطلب في جدول ServiceRequest بـ Supabase
      await saveSingleRequest(requestData);

      // إرسال البريد الإلكتروني
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
الخدمة: ${requestName(requestData)}
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

    // 3. حذف طلب
    if (action === 'DELETE_REQUEST') {
      if (requestId) {
        await supabase.from('ServiceRequest').delete().eq('id', requestId);
      }
      const updatedRequests = await getRequestsData();
      return NextResponse.json({ success: true, requests: updatedRequests });
    }

    // 4. مزامنة النسخ الاحتياطية للطلبات
    if (action === 'SYNC_BACKUP_REQUESTS' && Array.isArray(backupRequests)) {
      for (const req of backupRequests) {
        await saveSingleRequest(req);
      }
      const mergedRequests = await getRequestsData();
      return NextResponse.json({ success: true, requests: mergedRequests });
    }

    // 5. مزامنة النسخ الاحتياطية للخدمات
    if (action === 'SYNC_BACKUP_SERVICES' && backupServices) {
      await saveServicesData(backupServices);
      return NextResponse.json({ success: true, data: backupServices });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function requestName(req) {
  return req.serviceName || req.service || 'غير محدد';
}