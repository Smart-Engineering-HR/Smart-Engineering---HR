import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email } = await req.json();
  const token = Math.random().toString(36); // إنشاء توكن
  const expiry = new Date(Date.now() + 90 * 60000); // 90 دقيقة من الآن

  // 1. احفظ الـ token والـ expiry في قاعدة البيانات للمستخدم
  // 2. أرسل إيميل يحتوي على الرابط: /reset-password?token=...
  
  return NextResponse.json({ message: "تم إرسال رابط إعادة التعيين" });
}