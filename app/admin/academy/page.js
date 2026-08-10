"use client";
import React, { useState, useEffect } from "react";

export default function AcademyAdminDashboard() {
  const [targetList, setTargetList] = useState("proCourses");
  const [applications, setApplications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [formState, setFormState] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    proCourses: [], pythonCourses: [], mgmtCourses: [], scholarships: [],
    codes: [], books: [], webinars: [], certificates: []
  });

  const categoryMapping = {
    proCourses: "PRO_COURSE",
    pythonCourses: "PYTHON_COURSE",
    mgmtCourses: "MGMT_COURSE",
    scholarships: "SCHOLARSHIP",
    codes: "CODE",
    books: "BOOK",
    webinars: "WEBINAR",
    certificates: "CERTIFICATE"
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/postings?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const list = await res.json();

      const structured = {
        proCourses: [], pythonCourses: [], mgmtCourses: [],
        scholarships: [], codes: [], books: [], webinars: [], certificates: []
      };
      const apps = [];

      list.forEach(item => {
        const cat = item.advertiseType || item.category;
        if (cat === "APPLICATION") apps.push(item);
        else if (cat === "PRO_COURSE") structured.proCourses.push(item);
        else if (cat === "PYTHON_COURSE") structured.pythonCourses.push(item);
        else if (cat === "MGMT_COURSE") structured.mgmtCourses.push(item);
        else if (cat === "SCHOLARSHIP") structured.scholarships.push(item);
        else if (cat === "CODE") structured.codes.push(item);
        else if (cat === "BOOK") structured.books.push(item);
        else if (cat === "WEBINAR") structured.webinars.push(item);
        else if (cat === "CERTIFICATE") structured.certificates.push(item);
      });

      setData(structured);
      setApplications(apps);
    } catch (err) {
      console.error("خطأ جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("smart_admin_logged_in");
    if (authStatus === "true") {
      setIsLoggedIn(true);
      fetchAllData();
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@smartacademy.com" && loginPassword === "AdminPassword2026") {
      localStorage.setItem("smart_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
      fetchAllData();
    } else {
      setLoginError("❌ البيانات غير صحيحة!");
    }
  };

  const handleLogout = () => {
    if (confirm("تسجيل الخروج؟")) {
      localStorage.removeItem("smart_admin_logged_in");
      setIsLoggedIn(false);
    }
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = categoryMapping[targetList];
    const payload = {
      ...formState,
      category: category,
      advertiseType: category,
      status: "APPROVED"
    };

    try {
      const method = editId ? "PUT" : "POST";
      if (editId) payload.id = editId;

      const res = await fetch("/api/postings", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("تم النشر بنجاح في قاعدة البيانات وتحديث صفحة الجمهور!");
        setFormState({});
        setEditId(null);
        fetchAllData();
      } else {
        alert("حدث خطأ أثناء عملية الحفظ.");
      }
    } catch (err) {
      alert("فشل الاتصال بالسيرفر أثناء الحفظ.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormState(item);
  };

  const handleDelete = async (id) => {
    if (confirm("حذف هذا العنصر تماماً؟")) {
      try {
        const res = await fetch(`/api/postings?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchAllData();
      } catch (err) {
        alert("خطأ أثناء الحذف.");
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h2 style={{ color: "#64ffda", textAlign: "center" }}>🔐 دخول الإدارة</h2>
          {loginError && <div style={styles.errorMsg}>{loginError}</div>}
          <form onSubmit={handleLoginSubmit}>
            <input type="email" placeholder="البريد الإلكتروني" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={styles.input}/>
            <input type="password" placeholder="كلمة السر" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={styles.input}/>
            <button type="submit" style={styles.loginBtn}>دخول 🚀</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>لوحة تحكم الأكاديمية والتدريب - الإدارة العليا 🛠️</h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <button style={styles.viewBtn} onClick={() => window.open("/training", "_blank")}>👁️ معاينة صفحة الجمهور</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>🚪 خروج</button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <h3 style={styles.menuTitle}>المسارات التعليمية</h3>
          <button style={targetList === "proCourses" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("proCourses"); setFormState({}); setEditId(null); }}>دورات البرامج الاحترافية</button>
          <button style={targetList === "pythonCourses" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("pythonCourses"); setFormState({}); setEditId(null); }}>دورات Python الإنشائية</button>
          <button style={targetList === "mgmtCourses" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("mgmtCourses"); setFormState({}); setEditId(null); }}>الإدارة الهندسية والمكتب الفني</button>

          <h3 style={styles.menuTitle}>المصادر الأكاديمية</h3>
          <button style={targetList === "scholarships" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("scholarships"); setFormState({}); setEditId(null); }}>إدارة المنح الكاملة والجزئية</button>
          <button style={targetList === "codes" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("codes"); setFormState({}); setEditId(null); }}>الأكواد الهندسية</button>
          <button style={targetList === "books" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("books"); setFormState({}); setEditId(null); }}>الكتب والمراجع</button>

          <h3 style={styles.menuTitle}>التطوير والطلبات</h3>
          <button style={targetList === "webinars" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("webinars"); setFormState({}); setEditId(null); }}>الندوات عبر الإنترنت</button>
          <button style={targetList === "certificates" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("certificates"); setFormState({}); setEditId(null); }}>الشهادات المهنية</button>
          <button style={targetList === "applications" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("applications"); setFormState({}); setEditId(null); }}>📥 طلبات التقديم ({applications.length})</button>
        </aside>

        <main style={styles.workspace}>
          {targetList !== "applications" ? (
            <>
              <h3 style={{color: "#64ffda"}}>{editId ? "✍️ تعديل العنصر" : "➕ إضافة عنصر جديد إلى القائمة الفرعية"}</h3>
              
              <form onSubmit={handleSubmit} style={styles.adminForm}>
                <input type="text" name="title" placeholder="اسم الدورة التدريبية" required value={formState.title || formState.name || ""} onChange={handleInputChange} style={styles.input}/>
                
                {targetList.includes("Courses") && (
                  <>
                    <input type="text" name="trainer" placeholder="اسم المدرب" required value={formState.trainer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="duration" placeholder="مدة الدورة (مثال: 50 ساعة)" required value={formState.duration || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="certificateType" placeholder="نوع الشهادة والاعتماد" value={formState.certificateType || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="requirements" placeholder="متطلبات الدورة" value={formState.requirements || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="trainerBio" placeholder="هوية المدرب ومعلومات متكاملة عنه" value={formState.trainerBio || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {targetList === "scholarships" && (
                  <>
                    <input type="text" name="provider" placeholder="الجهة المانحة" required value={formState.provider || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="country" placeholder="الدولة المستضيفة" required value={formState.country || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="degrees" placeholder="المراحل الدراسية" required value={formState.degrees || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="tuition" placeholder="الإعفاء والتغطية المالية" value={formState.tuition || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="salary" placeholder="الراتب الشهري" value={formState.salary || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateClose" placeholder="تاريخ إغلاق التقديم" value={formState.dateClose || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                <button type="submit" style={styles.submitBtn}>{editId ? "💾 حفظ التعديلات" : "🚀 نشر وإضافة فورية لقائمة الجمهور"}</button>
              </form>

              <h3 style={{marginTop: "40px", color: "#fff"}}>📋 العناصر المنشورة حالياً تحت هذا القسم</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>العنوان / الاسم الرئيسي</th>
                      <th>المعرف الفريد</th>
                      <th>الإجراءات الإدارية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[targetList] && data[targetList].map((item) => (
                      <tr key={item.id}>
                        <td>{item.title || item.companyName || item.name}</td>
                        <td>{item.id}</td>
                        <td>
                          <button style={styles.editBtn} onClick={() => handleEdit(item)}>✍️ تعديل</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>❌ حذف قطعي</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div>
              <h3 style={{color: "#FFD700"}}>📥 طلبات التقديم المستقبلة</h3>
              {applications.map((app) => (
                <div key={app.id} style={styles.appCard}>
                  <h4>🎯 المنحة: <span style={{color: "#64ffda"}}>{app.scholarshipTitle}</span></h4>
                  <p><strong>الاسم:</strong> {app.fullNameAr} | <strong>الإيميل:</strong> {app.email} | <strong>الهاتف:</strong> {app.phone}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", direction: "rtl", fontFamily: "Cairo, sans-serif", background: "#0a192f", color: "#e2e8f0" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "#020c1b", borderBottom: "2px solid #64ffda" },
  viewBtn: { background: "#64ffda", color: "#0a192f", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  logoutBtn: { background: "#dc3545", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  layout: { display: "flex", minHeight: "calc(100vh - 84px)" },
  sidebar: { width: "300px", background: "#112240", padding: "20px", borderLeft: "1px solid #233554" },
  menuTitle: { color: "#64ffda", fontSize: "16px", marginTop: "20px", marginBottom: "10px", borderBottom: "1px solid #233554", paddingBottom: "5px" },
  sidebarBtn: { width: "100%", textAlign: "right", background: "transparent", border: "none", color: "#8892b0", padding: "12px", cursor: "pointer", borderRadius: "4px" },
  activeSidebarBtn: { width: "100%", textAlign: "right", background: "#233554", border: "none", color: "#64ffda", padding: "12px", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" },
  workspace: { flex: 1, padding: "40px", background: "#0a192f" },
  adminForm: { background: "#112240", padding: "25px", borderRadius: "8px", border: "1px solid #233554", marginTop: "20px" },
  input: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #233554", background: "#0a192f", color: "#fff", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #233554", background: "#0a192f", color: "#fff", height: "80px", boxSizing: "border-box" },
  submitBtn: { background: "#64ffda", color: "#0a192f", padding: "12px 30px", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%" },
  tableWrapper: { marginTop: "20px", background: "#112240", borderRadius: "8px", overflow: "hidden", border: "1px solid #233554" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "right" },
  editBtn: { background: "#ffc107", border: "none", color: "#000", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", marginLeft: "10px", fontWeight: "bold" },
  deleteBtn: { background: "#dc3545", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  appCard: { background: "#112240", border: "1px solid #64ffda", borderRadius: "8px", padding: "20px", marginBottom: "15px" },
  loginContainer: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a192f", fontFamily: "Cairo, sans-serif", direction: "rtl" },
  loginCard: { background: "#112240", padding: "40px", borderRadius: "10px", border: "1px solid #233554", width: "100%", maxWidth: "450px" },
  loginBtn: { background: "#64ffda", color: "#0a192f", padding: "12px", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: "10px" },
  errorMsg: { background: "rgba(220, 53, 69, 0.2)", color: "#ff4a4a", border: "1px solid #dc3545", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "center" }
};