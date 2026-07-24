"use client";

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, FileText, Plus, Trash2, Edit3, Save, X, 
  MapPin, Building2, Calendar, Target, Award, ListChecks, 
  Activity, Paperclip, Mail, HelpCircle, FileDown, AlertCircle,
  Cpu, Info, Settings
} from 'lucide-react';

export default function AdminJobsPage() {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // الحالة الموسعة لتشمل جميع الحقول الجديدة
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    type: 'وظيفة', 
    category: 'هندسة',
    location: '',
    publishDate: '',
    closingDate: '',
    // حقول الوظيفة
    generalGoal: '',
    responsibilities: '',
    jobRequirements: '',
    qualifications: '',
    skills: '',
    principles: '',
    physicalMentalReq: '',
    otherTerms: '',
    attachments: '',
    applicationMethod: '',
    // حقول المناقصة
    tenderPurpose: '',
    tenderDocs: '',
    openingSession: '',
    tenderInquiries: '',
    downloadLink: '',
    notes: ''
  });

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    try {
      const res = await fetch('/api/postings');
      const data = await res.json();
      setPostings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching postings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/postings/${currentId}` : '/api/postings';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        resetForm();
        fetchPostings();
        alert(isEditing ? "تم التحديث بنجاح" : "تم الإضافة بنجاح");
      }
    } catch (error) {
      alert("حدث خطأ في الحفظ");
    }
  };

  const editPosting = (posting) => {
    setIsEditing(true);
    setCurrentId(posting.id);
    setFormData(posting);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePosting = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      await fetch(`/api/postings/${id}`, { method: 'DELETE' });
      fetchPostings();
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '', organization: '', type: 'وظيفة', category: 'هندسة',
      location: '', publishDate: '', closingDate: '', generalGoal: '',
      responsibilities: '', jobRequirements: '', qualifications: '',
      skills: '', principles: '', physicalMentalReq: '', otherTerms: '',
      attachments: '', applicationMethod: '', tenderPurpose: '',
      tenderDocs: '', openingSession: '', tenderInquiries: '',
      downloadLink: '', notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#020813] text-white p-6 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* الهيدر */}
        <div className="flex items-center justify-between border-r-4 border-cyan-500 pr-4">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم: الوظائف والمناقصات</h1>
            <p className="text-slate-400 mt-1">تحديث بيانات منصة الهندسة الذكية</p>
          </div>
          <button onClick={resetForm} className="p-3 bg-slate-800 rounded-full hover:bg-cyan-500 hover:text-black transition">
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {/* نموذج الإدخال */}
        <section className="bg-[#030d1a] border border-cyan-500/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl mb-8 flex items-center gap-2 text-cyan-400">
            {isEditing ? <Edit3 className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            {isEditing ? "تعديل الإعلان" : "إضافة إعلان جديد"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8 text-sm">
            {/* الحقول الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400">نوع الإعلان</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-black border border-slate-800 rounded-xl p-3 focus:border-cyan-500 outline-none">
                  <option value="وظيفة">وظيفة</option>
                  <option value="مناقصة">مناقصة</option>
                </select>
              </div>
              <div className="lg:col-span-2 space-y-2">
                <label className="text-slate-400">العنوان</label>
                <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-black border border-slate-800 rounded-xl p-3 focus:border-cyan-500 outline-none" placeholder="مثال: مهندس تصاميم إنشائية" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400">الجهة المعلنة</label>
                <input required name="organization" value={formData.organization} onChange={handleInputChange} className="w-full bg-black border border-slate-800 rounded-xl p-3 focus:border-cyan-500 outline-none" placeholder="اسم الشركة" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400">الموقع</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-black border border-slate-800 rounded-xl p-3 pr-10 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-slate-400">تاريخ النشر</label>
                <input type="date" name="publishDate" value={formData.publishDate} onChange={handleInputChange} className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-rose-400 font-bold">تاريخ الإغلاق</label>
                <input type="date" name="closingDate" value={formData.closingDate} onChange={handleInputChange} className="w-full bg-black border border-rose-900/30 rounded-xl p-3 outline-none" />
              </div>
            </div>

            <hr className="border-slate-800" />

            {/* حقول متغيرة حسب النوع */}
            {formData.type === 'وظيفة' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-cyan-500 flex items-center gap-2"><Target className="h-4 w-4" /> الهدف العام</label><textarea name="generalGoal" value={formData.generalGoal} onChange={handleInputChange} rows="3" className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                  <div className="space-y-2"><label className="text-cyan-500 flex items-center gap-2"><ListChecks className="h-4 w-4" /> المسؤوليات</label><textarea name="responsibilities" value={formData.responsibilities} onChange={handleInputChange} rows="3" className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                  <div className="space-y-2"><label className="text-cyan-500 flex items-center gap-2"><Award className="h-4 w-4" /> المؤهلات</label><textarea name="qualifications" value={formData.qualifications} onChange={handleInputChange} rows="3" className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-cyan-500 flex items-center gap-2"><Cpu className="h-4 w-4" /> المهارات</label><textarea name="skills" value={formData.skills} onChange={handleInputChange} rows="3" className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                  <div className="space-y-2"><label className="text-cyan-500 flex items-center gap-2"><Activity className="h-4 w-4" /> متطلبات بدنية/عقلية</label><textarea name="physicalMentalReq" value={formData.physicalMentalReq} onChange={handleInputChange} rows="3" className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                  <div className="space-y-2"><label className="text-amber-500 flex items-center gap-2"><Mail className="h-4 w-4" /> طريقة التقديم</label><input name="applicationMethod" value={formData.applicationMethod} onChange={handleInputChange} className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" placeholder="إيميل أو رابط" /></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-amber-500 flex items-center gap-2"><Info className="h-4 w-4" /> غرض المناقصة</label><textarea name="tenderPurpose" value={formData.tenderPurpose} onChange={handleInputChange} rows="3" className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                  <div className="space-y-2"><label className="text-amber-500 flex items-center gap-2"><FileText className="h-4 w-4" /> الوثائق المطلوبة</label><textarea name="tenderDocs" value={formData.tenderDocs} onChange={handleInputChange} rows="3" className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-amber-500">موعد فتح المظاريف</label><input name="openingSession" value={formData.openingSession} onChange={handleInputChange} className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                  <div className="space-y-2"><label className="text-cyan-500 flex items-center gap-2"><FileDown className="h-4 w-4" /> رابط تحميل كراسة الشروط</label><input name="downloadLink" value={formData.downloadLink} onChange={handleInputChange} className="w-full bg-black border border-slate-800 rounded-xl p-3 outline-none" /></div>
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all">
              <Save className="h-5 w-5" /> {isEditing ? "تحديث البيانات" : "نشر الإعلان الآن"}
            </button>
          </form>
        </section>

        {/* الجدول السفلي */}
        <section className="overflow-x-auto bg-[#030d1a] border border-slate-800 rounded-3xl">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="p-4 font-medium">النوع</th>
                <th className="p-4 font-medium">العنوان</th>
                <th className="p-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {postings.map((item) => (
                <tr key={item.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] ${item.type === 'وظيفة' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">{item.title}</td>
                  <td className="p-4 flex items-center justify-center gap-4">
                    <button onClick={() => editPosting(item)} className="text-cyan-400 hover:scale-110 transition"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => deletePosting(item.id)} className="text-rose-500 hover:scale-110 transition"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}