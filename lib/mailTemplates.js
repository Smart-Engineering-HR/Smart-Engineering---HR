export const generateEmailTemplate = (userName, title, content, link, linkText) => {
  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">منصة الهندسة الذكية 🚀</h1>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #333;">مرحباً ${userName}،</h2>
        <p style="font-size: 16px; color: #555;">${content}</p>
        
        <div style="background: #f8fafc; padding: 15px; border-right: 5px solid #f59e0b; margin: 20px 0;">
           <h3 style="margin-top: 0;">${title}</h3>
        </div>

        <a href="${link}" style="display: inline-block; background-color: #f59e0b; color: #0f172a; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">
          ${linkText}
        </a>
      </div>
      
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
        <p>تم إرسال هذا الإيميل لأنك مسجل في منصة الهندسة الذكية.</p>
        <p>جميع الحقوق محفوظة &copy; 2026</p>
      </div>
    </div>
  `;
};