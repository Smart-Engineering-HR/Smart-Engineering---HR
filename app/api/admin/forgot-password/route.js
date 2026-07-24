import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendAdminNotification } from '@/lib/mail';
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email } = await req.json();

    // 1. التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });

    // 2. إنشاء التوكن
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry: expiry }
    });

    // 3. إرسال الإيميل باستخدام الأداة الموحدة (التي تستخدم Gmail SMTP)
    await sendEmail({
      to: email,
      subject: 'رابط إعادة تعيين كلمة المرور - بوابة الهندسة الذكية',
      text: `مرحباً،
      لقد طلبت إعادة تعيين كلمة مرور لوحة التحكم.
      اضغط على الرابط التالي لتغيير كلمة المرور:
      https://your-domain.com/admin/reset-password?token=${resetToken}
      
      هذا الرابط صالح لمدة ساعة واحدة فقط.`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطأ إرسال الإيميل:", error);
    return NextResponse.json({ error: 'فشل إرسال الإيميل' }, { status: 500 });
  }
}