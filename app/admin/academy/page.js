"use client";
import React, { useState, useEffect, useCallback } from "react";

export default function AcademyAdminDashboard() {
  const [targetList, setTargetList] = useState("proCourses");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // حالة تسجيل الدخول
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [formState, setFormState] = useState({});
  const [editId, setEditId] = useState(null);

  const [data, setData] = useState({
    proCourses: [], pythonCourses: [], mgmtCourses: [], scholarships: [],
    codes: [], books: [], webinars: [], certificates: []
  });

  // جلب البيانات من API
  const fetchAcademyData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/academy');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "فشل الجلب من السيرفر");
      }
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
          const formattedItem = { id: item.id, title: item.title, category: item.category, status: item.status, ...detailsObj };

          if (categorized[item.category]) {
            categorized[item.category].push(formattedItem);
          }
        });
      }

      setData(categorized);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/academy-apply');
      if (res.ok) {
        const apps = await res.json();
        setApplications(apps);
      }
    } catch (err) {
      console.error("Fetch Apps Error:", err);
    }
  }, []);

  useEffect(() => {
    const authStatus = localStorage.getItem("smart_admin_logged_in");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    fetchAcademyData();
    fetchApplications();
  }, [fetchAcademyData, fetchApplications]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const correctEmail = "admin@smartacademy.com";
    const correctPassword = "AdminPassword2026";

    if (loginEmail === correctEmail && loginPassword === correctPassword) {
      localStorage.setItem("smart_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setLoginError("❌ البريد الإلكتروني أو كلمة السر غير صحيحة!");
    }
  };

  const handleLogout = () => {
    if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج؟")) {
      localStorage.removeItem("smart_admin_logged_in");
      setIsLoggedIn(false);
    }
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // 🛠️ التعديل الجوهري على handleSubmit لاستخراج وقراءة خطأ السيرفر الحقيقي
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemTitle = formState.title || formState.name || "عنصر أكاديمي جديد";
      
      // استبعاد حقول النظام الأساسية لمنع تكرارها داخل كائن الـ details
      const { id, title, name, category, status, createdAt, updatedAt, ...details } = formState;

      const payload = {
        category: targetList,
        title: itemTitle,
        details: details,
        status: "APPROVED"
      };

      let res;
      if (editId) {
        res = await fetch('/api/academy', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...payload })
        });
      } else {
        res = await fetch('/api/academy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      // استخراج الاستجابة الحقيقية من السيرفر
      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(resData.error || "حدث خطأ غير متوقع أثناء الحفظ في السيرفر");
      }

      setFormState({});
      setEditId(null);
      await fetchAcademyData();
      alert("✅ تمت العملية بنجاح وانعكست مباشرة على قاعدة البيانات وصفحة الجمهور!");
    } catch (err) {
      console.error("Submit Error:", err);
      alert("❌ خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormState(item);
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر نهائياً من قاعدة البيانات؟")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/academy?id=${id}`, { method: 'DELETE' });
      const resData = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(resData.error || "فشل الحذف من قاعدة البيانات");
      
      await fetchAcademyData();
      alert("تم الحذف بنجاح!");
    } catch (err) {
      alert("❌ خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApp = async (id) => {
    if (!confirm("هل تريد حذف هذا الطلب من أرشيف قاعدة البيانات؟")) return;

    try {
      const res = await fetch(`/api/academy-apply?id=${id}`, { method: 'DELETE' });
      const resData = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(resData.error || "فشل الحذف");
      
      await fetchApplications();
    } catch (err) {
      alert("❌ خطأ: " + err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h2 style={{ color: "#64ffda", marginBottom: "10px", textAlign: "center" }}>🔐 تسجيل دخول الإدارة</h2>
          <p style={{ color: "#8892b0", fontSize: "14px", marginBottom: "25px", textAlign: "center" }}>يرجى إدخال بيانات الاعتماد للوصول إلى لوحة تحكم الأكاديمية</p>
          {loginError && <div style={styles.errorMsg}>{loginError}</div>}
          <form onSubmit={handleLoginSubmit}>
            <label style={styles.loginLabel}>البريد الإلكتروني:</label>
            <input type="email" placeholder="example@domain.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={styles.input}/>
            <label style={styles.loginLabel}>كلمة السر:</label>
            <input type="password" placeholder="••••••••" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={styles.input}/>
            <button type="submit" style={styles.loginBtn}>دخول آمن 🚀</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>لوحة تحكم الأكاديمية والتدريب - الإدارة الاحترافية العليا 🛠️</h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <button style={styles.viewBtn} onClick={() => window.open("/training", "_blank")}>👁️ معاينة صفحة الجمهور</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>🚪 تسجيل الخروج</button>
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
          <button style={targetList === "codes" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("codes"); setFormState({}); setEditId(null); }}>الأكواد الهندسية القياسية</button>
          <button style={targetList === "books" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("books"); setFormState({}); setEditId(null); }}>الكتب والمراجع العلمية</button>

          <h3 style={styles.menuTitle}>التطوير المهني والطلبات</h3>
          <button style={targetList === "webinars" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("webinars"); setFormState({}); setEditId(null); }}>الندوات عبر الإنترنت</button>
          <button style={targetList === "certificates" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("certificates"); setFormState({}); setEditId(null); }}>الشهادات المهنية المعتمدة</button>
          <button style={targetList === "applications" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("applications"); setFormState({}); setEditId(null); }}>📥 طلبات التقديم المستقبلة ({applications.length})</button>
        </aside>

        <main style={styles.workspace}>
          {loading && <p style={{ color: "#64ffda" }}>⏳ جاري معالجة البيانات مع السيرفر...</p>}

          {targetList !== "applications" ? (
            <>
              <h3 style={{color: "#64ffda"}}>{editId ? "✍️ تعديل العنصر المحدد حالياً" : "➕ إضافة عنصر جديد إلى القائمة الفرعية"}</h3>
              
              <form onSubmit={handleSubmit} style={styles.adminForm}>
                {targetList === "proCourses" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الدورة التدريبية" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="trainer" placeholder="اسم المدرب" required value={formState.trainer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="duration" placeholder="مدة الدورة (مثال: 50 ساعة)" required value={formState.duration || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="certificate" placeholder="نوع الشهادة والاعتماد" required value={formState.certificate || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="requirements" placeholder="متطلبات الدورة" required value={formState.requirements || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="bio" placeholder="هوية المدرب ومعلومات متكاملة عنه" required value={formState.bio || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {targetList === "pythonCourses" && (
                  <>
                    <input type="text" name="title" placeholder="اسم دورة بايثون الإنشائية" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="trainer" placeholder="اسم المدرب الخبير" required value={formState.trainer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="duration" placeholder="مدة الدورة" required value={formState.duration || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="whyPython" placeholder="لماذا بايثون بالذات في الهندسة الإنشائية؟" required value={formState.whyPython || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="learningOutcomes" placeholder="ماذا ستتعلم في هذه الدورات؟" required value={formState.learningOutcomes || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <input type="text" name="targetAudience" placeholder="لمن تفيد هذه الدورات؟" required value={formState.targetAudience || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="tips" placeholder="نصائح استراتيجية مهمة قبل أن تبدأ" required value={formState.tips || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {targetList === "mgmtCourses" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الدورة الإدارية" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="trainer" placeholder="اسم المدرب" required value={formState.trainer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="duration" placeholder="مدة الدورة" required value={formState.duration || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="axes" placeholder="أهم المحاور والمعلومات" required value={formState.axes || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="importance" placeholder="أهمية هذه الدورات" required value={formState.importance || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="tips" placeholder="نصيحة حاسمة للبدء" required value={formState.tips || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {targetList === "scholarships" && (
                  <>
                    <h4 style={styles.subTitle}>الحقول المتقدمة للمنحة التفصيلية:</h4>
                    <input type="text" name="title" placeholder="اسم المنحة الرسمي" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="provider" placeholder="الجهة المانحة" required value={formState.provider || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="country" placeholder="الدولة المستضيفة" required value={formState.country || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="degrees" placeholder="المراحل الدراسية المستهدفة" required value={formState.degrees || ""} onChange={handleInputChange} style={styles.input}/>
                    
                    <select name="fundType" value={formState.fundType || "منحة كاملة"} onChange={handleInputChange} style={styles.select}>
                      <option value="منحة كاملة">منحة كاملة</option>
                      <option value="منحة جزئية">منحة جزئية</option>
                    </select>
                    
                    <input type="text" name="tuition" placeholder="تفاصيل الإعفاء من الرسوم الدراسية" required value={formState.tuition || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="salary" placeholder="الراتب الشهري" required value={formState.salary || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="housing" placeholder="تأمين السكن الجامعي" required value={formState.housing || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="flights" placeholder="تذاكر الطيران" required value={formState.flights || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="health" placeholder="تفاصيل التأمين الصحي" required value={formState.health || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="visa" placeholder="تكاليف الفيزا" required value={formState.visa || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="nationalities" placeholder="الجنسيات المؤهلة" required value={formState.nationalities || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="age" placeholder="السن المطلوب" required value={formState.age || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="gpa" placeholder="المعدل الأكاديمي GPA" required value={formState.gpa || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="langReq" placeholder="شرط اللغة" required value={formState.langReq || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="specialties" placeholder="التخصصات الكليات والأقسام المشمولة" required value={formState.specialties || ""} onChange={handleInputChange} style={styles.textarea}/>

                    <h5 style={{color: '#64ffda'}}>الجدول الزمني والروابط الرسمية:</h5>
                    <input type="date" name="dateOpen" required value={formState.dateOpen || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateClose" placeholder="تاريخ إغلاق التقديم" required value={formState.dateClose || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateResults" placeholder="موعد إعلان النتائج" required value={formState.dateResults || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateStart" placeholder="موعد بدء الدراسة" required value={formState.dateStart || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="linkDirect" placeholder="رابط بوابة التسجيل المباشر Portal" required value={formState.linkDirect || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="linkOfficial" placeholder="رابط الإعلان الرسمي" required value={formState.linkOfficial || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="applicationFee" placeholder="رسوم التقديم" defaultValue="مجاني بالكامل" onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {targetList === "codes" && (
                  <>
                    <input type="text" name="name" placeholder="الاسم الكامل للكود الهندسي القياسي" required value={formState.name || formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="number" placeholder="رقم الكود وإصدار الدقيق" required value={formState.number || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="region" placeholder="النسخة الإقليمية أو المحلية" required value={formState.region || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {targetList === "books" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الكتاب أو المرجع العلمي" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="author" placeholder="اسم المؤلف" required value={formState.author || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="edition" placeholder="رقم الطبعة" required value={formState.edition || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {targetList === "webinars" && (
                  <>
                    <input type="text" name="title" placeholder="عنوان الويبنار الاستراتيجي" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="organizer" placeholder="الجهة المنظمة" required value={formState.organizer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="date" name="date" required value={formState.date || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="hours" placeholder="عدد الساعات المكتسبة" required value={formState.hours || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="speaker" placeholder="اسم المتحدث" required value={formState.speaker || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="summary" placeholder="الملخص والهدف العام" required value={formState.summary || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {targetList === "certificates" && (
                  <>
                    <input type="text" name="title" placeholder="الاسم الكامل للشهادة المهنية" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="provider" placeholder="الجهة المانحة" required value={formState.provider || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="certNumber" placeholder="رقم الشهادة أو الاعتماد" required value={formState.certNumber || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="date" name="dateGet" placeholder="تاريخ الحصول" required value={formState.dateGet || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="date" name="dateEnd" placeholder="تاريخ الانتهاء" required value={formState.dateEnd || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="verifyLink" placeholder="رابط التحقق الرسمي" required value={formState.verifyLink || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                <button type="submit" style={styles.submitBtn} disabled={loading}>
                  {loading ? "⏳ جاري المعالجة..." : (editId ? "💾 حفظ التعديلات الآن في قاعدة البيانات" : "🚀 نشر وإضافة فورية إلى قاعدة البيانات")}
                </button>
              </form>

              <h3 style={{marginTop: "40px", color: "#fff"}}>📋 العناصر المنشورة حالياً تحت هذا القسم</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>العنوان / الاسم الرئيسي</th>
                      <th>المعرف الفريد (ID)</th>
                      <th>الإجراءات الإدارية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[targetList] && data[targetList].map((item) => (
                      <tr key={item.id}>
                        <td>{item.title || item.name || "عنصر غير معنون"}</td>
                        <td>{item.id}</td>
                        <td>
                          <button style={styles.editBtn} onClick={() => handleEdit(item)}>✍️ تعديل</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>❌ حذف قطعي</button>
                        </td>
                      </tr>
                    ))}
                    {(!data[targetList] || data[targetList].length === 0) && (
                      <tr>
                        <td colSpan="3" style={{textAlign: "center", padding: "20px"}}>لا توجد عناصر منشورة حالياً في هذا القسم. أضف عنصراً لتراه عند الجمهور فوراً!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h3 style={{color: "#FFD700"}}>📥 أرشيف طلبات التقديم والملفات الأكاديمية</h3>
                <button style={styles.viewBtn} onClick={fetchApplications}>🔄 تحديث الطلبات</button>
              </div>

              {applications.map((app) => (
                <div key={app.id} style={styles.appCard}>
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                    <h4>🎯 المنحة / البرنامج المستهدف: <span style={{color: "#64ffda"}}>{app.scholarshipName}</span></h4>
                    <button style={styles.deleteBtn} onClick={() => handleDeleteApp(app.id)}>🗑️ حذف الطلب</button>
                  </div>
                  <p style={{fontSize: "12px", color: "#8892b0"}}>تاريخ التقديم: {new Date(app.createdAt || Date.now()).toLocaleString()}</p>
                  <hr style={{borderColor: "#233554"}}/>
                  <div style={styles.appGrid}>
                    <div>
                      <h5>👤 البيانات الشخصية:</h5>
                      <p><strong>الاسم:</strong> {app.fullName}</p>
                      <p><strong>الإيميل:</strong> {app.email}</p>
                      <p><strong>الهاتف:</strong> {app.phone}</p>
                    </div>
                    <div>
                      <h5>🎓 الخلفية الأكاديمية:</h5>
                      <p><strong>الدرجة المطلوبة:</strong> {app.degree}</p>
                      <p><strong>المعدل التراكمي:</strong> {app.gpa}</p>
                      <p><strong>الجامعة / المؤسسة:</strong> {app.university}</p>
                      <p><strong>التخصص:</strong> {app.major}</p>
                      <p><strong>مستوى اللغة:</strong> {app.languageLevel}</p>
                    </div>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <p style={{textAlign: "center", padding: "40px", color: "#8892b0"}}>لا توجد طلبات تقديم مسجلة في قاعدة البيانات حتى الآن.</p>
              )}
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
  sidebarBtn: { width: "100%", textAlign: "right", background: "transparent", border: "none", color: "#8892b0", padding: "12px", cursor: "pointer", borderRadius: "4px", transition: "0.3s" },
  activeSidebarBtn: { width: "100%", textAlign: "right", background: "#233554", border: "none", color: "#64ffda", padding: "12px", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" },
  workspace: { flex: 1, padding: "40px", background: "#0a192f" },
  adminForm: { background: "#112240", padding: "25px", borderRadius: "8px", border: "1px solid #233554", marginTop: "20px" },
  subTitle: { color: "#fff", margin: "10px 0" },
  input: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #233554", background: "#0a192f", color: "#fff", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #233554", background: "#0a192f", color: "#fff", height: "100px", fontFamily: "inherit", boxSizing: "border-box" },
  select: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #233554", background: "#0a192f", color: "#fff" },
  submitBtn: { background: "#64ffda", color: "#0a192f", padding: "12px 30px", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%" },
  tableWrapper: { marginTop: "20px", background: "#112240", borderRadius: "8px", overflow: "hidden", border: "1px solid #233554" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "right" },
  editBtn: { background: "#ffc107", border: "none", color: "#000", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", marginLeft: "10px", fontWeight: "bold" },
  deleteBtn: { background: "#dc3545", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  appCard: { background: "#112240", border: "1px solid #ff4a4a", borderRadius: "8px", padding: "20px", marginBottom: "20px" },
  appGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" },
  loginContainer: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a192f", fontFamily: "Cairo, sans-serif", direction: "rtl" },
  loginCard: { background: "#112240", padding: "40px", borderRadius: "10px", border: "1px solid #233554", width: "100%", maxWidth: "450px", boxShadow: "0px 10px 30px rgba(0,0,0,0.5)" },
  loginLabel: { display: "block", color: "#e2e8f0", marginBottom: "8px", fontSize: "14px" },
  loginBtn: { background: "#64ffda", color: "#0a192f", padding: "12px", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: "10px", transition: "0.3s" },
  errorMsg: { background: "rgba(220, 53, 69, 0.2)", color: "#ff4a4a", border: "1px solid #dc3545", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "center", fontSize: "14px" }
};