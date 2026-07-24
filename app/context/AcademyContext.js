'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AcademyContext = createContext();

export function AcademyProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [codes, setCodes] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // تحميل البيانات عند إقلاع المنصة
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCourses(JSON.parse(localStorage.getItem('se_courses')) || []);
      setScholarships(JSON.parse(localStorage.getItem('se_scholarships')) || []);
      setApplications(JSON.parse(localStorage.getItem('se_applications')) || []);
      setCodes(JSON.parse(localStorage.getItem('se_codes')) || []);
      setWebinars(JSON.parse(localStorage.getItem('se_webinars')) || []);
      setCertificates(JSON.parse(localStorage.getItem('se_certificates')) || []);
    }
  }, []);

  // دالة المزامنة الموحدة للـ localStorage
  const saveData = (key, data, setter) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  return (
    <AcademyContext.Provider value={{
      courses, setCourses: (d) => saveData('se_courses', d, setCourses),
      scholarships, setScholarships: (d) => saveData('se_scholarships', d, setScholarships),
      applications, setApplications: (d) => saveData('se_applications', d, setApplications),
      codes, setCodes: (d) => saveData('se_codes', d, setCodes),
      webinars, setWebinars: (d) => saveData('se_webinars', d, setWebinars),
      certificates, setCertificates: (d) => saveData('se_certificates', d, setCertificates),
    }}>
      {children}
    </AcademyContext.Provider>
  );
}

export const useAcademy = () => useContext(AcademyContext);