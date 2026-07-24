'use client';
import { useState } from 'react';

export default function AdminSettings() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/update-profile', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) alert('تم تحديث البيانات بنجاح');
    else alert('حدث خطأ أثناء التحديث');
  };

  return (
    <form onSubmit={handleUpdate} style={{ padding: '20px', direction: 'rtl' }}>
      <h1>إعدادات الحساب</h1>
      <input type="email" placeholder="الإيميل الجديد" onChange={(e) => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="كلمة المرور الجديدة" onChange={(e) => setPassword(e.target.value)} /><br/>
      <button type="submit">حفظ التغييرات</button>
    </form>
  );
}