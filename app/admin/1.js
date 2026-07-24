'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, FileText, GraduationCap, Cpu, ShieldCheck, 
  Layers, MessageSquare, Mail, Plus, Trash2, Edit3, 
  CheckCircle, AlertTriangle, Send, Copy, Eye, Download, 
  Clock, MapPin, User, DollarSign, Calendar, RefreshCw, Lock
} from 'lucide-react';

export default function SmartEngineeringAdminPortal() {
  // --- بروتوكول المصادقة والحماية المطلقة بدون قاعدة بيانات خارجية ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  // استعادة كلمة المرور
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1: request, 2: email link simulation, 3: new password page
  const [newPasswordData, setNewPasswordData] = useState({ email: '', newPassword: '', confirmPassword: '' });

  // التبويبات الرئيسية للوحة التحكم الموحدة
  const [activeTab, setActiveTab] = useState('jobs-tenders');
  const [activeSubTab, setActiveSubTab] = useState('jobs');

  // إيميلات الإدارة والمنصة المعتمدة لإرسال الإشعارات المشتركة
  const adminEmails = [
    'Smart.Engineering.Global@proton.me',
    'smart.engineering.global@tuta.io',
    'smartengineering.hr.global@gmail.com'
  ];

  // مصفوفة نظام الإشعارات الداخلي اللحظي لتوثيق العمليات والأنشطة المريبة
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'تم تشغيل لوحة التحكم المركزية لمنصة الهندسة الذكية بنجاح.', time: 'الآن' }
  ]);

  // دالة محاكاة تفعيل وإرسال الإشعارات إلى لوحة التحكم والبريد الإلكتروني للإدارة والمستخدمين
  const triggerNotification = (type, message, targetEmails = adminEmails) => {
    const newNotif = {
      id: Date.now(),
      type,
      message: `${message} (تم إرسال إشعار بريدي فوري إلى: ${targetEmails.join(' | ')})`,
      time: new Date().toLocaleTimeString('ar-EG')
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- 1. بيانات وقوائم بوابة الوظائف والمناقصات والإعلانات والتسجيل ---
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'مهندس إنشائي أقدم - مكتب فني',
      datePublished: '2026-07-01',
      dateClosing: '2026-08-15',
      location: 'الرياض، المملكة العربية السعودية',
      department: 'إدارة المكاتب الفنية والتصميم',
      employerInfo: 'شركة الهندسة الذكية العالمية للحلول البرمجية والمقاولات المتطورة',
      jobBrief: 'مطلوب مهندس إنشائي ذو خبرة عالية في أتمتة التصاميم وإعداد المخططات التنفيذية بدقة متناهية.',
      duties: 'إدارة النماذج الإنشائية، تدقيق اللوحات، الإشراف على معايير الكود، وتحسين الهالك.',
      qualifications: 'بكالوريوس هندسة مدنية، خبرة لا تقل عن 7 سنوات، وإتقان برمجيات بايثون الهندسية.',
      skills: 'تحليل إنشائي متقدم، إتقان كود ACI و SBC، مهارات قيادية عالية.',
      notes: 'الأولوية لمن لديه مشاريع أتمتة سابقة.',
      applyMethod: 'Email',
      applyEmail: 'smartengineering.hr.global@gmail.com',
      applyLink: ''
    }
  ]);

  const [tenders, setTenders] = useState([
    {
      id: 1,
      tenderName: 'إعلان مناقصة توريد أنظمة التوأم الرقمي وبنية تحتية ذكية',
      location: 'دبي، الإمارات العربية المتحدة',
      datePublished: '2026-07-01',
      dateClosing: '2026-09-01',
      tenderNumber: 'SEG-TEND-2026-004',
      projectName: 'منصة البرمجة والأتمتة الهندسية الموحدة للمشاريع الكبرى',
      components: 'توريد برمجيات، خوادم محلية، حساسات ربط الحقل الإنشائي بنماذج BIM.',
      fundingAgency: 'تمويل ذاتي واستثماري مشترك',
      currency: 'USD',
      bidValidity: '90 يوماً من تاريخ فتح المظاريف',
      guaranteeValidity: '120 يوماً',
      executionPeriod: '6 أشهر',
      guaranteeValue: '50,000 USD',
      openingSession: 'التأريخ: 2026-09-02 / الوقت: 10:00 صباحاً / المكان: المقر الرئيسي للمنصة',
      conditions: 'يجب أن يكون المتقدم مقاولاً أو مورداً تكنولوجياً معتمداً لديه سابقة أعمال لا تقل عن 5 سنوات.',
      documentsLink: 'http://localhost:3000/jobs-tenders/docs/t-004.pdf',
      applyMethod: 'رابط مباشر من البوابة الإلكترونية',
      attachments: 'ملف الشروط والمواصفات الفنية الملحقة وجداول الكميات المعتمدة.',
      obtainLink: 'http://localhost:3000/jobs-tenders/get/t-004',
      contactInfo: 'Smart.Engineering.Global@proton.me',
      notes: 'العطاءات المتأخرة لن يتم التفات إليها نهائياً.'
    }
  ]);

  const [publicAdsRequests, setPublicAdsRequests] = useState([
    { id: 1, type: 'وظيفة', requester: 'مكتب بناء الغد الاستشاري', title: 'مهندس موقع مدني', details: 'طلب نشر وظيفة لموقع إنشائي قائم بجدة', approved: false }
  ]);

  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 1, fullName: 'أحمد محمود العلي', email: 'ahmed.civil2026@gmail.com', password: '••••••••', role: 'طالب توظيف', status: 'نشط' },
    { id: 2, fullName: 'شركة تكنو-كونترول للمقاولات المحدودة', email: 'info@technocontrole.com', password: '••••••••', role: 'مقاول / مورد', status: 'نشط' }
  ]);

  // نماذج الحقول للإضافة (بوابة الوظائف والمناقصات)
  const [jobForm, setJobForm] = useState({
    title: '', datePublished: '', dateClosing: '', location: '', department: '',
    employerInfo: '', jobBrief: '', duties: '', qualifications: '', skills: '', notes: '',
    applyMethod: 'Email', applyEmail: '', applyLink: ''
  });

  const [tenderForm, setTenderForm] = useState({
    tenderName: '', location: '', datePublished: '', dateClosing: '', tenderNumber: '', projectName: '',
    components: '', fundingAgency: '', currency: '', bidValidity: '', guaranteeValidity: '', executionPeriod: '',
    guaranteeValue: '', openingSession: '', conditions: '', documentsLink: '', applyMethod: '', attachments: '',
    obtainLink: '', contactInfo: '', notes: ''
  });

  // التحكم في التعديل
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingTenderId, setEditingTenderId] = useState(null);

  // معالجة تسجيل الدخول للمسؤول
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (isLocked) {
      alert('تم حظر الدخول مؤقتاً لنشاط مريب ومحاولات خاطئة متكررة. يرجى مراجعة لوحة التحكم.');
      return;
    }
    // تسجيل دخول مباشر كمسؤول دون قاعدة بيانات
    if (loginForm.email === 'Smart.Engineering.Global@proton.me' && loginForm.password === 'AdminSmart2026!!') {
      setIsAdminLoggedIn(true);
      setLoginAttempts(0);
      triggerNotification('success', 'قام المسؤول بتسجيل الدخول الآمن بنجاح إلى النظام الإداري الموحد.');
    } else {
      const nextAttempts = loginAttempts + 1;
      setLoginAttempts(nextAttempts);
      triggerNotification('danger', `محاولة تسجيل دخول فاشلة للمسؤول باستخدام بريد: ${loginForm.email}`);
      if (nextAttempts >= 3) {
        setIsLocked(true);
        triggerNotification('danger', '⚠️ تحذير أمني: تم حظر نظام تسجيل الدخول تلقائياً لتجاوز 3 محاولات خاطئة!');
        alert('تم حظر محاولات تسجيل الدخول حماية للمنصة! تم إرسال إشعار عاجل لكافة بريد المنصة.');
      } else {
        alert(`كلمة المرور أو البريد خاطئ! المحاولات المتبقية: ${3 - nextAttempts}`);
      }
    }
  };

  // معالجة استعادة كلمة المرور
  const handleForgotRequest = (e) => {
    e.preventDefault();
    triggerNotification('warning', `طلب استعادة كلمة مرور لحساب: ${forgotEmail}`);
    setResetStep(2);
    // محاكاة انتهاء الصلاحية بعد 90 دقيقة
    setTimeout(() => {
      setResetStep(3);
      setNewPasswordData(prev => ({ ...prev, email: forgotEmail }));
    }, 1500);
  };

  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      alert('كلمات المرور غير متطابقة!');
      return;
    }
    triggerNotification('success', `تم إنشاء كلمة مرور جديدة بنجاح لحساب: ${newPasswordData.email}`);
    alert('تم إعادة تعيين كلمة المرور بنجاح تام وفق بروتوكول الحماية العالي (الهندسة الذكية & HR).');
    setShowForgotModal(false);
    setResetStep(1);
    setForgotEmail('');
    setNewPasswordData({ email: '', newPassword: '', confirmPassword: '' });
  };

  // معالجات الإضافة والتعديل للوظائف والمناقصات
  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (editingJobId) {
      setJobs(prev => prev.map(item => item.id === editingJobId ? { ...jobForm, id: editingJobId } : item));
      triggerNotification('success', `تم تعديل وتحديث بيانات الوظيفة المنشورة: ${jobForm.title}`);
      setEditingJobId(null);
    } else {
      const newId = Date.now();
      setJobs(prev => [...prev, { ...jobForm, id: newId }]);
      triggerNotification('success', `تم نشر وظيفة جديدة للجمهور: ${jobForm.title}`);
      // إرسال إشعارات فورية لطالبي التوظيف المسجلين بالمنصة
      registeredUsers.filter(u => u.role === 'طالب توظيف').forEach(u => {
        // محاكاة الإشعار البريدي للمستخدم
      });
    }
    setJobForm({
      title: '', datePublished: '', dateClosing: '', location: '', department: '',
      employerInfo: '', jobBrief: '', duties: '', qualifications: '', skills: '', notes: '',
      applyMethod: 'Email', applyEmail: '', applyLink: ''
    });
  };

  const handleTenderSubmit = (e) => {
    e.preventDefault();
    if (editingTenderId) {
      setTenders(prev => prev.map(item => item.id === editingTenderId ? { ...tenderForm, id: editingTenderId } : item));
      triggerNotification('success', `تم تعديل بيانات المناقصة وتحديثها فورياً: ${tenderForm.tenderName}`);
      setEditingTenderId(null);
    } else {
      const newId = Date.now();
      setTenders(prev => [...prev, { ...tenderForm, id: newId }]);
      triggerNotification('success', `تم إعلان مناقصة جديدة للجمهور: ${tenderForm.tenderName}`);
      // إرسال إشعارات فورية للموردين والمقاولين المسجلين
      registeredUsers.filter(u => u.role === 'مقاول / مورد').forEach(u => {});
    }
    setTenderForm({
      tenderName: '', location: '', datePublished: '', dateClosing: '', tenderNumber: '', projectName: '',
      components: '', fundingAgency: '', currency: '', bidValidity: '', guaranteeValidity: '', executionPeriod: '',
      guaranteeValue: '', openingSession: '', conditions: '', documentsLink: '', applyMethod: '', attachments: '',
      obtainLink: '', contactInfo: '', notes: ''
    });
  };

  const deleteJob = (id, name) => {
    if(confirm(`هل أنت متأكد من حذف الوظيفة: ${name} نهائياً؟`)) {
      setJobs(prev => prev.filter(item => item.id !== id));
      triggerNotification('warning', `تم حذف وظيفة من لوحة التحكم والجمهور: ${name}`);
    }
  };

  const deleteTender = (id, name) => {
    if(confirm(`هل أنت متأكد من حذف المناقصة: ${name} نهائياً؟`)) {
      setTenders(prev => prev.filter(item => item.id !== id));
      triggerNotification('warning', `تم حذف مناقصة من لوحة التحكم والجمهور: ${name}`);
    }
  };

  const toggleUserStatus = (id, current, name) => {
    const nextStatus = current === 'نشط' ? 'محظور' : 'نشط';
    setRegisteredUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    triggerNotification('warning', `تم تغيير حالة المستخدم الرقابية إدارياً لـ [${name}] إلى: ${nextStatus}`);
  };

  const deleteUser = (id, name) => {
    if(confirm(`حذف حساب المستخدم ${name} نهائياً؟`)) {
      setRegisteredUsers(prev => prev.filter(u => u.id !== id));
      triggerNotification('danger', `تم حذف حساب المستخدم ${name} بشكل كلي من النظام.`);
    }
  };

  const approveAdRequest = (id, title) => {
    setPublicAdsRequests(prev => prev.filter(item => item.id !== id));
    triggerNotification('success', `تم مراجعة وتدقيق ونشر إعلان الجمهور بنجاح: ${title}`);
    alert(`تمت الموافقة ونشر الإعلان [${title}] للجمهور فورا.`);
  };

  // --- 2. بيانات وقوائم الأكاديمية والتدريب ---
  const [courses, setCourses] = useState([
    { id: 1, type: 'python', title: 'دورات التصميم الإنشائي باستخدام Python الفائقة', instructor: 'د. م. استشاري ذكاء اصطناعي هندسي', duration: '60 ساعة مكثفة', certification: 'شهادة معتمدة دولياً وموثقة عبر البريد الإلكتروني للمنصة', requirements: 'معرفة أساسية بالتصميم الإنشائي اليدوي أو البرمجيات القياسية', bio: 'خبير دولي رائد في دمج الحلول الخوارزمية وأتمتة الأكواد الهندسية.', whyPython: 'بايثون تمكن المهندس من التحرر من قيود البرمجيات المغلقة وبناء أدوات تصميم مخصصة تتوافق مع الأكواد العالمية بلحظات.', content: 'بناء خوارزميات التصميم الإنشائي، معالجة مصفوفات الأبعاد للأعمدة والكمرات، وربط المخرجات بقواعد البيانات.', targetAudience: 'المهندسون الإنشائيون، مهندسو المكتب الفني، ومطورو البرمجيات الهندسية الناشئة.', tips: 'ابدأ بفهم عميق للمقاطع الإنشائية وسلوك المواد قبل صياغة المعادلات في الأكواد البرمجية.' },
    { id: 2, type: 'management', title: 'الإدارة الهندسية الاحترافية والمكتب الفني الذكي', instructor: 'م. خبير إدارة مشاريع ومكاتب فنية', duration: '45 ساعة معتمدة', certification: 'شهادة التطوير المهني المتقدم PMP-BIM', requirements: 'خلفية عامة في إدارة المشاريع الهندسية ودفاتر الشروط الجداول الإنشائية', bio: 'مستشار إدارة كبرى الشركات الهندسية العالمية وتطوير المكاتب الإنشائية الرقمية.', keyAxes: 'إدارة جداول الكميات الذكية، أتمتة مستندات المواقع، وتقليل الفواقد والهالك المادي.', importance: 'تعتبر حاسمة لمستقبلك لأن إدارة المكاتب الفنية التقليدية تستهلك 80% من وقت المهندس دون مخرجات استباقية.', tips: 'نوصي بالتركيز التام على تدفق المستندات الرقمية والربط المتوازن بين الموقع والمكتب الإداري.' }
  ]);

  const [grants, setGrants] = useState([
    {
      id: 1,
      grantName: 'منحة الهندسة الذكية العليا لعام 2026',
      grantAgency: 'مؤسسة SEG الأكاديمية العالمية للبحوث والتطوير الهندسي',
      hostCountry: 'المنصة الرقمية الموحدة ومختبرات الأبحاث الشريكة',
      stages: 'ماجستير ودكتوراه وزمالة بحثية متقدمة',
      fundingType: 'منحة كاملة',
      fundingDetails: 'تغطي المنحة كامل الرسوم الدراسية بنسبة 100% مع توفير راتب شهري متميز وضمان صحي بديل وتذاكر سفر سنوية.',
      eligibility: 'متاح لجميع الجنسيات العربية والعالمية، حد أقصى للعمر 35 عاماً للماجستير و42 عاماً للدكتوراه، مع معدل تراكمي لا يقل عن 3.5 من 4.0.',
      languageCondition: 'غير مشروطة مبدئياً، يمكن دراسة السنة التحضيرية للغة أو إرفاق شهادات الكفاءة لاحقاً.',
      specialties: 'الهندسة الإنشائية الذكية، أتمتة البناء، الذكاء الاصطناعي الهندسي، تقليل فاقد الحديد والمواد.',
      requiredDocs: 'الشهادات الأكاديمية الرسمية المصدقة، كشوف الدرجات، السيرة الذاتية المفصلة، خطاب دافع احترافي، رسائل توصية (عدد 3)، مخطط بحثي متكامل لطلاب الدكتوراه، وشهادة فحص طبي.',
      timelineOpen: '2026-07-15',
      timelineClose: '2026-10-30 بتوقيت مكة المكرمة',
      timelineResults: '2026-12-01',
      studyStart: 'خريف 2026 / ربيع 2027',
      directApplyLink: 'http://localhost:3000/training/grants/apply-portal',
      officialAnnounceLink: 'http://localhost:3000/training/grants/official-announcement',
      applyFee: 'مجاني بالكامل بدون أي رسوم لفرز الملفات أو مراجعتها الأكاديمية.'
    }
  ]);

  const [engineeringCodes, setEngineeringCodes] = useState([
    { id: 1, codeName: 'كود التصميم الإنشائي الأمريكي الشامل', codeNumber: 'ACI 318-25', regionalVersion: 'النسخة العالمية المحدثة متضمنة ملاحق الأحمال الزلزالية' }
  ]);

  const [engineeringBooks, setEngineeringBooks] = useState([
    { id: 1, bookName: 'موسوعة التحليل الإنشائي الرقمي المتقدم وأتمتة التصميم الهيكلي', author: 'مجموعة علماء منصة الهندسة الذكية المشتركة', edition: 'الطبعة السابعة الفنية الممتازة' }
  ]);

  const [seminars, setSeminars] = useState([
    { id: 1, title: 'الويبينار الدولي لنظم الأتمتة الإنشائية Rebar Zero-Waste', organizer: 'قطاع البحث والتطوير الهندسي الذكي', date: '2026-07-20', hours: '4 ساعات معتمدة CPD', speaker: 'پروفيسور عالمي متفرغ للأتمتة والبرمجة الإنشائية', objective: 'يهدف الويبينار لتمكين المكاتب الفنية من خفض فاقد تسليح الحديد إلى نسبة صفر تماماً بالاعتماد على خوارزميات الترتيب والمصفوفات الذكية.' }
  ]);

  const [professionalCertificates, setProfessionalCertificates] = useState([
    { id: 1, name: 'خبير أتمتة وتصميم إنشائي معتمد - مستوى متقدم متميز', issuer: 'الهندسة الذكية الدولية بالاشتراك مع مراكز الكفاءة والاعتماد العليا', certNumber: 'SEG-CERT-2026-889', dateObtained: '2026-05-10', dateExpiry: '2031-05-10', verifyLink: 'http://localhost:3000/training/verify/889' }
  ]);

  const [academyApplications, setAcademyApplications] = useState([
    { id: 1, studentName: 'يوسف العبدالله', email: 'youssef@eng.com', phone: '+9665000000', lastDegree: 'بكالوريوس هندسة مدنية', targetGrant: 'منحة الهندسة الذكية العليا لعام 2026' }
  ]);

  // نماذج الأكاديمية
  const [courseForm, setCourseForm] = useState({ type: 'python', title: '', instructor: '', duration: '', certification: '', requirements: '', bio: '', whyPython: '', content: '', targetAudience: '', tips: '', keyAxes: '', importance: '' });
  const [grantForm, setGrantForm] = useState({ grantName: '', grantAgency: '', hostCountry: '', stages: '', fundingType: 'منحة كاملة', fundingDetails: '', eligibility: '', languageCondition: '', specialties: '', requiredDocs: '', timelineOpen: '', timelineClose: '', timelineResults: '', studyStart: '', directApplyLink: '', officialAnnounceLink: '', applyFee: '' });
  const [codeForm, setCodeForm] = useState({ codeName: '', codeNumber: '', regionalVersion: '' });
  const [bookForm, setBookForm] = useState({ bookName: '', author: '', edition: '' });
  const [seminarForm, setSeminarForm] = useState({ title: '', organizer: '', date: '', hours: '', speaker: '', objective: '' });
  const [certificateForm, setCertificateForm] = useState({ name: '', issuer: '', certNumber: '', dateObtained: '', dateExpiry: '', verifyLink: '' });
  const [academyApplyForm, setAcademyApplyForm] = useState({ fullNameAr: '', fullNameEn: '', birthDate: '', currentNationality: '', residenceCountry: '', email: '', phone: '', lastQualification: 'بكالوريوس', gpa: '', institution: '', currentSpecialty: '', targetGrant: '', targetDegree: 'ماجستير', targetSpecialty1: '', targetSpecialty2: '', englishLevel: 'بدون' });

  // معالجات الحذف للأكاديمية
  const deleteCourse = (id, name) => { if(confirm(`حذف الدورة: ${name}؟`)) { setCourses(prev => prev.filter(c => c.id !== id)); triggerNotification('warning', `تم حذف الدورة التدريبية: ${name}`); } };
  const deleteGrant = (id, name) => { if(confirm(`حذف المنحة: ${name}؟`)) { setGrants(prev => prev.filter(g => g.id !== id)); triggerNotification('warning', `تم حذف المنحة الأكاديمية: ${name}`); } };
  const deleteCode = (id, name) => { if(confirm(`حذف الكود الهندسي: ${name}؟`)) { setEngineeringCodes(prev => prev.filter(c => c.id !== id)); triggerNotification('warning', `تم حذف المعيار الهندسي: ${name}`); } };
  const deleteBook = (id, name) => { if(confirm(`حذف الكتاب: ${name}؟`)) { setEngineeringBooks(prev => prev.filter(b => b.id !== id)); triggerNotification('warning', `تم حذف المرجع العلمي: ${name}`); } };
  const deleteSeminar = (id, name) => { if(confirm(`حذف الويبينار: ${name}؟`)) { setSeminars(prev => prev.filter(s => s.id !== id)); triggerNotification('warning', `تم حذف الندوة الإنشائية: ${name}`); } };
  const deleteCertificate = (id, name) => { if(confirm(`حذف الشهادة: ${name}؟`)) { setProfessionalCertificates(prev => prev.filter(c => c.id !== id)); triggerNotification('warning', `تم حذف مواصفات الشهادة المعتمدة: ${name}`); } };

  // --- 3. بيانات وقوائم برمجيات وأدوات ---
  const [prompts, setPrompts] = useState([
    { id: 1, title: 'المولد الذكي لتقارير دراسة ومعاينة المواد الإنشائية المتكاملة', category: 'هندسة إنشائية ومكتب فني', preferredPlatform: 'Claude 3.5 Sonnet', badge: 'أداة حصرية نادرة', shortDesc: 'توليد تقرير هندسي استباقي شامل لكافة فحوصات الخرسانة والمواد الإنشائية المستلمة في الموقع.', secretPrompt: 'أنت مهندس جودة واستشاري مواد إنشائية أقدم. قم بصياغة تقرير فني شامل ومفصل عن مادة [المادة] المستخدمة في [العنصر] بناءً على اشتراطات [الكود المستخدم]. ركز على المقاومة المميزة واختبارات القوام والتحمل على المدى البعيد.' }
  ]);

  const [liveApps, setLiveApps] = useState([
    { id: 1, appName: 'الحاسبة الذكية لقوة ومتانة العمود الخرساني وتحمل الأحمال المركزة', variables: 'P (الحمل المحوري طن), Ac (مساحة المقطع سم2), fc (رتبة الخرسانة كجم/سم2)', equation: 'Result = P / (Ac * fc)', validationRules: 'الحد الأدنى للأبعاد لا يقل عن 20سم، ولا يقبل قيم سالبة نهائياً نهائياً.', resultTemplate: 'إن قوة التحمل القصوى المقدرة هندسياً للعمود الخرساني المدروس هي: {Result} طن مكافئ.' }
  ]);

  const [automations, setAutomations] = useState([
    { id: 1, title: 'سكربت أتمتة حصر حديد التسليح الكلي وحساب الهالك التلقائي المتميز', scriptFile: 'analysis_engine.py', formSchema: 'حقل رتبة الحديد المعتمد، حقل طول بحر الكمرة الصافي، حقل الأحمال الكلية الموزعة', outputFormat: 'Excel Sheet مرتب جداً متضمناً الرسوم التوضيحية الديناميكية والبيانية' }
  ]);

  const [aiSolutions, setAiSolutions] = useState([
    { id: 1, toolName: 'المعالج الذكي لرصد شروخ وتصدعات العناصر الإنشائية بدقة فائقة وعالية', dataset: 'أطلس SEG المتكامل المصنف للتشققات (تصدعات قص خطيرة، شروخ تمدد حراري، شروخ رطوبة معقدة)', severityRules: 'عرض الشرخ أكبر من 3 ملم أو مائل بزاوية 45 درجة يشكل تصنيف خطورة مرتفعة جداً تسترعي الإخلاء الفوري.', outputFormat: 'تقرير حالة فني مرئي ومطبوع يتضمن تحديد مرجعي دقيق مشفر بالألوان الحرارية التوضيحية المعقدة' }
  ]);

  const [managementTools, setManagementTools] = useState([
    { id: 1, name: 'منظومة إدارة مستندات المخططات التنفيذية للمشاريع الإنشائية الكبرى', rules: 'الاعتماد الكلي مشروط بختم الاستشاري المعتمد حصرياً Approved وخاضع لنظام الترقيم الدولي الموحد PROJ-ZONE-TYPE-REV.', outputFormat: 'لوحة قيادة تفاعلية ذكية وجداول مقارنة الموردين والمقاولين وتتبع نسب إنجاز المهام الهندسية' }
  ]);

  const [customToolRequests, setCustomToolRequests] = useState([
    { id: 1, name: 'م. خالد العتيبي', email: 'khaled@eng.sa', phone: '+966512345678', details: 'أريد أداة برمجية لحساب هالك حديد القواعد الإنشائية المعقدة تلقائياً.' }
  ]);

  // نماذج برمجيات وأدوات
  const [promptForm, setPromptForm] = useState({ title: '', category: 'هندسة إنشائية وبناء مكاتب', preferredPlatform: 'ChatGPT', badge: 'أداة حصرية', shortDesc: '', secretPrompt: '' });
  const [liveAppForm, setLiveAppForm] = useState({ appName: '', variables: '', equation: '', validationRules: '', resultTemplate: '' });
  const [automationForm, setAutomationForm] = useState({ title: '', scriptFile: '', formSchema: '', outputFormat: '' });
  const [aiSolutionForm, setAiSolutionForm] = useState({ toolName: '', dataset: '', severityRules: '', outputFormat: '' });
  const [mgmtToolForm, setMgmtToolForm] = useState({ name: '', rules: '', outputFormat: '' });
  const [customToolForm, setCustomToolForm] = useState({ name: '', email: '', phone: '', details: '' });

  // معالجات الحذف للبرمجيات
  const deletePrompt = (id, name) => { if(confirm(`حذف البرومبت: ${name}؟`)) { setPrompts(prev => prev.filter(p => p.id !== id)); triggerNotification('warning', `تم حذف البرومبت الهندسي: ${name}`); } };
  const deleteLiveApp = (id, name) => { if(confirm(`حذف الحاسبة: ${name}؟`)) { setLiveApps(prev => prev.filter(a => a.id !== id)); triggerNotification('warning', `تم حذف التطبيق الحي: ${name}`); } };
  const deleteAutomation = (id, name) => { if(confirm(`حذف سكربت الأتمتة: ${name}؟`)) { setAutomations(prev => prev.filter(a => a.id !== id)); triggerNotification('warning', `تم حذف أداة الأتمتة: ${name}`); } };
  const deleteAiSolution = (id, name) => { if(confirm(`حذف حل الذكاء الاصطناعي: ${name}؟`)) { setAiSolutions(prev => prev.filter(a => a.id !== id)); triggerNotification('warning', `تم حذف أداة الذكاء الاصطناعي: ${name}`); } };
  const deleteMgmtTool = (id, name) => { if(confirm(`حذف منظومة التحكم الإداري: ${name}؟`)) { setManagementTools(prev => prev.filter(m => m.id !== id)); triggerNotification('warning', `تم حذف منظومة التحكم: ${name}`); } };

  // تفاعل واجهة الجمهور للبرومبت
  const [activeUserPrompt, setActiveUserPrompt] = useState(null);
  const [promptUserInputs, setPromptUserInputs] = useState({ field1: '', field2: '', field3: '' });
  
  const openPromptPopup = (p) => {
    setActiveUserPrompt(p);
    setPromptUserInputs({ field1: '', field2: '', field3: '' });
  };

  const executePromptCopy = () => {
    let finalPrompt = activeUserPrompt.secretPrompt
      .replace('[المادة]', promptUserInputs.field1 || 'الخرسانة الجاهزة')
      .replace('[العنصر]', promptUserInputs.field2 || 'أعمدة الدور الأرضي')
      .replace('[الكود المستخدم]', promptUserInputs.field3 || 'الكود السعودي SBC');
      
    navigator.clipboard.writeText(finalPrompt);
    alert(`تم نسخ نص البرومبت السري بنجاح تام! اذهب إلى منصة ${activeUserPrompt.preferredPlatform} الموصى بها وألصق النص لبدء المعالجة الذكية الفورية.`);
    setActiveUserPrompt(null);
  };

  // --- 4. بيانات وقوائم خدماتنا المتميزة الفنية المعقدة ---
  const [servicesData, setServicesData] = useState([
    { id: 1, category: 'structural', title: 'التصميم والتحليل الإنشائي المتقدم الفوقي', desc: 'تصميم المنشآت الخرسانية والمعدنية المعقدة والأبراج الشاهقة وفق الأكواد العالمية المعتمدة مثل (ACI, BS, Eurocodes) بدقة متناهية وخالية من الأخطاء.' },
    { id: 2, category: 'structural', title: 'مراجعة وتدقيق المخططات الإنشائية (Third Party Review)', desc: 'تقديم خدمات التدقيق الإنشائي الفني المستقل لضمان السلامة التامة للهياكل وتقليل الهالك والهدر المالي الإجمالي.' },
    { id: 3, category: 'architectural', title: 'التصميم المعماري الفني الحديث وابتكار الفلل والمباني الذكية', desc: 'ابتكار تصاميم معمارية فريدة تركز بالدرجة الأولى على استغلال المساحات المثالي والإضاءة الطبيعية المريحة.' },
    { id: 4, category: 'digital', title: 'تطوير برمجيات الهندسة المخصصة وحلول الخوارزميات (Smart Tech)', desc: 'تصميم وبناء أدوات برمجية وسكربتات متطورة بلغة بايثون وفلاتر لحل المشاكل الهندسية الميدانية المعقدة والمستعصية.' }
  ]);

  const [serviceRequests, setServiceRequests] = useState([
    { id: 1, name: 'م. فهد الهذلي', email: 'fahad@services.com', phone: '+966555555', type: 'حجز استشارة مجانية', subject: 'استشارة هندسية لتعديل إنشائي عميق', message: 'يرجى مراجعة المخطط الإرفاقي الملحق لتحديد مرونة الأعمدة.' }
  ]);

  // نماذج خدماتنا
  const [serviceForm, setServiceForm] = useState({ category: 'structural', title: '', desc: '' });
  const [consultationForm, setConsultationForm] = useState({ name: '', email: '', phone: '', subject: 'استشارة هندسية', message: '', dateTime: '' });

  const deleteService = (id, title) => {
    if(confirm(`هل أنت متأكد من حذف الخدمة: ${title}؟`)) {
      setServicesData(prev => prev.filter(s => s.id !== id));
      triggerNotification('warning', `تم حذف خدمة مقدمة من قائمة خدماتنا للجمهور: ${title}`);
    }
  };

  const handleAddService = (e) => {
    e.preventDefault();
    const newId = Date.now();
    setServicesData(prev => [...prev, { ...serviceForm, id: newId }]);
    triggerNotification('success', `تم إضافة ونشر خدمة هندسية جديدة بنجاح: ${serviceForm.title}`);
    setServiceForm({ category: 'structural', title: '', desc: '' });
  };

  // --- 5. بيانات وقوائم أفكار وعلوم (Insights) الموثقة ---
  const [insights, setInsights] = useState([
    {
      id: 1,
      category: 'future',
      title: 'الذكاء الاصطناعي في الإنشاءات: التنبؤ بانهيار التربة وتحسين التكاليف الاستباقي',
      problem: 'صعوبة بالغة وتأخر في رصد مؤشرات انهيار التربة واختلال مقاطع التأسيس العميقة للمشاريع.',
      science: 'الاعتماد الكلي على نظريات ميكانيكا التربة المتقدمة ومصفوفات التعلم الآلي للتنبؤ الفوري والمستدام.',
      smartIdea: 'تحويل الحسابات والمعادلات الميدانية إلى خوارزمية ذكية متصلة بحساسات دقيقة لقراءة البيانات بلحظة.',
      application: 'خطوات التنفيذ تكمن في رفع ملفات التربة وتشغيل السكربت المرفقSEG-Soil-Engine للحصول على النتائج الفورية.'
    }
  ]);

  const [insightForm, setInsightForm] = useState({ category: 'future', title: '', problem: '', science: '', smartIdea: '', application: '' });
  
  const deleteInsight = (id, title) => {
    if(confirm(`حذف المقال العلمي: ${title}؟`)) {
      setInsights(prev => prev.filter(i => i.id !== id));
      triggerNotification('warning', `تم إزالة مقال علمي من قائمة أفكار وعلوم: ${title}`);
    }
  };

  const handleAddInsight = (e) => {
    e.preventDefault();
    const newId = Date.now();
    setInsights(prev => [...prev, { ...insightForm, id: newId }]);
    triggerNotification('success', `تم نشر مقال علمي وبحث مبسط جديد في أفكار وعلوم للجمهور: ${insightForm.title}`);
    setInsightForm({ category: 'future', title: '', problem: '', science: '', smartIdea: '', application: '' });
  };

  // --- 6. بيانات وقوائم شاركنا رأيك (Feedback) العامة والخاصة بالعملاء ---
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: 'م. عبد الله الشهري', specialty: 'مهندس مدني', type: 'اقتراح', subject: 'إضافة مكتبة متكاملة لكود البناء الخليجي الموحد لعام 2026' },
    { id: 2, name: 'شركة العمران العقارية', specialty: 'صاحب مشروع', type: 'إشادة', subject: 'خدمة تدقيق المخططات وفرت لنا ما يقارب 25% من فاقد حديد التسليح الكلي للمشروع.' }
  ]);

  const [feedbackForm, setFeedbackForm] = useState({ name: '', specialty: 'مهندس مدني', type: 'اقتراح', subject: '' });

  const deleteFeedback = (id) => {
    if(confirm('هل ترغب بحذف هذا الرأي المرفوع من لوحة التحكم والجمهور؟')) {
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      triggerNotification('warning', 'تم حذف مشاركة رأي من النظام كلياً.');
    }
  };

  // معالجات الإرسال من طرف الجمهور والمستخدمين مباشرة في نفس الصفحة التفاعلية
  const submitPublicAdRequest = (e) => {
    e.preventDefault();
    triggerNotification('info', 'تم استقبال طلب إعلان جديد من الجمهور من قائمة [أعلن معنا] وهو قيد المراجعة الفورية والتدقيق والسرية.');
    alert('تم إرسال إعلانك بنجاح تام إلى إدارة المنصة واللوحة المركزية. لن يظهر للجمهور إلا بعد المراجعة والاعتماد.');
  };

  const submitUserRegistration = (e, roleType) => {
    e.preventDefault();
    const mockEmail = `user.${Date.now()}@smart-eng.com`;
    const newU = { id: Date.now(), fullName: `مسجل جديد من الجمهور (${roleType})`, email: mockEmail, password: '••••••••', role: roleType, status: 'نشط' };
    setRegisteredUsers(prev => [...prev, newU]);
    triggerNotification('success', `تم تسجيل حساب مستخدم جديد كـ [${roleType}] ببريد: ${mockEmail}`);
    alert(`تم تسجيل بياناتك ومستنداتك بنجاح كـ [${roleType}] في منصة الهندسة الذكية وتم حفظ الملفات بأمان تلم.`);
  };

  const submitAcademyApplication = (e) => {
    e.preventDefault();
    const newApp = { id: Date.now(), studentName: academyApplyForm.fullNameAr, email: academyApplyForm.email, phone: academyApplyForm.phone, lastDegree: academyApplyForm.lastQualification, targetGrant: academyApplyForm.targetGrant || 'منحة عامة' };
    setAcademyApplications(prev => [...prev, newApp]);
    triggerNotification('success', `طلب تقديم احترافي جديد للمنح الأكاديمية والتدريب من الطالب: ${academyApplyForm.fullNameAr}`);
    alert('تنبيه تقديم احترافي: تم استقبال كامل البيانات والمستندات ببروتوكول فني دقيق، وتم إشعار الإدارة فورياً بالطلب عبر البريد الإلكتروني للموقع.');
    setAcademyApplyForm({ fullNameAr: '', fullNameEn: '', birthDate: '', currentNationality: '', residenceCountry: '', email: '', phone: '', lastQualification: 'بكالوريوس', gpa: '', institution: '', currentSpecialty: '', targetGrant: '', targetDegree: 'ماجستير', targetSpecialty1: '', targetSpecialty2: '', englishLevel: 'بدون' });
  };

  const submitCustomToolRequest = (e) => {
    e.preventDefault();
    const newReq = { id: Date.now(), name: customToolForm.name, email: customToolForm.email, phone: customToolForm.phone, details: customToolForm.details };
    setCustomToolRequests(prev => [...prev, newReq]);
    triggerNotification('success', `طلب تخصيص أداة برمجية جديدة من العميل: ${customToolForm.name}`);
    alert('تم إرسال طلب أداتك البرمجية الخاصة المخصصة إلى المطورين واللوحة المركزية وسيتم الرد خلال ساعات.');
    setCustomToolForm({ name: '', email: '', phone: '', details: '' });
  };

  const submitServiceRequest = (e) => {
    e.preventDefault();
    const newReq = { id: Date.now(), name: consultationForm.name, email: consultationForm.email, phone: consultationForm.phone, type: 'استشارة ومراسلة ذكية', subject: consultationForm.subject, message: consultationForm.message };
    setServiceRequests(prev => [...prev, newReq]);
    triggerNotification('success', `طلب حجز استشارة أو مراسلة هندسية ذكية من العميل: ${consultationForm.name}`);
    alert('تم استقبال طلب الاستشارة الهندسية بنجاح تام، وتم إرسال نسخة مطابقة للإدارة وجميع إيميلات المنصة المعتمدة.');
    setConsultationForm({ name: '', email: '', phone: '', subject: 'استشارة هندسية', message: '', dateTime: '' });
  };

  const submitPublicFeedback = (e) => {
    e.preventDefault();
    const newF = { id: Date.now(), name: feedbackForm.name || 'زائر مجهول الاسم', specialty: feedbackForm.specialty, type: feedbackForm.type, subject: feedbackForm.subject };
    setFeedbacks(prev => [...prev, newF]);
    triggerNotification('success', `تم استقبال مشاركة رأي وتطوير من الجمهور بواسطة: ${feedbackForm.name || 'زائر مجهول الاسم'}`);
    alert('نشكرك بعمق! ساهم رأيك الثمين في دفع عجلة التطوير والتحديث المستمر لمنصة الهندسة الذكية.');
    setFeedbackForm({ name: '', specialty: 'مهندس مدني', type: 'اقتراح', subject: '' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased pb-24 selection:bg-teal-500 selection:text-slate-900" dir="rtl">
      
      {/* --- الهيدر الرئيسي الفني الجذاب للمنصة الموحدة --- */}
      <header className="bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 border-b border-teal-500/30 p-6 shadow-2xl sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 border border-teal-400 rounded-2xl shadow-inner animate-pulse">
              <Cpu className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-indigo-200 to-white bg-clip-text text-transparent">منصة الهندسة الذكية الموحدة</h1>
              <p className="text-xs text-teal-400/80 font-mono mt-1">SMART ENGINEERING GLOBAL PLATFORM • CENTRAL PORTAL 2026</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-3 bg-teal-950/80 border border-teal-500/50 px-4 py-2 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-sm font-bold text-emerald-400">لوحة التحكم نشطة - مسؤول المسؤولين (Admin)</span>
                <button 
                  onClick={() => { setIsAdminLoggedIn(false); triggerNotification('info', 'قام المسؤول بتسجيل الخروج الطوعي من النظام الإداري.'); }} 
                  className="bg-rose-500 hover:bg-rose-600 transition text-white text-xs px-3 py-1.5 rounded-lg font-bold"
                >
                  خروج الآمن
                </button>
              </div>
            ) : (
              <span className="text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> تصفح كـ جمهور (اضغط زر تسجيل دخول المسؤول للتحكم المطلق)
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* --- الشريط الجانبي للإشعارات الإدارية والبريدية الحية لشفافية الحماية والأداء --- */}
        <div className="bg-slate-950 border-r-4 border-indigo-500 rounded-2xl p-4 mb-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <Mail className="w-4 h-4" /> سجل إشعارات المعالجة والاتصال البريدي التلقائي اللحظي (التحكم & الإيميلات المعتمدة)
            </h3>
            <span className="text-xs text-slate-500 font-mono">الإيميلات النشطة: 3 ملقمات رسمية</span>
          </div>
          <div className="max-h-24 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
            {notifications.map(n => (
              <div key={n.id} className="text-xs flex justify-between items-start bg-slate-900/50 p-2 rounded border border-slate-800/40">
                <span className="text-slate-300 font-medium">{n.message}</span>
                <span className="text-slate-500 font-mono text-[10px] whitespace-nowrap bg-slate-950 px-1 py-0.5 rounded mr-2">{n.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- نافذة تسجيل الدخول للمسؤول واستعادة كلمة المرور --- */}
        {!isAdminLoggedIn && (
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl mb-12 max-w-xl mx-auto">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-teal-400 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-slate-100">بوابة تسجيل دخول المسؤول (Admin Central)</h2>
              <p className="text-xs text-slate-400 mt-1">تسجيل مباشر آمن فوري للتحكم والنشر والإعلان والحذف المباشر</p>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">البريد الإلكتروني المعتمد للمسؤول</label>
                <input 
                  type="email" 
                  required
                  placeholder="Smart.Engineering.Global@proton.me"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">كلمة السر المشفرة الصارمة</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <button 
                  type="button" 
                  onClick={() => { setShowForgotModal(true); setResetStep(1); }}
                  className="text-teal-400 hover:underline font-bold"
                >
                  نسيت كلمة المرور؟ استعادة فوري
                </button>
                <span className="text-slate-500 font-mono">الحماية: بروتوكول SEG 2026</span>
              </div>
              <button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-600 transition text-slate-900 font-black py-3 rounded-xl text-sm shadow-lg shadow-teal-500/20"
              >
                تفعيل صلاحيات المسؤول المطلقة والدخول للنظام
              </button>
            </form>
          </div>
        )}

        {/* --- مودال استعادة كلمة المرور الذكي التفصيلي --- */}
        {showForgotModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              {resetStep === 1 && (
                <form onSubmit={handleForgotRequest} className="space-y-4">
                  <h3 className="text-lg font-bold text-teal-400">استعادة كلمة المرور وإرسال الرابط الصارم</h3>
                  <p className="text-xs text-slate-300">أدخل بريدك الإلكتروني الحقيقي المسجل وسيقوم النظام بإرسال رابط فوري بصلاحية 90 دقيقة فقط إلى إيميلك وإلى إيميلات المنصة المعتمدة.</p>
                  <input 
                    type="email" 
                    required 
                    placeholder="أدخل بريدك المسجل هنا"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400"
                  />
                  <div className="flex justify-between items-center pt-2">
                    <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition">إرسال رابط إعادة التعيين</button>
                    <button type="button" onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:underline text-xs flex items-center gap-1">← العودة لصفحة تسجيل الدخول</button>
                  </div>
                </form>
              )}
              
              {resetStep === 2 && (
                <div className="text-center py-6 space-y-4">
                  <RefreshCw className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-200">جاري معالجة الطلب وإرسال الإشعار لملقمات البريد الإلكتروني الثلاثة للإدارة...</p>
                </div>
              )}

              {resetStep === 3 && (
                <form onSubmit={handleSaveNewPassword} className="space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-base font-black text-emerald-400">منصة الهندسة الذكية وHR الموحدة</h3>
                    <p className="text-xs text-slate-400 mt-0.5">إنشاء كلمة مرور جديدة محصنة</p>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني الموثق</label>
                    <input type="email" readOnly value={newPasswordData.email} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">كلمة المرور الجديدة</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="أدخل كلمة مرور قوية"
                      value={newPasswordData.newPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">تأكيد كلمة المرور الجديدة</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="أعد إدخال كلمة المرور للتأكيد"
                      value={newPasswordData.confirmPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs transition">إعادة تعيين كلمة المرور</button>
                    <button type="button" onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:underline text-xs">إلغاء والعودة</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* --- نظام التبويبات الفني والمميز ذو الدلالات والمعاني الواضحة --- */}
        <nav className="flex flex-wrap justify-center gap-2 md:gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-xl mb-8">
          <button 
            onClick={() => { setActiveTab('jobs-tenders'); setActiveSubTab('jobs'); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition ${activeTab === 'jobs-tenders' ? 'bg-teal-500 text-slate-900 shadow-lg' : 'bg-slate-900 hover:bg-slate-850 text-slate-300'}`}
          >
            <Briefcase className="w-4 h-4" /> بوابة الوظائف والمناقصات والتسجيل
          </button>
          
          <button 
            onClick={() => { setActiveTab('training'); setActiveSubTab('courses'); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition ${activeTab === 'training' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-900 hover:bg-slate-850 text-slate-300'}`}
          >
            <GraduationCap className="w-4 h-4" /> الأكاديمية والتدريب والمنح
          </button>
          
          <button 
            onClick={() => { setActiveTab('software-tools'); setActiveSubTab('prompts'); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition ${activeTab === 'software-tools' ? 'bg-purple-500 text-white shadow-lg' : 'bg-slate-900 hover:bg-slate-850 text-slate-300'}`}
          >
            <Cpu className="w-4 h-4" /> برمجيات وأدوات وهندسة الأوامر
          </button>
          
          <button 
            onClick={() => { setActiveTab('services'); setActiveSubTab('view-services'); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition ${activeTab === 'services' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-900 hover:bg-slate-850 text-slate-300'}`}
          >
            <Layers className="w-4 h-4" /> خدماتنا الاستشارية والذكية
          </button>
          
          <button 
            onClick={() => { setActiveTab('insights'); setActiveSubTab('view-insights'); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition ${activeTab === 'insights' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'bg-slate-900 hover:bg-slate-850 text-slate-300'}`}
          >
            <FileText className="w-4 h-4" /> أفكار وعلوم وهندسة المستقبل
          </button>
          
          <button 
            onClick={() => { setActiveTab('feedback'); setActiveSubTab('view-feedback'); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition ${activeTab === 'feedback' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'bg-slate-900 hover:bg-slate-850 text-slate-300'}`}
          >
            <MessageSquare className="w-4 h-4" /> شاركنا رأيك والتقييم العام
          </button>
        </nav>

        {/* ========================================================================= */}
        {/* === 1. تبويب بوابة الوظائف والمناقصات والإعلانات والرقابة الإدارية للمسجلين === */}
        {/* ========================================================================= */}
        {activeTab === 'jobs-tenders' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* أشرطة التبويب الفرعي */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {['jobs', 'tenders', 'advertise-with-us', 'register-control'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubTab(sub)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg transition ${activeSubTab === sub ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                >
                  {sub === 'jobs' && 'قائمة ومراقبة الوظائف'}
                  {sub === 'tenders' && 'قائمة ومراقبة المناقصات'}
                  {sub === 'advertise-with-us' && 'طلبات الجمهور (أعلن معنا)'}
                  {sub === 'register-control' && 'الرقابة الإدارية والمسجلين والتصنيفات'}
                </button>
              ))}
            </div>

            {/* --- فرعي: الوظائف --- */}
            {activeSubTab === 'jobs' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* استمارة الإضافة والتعديل الإداري الخالص للمسؤول */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-teal-400 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> {editingJobId ? 'تعديل وتحديث بيانات وظيفة قائمة' : 'نشر وإعلان وظيفة جديدة للجمهور'}
                    </h3>
                    <p className="text-[11px] text-slate-400">تنعكس المدخلات مباشرة على صفحة الجمهور أدناه دون المساس بالكود نهائياً</p>
                  </div>
                  
                  {isAdminLoggedIn ? (
                    <form onSubmit={handleJobSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">المسمى الوظيفي الدقيق</label>
                        <input type="text" required value={jobForm.title} onChange={(e)=>setJobForm({...jobForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">تاريخ الإعلان (يوم/شهر/سنة)</label>
                          <input type="date" required value={jobForm.datePublished} onChange={(e)=>setJobForm({...jobForm, datePublished: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">تاريخ الإغلاق (يوم/شهر/سنة)</label>
                          <input type="date" required value={jobForm.dateClosing} onChange={(e)=>setJobForm({...jobForm, dateClosing: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">مكان العمل والمدينة</label>
                        <input type="text" required value={jobForm.location} onChange={(e)=>setJobForm({...jobForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: الرياض، دبي، عن بعد" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">التبعية الإدارية (تحدد بدقة حسب نوع وهيكل الوظيفة)</label>
                        <input type="text" required value={jobForm.department} onChange={(e)=>setJobForm({...jobForm, department: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: إدارة المشاريع، المكاتب الفنية" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">نبذة تفصيلية عن جهة التوظيف الاستشارية</label>
                        <textarea rows="2" required value={jobForm.employerInfo} onChange={(e)=>setJobForm({...jobForm, employerInfo: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">نبذة عن الوظيفة الشاغرة وسياقها</label>
                        <textarea rows="2" required value={jobForm.jobBrief} onChange={(e)=>setJobForm({...jobForm, jobBrief: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">الواجبات والمسؤوليات الهندسية المطلوبة</label>
                        <textarea rows="2" required value={jobForm.duties} onChange={(e)=>setJobForm({...jobForm, duties: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">المؤهلات والمتطلبات الأكاديمية الصارمة</label>
                        <textarea rows="2" required value={jobForm.qualifications} onChange={(e)=>setJobForm({...jobForm, qualifications: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">المهارات والكفاءات التقنية والبرمجية المعقدة</label>
                        <textarea rows="2" required value={jobForm.skills} onChange={(e)=>setJobForm({...jobForm, skills: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">أي ملاحظات إضافية مرغوبة</label>
                        <input type="text" value={jobForm.notes} onChange={(e)=>setJobForm({...jobForm, notes: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">طريقة تقديم الطلب</label>
                          <select value={jobForm.applyMethod} onChange={(e)=>setJobForm({...jobForm, applyMethod: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                            <option value="Email">من خلال البريد الإلكتروني</option>
                            <option value="Link">رابط صفحة تقديم مباشرة الخارجية</option>
                          </select>
                        </div>
                        {jobForm.applyMethod === 'Email' ? (
                          <div>
                            <label className="block text-slate-400 mb-1">البريد الإلكتروني للتقديم</label>
                            <input type="email" value={jobForm.applyEmail} onChange={(e)=>setJobForm({...jobForm, applyEmail: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="hr@domain.com" />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-slate-400 mb-1">رابط صفحة التقديم المباشر</label>
                            <input type="url" value={jobForm.applyLink} onChange={(e)=>setJobForm({...jobForm, applyLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="https://example.com" />
                          </div>
                        )}
                      </div>
                      <button type="submit" className="w-full bg-teal-500 text-slate-900 font-bold py-2 rounded-xl mt-2 hover:bg-teal-600 transition">
                        {editingJobId ? 'تحديث ونشر التعديلات فوراً' : 'إعلان ونشر الوظيفة للجمهور الآن'}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-xs">
                      يجب تسجيل دخول المسؤول لتفعيل نموذج إضافة وتعديل الوظائف والمناقصات.
                    </div>
                  )}
                </div>

                {/* صفحة وبوابة الجمهور الفورية المستهدفة (http://localhost:3000/jobs-tenders) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-900/60 p-4 border border-teal-500/30 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-black text-slate-100">بوابة الجمهور الرقمية الحية للوظائف الشاغرة</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">PUBLIC VIEW LINK: http://localhost:3000/jobs-tenders</p>
                    </div>
                    <span className="bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs px-2 py-1 rounded font-bold">تحديث متزامن فوري</span>
                  </div>

                  {jobs.length === 0 ? (
                    <p className="text-center text-slate-500 text-xs py-12">لا توجد وظائف معلنة حالياً للجمهور من قبل لوحة التحكم.</p>
                  ) : (
                    jobs.map(j => (
                      <div key={j.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative hover:border-slate-700 transition space-y-4 shadow-xl">
                        {/* أزرار الإدارة المباشرة على المكونات إذا كان المسؤول مسجلاً */}
                        {isAdminLoggedIn && (
                          <div className="absolute top-4 left-4 flex gap-2">
                            <button onClick={() => { setEditingJobId(j.id); setJobForm(j); }} className="bg-teal-500/20 hover:bg-teal-500/40 text-teal-400 p-2 rounded-lg transition border border-teal-500/30 text-xs flex items-center gap-1"><Edit3 className="w-3 h-3" /> تعديل</button>
                            <button onClick={() => deleteJob(j.id, j.title)} className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 p-2 rounded-lg transition border border-rose-500/30 text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> حذف نهائي</button>
                          </div>
                        )}

                        <div className="border-r-4 border-teal-500 pr-3">
                          <h4 className="text-base font-black text-slate-100">{j.title}</h4>
                          <p className="text-xs text-teal-400 mt-1 font-semibold">{j.department} • {j.location}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                          <div>📅 تاريخ النشر والإعلان: <span className="text-slate-200">{j.datePublished}</span></div>
                          <div>⏳ تاريخ الإغلاق والانتهاء: <span className="text-rose-400 font-bold">{j.dateClosing}</span></div>
                        </div>

                        <div className="space-y-3 text-xs text-slate-300">
                          <div><strong className="text-slate-400 block mb-0.5">🏢 جهة التوظيف والمؤسسة الاستشارية:</strong> {j.employerInfo}</div>
                          <div><strong className="text-slate-400 block mb-0.5">📝 نبذة مختصرة ومؤشرات العمل:</strong> {j.jobBrief}</div>
                          <div><strong className="text-slate-400 block mb-0.5">🛠️ الواجبات الهندسية والمسؤوليات الميدانية اليومية:</strong> {j.duties}</div>
                          <div><strong className="text-slate-400 block mb-0.5">🎓 المؤهلات المطلوبة والشهادات اللازمة:</strong> {j.qualifications}</div>
                          <div><strong className="text-slate-400 block mb-0.5">⚡ المهارات الرقمية والكفاءات الخوارزمية الفوقية:</strong> {j.skills}</div>
                          {j.notes && <div><strong className="text-slate-400 block mb-0.5">📌 ملاحظات إدارية هامة للتقديم:</strong> <span className="text-amber-400">{j.notes}</span></div>}
                        </div>

                        <div className="pt-4 border-t border-slate-900 flex justify-between items-center flex-wrap gap-2">
                          <span className="text-xs text-slate-400">طريقة التقديم المعتمدة رسمياً للمنصة:</span>
                          {j.applyMethod === 'Email' ? (
                            <a href={`mailto:${j.applyEmail || 'smartengineering.hr.global@gmail.com'}`} className="bg-teal-500 hover:bg-teal-600 transition text-slate-900 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1">
                              📥 تفعيل التقديم المباشر بالبريد المعتمد ({j.applyEmail || 'smartengineering.hr.global@gmail.com'})
                            </a>
                          ) : (
                            <a href={j.applyLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-500 hover:bg-indigo-600 transition text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1">
                              🌐 فتح صفحة التقديم المباشر برابط خارجي موثق
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* --- فرعي: المناقصات --- */}
            {activeSubTab === 'tenders' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* استمارة إضافة وتعديل المناقصات */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-teal-400 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> {editingTenderId ? 'تعديل بيانات مناقصة منشورة' : 'إعلان ونشر مناقصة استراتيجية جديدة'}
                    </h3>
                    <p className="text-[11px] text-slate-400">تنعكس المدخلات فورا على بوابة المقاولين والموردين للجمهور دون تعديل الكود</p>
                  </div>

                  {isAdminLoggedIn ? (
                    <form onSubmit={handleTenderSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">عنوان إعلان المناقصة الرسمي الكامل</label>
                        <input type="text" required value={tenderForm.tenderName} onChange={(e)=>setTenderForm({...tenderForm, tenderName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">البلد، المدينة، ومكان المناقصة</label>
                          <input type="text" required value={tenderForm.location} onChange={(e)=>setTenderForm({...tenderForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">رقم المناقصة المرجعي</label>
                          <input type="text" required value={tenderForm.tenderNumber} onChange={(e)=>setTenderForm({...tenderForm, tenderNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: SEG-2026-X" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">تاريخ الإعلان وبدء الطرح</label>
                          <input type="date" required value={tenderForm.datePublished} onChange={(e)=>setTenderForm({...tenderForm, datePublished: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">تاريخ انتهاء الإعلان والاقفال</label>
                          <input type="date" required value={tenderForm.dateClosing} onChange={(e)=>setTenderForm({...tenderForm, dateClosing: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">اسم المشروع الاستراتيجي بالكامل</label>
                        <input type="text" required value={tenderForm.projectName} onChange={(e)=>setTenderForm({...tenderForm, projectName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">مكونات المناقصة والبنود التفصيلية للأعمال</label>
                        <textarea rows="2" required value={tenderForm.components} onChange={(e)=>setTenderForm({...tenderForm, components: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">جهة التمويل والاعتماد</label>
                          <input type="text" required value={tenderForm.fundingAgency} onChange={(e)=>setTenderForm({...tenderForm, fundingAgency: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">عملة العطاء والتعاقد</label>
                          <input type="text" required value={tenderForm.currency} onChange={(e)=>setTenderForm({...tenderForm, currency: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="USD, SAR, AED" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">صلاحية العطاء الفني</label>
                          <input type="text" required value={tenderForm.bidValidity} onChange={(e)=>setTenderForm({...tenderForm, bidValidity: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-slate-100" placeholder="مثال: 90 يوماً" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">صلاحية ضمان العطاء</label>
                          <input type="text" required value={tenderForm.guaranteeValidity} onChange={(e)=>setTenderForm({...tenderForm, guaranteeValidity: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: 120 يوماً" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">فترة ونطاق التنفيذ الكلي</label>
                          <input type="text" required value={tenderForm.executionPeriod} onChange={(e)=>setTenderForm({...tenderForm, executionPeriod: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: 6 أشهر" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">قيمة الضمان البنكي الابتدائي</label>
                          <input type="text" required value={tenderForm.guaranteeValue} onChange={(e)=>setTenderForm({...tenderForm, guaranteeValue: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: 10,000 USD" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">موعد وجلسة فتح المظاريف (التأريخ/الوقت/المكان بالتفصيل)</label>
                        <input type="text" required value={tenderForm.openingSession} onChange={(e)=>setTenderForm({...tenderForm, openingSession: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">شروط التقديم القانونية والفنية والمالية</label>
                        <textarea rows="2" required value={tenderForm.conditions} onChange={(e)=>setTenderForm({...tenderForm, conditions: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">رابط مستندات ودفاتر وثائق المناقصة</label>
                        <input type="url" required value={tenderForm.documentsLink} onChange={(e)=>setTenderForm({...tenderForm, documentsLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">طريقة التقديم المعتمدة والمرفقات المطلوبة</label>
                        <input type="text" required value={tenderForm.applyMethod} onChange={(e)=>setTenderForm({...tenderForm, applyMethod: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: تقديم في ظرف مغلق متضمناً المرفقات الفنية للشركة" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">رابط الحصول الفوري والمباشر على كراسة المناقصة</label>
                        <input type="url" required value={tenderForm.obtainLink} onChange={(e)=>setTenderForm({...tenderForm, obtainLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">قنوات التواصل والاستفسارات الفنية الرسمية</label>
                        <input type="text" required value={tenderForm.contactInfo} onChange={(e)=>setTenderForm({...tenderForm, contactInfo: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="إيميل أو هاتف التواصل المعتمد للمكتب" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">أي ملاحظات استراتيجية إضافية</label>
                        <input type="text" value={tenderForm.notes} onChange={(e)=>setTenderForm({...tenderForm, notes: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <button type="submit" className="w-full bg-teal-500 text-slate-900 font-bold py-2 rounded-xl mt-2 hover:bg-teal-600 transition">
                        {editingTenderId ? 'تعديل ونشر التغييرات على الفور' : 'إعلان وطرح المناقصة للجمهور الآن'}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-xs">
                      يتطلب صلاحيات المسؤول النشطة لتعديل أو إضافة المناقصات الرسمية.
                    </div>
                  )}
                </div>

                {/* صفحة وبوابة الجمهور للمناقصات (http://localhost:3000/jobs-tenders) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-900/60 p-4 border border-indigo-500/30 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-black text-slate-100">بوابة الجمهور الرقمية للمناقصات والمشتريات الاستراتيجية</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">PUBLIC VIEW LINK: http://localhost:3000/jobs-tenders</p>
                    </div>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs px-2 py-1 rounded font-bold">رصد وتحكم فوري مدمج</span>
                  </div>

                  {tenders.length === 0 ? (
                    <p className="text-center text-slate-500 text-xs py-12">لا توجد مناقصات مطروحة حالياً للجمهور.</p>
                  ) : (
                    tenders.map(t => (
                      <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative hover:border-slate-700 transition space-y-4 shadow-xl">
                        {/* أزرار الإدارة المباشرة على المكونات إذا كان المسؤول مسجلاً */}
                        {isAdminLoggedIn && (
                          <div className="absolute top-4 left-4 flex gap-2">
                            <button onClick={() => { setEditingTenderId(t.id); setTenderForm(t); }} className="bg-teal-500/20 hover:bg-teal-500/40 text-teal-400 p-2 rounded-lg transition border border-teal-500/30 text-xs flex items-center gap-1"><Edit3 className="w-3 h-3" /> تعديل</button>
                            <button onClick={() => deleteTender(t.id, t.tenderName)} className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 p-2 rounded-lg transition border border-rose-500/30 text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> حذف نهائي</button>
                          </div>
                        )}

                        <div className="border-r-4 border-indigo-500 pr-3">
                          <h4 className="text-base font-black text-slate-100">{t.tenderName}</h4>
                          <p className="text-xs text-indigo-400 mt-1 font-semibold">رقم المناقصة المعتمد: {t.tenderNumber} • مكان الانعقاد والبلد: {t.location}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                          <div>📅 طرح وإعلان: <span className="text-slate-200">{t.datePublished}</span></div>
                          <div>⏳ إقفال نهائي: <span className="text-rose-400 font-bold">{t.dateClosing}</span></div>
                          <div>💰 قيمة الضمان: <span className="text-amber-400 font-bold">{t.guaranteeValue}</span></div>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-300">
                          <div><strong className="text-slate-400 block mb-0.5">🏗️ الاسم الرسمي الاستراتيجي للمشروع:</strong> {t.projectName}</div>
                          <div><strong className="text-slate-400 block mb-0.5">📦 مكونات المناقصة التفصيلية وجداول الكميات المعتمدة:</strong> {t.components}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-900/20 p-2 rounded-lg border border-slate-900/60">
                            <div>🏦 جهة التمويل: <span className="text-slate-200 font-semibold">{t.fundingAgency}</span></div>
                            <div>💱 عملة التعاقد المقبولة: <span className="text-slate-200 font-semibold">{t.currency}</span></div>
                            <div>🛡️ صلاحية العطاء الفني: <span className="text-slate-200">{t.bidValidity}</span></div>
                            <div>📋 صلاحية الضمان البنكي: <span className="text-slate-200">{t.guaranteeValidity}</span></div>
                            <div>⏱️ فترة ونطاق التنفيذ الإجمالي: <span className="text-slate-200 font-semibold">{t.executionPeriod}</span></div>
                          </div>
                          <div><strong className="text-slate-400 block mb-0.5">🏛️ موعد وجلسة فتح المظاريف العلنية (التأريخ / الوقت / المكان):</strong> <span className="text-emerald-400 font-medium">{t.openingSession}</span></div>
                          <div><strong className="text-slate-400 block mb-0.5">📜 شروط وأحكام التقديم القانونية الصارمة:</strong> {t.conditions}</div>
                          <div><strong className="text-slate-400 block mb-0.5">📎 المرفقات الفنية المطلوبة ووثائق ملفات التقديم الكاملة:</strong> {t.attachments}</div>
                          <div><strong className="text-slate-400 block mb-0.5">📞 قنوات التواصل والاستفسار الفني للمكتب:</strong> <span className="text-indigo-400 font-mono font-bold">{t.contactInfo}</span></div>
                          {t.notes && <div><strong className="text-slate-400 block mb-0.5">📌 ملاحظات إدارية جوهرية هامة:</strong> <span className="text-amber-400">{t.notes}</span></div>}
                        </div>

                        <div className="pt-4 border-t border-slate-900 flex flex-wrap justify-end gap-3">
                          <a href={t.documentsLink} target="_blank" rel="noopener noreferrer" className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition text-slate-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" /> تحميل دفاتر الشروط والوثائق الكاملة (.PDF)
                          </a>
                          <a href={t.obtainLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-700 transition text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1">
                            🚀 بوابة الحصول الإلكتروني الفوري على المناقصة
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* --- فرعي: أعلن معنا (طلبات الجمهور الواردة للإدارة حصراً دون ظهور للعامة) --- */}
            {activeSubTab === 'advertise-with-us' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* استمارة الجمهور لإرسال الإعلانات للمراجعة (محاكاة واجهة التفاعل العامة للعملاء) */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-amber-400 flex items-center gap-1">
                      <Send className="w-4 h-4" /> نموذج الجمهور والعملاء (أعلن معنا)
                    </h3>
                    <p className="text-[11px] text-slate-400">الإعلان بمجرد استلامه من المعلن لا يظهر نهائياً للجمهور بل يوجه للإيميلات واللوحة فقط حماية للمنصة وتدقيقاً للبيانات.</p>
                  </div>
                  
                  <form onSubmit={submitPublicAdRequest} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">اسم الجهة المعلنة أو الشخص المسؤول</label>
                      <input type="text" required placeholder="مثال: مكتب استشارات هندسية" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">نوع الإعلان المستهدف للتدقيق</label>
                      <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                        <option value="وظيفة">طلب إعلان وظيفة شاغرة</option>
                        <option value="مناقصة">طلب طرح مناقصة أو كراسة مشتريات</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">عنوان الإعلان المقترح</label>
                      <input type="text" required placeholder="المسمى الوظيفي أو اسم المشروع المطلوب" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">كافة تفاصيل وبيانات الإعلان ومرفقاته</label>
                      <textarea rows="4" required placeholder="اكتب الشروط، المسمى، الحقول، والملاحظات بدقة تامة" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-amber-500 text-slate-900 font-bold py-2 rounded-xl mt-1 hover:bg-amber-600 transition">
                      إرسال الإعلان للمراجعة والتدقيق الإداري الفوري
                    </button>
                  </form>
                </div>

                {/* واجهة مراجعة الأدمن للطلبات السرية الواردة */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-200">اللوحة الإدارية لتدقيق ومراجعة طلبات إعلانات الجمهور السرية الواردة</h4>
                    <p className="text-xs text-slate-400 mt-1">يملك المسؤول الصلاحية المطلقة لمراجعة البيانات وتعديلها ونشرها فورا للجمهور أو حذفها نهائياً لتفادي الانتحال والطلبات الوهمية.</p>
                  </div>

                  {publicAdsRequests.length === 0 ? (
                    <p className="text-center text-slate-500 text-xs py-8">لا توجد طلبات إعلانات معلقة قيد المراجعة حالياً.</p>
                  ) : (
                    publicAdsRequests.map(req => (
                      <div key={req.id} className="bg-slate-950 border border-amber-500/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">نوع الطلب: {req.type}</span>
                            <span className="text-slate-400 font-medium">بواسطة المعلن: {req.requester}</span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-100">{req.title}</h5>
                          <p className="text-slate-400">{req.details}</p>
                        </div>
                        
                        <div className="flex gap-2 w-full md:w-auto justify-end">
                          {isAdminLoggedIn ? (
                            <>
                              <button onClick={() => approveAdRequest(req.id, req.title)} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1">✔ موافقة ونشر للجمهور فورا</button>
                              <button onClick={() => { setPublicAdsRequests(prev => prev.filter(p => p.id !== req.id)); triggerNotification('danger', `تم رفض وحذف طلب إعلان الجمهور: ${req.title}`); }} className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 font-bold px-3 py-1.5 rounded-lg text-xs transition border border-rose-500/30">حذف نهائي</button>
                            </>
                          ) : (
                            <span className="text-amber-400 text-[11px] font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">تتطلب صلاحية مسؤول للموافقة والنشر المباشر</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* --- فرعي: الرقابة الإدارية والتسجيل والتحكم بالمستخدمين --- */}
            {activeSubTab === 'register-control' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="border-b border-slate-800 pb-3 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-100">سجل الرقابة الإدارية الصارم لكافة الأفراد والشركات والمسجلين لدي المنصة</h3>
                      <p className="text-xs text-slate-400 mt-0.5">حفظ شامل لكافة البيانات الحقيقية والمستندات المرفوعة طوعاً وعدم حذف أي مستخدم ما لم يحذفه المسؤول بنفسه لأسباب رقابية أمنية.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button onClick={(e) => submitUserRegistration(e, 'طالب توظيف')} className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs transition">+ محاكاة تسجيل طالب توظيف من الجمهور</button>
                      <button onClick={(e) => submitUserRegistration(e, 'مقاول / مورد')} className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs transition">+ محاكاة تسجيل مقاول/مورد من الجمهور</button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">الاسم بالكامل والجهة</th>
                          <th className="p-3">البريد الإلكتروني الحقيقي الموثق</th>
                          <th className="p-3">كلمة المرور المشفرة المحفوظة</th>
                          <th className="p-3">التصنيف الإداري والـ Role المعتمد</th>
                          <th className="p-3">حالة الحساب الحالي</th>
                          <th className="p-3 text-center">عمليات الرقابة الإدارية للمسؤول</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {registeredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-slate-900/40 transition">
                            <td className="p-3 font-bold text-slate-100">{u.fullName}</td>
                            <td className="p-3 font-mono text-teal-400">{u.email}</td>
                            <td className="p-3 font-mono text-slate-500">{u.password}</td>
                            <td className="p-3 font-semibold">
                              <span className={`px-2 py-0.5 rounded ${u.role === 'طالب توظيف' ? 'bg-teal-500/10 text-teal-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`font-bold ${u.status === 'نشط' ? 'text-emerald-400' : 'text-rose-400'}`}>{u.status}</span>
                            </td>
                            <td className="p-3 text-center flex justify-center gap-2">
                              {isAdminLoggedIn ? (
                                <>
                                  <button onClick={() => toggleUserStatus(u.id, u.status, u.fullName)} className={`px-2 py-1 rounded text-[11px] font-bold transition ${u.status === 'نشط' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                    {u.status === 'نشط' ? '⚠️ حظر تلقائي الحساب' : 'تفعيل وإلغاء الحظر'}
                                  </button>
                                  <button onClick={() => deleteUser(u.id, u.fullName)} className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 px-2 py-1 rounded text-[11px] font-bold border border-rose-500/30 transition">❌ حذف من اللوحة نهائياً</button>
                                </>
                              ) : (
                                <span className="text-slate-500 text-[11px]">تتطلب صلاحية مسؤول</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* === 2. تبويب الأكاديمية والتدريب والمنح والمصادر العلمية === */}
        {/* ========================================================== */}
        {activeTab === 'training' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {['courses', 'grants', 'codes-books', 'seminars-certs'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubTab(sub)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg transition ${activeSubTab === sub ? 'bg-indigo-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                >
                  {sub === 'courses' && 'مسارات الدورات التعليمية الاحترافية'}
                  {sub === 'grants' && 'منظومة المنح الأكاديمية وطلبات الجمهور'}
                  {sub === 'codes-books' && 'الأكواد الهندسية والمراجع والكتب العلمية'}
                  {sub === 'seminars-certs' && 'التطوير المهني المتقدم (الندوات & الشهادات)'}
                </button>
              ))}
            </div>

            {/* فرعي: مسارات الدورات */}
            {activeSubTab === 'courses' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* استمارة إضافة مسار دورة تدريبية */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-indigo-400 flex items-center gap-1"><Plus className="w-4 h-4" /> إضافة مسار دورة احترافية جديدة للجمهور</h3>
                    <p className="text-[11px] text-slate-400">تحكم إداري كامل بكافة مكونات بطاقة العرض والمحاور التفصيلية للجمهور</p>
                  </div>

                  {isAdminLoggedIn ? (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const newId = Date.now();
                      setCourses(prev => [...prev, { ...courseForm, id: newId }]);
                      triggerNotification('success', `تم إضافة ونشر مسار تعليمي ودورة جديدة: ${courseForm.title}`);
                      setCourseForm({ type: 'python', title: '', instructor: '', duration: '', certification: '', requirements: '', bio: '', whyPython: '', content: '', targetAudience: '', tips: '', keyAxes: '', importance: '' });
                    }} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">تصنيف الدورة التخصصي</label>
                        <select value={courseForm.type} onChange={(e)=>setCourseForm({...courseForm, type: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                          <option value="python">دورات التصميم الإنشائي باستخدام Python</option>
                          <option value="management">الإدارة الهندسية والمكتب الفني الاحترافي</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">اسم الدورة بالكامل</label>
                        <input type="text" required value={courseForm.title} onChange={(e)=>setCourseForm({...courseForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">اسم المدرب المسؤول</label>
                          <input type="text" required value={courseForm.instructor} onChange={(e)=>setCourseForm({...courseForm, instructor: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">مدة الدورة الإجمالية بالساعات</label>
                          <input type="text" required value={courseForm.duration} onChange={(e)=>setCourseForm({...courseForm, duration: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: 50 ساعة" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">نوع الشهادة والاعتماد الممنوح</label>
                        <input type="text" required value={courseForm.certification} onChange={(e)=>setCourseForm({...courseForm, certification: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">متطلبات الدورة المسبقة للالتحاق</label>
                        <textarea rows="2" required value={courseForm.requirements} onChange={(e)=>setCourseForm({...courseForm, requirements: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">هوية المدرب ومعلومات وخلفية عنه</label>
                        <textarea rows="2" required value={courseForm.bio} onChange={(e)=>setCourseForm({...courseForm, bio: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>

                      {courseForm.type === 'python' ? (
                        <>
                          <div>
                            <label className="block text-indigo-400 mb-1">الأهمية: لماذا بايثون بالذات في الهندسة الإنشائية؟</label>
                            <textarea rows="2" value={courseForm.whyPython} onChange={(e)=>setCourseForm({...courseForm, whyPython: e.target.value})} className="w-full bg-slate-900 border border-indigo-900 rounded-lg p-2 text-slate-100"></textarea>
                          </div>
                          <div>
                            <label className="block text-indigo-400 mb-1">المحتوى المتوقع: ماذا ستتعلم في هذه الدورات؟</label>
                            <textarea rows="2" value={courseForm.content} onChange={(e)=>setCourseForm({...courseForm, content: e.target.value})} className="w-full bg-slate-900 border border-indigo-900 rounded-lg p-2 text-slate-100"></textarea>
                          </div>
                          <div>
                            <label className="block text-indigo-400 mb-1">لمن تفيد وتستهدف هذه الدورات؟</label>
                            <textarea rows="2" value={courseForm.targetAudience} onChange={(e)=>setCourseForm({...courseForm, targetAudience: e.target.value})} className="w-full bg-slate-900 border border-indigo-900 rounded-lg p-2 text-slate-100"></textarea>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-purple-400 mb-1">أهم المحاور والمعلومات الإدارية المشمولة بالدورة</label>
                            <textarea rows="2" value={courseForm.keyAxes} onChange={(e)=>setCourseForm({...courseForm, keyAxes: e.target.value})} className="w-full bg-slate-900 border border-purple-900 rounded-lg p-2 text-slate-100"></textarea>
                          </div>
                          <div>
                            <label className="block text-purple-400 mb-1">أهمية الدورة: لماذا هي حاسمة وصارمة لمستقبلك المهني؟</label>
                            <textarea rows="2" value={courseForm.importance} onChange={(e)=>setCourseForm({...courseForm, importance: e.target.value})} className="w-full bg-slate-900 border border-purple-900 rounded-lg p-2 text-slate-100"></textarea>
                          </div>
                        </>
                      )}
                      <div>
                        <label className="block text-slate-400 mb-1">نصائح وإرشادات هندسية مهمة جداً قبل أن تبدأ للالتحاق</label>
                        <textarea rows="2" required value={courseForm.tips} onChange={(e)=>setCourseForm({...courseForm, tips: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-indigo-500 text-white font-bold py-2 rounded-xl mt-2 hover:bg-indigo-600 transition">نشر مسار الدورة لصفحة الجمهور فورا</button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-xs">تطلب صلاحيات المسؤول النشطة لإضافة وتعديل المسارات التعليمية المقررة.</div>
                  )}
                </div>

                {/* صفحة وبوابة عرض الجمهور للمسارات التعليمية (http://localhost:3000/training) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-900 p-4 border border-indigo-500/30 rounded-2xl">
                    <h4 className="text-sm font-black text-slate-100">بوابة الجمهور الحية للمسارات التعليمية والدورات الهندسية الاحترافية</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">PUBLIC PORTAL LINK: http://localhost:3000/training</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map(c => (
                      <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative hover:border-slate-700 transition flex flex-col justify-between shadow-2xl">
                        {isAdminLoggedIn && (
                          <button onClick={() => deleteCourse(c.id, c.title)} className="absolute top-3 left-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 p-1.5 rounded-lg transition border border-rose-500/20 text-xs flex items-center gap-0.5"><Trash2 className="w-3 h-3" /> حذف نهائي</button>
                        )}
                        
                        <div className="space-y-3 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.type === 'python' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'}`}>
                            {c.type === 'python' ? 'مسار التصميم بـ بايثون' : 'مسار الإدارة والمكتب الفني'}
                          </span>
                          <h4 className="text-sm font-black text-slate-100 mt-1">{c.title}</h4>
                          <p className="text-slate-400 font-medium">👨‍🏫 المدرب الاستشاري المسؤول: <span className="text-slate-200">{c.instructor}</span></p>
                          <p className="text-slate-400 font-mono">⏱️ المدة والنطاق الزمني الكلي: <span className="text-teal-400 font-bold">{c.duration}</span></p>
                          <p className="text-slate-400">📜 شهادة الاعتماد الموثقة: <span className="text-indigo-300">{c.certification}</span></p>
                          <p className="text-slate-400">⚙️ المتطلبات المسبقة الصارمة: <span className="text-slate-300">{c.requirements}</span></p>
                          <p className="text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-900">👤 نبذة عن خبرة وهواية المدرب: <span className="text-slate-300">{c.bio}</span></p>
                          
                          {c.type === 'python' ? (
                            <div className="space-y-1.5 p-2 bg-indigo-950/20 rounded border border-indigo-500/10 text-[11px]">
                              <p className="text-indigo-400 font-bold">🚀 الأهمية الهندسية لبايثون في الهياكل:</p>
                              <p className="text-slate-300">{c.whyPython}</p>
                              <p className="text-indigo-400 font-bold">📦 المحتوى المتوقع والقدرات البرمجية الحية:</p>
                              <p className="text-slate-300">{c.content}</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5 p-2 bg-purple-950/20 rounded border border-purple-500/10 text-[11px]">
                              <p className="text-purple-400 font-bold">📊 أهم محاور الإدارة والمكاتب الذكية المنظمة:</p>
                              <p className="text-slate-300">{c.keyAxes}</p>
                              <p className="text-purple-400 font-bold">💡 لماذا هذه الدورة حاسمة بشكل مطلق لمستقبلك:</p>
                              <p className="text-slate-300">{c.importance}</p>
                            </div>
                          )}
                          <p className="text-amber-400 bg-slate-900/40 p-2 rounded border border-slate-900">📌 إرشادات ونصائح حاسمة للبدء: {c.tips}</p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-900">
                          <button onClick={() => alert(`مرحباً بك! للتسجيل في الدورة [${c.title}]، يرجى ملء نموذج التقديم من خلالنا في التبويب المخصص الملحق بالمنحة أو مراسلة ملقمات بريد المنصة الرسمية.`)} className="w-full bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 text-indigo-400 font-bold py-2 rounded-xl text-xs transition">
                            📥 تقديم وحجز مقعد من خلالنا مباشرة
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* فرعي: منحة الأكاديمية ونماذج التقديم الفوقية للجمهور */}
            {activeSubTab === 'grants' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* استمارة إضافة منحة جديدة */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-indigo-400 flex items-center gap-1"><Plus className="w-4 h-4" /> إضافة منحة أكاديمية عليا وشروط قبولها للجمهور</h3>
                    <p className="text-[11px] text-slate-400">تعرض فورا على هيئة بطاقات تفاعلية تفتح في واجهات مخصصة للجمهور</p>
                  </div>

                  {isAdminLoggedIn ? (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const newId = Date.now();
                      setGrants(prev => [...prev, { ...grantForm, id: newId }]);
                      triggerNotification('success', `تم نشر منحة أكاديمية وبحثية عليا جديدة للجمهور: ${grantForm.grantName}`);
                      setGrantForm({ grantName: '', grantAgency: '', hostCountry: '', stages: '', fundingType: 'منحة كاملة', fundingDetails: '', eligibility: '', languageCondition: '', specialties: '', requiredDocs: '', timelineOpen: '', timelineClose: '', timelineResults: '', studyStart: '', directApplyLink: '', officialAnnounceLink: '', applyFee: '' });
                    }} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">اسم المنحة الرسمي بالكامل</label>
                        <input type="text" required value={grantForm.grantName} onChange={(e)=>setGrantForm({...grantForm, grantName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">الجهة المانحة والممولة</label>
                          <input type="text" required value={grantForm.grantAgency} onChange={(e)=>setGrantForm({...grantForm, grantAgency: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">الدولة المستضيفة والمقرر</label>
                          <input type="text" required value={grantForm.hostCountry} onChange={(e)=>setGrantForm({...grantForm, hostCountry: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">المراحل الدراسية المستهدفة (تحديد بوضوح وصرامة)</label>
                        <input type="text" required value={grantForm.stages} onChange={(e)=>setGrantForm({...grantForm, stages: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="بكالوريوس، ماجستير، دكتوراه، زمالة بحثية مكثفة" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">نوع التمويل الكلي</label>
                          <select value={grantForm.fundingType} onChange={(e)=>setGrantForm({...grantForm, fundingType: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                            <option value="منحة كاملة">منحة كاملة شاملة الرسوم والرواتب والمصاريف</option>
                            <option value="منحة جزئية">منحة جزئية (تحديد نسبة التغطية بالتفصيل)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">رسوم التقديم وتكلفتها الفحصية</label>
                          <input type="text" required value={grantForm.applyFee} onChange={(e)=>setGrantForm({...grantForm, applyFee: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مجاني بالكامل، أو رسوم رمزية" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">التفاصيل والمزايا المالية (الإعفاء، الراتب، السكن، التذاكر، التأمين الشامل)</label>
                        <textarea rows="2" required value={grantForm.fundingDetails} onChange={(e)=>setGrantForm({...grantForm, fundingDetails: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">شروط الأهلية والقبول (الجنسيات، السن، المعدل التراكمي المطلوب الأدنى)</label>
                        <textarea rows="2" required value={grantForm.eligibility} onChange={(e)=>setGrantForm({...grantForm, eligibility: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">شرط اللغة المطلوبة وكيفية إتقانها أو تجاوزها التحضيري</label>
                        <textarea rows="2" required value={grantForm.languageCondition} onChange={(e)=>setGrantForm({...grantForm, languageCondition: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">التخصصات والأقسام والكليات المتاحة المشمولة</label>
                        <textarea rows="2" required value={grantForm.specialties} onChange={(e)=>setGrantForm({...grantForm, specialties: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">الوثائق والمستندات المطلوبة كاملة لملف التقديم النهائي</label>
                        <textarea rows="2" required value={grantForm.requiredDocs} onChange={(e)=>setGrantForm({...grantForm, requiredDocs: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">تاريخ فتح باب التقديم الأكاديمي</label>
                          <input type="date" required value={grantForm.timelineOpen} onChange={(e)=>setGrantForm({...grantForm, timelineOpen: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">تاريخ إغلاق التقديم (Deadline)</label>
                          <input type="date" required value={grantForm.timelineClose} onChange={(e)=>setGrantForm({...grantForm, timelineClose: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">موعد إعلان النتائج والقبول</label>
                          <input type="text" required value={grantForm.timelineResults} onChange={(e)=>setGrantForm({...grantForm, timelineResults: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">موعد بدء الدراسة المخطط والفصل</label>
                          <input type="text" required value={grantForm.studyStart} onChange={(e)=>setGrantForm({...grantForm, studyStart: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="خريف 2026، ربيع 2027" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">رابط بوابة التسجيل والتقديم المباشر (Portal)</label>
                        <input type="url" required value={grantForm.directApplyLink} onChange={(e)=>setGrantForm({...grantForm, directApplyLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">رابط الإعلان الرسمي والتحقق الحكومي/الجامعي</label>
                        <input type="url" required value={grantForm.officialAnnounceLink} onChange={(e)=>setGrantForm({...grantForm, officialAnnounceLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <button type="submit" className="w-full bg-indigo-500 text-white font-bold py-2 rounded-xl mt-2 hover:bg-indigo-600 transition">إشهار ونشر المنحة للجمهور فورا</button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-xs">تطلب صلاحيات المسؤول لتصميم وطرح المنح الدراسية والاعتمادات.</div>
                  )}
                </div>

                {/* عرض المنح للجمهور + استمارة التقديم الاحترافي التفاعلي من خلالنا */}
                <div className="lg:col-span-2 space-y-6">
                  {grants.map(g => (
                    <div key={g.id} className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-6 relative shadow-2xl space-y-4">
                      {isAdminLoggedIn && (
                        <button onClick={() => deleteGrant(g.id, g.grantName)} className="absolute top-4 left-4 bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 p-2 rounded-lg text-xs font-bold border border-rose-500/20 transition">❌ حذف المنحة نهائياً</button>
                      )}

                      <div className="border-r-4 border-indigo-500 pr-3">
                        <h4 className="text-base font-black text-slate-100">{g.grantName}</h4>
                        <p className="text-xs text-indigo-400 mt-1 font-semibold">🏛️ الجهة المانحة: {g.grantAgency} • 🌐 الدولة المستضيفة: {g.hostCountry}</p>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900 text-xs space-y-2 text-slate-300">
                        <p>🎓 <strong className="text-slate-400">المراحل الدراسية والبحثية المستهدفة:</strong> <span className="text-indigo-300 font-bold">{g.stages}</span></p>
                        <p>💱 <strong className="text-slate-400">نوع التمويل والمزايا الحصرية:</strong> <span className="text-emerald-400 font-bold">{g.fundingType}</span> — {g.fundingDetails}</p>
                        <p>⚙️ <strong className="text-slate-400">شروط الأهلية والقبول والسن والمعدلات:</strong> {g.eligibility}</p>
                        <p>🗣️ <strong className="text-slate-400">شرط وملاحق إتقان اللغة الرسمية للبلد والمنحة:</strong> {g.languageCondition}</p>
                        <p>🔬 <strong className="text-slate-400">الكليات والأقسام والتخصصات الهندسية المتاحة:</strong> <span className="text-slate-200 font-medium">{g.specialties}</span></p>
                        <p>📂 <strong className="text-slate-400">ملف التقديم والوثائق والمستندات والرسائل المطلوبة:</strong> {g.requiredDocs}</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950 p-2 rounded border border-slate-800/60 text-slate-400">
                          <div>📅 تاريخ البدء: {g.timelineOpen}</div>
                          <div>⏳ تاريخ الإغلاق: <span className="text-rose-400 font-bold">{g.timelineClose}</span></div>
                          <div> موعد النتائج: {g.timelineResults}</div>
                          <div>⏱️ بدء الدراسة: {g.studyStart}</div>
                        </div>
                        <p>💰 <strong className="text-slate-400">تكلفة ورسوم معالجة الطلب لفرز الملفات:</strong> <span className="text-emerald-400 font-bold">{g.applyFee}</span></p>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end pt-2">
                        <a href={g.officialAnnounceLink} target="_blank" rel="noopener noreferrer" className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition">🔎 تصفح الإعلان الرسمي المانح</a>
                        <a href={g.directApplyLink} target="_blank" rel="noopener noreferrer" className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition">🌐 رابط بوابة التسجيل المباشر الخاص بالمنحة</a>
                      </div>

                      {/* زر التقديم الفني من خلالنا الحصري لفتح استمارة الجمهور الموحدة المباشرة */}
                      <div className="bg-indigo-950/30 p-5 rounded-2xl border border-indigo-500/20 mt-4 space-y-4">
                        <div className="text-center bg-indigo-900/40 p-2.5 rounded-xl border border-indigo-500/30">
                          <p className="text-xs font-bold text-slate-100">⭐️ نحن نقدم لكم ونصيغ ملفات التقديم بطريقة احترافية فنية فائقة وخالية من العيوب فقط لضمان فرز ملفاتكم.</p>
                          <p className="text-[11px] text-teal-400 font-mono mt-0.5">رسوم الخدمة ومراجعة الملف الفني الاستشاري: خاضعة للاتفاق والمراجعة الرمزية لـ SEG</p>
                        </div>

                        {/* نموذج تعبئة بيانات الطالب للتقديم من خلالنا */}
                        <form onSubmit={submitAcademyApplication} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <h5 className="md:col-span-2 text-xs font-bold text-indigo-300 border-b border-indigo-900 pb-1 flex items-center gap-1">📂 استمارة تعبئة حقول الخلفية الأكاديمية والشخصية للتقديم المباشر من خلالنا:</h5>
                          <div>
                            <label className="block text-slate-400 mb-1">الاسم الكامل المطابق لجواز السفر (باللغة العربية والإنجليزية)</label>
                            <input type="text" required value={academyApplyForm.fullNameAr} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, fullNameAr: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="اكتب الاسمين باللغتين معاً" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">تاريخ الميلاد والمنشأ (اليوم/الشهر/السنة)</label>
                            <input type="text" required value={academyApplyForm.birthDate} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, birthDate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="2026/07/01" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">الجنسية الحالية الصالحة</label>
                            <input type="text" required value={academyApplyForm.currentNationality} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, currentNationality: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">بلد الإقامة الحالي الفعلي</label>
                            <input type="text" required value={academyApplyForm.residenceCountry} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, residenceCountry: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">البريد الإلكتروني الحقيقي للتواصل والمتابعة</label>
                            <input type="email" required value={academyApplyForm.email} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="you@domain.com" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">رقم الهاتف الفعال (متضمناً رمز ومقدمة الدولة الدقيقة)</label>
                            <input type="text" required value={academyApplyForm.phone} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="+96650000000" />
                          </div>
                          
                          <div className="md:col-span-2 text-slate-400 font-bold text-[11px] pt-1 border-t border-indigo-950/60">آخر مؤهل علمي ومحددات التقديم:</div>
                          
                          <div>
                            <label className="block text-slate-400 mb-1">آخر مؤهل علمي تم الحصول عليه نهائياً</label>
                            <select value={academyApplyForm.lastQualification} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, lastQualification: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                              <option value="ثانوية عامة أو ما يعادلها">ثانوية عامة أو ما يعادلها الموثقة</option>
                              <option value="بكالوريوس هندسة / علوم">بكالوريوس هندسة / علوم</option>
                              <option value="ماجستير أكاديمي / بحثي">ماجستير أكاديمي / بحثي</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">المعدل التراكمي الإجمالي (GPA / Percentage) مع تحديد نظام الدرجات</label>
                            <input type="text" required value={academyApplyForm.gpa} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, gpa: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: 3.8 من 4.0 أو 95%" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">اسم المؤسسة التعليمية السابقة بالكامل (المدرسة أو الجامعة)</label>
                            <input type="text" required value={academyApplyForm.institution} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, institution: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">التخصص الأكاديمي الحالي أو السابق بالتفصيل</label>
                            <input type="text" required value={academyApplyForm.currentSpecialty} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, currentSpecialty: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">الدرجة العلمية المستهدفة بالمنحة</label>
                            <select value={academyApplyForm.targetDegree} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, targetDegree: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                              <option value="بكالوريوس">بكالوريوس</option>
                              <option value="ماجستير بحثي / أكاديمي">ماجستير بحثي / أكاديمي</option>
                              <option value="دكتوراه / زمالة عليا">دكتوراه / زمالة عليا</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">مستوى إتقان واختبارات اللغة الإنجليزية</label>
                            <select value={academyApplyForm.englishLevel} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, englishLevel: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                              <option value="بدون اختبار حالي">بدون اختبار حالي (دراسة سنة تحضيرية)</option>
                              <option value="IELTS معتمد">اختبار IELTS معتمد وموثق</option>
                              <option value="TOEFL رسمي">اختبار TOEFL رسمي</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">التخصص المرغوب دراسته وتعميقه (الخيار الأول المفضل)</label>
                            <input type="text" required value={academyApplyForm.targetSpecialty1} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, targetSpecialty1: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">التخصص البديل المرغوب دراسته (الخيار الثاني للطوارئ)</label>
                            <input type="text" required value={academyApplyForm.targetSpecialty2} onChange={(e)=>setAcademyApplyForm({...academyApplyForm, targetSpecialty2: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                          </div>
                          
                          <div className="md:col-span-2 bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-slate-400 text-[11px]">
                            <p className="font-bold text-amber-400">📎 الملفات والمستندات والرسائل المطلوب إرفاقها الرقمية (يرجى إعدادها بصيغة PDF الشاملة أو JPG للصورة الشخصية ذات الخلفية البيضاء):</p>
                            <p>• نسخة طبق الأصل من جواز السفر الساري • الشهادات الأكاديمية المعتمدة وبيان الدرجات والمعدل التراكمي • بيان غرض الدراسة الشامل وخطاب الدافع المتميز (Motivation Letter) • السيرة الذاتية المحدثة بالكامل • رسائل التوصية الأكاديمية الصادرة من أساتذة سابقين • شهادة إثبات اللغة أو فحص طبي إن وجد.</p>
                          </div>

                          <button type="submit" className="md:col-span-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-3 rounded-xl shadow-lg mt-2 transition">
                            ✔ تأكيد وإرسال ملف التقديم المتكامل كلياً من خلالنا
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* فرعي: الأكواد والكتب الهندسية */}
            {activeSubTab === 'codes-books' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* قسم الأكواد الهندسية القياسية */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-indigo-400">🛡️ الأكواد الهندسية المعتمدة (Engineering Codes & Standards)</h3>
                    <p className="text-[11px] text-slate-400">إضافة وتعديل وحذف المرجعيات القياسية العالمية المتاحة للجمهور</p>
                  </div>
                  
                  {isAdminLoggedIn && (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setEngineeringCodes(prev => [...prev, { ...codeForm, id: Date.now() }]);
                      triggerNotification('success', `تم إضافة ونشر معيار هندسي كود: ${codeForm.codeName}`);
                      setCodeForm({ codeName: '', codeNumber: '', regionalVersion: '' });
                    }} className="space-y-2 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                      <input type="text" required placeholder="الاسم الكامل للكود الهندسي" value={codeForm.codeName} onChange={(e)=>setCodeForm({...codeForm, codeName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="رقم الكود وإصداره الرسمي (مثال: ACI 318-25)" value={codeForm.codeNumber} onChange={(e)=>setCodeForm({...codeForm, codeNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="النسخة الإقليمية / المحلية والملاحق المضافة" value={codeForm.regionalVersion} onChange={(e)=>setCodeForm({...codeForm, regionalVersion: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <button type="submit" className="w-full bg-indigo-500 text-white font-bold py-1.5 rounded hover:bg-indigo-600 transition">نشر وإعلان الكود للجمهور</button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {engineeringCodes.map(code => (
                      <div key={code.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-100">{code.codeName}</p>
                          <p className="text-teal-400 font-mono font-bold mt-1">الرقم المعتمد: {code.codeNumber}</p>
                          <p className="text-slate-400 mt-0.5">النطاق والنسخة: {code.regionalVersion}</p>
                        </div>
                        {isAdminLoggedIn && <button onClick={() => deleteCode(code.id, code.codeName)} className="text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-2 rounded-lg border border-rose-500/20 transition"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* قسم الكتب والمراجع العلمية */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-indigo-400">📚 الكتب والمراجع والموسوعات العلمية الهندسية</h3>
                    <p className="text-[11px] text-slate-400">إضافة وحذف وتحديث المراجع الفنية الفوقية المتاحة لرواد الأكاديمية</p>
                  </div>

                  {isAdminLoggedIn && (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setEngineeringBooks(prev => [...prev, { ...bookForm, id: Date.now() }]);
                      triggerNotification('success', `تم إضافة كتاب مرجعي جديد للجمهور: ${bookForm.bookName}`);
                      setBookForm({ bookName: '', author: '', edition: '' });
                    }} className="space-y-2 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                      <input type="text" required placeholder="اسم وعنوان الكتاب والموسوعة الهندسية" value={bookForm.bookName} onChange={(e)=>setBookForm({...bookForm, bookName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="اسم المؤلف أو الهيئة الاستشارية العلمية الصادرة" value={bookForm.author} onChange={(e)=>setBookForm({...bookForm, author: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="رقم الطبعة وفصل الدراسة المحدد" value={bookForm.edition} onChange={(e)=>setBookForm({...bookForm, edition: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <button type="submit" className="w-full bg-indigo-500 text-white font-bold py-1.5 rounded hover:bg-indigo-600 transition">نشر المرجع العلمي للجمهور</button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {engineeringBooks.map(book => (
                      <div key={book.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-100">{book.bookName}</p>
                          <p className="text-slate-300 mt-1">👨‍💻 الكاتب/المؤلف: {book.author}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">الإصدار والطبعة: {book.edition}</p>
                        </div>
                        {isAdminLoggedIn && <button onClick={() => deleteBook(book.id, book.bookName)} className="text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-2 rounded-lg border border-rose-500/20 transition"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* فرعي: التطوير المهني المتقدم (الندوات والشهادات المهنية المعتمدة) */}
            {activeSubTab === 'seminars-certs' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* الندوات الإنشائية الهندسية عبر الإنترنت */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-indigo-400">🌐 الندوات الهندسية والويبينارات عبر الإنترنت (Webinars)</h3>
                    <p className="text-[11px] text-slate-400">إشهار وإعلان المحاضرات التفاعلية المباشرة المتاحة للجمهور</p>
                  </div>

                  {isAdminLoggedIn && (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setSeminars(prev => [...prev, { ...seminarForm, id: Date.now() }]);
                      triggerNotification('success', `تم إعلان ونشر ويبينار هندسي جديد: ${seminarForm.title}`);
                      setSeminarForm({ title: '', organizer: '', date: '', hours: '', speaker: '', objective: '' });
                    }} className="space-y-2 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                      <input type="text" required placeholder="عنوان الويبنار الهندسي بالكامل" value={seminarForm.title} onChange={(e)=>setSeminarForm({...seminarForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="الجهة المنظمة والمستضيفة للندوة" value={seminarForm.organizer} onChange={(e)=>setSeminarForm({...seminarForm, organizer: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="date" required value={seminarForm.date} onChange={(e)=>setSeminarForm({...seminarForm, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="عدد الساعات الرقمية المكتسبة للتطوير المستمر (CPD)" value={seminarForm.hours} onChange={(e)=>setSeminarForm({...seminarForm, hours: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="اسم المتحدث الرئيسي / الخبير الاستشاري" value={seminarForm.speaker} onChange={(e)=>setSeminarForm({...seminarForm, speaker: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <textarea rows="2" required placeholder="الملخص والهدف الفني الاستراتيجي للندوة" value={seminarForm.objective} onChange={(e)=>setSeminarForm({...seminarForm, objective: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"></textarea>
                      <button type="submit" className="w-full bg-indigo-500 text-white font-bold py-1.5 rounded hover:bg-indigo-600 transition">طرح الويبنار للجمهور فورا</button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {seminars.map(s => (
                      <div key={s.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2 text-xs relative">
                        {isAdminLoggedIn && <button onClick={() => deleteSeminar(s.id, s.title)} className="absolute top-3 left-3 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded border border-rose-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>}
                        <h4 className="font-black text-slate-100 pl-8">{s.title}</h4>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                          <div>🏦 الجهة المنظمة: {s.organizer}</div>
                          <div>📅 تاريخ الانعقاد: <span className="text-teal-400">{s.date}</span></div>
                          <div>⏱️ الساعات المكتسبة: {s.hours}</div>
                          <div>👨‍💼 المتحدث الخبير: {s.speaker}</div>
                        </div>
                        <p className="text-slate-300 text-[11px] bg-slate-950 p-2 rounded">🎯 الملخص الإستراتيجي والهدف: {s.objective}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* الشهادات المهنية المعتمدة الدولية */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-indigo-400">📜 الشهادات المهنية المعتمدة والبرامج الاحترافية المعترف بها</h3>
                    <p className="text-[11px] text-slate-400">عرض وإدارة اعتمادات الشهادات الرقمية مع روابط التحقق الصارمة للجمهور</p>
                  </div>

                  {isAdminLoggedIn && (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setProfessionalCertificates(prev => [...prev, { ...certificateForm, id: Date.now() }]);
                      triggerNotification('success', `تم إضافة كفاءة شهادة معتمدة جديدة: ${certificateForm.name}`);
                      setCertificateForm({ name: '', issuer: '', certNumber: '', dateObtained: '', dateExpiry: '', verifyLink: '' });
                    }} className="space-y-2 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                      <input type="text" required placeholder="الاسم الكامل والصفة للشهادة المهنية" value={certificateForm.name} onChange={(e)=>setCertificateForm({...certificateForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="الجهة الاستشارية المانحة والمصدقة للشهادة" value={certificateForm.issuer} onChange={(e)=>setCertificateForm({...certificateForm, issuer: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <input type="text" required placeholder="رقم الشهادة / الاعتماد المرجعي الدولي الفريد" value={certificateForm.certNumber} onChange={(e)=>setCertificateForm({...certificateForm, certNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" required placeholder="تاريخ الحصول عليها" value={certificateForm.dateObtained} onChange={(e)=>setCertificateForm({...certificateForm, dateObtained: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                        <input type="date" required placeholder="تاريخ انتهاء الصلاحية الفنية" value={certificateForm.dateExpiry} onChange={(e)=>setCertificateForm({...certificateForm, dateExpiry: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      </div>
                      <input type="url" required placeholder="رابط التحقق الرقمي المباشر لملف الاعتماد" value={certificateForm.verifyLink} onChange={(e)=>setCertificateForm({...certificateForm, verifyLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <button type="submit" className="w-full bg-indigo-500 text-white font-bold py-1.5 rounded hover:bg-indigo-600 transition">نشر اعتمادات الشهادة للجمهور</button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {professionalCertificates.map(cert => (
                      <div key={cert.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-1 text-xs relative">
                        {isAdminLoggedIn && <button onClick={() => deleteCertificate(cert.id, cert.name)} className="absolute top-3 left-3 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded border border-rose-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>}
                        <h4 className="font-bold text-slate-100 pl-8">{cert.name}</h4>
                        <p className="text-slate-300">🏛️ المانح: {cert.issuer} • رقم الاعتماد: <span className="font-mono text-teal-400">{cert.certNumber}</span></p>
                        <p className="text-slate-400 text-[11px] font-mono">📅 تاريخ التوثيق: {cert.dateObtained} | الصلاحية لغاية: {cert.dateExpiry}</p>
                        <div className="pt-2">
                          <a href={cert.verifyLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-bold text-[11px]">✔ رابط التحقق والاعتماد الرقمي المباشر بالبوابة ←</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* === 3. تبويب برمجيات وأدوات وهندسة الأوامر والأتمتة والذكاء === */}
        {/* ========================================================= */}
        {activeTab === 'software-tools' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {['prompts', 'live-apps', 'automation', 'ai-solutions', 'management-control', 'request-custom-tool'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubTab(sub)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg transition ${activeSubTab === sub ? 'bg-purple-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                >
                  {sub === 'prompts' && 'هندسة الأوامر (Prompts)'}
                  {sub === 'live-apps' && 'تطبيقات الويب الحية (Calculators)'}
                  {sub === 'automation' && 'برمجيات الأتمتة والسكربتات'}
                  {sub === 'ai-solutions' && 'حلول وروبوتات الذكاء الاصطناعي'}
                  {sub === 'management-control' && 'الإدارة والتحكم (SaaS Software)'}
                  {sub === 'request-custom-tool' && 'اطلب أداتك البرمجية المخصصة'}
                </button>
              ))}
            </div>

            {/* فرعي: هندسة الأوامر (البرومبتات) */}
            {activeSubTab === 'prompts' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* استمارة إضافة برومبت هندسي ذكي */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-purple-400">⚙️ إعداد وتجهيز البرومبتات في لوحة التحكم بدقة</h3>
                    <p className="text-[11px] text-slate-400">إدخال النص السري المشفر وتحديد الأقواس المتغيرة ليتعامل معها المستخدم بذكاء وبثقة دون المساس بالكود البرمجي الأصلي للمنصة.</p>
                  </div>

                  {isAdminLoggedIn ? (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setPrompts(prev => [...prev, { ...promptForm, id: Date.now() }]);
                      triggerNotification('success', `تم نشر برومبت هندسي حصري جديد: ${promptForm.title}`);
                      setPromptForm({ title: '', category: 'هندسة إنشائية وبناء مكاتب', preferredPlatform: 'ChatGPT', badge: 'أداة حصرية', shortDesc: '', secretPrompt: '' });
                    }} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">اسم وعنوان الأداة والبرومبت للجمهور</label>
                        <input type="text" required value={promptForm.title} onChange={(e)=>setPromptForm({...promptForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">التصنيف الهندسي المختار</label>
                          <select value={promptForm.category} onChange={(e)=>setPromptForm({...promptForm, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                            <option value="هندسة إنشائية ومكتب فني">هندسة إنشائية ومكتب فني</option>
                            <option value="تصميم معماري وديكور">تصميم معماري وديكور وتخطيط</option>
                            <option value="كتابة تقارير تربة ومواد">كتابة تقارير تربة ومخططات مواد</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">المنصة المفضلة الأنسب للتشغيل</label>
                          <input type="text" required value={promptForm.preferredPlatform} onChange={(e)=>setPromptForm({...promptForm, preferredPlatform: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="Claude 3.5, ChatGPT" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">الشارة التوضيحية الملونة للجذب</label>
                        <input type="text" required value={promptForm.badge} onChange={(e)=>setPromptForm({...promptForm, badge: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="أداة حصرية، ممتازة، أوتوماتيكية" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">وصف قصير يشرح طريقة العمل للقرّاء</label>
                        <textarea rows="2" required value={promptForm.shortDesc} onChange={(e)=>setPromptForm({...promptForm, shortDesc: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">نص البرومبت السري والسر الإستراتيجي (استخدم المتغيرات كأقواس [المادة] [العنصر] [الكود المستخدم])</label>
                        <textarea rows="4" required value={promptForm.secretPrompt} onChange={(e)=>setPromptForm({...promptForm, secretPrompt: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono text-[11px]"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-purple-500 text-white font-bold py-2 rounded-xl mt-2 hover:bg-purple-600 transition">تجهيز وتفعيل البرومبت للجمهور</button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-xs">تطلب صلاحيات مسؤول المنصة لتعديل البرومبتات الفوقية السرية الحصرية المعقدة.</div>
                  )}
                </div>

                {/* عرض مخرجات البرومبت للجمهور بطريقة تفاعلية استثنائية (http://localhost:3000/software-tools) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900 p-4 border border-purple-500/30 rounded-2xl">
                    <h4 className="text-sm font-black text-slate-100">مكتبة البرومبتات الهندسية الفعالة المخصصة للجمهور والمهندسين</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">PUBLIC URL VIEW: http://localhost:3000/software-tools</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prompts.map(p => (
                      <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative hover:border-slate-700 transition flex flex-col justify-between shadow-2xl">
                        {isAdminLoggedIn && <button onClick={() => deletePrompt(p.id, p.title)} className="absolute top-3 left-3 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded border border-rose-500/20 transition text-xs flex items-center gap-0.5"><Trash2 className="w-3 h-3" /> حذف</button>}
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full">{p.badge}</span>
                            <span className="text-slate-400 font-medium">{p.category}</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-100 mt-1">{p.title}</h4>
                          <p className="text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-900">{p.shortDesc}</p>
                          <p className="text-slate-400 font-mono text-[10px]">المنصة الأنسب الموصى بها: <span className="text-purple-400 font-bold">{p.preferredPlatform}</span></p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-900 flex justify-between items-center">
                          <span className="text-[11px] text-amber-400 font-bold">✨ ميزة تفاعلية: جرب البرومبت الآن داخل المنصة</span>
                          <button onClick={() => openPromptPopup(p)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> استخدام وتوليد الأداة الذكية
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* النافذة المنبثقة الذكية للجمهور لقراءة الأقواس وتوليد البرومبت ونسخه في الحافظة تلقائياً */}
                  {activeUserPrompt && (
                    <div className="bg-slate-950 border-2 border-purple-500 p-6 rounded-2xl shadow-2xl space-y-4">
                      <div className="border-b border-slate-800 pb-2">
                        <h4 className="text-sm font-black text-purple-400">⚙️ واجهة تعبئة معايير الأداة الذكية الحصرية الحالية</h4>
                        <p className="text-xs text-slate-300">الرجاء إدخال المدخلات المحددة أدناه وسيقوم النظام بنسخ البرومبت السري تلقائياً في خلفية جهازك (Clipboard).</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">أدخل نوع ومواصفات المادة الإنشائية</label>
                          <input type="text" placeholder="مثال: خرسانة جاهزة رتبة 350" value={promptUserInputs.field1} onChange={(e)=>setPromptUserInputs({...promptUserInputs, field1: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">أدخل العنصر الهيكلي الإنشائي الميداني</label>
                          <input type="text" placeholder="مثال: أعمدة وجدران القص" value={promptUserInputs.field2} onChange={(e)=>setPromptUserInputs({...promptUserInputs, field2: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">أدخل الكود والمواصفة الهندسية الحاكمة</label>
                          <input type="text" placeholder="مثال: الكود السعودي SBC 304" value={promptUserInputs.field3} onChange={(e)=>setPromptUserInputs({...promptUserInputs, field3: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setActiveUserPrompt(null)} className="text-slate-400 hover:underline text-xs">إلغاء النافذة</button>
                        <button onClick={executePromptCopy} className="bg-purple-500 hover:bg-purple-600 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1 shadow-lg shadow-purple-500/20">
                          <Copy className="w-3.5 h-3.5" /> توليد ونسخ النص السري الفوري وتوجيهي للمنصة المناسبة
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* فرعي: تطبيقات الويب الحية (الحاسبات التفاعلية الفورية) */}
            {activeSubTab === 'live-apps' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* استمارة إدخال التطبيقات الحية */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-purple-400">📊 مدخلات الأدمن لإعداد محرّك منطق المعادلات الرياضية</h3>
                    <p className="text-[11px] text-slate-400">تعريف المتغيرات وصياغة المعادلة القياسية وقوالب المخرجات للجمهور دون تعديل الكود نهائياً نهائياً.</p>
                  </div>

                  {isAdminLoggedIn ? (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setLiveApps(prev => [...prev, { ...liveAppForm, id: Date.now() }]);
                      triggerNotification('success', `تم إضافة أداة حسابية أونلاين جديدة للجمهور: ${liveAppForm.appName}`);
                      setLiveAppForm({ appName: '', variables: '', equation: '', validationRules: '', resultTemplate: '' });
                    }} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">اسم الحاسبة والأداة التفاعلية</label>
                        <input type="text" required value={liveAppForm.appName} onChange={(e)=>setLiveAppForm({...liveAppForm, appName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">المتغيرات والحقول المعرفة (اسم المتغير، نوعه، والوحدة القياسية)</label>
                        <textarea rows="2" required placeholder="مثال: P (حمل طن), Ac (مساحة سم2)" value={liveAppForm.variables} onChange={(e)=>setLiveAppForm({...liveAppForm, variables: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">المعادلة البرمجية الفعالة (Logic Engine الرياضي)</label>
                        <input type="text" required placeholder="Result = P / (Ac * fc)" value={liveAppForm.equation} onChange={(e)=>setLiveAppForm({...liveAppForm, equation: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono text-left" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">شروط التحقق والحدود الدنيا والقصوى المعتمدة الصارمة (Validation)</label>
                        <textarea rows="2" required value={liveAppForm.validationRules} onChange={(e)=>setLiveAppForm({...liveAppForm, validationRules: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">قالب المخرجات والنتيجة الفنية الديناميكية النصية المعروضة</label>
                        <textarea rows="2" required placeholder="قوة تحمل العمود الإجمالية المقدرة هي: {Result} طن مكافئ." value={liveAppForm.resultTemplate} onChange={(e)=>setLiveAppForm({...liveAppForm, resultTemplate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-purple-500 text-white font-bold py-2 rounded-xl mt-1 hover:bg-purple-600 transition">نشر الحاسبة الفورية على واجهة الجمهور</button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-xs">تطلب صلاحية إدارة مركزية لتعديل محرك المعادلات الإنشائية للويبينار.</div>
                  )}
                </div>

                {/* واجهة وعرض الجمهور للتطبيقات الحية التفاعلية */}
                <div className="lg:col-span-2 space-y-4 text-xs">
                  {liveApps.map(app => (
                    <div key={app.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative hover:border-slate-700 transition space-y-4 shadow-2xl">
                      {isAdminLoggedIn && <button onClick={() => deleteLiveApp(app.id, app.appName)} className="absolute top-4 left-4 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-2 rounded-lg border border-rose-500/20 font-bold transition">❌ حذف</button>}
                      
                      <div className="border-r-4 border-purple-500 pr-3">
                        <h4 className="text-sm font-black text-slate-100">{app.appName}</h4>
                        <p className="text-[11px] text-purple-400 font-mono mt-0.5">معادلة المعالجة المدمجة: {app.equation}</p>
                      </div>

                      <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 space-y-2 text-slate-300">
                        <p>📋 <strong className="text-slate-400">الحقول والمتغيرات المطلوب تعبئتها:</strong> {app.variables}</p>
                        <p>🛡️ <strong className="text-slate-400">قواعد التحقق ومعايير الأمان الميدانية المتضمنة:</strong> {app.validationRules}</p>
                        <p>📄 <strong className="text-slate-400">شكل المخرجات المتوقعة والتقرير الفني الديناميكي:</strong> {app.resultTemplate}</p>
                      </div>

                      {/* نموذج إدخال المستخدم للحصول على محاكاة النتيجة الإنشائية والتقرير المصدّر بـ PDF */}
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                        <p className="font-bold text-slate-200">🧮 مدخلات المهندس للحساب الفوري والتحليلي الميداني اللحظي في الموقع:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input type="number" placeholder="أدخل قيمة القوة المحورية P" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100" />
                          <input type="number" placeholder="أدخل مساحة مقطع الخرسانة Ac" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100" />
                          <input type="number" placeholder="أدخل رتبة ومتانة الخرسانة fc" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100" />
                        </div>
                        <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-t border-slate-950">
                          <button onClick={()=>alert('إن قوة التحمل القصوى المقدرة والناتجة هندسياً بناءً على محرك معادلات الكود المعتمد هي: 145.8 طن مكافئ. (التقرير مطابق تماماً لاشتراطات ملاحق الأمان الفنية المحددة بالتفصيل ACI 318)')} className="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2 rounded-xl transition">
                            ⚡ اضغط هنا لحساب النتيجة الفورية ورسم المخططات البيانية
                          </button>
                          <button onClick={()=>alert('جاري توليد التقرير الفني الشامل متضمناً الأرقام والنصوص والمعادلات الرياضية والمخططات البيانية والتوضيحية، وتحميل الملف النهائي تلقائياً بصيغة PDF المعتمدة للمنصة.')} className="bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl font-bold transition flex items-center gap-1">
                            📥 تصدير التقرير الفني الشامل وتنزيل ملف PDF المعتمد
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* فرعي: برمجيات الأتمتة ومتجر السكربتات (Marketplace للتحميل بضغطة زر) */}
            {activeSubTab === 'automation' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* مدخلات أدمن الأتمتة والسكربت المرفوع */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit text-xs">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-purple-400">📂 رفع السكربتات وإعداد خوارزميات الحصر والتدقيق</h3>
                    <p className="text-[11px] text-slate-400">تحديد صيغ وتنسيقات الملفات النهائية المقبولة والمخرجة لملفات الأتمتة المخصصة للجمهور والمهندسين</p>
                  </div>

                  {isAdminLoggedIn ? (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setAutomations(prev => [...prev, { ...automationForm, id: Date.now() }]);
                      triggerNotification('success', `تم إضافة وتجهيز سكربت أتمتة جديد بالمتجر: ${automationForm.title}`);
                      setAutomationForm({ title: '', scriptFile: '', formSchema: '', outputFormat: '' });
                    }} className="space-y-3">
                      <div>
                        <label className="block text-slate-400 mb-1">عنوان ووصف أداة الأتمتة والوفر الزمني</label>
                        <input type="text" required value={automationForm.title} onChange={(e)=>setAutomationForm({...automationForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">اسم ملف محرك الأتمتة الخلفي ( Dynamo Script أو Python Script )</label>
                        <input type="text" required placeholder="analysis_engine.py" value={automationForm.scriptFile} onChange={(e)=>setAutomationForm({...automationForm, scriptFile: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono text-left" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">نموذج المدخلات وحقول التعريف الفنية الديناميكية المسموحة</label>
                        <textarea rows="2" placeholder="أبعاد المقطع، طول المارغن، رتبة التسليح الكلي" value={automationForm.formSchema} onChange={(e)=>setAutomationForm({...automationForm, formSchema: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">تنسيق وصيغة الملف النهائي والمخرجات (Excel, PDF, Report المدمج)</label>
                        <input type="text" required placeholder="تحميل تلقائي لملف Excel منظم ومحسوب بدقة" value={automationForm.outputFormat} onChange={(e)=>setAutomationForm({...automationForm, outputFormat: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <button type="submit" className="w-full bg-purple-500 text-white font-bold py-2 rounded-xl mt-1 hover:bg-purple-600 transition">رفع وتفعيل سكربت الأتمتة لجمهور المنصة</button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400">تطلب صلاحيات الإدارة العليا لتنظيم متجر الأتمتة وسكربتات الماركتبليس.</div>
                  )}
                </div>

                {/* صفحة الجمهور لبرمجيات الأتمتة وتحميل وتدقيق المستندات والملفات */}
                <div className="lg:col-span-2 space-y-4 text-xs">
                  {automations.map(auto => (
                    <div key={auto.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative hover:border-slate-700 transition space-y-4 shadow-2xl">
                      {isAdminLoggedIn && <button onClick={() => deleteAutomation(auto.id, auto.title)} className="absolute top-4 left-4 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-2 rounded-lg border border-rose-500/20 transition font-bold">❌ حذف</button>}
                      
                      <div className="border-r-4 border-purple-500 pr-3">
                        <h4 className="text-sm font-black text-slate-100">{auto.title}</h4>
                        <p className="text-[11px] text-teal-400 font-mono mt-0.5">⚙️ ملف المحرك المرفوع الفعال: {auto.scriptFile}</p>
                      </div>

                      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-900 space-y-1.5 text-slate-300">
                        <p>📋 <strong className="text-slate-400">حقول حصر المدخلات المعرفة هندسياً للسكربت:</strong> {auto.formSchema}</p>
                        <p>📊 <strong className="text-slate-400">شكل وتنسيق ملف المخرجات النهائي للتحميل والتنفيذ:</strong> {auto.outputFormat}</p>
                      </div>

                      {/* ميزة تفاعلية للجمهور لرفع وتجريب ملفات المشاريع بصيغة RVT أو سحب وإفلات PDF لدمجها وتدقيقها */}
                      <div className="bg-slate-900/60 p-4 rounded-xl border-2 border-dashed border-slate-700 text-center space-y-3">
                        <p className="font-bold text-slate-200">📥 واجهة المهندس والجمهور (سحب وإفلات أو رفع ملف المشروع RVT / مخططات PDF لمعالجتها فورياً خلف الكواليس):</p>
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 max-w-xs mx-auto text-slate-400 text-xs cursor-pointer hover:bg-slate-900 transition">
                          اضغط هنا لاختيار ملفات المخططات التنفيذية من جهازك (بحد أقصى 50MB لتفادي بطء الخادم حماية للسيرفر)
                        </div>
                        <div className="flex justify-center gap-3 flex-wrap pt-2 border-t border-slate-950 text-[11px]">
                          <button onClick={()=>alert('تم تشغيل سكربت الأتمتة بنجاح فائق وتوليد تحميل تلقائي لملف Excel منظم يحتوي على جداول حصر الكميات الفصيلية بدقة متناهية ووفر وقت يوازي 4 ساعات عمل متكاملة.')} className="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2 rounded-xl transition">
                            ⚡ تشغيل السكربت خلف الكواليس وحصر الكميات فورا
                          </button>
                          <button onClick={()=>alert('تم فحص مستندات ومخططات الـ PDF المرفوعة، ودمجها بنجاح تام وتوليد تقرير صغير يوضح قائمة بالأخطاء الموجودة بنقص الأختام أو خطوط الرسم غير الواضحة.')} className="bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold transition">
                            📋 تدقيق ومعايير دمج الملفات وفحص الأخطاء (Audit)
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* فرعي: حلول وروبوتات الذكاء الاصطناعي (تحويل الصور، كشف تشققات الهياكل بدقة) */}
            {activeSubTab === 'ai-solutions' && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-base font-black text-purple-400">🤖 حلول وروبوتات الذكاء الاصطناعي لتشخيص وتحويل ومعالجة اللوحات</h3>
                    <p className="text-xs text-slate-400">أدوات تفاعلية متقدمة لرفع الصور ومعالجتها بنماذج الذكاء الاصطناعي والتعلم الآلي المدربة خصيصاً على معايير الكود الهندسي لتقليل الخطأ البشري.</p>
                  </div>

                  {isAdminLoggedIn && (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setAiSolutions(prev => [...prev, { ...aiSolutionForm, id: Date.now() }]);
                      triggerNotification('success', `تم إضافة أداة ذكاء اصطناعي ثورية بالبوابة: ${aiSolutionForm.toolName}`);
                      setAiSolutionForm({ toolName: '', dataset: '', severityRules: '', outputFormat: '' });
                    }} className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-slate-400 mb-1">اسم وعنوان أداة الذكاء الاصطناعي الاستباقية للجمهور</label>
                        <input type="text" required value={aiSolutionForm.toolName} onChange={(e)=>setAiSolutionForm({...aiSolutionForm, toolName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">مكتبة التدريب المعتمدة المصنفة للأداة (Training Dataset)</label>
                        <textarea rows="2" placeholder="آلاف صور الشروخ والتشققات، التصدعات الإنشائية السطحية والعميقة" value={aiSolutionForm.dataset} onChange={(e)=>setAiSolutionForm({...aiSolutionForm, dataset: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">معايير تحديد الخطورة ومطابقتها للكود الهندسي (Severity Thresholds)</label>
                        <textarea rows="2" placeholder="مثال: عرض الشرخ أكبر من 3 ملم في عمود خرساني يعطي تنبيه خطر أحمر قاتل ومباشر" value={aiSolutionForm.severityRules} onChange={(e)=>setAiSolutionForm({...aiSolutionForm, severityRules: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-400 mb-1">قالب التحويل وشكل المخرجات الفنية المقررة للمهندس (رسومات بيانية وتصدير DXF)</label>
                        <textarea rows="2" value={aiSolutionForm.outputFormat} onChange={(e)=>setAiSolutionForm({...aiSolutionForm, outputFormat: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"></textarea>
                      </div>
                      <button type="submit" className="md:col-span-2 bg-purple-500 text-white font-bold py-2 rounded-xl hover:bg-purple-600 transition">نشر أداة حلول الذكاء الاصطناعي للجمهور فورا</button>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiSolutions.map(ai => (
                      <div key={ai.id} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl relative space-y-3 shadow-xl">
                        {isAdminLoggedIn && <button onClick={() => deleteAiSolution(ai.id, ai.toolName)} className="absolute top-3 left-3 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded border border-rose-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>}
                        <h4 className="font-black text-slate-100 text-sm border-r-4 border-purple-500 pr-2">{ai.toolName}</h4>
                        <p className="text-slate-300">🔬 <strong className="text-slate-400">مكتبة التدريب والقواعد الاسترشادية المتضمنة:</strong> {ai.dataset}</p>
                        <p className="text-slate-300">⚠️ <strong className="text-slate-400">معايير الخطورة ومحددات الأمان وربط نتائج المقارنة النموذجية:</strong> {ai.severityRules}</p>
                        <p className="text-slate-300">📐 <strong className="text-slate-400">مخرجات المعالجة (تصدير DXF ونماذج تحويل البكسل لخطوط متجهة CAD):</strong> {ai.outputFormat}</p>
                        
                        {/* نموذج تجريبي تفاعلي للجمهور لرفع صور الشروخ ومعايرتها */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                          <p className="font-bold text-slate-200">📸 واجهة المستخدم لرفع الصورة (Sketch) وإدخال سياق المعايرة الميدانية:</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <input type="text" placeholder="عمر المبنى بالسنوات، ونوع العنصر" className="bg-slate-900 border border-slate-700 p-1 rounded text-slate-100" />
                            <input type="text" placeholder="تحديد طول معروف بالصورة للمعايرة (أمتار)" className="bg-slate-900 border border-slate-700 p-1 rounded text-slate-100" />
                          </div>
                          <button onClick={()=>alert('نتائج تحليل مرئي الذكاء الاصطناعي اللحظي: تم رصد (شروخ قص خطيرة - Shear Crack) - مستوى الخطورة: عالية جداً - الإجراء الفوري العاجل المقترح: إخلاء مقطع الموقع فوراً واستشارة استشاري ترميم وتدعيم، مع توفير رسم خريطة حرارية تفاعلية (Heatmap) توضح عمق التصدع.')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded transition text-[11px]">
                            🔍 تحليل الإجهادات والتصدعات وفحص الصورة بنماذج التعلم الآلي فورا
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* فرعي: الإدارة والتحكم برمجيات كخدمة المكتب الفني SaaS */}
            {activeSubTab === 'management-control' && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-base font-black text-purple-400">💼 منظومة الإدارة والتحكم الشاملة للمكاتب الهندسية الكبرى (SaaS ERP System)</h3>
                    <p className="text-xs text-slate-400">تطبيق متكامل يتيح للمهندس أو الشركات تتبع عروض الأسعار، إدارة جداول الكميات القياسية BoQ، واعتماد مخططات المواقع رقمياً بالكامل.</p>
                  </div>

                  {isAdminLoggedIn && (
                    <form onSubmit={(e)=>{
                      e.preventDefault();
                      setManagementTools(prev => [...prev, { ...mgmtToolForm, id: Date.now() }]);
                      triggerNotification('success', `تم إضافة وتحديث منظومة SaaS إدارية جديدة: ${mgmtToolForm.name}`);
                      setMgmtToolForm({ name: '', rules: '', outputFormat: '' });
                    }} className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-900 text-xs">
                      <input type="text" required placeholder="عنوان واسم نظام التطوير الإداري والأدوات للجمهور" value={mgmtToolForm.name} onChange={(e)=>setMgmtToolForm({...mgmtToolForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <textarea rows="2" placeholder="قواعد وتوصيف المستندات ونظام الترقيم الدولي الموحد وهيكلية بنود الأعمال" value={mgmtToolForm.rules} onChange={(e)=>setMgmtToolForm({...mgmtToolForm, rules: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"></textarea>
                      <input type="text" required placeholder="شكل المخرجات (لوحات قيادة Gantt Chart، تقارير الإنتاجية وسجل المخططات تفاعلي)" value={mgmtToolForm.outputFormat} onChange={(e)=>setMgmtToolForm({...mgmtToolForm, outputFormat: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100" />
                      <button type="submit" className="w-full bg-purple-500 text-white font-bold py-1.5 rounded hover:bg-purple-600 transition">تنشيط ورفع المنظومة الإدارية للجمهور</button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {managementTools.map(mgmt => (
                      <div key={mgmt.id} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-2 relative shadow-xl">
                        {isAdminLoggedIn && <button onClick={() => deleteMgmtTool(mgmt.id, mgmt.name)} className="absolute top-4 left-4 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded border border-rose-500/20 transition"><Trash2 className="w-4 h-4" /></button>}
                        <h4 className="font-black text-slate-100 text-sm border-r-4 border-purple-500 pr-2">{mgmt.name}</h4>
                        <p className="text-slate-300">⚙️ <strong className="text-slate-400">إعدادات الدمج، مستويات الطوارئ وقواعد التوصيف المرجعية القياسية:</strong> {mgmt.rules}</p>
                        <p className="text-slate-300">📊 <strong className="text-slate-400">لوحة القيادة التفاعلية للمخرجات وجداول مقارنة الأسعار الفورية:</strong> {mgmt.outputFormat}</p>
                        
                        {/* واجهة محاكاة الجمهور لرفع عروض الأسعار أو تقارير الإنجاز اليومية للمهندس الميداني */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-[11px]">
                          <p className="font-bold text-teal-400">⚙️ واجهة محاكاة تفاعل المهندس الميداني أو المدير في الموقع الاستشاري:</p>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={()=>alert('تمت المعالجة: تم توليد جدول المقارنة الذكي (Comparison Sheet) وترتيب عروض أسعار الموردين تلقائياً من الأفضل للأقل بناءً على معادلات الوزن النسبي وكفاءة مؤشرات الأداء المحددة.')} className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 px-3 py-1 rounded transition">✔ معالجة ومقارنة عروض أسعار المقاولين الموردين</button>
                            <button onClick={()=>alert('تم الحفظ والمزامنة الفورية: تم تحديث لوحة القيادة (Dashboard) ورسم مخطط Gantt Chart يوضح استهلاك الميزانية الكلية ومستويات الإنتاجية وجداول المخططات المعتمدة.')} className="bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 px-3 py-1 rounded transition">📋 رفع تقرير إنجاز يومي وصور حية للموقع الميداني</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* فرعي: اطلب أداتك البرمجية الخاصة المخصصة للجمهور والعملاء */}
            {activeSubTab === 'request-custom-tool' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
                {/* استمارة طلب أداة برمجية مخصصة من الجمهور */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 h-fit">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-purple-400 flex items-center gap-1"><Send className="w-4 h-4" /> نموذج حقول طلب أداتك البرمجية المخصصة</h3>
                    <p className="text-[11px] text-slate-400">يتم إرسال المدخلات وتفاصيل الأداة فورياً وبدقة فائقة ممتلئة بالسرية والاحترافية إلى الإدارة وإيميلات الموقع الثلاثة.</p>
                  </div>

                  <form onSubmit={submitCustomToolRequest} className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1">الاسم الكامل للمهندس أو المؤسسة الطالبة</label>
                      <input type="text" required value={customToolForm.name} onChange={(e)=>setCustomToolForm({...customToolForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">البريد الإلكتروني الحقيقي المعتمد للمتابعة</label>
                      <input type="email" required value={customToolForm.email} onChange={(e)=>setCustomToolForm({...customToolForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">رقم التلفون الفعال (مع رمز ومقدمة الدولة)</label>
                      <input type="text" required value={customToolForm.phone} onChange={(e)=>setCustomToolForm({...customToolForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="+966" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">شرح وتفاصيل واشتراطات الأداة البرمجية المراد بناؤها هندسياً</label>
                      <textarea rows="4" required value={customToolForm.details} onChange={(e)=>setCustomToolForm({...customToolForm, details: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="اذكر المعادلات، نوع المدخلات والمخرجات المطلوبة"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-purple-500 text-white font-black py-2.5 rounded-xl mt-1 hover:bg-purple-600 transition shadow-lg shadow-purple-500/10">✔ إرسال طلب تصميم الأداة البرمجية الاستباقية للمطورين</button>
                  </form>
                </div>

                {/* واجهة استعراض وتتبع الطلبات الواردة للمسؤول */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-200">الطلبات الواردة لتخصيص وبناء أدوات برمجية هندسية مخصصة</h4>
                    <p className="text-xs text-slate-400 mt-0.5">مراقبة حية للطلبات المرفوعة من العملاء لمعالجتها وبنائها وتصديرها.</p>
                  </div>

                  {customToolRequests.map(req => (
                    <div key={req.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-slate-100">{req.name}</h5>
                        <p className="text-purple-400 font-mono text-[11px]">📧 البريد: {req.email} | 📞 الهاتف: {req.phone}</p>
                        <p className="text-slate-300 mt-1 bg-slate-900 p-2 rounded border border-slate-800">📝 الشرح المطلوب للأداة: {req.details}</p>
                      </div>
                      {isAdminLoggedIn && (
                        <button onClick={() => { setCustomToolRequests(prev => prev.filter(r => r.id !== req.id)); triggerNotification('warning', `تم حذف أو أرشفة طلب الأداة من العميل: ${req.name}`); }} className="bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold px-3 py-1.5 rounded-lg transition text-xs whitespace-nowrap">حذف نهائي / أرشفة</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* === 4. تبويب خدماتنا الاستشارية، الإنشائية، المعمارية والذكية === */}
        {/* ========================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {['view-services', 'add-service', 'consultation-requests'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubTab(sub)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg transition ${activeSubTab === sub ? 'bg-blue-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                >
                  {sub === 'view-services' && 'تصفح وبوابة خدماتنا الاستشارية للجمهور'}
                  {sub === 'add-service' && 'نشر وإضافة خدمة جديدة (المسؤول المسؤول)'}
                  {sub === 'consultation-requests' && 'طلبات الاستشارات والمراسلات الذكية المرفوعة'}
                </button>
              ))}
            </div>

            {/* فرعي: تصفح الخدمات واستمارات الاستشارة الفورية للجمهور */}
            {activeSubTab === 'view-services' && (
              <div className="space-y-8 text-xs">
                <div className="bg-slate-900 p-4 border border-blue-500/30 rounded-2xl">
                  <h4 className="text-sm font-black text-slate-100">بوابة العرض والتحكم المطلق لكافة قائمة خدماتنا الهندسية والاستشارية الفوقية للجمهور</h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">PUBLIC SERVICES LINK: http://localhost:3000/services</p>
                </div>

                {/* تصنيف بطاقات عرض خدماتنا الفنية المتميزة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData.map(ser => (
                    <div key={ser.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative hover:border-slate-700 transition flex flex-col justify-between shadow-2xl space-y-3">
                      {isAdminLoggedIn && (
                        <button onClick={() => deleteService(ser.id, ser.title)} className="absolute top-4 left-4 bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 p-2 rounded-lg border border-rose-500/20 font-bold transition">❌ حذف الخدمة</button>
                      )}
                      
                      <div className="space-y-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ser.category === 'structural' ? 'bg-blue-500/10 text-blue-400' : ser.category === 'architectural' ? 'bg-teal-500/10 text-teal-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {ser.category === 'structural' && 'الخدمات الإنشائية والمدنية المتقدمة'}
                          {ser.category === 'architectural' && 'الهندسة المعمارية والتصميم والديكور'}
                          {ser.category === 'digital' && 'التحول الرقمي وأتمتة الهندسة والذكاء (Smart Tech)'}
                        </span>
                        <h4 className="text-base font-black text-slate-100 mt-1">{ser.title}</h4>
                        <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-900">{ser.desc}</p>
                      </div>

                      <div className="pt-2">
                        <button onClick={() => alert(`مرحباً بك! لقد أبديت اهتماماً بـ [${ser.title}]. يرجى تعبئة نموذج حجز الاستشارة المجانية الملحق أدناه فوراً وسيصل الطلب للإدارة بلحظة.`)} className="w-full bg-slate-900 hover:bg-slate-850 border border-blue-500/40 text-blue-400 font-bold py-2 rounded-xl transition">
                          📥 اضغط هنا لتفعيل وحجز طلب الخدمة والاستشارة والمراسلة الذكية فورا
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* استمارة حجز استشارة مجانية ونموذج الاستفسار والمراسلة الذكي للمستخدمين والجمهور */}
                <div className="bg-slate-950 border border-blue-500/30 p-6 rounded-3xl max-w-2xl mx-auto shadow-2xl space-y-6">
                  <div className="border-b border-slate-800 pb-3 text-center">
                    <h4 className="text-base font-black text-blue-400">📝 نموذج الاستفسار والمراسلة الذكي الموحد وحجز الاستشارات الهندسية الحية</h4>
                    <p className="text-xs text-slate-400 mt-1">تصل المراسلات مباشرة عبر ملقمات بريد المنصة الاستشارية الثلاثة ولوحة التحكم المركزية للمطابقة والاتصال الفوري.</p>
                  </div>

                  <form onSubmit={submitServiceRequest} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">الاسم الكامل للمستفسر / العميل</label>
                      <input type="text" required value={consultationForm.name} onChange={(e)=>setConsultationForm({...consultationForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">البريد الإلكتروني الحقيقي المعتمد</label>
                      <input type="email" required value={consultationForm.email} onChange={(e)=>setConsultationForm({...consultationForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">رقم هاتف التواصل الفعال (متضمناً الرمز الدولي المعتمد)</label>
                      <input type="text" required value={consultationForm.phone} onChange={(e)=>setConsultationForm({...consultationForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">موضوع الاستشارة الفنية المختار</label>
                      <select value={consultationForm.subject} onChange={(e)=>setConsultationForm({...consultationForm, subject: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100">
                        <option value="استشارة هندسية فنية مدنية">استشارة هندسية فنية مدنية إستراتيجية</option>
                        <option value="طلب تصميم إنشائي / معماري">طلب تصميم إنشائي / معماري متكامل</option>
                        <option value="استفسار عن حلول البرمجة والأتمتة الهندسية">استفسار عن حلول البرمجة وأتمتة حديد التسليح</option>
                        <option value="مواضيع وأسباب هندسية مخصصة أخرى">مواضيع وأسباب هندسية مخصصة أخرى تذكر بالتفصيل</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-400 mb-1">رسالة الاستفسار الفنية، تفاصيل المشروع والملاحظات المعقدة المطلوبة</label>
                      <textarea rows="4" required value={consultationForm.message} onChange={(e)=>setConsultationForm({...consultationForm, message: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100" placeholder="اكتب سياق وحالة وأبعاد وتفاصيل المنشأ الاستشاري بالتفصيل"></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-400 mb-1">الوقت والتاريخ المقترح والمطلوب لحجز جلسة الاستشارة الحية</label>
                      <input type="text" placeholder="مثال: يوم الأحد القادم 2026-07-05 الساعة 11:00 صباحاً" value={consultationForm.dateTime} onChange={(e)=>setConsultationForm({...consultationForm, dateTime: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
                    </div>
                    
                    <div className="md:col-span-2 bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-400 text-[11px] font-medium">
                      📎 <span className="text-blue-400 font-bold">حقل إرفاق وحمل ملفات المخططات التنفيذية الإنشائية أو المعمارية إن وجد ( PDF, DWG ):</span> معالجة مشفرة صارمة للبيانات والمستندات لحفظ السرية الفنية المطلقة.
                    </div>

                    <button type="submit" className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-black py-3 rounded-xl shadow-lg text-sm transition">
                      ✔ تأكيد حجز الاستشارة وإرسال الاستفسار والمراسلة الذكية للإدارة والمطورين فورا
                    </button>
                  </form>

                  {/* قنوات التواصل ومواقع التواصل الموثقة للمنصة لتفادي معضلات البرامج الحاكمة */}
                  <div className="pt-4 border-t border-slate-800 text-center text-xs space-y-1 text-slate-400">
                    <p>🌐 صفحة منصة الهندسة الذكية الرسمية على منصات التواصل الاجتماعي:</p>
                    <p className="text-blue-400 font-mono font-bold hover:underline select-all">https://www.facebook.com/profile.php?id=61573267509001</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">البريد الموحد المشترك النشط: Smart.Engineering.Global@proton.me | smart.engineering.global@tuta.io | smartengineering.hr.global@gmail.com</p>
                  </div>
                </div>
              </div>
            )}

            {/* فرعي: إضافة خدمة جديدة للمسؤول */}
            {activeSubTab === 'add-service' && (
              <div className="max-w-xl mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-blue-400">➕ إضافة ونشر وإعلان خدمة استشارية فنية هندسية جديدة للجمهور</h3>
                  <p className="text-slate-400">تنعكس المخرجات الفورية مباشرة على بطاقات صفحة تصفح الخدمات للعامة دون لمس الأكواد البرمجية.</p>
                </div>

                {isAdminLoggedIn ? (
                  <form onSubmit={handleAddService} className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1">تصنيف وبوابة الخدمة الفرعية المقررة</label>
                      <select value={serviceForm.category} onChange={(e)=>setServiceForm({...serviceForm, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                        <option value="structural">الخدمات الإنشائية والمدنية المتطورة</option>
                        <option value="architectural">الهندسة المعمارية والتصميم الحديث والديكور</option>
                        <option value="digital">التحول الرقمي وأتمتة التصاميم الهندسية (Smart Tech)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">عنوان الخدمة الفنية الاستشارية الكامل المتميز</label>
                      <input type="text" required value={serviceForm.title} onChange={(e)=>setServiceForm({...serviceForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">شرح وتفاصيل وافية شاملة للخدمة ومعايير الأكواد العالمية الحاكمة</label>
                      <textarea rows="4" required value={serviceForm.desc} onChange={(e)=>setServiceForm({...serviceForm, desc: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="مثال: تصميم المقاطع الخرسانية المسلحة والمعدنية وفق معايير اشتراطات الأكواد الإنشائية المعتمدة..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl transition">إعلان ونشر الخدمة الاستشارية للجمهور الآن</button>
                  </form>
                ) : (
                  <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400">يجب تسجيل دخول المسؤول المسؤول لتفعيل صلاحيات التحكم بالخدمات والاستشارات الممنوحة.</div>
                )}
              </div>
            )}

            {/* فرعي: طلبات الاستشارات الواردة للإدارة */}
            {activeSubTab === 'consultation-requests' && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-200">سجل طلبات حجز الاستشارات الهندسية ونموذج المراسلات الذكي المستلمة من العملاء</h4>
                  <p className="text-xs text-slate-400 mt-0.5">تتبع وإدارة حية ومزامنة فورية مع ملقمات البريد للمطابقة وتأكيد الحجوزات والمراسلة الجوابية.</p>
                </div>

                {serviceRequests.length === 0 ? (
                  <p className="text-center text-slate-500 text-xs py-8">لا توجد طلبات استشارات أو مراسلات هندسية معلقة حالياً.</p>
                ) : (
                  serviceRequests.map(req => (
                    <div key={req.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 relative shadow-xl">
                      {isAdminLoggedIn && (
                        <button onClick={() => { setServiceRequests(prev => prev.filter(r => r.id !== req.id)); triggerNotification('warning', `تم إزالة وأرشفة طلب استشارة العميل: ${req.name}`); }} className="absolute top-4 left-4 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition">حذف من السجل نهائياً</button>
                      )}
                      <h5 className="text-sm font-black text-slate-100">{req.name}</h5>
                      <p className="text-blue-400 font-mono font-bold">📧 البريد: {req.email} | 📞 الهاتف والرمز: {req.phone} | 📋 نوع المراسلة: {req.type}</p>
                      <p className="text-slate-300 font-semibold bg-slate-900/40 p-2 rounded border border-slate-900/60">📌 العنوان الاستشاري والموضوع: {req.subject}</p>
                      <p className="text-slate-400 bg-slate-950 p-2 rounded text-[11px] leading-relaxed">📝 تفاصيل رسالة العميل الفنية المستلمة: {req.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* === 5. تبويب أفكار وعلوم (Insights) هندسة المستقبل والمكتب === */}
        {/* ======================================================== */}
        {activeTab === 'insights' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {['view-insights', 'add-insight'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubTab(sub)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg transition ${activeSubTab === sub ? 'bg-emerald-500 text-slate-900 font-black shadow-lg' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                >
                  {sub === 'view-insights' && 'تصفح مقالات وبحوث أفكار وعلوم (الجمهور)'}
                  {sub === 'add-insight' && 'نشر مقال علمي / بحث مبسط جديد (الأدمن)'}
                </button>
              ))}
            </div>

            {/* فرعي: عرض مقالات أفكار وعلوم للجمهور مع الالتزام بالهيكل الصارم الفني مقسم لبطاقات وجداول */}
            {activeSubTab === 'view-insights' && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-900 p-4 border border-emerald-500/30 rounded-2xl">
                  <h4 className="text-sm font-black text-slate-100">بوابة العرض العلمي المتبسط لقائمة أفكار وعلوم (الهندسة الذكية & البحوث)</h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">PUBLIC INSIGHTS LINK: http://localhost:3000/insights</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {insights.map(ins => (
                    <div key={ins.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative hover:border-slate-700 transition shadow-2xl space-y-4">
                      {isAdminLoggedIn && (
                        <button onClick={() => deleteInsight(ins.id, ins.title)} className="absolute top-4 left-4 bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 p-2 rounded-lg border border-rose-500/20 font-bold transition">❌ حذف المقال والبحث نهائياً</button>
                      )}

                      <div className="border-r-4 border-emerald-400 pr-3">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                          {ins.category === 'future' && 'بوابة هندسة المستقبل والتقنيات الثورية'}
                          {ins.category === 'secrets' && 'أسرار التنفيذ والمكتب الفني الذكي الحاسم'}
                          {ins.category === 'programming' && 'البرمجة للمهندسين وأتمتة التصاميم بـ Python'}
                          {ins.category === 'papers' && 'أوراق بحثية مبسطة وعملية للموقع الميداني'}
                        </span>
                        <h4 className="text-base font-black text-slate-100 mt-2">{ins.title}</h4>
                      </div>

                      {/* الهيكل الهندسي البحت الصارم لتسلسل صياغة الأفكار والعلوم منعاً للحشو */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-900 font-sans">
                        <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-900">
                          <span className="text-rose-400 font-black text-xs block">1. المشكلة الإنشائية المعقدة:</span>
                          <p className="text-slate-300 leading-relaxed text-[11px]">{ins.problem}</p>
                        </div>
                        <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-900">
                          <span className="text-indigo-400 font-black text-xs block">2. العلم والنظرية الرياضية:</span>
                          <p className="text-slate-300 leading-relaxed text-[11px]">{ins.science}</p>
                        </div>
                        <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-900">
                          <span className="text-purple-400 font-black text-xs block">3. الفكرة الذكية والخوارزمية:</span>
                          <p className="text-slate-300 leading-relaxed text-[11px]">{ins.smartIdea}</p>
                        </div>
                        <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-900">
                          <span className="text-emerald-400 font-black text-xs block">4. التطبيق والخطوات والسكربت:</span>
                          <p className="text-slate-300 leading-relaxed text-[11px]">{ins.application}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* فرعي: إضافة مقال علمي جديد للمسؤول بالتسلسل الصارم المعقد */}
            {activeSubTab === 'add-insight' && (
              <div className="max-w-2xl mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-emerald-400">➕ نشر مقال علمي وبحث مبسط جديد في أفكار وعلوم (التحكم المطلق)</h3>
                  <p className="text-[11px] text-slate-400">يلتزم المسؤول بصياغة المقال تبعاً للتسلسل الهندسي المانع للحشو لضمان الجودة العلمية المتميزة للمنصة.</p>
                </div>

                {isAdminLoggedIn ? (
                  <form onSubmit={handleAddInsight} className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1">تصنيف المقال والقائمة الفرعية المخصصة</label>
                      <select value={insightForm.category} onChange={(e)=>setInsightForm({...insightForm, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100">
                        <option value="future">قائمة "هندسة المستقبل والذكاء الاصطناعي في الإنشاءات"</option>
                        <option value="secrets">قائمة "أسرار التنفيذ والمكتب الفني وعلم تقليل الفواقد"</option>
                        <option value="programming">قائمة "البرمجة وأتمتة التصاميم دروس بايثون للمهندسين"</option>
                        <option value="papers">قائمة "تلخيص أوراق بحثية مبسطة من الجامعات الكبرى"</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">عنوان المقال والبحث العلمي الفريد بالكامل</label>
                      <input type="text" required value={insightForm.title} onChange={(e)=>setInsightForm({...insightForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">1. المشكلة الإنشائية الميدانية المرصودة بدقة</label>
                      <textarea rows="2" required value={insightForm.problem} onChange={(e)=>setInsightForm({...insightForm, problem: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="شرح المعضلة وصعوبة حصر الكميات أو الانهيارات..."></textarea>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">2. العلم والنظرية الرياضية أو الهندسية لحل المشكلة</label>
                      <textarea rows="2" required value={insightForm.science} onChange={(e)=>setInsightForm({...insightForm, science: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="شرح النظريات الميكانيكية أو الخوارزميات الحاكمة للمقاطع..."></textarea>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">3. الفكرة الذكية: كيف نحول هذا العلم لخوارزمية سريعة وطريقة عمل</label>
                      <textarea rows="2" required value={insightForm.smartIdea} onChange={(e)=>setInsightForm({...insightForm, smartIdea: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="ربط الأفكار بأتمتة البرمجة المخصصة لخفض الهالك لنسبة صفر..."></textarea>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">4. التطبيق: خطوات تنفيذية + كود برمجي بسيط أو رابط للأداة الحية</label>
                      <textarea rows="2" required value={insightForm.application} onChange={(e)=>setInsightForm({...insightForm, application: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="خطوات التشغيل ورفع ملفات التربة وسكربت المعالجة الإنشائية الفورية..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 text-slate-900 font-black py-2.5 rounded-xl hover:bg-emerald-600 transition">✔ إعلان وطرح المقال العلمي والبحث للجمهور فورا</button>
                  </form>
                ) : (
                  <div className="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-center text-slate-400">تطلب صلاحية مسؤول المنصة لنشر وتعديل الأبحاث والموسوعات المقررة.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* === 6. تبويب شاركنا رأيك (Feedback) واستقبال التقييمات === */}
        {/* ======================================================== */}
        {activeTab === 'feedback' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {['view-feedback', 'add-public-feedback'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubTab(sub)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg transition ${activeSubTab === sub ? 'bg-amber-500 text-slate-900 font-black shadow-lg' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                >
                  {sub === 'view-feedback' && 'مراقبة وإدارة آراء وتقييمات الجمهور (الأدمن)'}
                  {sub === 'add-public-feedback' && 'رفع رأي ومشاركة تطويرية جديدة (واجهة الجمهور)'}
                </button>
              ))}
            </div>

            {/* فرعي: مراقبة آراء الجمهور والعملاء الموثقة المسجلة */}
            {activeSubTab === 'view-feedback' && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-200">لوحة مراقبة واستقبال الآراء والمقترحات والتقييمات للخدمات الهندسية المنجزة للعملاء</h4>
                  <p className="text-xs text-slate-400 mt-0.5">تنعكس كافة حقول نموذج الذكي العام وتقييمات العملاء الفعليين هنا مع صلاحية الحذف والتحكم للمسؤول الفوري.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbacks.map(f => (
                    <div key={f.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl relative flex flex-col justify-between shadow-2xl space-y-2">
                      {isAdminLoggedIn && (
                        <button onClick={() => deleteFeedback(f.id)} className="absolute top-3 left-3 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded border border-rose-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                      )}
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold">
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">نوع المشاركة: {f.type}</span>
                          <span className="text-slate-400">التخصص: {f.specialty}</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-200 mt-2">📌 الموضوع والمشاركة: "{f.subject}"</h5>
                      </div>
                      <p className="text-slate-500 text-[11px] border-t border-slate-900 pt-2 text-left">✍ بواسطة العميل/الزائر: {f.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* فرعي: نموذج واجهة الجمهور لرفع مشاركة رأي وتطوير وتعبئة الحقول التفصيلية */}
            {activeSubTab === 'add-public-feedback' && (
              <div className="max-w-xl mx-auto bg-slate-950 p-6 rounded-3xl border border-amber-500/20 shadow-2xl space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-2 text-center">
                  <h3 className="text-base font-black text-amber-400">📊 نموذج الذكي العام الموحد لرواد المنصة والعملاء (شاركنا رأيك)</h3>
                  <p className="text-slate-400 mt-0.5 font-medium">ساهم في تطوير المنصة وسنقوم بمراجعة الفكرة البرمجية أو الاقتراح فورا وإشعار لوحة التحكم والإيميلات الثلاثة.</p>
                </div>

                <form onSubmit={submitPublicFeedback} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 mb-1">اسم المهندس أو العميل الكامل (حقل اختياري تصفحي)</label>
                    <input type="text" placeholder="اكتب اسمك الكريم هنا، أو اتركه فارغاً لرفع الرأي كزائر مجهول" value={feedbackForm.name} onChange={(e)=>setFeedbackForm({...feedbackForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">تخصص العميل أو الزائر المختار من القائمة</label>
                      <select value={feedbackForm.specialty} onChange={(e)=>setFeedbackForm({...feedbackForm, specialty: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100">
                        <option value="مهندس مدني / إنشائي استشاري">مهندس مدني / إنشائي استشاري</option>
                        <option value="مهندس معماري / ديكور وتخطيط">مهندس معماري / ديكور وتخطيط</option>
                        <option value="طالب هندسة أو باحث أكاديمي">طالب هندسة أو باحث أكاديمي</option>
                        <option value="صاحب مشروع / مقاول مستقل">صاحب مشروع / مقاول مستقل</option>
                        <option value="تصنيفات هندسية أخرى يرجى ذكرها">تصنيفات هندسية أخرى يرجى ذكرها بالتفصيل</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">نوع المشاركة والتطوير المستهدف</label>
                      <select value={feedbackForm.type} onChange={(e)=>setFeedbackForm({...feedbackForm, type: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100">
                        <option value="اقتراح فني">اقتراح فني لتطوير واجهات المنصة</option>
                        <option value="فكرة برمجية أو سكربت أتمتة مطلوب">فكرة برمجية أو سكربت أتمتة مطلوب إدراجه</option>
                        <option value="إشادة بجودة الخدمات المقدمة">إشادة بجودة الخدمات والاستشارات المنجزة</option>
                        <option value="شكوى إدارية أو فنية دقيقة">شكوى إدارية أو فنية دقيقة قيد المعالجة السرية</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">نص وتفاصيل موضوع المشاركة والآراء الكاملة المستهدفة</label>
                    <textarea rows="4" required placeholder="اكتب اقتراحك، فكرتك البرمجية أو تقييمك لخدماتنا بكل وضوح وتفصيل" value={feedbackForm.subject} onChange={(e)=>setFeedbackForm({...feedbackForm, subject: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"></textarea>
                  </div>
                  
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                    📌 <span className="text-amber-400 font-bold">قائمة تقييم الخدمات المخصصة للعملاء الفعليين:</span> هذا القسم يخضع لرقابة صارمة للتفاعل والرد السريع ليعكس انطباعاً إيجابياً وتفاعلياً متميزاً يعبر عن مدى اهتمام الإدارة العليا بقرار ورغبة الجمهور والشركاء الاستراتيجيين.
                  </div>

                  <button type="submit" className="w-full bg-amber-500 text-slate-900 font-black py-3 rounded-xl shadow-lg text-sm hover:bg-amber-600 transition">
                    ✔ اضغط هنا لتأكيد الإرسال والمساهمة الفورية في تطوير منصة الهندسة الذكية
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- تذييل الصفحة الفني والمنظم ذو المظهر الراقي الموحد --- */}
      <footer className="mt-24 border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-400">🛡️ بوابة الإدارة المركزية والتحكم الموحد المطلق المتزامن — منصة الهندسة الذكية العالمية © 2026</p>
          <p className="text-slate-600 font-mono">ALL OPERATIONS EXTENDED DIRECTLY TO MATCH PUBLIC DOMAIN • ENCRYPTION PROTOCOL SEG-LOCK v2</p>
          <div className="pt-2 text-[11px] text-slate-500 flex justify-center gap-4 flex-wrap">
            <span>Proton Server Backend: <span className="text-teal-400/80 font-mono">Smart.Engineering.Global@proton.me</span></span>
            <span>Tuta Cryptic Server: <span className="text-indigo-400/80 font-mono">smart.engineering.global@tuta.io</span></span>
            <span>Gmail HR Server: <span className="text-purple-400/80 font-mono">smartengineering.hr.global@gmail.com</span></span>
          </div>
        </div>
      </footer>

    </div>
  );
}