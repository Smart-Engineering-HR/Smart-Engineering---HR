"use client";
import React, { useState, useEffect } from "react";
export const revalidate = 0;
export default function TrainingPublicPage() {
  const [activeTab, setActiveTab] = useState("tracks");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState("");

  // State للبيانات القادمة من لوحة التحكم
  const [data, setData] = useState({
    proCourses: [],
    pythonCourses: [],
    mgmtCourses: [],
    scholarships: [],
    codes: [],
    books: [],
    webinars: [],
    certificates: []
  });

  // نموذج طلب التقديم
  const [applyForm, setApplyForm] = useState({
    fullNameAr: "", fullNameEn: "", birthDate: "", nationality: "", residence: "",
    email: "", phone: "", lastDegree: "", gpa: "", institute: "", graduationYear: "",
    currentSpecialty: "", targetDegree: "", targetSpecialty1: "", targetSpecialty2: "",
    langLevel: "none", passportFile: null, certificatesFile: null, sopFile: null,
    cvFile: null, recFile: null, langFile: null, personalPhoto: null
  });

  // جلب البيانات ومزامنتها فوراً
  useEffect(() => {
    const loadData = () => {
      const stored = localStorage.getItem("smart_academy_data");
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        // بيانات تجريبية أولية احترافية في حال عدم وجود بيانات مخزنة
        const initialData = {
          proCourses: [{ id: 1, title: "دورة التصميم الإنشائي للمباني العالية", trainer: "د. أحمد المهندس", duration: "60 ساعة", certificate: "شهادة معتمدة دولياً", requirements: "معرفة بأساسيات التحليل الإنشائي", bio: "خبير منشآت عملاقة بخبرة 20 عاماً" }],
          pythonCourses: [{ id: 1, title: "الأتمتة الإنشائية بواسطة Python & ETABS API", trainer: "م. هاشم ذكي", duration: "45 ساعة", whyPython: "توفير 90% من وقت التصميم وتفادي الأخطاء البشرية", learningOutcomes: "كتابة سكريبتات لتوليد الأحمال وفحص القطاعات", targetAudience: "المهندسون الإنشائيون ومطورو البرمجيات الهندسية", tips: "يجب مراجعة أساسيات مصفوفات الجساءة قبل البدء" }],
          mgmtCourses: [{ id: 1, title: "إدارة العقود الهندسية والمكتب الفني الـ FIDIC", trainer: "م. مستشار إدارة", duration: "40 ساعة", axes: "المطالبات المالية، أوامر التغيير، تحليل الأسعار", importance: "حاسمة لحماية المشروع مالياً وقانونياً", tips: "قراءة كتاب عقد الفيديك الأحمر قبل بداية الدورة" }],
          scholarships: [{ id: 1, title: "منحة الهندسة المتقدمة للباحثين", provider: "منصة الهندسة الذكية العالمية", country: "ألمانيا / عن بعد", degrees: "ماجستير ودكتوراه", fundType: "كاملة", tuition: "إعفاء كامل 100%", salary: "1500 يورو شهرياً", housing: "مؤمن بالكامل", flights: "تذكرة سنوية ذهاب وإياب", health: "تأمين صحي شامل", visa: "مغطاة بالكامل مع السنة التحضيرية", nationalities: "جميع الجنسيات العربية والأجنبية", age: "الماجستير دون 30، الدكتوراه دون 35", gpa: "لا يقل عن 3.5 / 4.0 أو 85%", langReq: "IELTS 6.5 أو شهادة دراسة باللغة الإنجليزية", specialties: "الهندسة المدنية، الميكانيكية، الذكاء الاصطناعي الهندي", docCertificates: "مطلوبة ومصدقة", docId: "جواز سفر ساري المفعول", docCv: "سيرة ذاتية احترافية محدثة", docMotiv: "خطاب دافع قوي ومفصل", docRec: "عدد 3 خطابات توصية أكاديمية", docResearch: "مخطط بحثي متكامل (للدكتوراه)", docMedical: "شهادة فحص طبي خالي من الأمراض", dateOpen: "2026-06-01", dateClose: "2026-09-01 (توقيت مكة المكرمة)", dateResults: "2026-10-15", dateStart: "خريف 2026", linkDirect: "https://portal.smartengineering.edu", linkOfficial: "https://smartengineering.edu/scholarship", applicationFee: "مجاني بالكامل" }],
          codes: [{ id: 1, name: "American Concrete Institute Code", number: "ACI 318-19", region: "International / USA" }],
          books: [{ id: 1, title: "Reinforced Concrete Design: A Practical Approach", author: "Dr. Structural Guru", edition: "الطباعة الخامسة - الفصل الدراسي الأول" }],
          webinars: [{ id: 1, title: "مستقبل الهندسة الذكية وتطبيقات الذكاء الاصطناعي", organizer: "الجمعية العالمية للهندسة الذكية", date: "2026-07-12", hours: "3 ساعات معتمدة", speaker: "بروفيسور عالمي", summary: "مناقشة دمج نماذج التنبؤ العميق في فحص المنشآت وتوليد التصاميم تلقائياً" }],
          certificates: [{ id: 1, title: "مخطط إدارة مشاريع محترف معتمد PMP", provider: "PMI", certNumber: "PMP-882910", dateGet: "2025-05-10", dateEnd: "2028-05-10", verifyLink: "https://pmi.org/verify" }]
        };
        localStorage.setItem("smart_academy_data", JSON.stringify(initialData));
        setData(initialData);
      }
    };

    loadData();
    window.addEventListener("storage", loadData); // تحديث فوري إذا تم التغيير من تبويب آخر
    const interval = setInterval(loadData, 1000); // تحديث دوري كل ثانية لضمان التزامن الفوري
    return () => {
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
    };
  }, []);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    
    // محاكاة إرسال البيانات للإيميلات المحددة بالطلب
    const emails = ["Smart.Engineering.Global@proton.me", "smart.engineering.global@tuta.io", "smartengineering.hr.global@gmail.com"];
    
    // حفظ الطلب في لوحة التحكم (localStorage) لليشاهدها الأدمن
    const existingApplications = JSON.parse(localStorage.getItem("smart_applications") || "[]");
    const newApplication = {
      id: Date.now(),
      scholarshipTitle: selectedScholarship,
      ...applyForm,
      dateSubmitted: new Date().toLocaleString()
    };
    existingApplications.push(newApplication);
    localStorage.setItem("smart_applications", JSON.stringify(existingApplications));

    alert(`تم إرسال ملف تقديمك بنجاح واحترافية عالية لتم مراجعته وفحصه.\nسيتم توجيه البيانات وتأكيدها عبر بريد المنصة:\n${emails.join("\n")}`);
    
    setShowApplyModal(false);
    setApplyForm({
      fullNameAr: "", fullNameEn: "", birthDate: "", nationality: "", residence: "",
      email: "", phone: "", lastDegree: "", gpa: "", institute: "", graduationYear: "",
      currentSpecialty: "", targetDegree: "", targetSpecialty1: "", targetSpecialty2: "",
      langLevel: "none", passportFile: null, certificatesFile: null, sopFile: null,
      cvFile: null, recFile: null, langFile: null, personalPhoto: null
    });
  };

  return (
    <div style={styles.container}>
      {/* هيدر التنقل الأفقي المحترف */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <span style={styles.logoText}>منصة الهندسة الذكية | Smart Engineering</span>
        </div>
        <nav style={styles.navBar}>
          <button style={activeTab === "tracks" ? styles.activeNavBtn : styles.navBtn} onClick={() => { setActiveTab("tracks"); setSelectedItem(null); }}>المسارات التعليمية</button>
          <button style={activeTab === "sources" ? styles.activeNavBtn : styles.navBtn} onClick={() => { setActiveTab("sources"); setSelectedItem(null); }}>المصادر الأكاديمية</button>
          <button style={activeTab === "dev" ? styles.activeNavBtn : styles.navBtn} onClick={() => { setActiveTab("dev"); setSelectedItem(null); }}>التطوير المهني المتقدم</button>
        </nav>
        <button style={styles.backBtn} onClick={() => window.location.href = "/"}>العودة للرئيسية ↩</button>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={styles.mainContent}>
        
        {/* 1. المسارات التعليمية */}
        {activeTab === "tracks" && !selectedItem && (
          <div>
            <h2 style={styles.sectionTitle}>المسارات التعليمية الاحترافية</h2>
            
            <h3 style={styles.subSectionTitle}>🔹 دورات البرامج الهندسية الاحترافية</h3>
            <div style={styles.grid}>
              {data.proCourses.map(course => (
                <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "pro", data: course})}>
                  <h4>{course.title}</h4>
                  <p><strong>المدرب:</strong> {course.trainer}</p>
                  <p><strong>المدة:</strong> {course.duration}</p>
                  <span style={styles.moreLabel}>اضغط للتفاصيل الاستراتيجية...</span>
                </div>
              ))}
            </div>

            <h3 style={styles.subSectionTitle}>🔹 دورات التصميم الإنشائي باستخدام Python</h3>
            <div style={styles.grid}>
              {data.pythonCourses.map(course => (
                <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "python", data: course})}>
                  <h4>{course.title}</h4>
                  <p><strong>المدرب:</strong> {course.trainer}</p>
                  <p><strong>المدة:</strong> {course.duration}</p>
                  <span style={styles.moreLabel}>اضغط للتفاصيل الاستراتيجية...</span>
                </div>
              ))}
            </div>

            <h3 style={styles.subSectionTitle}>🔹 الإدارة الهندسية والمكتب الفني</h3>
            <div style={styles.grid}>
              {data.mgmtCourses.map(course => (
                <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "mgmt", data: course})}>
                  <h4>{course.title}</h4>
                  <p><strong>المدرب:</strong> {course.trainer}</p>
                  <p><strong>المدة:</strong> {course.duration}</p>
                  <span style={styles.moreLabel}>اضغط للتفاصيل الاستراتيجية...</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. المصادر الأكاديمية */}
        {activeTab === "sources" && !selectedItem && (
          <div>
            <h2 style={styles.sectionTitle}>المصادر الأكاديمية (المنح، الأكواد، الكتب)</h2>
            
            <h3 style={styles.subSectionTitle}>🎓 المنح الدراسية والبحثية المتاحة</h3>
            <div style={styles.grid}>
              {data.scholarships.map(sch => (
                <div key={sch.id} style={styles.card} onClick={() => setSelectedItem({type: "scholarship", data: sch})}>
                  <h4>{sch.title}</h4>
                  <p><strong>الدولة المستضيفة:</strong> {sch.country}</p>
                  <p><strong>المراحل المستهدفة:</strong> {sch.degrees}</p>
                  <span style={styles.moreLabel}>عرض ملف المنحة المتكامل...</span>
                </div>
              ))}
            </div>

            <h3 style={styles.subSectionTitle}>📚 الأكواد الهندسية القياسية (Engineering Codes)</h3>
            <div style={styles.grid}>
              {data.codes.map(code => (
                <div key={code.id} style={styles.staticCard}>
                  <h4>{code.name}</h4>
                  <p><strong>الرقم والإصدار:</strong> {code.number}</p>
                  <p><strong>النسخة الإقليمية/المحلية:</strong> {code.region}</p>
                </div>
              ))}
            </div>

            <h3 style={styles.subSectionTitle}>📖 الكتب والمراجع العلمية</h3>
            <div style={styles.grid}>
              {data.books.map(book => (
                <div key={book.id} style={styles.staticCard}>
                  <h4>{book.title}</h4>
                  <p><strong>المؤلف:</strong> {book.author}</p>
                  <p><strong>الطبعة والفصل الدراسي:</strong> {book.edition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. التطوير المهني المتقدم */}
        {activeTab === "dev" && !selectedItem && (
          <div>
            <h2 style={styles.sectionTitle}>التطوير المهني المتقدم والشهادات</h2>
            
            <h3 style={styles.subSectionTitle}>🌐 الندوات الهندسية عبر الإنترنت (Webinars)</h3>
            <div style={styles.grid}>
              {data.webinars.map(web => (
                <div key={web.id} style={styles.staticCard}>
                  <h4>{web.title}</h4>
                  <p><strong>الجهة المنظمة:</strong> {web.organizer}</p>
                  <p><strong>التاريخ:</strong> {web.date}</p>
                  <p><strong>الساعات المكتسبة:</strong> {web.hours}</p>
                  <p><strong>المتحدث الخبير:</strong> {web.speaker}</p>
                  <p><strong>الملخص والهدف:</strong> {web.summary}</p>
                </div>
              ))}
            </div>

            <h3 style={styles.subSectionTitle}>🏅 الشهادات المهنية المعتمدة</h3>
            <div style={styles.grid}>
              {data.certificates.map(cert => (
                <div key={cert.id} style={styles.staticCard}>
                  <h4>{cert.title}</h4>
                  <p><strong>الجهة المانحة:</strong> {cert.provider}</p>
                  <p><strong>رقم الاعتماد:</strong> {cert.certNumber}</p>
                  <p><strong>تاريخ الحصول والانتهاء:</strong> {cert.dateGet} إلى {cert.dateEnd}</p>
                  <a href={cert.verifyLink} target="_blank" rel="noreferrer" style={styles.link}>رابط التحقق الرسمي</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* صفحة داخلية عند الضغط على بطاقة معينة */}
        {selectedItem && (
          <div style={styles.detailsView}>
            <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>❌ إغلاق والعودة للقائمة</button>
            <div style={styles.detailsBody}>
              
              {selectedItem.type === "pro" && (
                <>
                  <h2>{selectedItem.data.title}</h2>
                  <p><strong>اسم المدرب الخبير:</strong> {selectedItem.data.trainer}</p>
                  <p><strong>مدة الدورة:</strong> {selectedItem.data.duration}</p>
                  <p><strong>نوع الشهادة والاعتماد:</strong> {selectedItem.data.certificate}</p>
                  <p><strong>متطلبات الدورة المسبقة:</strong> {selectedItem.data.requirements}</p>
                  <p><strong>هوية المدرب ومعلومات عنه:</strong> {selectedItem.data.bio}</p>
                </>
              )}

              {selectedItem.type === "python" && (
                <>
                  <h2>{selectedItem.data.title}</h2>
                  <p><strong>اسم المدرب الخبير:</strong> {selectedItem.data.trainer}</p>
                  <p><strong>مدة الدورة:</strong> {selectedItem.data.duration}</p>
                  <p><strong>لماذا بايثون بالذات في الهندسة الإنشائية؟ (الأهمية):</strong> {selectedItem.data.whyPython}</p>
                  <p><strong>ماذا ستتعلم في هذه الدورات؟ (المحتوى المتوقع):</strong> {selectedItem.data.learningOutcomes}</p>
                  <p><strong>لمن تفيد هذه الدورات؟:</strong> {selectedItem.data.targetAudience}</p>
                  <p><strong>نصائح مهمة قبل أن تبدأ:</strong> {selectedItem.data.tips}</p>
                </>
              )}

              {selectedItem.type === "mgmt" && (
                <>
                  <h2>{selectedItem.data.title}</h2>
                  <p><strong>اسم المدرب الخبير:</strong> {selectedItem.data.trainer}</p>
                  <p><strong>مدة الدورة:</strong> {selectedItem.data.duration}</p>
                  <p><strong>أهم المحاور والمعلومات في هذه الدورات:</strong> {selectedItem.data.axes}</p>
                  <p><strong>أهمية هذه الدورات (لماذا هي حاسمة لمستقبلك؟):</strong> {selectedItem.data.importance}</p>
                  <p><strong>نصيحة جليلة للبدء:</strong> {selectedItem.data.tips}</p>
                </>
              )}

              {selectedItem.type === "scholarship" && (
                <>
                  <h2 style={{color: "#00e6ff"}}>{selectedItem.data.title}</h2>
                  
                  <h3 style={styles.subSectionTitle}>1. المعلومات الأساسية للمنحة</h3>
                  <p><strong>الاسم الرسمي:</strong> {selectedItem.data.title}</p>
                  <p><strong>الجهة المانحة:</strong> {selectedItem.data.provider}</p>
                  <p><strong>الدولة المستضيفة:</strong> {selectedItem.data.country}</p>
                  <p><strong>المراحل الدراسية المستهدفة:</strong> {selectedItem.data.degrees}</p>

                  <h3 style={styles.subSectionTitle}>2. التمويل والمزايا المالية</h3>
                  <p><strong>نوع التمويل:</strong> {selectedItem.data.fundType}</p>
                  <p><strong>الرسوم الدراسية:</strong> {selectedItem.data.tuition}</p>
                  <p><strong>الراتب الشهري:</strong> {selectedItem.data.salary}</p>
                  <p><strong>السكن الجامعي:</strong> {selectedItem.data.housing}</p>
                  <p><strong>تذاكر الطيران:</strong> {selectedItem.data.flights}</p>
                  <p><strong>التأمين الصحي الشامل:</strong> {selectedItem.data.health}</p>
                  <p><strong>الفيزا والسنة التحضيرية للغة:</strong> {selectedItem.data.visa}</p>

                  <h3 style={styles.subSectionTitle}>3. شروط الأهلية والقبول</h3>
                  <p><strong>الجنسيات المؤهلة:</strong> {selectedItem.data.nationalities}</p>
                  <p><strong>السن المطلوب:</strong> {selectedItem.data.age}</p>
                  <p><strong>المعدل الأكاديمي الأدنى:</strong> {selectedItem.data.gpa}</p>
                  <p><strong>شرط اللغة والشهادات:</strong> {selectedItem.data.langReq}</p>
                  <p><strong>التخصصات المتاحة:</strong> {selectedItem.data.specialties}</p>

                  <h3 style={styles.subSectionTitle}>4. الوثائق والمستندات المطلوبة (ملف التقديم)</h3>
                  <p><strong>الشهادات الأكاديمية وكشوف الدرجات:</strong> {selectedItem.data.docCertificates}</p>
                  <p><strong>إثبات الشخصية / جواز السفر:</strong> {selectedItem.data.docId}</p>
                  <p><strong>السيرة الذاتية (CV):</strong> {selectedItem.data.docCv}</p>
                  <p><strong>خطاب الدافع (Motivation Letter):</strong> {selectedItem.data.docMotiv}</p>
                  <p><strong>خطابات التوصية (Recommendation Letters):</strong> {selectedItem.data.docRec}</p>
                  <p><strong>المخطط البحثي (Research Proposal):</strong> {selectedItem.data.docResearch}</p>
                  <p><strong>شهادة الفحص الطبي:</strong> {selectedItem.data.docMedical}</p>

                  <h3 style={styles.subSectionTitle}>5. مواعيد التقديم والجدول الزمني</h3>
                  <p><strong>تاريخ فتح باب التتقديم:</strong> {selectedItem.data.dateOpen}</p>
                  <p><strong>تاريخ إغلاق التقديم (Deadline):</strong> {selectedItem.data.dateClose}</p>
                  <p><strong>موعد إعلان النتائج:</strong> {selectedItem.data.dateResults}</p>
                  <p><strong>موعد بدء الدراسة للفصل المستهدف:</strong> {selectedItem.data.dateStart}</p>

                  <h3 style={styles.subSectionTitle}>6. طريقة التتقديم والروابط الرسمية</h3>
                  <p><strong>رابط التقديم المباشر:</strong> <a href={selectedItem.data.linkDirect} target="_blank" rel="noreferrer" style={styles.link}>{selectedItem.data.linkDirect}</a></p>
                  <p><strong>رابط الإعلان الرسمي:</strong> <a href={selectedItem.data.linkOfficial} target="_blank" rel="noreferrer" style={styles.link}>{selectedItem.data.linkOfficial}</a></p>
                  <p><strong>رسوم التتقديم على الموقع:</strong> {selectedItem.data.applicationFee}</p>

                  <hr style={{margin: "20px 0", borderColor: "#00e6ff"}}/>
                  {/* زر التقديم من خلال المنصة */}
                  <div style={{textAlign: "center"}}>
                    <button style={styles.globalApplyBtn} onClick={() => { setSelectedScholarship(selectedItem.data.title); setShowApplyModal(true); }}>⚡ زر التقديم من خلالنا (خدمة احترافية)</button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

      </main>

      {/* مودال التقديم من خلالنا الاحترافي */}
      {showApplyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3>تقديم احترافي عبر منصة الهندسة الذكية</h3>
              <button style={styles.miniCloseBtn} onClick={() => setShowApplyModal(false)}>❌</button>
            </div>
            <p style={{color: "#FFD700", textAlign: "center", fontWeight: "bold"}}>نحن نقدم لكم بطريقة احترافية متكاملة تضمن قبول ملفكم المكتمل فتربص بفرصتك!</p>
            <p style={{color: "#00ffcc", textAlign: "center", fontSize: "14px"}}>رسوم الخدمة: 150$ تشمل مراجعة وتنسيق الملفات وصياغة الخطابات هندسياً</p>
            
            <form onSubmit={handleApplySubmit} style={styles.form}>
              <h4 style={styles.formGroupTitle}>1. البيانات الشخصية</h4>
              <input type="text" placeholder="الاسم الكامل بالعربية (كما في جواز السفر)" required value={applyForm.fullNameAr} onChange={e => setApplyForm({...applyForm, fullNameAr: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="Full Name in English (as in Passport)" required value={applyForm.fullNameEn} onChange={e => setApplyForm({...applyForm, fullNameEn: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="تاريخ الميلاد والمنشأ (يوم/شهر/سنة)" required value={applyForm.birthDate} onChange={e => setApplyForm({...applyForm, birthDate: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="الجنسية الحالية" required value={applyForm.nationality} onChange={e => setApplyForm({...applyForm, nationality: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="بلد الإقامة الحالي" required value={applyForm.residence} onChange={e => setApplyForm({...applyForm, residence: e.target.value})} style={styles.input}/>
              <input type="email" placeholder="البريد الإلكتروني" required value={applyForm.email} onChange={e => setApplyForm({...applyForm, email: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="رقم الهاتف (مع رمز الدولة)" required value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} style={styles.input}/>

              <h4 style={styles.formGroupTitle}>2. الخلفية الأكاديمية (Academic Background)</h4>
              <input type="text" placeholder="آخر مؤهل علمي (ثانوية عامة، بكالوريوس، ماجستير)" required value={applyForm.lastDegree} onChange={e => setApplyForm({...applyForm, lastDegree: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="المعدل التراكمي ونظام العلامات (مثال: 3.8/4.0)" required value={applyForm.gpa} onChange={e => setApplyForm({...applyForm, gpa: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="اسم المؤسسة التعليمية السابقة وسنة التخرج" required value={applyForm.institute} onChange={e => setApplyForm({...applyForm, institute: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="التخصص الحالي / السابق دقيقاً" required value={applyForm.currentSpecialty} onChange={e => setApplyForm({...applyForm, currentSpecialty: e.target.value})} style={styles.input}/>

              <h4 style={styles.formGroupTitle}>3. تفاصيل التقديم والمنحة المستهدفة</h4>
              <input type="text" readOnly value={`المنحة المختارة: ${selectedScholarship}`} style={{...styles.input, background: "#222", color: "#FFD700"}}/>
              <input type="text" placeholder="الدرجة العلمية المستهدفة (بكالوريوس، ماجستير، دكتوراه)" required value={applyForm.targetDegree} onChange={e => setApplyForm({...applyForm, targetDegree: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="التخصص المرغوب دراسته (خيار أول)" required value={applyForm.targetSpecialty1} onChange={e => setApplyForm({...applyForm, targetSpecialty1: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="التخصص المرغوب دراسته (خيار ثاني)" required value={applyForm.targetSpecialty2} onChange={e => setApplyForm({...applyForm, targetSpecialty2: e.target.value})} style={styles.input}/>
              
              <label style={{color: "#fff", display: "block", marginTop: "10px"}}>مستوى إتقان اللغة الإنجليزية:</label>
              <select value={applyForm.langLevel} onChange={e => setApplyForm({...applyForm, langLevel: e.target.value})} style={styles.select}>
                <option value="none">بدون اختبار (لم يتم التقدم لاختبار)</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
              </select>

              <h4 style={styles.formGroupTitle}>4. الملفات والمستندات المطلوب إرفاقها (صيغة PDF و الصور)</h4>
              <label style={styles.fileLabel}>نسخة من جواز السفر (PDF): <input type="file" accept=".pdf" required onChange={e => setApplyForm({...applyForm, passportFile: e.target.files[0]})} style={styles.fileInput}/></label>
              <label style={styles.fileLabel}>الشهادات الأكاديمية وكشوفات الدرجات (PDF): <input type="file" accept=".pdf" required onChange={e => setApplyForm({...applyForm, certificatesFile: e.target.files[0]})} style={styles.fileInput}/></label>
              <label style={styles.fileLabel}>بيان الغرض من الدراسة SOP (PDF): <input type="file" accept=".pdf" required onChange={e => setApplyForm({...applyForm, sopFile: e.target.files[0]})} style={styles.fileInput}/></label>
              <label style={styles.fileLabel}>السيرة الذاتية المحدثة CV (PDF): <input type="file" accept=".pdf" required onChange={e => setApplyForm({...applyForm, cvFile: e.target.files[0]})} style={styles.fileInput}/></label>
              <label style={styles.fileLabel}>رسائل التوصية المجمعة (PDF): <input type="file" accept=".pdf" required onChange={e => setApplyForm({...applyForm, recFile: e.target.files[0]})} style={styles.fileInput}/></label>
              <label style={styles.fileLabel}>شهادة إثبات اللغة إن وجدت (PDF): <input type="file" accept=".pdf" onChange={e => setApplyForm({...applyForm, langFile: e.target.files[0]})} style={styles.fileInput}/></label>
              <label style={styles.fileLabel}>الصورة الشخصية الخلفية بيضاء (JPG/PNG): <input type="file" accept=".jpg,.jpeg,.png" required onChange={e => setApplyForm({...applyForm, personalPhoto: e.target.files[0]})} style={styles.fileInput}/></label>

              <button type="submit" style={styles.submitFormBtn}>إرسال الملف الكامل وتوجيه الطلب فورا 🚀</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// التنسيقات الإبداعية والجمالية الفائقة
const styles = {
  container: {
    minHeight: "100vh",
    direction: "rtl",
    fontFamily: "Cairo, sans-serif",
    backgroundImage: "linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.95)), url('https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1920&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    color: "#e2e8f0"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "rgba(2, 12, 27, 0.9)",
    borderBottom: "2px solid #64ffda",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 10px 30px -10px rgba(2,12,27,0.7)"
  },
  logoSection: { fontSize: "20px", fontWeight: "bold", color: "#64ffda" },
  navBar: { display: "flex", gap: "15px" },
  navBtn: {
    background: "transparent", border: "1px solid #64ffda", color: "#64ffda",
    padding: "10px 20px", borderRadius: "5px", cursor: "pointer", transition: "0.3s"
  },
  activeNavBtn: {
    background: "#64ffda", border: "1px solid #64ffda", color: "#0a192f",
    padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
  },
  backBtn: {
    background: "#ff4a4a", border: "none", color: "#fff", padding: "10px 20px",
    borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
  },
  mainContent: { padding: "40px" },
  sectionTitle: { textAlign: "center", color: "#fff", fontSize: "32px", marginBottom: "30px", textShadow: "0 2px 10px rgba(100,255,218,0.3)" },
  subSectionTitle: { color: "#64ffda", borderBottom: "1px solid #233554", paddingBottom: "10px", marginTop: "30px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", marginTop: "20px" },
  card: {
    background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "20px",
    cursor: "pointer", transition: "0.3s transform, 0.3s box-shadow", boxShadow: "0 10px 30px -15px rgba(2,12,27,0.7)"
  },
  staticCard: {
    background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "20px",
    boxShadow: "0 10px 30px -15px rgba(2,12,27,0.7)"
  },
  moreLabel: { color: "#64ffda", fontSize: "12px", display: "block", marginTop: "15px", textAlign: "left" },
  detailsView: { background: "rgba(17, 34, 64, 0.95)", border: "2px solid #64ffda", borderRadius: "12px", padding: "30px", marginTop: "20px" },
  closeBtn: { background: "#ff4a4a", border: "none", color: "#fff", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", float: "left" },
  detailsBody: { clear: "both", marginTop: "20px", lineHeight: "1.8" },
  link: { color: "#64ffda", textDecoration: "underline" },
  globalApplyBtn: { background: "linear-gradient(45deg, #00b4db, #0083b0)", color: "#fff", border: "none", padding: "15px 40px", fontSize: "18px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", transition: "0.3s", boxShadow: "0 4px 15px rgba(0,180,219,0.4)" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(2,12,27,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
  modalBox: { background: "#0a192f", border: "2px solid #64ffda", borderRadius: "12px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #233554", paddingBottom: "15px" },
  miniCloseBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "20px" },
  form: { marginTop: "20px" },
  formGroupTitle: { color: "#64ffda", marginTop: "20px", marginBottom: "10px", borderRight: "4px solid #64ffda", paddingRight: "10px" },
  input: { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #233554", background: "#112240", color: "#fff", boxSizing: "border-box" },
  select: { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #233554", background: "#112240", color: "#fff" },
  fileLabel: { display: "block", background: "#112240", padding: "10px", borderRadius: "5px", marginBottom: "10px", border: "1px dashed #64ffda", cursor: "pointer" },
  fileInput: { marginRight: "10px" },
  submitFormBtn: { width: "100%", padding: "15px", background: "#64ffda", color: "#0a192f", border: "none", borderRadius: "5px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", marginTop: "20px", boxShadow: "0 4px 15px rgba(100,255,218,0.4)" }
};