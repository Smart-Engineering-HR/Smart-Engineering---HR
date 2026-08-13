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
    fullNameAr: "", fullNameEn: "", birthDate: "", nationality: "", residence: "",
    email: "", phone: "", lastDegree: "", gpa: "", institute: "", graduationYear: "",
    currentSpecialty: "", targetDegree: "", targetSpecialty1: "", targetSpecialty2: "",
    langLevel: "none"
  });

  // جلب البيانات مباشرة من السيرفر وعرض المنشورة فقط
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/academy?public=true');
      if (!res.ok) throw new Error("فشل تحكم الجلب");
      const items = await res.json();

      const categorized = {
        proCourses: [], pythonCourses: [], mgmtCourses: [], scholarships: [],
        codes: [], books: [], webinars: [], certificates: []
      };

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
        scholarshipTitle: selectedScholarship
      };

      const res = await fetch('/api/academy-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("فشل إرسال الطلب");

      alert("تم إرسال ملف تقديمك بنجاح وسوف تصلك إشعارات التأكيد عبر البريد الإلكتروني!");
      setShowApplyModal(false);
      setApplyForm({
        fullNameAr: "", fullNameEn: "", birthDate: "", nationality: "", residence: "",
        email: "", phone: "", lastDegree: "", gpa: "", institute: "", graduationYear: "",
        currentSpecialty: "", targetDegree: "", targetSpecialty1: "", targetSpecialty2: "",
        langLevel: "none"
      });
    } catch (err) {
      alert("خطأ أثناء الإرسال: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
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

      <main style={styles.mainContent}>
        {loading && <p style={{ textAlign: "center", color: "#64ffda" }}>⏳ جاري تحميل المحتوى المحدث...</p>}

        {!loading && activeTab === "tracks" && !selectedItem && (
          <div>
            <h2 style={styles.sectionTitle}>المسارات التعليمية الاحترافية</h2>
            
            <h3 style={styles.subSectionTitle}>🔹 دورات البرامج الهندسية الاحترافية</h3>
            <div style={styles.grid}>
              {data.proCourses.map(course => (
                <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "pro", data: course})}>
                  <h4>{course.title}</h4>
                  <p><strong>المدرب:</strong> {course.trainer}</p>
                  <p><strong>المدة:</strong> {course.duration}</p>
                  <span style={styles.moreLabel}>اضغط للتفاصيل...</span>
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
                  <span style={styles.moreLabel}>اضغط للتفاصيل...</span>
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
                  <span style={styles.moreLabel}>اضغط للتفاصيل...</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === "sources" && !selectedItem && (
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
                  <h4>{code.name || code.title}</h4>
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
                  <p><strong>الطبعة:</strong> {book.edition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === "dev" && !selectedItem && (
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
                  <p><strong>لماذا بايثون بالذات؟:</strong> {selectedItem.data.whyPython}</p>
                  <p><strong>ماذا ستتعلم؟:</strong> {selectedItem.data.learningOutcomes}</p>
                  <p><strong>لمن تفيد هذه الدورة؟:</strong> {selectedItem.data.targetAudience}</p>
                  <p><strong>نصائح مهمة:</strong> {selectedItem.data.tips}</p>
                </>
              )}

              {selectedItem.type === "mgmt" && (
                <>
                  <h2>{selectedItem.data.title}</h2>
                  <p><strong>اسم المدرب الخبير:</strong> {selectedItem.data.trainer}</p>
                  <p><strong>مدة الدورة:</strong> {selectedItem.data.duration}</p>
                  <p><strong>أهم المحاور:</strong> {selectedItem.data.axes}</p>
                  <p><strong>أهمية الدورة:</strong> {selectedItem.data.importance}</p>
                  <p><strong>نصيحة للبدء:</strong> {selectedItem.data.tips}</p>
                </>
              )}

              {selectedItem.type === "scholarship" && (
                <>
                  <h2 style={{color: "#00e6ff"}}>{selectedItem.data.title}</h2>
                  <p><strong>الجهة المانحة:</strong> {selectedItem.data.provider}</p>
                  <p><strong>الدولة المستضيفة:</strong> {selectedItem.data.country}</p>
                  <p><strong>المراحل الدراسية:</strong> {selectedItem.data.degrees}</p>
                  <p><strong>نوع التمويل:</strong> {selectedItem.data.fundType}</p>
                  <p><strong>الرسوم الدراسية:</strong> {selectedItem.data.tuition}</p>
                  <p><strong>الراتب الشهري:</strong> {selectedItem.data.salary}</p>
                  <p><strong>السكن الجامعي:</strong> {selectedItem.data.housing}</p>
                  <p><strong>الجنسيات المؤهلة:</strong> {selectedItem.data.nationalities}</p>
                  <p><strong>شرط اللغة:</strong> {selectedItem.data.langReq}</p>
                  <p><strong>التخصصات المتاحة:</strong> {selectedItem.data.specialties}</p>
                  <hr style={{margin: "20px 0", borderColor: "#00e6ff"}}/>
                  <div style={{textAlign: "center"}}>
                    <button style={styles.globalApplyBtn} onClick={() => { setSelectedScholarship(selectedItem.data.title); setShowApplyModal(true); }}>⚡ التقديم الآن عبر المنصة</button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </main>

      {showApplyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3>تقديم احترافي عبر منصة الهندسة الذكية</h3>
              <button style={styles.miniCloseBtn} onClick={() => setShowApplyModal(false)}>❌</button>
            </div>
            
            <form onSubmit={handleApplySubmit} style={styles.form}>
              <h4 style={styles.formGroupTitle}>1. البيانات الشخصية</h4>
              <input type="text" placeholder="الاسم الكامل بالعربية" required value={applyForm.fullNameAr} onChange={e => setApplyForm({...applyForm, fullNameAr: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="Full Name in English" required value={applyForm.fullNameEn} onChange={e => setApplyForm({...applyForm, fullNameEn: e.target.value})} style={styles.input}/>
              <input type="email" placeholder="البريد الإلكتروني" required value={applyForm.email} onChange={e => setApplyForm({...applyForm, email: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="رقم الهاتف" required value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} style={styles.input}/>

              <h4 style={styles.formGroupTitle}>2. الخلفية الأكاديمية والتقديم</h4>
              <input type="text" readOnly value={`البرنامج / المنحة: ${selectedScholarship}`} style={{...styles.input, background: "#222", color: "#FFD700"}}/>
              <input type="text" placeholder="المعدل التراكمي (GPA)" required value={applyForm.gpa} onChange={e => setApplyForm({...applyForm, gpa: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="اسم الجامعة أو المدرسة" required value={applyForm.institute} onChange={e => setApplyForm({...applyForm, institute: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="التخصص المستهدف" required value={applyForm.targetSpecialty1} onChange={e => setApplyForm({...applyForm, targetSpecialty1: e.target.value})} style={styles.input}/>

              <button type="submit" style={styles.submitFormBtn}>إرسال الملف مباشرة 🚀</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", direction: "rtl", fontFamily: "Cairo, sans-serif", background: "#0a192f", color: "#e2e8f0" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "rgba(2, 12, 27, 0.9)", borderBottom: "2px solid #64ffda", position: "sticky", top: 0, zIndex: 100 },
  logoSection: { fontSize: "20px", fontWeight: "bold", color: "#64ffda" },
  navBar: { display: "flex", gap: "15px" },
  navBtn: { background: "transparent", border: "1px solid #64ffda", color: "#64ffda", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" },
  activeNavBtn: { background: "#64ffda", border: "1px solid #64ffda", color: "#0a192f", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  backBtn: { background: "#ff4a4a", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  mainContent: { padding: "40px" },
  sectionTitle: { textAlign: "center", color: "#fff", fontSize: "32px", marginBottom: "30px" },
  subSectionTitle: { color: "#64ffda", borderBottom: "1px solid #233554", paddingBottom: "10px", marginTop: "30px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", marginTop: "20px" },
  card: { background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "20px", cursor: "pointer" },
  staticCard: { background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "20px" },
  moreLabel: { color: "#64ffda", fontSize: "12px", display: "block", marginTop: "15px", textAlign: "left" },
  detailsView: { background: "rgba(17, 34, 64, 0.95)", border: "2px solid #64ffda", borderRadius: "12px", padding: "30px", marginTop: "20px" },
  closeBtn: { background: "#ff4a4a", border: "none", color: "#fff", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", float: "left" },
  detailsBody: { clear: "both", marginTop: "20px", lineHeight: "1.8" },
  link: { color: "#64ffda", textDecoration: "underline" },
  globalApplyBtn: { background: "linear-gradient(45deg, #00b4db, #0083b0)", color: "#fff", border: "none", padding: "15px 40px", fontSize: "18px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(2,12,27,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
  modalBox: { background: "#0a192f", border: "2px solid #64ffda", borderRadius: "12px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "30px" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #233554", paddingBottom: "15px" },
  miniCloseBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "20px", color: "#fff" },
  form: { marginTop: "20px" },
  formGroupTitle: { color: "#64ffda", marginTop: "20px", marginBottom: "10px", borderRight: "4px solid #64ffda", paddingRight: "10px" },
  input: { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #233554", background: "#112240", color: "#fff", boxSizing: "border-box" },
  submitFormBtn: { width: "100%", padding: "15px", background: "#64ffda", color: "#0a192f", border: "none", borderRadius: "5px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" }
};