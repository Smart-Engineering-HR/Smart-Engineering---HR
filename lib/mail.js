import nodemailer from 'nodemailer';

// إعداد السيرفر (استخدم بيانات Proton عبر Bridge أو SMTP خارجي)
const transporter = nodemailer.createTransport({
  service: 'gmail', // أو SMTP الخاص بـ Tuta/Proton
  auth: {
    user: 'your-email@gmail.com', 
    pass: 'your-app-password',
  },
});

export const sendAdminNotification = async (adDetails) => {
  const mailOptions = {
    from: '"Smart Engineering" <system@smart-eng.com>',
    to: 'Smart.Engineering.Global@proton.me, smart.engineering.global@tuta.io',
    subject: `إعلان جديد: ${adDetails.title}`,
    html: `<h3>تم استلام إعلان جديد على المنصة</h3>
           <p><b>العنوان:</b> ${adDetails.title}</p>
           <p><b>الجهة:</b> ${adDetails.company}</p>
           <p><b>النوع:</b> ${adDetails.type}</p>
           <hr>
           <p>راجع لوحة التحكم للموافقة.</p>`
  };
  return transporter.sendMail(mailOptions);
};