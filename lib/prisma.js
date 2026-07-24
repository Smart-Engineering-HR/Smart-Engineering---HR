import { PrismaClient } from '@prisma/client';

// استخدام globalThis المعياري (الخيار الأفضل للمشاريع الحديثة)
// مع إضافة دعم global القديم لضمان التوافق مع الكود الثاني
const globalForPrisma = globalThis;

// دمج المنطق: البحث عن النسخة الموجودة عالمياً أو إنشاء واحدة جديدة
export const prisma =
  globalForPrisma.prisma || 
  global.prisma || 
  new PrismaClient({
    log: ['query'], // ميزة المراقبة من الكود الأول
  });

// حفظ النسخة في النطاق العالمي لضمان عدم إنشاء اتصالات متعددة
// يتم الحفظ في المتغيرين لضمان التوافق التام مع أي استدعاء
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  global.prisma = prisma;
}

// تصدير افتراضي ومسمى لضمان التوافق مع كافة طرق الاستيراد
export default prisma;