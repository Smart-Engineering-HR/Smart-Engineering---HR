import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { email, password, token, action } = await req.json();

    // 1. منطق توليد الـ Token (يُستخدم عند طلب إعادة التعيين)
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

    // 2. منطق التحقق والتحديث (يُستخدم عند إدخال كلمة المرور الجديدة)
    if (action === 'verify') {
      const user = await prisma.user.findFirst({ 
        where: { resetToken: token } 
      });

      // التحقق من وجود المستخدم وصلاحية الـ Token (شرط الـ 90 دقيقة)
      if (!user || new Date() > new Date(user.tokenExpiry)) {
        return NextResponse.json(
          { error: "الرابط منتهي الصلاحية أو غير صالح" }, 
          { status: 400 }
        );
      }

      // تحديث كلمة المرور الجديدة وإلغاء الـ Token
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

  } catch (error) {
    console.error("خطأ في إعادة تعيين كلمة المرور:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم" }, 
      { status: 500 }
    );
  }
}