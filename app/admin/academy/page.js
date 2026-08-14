"use client";
import React, { useState, useEffect, useCallback } from "react";

export default function AcademyAdminDashboard() {
  const [targetList, setTargetList] = useState("proCourses");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  
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

  const fetchAcademyData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/academy');
      if (!res.ok) throw new Error("فشل الجلب من السيرفر");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemTitle = formState.title || formState.name || "عنصر أكاديمي جديد";
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

      if (!res.ok) throw new Error("حدث خطأ أثناء الحفظ");

      setFormState({});
      setEditId(null);
      await fetchAcademyData();
      alert("✅ تمت العملية بنجاح وانعكست في قاعدة البيانات صفحة الجمهور!");
    } catch (err) {
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
      if (!res.ok) throw new Error("فشل الحذف");
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
      if (!res.ok) throw new Error("فشل الحذف");
      await fetchApplications();
    } catch (err) {
      alert("❌ خطأ: " + err.message);
    }
  };

  // دالة تحويل وعرض أزرار تنزيل الملف المرفوع في لوحة الأدمن
  const renderFileDownloadBtn = (label, fileItem) => {
    if (!fileItem) return <p style={{ fontSize: "12px", margin: "2px 0", color: "#8892b0" }}>📄 {label}: غير مرفق</p>;

    if (typeof fileItem === 'object' && fileItem.data) {
      return (
        <div style={{ margin: "4px 0" }}>
          <span style={{ fontSize: "12px", color: "#64ffda" }}>📄 {label}: </span>
          <a
            href={fileItem.data}
            download={fileItem.name || "document"}
            style={{
              background: "#64ffda",
              color: "#0a192f",
              padding: "3px 10px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "12px",
              display: "inline-block",
              marginRight: "5px"
            }}
          >
            📥 فتح/تنزيل الملف ({fileItem.name})
          </a>
        </div>
      );
    }

    return <p style={{ fontSize: "12px", margin: "2px 0", color: "#fff" }}>📄 {label}: {String(fileItem)}</p>;
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h2 style={{ color: "#64ffda", marginBottom: "10px", textAlign: "center" }}>🔐 تسجيل دخول الإدارة</h2>
          <p style={{ color: "#8892b0", fontSize: "14px", marginBottom: "25px", textAlign: "center" }}>لوحة تحكم الأكاديمية والتدريب - منصة الهندسة الذكية</p>
          {loginError && <div style={styles.errorMsg}>{loginError}</div>}
          <form onSubmit={handleLoginSubmit}>
            <label style={styles.loginLabel}>البريد الإلكتروني:</label>
            <input type="email" placeholder="admin@smartacademy.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={styles.input}/>
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
        <h2>لوحة تحكم الأكاديمية والتدريب - الإدارة العليا 🛠️</h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <button style={styles.viewBtn} onClick={() => window.open("/training", "_blank")}>👁️ معاينة صفحة الجمهور</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>🚪 تسجيل الخروج</button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <h3 style={styles.menuTitle}>A. المسارات التعليمية</h3>
          <button style={targetList === "proCourses" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("proCourses"); setFormState({}); setEditId(null); }}>
            دورات البرامج الاحترافية
          </button>
          <button style={targetList === "pythonCourses" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("pythonCourses"); setFormState({}); setEditId(null); }}>
            دورات التصميم بـ Python
          </button>
          <button style={targetList === "mgmtCourses" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("mgmtCourses"); setFormState({}); setEditId(null); }}>
            الإدارة الهندسية والمكتب الفني
          </button>

          <h3 style={styles.menuTitle}>B. المصادر الأكاديمية</h3>
          <button style={targetList === "scholarships" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("scholarships"); setFormState({}); setEditId(null); }}>
            إدارة المنح التفصيلية
          </button>
          <button style={targetList === "codes" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("codes"); setFormState({}); setEditId(null); }}>
            الأكواد الهندسية القياسية
          </button>
          <button style={targetList === "books" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("books"); setFormState({}); setEditId(null); }}>
            الكتب والمراجع العلمية
          </button>

          <h3 style={styles.menuTitle}>C. التطوير المهني والطلبات</h3>
          <button style={targetList === "webinars" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("webinars"); setFormState({}); setEditId(null); }}>
            الندوات عبر الإنترنت (Webinars)
          </button>
          <button style={targetList === "certificates" ? styles.activeSidebarBtn : styles.sidebarBtn} onClick={() => { setTargetList("certificates"); setFormState({}); setEditId(null); }}>
            الشهادات المهنية المعتمدة
          </button>
          <button 
            style={targetList === "applications" ? styles.activeSidebarBtn : styles.sidebarBtn} 
            onClick={() => { setTargetList("applications"); setFormState({}); setEditId(null); fetchApplications(); }}
          >
            📥 طلبات التقديم المستقبلة ({applications.length})
          </button>
        </aside>

        <main style={styles.workspace}>
          {loading && <p style={{ color: "#64ffda" }}>⏳ جاري معالجة البيانات مع السيرفر وقاعدة البيانات...</p>}

          {targetList !== "applications" ? (
            <>
              <h3 style={{color: "#64ffda"}}>{editId ? "✍️ تعديل العنصر المحدد حالياً" : "➕ إضافة عنصر جديد إلى القائمة الفرعية"}</h3>
              
              <form onSubmit={handleSubmit} style={styles.adminForm}>
                {/* 1. دورات البرامج الهندسية الاحترافية */}
                {targetList === "proCourses" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الدورة" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="trainer" placeholder="اسم المدرب" required value={formState.trainer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="duration" placeholder="مدة الدورة" required value={formState.duration || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="certificate" placeholder="نوع الشهادة والاعتماد" required value={formState.certificate || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="requirements" placeholder="متطلبات الدورة" required value={formState.requirements || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="bio" placeholder="هوية المدرب ومعلومات عنه" required value={formState.bio || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {/* 2. دورات التصميم الإنشائي باستخدام Python */}
                {targetList === "pythonCourses" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الدورة" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="trainer" placeholder="اسم المدرب" required value={formState.trainer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="duration" placeholder="مدة الدورة" required value={formState.duration || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="whyPython" placeholder="لماذا بايثون بالذات في الهندسة الإنشائية؟" required value={formState.whyPython || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="learningOutcomes" placeholder="ماذا ستتعلم في هذه الدورات؟" required value={formState.learningOutcomes || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <input type="text" name="targetAudience" placeholder="لمن تفيد هذه الدورات؟" required value={formState.targetAudience || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="tips" placeholder="نصائح مهمة قبل أن تبدأ" required value={formState.tips || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {/* 3. الإدارة الهندسية والمكتب الفني */}
                {targetList === "mgmtCourses" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الدورة" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="trainer" placeholder="اسم المدرب" required value={formState.trainer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="duration" placeholder="مدة الدورة" required value={formState.duration || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="axes" placeholder="أهم المحاور والمعلومات" required value={formState.axes || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="importance" placeholder="أهمية هذه الدورات" required value={formState.importance || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="tips" placeholder="نصيحة للبدء" required value={formState.tips || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {/* 4. إدارة المنح التفصيلية */}
                {targetList === "scholarships" && (
                  <>
                    <h4 style={styles.subTitle}>1. المعلومات الأساسية للمنحة:</h4>
                    <input type="text" name="title" placeholder="اسم المنحة الرسمي" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="provider" placeholder="الجهة المانحة" required value={formState.provider || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="country" placeholder="الدولة المستضيفة" required value={formState.country || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="degrees" placeholder="المراحل الدراسية المستهدفة" required value={formState.degrees || ""} onChange={handleInputChange} style={styles.input}/>
                    
                    <h4 style={styles.subTitle}>2. التمويل والمزايا المالية:</h4>
                    <select name="fundType" value={formState.fundType || "منحة كاملة"} onChange={handleInputChange} style={styles.select}>
                      <option value="منحة كاملة">منحة كاملة</option>
                      <option value="منحة جزئية">منحة جزئية</option>
                    </select>
                    <input type="text" name="fundPartialDetails" placeholder="تفاصيل التغطية الجزئية" value={formState.fundPartialDetails || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="tuition" placeholder="الإعفاء من الرسوم الدراسية" required value={formState.tuition || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="salary" placeholder="الراتب الشهري" required value={formState.salary || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="housing" placeholder="السكن الجامعي" required value={formState.housing || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="flights" placeholder="تذاكر الطيران" required value={formState.flights || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="health" placeholder="التأمين الصحي" required value={formState.health || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="visa" placeholder="تكاليف الفيزا والسنة التحضيرية" required value={formState.visa || ""} onChange={handleInputChange} style={styles.input}/>

                    <h4 style={styles.subTitle}>3. شروط الأهلية والقبول:</h4>
                    <input type="text" name="nationalities" placeholder="الجنسيات المؤهلة" required value={formState.nationalities || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="age" placeholder="السن المطلوب" required value={formState.age || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="gpa" placeholder="المعدل الأكاديمي الأدنى" required value={formState.gpa || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="langReq" placeholder="شرط اللغة" required value={formState.langReq || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="specialties" placeholder="التخصصات المتاحة" required value={formState.specialties || ""} onChange={handleInputChange} style={styles.textarea}/>

                    <h4 style={styles.subTitle}>4. الوثائق والمستندات المطلوبة:</h4>
                    <textarea name="requiredDocs" placeholder="المستندات المطلوبة" required value={formState.requiredDocs || ""} onChange={handleInputChange} style={styles.textarea}/>

                    <h4 style={styles.subTitle}>5. مواعيد التقديم والروابط الرسمية:</h4>
                    <input type="text" name="dateOpen" placeholder="تاريخ فتح التقديم" required value={formState.dateOpen || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateClose" placeholder="تاريخ إغلاق التقديم (Deadline)" required value={formState.dateClose || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateResults" placeholder="موعد إعلان النتائج" required value={formState.dateResults || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateStart" placeholder="موعد بدء الدراسة" required value={formState.dateStart || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="linkDirect" placeholder="رابط التقديم المباشر (Portal)" value={formState.linkDirect || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="linkOfficial" placeholder="رابط الإعلان الرسمي" value={formState.linkOfficial || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="applicationFee" placeholder="رسوم التقديم" defaultValue="مجاني بالكامل" onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {/* 5. الأكواد الهندسية */}
                {targetList === "codes" && (
                  <>
                    <input type="text" name="name" placeholder="الاسم الكامل للكود" required value={formState.name || formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="number" placeholder="رقم الكود وإصداره" required value={formState.number || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="region" placeholder="النسخة الإقليمية / المحلية" required value={formState.region || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {/* 6. الكتب والمراجع العلمية */}
                {targetList === "books" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الكتاب" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="author" placeholder="اسم المؤلف" required value={formState.author || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="edition" placeholder="رقم الطبعة" required value={formState.edition || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {/* 7. الندوات عبر الإنترنت */}
                {targetList === "webinars" && (
                  <>
                    <input type="text" name="title" placeholder="عنوان الويبنار" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="organizer" placeholder="الجهة المنظمة" required value={formState.organizer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="date" placeholder="تاريخ الانعقاد" required value={formState.date || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="hours" placeholder="عدد الساعات" required value={formState.hours || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="speaker" placeholder="اسم المتحدث" required value={formState.speaker || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="summary" placeholder="الملخص والهدف" required value={formState.summary || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {/* 8. الشهادات المهنية المعتمدة */}
                {targetList === "certificates" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الشهادة" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="provider" placeholder="الجهة المانحة" required value={formState.provider || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="certNumber" placeholder="رقم الاعتماد" required value={formState.certNumber || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateGet" placeholder="تاريخ الحصول" required value={formState.dateGet || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateEnd" placeholder="تاريخ الانتهاء" required value={formState.dateEnd || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="verifyLink" placeholder="رابط التحقق الرسمي" required value={formState.verifyLink || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                <button type="submit" style={styles.submitBtn} disabled={loading}>
                  {loading ? "⏳ جاري المعالجة..." : (editId ? "💾 حفظ التعديلات الآن" : "🚀 نشر وإضافة فورية")}
                </button>
              </form>

              <h3 style={{marginTop: "40px", color: "#fff"}}>📋 العناصر المنشورة حالياً</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>العنوان / الاسم الرئيسي</th>
                      <th style={styles.th}>المعرف الفريد (ID)</th>
                      <th style={styles.th}>الإجراءات الإدارية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[targetList] && data[targetList].map((item) => (
                      <tr key={item.id} style={{borderBottom: "1px solid #233554"}}>
                        <td style={styles.td}>{item.title || item.name || "عنصر غير معنون"}</td>
                        <td style={styles.td}>{item.id}</td>
                        <td style={styles.td}>
                          <button style={styles.editBtn} onClick={() => handleEdit(item)}>✍️ تعديل</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>❌ حذف قطعي</button>
                        </td>
                      </tr>
                    ))}
                    {(!data[targetList] || data[targetList].length === 0) && (
                      <tr>
                        <td colSpan="3" style={{textAlign: "center", padding: "20px", color: "#8892b0"}}>لا توجد عناصر منشورة حالياً في هذا القسم.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h3 style={{color: "#FFD700"}}>📥 أرشيف طلبات التقديم والملفات الأكاديمية المستقبلة</h3>
                <button style={styles.viewBtn} onClick={fetchApplications}>🔄 تحديث الطلبات فوراً</button>
              </div>

              {applications.map((app) => (
                <div key={app.id} style={styles.appCard}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <h4 style={{margin: 0, color: "#64ffda"}}>🎯 المنحة المستهدفة: {app.scholarshipName || app.scholarshipTitle || "منحة عامة"}</h4>
                    <button style={styles.deleteBtn} onClick={() => handleDeleteApp(app.id)}>🗑️ حذف الطلب</button>
                  </div>
                  <p style={{fontSize: "12px", color: "#8892b0", marginTop: "5px"}}>تاريخ التقديم: {new Date(app.createdAt || Date.now()).toLocaleString('ar-EG')}</p>
                  <hr style={{borderColor: "#233554", margin: "10px 0"}}/>
                  
                  <div style={styles.appGrid}>
                    <div>
                      <h5 style={{color: "#00e6ff", margin: "5px 0"}}>👤 البيانات الشخصية:</h5>
                      <p style={styles.appDetailText}><strong>الاسم بالعربية:</strong> {app.fullNameAr || app.fullName}</p>
                      <p style={styles.appDetailText}><strong>Name in English:</strong> {app.fullNameEn || "-"}</p>
                      <p style={styles.appDetailText}><strong>تاريخ الميلاد والمنشأ:</strong> {app.birthDate || "-"}</p>
                      <p style={styles.appDetailText}><strong>الجنسية الحالية:</strong> {app.nationality || "-"}</p>
                      <p style={styles.appDetailText}><strong>بلد الإقامة:</strong> {app.residence || "-"}</p>
                      <p style={styles.appDetailText}><strong>البريد الإلكتروني:</strong> {app.email}</p>
                      <p style={styles.appDetailText}><strong>رقم الهاتف:</strong> {app.phone}</p>
                    </div>

                    <div>
                      <h5 style={{color: "#00e6ff", margin: "5px 0"}}>🎓 الخلفية الأكاديمية:</h5>
                      <p style={styles.appDetailText}><strong>آخر مؤهل:</strong> {app.lastDegree || app.degree}</p>
                      <p style={styles.appDetailText}><strong>المعدل التراكمي:</strong> {app.gpa}</p>
                      <p style={styles.appDetailText}><strong>المؤسسة / الجامعة:</strong> {app.institute || app.university}</p>
                      <p style={styles.appDetailText}><strong>التخصص السابق:</strong> {app.currentSpecialty || app.major}</p>
                      <p style={styles.appDetailText}><strong>الدرجة المستهدفة:</strong> {app.targetDegree}</p>
                      <p style={styles.appDetailText}><strong>التخصص المرغوب (1):</strong> {app.targetSpecialty1}</p>
                      <p style={styles.appDetailText}><strong>التخصص المرغوب (2):</strong> {app.targetSpecialty2 || "-"}</p>
                      <p style={styles.appDetailText}><strong>مستوى اللغة:</strong> {app.englishProficiency || app.languageLevel}</p>
                    </div>
                  </div>

                  <div style={{marginTop: "12px", background: "#0a192f", padding: "12px", borderRadius: "6px", border: "1px solid #233554"}}>
                    <h5 style={{color: "#ffd700", margin: "0 0 8px 0"}}>📁 الملفات المرفوعة (تنزيل وفتح فورياً):</h5>
                    {renderFileDownloadBtn("جواز السفر", app.passportCopy)}
                    {renderFileDownloadBtn("الشهادات الأكاديمية", app.academicCertificates)}
                    {renderFileDownloadBtn("خطاب الدافع", app.motivationLetter)}
                    {renderFileDownloadBtn("السيرة الذاتية", app.cvResume)}
                    {renderFileDownloadBtn("خطابات التوصية", app.recommendationLetters)}
                    {renderFileDownloadBtn("شهادة اللغة", app.languageCert)}
                    {renderFileDownloadBtn("الصورة الشخصية", app.personalPhoto)}
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", background: "#020c1b", borderBottom: "2px solid #64ffda" },
  viewBtn: { background: "#64ffda", color: "#0a192f", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  logoutBtn: { background: "#dc3545", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  layout: { display: "flex", minHeight: "calc(100vh - 70px)" },
  sidebar: { width: "280px", background: "#112240", padding: "15px", borderLeft: "1px solid #233554" },
  menuTitle: { color: "#64ffda", fontSize: "14px", marginTop: "15px", marginBottom: "8px", borderBottom: "1px solid #233554", paddingBottom: "4px" },
  sidebarBtn: { width: "100%", textAlign: "right", background: "transparent", border: "none", color: "#8892b0", padding: "10px", cursor: "pointer", borderRadius: "4px", fontSize: "13px" },
  activeSidebarBtn: { width: "100%", textAlign: "right", background: "#233554", border: "none", color: "#64ffda", padding: "10px", cursor: "pointer", borderRadius: "4px", fontWeight: "bold", fontSize: "13px" },
  workspace: { flex: 1, padding: "30px", background: "#0a192f" },
  adminForm: { background: "#112240", padding: "20px", borderRadius: "8px", border: "1px solid #233554", marginTop: "15px" },
  subTitle: { color: "#64ffda", margin: "15px 0 8px 0", fontSize: "15px", borderRight: "3px solid #64ffda", paddingRight: "8px" },
  input: { width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #233554", background: "#0a192f", color: "#fff", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #233554", background: "#0a192f", color: "#fff", height: "80px", fontFamily: "inherit", boxSizing: "border-box" },
  select: { width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "5px", border: "1px solid #233554", background: "#0a192f", color: "#fff", boxSizing: "border-box" },
  submitBtn: { background: "#64ffda", color: "#0a192f", padding: "12px 25px", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: "10px" },
  tableWrapper: { marginTop: "15px", background: "#112240", borderRadius: "8px", overflow: "hidden", border: "1px solid #233554" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "right" },
  th: { padding: "12px", background: "#020c1b", color: "#64ffda" },
  td: { padding: "12px", color: "#e2e8f0" },
  editBtn: { background: "#ffc107", border: "none", color: "#000", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", marginLeft: "8px", fontWeight: "bold" },
  deleteBtn: { background: "#dc3545", border: "none", color: "#fff", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  appCard: { background: "#112240", border: "1px solid #233554", borderRadius: "8px", padding: "15px", marginBottom: "15px" },
  appGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  appDetailText: { margin: "3px 0", fontSize: "13px" },
  loginContainer: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a192f", fontFamily: "Cairo, sans-serif", direction: "rtl" },
  loginCard: { background: "#112240", padding: "35px", borderRadius: "10px", border: "1px solid #233554", width: "100%", maxWidth: "400px", boxShadow: "0px 10px 30px rgba(0,0,0,0.5)" },
  loginLabel: { display: "block", color: "#e2e8f0", marginBottom: "6px", fontSize: "13px" },
  loginBtn: { background: "#64ffda", color: "#0a192f", padding: "10px", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: "10px" },
  errorMsg: { background: "rgba(220, 53, 69, 0.2)", color: "#ff4a4a", border: "1px solid #dc3545", padding: "8px", borderRadius: "5px", marginBottom: "12px", textAlign: "center", fontSize: "13px" }
};