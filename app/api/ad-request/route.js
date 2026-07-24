import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const body = await req.json();
  const transporter = nodemailer.createTransport({ /* SMTP config */ });
  const targets = ["Smart.Engineering.Global@proton.me", "smart.engineering.global@tuta.io", "smartengineering.hr.global@gmail.com"];
  
  for (const email of targets) {
    await transporter.sendMail({
      to: email,
      subject: 'طلب إعلان جديد من الجمهور',
      text: `بيانات الشركة: ${body.companyName}, المسؤول: ${body.contactName}, النوع: ${body.adCategory}`
    });
  }
  return NextResponse.json({ status: "success" });
}