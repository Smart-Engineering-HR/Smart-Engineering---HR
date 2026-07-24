"use client";
import React, { useState, useEffect } from "react";

export default function AcademyAdminDashboard() {
  const [targetList, setTargetList] = useState("proCourses");
  const [applications, setApplications] = useState([]);
  
  // تجميعة الحقول لكافة الأشكال الإدارية
  const [formState, setFormState] = useState({});
  const [editId, setEditId] = useState(null);

  const [data, setData] = useState({
    proCourses: [], pythonCourses: [], mgmtCourses: [], scholarships: [],
    codes: [], books: [], webinars: [], certificates: []
  });

  // جلب البيانات من المخرن المشترك لمزامنة التغيير فوراً
  useEffect(() => {
    const stored = localStorage.getItem("smart_academy_data");
    if (stored) setData(JSON.parse(stored));
    
    const apps = localStorage.getItem("smart_applications");
    if (apps) setApplications(JSON.parse(apps));
  }, []);

  const saveData = (updatedData) => {
    setData(updatedData);
    localStorage.setItem("smart_academy_data", JSON.stringify(updatedData));
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedList = [...data[targetList]];

    if (editId) {
      // تعديل عنصر حالي
      updatedList = updatedList.map(item => item.id === editId ? { ...item, ...formState } : item);
      setEditId(null);
    } else {
      // إضافة عنصر جديد
      updatedList.push({ id: Date.now(), ...formState });
    }

    const updatedData = { ...data, [targetList]: updatedList };
    saveData(updatedData);
    setFormState({});
    alert("تم تحديث البيانات بنجاح وانعكست تلقائياً على صفحة الجمهور المباشرة!");
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormState(item);
  };

  const handleDelete = (id, listName) => {
    if (confirm("هل أنت متأكد تماماً من حذف هذا العنصر؟ سينعكس الحذف فوراً عند الجمهور.")) {
      const updatedList = data[listName].filter(item => item.id !== id);
      const updatedData = { ...data, [listName]: updatedList };
      saveData(updatedData);
    }
  };

  const clearApplications = () => {
    if (confirm("هل تريد إفراغ أرشيف طلبات التسجيل المنسقة؟")) {
      localStorage.removeItem("smart_applications");
      setApplications([]);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>لوحة تحكم الأكاديمية والتدريب - الإدارة الاحترافية العليا 🛠️</h2>
        <button style={styles.viewBtn} onClick={() => window.open("/training", "_blank")}>👁️ فتح صفحة الجمهور لمعاينة التغيير الفوري</button>
      </header>

      <div style={styles.layout}>
        {/* شريط الأقسام الأيمن */}
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

        {/* مساحة العمل والديناميكية الإدارية */}
        <main style={styles.workspace}>
          {targetList !== "applications" ? (
            <>
              <h3 style={{color: "#64ffda"}}>{editId ? "✍️ تعديل العنصر المحدد حالياً" : "➕ إضافة عنصر جديد إلى القائمة الفرعية"}</h3>
              
              <form onSubmit={handleSubmit} style={styles.adminForm}>
                {/* استمارات ديناميكية دقيقة لكل قسم بناءً على طلبك بالكامل */}
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
                    <textarea name="whyPython" placeholder="لماذا بايثون بالذات في الهندسة الإنشائية؟ (الأهمية البالغة)" required value={formState.whyPython || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="learningOutcomes" placeholder="ماذا ستتعلم في هذه الدورات؟ (المحتوى المتوقع الهيكلي)" required value={formState.learningOutcomes || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <input type="text" name="targetAudience" placeholder="لمن تفيد هذه الدورات؟" required value={formState.targetAudience || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="tips" placeholder="نصائح استراتيجية مهمة قبل أن تبدأ" required value={formState.tips || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {targetList === "mgmtCourses" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الدورة الإدارية" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="trainer" placeholder="اسم المدرب" required value={formState.trainer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="duration" placeholder="مدة الدورة" required value={formState.duration || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="axes" placeholder="أهم المحاور والمعلومات في هذه الدورات العميقة" required value={formState.axes || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="importance" placeholder="أهمية هذه الدورات (لماذا هي حاسمة لمستقبلك المهني؟)" required value={formState.importance || ""} onChange={handleInputChange} style={styles.textarea}/>
                    <textarea name="tips" placeholder="نصيحة صارمة ومثمرة للبدء" required value={formState.tips || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {targetList === "scholarships" && (
                  <>
                    <h4 style={styles.subTitle}>الحقول المتقدمة للمنحة التفصيلية:</h4>
                    <input type="text" name="title" placeholder="اسم المنحة الرسمي" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="provider" placeholder="الجهة المانحة" required value={formState.provider || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="country" placeholder="الدولة المستضيفة" required value={formState.country || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="degrees" placeholder="المراحل الدراسية المستهدفة (بكالوريوس، ماجستير، إلخ)" required value={formState.degrees || ""} onChange={handleInputChange} style={styles.input}/>
                    
                    <select name="fundType" value={formState.fundType || "منحة كاملة"} onChange={handleInputChange} style={styles.select}>
                      <option value="منحة كاملة">منحة كاملة</option>
                      <option value="منحة جزئية">منحة جزئية</option>
                    </select>
                    
                    <input type="text" name="tuition" placeholder="تفاصيل الإعفاء من الرسوم الدراسية" required value={formState.tuition || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="salary" placeholder="الراتب الشهري (تحديد القيمة المالية)" required value={formState.salary || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="housing" placeholder="تأمين السكن الجامعي أو بدل السكن" required value={formState.housing || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="flights" placeholder="تذاكر الطيران وتفاصيلها" required value={formState.flights || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="health" placeholder="تفاصيل التأمين الصحي الشامل" required value={formState.health || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="visa" placeholder="تكاليف فيزا السفر وتكلفة السنة التحضيرية" required value={formState.visa || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="nationalities" placeholder="الجنسيات المؤهلة" required value={formState.nationalities || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="age" placeholder="السن المطلوب الأقصى لكل مرحلة" required value={formState.age || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="gpa" placeholder="المعدل الأكاديمي الأدنى GPA المطلوب" required value={formState.gpa || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="langReq" placeholder="شرط اللغة وتفاصيل الشهادات المطلوبة" required value={formState.langReq || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="specialties" placeholder="قائمة الكليات والأقسام المشمولة والمهيأة" required value={formState.specialties || ""} onChange={handleInputChange} style={styles.textarea}/>
                    
                    <h5 style={{color: '#64ffda'}}>المستندات المطلوبة في ملف التقديم:</h5>
                    <input type="text" name="docCertificates" placeholder="شرط الشهادات وكشوفات الدرجات" defaultValue="مطلوبة ومصدقة من الجهات الرسمية" onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="docId" placeholder="جواز سفر أو بديل الهوية" defaultValue="جواز سفر ساري المفعول" onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="docCv" placeholder="تنسيق السيرة الذاتية المطلوب" defaultValue="سيرة ذاتية احترافية محدثة" onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="docMotiv" placeholder="متطلبات خطاب الدافع" defaultValue="خطاب دافع صياغة شخصية" onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="docRec" placeholder="خطابات التوصية المطلوبة" defaultValue="من 2 إلى 3 خطابات أكاديمية" onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="docResearch" placeholder="المخطط البحثي (إن وجد لطلبة الماجستير/الدكتوراه)" defaultValue="مخطط بحثي متكامل للمراحل العليا" onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="docMedical" placeholder="شهادة الفحص الطبي" defaultValue="مطلوب شهادة طبية رسمية خلو من الأمراض" onChange={handleInputChange} style={styles.input}/>

                    <h5 style={{color: '#64ffda'}}>الجدول الزمني والروابط الرسمية:</h5>
                    <input type="date" name="dateOpen" required value={formState.dateOpen || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateClose" placeholder="تاريخ إغلاق التقديم بالتوقيت الدولي المحدد" required value={formState.dateClose || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateResults" placeholder="موعد إعلان نتائج المقبولين" required value={formState.dateResults || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="dateStart" placeholder="موعد بدء الدراسة المستهدف (مثال: خريف 2026)" required value={formState.dateStart || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="linkDirect" placeholder="رابط بوابة التسجيل المباشر Portal" required value={formState.linkDirect || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="linkOfficial" placeholder="رابط الإعلان الرسمي للجهة المانحة" required value={formState.linkOfficial || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="applicationFee" placeholder="رسوم فحص الملفات إن وجدت أو مجاني" defaultValue="مجاني بالكامل" onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {targetList === "codes" && (
                  <>
                    <input type="text" name="name" placeholder="الاسم الكامل للكود الهندسي القياسي" required value={formState.name || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="number" placeholder="رقم الكود وإصداره الدقيق" required value={formState.number || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="region" placeholder="النسخة الإقليمية أو المحلية للتحميل والتطابق" required value={formState.region || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {targetList === "books" && (
                  <>
                    <input type="text" name="title" placeholder="اسم الكتاب أو المرجع العلمي" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="author" placeholder="اسم المؤلف والباحث الرئيسي" required value={formState.author || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="edition" placeholder="رقم الطبعة وفصل الدراسة المعين لها" required value={formState.edition || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                {targetList === "webinars" && (
                  <>
                    <input type="text" name="title" placeholder="عنوان الويبنار الاستراتيجي" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="organizer" placeholder="الجهة المنظمة للندوة الرقمية" required value={formState.organizer || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="date" name="date" required value={formState.date || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="hours" placeholder="عدد الساعات المكتسبة المعتمدة" required value={formState.hours || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="speaker" placeholder="اسم المتحدث أو الخبير الهندسي المعين" required value={formState.speaker || ""} onChange={handleInputChange} style={styles.input}/>
                    <textarea name="summary" placeholder="الملخص والهدف العام من الويبنار الهندسي" required value={formState.summary || ""} onChange={handleInputChange} style={styles.textarea}/>
                  </>
                )}

                {targetList === "certificates" && (
                  <>
                    <input type="text" name="title" placeholder="الاسم الكامل للشهادة المهنية" required value={formState.title || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="provider" placeholder="الجهة المانحة والاعتمادية الدولية" required value={formState.provider || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="text" name="certNumber" placeholder="رقم الشهادة أو رقم الاعتماد المسجل" required value={formState.certNumber || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="date" name="dateGet" placeholder="تاريخ الحصول عليها" required value={formState.dateGet || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="date" name="dateEnd" placeholder="تاريخ انتهاء الصلاحية للمتابعة" required value={formState.dateEnd || ""} onChange={handleInputChange} style={styles.input}/>
                    <input type="url" name="verifyLink" placeholder="رابط التحقق الرسمي الفوري على الشبكة" required value={formState.verifyLink || ""} onChange={handleInputChange} style={styles.input}/>
                  </>
                )}

                <button type="submit" style={styles.submitBtn}>{editId ? "💾 حفظ التعديلات الآن واستبدال البيانات" : "🚀 نشر وإضافة فورية لقائمة الجمهور"}</button>
              </form>

              {/* جدول عرض العناصر المنشورة حالياً لتسهيل الحذف والتعديل الفوري */}
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
                        <td>{item.title || item.name || "عنصر غير معنون"}</td>
                        <td>{item.id}</td>
                        <td>
                          <button style={styles.editBtn} onClick={() => handleEdit(item)}>✍️ تعديل</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(item.id, targetList)}>❌ حذف قطعي</button>
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
            /* قسم مراجعة طلبات التسجيل الاحترافية القادمة من زر (التقديم من خلالنا) */
            <div>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h3 style={{color: "#FFD700"}}>📥 أرشيف طلبات التقديم والملفات الأكاديمية عبر المنصة</h3>
                <button style={styles.deleteBtn} onClick={clearApplications}>🗑️ تصفية وأرشفة كافة الطلبات</button>
              </div>
              <p style={{color: "#aaa", fontSize: "14px"}}>تنعكس وتخزن هذه الحقول والبيانات هنا تزامناً مع إرسال الملفات والاشعارات تلقائياً إلى بريد لوحة التحكم والمنصة الرئيسي: <code style={{color: "#64ffda"}}>Smart.Engineering.Global@proton.me</code> أو <code style={{color: "#64ffda"}}>smart.engineering.global@tuta.io</code></p>
              
              {applications.map((app) => (
                <div key={app.id} style={styles.appCard}>
                  <h4>🎯 المنحة المستهدفة: <span style={{color: "#64ffda"}}>{app.scholarshipTitle}</span></h4>
                  <p style={{fontSize: "12px", color: "#8892b0"}}>تاريخ ووقت التقديم: {app.dateSubmitted}</p>
                  <hr style={{borderColor: "#233554"}}/>
                  <div style={styles.appGrid}>
                    <div>
                      <h5>👤 البيانات الشخصية:</h5>
                      <p><strong>الاسم بالعربية:</strong> {app.fullNameAr}</p>
                      <p><strong>الاسم بالإنجليزية:</strong> {app.fullNameEn}</p>
                      <p><strong>الميلاد والمنشأ:</strong> {app.birthDate}</p>
                      <p><strong>الجنسية الحالية:</strong> {app.nationality}</p>
                      <p><strong>بلد الإقامة:</strong> {app.residence}</p>
                      <p><strong>الإيميل:</strong> {app.email}</p>
                      <p><strong>الهاتف:</strong> {app.phone}</p>
                    </div>
                    <div>
                      <h5>🎓 الخلفية الأكاديمية والتقديم:</h5>
                      <p><strong>آخر مؤهل:</strong> {app.lastDegree}</p>
                      <p><strong>المعدل التراكمي:</strong> {app.gpa}</p>
                      <p><strong>المؤسسة التعليمية:</strong> {app.institute} (تخرج: {app.graduationYear})</p>
                      <p><strong>التخصص الحالي:</strong> {app.currentSpecialty}</p>
                      <p><strong>الدرجة المستهدفة:</strong> {app.targetDegree}</p>
                      <p><strong>رغبة أولى:</strong> {app.targetSpecialty1} | <strong>رغبة ثانية:</strong> {app.targetSpecialty2}</p>
                      <p><strong>مستوى اللغة:</strong> {app.langLevel}</p>
                    </div>
                  </div>
                  <div style={{marginTop: "15px", background: "#0a192f", padding: "10px", borderRadius: "5px"}}>
                    <h5 style={{color: "#64ffda", margin: "0 0 10px 0"}}>📂 حالة الملفات والمستندات المرفقة (محاكاة الاستلام بنجاح):</h5>
                    <p style={{fontSize: "13px", color: "#00ffcc"}}>✓ تم استقبال وتأكيد ورفع ملفات (جواز السفر، الشهادات الأكاديمية، بيان الدافع SOP، السيرة الذاتية CV، خطابات التوصية، الصورة الشخصية ذات الخلفية البيضاء).</p>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <p style={{textAlign: "center", padding: "40px", color: "#8892b0"}}>لا توجد طلبات تقديم مسجلة من خلال المنصة حتى الآن.</p>
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
  appGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }
};