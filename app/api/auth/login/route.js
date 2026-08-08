import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. التحقق من وجود المستخدم في قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير مسجل في المنصة" }, 
        { status: 404 }
      );
    }

    // 2. مقارنة كلمة المرور المدخلة مع الكلمة المشفرة في Supabase
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "كلمة المرور غير صحيحة" }, 
        { status: 401 }
      );
    }

    // 3. في حال النجاح، نُرجع بيانات المستخدم الأساسية (بدون الباسورد)
    // ملاحظة: في بيئة الإنتاج المتقدمة يتم توليد JWT Token هنا
    return NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء تسجيل الدخول" }, 
      { status: 500 }
    );
  }
}