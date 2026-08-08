import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs'; // 1. استدعاء مكتبة التشفير (إضافة جديدة)

// إعداد Transporter لإرسال البريد الإلكتروني
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, adminKey, action, token } = body;

    // -------------------------------------------------------------
    // 1. منطق إنشاء حساب جديد (Registration)
    // -------------------------------------------------------------
    if (!action || action === 'register') {
      
      // إذا اختار المستخدم التسجيل كـ Admin، يتم التحقق من مفتاح الإدارة
      if (role === 'admin') {
        const validAdminKey = process.env.ADMIN_SECRET_KEY || 'SmartAdmin2026HA&EL&FA&TA&OM2026';
        if (adminKey !== validAdminKey) {
          return NextResponse.json(
            { error: "مفتاح صلاحية الإدارة غير صحيح" },
            { status: 400 }
          );
        }
      }

      // التحقق مما إذا كان البريد مسجلاً مسبقاً
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "البريد الإلكتروني مسجل بالفعل" },
          { status: 400 }
        );
      }

      // 2. تشفير كلمة المرور قبل حفظها في قاعدة البيانات (إضافة جديدة)
      // الرقم 10 يمثل (Salt Rounds) وهو معيار ممتاز للأمان والسرعة
      const hashedPassword = await bcrypt.hash(password, 10);

      // إنشاء الحساب في قاعدة البيانات عبر Prisma
      const user = await prisma.user.create({
        data: {
          name: name || 'مهندس جديد',
          email,
          password: hashedPassword, // 3. تمرير كلمة المرور المشفرة بدلاً من النص العادي
          role: role || 'user'
        }
      });

      // إرسال بريد ترحيبي
      try {
        await transporter.sendMail({
          to: email,
          subject: "أهلاً بك في منصة الهندسة الذكية",
          html: `<h1>مرحباً ${user.name}</h1>
                 <p>تم تسجيل حسابك بنجاح في المنصة بصلاحية: <strong>${user.role}</strong>.</p>`
        });
      } catch (mailError) {
        console.error("فشل إرسال بريد الترحيب:", mailError);
      }

      return NextResponse.json({
        message: "تم تسجيل الحساب بنجاح",
        user: { id: user.id, email: user.email, role: user.role }
      });
    }

    // -------------------------------------------------------------
    // 2. طلب إعادة تعيين كلمة المرور (Reset Request)
    // -------------------------------------------------------------
    if (action === 'request') {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 90 * 60000); // 90 دقيقة

      await prisma.user.update({
        where: { email },
        data: { 
          resetToken: resetToken, 
          resetTokenExpiry: expiry 
        }
      });
      
      return NextResponse.json({ message: "تم إنشاء طلب إعادة التعيين", token: resetToken });
    }

    // -------------------------------------------------------------
    // 3. التحقق وتحديث كلمة المرور (Verify Reset)
    // -------------------------------------------------------------
    if (action === 'verify') {
      const user = await prisma.user.findFirst({ 
        where: { resetToken: token } 
      });

      if (!user || !user.resetTokenExpiry || new Date() > new Date(user.resetTokenExpiry)) {
        return NextResponse.json(
          { error: "الرابط منتهي الصلاحية أو غير صالح" }, 
          { status: 400 }
        );
      }

      // 4. تشفير كلمة المرور الجديدة عند إعادة التعيين (إضافة جديدة)
      const hashedNewPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          password: hashedNewPassword, // تمرير الكلمة الجديدة المشفرة
          resetToken: null, 
          resetTokenExpiry: null 
        }
      });

      return NextResponse.json({ message: "تم تحديث كلمة المرور بنجاح" });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });

  } catch (error) {
    console.error("خطأ في معالجة الطلب:", error);
    return NextResponse.json(
      { error: `حدث خطأ داخلي في الخادم: ${error.message}` }, 
      { status: 500 }
    );
  }
}