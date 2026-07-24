export default function JobDetails({ params }) {
  // هنا ستقوم بجلب بيانات الوظيفة من قاعدة البيانات حسب الـ id
  return (
    <div className="max-w-4xl mx-auto p-8 pt-20" dir="rtl">
      <h1 className="text-4xl font-bold mb-6">المسمى الوظيفي (يظهر هنا)</h1>
      <div className="space-y-6 text-lg">
        <p><strong>المسمى الوظيفي:</strong> ...</p>
        <p><strong>مكان العمل:</strong> ...</p>
        <p><strong>التبعية الإدارية:</strong> ...</p>
        <p><strong>نبذة عن جهة التوظيف:</strong> ...</p>
        <p><strong>نبذة عن الوظيفة:</strong> ...</p>
        <p><strong>الواجبات والمسؤوليات:</strong> ...</p>
        <p><strong>المؤهلات والمتطلبات:</strong> ...</p>
        <p><strong>المهارات والكفاءات:</strong> ...</p>
        <p><strong>ملاحظات:</strong> ...</p>
        <p><strong>طريقة التقديم:</strong> ...</p>
        <p><strong>ملاحظات إضافية:</strong> ...</p>
      </div>
    </div>
  );
}