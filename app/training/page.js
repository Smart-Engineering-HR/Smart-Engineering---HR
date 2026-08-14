"use client";
import React, { useState, useEffect } from "react";

export default function TrainingPublicPage() {
  const [activeTab, setActiveTab] = useState("tracks");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState("");
  const [loading, setLoading] = useState(true);

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

  const [applyForm, setApplyForm] = useState({
    fullNameAr: "",
    fullNameEn: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    residence: "",
    email: "",
    phone: "",
    lastDegree: "بكالوريوس",
    gpa: "",
    institute: "",
    graduationYear: "",
    currentSpecialty: "",
    scholarshipTitle: "",
    targetDegree: "ماجستير",
    targetSpecialty1: "",
    targetSpecialty2: "",
    englishProficiency: "بدون شهادة",
    passportCopy: "",
    academicCertificates: "",
    motivationLetter: "",
    cvResume: "",
    recommendationLetters: "",
    languageCert: "",
    personalPhoto: ""
  });

  // جلب البيانات المعتمدة والمنشورة من السيرفر
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/academy?public=true');
      if (!res.ok) throw new Error("فشل جلب البيانات من السيرفر");
      const items = await res.json();

      const categorized = {
        proCourses: [], pythonCourses: [], mgmtCourses: [], scholarships: [],
        codes: [], books: [], webinars: [], certificates: []
      };

      if (Array.isArray(items)) {
        items.forEach(item => {
          let detailsObj = {};
          if (item.details) {
            try {
              detailsObj = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
            } catch (e) {
              detailsObj = {};
            }
          }
          const formattedItem = { id: item.id, title: item.title, category: item.category, ...detailsObj };

          if (categorized[item.category]) {
            categorized[item.category].push(formattedItem);
          }
        });
      }

      setData(categorized);
    } catch (err) {
      console.error("Error loading public data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...applyForm,
        scholarshipTitle: selectedScholarship || applyForm.scholarshipTitle
      };

      const res = await fetch('/api/academy-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "فشل إرسال طلب التقديم");
      }

      alert("✅ تم إرسال ملف تقديمك بنجاح! تم حفظ الطلب في قاعدة البيانات وإرسال إشعار للبريد الإلكتروني للجهات المختصة.");
      setShowApplyModal(false);
      setApplyForm({
        fullNameAr: "", fullNameEn: "", birthDate: "", birthPlace: "", nationality: "", residence: "",
        email: "", phone: "", lastDegree: "بكالوريوس", gpa: "", institute: "", graduationYear: "",
        currentSpecialty: "", scholarshipTitle: "", targetDegree: "ماجستير", targetSpecialty1: "",
        targetSpecialty2: "", englishProficiency: "بدون شهادة", passportCopy: "", academicCertificates: "",
        motivationLetter: "", cvResume: "", recommendationLetters: "", languageCert: "", personalPhoto: ""
      });
    } catch (err) {
      alert("❌ خطأ أثناء الإرسال: " + err.message);
    }
  };

  const handleFileChangeMock = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setApplyForm(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <span style={styles.logoText}>منصة الهندسة الذكية | Smart Engineering HR & Academy</span>
        </div>
        <nav style={styles.navBar}>
          <button style={activeTab === "tracks" ? styles.activeNavBtn : styles.navBtn} onClick={() => { setActiveTab("tracks"); setSelectedItem(null); }}>
            المسارات التعليمية
          </button>
          <button style={activeTab === "sources" ? styles.activeNavBtn : styles.navBtn} onClick={() => { setActiveTab("sources"); setSelectedItem(null); }}>
            المصادر الأكاديمية (المنح، الأكواد، الكتب)
          </button>
          <button style={activeTab === "dev" ? styles.activeNavBtn : styles.navBtn} onClick={() => { setActiveTab("dev"); setSelectedItem(null); }}>
            التطوير المهني المتقدم
          </button>
        </nav>
        <button style={styles.backBtn} onClick={() => window.location.href = "/"}>العودة للرئيسية ↩</button>
      </header>

      <main style={styles.mainContent}>
        {loading && <p style={{ textAlign: "center", color: "#64ffda", fontSize: "18px" }}>⏳ جاري تحميل المحتوى المحدث...</p>}

        {/* -------------------- قائمة المسارات التعليمية -------------------- */}
        {!loading && activeTab === "tracks" && !selectedItem && (
          <div>
            <h2 style={styles.sectionTitle}>🎓 قائمة المسارات التعليمية</h2>
            
            <h3 style={styles.subSectionTitle}>I. دورات البرامج الهندسية الاحترافية</h3>
            <div style={styles.grid}>
              {data.proCourses.map(course => (
                <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "pro", data: course})}>
                  <h4 style={styles.cardTitle}>{course.title}</h4>
                  <p><strong>👤 المدرب:</strong> {course.trainer}</p>
                  <p><strong>⏱️ المدة:</strong> {course.duration}</p>
                  <p><strong>📜 الاعتماد:</strong> {course.certificate}</p>
                  <span style={styles.moreLabel}>اضغط للتفاصيل الكاملة... 🔍</span>
                </div>
              ))}
              {data.proCourses.length === 0 && <p style={styles.emptyText}>لا توجد دورات منشورة حالياً في هذا القسم.</p>}
            </div>

            <h3 style={styles.subSectionTitle}>II. دورات التصميم الإنشائي باستخدام Python</h3>
            <div style={styles.grid}>
              {data.pythonCourses.map(course => (
                <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "python", data: course})}>
                  <h4 style={styles.cardTitle}>{course.title}</h4>
                  <p><strong>👤 المدرب:</strong> {course.trainer}</p>
                  <p><strong>⏱️ المدة:</strong> {course.duration}</p>
                  <p><strong>🎯 الفئة المستهدفة:</strong> {course.targetAudience}</p>
                  <span style={styles.moreLabel}>اضغط للتفاصيل الكاملة... 🔍</span>
                </div>
              ))}
              {data.pythonCourses.length === 0 && <p style={styles.emptyText}>لا توجد دورات منشورة حالياً في هذا القسم.</p>}
            </div>

            <h3 style={styles.subSectionTitle}>III. الإدارة الهندسية والمكتب الفني</h3>
            <div style={styles.grid}>
              {data.mgmtCourses.map(course => (
                <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "mgmt", data: course})}>
                  <h4 style={styles.cardTitle}>{course.title}</h4>
                  <p><strong>👤 المدرب:</strong> {course.trainer}</p>
                  <p><strong>⏱️ المدة:</strong> {course.duration}</p>
                  <span style={styles.moreLabel}>اضغط للتفاصيل الكاملة... 🔍</span>
                </div>
              ))}
              {data.mgmtCourses.length === 0 && <p style={styles.emptyText}>لا توجد دورات منشورة حالياً في هذا القسم.</p>}
            </div>
          </div>
        )}

        {/* -------------------- قائمة المصادر الأكاديمية -------------------- */}
        {!loading && activeTab === "sources" && !selectedItem && (
          <div>
            <h2 style={styles.sectionTitle}>📚 قائمة المصادر الأكاديمية</h2>
            
            <h3 style={styles.subSectionTitle}>I. المنح الدراسية والبحثية المتاحة</h3>
            <div style={styles.grid}>
              {data.scholarships.map(sch => (
                <div key={sch.id} style={styles.card} onClick={() => setSelectedItem({type: "scholarship", data: sch})}>
                  <h4 style={styles.cardTitle}>{sch.title}</h4>
                  <p><strong>🌍 الدولة المستضيفة:</strong> {sch.country}</p>
                  <p><strong>🏛️ الجهة المانحة:</strong> {sch.provider}</p>
                  <p><strong>🎓 المراحل المستهدفة:</strong> {sch.degrees}</p>
                  <p><strong>💰 نوع التمويل:</strong> {sch.fundType}</p>
                  <span style={styles.moreLabel}>عرض ملف المنحة المتكامل والتقديم... 🔍</span>
                </div>
              ))}
              {data.scholarships.length === 0 && <p style={styles.emptyText}>لا توجد منح منشورة حالياً في هذا القسم.</p>}
            </div>

            <h3 style={styles.subSectionTitle}>II. الأكواد الهندسية (Engineering Codes & Standards)</h3>
            <div style={styles.grid}>
              {data.codes.map(code => (
                <div key={code.id} style={styles.staticCard}>
                  <h4 style={styles.cardTitle}>📐 {code.name || code.title}</h4>
                  <p><strong>🔢 رقم الكود وإصداره:</strong> {code.number}</p>
                  <p><strong>🌐 النسخة الإقليمية / المحلية:</strong> {code.region}</p>
                </div>
              ))}
              {data.codes.length === 0 && <p style={styles.emptyText}>لا توجد أكواد منشورة حالياً.</p>}
            </div>

            <h3 style={styles.subSectionTitle}>III. الكتب والمراجع العلمية</h3>
            <div style={styles.grid}>
              {data.books.map(book => (
                <div key={book.id} style={styles.staticCard}>
                  <h4 style={styles.cardTitle}>📖 {book.title}</h4>
                  <p><strong>✍️ المؤلف:</strong> {book.author}</p>
                  <p><strong>📚 رقم الطبعة وفصل الدراسة:</strong> {book.edition}</p>
                </div>
              ))}
              {data.books.length === 0 && <p style={styles.emptyText}>لا توجد كتب منشورة حالياً.</p>}
            </div>
          </div>
        )}

        {/* -------------------- قائمة التطوير المهني المتقدم -------------------- */}
        {!loading && activeTab === "dev" && !selectedItem && (
          <div>
            <h2 style={styles.sectionTitle}>🚀 قائمة التطوير المهني المتقدم</h2>
            
            <h3 style={styles.subSectionTitle}>1. الندوات الهندسية عبر الإنترنت (Webinars)</h3>
            <div style={styles.grid}>
              {data.webinars.map(web => (
                <div key={web.id} style={styles.staticCard}>
                  <h4 style={styles.cardTitle}>🌐 {web.title}</h4>
                  <p><strong>🏛️ الجهة المنظمة:</strong> {web.organizer}</p>
                  <p><strong>📅 تاريخ الانعقاد:</strong> {web.date}</p>
                  <p><strong>⏱️ الساعات المكتسبة:</strong> {web.hours}</p>
                  <p><strong>🎤 المتحدث / الخبير:</strong> {web.speaker}</p>
                  <p><strong>📝 الملخص والهدف:</strong> {web.summary}</p>
                </div>
              ))}
              {data.webinars.length === 0 && <p style={styles.emptyText}>لا توجد ندوات منشورة حالياً.</p>}
            </div>

            <h3 style={styles.subSectionTitle}>2. الشهادات المهنية المعتمدة</h3>
            <div style={styles.grid}>
              {data.certificates.map(cert => (
                <div key={cert.id} style={styles.staticCard}>
                  <h4 style={styles.cardTitle}>🏅 {cert.title}</h4>
                  <p><strong>🏛️ الجهة المانحة:</strong> {cert.provider}</p>
                  <p><strong>🔢 رقم الشهادة / الاعتماد:</strong> {cert.certNumber}</p>
                  <p><strong>📅 تاريخ الحصول:</strong> {cert.dateGet}</p>
                  <p><strong>⏳ تاريخ الانتهاء:</strong> {cert.dateEnd}</p>
                  {cert.verifyLink && (
                    <a href={cert.verifyLink} target="_blank" rel="noreferrer" style={styles.linkBtn}>🔗 رابط التحقق الرسمي</a>
                  )}
                </div>
              ))}
              {data.certificates.length === 0 && <p style={styles.emptyText}>لا توجد شهادات منشورة حالياً.</p>}
            </div>
          </div>
        )}

        {/* -------------------- عرض تفاصيل العنصر المختار -------------------- */}
        {selectedItem && (
          <div style={styles.detailsView}>
            <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>❌ إغلاق والعودة للقائمة</button>
            <div style={styles.detailsBody}>
              
              {selectedItem.type === "pro" && (
                <>
                  <h2 style={{color: "#64ffda"}}>{selectedItem.data.title}</h2>
                  <p><strong>اسم المدرب:</strong> {selectedItem.data.trainer}</p>
                  <p><strong>مدة الدورة:</strong> {selectedItem.data.duration}</p>
                  <p><strong>نوع الشهادة والاعتماد:</strong> {selectedItem.data.certificate}</p>
                  <hr style={{borderColor: "#233554", margin: "15px 0"}}/>
                  <h4>📌 متطلبات الدورة:</h4>
                  <p>{selectedItem.data.requirements}</p>
                  <h4>👤 هوية المدرب ومعلومات عنه:</h4>
                  <p>{selectedItem.data.bio}</p>
                </>
              )}

              {selectedItem.type === "python" && (
                <>
                  <h2 style={{color: "#64ffda"}}>{selectedItem.data.title}</h2>
                  <p><strong>اسم المدرب:</strong> {selectedItem.data.trainer}</p>
                  <p><strong>مدة الدورة:</strong> {selectedItem.data.duration}</p>
                  <hr style={{borderColor: "#233554", margin: "15px 0"}}/>
                  <h4>💡 لماذا بايثون بالذات في الهندسة الإنشائية؟ (الأهمية):</h4>
                  <p>{selectedItem.data.whyPython}</p>
                  <h4>🎯 ماذا ستتعلم في هذه الدورة؟ (المحتوى المتوقع):</h4>
                  <p>{selectedItem.data.learningOutcomes}</p>
                  <h4>👥 لمن تفيد هذه الدورة؟:</h4>
                  <p>{selectedItem.data.targetAudience}</p>
                  <h4>💡 نصائح مهمة قبل أن تبدأ:</h4>
                  <p>{selectedItem.data.tips}</p>
                </>
              )}

              {selectedItem.type === "mgmt" && (
                <>
                  <h2 style={{color: "#64ffda"}}>{selectedItem.data.title}</h2>
                  <p><strong>اسم المدرب:</strong> {selectedItem.data.trainer}</p>
                  <p><strong>مدة الدورة:</strong> {selectedItem.data.duration}</p>
                  <hr style={{borderColor: "#233554", margin: "15px 0"}}/>
                  <h4>📋 أهم المحاور والمعلومات:</h4>
                  <p>{selectedItem.data.axes}</p>
                  <h4>🌟 أهمية هذه الدورة (لماذا هي حاسمة لمستقبلك؟):</h4>
                  <p>{selectedItem.data.importance}</p>
                  <h4>💡 نصيحة للبدء:</h4>
                  <p>{selectedItem.data.tips}</p>
                </>
              )}

              {selectedItem.type === "scholarship" && (
                <>
                  <h2 style={{color: "#00e6ff", textAlign: "center", marginBottom: "20px"}}>{selectedItem.data.title}</h2>
                  
                  <div style={styles.detailSection}>
                    <h3 style={styles.detailHeading}>1. المعلومات الأساسية للمنحة</h3>
                    <p><strong>اسم المنحة الرسمي:</strong> {selectedItem.data.title}</p>
                    <p><strong>الجهة المانحة:</strong> {selectedItem.data.provider}</p>
                    <p><strong>الدولة المستضيفة:</strong> {selectedItem.data.country}</p>
                    <p><strong>المراحل الدراسية المستهدفة:</strong> {selectedItem.data.degrees}</p>
                  </div>

                  <div style={styles.detailSection}>
                    <h3 style={styles.detailHeading}>2. التمويل والمزايا المالية (ماذا تغطي المنحة؟)</h3>
                    <p><strong>نوع التمويل:</strong> {selectedItem.data.fundType}</p>
                    {selectedItem.data.fundPartialDetails && <p><strong>تفاصيل التغطية الجزئية:</strong> {selectedItem.data.fundPartialDetails}</p>}
                    <p><strong>الإعفاء من الرسوم الدراسية:</strong> {selectedItem.data.tuition}</p>
                    <p><strong>الراتب الشهري:</strong> {selectedItem.data.salary}</p>
                    <p><strong>تأمين السكن الجامعي / بدل السكن:</strong> {selectedItem.data.housing}</p>
                    <p><strong>تذاكر الطيران:</strong> {selectedItem.data.flights}</p>
                    <p><strong>التأمين الصحي الشامل:</strong> {selectedItem.data.health}</p>
                    <p><strong>تكاليف الفيزا والسنة التحضيرية للغة:</strong> {selectedItem.data.visa}</p>
                  </div>

                  <div style={styles.detailSection}>
                    <h3 style={styles.detailHeading}>3. شروط الأهلية والقبول (من يحق له التقديم؟)</h3>
                    <p><strong>الجنسيات المؤهلة:</strong> {selectedItem.data.nationalities}</p>
                    <p><strong>السن المطلوب:</strong> {selectedItem.data.age}</p>
                    <p><strong>المعدل الأكاديمي الأدنى (GPA):</strong> {selectedItem.data.gpa}</p>
                    <p><strong>شرط اللغة:</strong> {selectedItem.data.langReq}</p>
                    <p><strong>التخصصات والكليات المتاحة:</strong> {selectedItem.data.specialties}</p>
                  </div>

                  <div style={styles.detailSection}>
                    <h3 style={styles.detailHeading}>4. الوثائق والمستندات المطلوبة (ملف التقديم)</h3>
                    <p>{selectedItem.data.requiredDocs || "الشهادات الأكاديمية، جواز السفر، السيرة الذاتية (CV)، خطاب الدافع، خطابات التوصية، المخطط البحثي (للدراسات العليا)، والفحص الطبي."}</p>
                  </div>

                  <div style={styles.detailSection}>
                    <h3 style={styles.detailHeading}>5. مواعيد التقديم والجدول الزمني</h3>
                    <p><strong>تاريخ فتح باب التقديم:</strong> {selectedItem.data.dateOpen}</p>
                    <p><strong>تاريخ إغلاق التقديم (Deadline):</strong> {selectedItem.data.dateClose}</p>
                    <p><strong>موعد إعلان النتائج:</strong> {selectedItem.data.dateResults}</p>
                    <p><strong>موعد بدء الدراسة:</strong> {selectedItem.data.dateStart}</p>
                  </div>

                  <div style={styles.detailSection}>
                    <h3 style={styles.detailHeading}>6. طريقة التقديم والروابط الرسمية</h3>
                    <p><strong>رسوم التقديم للجامعة:</strong> {selectedItem.data.applicationFee || "مجاني بالكامل"}</p>
                    {selectedItem.data.linkDirect && <p><a href={selectedItem.data.linkDirect} target="_blank" rel="noreferrer" style={styles.linkBtn}>🌐 رابط بوابة التسجيل المباشر (Portal)</a></p>}
                    {selectedItem.data.linkOfficial && <p><a href={selectedItem.data.linkOfficial} target="_blank" rel="noreferrer" style={styles.linkBtn}>📢 رابط الإعلان الرسمي للمنحة</a></p>}
                  </div>

                  <div style={{textAlign: "center", marginTop: "30px"}}>
                    <button 
                      style={styles.globalApplyBtn} 
                      onClick={() => { 
                        setSelectedScholarship(selectedItem.data.title); 
                        setApplyForm(prev => ({ ...prev, scholarshipTitle: selectedItem.data.title }));
                        setShowApplyModal(true); 
                      }}
                    >
                      ⚡ التقديم من خلالنا عبر منصة الهندسة الذكية
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </main>

      {/* -------------------- نافذة التقديم من خلالنا (Modal) -------------------- */}
      {showApplyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{color: "#64ffda", margin: 0}}>خدمة التقديم الاحترافي للمنح والبرامج الأكاديمية</h3>
              <button style={styles.miniCloseBtn} onClick={() => setShowApplyModal(false)}>❌</button>
            </div>

            <div style={styles.bannerNotice}>
              <p style={{fontWeight: "bold", margin: "0 0 5px 0"}}>ℹ️ نحن نقدم لكم بطريقة احترافية فقط لضمان استيفاء جميع الشروط وضمان أعلى نسبة قبول.</p>
              <p style={{margin: 0, fontSize: "13px", color: "#ffd700"}}>💰 رسوم الخدمة: سيتم التواصل معكم فور استلام الملف لتحديد رمز الخدمة وإرسال التأكيد.</p>
            </div>
            
            <form onSubmit={handleApplySubmit} style={styles.form}>
              
              {/* 1. البيانات الشخصية */}
              <h4 style={styles.formGroupTitle}>1. البيانات الشخصية</h4>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>الاسم الكامل (بالعربية) كما في الجواز:</label>
                  <input type="text" required value={applyForm.fullNameAr} onChange={e => setApplyForm({...applyForm, fullNameAr: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>Full Name in English (as in Passport):</label>
                  <input type="text" required value={applyForm.fullNameEn} onChange={e => setApplyForm({...applyForm, fullNameEn: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>تاريخ الميلاد والمنشأ (اليوم/الشهر/السنة):</label>
                  <input type="text" placeholder="مثال: 15/05/1998 - صنعاء" required value={applyForm.birthDate} onChange={e => setApplyForm({...applyForm, birthDate: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>الجنسية الحالية:</label>
                  <input type="text" required value={applyForm.nationality} onChange={e => setApplyForm({...applyForm, nationality: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>بلد الإقامة الحالي:</label>
                  <input type="text" required value={applyForm.residence} onChange={e => setApplyForm({...applyForm, residence: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>البريد الإلكتروني الرسمي:</label>
                  <input type="email" required value={applyForm.email} onChange={e => setApplyForm({...applyForm, email: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>رقم الهاتف (مع رمز الدولة):</label>
                  <input type="text" placeholder="+967..." required value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} style={styles.input}/>
                </div>
              </div>

              {/* 2. الخلفية الأكاديمية */}
              <h4 style={styles.formGroupTitle}>2. الخلفية الأكاديمية (Academic Background)</h4>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>آخر مؤهل علمي تم الحصول عليه:</label>
                  <select value={applyForm.lastDegree} onChange={e => setApplyForm({...applyForm, lastDegree: e.target.value})} style={styles.select}>
                    <option value="ثانوية عامة">ثانوية عامة</option>
                    <option value="بكالوريوس">بكالوريوس</option>
                    <option value="ماجستير">ماجستير</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>المعدل التراكمي (GPA / النسبة المئوية):</label>
                  <input type="text" placeholder="مثال: 3.8 من 4.0 أو 90%" required value={applyForm.gpa} onChange={e => setApplyForm({...applyForm, gpa: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>اسم المؤسسة التعليمية (المدرسة/الجامعة) وسنة التخرج:</label>
                  <input type="text" placeholder="مثال: جامعة صنعاء - 2024" required value={applyForm.institute} onChange={e => setApplyForm({...applyForm, institute: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>التخصص الحالي / السابق:</label>
                  <input type="text" placeholder="مثال: هندسة مدنية" required value={applyForm.currentSpecialty} onChange={e => setApplyForm({...applyForm, currentSpecialty: e.target.value})} style={styles.input}/>
                </div>
              </div>

              {/* 3. تفاصيل التقديم والمنحة المستهدفة */}
              <h4 style={styles.formGroupTitle}>3. تفاصيل التقديم والمنحة المستهدفة (Application Details)</h4>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>المنحة المطلوبة:</label>
                  <select value={selectedScholarship} onChange={e => setSelectedScholarship(e.target.value)} style={styles.select}>
                    <option value="">-- اختر المنحة من القائمة --</option>
                    {data.scholarships.map(sch => (
                      <option key={sch.id} value={sch.title}>{sch.title} ({sch.country})</option>
                    ))}
                    <option value="منحة عامة / برنامج آخر">منحة عامة / برنامج آخر</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>الدرجة العلمية المستهدفة:</label>
                  <select value={applyForm.targetDegree} onChange={e => setApplyForm({...applyForm, targetDegree: e.target.value})} style={styles.select}>
                    <option value="بكالوريوس">بكالوريوس</option>
                    <option value="ماجستير">ماجستير</option>
                    <option value="دكتوراه">دكتوراه</option>
                    <option value="زمالة بحثية">زمالة بحثية / كورسات قصيرة</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>التخصص المرغوب دراسته (خيار أول):</label>
                  <input type="text" required value={applyForm.targetSpecialty1} onChange={e => setApplyForm({...applyForm, targetSpecialty1: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>التخصص المرغوب دراسته (خيار ثاني):</label>
                  <input type="text" value={applyForm.targetSpecialty2} onChange={e => setApplyForm({...applyForm, targetSpecialty2: e.target.value})} style={styles.input}/>
                </div>
                <div>
                  <label style={styles.label}>مستوى إتقان اللغة الإنجليزية:</label>
                  <select value={applyForm.englishProficiency} onChange={e => setApplyForm({...applyForm, englishProficiency: e.target.value})} style={styles.select}>
                    <option value="IELTS">لدي شهادة IELTS</option>
                    <option value="TOEFL">لدي شهادة TOEFL</option>
                    <option value="شهادة دراسة بالإنجليزية">شهادة تثبت أن الدراسة باللغة الإنجليزية</option>
                    <option value="بدون شهادة">بدون شهادة (يرغب بالدراسة التحضيرية)</option>
                  </select>
                </div>
              </div>

              {/* 4. الملفات والمستندات المطلوب إرفاقها */}
              <h4 style={styles.formGroupTitle}>4. الملفات والمستندات المطلوب إرفاقها (PDF / JPG / PNG)</h4>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>نسخة من جواز السفر (ساري المفعول):</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => handleFileChangeMock(e, 'passportCopy')} style={styles.fileInput}/>
                </div>
                <div>
                  <label style={styles.label}>الشهادات الأكاديمية وكشف الدرجات:</label>
                  <input type="file" accept=".pdf,.zip" onChange={e => handleFileChangeMock(e, 'academicCertificates')} style={styles.fileInput}/>
                </div>
                <div>
                  <label style={styles.label}>خطاب الدافع / بيان الغرض (Motivation Letter):</label>
                  <input type="file" accept=".pdf,.docx" onChange={e => handleFileChangeMock(e, 'motivationLetter')} style={styles.fileInput}/>
                </div>
                <div>
                  <label style={styles.label}>السيرة الذاتية (CV / Resume):</label>
                  <input type="file" accept=".pdf" onChange={e => handleFileChangeMock(e, 'cvResume')} style={styles.fileInput}/>
                </div>
                <div>
                  <label style={styles.label}>خطابات التوصية (Recommendation Letters):</label>
                  <input type="file" accept=".pdf,.zip" onChange={e => handleFileChangeMock(e, 'recommendationLetters')} style={styles.fileInput}/>
                </div>
                <div>
                  <label style={styles.label}>شهادة إثبات اللغة (إن وجدت):</label>
                  <input type="file" accept=".pdf" onChange={e => handleFileChangeMock(e, 'languageCert')} style={styles.fileInput}/>
                </div>
                <div>
                  <label style={styles.label}>الصورة الشخصية (خلفية بيضاء JPG/PNG):</label>
                  <input type="file" accept=".jpg,.jpeg,.png" onChange={e => handleFileChangeMock(e, 'personalPhoto')} style={styles.fileInput}/>
                </div>
              </div>

              <button type="submit" style={styles.submitFormBtn}>إرسال الطلب والملفات مباشرة إلى إدارة المنصة 🚀</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", direction: "rtl", fontFamily: "Cairo, sans-serif", background: "#0a192f", color: "#e2e8f0" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", background: "#020c1b", borderBottom: "2px solid #64ffda", position: "sticky", top: 0, zIndex: 100 },
  logoSection: { fontSize: "18px", fontWeight: "bold", color: "#64ffda" },
  navBar: { display: "flex", gap: "10px" },
  navBtn: { background: "transparent", border: "1px solid #233554", color: "#8892b0", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  activeNavBtn: { background: "#64ffda", border: "1px solid #64ffda", color: "#0a192f", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
  backBtn: { background: "#dc3545", border: "none", color: "#fff", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  mainContent: { padding: "30px" },
  sectionTitle: { textAlign: "center", color: "#fff", fontSize: "28px", marginBottom: "25px", borderBottom: "2px dashed #233554", paddingBottom: "10px" },
  subSectionTitle: { color: "#64ffda", borderRight: "4px solid #64ffda", paddingRight: "10px", marginTop: "30px", fontSize: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginTop: "15px" },
  card: { background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "20px", cursor: "pointer", transition: "0.3s" },
  staticCard: { background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "20px" },
  cardTitle: { color: "#64ffda", marginTop: 0, marginBottom: "12px", fontSize: "18px" },
  moreLabel: { color: "#00e6ff", fontSize: "13px", display: "block", marginTop: "15px", fontWeight: "bold" },
  emptyText: { color: "#8892b0", fontStyle: "italic", padding: "10px" },
  detailsView: { background: "#112240", border: "2px solid #64ffda", borderRadius: "12px", padding: "30px", marginTop: "20px" },
  closeBtn: { background: "#dc3545", border: "none", color: "#fff", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", float: "left", fontWeight: "bold" },
  detailsBody: { clear: "both", marginTop: "20px", lineHeight: "1.8" },
  detailSection: { background: "#0a192f", border: "1px solid #233554", borderRadius: "8px", padding: "20px", marginBottom: "15px" },
  detailHeading: { color: "#64ffda", marginTop: 0, borderBottom: "1px solid #233554", paddingBottom: "8px" },
  linkBtn: { color: "#64ffda", textDecoration: "underline", fontWeight: "bold" },
  globalApplyBtn: { background: "linear-gradient(45deg, #00b4db, #0083b0)", color: "#fff", border: "none", padding: "15px 40px", fontSize: "18px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,180,219,0.4)" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(2,12,27,0.9)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
  modalBox: { background: "#0a192f", border: "2px solid #64ffda", borderRadius: "12px", width: "100%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto", padding: "25px" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #233554", paddingBottom: "12px" },
  miniCloseBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "20px", color: "#fff" },
  bannerNotice: { background: "rgba(100,255,218,0.1)", border: "1px solid #64ffda", padding: "12px", borderRadius: "6px", marginTop: "15px", color: "#e2e8f0" },
  form: { marginTop: "15px" },
  formGroupTitle: { color: "#64ffda", marginTop: "20px", marginBottom: "12px", borderRight: "4px solid #64ffda", paddingRight: "10px", fontSize: "16px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  label: { display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "5px" },
  input: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #233554", background: "#112240", color: "#fff", boxSizing: "border-box" },
  select: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #233554", background: "#112240", color: "#fff", boxSizing: "border-box" },
  fileInput: { width: "100%", padding: "8px", borderRadius: "5px", border: "1px dashed #233554", background: "#112240", color: "#8892b0", fontSize: "12px", boxSizing: "border-box" },
  submitFormBtn: { width: "100%", padding: "15px", background: "#64ffda", color: "#0a192f", border: "none", borderRadius: "6px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", marginTop: "25px" }
};