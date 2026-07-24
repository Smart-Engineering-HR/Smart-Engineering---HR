// lib/notificationEngine.js
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { generateEmailTemplate } from './mailTemplates';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || 'tzozgezqlubxvgsa'
  }
});

/**
 * محرك الإشعارات الذكي: يرسل تنبيهات موجهة حسب نوع الإعلان
 * يقوم بجلب الإعلان، تحديد الجمهور، واستخدام القالب الجاهز للإرسال
 */
export async function processNotifications(postingId) {
  try {
    // 1. جلب بيانات الإعلان
    const posting = await prisma.advertisement.findUnique({ where: { id: postingId } });
    if (!posting) {
      console.warn(`الإعلان برقم ${postingId} غير موجود.`);
      return;
    }

    // 2. تحديد نوع المستخدم المستهدف بناءً على نوع الإعلان
    const targetType = posting.advertiseType === 'وظيفة' ? 'seeker' : 'supplier';
    
    // 3. جلب المستخدمين المعنيين فقط
    const users = await prisma.user.findMany({ where: { type: targetType } });

    // 4. الإرسال المتسلسل الذكي
    for (const user of users) {
      try {
        // إنشاء محتوى الإيميل باستخدام القالب الموحد
        const htmlBody = generateEmailTemplate(
          user.name,
          posting.companyName,
          `تم نشر ${posting.advertiseType} جديدة تناسب تخصصك: ${posting.companyName}`,
          "https://your-platform.com/jobs-tenders",
          "تصفح الفرصة الآن"
        );

        await transporter.sendMail({
          from: '"منصة الهندسة الذكية" <no-reply@smartengineering.com>',
          to: user.email,
          subject: `فرصة جديدة: ${posting.companyName}`,
          html: htmlBody
        });
      } catch (mailErr) {
        console.error(`خطأ في إرسال البريد للمستخدم ${user.email}:`, mailErr);
        // استمرار الحلقة حتى لو فشل إرسال بريد واحد لضمان وصول الإشعارات للباقين
        continue;
      }
    }
  } catch (err) {
    console.error("خطأ عام في محرك الإشعارات:", err);
  }
}