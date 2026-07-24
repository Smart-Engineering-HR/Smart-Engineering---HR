import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { ArrowRight, MapPin, Building2, Calendar, ShieldCheck, Mail, Globe, Layers, Coins, ExternalLink } from 'lucide-react';

const prisma = new PrismaClient();

// دالة جلب البيانات من الـ Server Component مباشرة
async function getPostData(id) {
  try {
    const post = await prisma.advertisement.findUnique({
      where: { id: String(id) }
    });
    return post;
  } catch (error) {
    console.error("Database fetch error:", error);
    return null;
  }
}

export default async function PostDetailPage({ params }) {
  const { id } = await params;
  const post = await getPostData(id);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <h2 className="text-2xl font-bold text-rose-400 mb-2">الإعلان المطلوبة غير موجود</h2>
        <p className="text-sm text-slate-400 mb-6">قد يكون الإعلان قد انتهت صلاحيته أو تم نقله بواسطة إدارة الموقع.</p>
        <Link href="/jobs-tenders" className="bg-amber-500 text-slate-950 px-6 py-2 rounded-lg font-bold hover:bg-amber-400 transition">العودة لبوابة التوظيف</Link>
      </div>
    );
  }

  const isJob = post.type === 'وظيفة' || post.type === 'job';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-900 pb-20" dir="rtl">
      
      {/* هيدر تصفح سريع داخل صفحة التفاصيل */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-4 lg:px-8 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/jobs-tenders" className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition">
            <ArrowRight className="w-4 h-4" /> العودة لبوابة التوظيف والمناقصات الرئيسية
          </Link>
          <span className="text-xs text-slate-500 font-mono">ID: {post.id}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* العناوين الرئيسية العريضة بأعلى الصفحة لضمان المظهر الإبداعي */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-4 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">{isJob ? 'مستند وظيفة شاغرة' : 'وثيقة مناقصة عامة'}</span>
          
          {/* 1. المسمى الوظيفي أو عنوان المناقصة بخط عريض بتنسيق مناسب أعلى الصفحة */}
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4 text-slate-500" /> {post.company}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-500" /> {post.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-500" /> تاريخ الإدراج: {new Date(post.createdAt).toLocaleDateString('ar-YE')}</span>
          </div>
        </div>

        {/* كتل الحقول المرتبة رأسياً بدقة متناهية - حقل تحت الآخر بالترتيب الصارم */}
        <div className="space-y-6">
          
          {isJob ? (
            /* ================================================== */
            /* A. حقول وتفاصيل الـوظـيـفـة (حقل تحت الآخر بالتفصيل) */
            /* ================================================== */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">2. المسمى الوظيفي المعتمد</h3>
                <p className="text-sm font-bold text-white px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">{post.title}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">3. مكان العمل والتموضع الجغرافي</h3>
                <p className="text-sm text-slate-200 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">{post.location}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">4. التبعية الإدارية والمسؤول المباشر</h3>
                <p className="text-sm text-slate-200 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  يخضع هذا الشاغر لإشراف (إدارة الموارد البشرية واللجنة الفنية بالمنظمة / الشركة المعلنة).
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">5. نبذة عن جهة التوظيف والمنظمة المعنية</h3>
                <div className="text-sm text-slate-300 px-4 py-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
                  {post.company} تعتبر من الجهات الرائدة والموثقة في نطاق أعمالها والتنسيق المشترك مع قطاع التدريب والتوظيف في الهندسة الذكية & HR.
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">6. نبذة عامة عن الوظيفة وهدفها التنموي</h3>
                <div className="text-sm text-slate-300 px-4 py-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-line">
                  {post.description || "لم يتم توفير تفاصيل إضافية للوصف العام للوظيفة."}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">7. الواجبات الأساسية والمسؤوليات التشغيلية</h3>
                <div className="text-sm text-slate-300 px-4 py-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
                  * تخطيط وتنسيق المهام الإدارية والهندسية الموكلة للقسم.<br/>
                  * متابعة مؤشرات الأداء الفنية وضمان الالتزام بمعايير الجودة والاستدامة.<br/>
                  * رفع التقارير الدورية للإدارات العليا ولجان المتابعة المشتركة.
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">8. المؤهلات التعليمية والمتطلبات الميدانية</h3>
                <div className="text-sm text-slate-300 px-4 py-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
                  * درجة بكالوريوس أو ما يعادلها في التخصص المطلوبة والملائم للوظيفة.<br/>
                  * خبرة مهنية موثقة لا تقل عن المدة الزمنية المحددة في لوائح التقديم.
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">9. المهارات الشخصية والكفاءات التقنية</h3>
                <div className="text-sm text-slate-300 px-4 py-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
                  * إجادة حزمة البرامج الهندسية والتقنية وإدارة البيانات ذات الصلة.<br/>
                  * مهارات تواصل ممتازة والقدرة على إدارة فرق العمل وحل المشكلات الميدانية بكفاءة.
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">10. أي ملاحظات يتم أضافتها من قبل جهة التوظيف</h3>
                <p className="text-sm text-slate-400 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 italic">
                  الأولوية لأصحاب الكفاءات الموثقين بشهادات معتمدة وخبرات سابقة في بيئات العمل المتكاملة.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">11. طريقة التقديم الرسمية وقنوات الاتصال</h3>
                <div className="text-sm px-4 py-4 bg-slate-950 rounded-lg border border-slate-700 space-y-3">
                  <p className="text-slate-300">يتم التقديم المباشر على هذا الشاغر عبر إرسال السيرة الذاتية والمؤهلات إلى قنوات الاتصال الرسمية للمنصة والموقع:</p>
                  <div className="flex flex-col gap-1.5 text-xs text-amber-300 font-mono">
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> Smart.Engineering.Global@proton.me</span>
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> smart.engineering.global@tuta.io</span>
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> smartengineering.hr.global@gmail.com</span>
                  </div>
                  <div className="pt-2">
                    <a href={`mailto:Smart.Engineering.Global@proton.me?subject=Apply for ${post.title}`} className="inline-flex items-center gap-2 text-xs bg-amber-500 text-slate-950 px-4 py-2 rounded font-bold hover:bg-amber-400 transition">
                      <ExternalLink className="w-3.5 h-3.5" /> اضغط هنا للتقديم السريع عبر البريد الإلكتروني
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">12. أي ملاحظات شروط عامة إضافية للتقديم</h3>
                <p className="text-xs text-slate-500 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  يرجى التأكد من مطابقة مسمى الوظيفة في عنوان الإيميل المرسل لتفادي استبعاد الطلب من الفرز التلقائي.
                </p>
              </div>

            </div>
          ) : (
            /* ================================================== */
            /* B. حقول وتفاصيل الـمـنـاقـصـة (حقل تحت الآخر بالتفصيل) */
            /* ================================================== */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">1. إعلان المناقصة وموضوعها الرئيسي</h3>
                <div className="text-sm font-bold text-white px-4 py-3 bg-slate-950 rounded-lg border border-slate-800">
                  {post.title}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">2. بلد ومدينة ومكان تنفيذ المناقصة</h3>
                <p className="text-sm text-slate-200 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" /> {post.location || "اليمن"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">3. تاريخ الإعلان والنشر للعموم</h3>
                  <p className="text-sm text-slate-300 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                    {new Date(post.createdAt).toLocaleDateString('ar-YE')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">4. تاريخ انتهاء الإعلان والتقديم النهائي</h3>
                  <p className="text-sm text-rose-400 font-bold px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                    {post.expiryDate ? new Date(post.expiryDate).toLocaleDateString('ar-YE') : "محدد بكتلة الشروط"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">5. رقم المناقصة المعتمد بالمنظومة كود التتبع</h3>
                <p className="text-sm font-mono text-slate-300 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  SE-TENDER-2026-{post.id}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">6. اسم المشروع الاستراتيجي والمستند القانوني</h3>
                <p className="text-sm text-white px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  مشروع التطوير والتشييد البنيوي المدرج تحت مسؤولية {post.company}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">7. مكونات المناقصة وجداول كميات العطاء (BOQ)</h3>
                <div className="text-sm text-slate-300 px-4 py-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-line">
                  {post.description || "تشتمل على أعمال التوريد، التنفيذ، والتركيب الهندسي طبقاً للمواصفات الفنية المرفقة بملفات العطاء."}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">8. جهة التمويل والدعم</h3>
                  <p className="text-xs text-slate-300 px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 truncate">{post.company}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">9. عملة العطاء والتحوط</h3>
                  <p className="text-xs text-slate-300 px-3 py-2 bg-slate-950 rounded-lg border border-slate-800">الدولار الأمريكي / العملة المعتمدة</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">10. صلاحية العطاء المقدم</h3>
                  <p className="text-xs text-slate-300 px-3 py-2 bg-slate-950 rounded-lg border border-slate-800">90 يوماً من تاريخ فتح المظاريف</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">11. صلاحية ضمان العطاء البنكي</h3>
                  <p className="text-xs text-slate-300 px-3 py-2 bg-slate-950 rounded-lg border border-slate-800">120 يوماً من تاريخ الإغلاق المالي</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">12. فترة التنفيذ والجدول الزمني</h3>
                  <p className="text-xs text-slate-300 px-3 py-2 bg-slate-950 rounded-lg border border-slate-800">محددة بحسب بنود وثائق التناقص الفنية</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">13. قيمة الضمان البنكي المشروط</h3>
                  <p className="text-xs text-slate-300 px-3 py-2 bg-slate-950 rounded-lg border border-slate-800">2.5% من إجمالي قيمة العطاء المالي المقدم</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">14. موعد فتح المظاريف العلني (التأريخ / الوقت / المكان)</h3>
                <p className="text-sm text-slate-300 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  يتم فتح المظاريف في المقر الرئيسي لجهة التمويل المبينة بالوثائق بعد انتهاء فترة الإغلاق مباشرة.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">15. شروط التقديم القانونية والفنية الإلزامية</h3>
                <div className="text-sm text-slate-300 px-4 py-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
                  * امتلاك سجل تجاري وبطاقة ضريبية وتأمينية سارية المفعول.<br/>
                  * تقديم خبرات سابقة مماثلة في تنفيذ وإدارة مشاريع بذات الحجم والمكونات الهندسة.
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">16. رابط وثائق المناقصة الكاملة</h3>
                <p className="text-sm text-amber-400 font-mono px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  متاح للتحميل للموردين المسجلين والمعتمدين فقط عبر لوحة تحكم المنصة الشاملة.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">17. طريقة التقديم الرسمية وتسليم العطاءات</h3>
                <div className="text-sm px-4 py-4 bg-slate-950 rounded-lg border border-slate-700 space-y-2">
                  <p className="text-slate-300">تُسلم العطاءات والملفات الفنية والمالية مختومة وموقعة رسمياً عبر البريد المعتمد للموقع للفرز والمراجعة من الإدارة واللجان:</p>
                  <div className="flex flex-col gap-1 text-xs text-amber-300 font-mono">
                    <span>Smart.Engineering.Global@proton.me</span>
                    <span>smart.engineering.global@tuta.io</span>
                    <span>smartengineering.hr.global@gmail.com</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">18. المرفقات والمستندات الفنية الملحقة</h3>
                <p className="text-xs text-slate-400 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  الرسومات الهندسية الكاملة، كراسة الشروط العامة، النماذج المخصصة للتحليل المالي.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">19. رابط الحصول على المناقصة وشراء الكراسة</h3>
                <p className="text-xs text-slate-400 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  يتم سحب الكراسة عبر التنسيق مع لجان المشتريات والعطاءات في الجهة المعلنة.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">20. قنوات التواصل والاستفسار والطلب الفني</h3>
                <p className="text-sm text-slate-300 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  {post.contact || "يرجى الاعتماد على إيميلات الموقع للتوجيه والاستعلام والمتابعة القانونية."}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">21. أي ملاحظات عامة أو تعديلات قانونية ملحقة</h3>
                <p className="text-xs text-slate-500 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  تحتفظ اللجنة الفنية بكامل الحق في قبول أو رفض أي عطاء دون إبداء مبررات وأسباب قانونية للجهات المتقدمة.
                </p>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}