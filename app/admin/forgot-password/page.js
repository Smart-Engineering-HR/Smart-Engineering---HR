'use client';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (res.ok) alert('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '50px' }}>
      <h1>استعادة الوصول للوحة التحكم</h1>
      <input type="email" placeholder="أدخل إيميل الإدارة" onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">إرسال رابط الاستعادة</button>
    </form>
  );
}