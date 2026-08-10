"use client";
import React, { useState, useEffect } from "react";

export default function TrainingPublicPage() {
  const [activeTab, setActiveTab] = useState("tracks");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    proCourses: [], pythonCourses: [], mgmtCourses: [],
    scholarships: [], codes: [], books: [], webinars: [], certificates: []
  });

  const [applyForm, setApplyForm] = useState({
    fullNameAr: "", fullNameEn: "", birthDate: "", nationality: "", residence: "",
    email: "", phone: "", lastDegree: "", gpa: "", institute: "", graduationYear: "",
    currentSpecialty: "", targetDegree: "", targetSpecialty1: "", targetSpecialty2: "",
    langLevel: "none"
  });

  const fetchPublicData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/postings?public=true&t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      if (!res.ok) throw new Error("فشل جلب البيانات");
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
      console.error("خطأ جلب البيانات:", err);
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
        alert("تم تسجيل طلبك بنجاح في قاعدة البيانات!");
        setShowApplyModal(false);
      } else {
        alert("حدث خطأ أثناء تقديم الطلب.");
      }
    } catch (err) {
      alert("فشل الاتصال بالسيرفر.");
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
          <div style={{ textAlign: "center", padding: "50px", color: "#64ffda" }}>جاري جلب أحدث البيانات المباشرة من القاعدة...</div>
        ) : (
          <>
            {/* المسارات التعليمية */}
            {activeTab === "tracks" && !selectedItem && (
              <div>
                <h2 style={styles.sectionTitle}>المسارات التعليمية الاحترافية</h2>
                
                <h3 style={styles.subSectionTitle}>🔹 دورات البرامج الهندسية الاحترافية</h3>
                <div style={styles.grid}>
                  {data.proCourses.length === 0 ? <p style={styles.emptyMsg}>لا توجد دورات حالياً</p> : data.proCourses.map(course => (
                    <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "pro", data: course})}>
                      <h4>{course.title || course.companyName || course.name}</h4>
                      <p><strong>المدرب:</strong> {course.trainer || course.contactPerson || "غير محدد"}</p>
                      <p><strong>المدة:</strong> {course.duration || "غير محددة"}</p>
                      <span style={styles.moreLabel}>اضغط للتفاصيل الاستراتيجية...</span>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>🔹 دورات التصميم الإنشائي باستخدام Python</h3>
                <div style={styles.grid}>
                  {data.pythonCourses.length === 0 ? <p style={styles.emptyMsg}>لا توجد دورات حالياً</p> : data.pythonCourses.map(course => (
                    <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "python", data: course})}>
                      <h4>{course.title || course.companyName || course.name}</h4>
                      <p><strong>المدرب:</strong> {course.trainer || course.contactPerson}</p>
                      <p><strong>المدة:</strong> {course.duration}</p>
                      <span style={styles.moreLabel}>اضغط للتفاصيل الاستراتيجية...</span>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>🔹 الإدارة الهندسية والمكتب الفني</h3>
                <div style={styles.grid}>
                  {data.mgmtCourses.length === 0 ? <p style={styles.emptyMsg}>لا توجد دورات حالياً</p> : data.mgmtCourses.map(course => (
                    <div key={course.id} style={styles.card} onClick={() => setSelectedItem({type: "mgmt", data: course})}>
                      <h4>{course.title || course.companyName || course.name}</h4>
                      <p><strong>المدرب:</strong> {course.trainer || course.contactPerson}</p>
                      <p><strong>المدة:</strong> {course.duration}</p>
                      <span style={styles.moreLabel}>اضغط للتفاصيل الاستراتيجية...</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* المصادر الأكاديمية */}
            {activeTab === "sources" && !selectedItem && (
              <div>
                <h2 style={styles.sectionTitle}>المصادر الأكاديمية (المنح، الأكواد، الكتب)</h2>
                
                <h3 style={styles.subSectionTitle}>🎓 المنح الدراسية والبحثية المتاحة</h3>
                <div style={styles.grid}>
                  {data.scholarships.length === 0 ? <p style={styles.emptyMsg}>لا توجد منح متاحة حالياً</p> : data.scholarships.map(sch => (
                    <div key={sch.id} style={styles.card} onClick={() => setSelectedItem({type: "scholarship", data: sch})}>
                      <h4>{sch.title || sch.companyName || sch.name}</h4>
                      <p><strong>الدولة المستضيفة:</strong> {sch.country || sch.address || "غير محدد"}</p>
                      <p><strong>المراحل المستهدفة:</strong> {sch.degrees || "جميع المراحل"}</p>
                      <span style={styles.moreLabel}>عرض ملف المنحة المتكامل...</span>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>📚 الأكواد الهندسية القياسية</h3>
                <div style={styles.grid}>
                  {data.codes.length === 0 ? <p style={styles.emptyMsg}>لا توجد أكواد حالياً</p> : data.codes.map(code => (
                    <div key={code.id} style={styles.staticCard}>
                      <h4>{code.title || code.name || code.companyName}</h4>
                      <p><strong>الرقم والإصدار:</strong> {code.number}</p>
                      <p><strong>المنطقة:</strong> {code.region || code.country || code.address}</p>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>📖 الكتب والمراجع العلمية</h3>
                <div style={styles.grid}>
                  {data.books.length === 0 ? <p style={styles.emptyMsg}>لا توجد كتب حالياً</p> : data.books.map(book => (
                    <div key={book.id} style={styles.staticCard}>
                      <h4>{book.title || book.companyName || book.name}</h4>
                      <p><strong>المؤلف:</strong> {book.author || book.contactPerson}</p>
                      <p><strong>الطبعة:</strong> {book.edition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* التطوير المهني */}
            {activeTab === "dev" && !selectedItem && (
              <div>
                <h2 style={styles.sectionTitle}>التطوير المهني المتقدم والشهادات</h2>
                
                <h3 style={styles.subSectionTitle}>🌐 الندوات الهندسية عبر الإنترنت (Webinars)</h3>
                <div style={styles.grid}>
                  {data.webinars.length === 0 ? <p style={styles.emptyMsg}>لا توجد ندوات حالياً</p> : data.webinars.map(web => (
                    <div key={web.id} style={styles.staticCard}>
                      <h4>{web.title || web.companyName || web.name}</h4>
                      <p><strong>الجهة المنظمة:</strong> {web.organizer}</p>
                      <p><strong>التاريخ:</strong> {web.date}</p>
                    </div>
                  ))}
                </div>

                <h3 style={styles.subSectionTitle}>🏅 الشهادات المهنية المعتمدة</h3>
                <div style={styles.grid}>
                  {data.certificates.length === 0 ? <p style={styles.emptyMsg}>لا توجد شهادات حالياً</p> : data.certificates.map(cert => (
                    <div key={cert.id} style={styles.staticCard}>
                      <h4>{cert.title || cert.companyName || cert.name}</h4>
                      <p><strong>الجهة المانحة:</strong> {cert.provider}</p>
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
                  {selectedItem.type === "scholarship" ? (
                    <>
                      <h2 style={{color: "#00e6ff"}}>{selectedItem.data.title || selectedItem.data.companyName}</h2>
                      <p><strong>الجهة المانحة:</strong> {selectedItem.data.provider || selectedItem.data.contactPerson}</p>
                      <p><strong>الدولة المستضيفة:</strong> {selectedItem.data.country || selectedItem.data.address}</p>
                      <p><strong>المراحل الدراسية:</strong> {selectedItem.data.degrees}</p>
                      <p><strong>الإعفاء والتغطية:</strong> {selectedItem.data.tuition}</p>
                      <p><strong>الراتب الشهري:</strong> {selectedItem.data.salary}</p>
                      <p><strong>تاريخ إغلاق التقديم:</strong> {selectedItem.data.dateClose}</p>
                      <hr style={{margin: "20px 0", borderColor: "#00e6ff"}}/>
                      <div style={{textAlign: "center"}}>
                        <button style={styles.globalApplyBtn} onClick={() => { setSelectedScholarship(selectedItem.data.title || selectedItem.data.companyName); setShowApplyModal(true); }}>⚡ التقديم المباشر من خلال المنصة</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>{selectedItem.data.title || selectedItem.data.companyName}</h2>
                      <p><strong>المحاضر/الجهة:</strong> {selectedItem.data.trainer || selectedItem.data.contactPerson}</p>

                      <p><strong>مدة الدورة:</strong> {selectedItem.data.duration}</p>

                      <p><strong>نوع الشهادة والاعتماد:</strong> {selectedItem.data.certificateType}</p>

                      <p><strong>متطلبات الدورة:</strong> {selectedItem.data.requirements}</p>

                      <p><strong>هوية المدرب والمعلومات:</strong> {selectedItem.data.trainerBio}</p>
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
              <input type="email" placeholder="البريد الإلكتروني" required value={applyForm.email} onChange={e => setApplyForm({...applyForm, email: e.target.value})} style={styles.input}/>
              <input type="text" placeholder="رقم الهاتف" required value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} style={styles.input}/>
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
  emptyMsg: { color: "#8892b0", fontStyle: "italic", padding: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", marginTop: "20px" },
  card: { background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "20px", cursor: "pointer" },
  staticCard: { background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "20px" },
  moreLabel: { color: "#64ffda", fontSize: "12px", display: "block", marginTop: "15px", textAlign: "left" },
  detailsView: { background: "rgba(17, 34, 64, 0.95)", border: "2px solid #64ffda", borderRadius: "12px", padding: "30px", marginTop: "20px" },
  closeBtn: { background: "#ff4a4a", border: "none", color: "#fff", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", float: "left" },
  detailsBody: { clear: "both", marginTop: "20px", lineHeight: "1.8" },
  globalApplyBtn: { background: "linear-gradient(45deg, #00b4db, #0083b0)", color: "#fff", border: "none", padding: "15px 40px", fontSize: "18px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(2,12,27,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
  modalBox: { background: "#0a192f", border: "2px solid #64ffda", borderRadius: "12px", width: "100%", maxWidth: "600px", padding: "30px" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #233554", paddingBottom: "15px" },
  miniCloseBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "20px", color: "#fff" },
  form: { marginTop: "20px" },
  input: { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #233554", background: "#112240", color: "#fff", boxSizing: "border-box" },
  submitFormBtn: { width: "100%", padding: "15px", background: "#64ffda", color: "#0a192f", border: "none", borderRadius: "5px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" }
};