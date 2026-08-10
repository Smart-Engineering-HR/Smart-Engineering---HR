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

  // جلب البيانات من السيرفر وقاعدة البيانات مباشرة
  const fetchPublicData = async () => {
    try {
      const res = await fetch("/api/postings?public=true");
      if (!res.ok) throw new Error("Network response was not ok");
      const list = await res.json();

      const structured = {
        proCourses: [], pythonCourses: [], mgmtCourses: [],
        scholarships: [], codes: [], books: [], webinars: [], certificates: []
      };

      list.forEach(item => {
        const cat = item.advertiseType || item.category;
        if (cat === "PRO_COURSE") structured.proCourses.push(item);
        else if (cat === "PYTHON_COURSE") structured.pythonCourses.push(item);
        else if (cat === "MGMT_COURSE") structured.mgmtCourses.push(item);
        else if (cat === "SCHOLARSHIP") structured.scholarships.push(item);
        else if (cat === "CODE") structured.codes.push(item);
        else if (cat === "BOOK") structured.books.push(item);
        else if (cat === "WEBINAR") structured.webinars.push(item);
        else if (cat === "CERTIFICATE") structured.certificates.push(item);
      });

      setData(structured);
    } catch (err) {
      console.error("فشل جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        advertiseType: "APPLICATION",
        scholarshipTitle: selectedScholarship,
        ...applyForm,
        dateSubmitted: new Date().toLocaleString()
      };

      const res = await fetch("/api/postings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("تم إرسال طلبك بنجاح وحفظه في قاعدة البيانات، وسيتم التواصل معك عبر البريد الإلكتروني المرفق.");
        setShowApplyModal(false);
        setApplyForm({
          fullNameAr: "", fullNameEn: "", birthDate: "", nationality: "", residence: "",
          email: "", phone: "", lastDegree: "", gpa: "", institute: "", graduationYear: "",
          currentSpecialty: "", targetDegree: "", targetSpecialty1: "", targetSpecialty2: "",
          langLevel: "none"
        });
      } else {
        alert("حدث خطأ أثناء تقديم الطلب، يرجى المحاولة لاحقاً.");
      }
    } catch (err) {
      alert("فشل الاتصال بالسيرفر أثناء تقديم الطلب.");
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
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#64ffda" }}>جاري تحميل أحدث البيانات والفرص...</div>
        ) : (
          <>
            {/* 1. المسارات التعليمية */}
            {activeTab === "tracks" && !selectedItem && (
              <div>
                <h2 style={styles.sectionTitle}>المسارات التعليمية الاحترافية</h2>
                
                <h3 style={styles.subSectionTitle}>🔹 دورات البرامج الهندسية الاحترافية</h3>
                <div style={styles.grid}>
                  {data.proCourses.map(course => (
                    <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "pro", data: course})}>
                      <h4>{course.title || course.companyName}</h4>
                      <p><strong>المدرب:</strong> {course.trainer || course.contactPerson}</p>
                      <p><strong>المدة:</strong> {course.duration}</p>
                      <span style={styles.moreLabel}>اضغط للتفاصيل الاستراتيجية...</span>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>🔹 دورات التصميم الإنشائي باستخدام Python</h3>
                <div style={styles.grid}>
                  {data.pythonCourses.map(course => (
                    <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "python", data: course})}>
                      <h4>{course.title || course.companyName}</h4>
                      <p><strong>المدرب:</strong> {course.trainer || course.contactPerson}</p>
                      <p><strong>المدة:</strong> {course.duration}</p>
                      <span style={styles.moreLabel}>اضغط للتفاصيل الاستراتيجية...</span>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>🔹 الإدارة الهندسية والمكتب الفني</h3>
                <div style={styles.grid}>
                  {data.mgmtCourses.map(course => (
                    <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "mgmt", data: course})}>
                      <h4>{course.title || course.companyName}</h4>
                      <p><strong>المدرب:</strong> {course.trainer || course.contactPerson}</p>
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
                      <h4>{sch.title || sch.companyName}</h4>
                      <p><strong>الدولة المستضيفة:</strong> {sch.country || sch.address}</p>
                      <p><strong>المراحل المستهدفة:</strong> {sch.degrees}</p>
                      <span style={styles.moreLabel}>عرض ملف المنحة المتكامل...</span>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>📚 الأكواد الهندسية القياسية (Engineering Codes)</h3>
                <div style={styles.grid}>
                  {data.codes.map(code => (
                    <div key={code.id} style={styles.staticCard}>
                      <h4>{code.name || code.companyName}</h4>
                      <p><strong>الرقم والإصدار:</strong> {code.number}</p>
                      <p><strong>النسخة الإقليمية/المحلية:</strong> {code.region || code.address}</p>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>📖 الكتب والمراجع العلمية</h3>
                <div style={styles.grid}>
                  {data.books.map(book => (
                    <div key={book.id} style={styles.staticCard}>
                      <h4>{book.title || book.companyName}</h4>
                      <p><strong>المؤلف:</strong> {book.author || book.contactPerson}</p>
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
                      <h4>{web.title || web.companyName}</h4>
                      <p><strong>الجهة المنظمة:</strong> {web.organizer}</p>
                      <p><strong>التاريخ:</strong> {web.date}</p>
                      <p><strong>الساعات المكتسبة:</strong> {web.hours}</p>
                      <p><strong>المتحدث الخبير:</strong> {web.speaker || web.contactPerson}</p>
                      <p><strong>الملخص والهدف:</strong> {web.summary}</p>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>🏅 الشهادات المهنية المعتمدة</h3>
                <div style={styles.grid}>
                  {data.certificates.map(cert => (
                    <div key={cert.id} style={styles.staticCard}>
                      <h4>{cert.title || cert.companyName}</h4>
                      <p><strong>الجهة المانحة:</strong> {cert.provider}</p>
                      <p><strong>رقم الاعتماد:</strong> {cert.certNumber}</p>
                      <p><strong>تاريخ الحصول والانتهاء:</strong> {cert.dateGet} إلى {cert.dateEnd}</p>
                      {cert.verifyLink && <a href={cert.verifyLink} target="_blank" rel="noreferrer" style={styles.link}>رابط التحقق الرسمي</a>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* صفحة التفاصيل */}
            {selectedItem && (
              <div style={styles.detailsView}>
                <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>❌ إغلاق والعودة للقائمة</button>
                <div style={styles.detailsBody}>
                  {selectedItem.type === "scholarship" && (
                    <>
                      <h2 style={{color: "#00e6ff"}}>{selectedItem.data.title || selectedItem.data.companyName}</h2>
                      <p><strong>الجهة المانحة:</strong> {selectedItem.data.provider}</p>
                      <p><strong>الدولة المستضيفة:</strong> {selectedItem.data.country || selectedItem.data.address}</p>
                      <p><strong>المراحل الدراسية:</strong> {selectedItem.data.degrees}</p>
                      <p><strong>نوع التمويل:</strong> {selectedItem.data.fundType}</p>
                      <p><strong>الرسوم الدراسية:</strong> {selectedItem.data.tuition}</p>
                      <p><strong>الراتب الشهري:</strong> {selectedItem.data.salary}</p>
                      <p><strong>الشروط والجنسيات:</strong> {selectedItem.data.nationalities}</p>
                      <p><strong>تاريخ إغلاق التقديم:</strong> {selectedItem.data.dateClose}</p>
                      {selectedItem.data.linkDirect && <p><strong>رابط مباشر:</strong> <a href={selectedItem.data.linkDirect} target="_blank" rel="noreferrer" style={styles.link}>{selectedItem.data.linkDirect}</a></p>}
                      <hr style={{margin: "20px 0", borderColor: "#00e6ff"}}/>
                      <div style={{textAlign: "center"}}>
                        <button style={styles.globalApplyBtn} onClick={() => { setSelectedScholarship(selectedItem.data.title || selectedItem.data.companyName); setShowApplyModal(true); }}>⚡ التقديم المباشر من خلال المنصة</button>
                      </div>
                    </>
                  )}
                  {selectedItem.type !== "scholarship" && (
                    <>
                      <h2>{selectedItem.data.title || selectedItem.data.companyName}</h2>
                      <p><strong>المدرب/المسؤول:</strong> {selectedItem.data.trainer || selectedItem.data.contactPerson}</p>
                      <p><strong>التفاصيل:</strong> {selectedItem.data.duration || selectedItem.data.summary || selectedItem.data.axes}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* مودال التقديم */}
      {showApplyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3>تقديم احترافي عبر منصة الهندسة الذكية</h3>
              <button style={styles.miniCloseBtn} onClick={() => setShowApplyModal(false)}>❌</button>
            </div>
            <form onSubmit={handleApplySubmit} style={styles.form}>
              <input type="text" placeholder="الاسم الكامل بالعربية" required value={applyForm.fullNameAr} onChange={e => setApplyForm({...applyForm, fullNameAr: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="Full Name in English" required value={applyForm.fullNameEn} onChange={e => setApplyForm({...applyForm, fullNameEn: e.target.value})} style={styles.input}/>
              <input type="email" placeholder="البريد الإلكتروني" required value={applyForm.email} onChange={e => setApplyForm({...applyForm, email: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="رقم الهاتف مع رمز الدولة" required value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} style={styles.input}/>
              <input type="text" readOnly value={`المنحة المختارة: ${selectedScholarship}`} style={{...styles.input, background: "#222", color: "#FFD700"}}/>
              <button type="submit" style={styles.submitFormBtn}>إرسال ملف التقديم وقيده في قاعدة البيانات 🚀</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", direction: "rtl", fontFamily: "Cairo, sans-serif", background: "#0a192f", color: "#e2e8f0" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "#020c1b", borderBottom: "2px solid #64ffda", position: "sticky", top: 0, zIndex: 100 },
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
  modalBox: { background: "#0a192f", border: "2px solid #64ffda", borderRadius: "12px", width: "100%", maxWidth: "600px", padding: "30px" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #233554", paddingBottom: "15px" },
  miniCloseBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "20px", color: "#fff" },
  form: { marginTop: "20px" },
  input: { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #233554", background: "#112240", color: "#fff", boxSizing: "border-box" },
  submitFormBtn: { width: "100%", padding: "15px", background: "#64ffda", color: "#0a192f", border: "none", borderRadius: "5px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" }
};