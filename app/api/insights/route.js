import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// مسار حفظ البيانات بملف دائِم
const filePath = path.join(process.cwd(), 'data', 'insights.json');

const initialData = [
  {
    id: "1",
    category: "FUTURE_ENG",
    title: "الذكاء الاصطناعي والتنبؤ بانهيار التربة",
    shortDesc: "تطبيقات Machine Learning للتنبؤ بانهيار التربة وتحسين تكلفة المنشآت الجيوتقنية.",
    difficulty: "متقدم",
    specialty: "جيوتقنيك وإدارة مشاريع",
    problem: "صعوبة التنبؤ الدقيق بانهيار التربة بالموقع مما يسبب كوارث إنشائية وخسائر مالية فادحة.",
    science: "تعتمد النظرية على تحليل بيانات الجسات السابقة وتدريب خوارزميات الغابات العشوائية (Random Forests).",
    smartIdea: "تحويل قيم الاختبارات الحقلية الفورية (SPT) إلى مصفوفات رقمية وإدخالها لنموذج تنبؤي فوري.",
    application: "1. جمع بيانات الجسات الحقلية. 2. تشغيل كود البايثون المرفق. 3. استخراج منحنى الهبوط.",
    codeSnippet: "# Python Soil Predictor Code",
    toolLink: "/software/geotech-predictor",
    hasCalculator: true,
    calcType: "soil_safety"
  }
];

// دالة قراءة البيانات من الملف
function readData() {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return initialData;
  }
}

// دالة كتابة البيانات إلى الملف
function writeData(data) {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

export async function GET() {
  const data = readData();
  return NextResponse.json({ success: true, data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const data = readData();
    const newItem = {
      id: Date.now().toString(),
      ...body
    };
    data.unshift(newItem);
    writeData(data);
    return NextResponse.json({ success: true, data: newItem });
  } catch (err) {
    return NextResponse.json({ success: false, error: "فشل الإضافة" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    let data = readData();
    const index = data.findIndex(item => item.id === body.id);
    if (index !== -1) {
      data[index] = { ...data[index], ...body };
      writeData(data);
      return NextResponse.json({ success: true, data: data[index] });
    }
    return NextResponse.json({ success: false, error: "غير موجود" }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "فشل التعديل" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      let data = readData();
      data = data.filter(item => item.id !== id);
      writeData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "معرف غير صحيح" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "فشل الحذف" }, { status: 500 });
  }
}