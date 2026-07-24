"use server"
import { engineerSchema } from "@/prisma/engineerSchema";
export async function handleEngineerSubmit(formData: FormData) {
  // 1. تجميع البيانات من النموذج
  const data = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    experienceYears: Number(formData.get("experienceYears")),
    specialization: formData.get("specialization"),
  };

  // 2. الفحص الأمني باستخدام Zod
  const result = engineerSchema.safeParse(data);

  if (!result.success) {
    // إذا فشل الفحص، نطبع الأخطاء ولا نكمل العملية
    console.log(result.error.format());
    return { error: "بيانات غير صالحة، حاول مرة أخرى" };
  }

  // 3. إذا وصل الكود هنا، فالبيانات "آمنة ونظيفة" 100%
  // هنا يمكنك حفظها في قاعدة البيانات وأنت مطمئن
  const validatedData = result.data; 
  console.log("البيانات آمنة وجاهزة للحفظ:", validatedData);
}