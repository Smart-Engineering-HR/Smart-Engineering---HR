// البيانات الأولية للمحاكاة
export const initialJobs = [
  { id: 1, title: "مهندس مدني - إدارة مشاريع", company: "شركة الهندسة الذكية", location: "عن بُعد", type: "دوام كامل" },
  { id: 2, title: "مهندس معماري برمجيات", company: "منصة Smart Engineering", location: "موقع العمل", type: "عقد" }
];

export const initialTenders = [
  { id: 1, title: "مناقصة إنشاء مجمع سكني", authority: "وزارة الأشغال", deadline: "2026-08-01" },
  { id: 2, title: "مناقصة توريد أنظمة طاقة شمسية", authority: "مؤسسة طاقة متجددة", deadline: "2026-09-15" }
];

// دالة محاكاة الاتصال بالسيرفر
export const simulateApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000); // محاكاة تأخير لمدة ثانية واحدة
  });
};