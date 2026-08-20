import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// القائمة الافتراضية المعتمدة لمنصة الهندسة الذكية والموارد البشرية
const defaultServices = {
  structural: [
    { id: 's1', title: 'التصميم والتحليل الإنشائي', desc: 'تصميم المنشآت الخرسانية والمعدنية وفق الأكواد العالمية (ACI, BS, Eurocodes).' },
    { id: 's2', title: 'مراجعة وتدقيق المخططات (Third Party)', desc: 'تقديم خدمة التدقيق الفني لضمان السلامة وتقليل التكاليف.' },
    { id: 's3', title: 'حساب الكميات وتقدير التكلفة (QS)', desc: 'إعداد جداول الكميات (BOQ) بدقة عالية.' },
    { id: 's4', title: 'تقييم وتدعيم المنشآت', desc: 'دراسة المباني القائمة وتقديم حلول التدعيم الإنشائي.' }
  ],
  architecture: [
    { id: 'a1', title: 'التصميم المعماري الحديث', desc: 'ابتكار تصاميم معمارية (فلل، مباني تجارية) تركز على استغلال المساحات والإضاءة الطبيعية.' },
    { id: 'a2', title: 'التصميم الداخلي والديكور (3D Rendering)', desc: 'تقديم تصاميم مذهلة ومحاكاة ثلاثية الأبعاد (3D Rendering).' },
    { id: 'a3', title: 'تنسيق المواقع (Landscape Design)', desc: 'تصميم المساحات الخارجية والحدائق بشكل جمالي وعملي.' }
  ],
  smartTech: [
    { id: 't1', title: 'تطوير برمجيات الهندسة المخصصة', desc: 'تصميم أدوات برمجية (بـ Python وFlutter) لحل مشاكل هندسية محددة.' },
    { id: 't2', title: 'أتمتة التصميم الإنشائي', desc: 'تحويل الحسابات اليدوية المتكررة إلى سكربتات برمجية سريعة ودقيقة.' },
    { id: 't3', title: 'تقليل الهالك (Waste Management)', desc: 'تقديم حلول برمجية مثل مشروعك (Rebar Zero-Waste) لتقليل فاقد الحديد.' },
    { id: 't4', title: 'نمذجة معلومات البناء (BIM)', desc: 'تحويل المخططات إلى نماذج ثلاثية الأبعاد ذكية وإدارة المشاريع رقمياً.' }
  ],
  academy: [
    { id: 'c1', title: 'دورات Python for Engineers', desc: 'تدريب المهندسين على البرمجة الهندسية لرفع كفاءة الإنتاج وأتمتة المهام.' },
    { id: 'c2', title: 'برامج التحليل الإنشائي', desc: 'تأهيل المهندسين على أحدث برامج التحليل العالمية لمواكبة متطلبات السوق.' }
  ]
};

// البرد الإلكترونية الرسمية المقرة للمنصة
const OFFICIAL_EMAILS = [
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io',
  'smartengineering.hr.global@gmail.com'
];

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: defaultServices }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, requestData } = body;

    if (action === 'SUBMIT_REQUEST') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
          pass: process.env.EMAIL_PASS || 'your_app_password_here'
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
        await transporter.sendMail({
          from: `"Smart Engineering Platform" <smartengineering.hr.global@gmail.com>`,
          to: OFFICIAL_EMAILS.join(','),
          subject: mailSubject,
          text: mailBody
        });
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