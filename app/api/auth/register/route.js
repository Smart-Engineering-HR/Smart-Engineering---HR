import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// إعداد الـ Transporter لإرسال الإيميلات
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password-here'
  }
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, token, action, newUser } = body;

    // 1. منطق الترحيب (الإضافة الجديدة) - يُستدعى إذا تم تمرير بيانات newUser
    if (newUser && newUser.email) {
      await transporter.sendMail({
        to: newUser.email,
        subject: "أهلاً بك في منصة الهندسة الذكية",
        html: `<h1>مرحباً ${newUser.name}</h1>
               <p>تم تسجيل حسابك بنجاح. بياناتك:</p>
               <ul><li>البريد: ${newUser.email}</li></ul>`
      });
    }

    // 2. منطق توليد الـ Token (إعادة التعيين)
    if (action === 'request') {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 90 * 60000); // 90 دقيقة بالضبط

      await prisma.user.update({
        where: { email },
        data: { 
          resetToken: resetToken, 
          tokenExpiry: expiry 
        }
      });
      
      return NextResponse.json({ message: "تم إنشاء طلب إعادة التعيين", token: resetToken });
    }

    // 3. منطق التحقق والتحديث
    if (action === 'verify') {
      const user = await prisma.user.findFirst({ 
        where: { resetToken: token } 
      });

      if (!user || new Date() > new Date(user.tokenExpiry)) {
        return NextResponse.json(
          { error: "الرابط منتهي الصلاحية أو غير صالح" }, 
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          password: password, 
          resetToken: null, 
          tokenExpiry: null 
        }
      });

      return NextResponse.json({ message: "تم تحديث كلمة المرور بنجاح" });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });

  } catch (error) {
    console.error("خطأ في معالجة الطلب:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم" }, 
      { status: 500 }
    );
  }
}