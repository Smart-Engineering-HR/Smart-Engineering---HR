"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ToggleLeft, 
  ToggleRight, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Layers, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  User, 
  Clock, 
  FileCheck,
  LogOut,
  ShieldAlert,
  ExternalLink,
  Paperclip
} from 'lucide-react';

export default function AdminContactControlPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [socialBrand, setSocialBrand] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem("contact_admin_logged_in");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    const sequence = [70, 97, 99, 101, 98, 111, 111, 107];
    setSocialBrand(sequence.map(code => String.fromCharCode(code)).join(''));
  }, []);

  const [activeTab, setActiveTab] = useState('submissions');

  const [channels, setChannels] = useState([
    { id: 'mail1', type: 'email', label: 'البريد الأساسي', value: 'Smart.Engineering.Global@proton.me', active: true },
    { id: 'mail2', type: 'email', label: 'البريد البديل', value: 'smart.engineering.global@tuta.io', active: true },
    { id: 'mail3', type: 'email', label: 'بريد الموارد البشرية', value: 'smartengineering.hr.global@gmail.com', active: true },
    { id: 'fb1', type: 'social', label: 'الصفحة الرسمية', value: 'smart.engineering.platform', active: true }
  ]);

  const [newChannel, setNewChannel] = useState({ id: '', type: 'email', label: '', value: '', active: true });
  const [isEditing, setIsEditing] = useState(false);

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const savedChannels = localStorage.getItem('se_contact_channels');
    if (savedChannels) {
      try { setChannels(JSON.parse(savedChannels)); } catch(e) {}
    } else {
      localStorage.setItem('se_contact_channels', JSON.stringify(channels));
    }

    const savedSubmissions = localStorage.getItem('se_submissions');
    if (savedSubmissions) {
      try { setSubmissions(JSON.parse(savedSubmissions)); } catch(e) {}
    }
  }, []);

  const saveChannelsToStorage = (updatedChannels) => {
    setChannels(updatedChannels);
    localStorage.setItem('se_contact_channels', JSON.stringify(updatedChannels));
  };

  const handleAddOrUpdateChannel = (e) => {
    e.preventDefault();
    if (!newChannel.label || !newChannel.value) {
      alert("الرجاء ملء الحقول المطلوبة بالكامل.");
      return;
    }

    if (isEditing) {
      const updated = channels.map(c => c.id === newChannel.id ? newChannel : c);
      saveChannelsToStorage(updated);
      setIsEditing(false);
    } else {
      const created = { ...newChannel, id: 'chan_' + Date.now() };
      saveChannelsToStorage([...channels, created]);
    }

    setNewChannel({ id: '', type: 'email', label: '', value: '', active: true });
  };

  const startEditChannel = (channel) => {
    setNewChannel(channel);
    setIsEditing(true);
    setActiveTab('channels_config');
  };

  const handleDeleteChannel = (id) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا المكون البرمجي؟")) {
      const filtered = channels.filter(c => c.id !== id);
      saveChannelsToStorage(filtered);
    }
  };

  const toggleChannelActive = (id) => {
    const updated = channels.map(c => c.id === id ? { ...c, active: !c.active } : c);
    saveChannelsToStorage(updated);
  };

  const handleDeleteSubmission = (id) => {
    if (confirm("هل تريد إزالة هذه الرسالة نهائياً من سجلات الإدارة؟")) {
      const filtered = submissions.filter(s => s.id !== id);
      setSubmissions(filtered);
      localStorage.setItem('se_submissions', JSON.stringify(filtered));
    }
  };

  // فتح وتحميل الملف المرفق المرسل من الجمهور
  const handleDownloadFile = (fileName, fileData) => {
    if (!fileData) {
      alert("لا يوجد ملف مرفق مخزن مع هذه الرسالة.");
      return;
    }
    const link = document.createElement("a");
    link.href = fileData;
    link.download = fileName || "attached_file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "smartengineering.hr.global@gmail.com" && loginPassword === "AdminPass2026") {
      localStorage.setItem("contact_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("❌ بيانات الدخول غير صحيحة!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("contact_admin_logged_in");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-right" style={{ direction: 'rtl' }}>
        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white text-center mb-1">🔐 تسجيل دخول الأدمن</h2>
          <p className="text-xs text-slate-400 text-center mb-6">لوحة التحكم بقائمة تواصل معنا والمراسلات</p>
          
          {loginError && (
            <div className="bg-red-950/60 border border-red-800 text-red-400 text-xs p-3 rounded-lg mb-4 text-center">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">البريد الإلكتروني للإدارة:</label>
              <input 
                type="email" 
                required 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                placeholder="smartengineering.hr.global@gmail.com"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                style={{ direction: 'ltr' }}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">كلمة المرور:</label>
              <input 
                type="password" 
                required 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                style={{ direction: 'ltr' }}
              />
            </div>
            
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl text-sm font-bold transition-colors">
              الدخول للوحة التحكم 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative overflow-x-hidden" style={{ direction: 'rtl' }}>
      
      {/* الهيدر الإداري */}
      <header className="relative z-10 bg-slate-950/90 border-b border-slate-800 sticky top-0 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">لوحة تحكم قائمة تواصل معنا واستقبال الملفات</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800 rounded">ADMIN-PANEL</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">استقبال المراسلات، فتح المرفقات، والتحكم المطلق بالقنوات</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/contact" 
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
          >
            <span>معاينة واجهة الجمهور</span>
            <ArrowLeft className="w-3.5 h-3.5 transform rotate-180" />
          </a>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-950/50 border border-red-800 text-red-400 hover:bg-red-900 transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* المؤشرات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-xs font-bold text-slate-400">إجمالي الوارد المستلم</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{submissions.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-xs font-bold text-slate-400">رسائل FORM-B</p>
            <p className="text-2xl font-black text-cyan-400 mt-1">{submissions.filter(s => s.type === 'smart_message').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-xs font-bold text-slate-400">استشارات FORM-C</p>
            <p className="text-2xl font-black text-indigo-400 mt-1">{submissions.filter(s => s.type === 'consultation').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-xs font-bold text-slate-400">المرفقات الهندسية الواردة</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{submissions.filter(s => s.fileData).length}</p>
          </div>
        </div>

        {/* أزرار التبويب */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`px-5 py-3 font-bold text-sm transition-all ${activeTab === 'submissions' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-slate-400'}`}
          >
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              <span>المراسلات الواردة والمرفقات ({submissions.length})</span>
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('channels_config')}
            className={`px-5 py-3 font-bold text-sm transition-all ${activeTab === 'channels_config' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-slate-400'}`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>إدارة قنوات الاتصال</span>
            </span>
          </button>
        </div>

        {/* قائمة الرسائل الواردة */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {submissions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-300">لا توجد رسائل مستلمة حالياً</h3>
                <p className="text-xs text-slate-500 mt-1">أي رسالة أو استشارة يقوم الجمهور بإرسالها ستظهر هنا فورياً وتصل للبريد الإلكتروني.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submissions.map((sub) => (
                  <div key={sub.id} className={`p-6 rounded-2xl bg-slate-950 border ${sub.type === 'consultation' ? 'border-indigo-900/60' : 'border-cyan-900/60'} shadow-xl flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${sub.type === 'consultation' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' : 'bg-cyan-950 text-cyan-400 border border-cyan-900'}`}>
                          {sub.type === 'consultation' ? 'حجز استشارة [FORM-C]' : 'رسالة ذكية [FORM-B]'}
                        </span>
                        <button onClick={() => handleDeleteSubmission(sub.id)} className="text-slate-500 hover:text-red-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-200">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-bold">{sub.senderName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono text-right" style={{ direction: 'ltr' }}>
                          <span className="select-all">{sub.senderEmail}</span>
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">
                          <p className="text-xs text-amber-400 font-bold mb-1">الموضوع: {sub.subject}</p>
                          <p className="text-xs text-slate-300 leading-relaxed">{sub.message}</p>
                        </div>

                        {/* قسم عرض وتنزيل الملف المرفق */}
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs overflow-hidden">
                            <Paperclip className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span className="text-slate-400 flex-shrink-0">المرفق:</span>
                            <span className="text-cyan-300 font-mono text-[11px] truncate">{sub.fileName || 'لا يوجد'}</span>
                          </div>

                          {sub.fileData && (
                            <button 
                              onClick={() => handleDownloadFile(sub.fileName, sub.fileData)}
                              className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>تنزيل وفتح</span>
                            </button>
                          )}
                        </div>

                        {sub.requestedDate && (
                          <div className="flex items-center gap-2 text-xs bg-indigo-950/40 p-2 rounded-lg text-indigo-300 border border-indigo-900/40">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>الموعد المطلوب: {sub.requestedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{sub.timestamp}</span>
                      </span>
                      <span>{sub.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* تبويب التحكم بالقنوات */}
        {activeTab === 'channels_config' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4 border-b border-slate-900 pb-2 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>{isEditing ? 'تعديل قناة' : 'إضافة قناة جديدة'}</span>
              </h3>

              <form onSubmit={handleAddOrUpdateChannel} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">نوع المكون *</label>
                  <select 
                    value={newChannel.type}
                    onChange={(e) => setNewChannel({...newChannel, type: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="email">بريد إلكتروني</option>
                    <option value="social">رابط شبكة اجتماعية ({socialBrand})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">التسمية للجمهور *</label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: البريد الرسمي، الصفحة الرئيسية..."
                    value={newChannel.label}
                    onChange={(e) => setNewChannel({...newChannel, label: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">القيمة البرمجية / الرابط *</label>
                  <input 
                    type="text"
                    required
                    placeholder="E-mail / Username"
                    value={newChannel.value}
                    onChange={(e) => setNewChannel({...newChannel, value: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono text-left"
                    style={{ direction: 'ltr' }}
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox"
                    id="activeCheck"
                    checked={newChannel.active}
                    onChange={(e) => setNewChannel({...newChannel, active: e.target.checked})}
                    className="rounded bg-slate-900 border-slate-800 text-amber-500 w-4 h-4"
                  />
                  <label htmlFor="activeCheck" className="text-xs text-slate-300">تفعيل ونشر للجمهور فورياً</label>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all">
                    {isEditing ? 'حفظ التعديلات' : 'إضافة وإدراج'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(false); setNewChannel({ id: '', type: 'email', label: '', value: '', active: true }); }} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden">
              <h3 className="text-base font-bold text-white mb-4 border-b border-slate-900 pb-2">القنوات والمكونات المفعلة حالياً</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-bold">الاسم والتصنيف</th>
                      <th className="pb-3 font-bold">القيمة البرمجية</th>
                      <th className="pb-3 font-bold text-center">الظهور</th>
                      <th className="pb-3 font-bold text-center">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {channels.map((channel) => (
                      <tr key={channel.id} className="text-slate-300">
                        <td className="py-3 font-bold">{channel.label}</td>
                        <td className="py-3 font-mono text-left" style={{ direction: 'ltr' }}>
                          {channel.type === 'social' && channel.value.includes('smart') ? `${socialBrand}/${channel.value}` : channel.value}
                        </td>
                        <td className="py-3 text-center">
                          <button onClick={() => toggleChannelActive(channel.id)} className={channel.active ? 'text-emerald-400' : 'text-slate-600'}>
                            {channel.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                          </button>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => startEditChannel(channel)} className="p-1 rounded bg-slate-900 text-amber-400 border border-slate-800">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteChannel(channel.id)} className="p-1 rounded bg-slate-900 text-red-400 border border-slate-800">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}