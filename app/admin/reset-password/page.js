'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// المكون الفرعي الذي يحتوي على الكود الأصلي للصفحة واستدعاء useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="reset-password-container">
      <h1>إعادة تعيين كلمة المرور</h1>
      {/* باقي كود النموذج الخاص بك */}
    </div>
  );
}

// المكون الرئيسي الذي يصدره Next.js مغلفاً بـ Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">جاري التحميل...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}