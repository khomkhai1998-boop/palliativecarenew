import React, { useMemo, useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, Stethoscope, Phone, MessageSquare, ClipboardList, Heart, Languages, Plus, Minus, Info, Printer, ShieldCheck, Upload, Calendar, Users, BookOpen, Search, Sun, Moon, Bot, Hospital, FileText, Download } from "lucide-react";

// *** StackBlitz-ready version ***
// - TailwindCSS via CDN (add this to index.html <head>):
//   <script src="https://cdn.tailwindcss.com"></script>
// - Install icons: in Terminal run `npm i lucide-react`
// - This is an education prototype; replace placeholders with real hospital services

const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-center gap-3 mb-4">
      {Icon && <Icon className="w-6 h-6" aria-hidden="true" />}
      <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
    </div>
    <div className="bg-white/70 dark:bg-neutral-900/60 backdrop-blur rounded-2xl p-4 sm:p-6 shadow-sm border border-neutral-200/70 dark:border-neutral-800">
      {children}
    </div>
  </section>
);

const Badge = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    amber: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}>{children}</span>;
};

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 select-none cursor-pointer">
    <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full p-1 transition ${checked ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-700"}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow transform transition ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </label>
);

const STEPS = [
  {
    key: "prep",
    title: "1) เตรียมตัวและวางแผน",
    items: [
      "ยืนยันความต้องการการรักษา/ไม่ฟื้นคืนชีพ (DNR) และผู้ตัดสินใจแทน",
      "ระบุสถานที่ดูแลที่ต้องการ (บ้าน/โรงพยาบาล/ฮอสพิซ)",
      "บันทึกประวัติแพ้ยาและยาที่ใช้อยู่ทั้งหมด",
      "วางแผนการติดต่อทีมดูแล (พยาบาล/แพทย์/นักสังคมฯ/จิตวิญญาณ)",
      "เตรียมอุปกรณ์ดูแลที่บ้าน: เตียง, ที่ดูดเสมหะ, ออกซิเจน (ถ้าจำเป็น)",
    ],
  },
  {
    key: "home",
    title: "2) การดูแลที่บ้านประจำวัน",
    items: [
      "ประเมินอาการทุกวัน: ปวด หายใจลำบาก คลื่นไส้ ซึม สับสน",
      "การให้ยาอย่างปลอดภัยตามแผน: เวลา ขนาดยา ทางให้ยา",
      "การป้องกันแผลกดทับ: เปลี่ยนท่า ทุก 2 ชั่วโมง ดูแลผิวหนัง",
      "โภชนาการและการดื่มน้ำตามสภาพร่างกายและความสบาย",
      "การสื่อสารและการดูแลใจ ทั้งผู้ป่วยและผู้ดูแล",
    ],
  },
  {
    key: "lastDays",
    title: "3) ช่วงใกล้จากไป",
    items: [
      "สังเกตสัญญาณ: ซึมมากลง, หายใจช้า/ไม่สม่ำเสมอ, มือเท้าเย็น",
      "ดูแลความสบาย: ยาลดปวด/หอบ, ทำความสะอาดช่องปาก, ลดเสียงรบกวน",
      "ดูแลครอบครัว: แจ้งคนสำคัญ, เตรียมพิธีกรรมทางศาสนา",
      "รู้ขั้นตอนหลังเสียชีวิตและการติดต่อโรงพยาบาล",
    ],
  },
  {
    key: "after",
    title: "4) หลังจากเสียชีวิต",
    items: [
      "ติดต่อโรงพยาบาล/หน่วยฉุกเฉินตามแผน",
      "ดำเนินเอกสารมรณบัตร",
      "คำแนะนำการเคลื่อนย้ายร่างและพิธีกรรม",
      "การดูแลใจครอบครัวและการให้คำปรึกษาโศกเศร้า",
    ],
  },
];

const SYMPTOMS = [
  {
    key: "pain",
    title: "ปวด (Pain)",
    color: "border-rose-300",
    do: [
      "ให้ยาตามแผนอย่างสม่ำเสมอ ไม่รอให้ปวดมาก",
      "ใช้ 0-10 scale บันทึกระดับปวด",
      "ประคบอุ่น/เย็นและการสัมผัสเชิงบำบัด",
    ],
    avoid: ["ไม่ปรับขนาดยาเอง", "ไม่หยุดยาแก้ปวดทันทีโดยไม่ปรึกษา"],
    call: [
      "ปวด >7 ต่อเนื่องแม้ให้ยา",
      "อาการข้างเคียงยาแรง (ง่วงมาก/หายใจช้า)",
    ],
  },
  {
    key: "dyspnea",
    title: "หายใจลำบาก (Dyspnea)",
    color: "border-cyan-300",
    do: [
      "จัดท่ากึ่งนั่ง เปิดหน้าต่าง พัดลมเบาๆ",
      "ให้ยาตามแผน (เช่น มอร์ฟีนขนาดต่ำตามแพทย์สั่ง)",
      "เทคนิคหายใจช้าและลึก",
    ],
    avoid: ["ไม่เพิ่มออกซิเจนเองโดยไม่มีคำสั่งแพทย์"],
    call: ["หอบมากขึ้นทันที", "ริมฝีปากเขียว", "มีเสียงครืดคราดมากร่วมกับซึม"],
  },
  {
    key: "delirium",
    title: "สับสน/เพ้อ (Delirium)",
    color: "border-amber-300",
    do: [
      "พูดคุยเสียงนุ่มนวล เปิดไฟสลัวให้เห็นเวลา/สถานที่",
      "ลดสิ่งกระตุ้นและจัดสิ่งแวดล้อมคุ้นเคย",
    ],
    avoid: ["ไม่ผูกมัดผู้ป่วย"],
    call: ["ก้าวร้าว/กระสับกระส่ายมาก", "ซึมลงเร็ว"],
  },
  {
    key: "secretions",
    title: "เสมหะ/เสียงครืดคราด (Secretions)",
    color: "border-indigo-300",
    do: ["จัดท่าตะแคง", "ดูแลปากให้ชุ่มชื้น", "เปิดพัดลมเบาๆ"],
    avoid: ["ไม่ดูดเสมหะบ่อยโดยไม่จำเป็น"],
    call: ["หายใจลำบากร่วม", "มีเลือดในเสมหะ"],
  },
  {
    key: "nausea",
    title: "คลื่นไส้/อาเจียน",
    color: "border-emerald-300",
    do: ["ให้ยาตามแพทย์สั่ง", "อาหารน้อยแต่บ่อย", "จิบน้ำบ่อยๆ"],
    avoid: ["อาหารมันจัด/กลิ่นแรง"],
    call: ["อาเจียนไม่หยุด", "อาเจียนเป็นเลือด"],
  },
];

const FAQ_PAIRS = [
  {
    q: "ควรให้ยาแก้ปวดเมื่อไร?",
    a: "ให้ตามเวลาที่กำหนดสม่ำเสมอ ไม่ต้องรอให้ปวดมาก และสามารถให้ยาเสริม (rescue) ได้ตามแผนของแพทย์เมื่อปวดพุ่งขึ้น",
  },
  { q: "ช่วงใกล้เสียชีวิตมีสัญญาณอะไร", a: "หลับมากขึ้น กินได้น้อย ชีพจรเบา หายใจไม่สม่ำเสมอ มือเท้าเย็น ปัสสาวะน้อยลง และอาจมีเสียงหายใจครืดคราด" },
  { q: "มีเสมหะมากทำอย่างไร", a: "จัดท่าตะแคง ดูแลปากให้ชุ่ม เปิดพัดลมเบาๆ และปรึกษาทีมดูแลเรื่องยาลดเสมหะ ถ้าหอบมากให้ติดต่อพยาบาลทันที" },
  { q: "ทำอย่างไรกับความเศร้าและความเครียด", a: "พูดคุยเปิดใจ ขอการสนับสนุนจากทีมสหวิชาชีพ นักจิตวิทยา/นักสังคมสงเคราะห์ เข้าร่วมกลุ่มผู้ดูแล และพักผ่อนให้เพียงพอ" },
  { q: "ติดต่อพยาบาลอย่างไร", a: "ใช้ปุ่ม 'ติดต่อทีมโรงพยาบาล' เพื่อโทร นัดหมายวิดีโอ หรือฝากข้อความพร้อมไฟล์/รูปภาพ (ปลอดภัย)" },
];

const languages = {
  th: {
    appTitle: "พอร์ทัลดูแลผู้ป่วยระยะสุดท้าย",
    tagline: "แนวทางทีละขั้น พร้อมติดต่อทีมโรงพยาบาล และผู้ช่วย AI",
    start: "เริ่มต้น",
    caregiverMode: "โหมดผู้ดูแล",
    proMode: "โหมดบุคลากร",
    searchPlaceholder: "ค้นหาหัวข้อ เช่น ปวด, หอบ, DNR...",
    quickLinks: "ลัดไปยัง",
    checklist: "เช็กลิสต์การดูแล",
    symptoms: "อาการและวิธีดูแล",
    contactTeam: "ติดต่อทีมโรงพยาบาล",
    knowledge: "คลังความรู้",
    faqAI: "ถามผู้ช่วย AI",
    resources: "ทรัพยากรและบริการ",
    privacy: "ความเป็นส่วนตัวและความปลอดภัย",
  },
  en: {
    appTitle: "Palliative Care Caregiver Portal",
    tagline: "Step-by-step guidance with direct hospital contact and AI helper",
    start: "Get started",
    caregiverMode: "Caregiver mode",
    proMode: "Clinician mode",
    searchPlaceholder: "Search topics e.g., pain, dyspnea, DNR...",
    quickLinks: "Jump to",
    checklist: "Care checklist",
    symptoms: "Symptoms & management",
    carePlan: "Personalized care plan",
    contactTeam: "Contact hospital team",
    knowledge: "Knowledge base",
    faqAI: "Ask AI",
    resources: "Resources & services",
    privacy: "Privacy & safety",
  },
};

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

const AccessibleButton = ({ children, className = "", ...props }) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const AIWidget = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "สวัสดีค่ะ ฉันคือผู้ช่วย AI สำหรับผู้ดูแล ถามมาได้เลยค่ะ" },
  ]);
  const [input, setInput] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  function getAnswer(q) {
    const hit = FAQ_PAIRS.find(({ q: k }) => q.includes(k.replace(/\s/g, "").slice(0, 6)) || q.includes(k.split(" ")[0]));
    if (hit) return hit.a;
    if (/ปวด|pain/i.test(q)) return "ให้ยาตามเวลาและบันทึกระดับปวด หากปวดมากกว่า 7 ติดต่อทีมโรงพยาบาล";
    if (/หอบ|ลมหายใจ|dysp/i.test(q)) return "จัดท่ากึ่งนั่ง เปิดพัดลมเบาๆ ให้ยาตามแผน หากริมฝีปากเขียว โทรหาพยาบาลทันที";
    if (/DNR|ไม่ฟื้น/i.test(q)) return "เอกสาร DNR ควรลงนามโดยผู้ป่วย/ผู้แทนตามกฎหมายและแพทย์ แจ้งทุกคนที่เกี่ยวข้องและแนบในแฟ้มผู้ป่วย";
    if (/หายใจลำบาก|เสียงครืดคราด|เสมหะ/i.test(q)) return "จัดท่านอนตะแคง/ศีรษะสูง เช็๋ดปากและริมฝีปากให้ชุ่มชื้น หลีกเลี่ยงการดูดเสมหะถ้าไม่จำเป็น ใช้ยาเมื่อเสียงรบกวนมากหรือผู้ป่วยอึดอัด ";
    if (/ดื่มน้ำ|เสมหะ/i.test(q)) return "ไม่ควรบังคับดื่มน้ำมาก เพราะอาจสำลักได้ ควรใช้ผ้าชุบน้ำเช็ดริมฝีปากหรือให้จิบน้ำเล็กน้อยแทน";
    if (/ภาวะเครียด|ผู้ดูแล|เครียด/i.test(q)) return "ขอความช่วยเหลือจากครอบครัว/ทีมสหวิชาชีพ หาเวลาพักผ่อน และพูดคุยกับคนที่ไว้ใจ";
    if (/สับสน|การสื่อสาร|Delirium/i.test(q)) return "จัดสิ่งแวดล้อมให้สงบ สว่างพอดี มีนาฬิกา/ปฏิทินให้ผู้ป่วยรับรู้เวลา พูดด้วยน้ำเสียงนุ่มนวล แนะนำตัวทุกครั้งถ้าผู้ป่วยสับสน อยู่ใกล้ ๆ สัมผัสมือหรือไหล่เพื่อให้ผู้ป่วยมั่นใจว่าไม่ได้อยู่ลำพัง หลีกเลี่ยงการเถียงหรือบังคับ แจ้งทีมดูแลหากอาการรุนแรงหรือผู้ป่วยก้าวร้าว/นอนไม่หลับนาน";
    if (/ร้องไห้|เศร้า/i.test(q)) return "การแสดงออกเป็นเรื่องธรรมชาติ แต่อาจเลือกเวลาที่เหมาะสม สำคัญคือให้ผู้ป่วยรู้ว่าคุณอยู่ตรงนี้เพื่อเขา";
    if (/อาการระยะท้าย|วาระสุดท้าย|สิ้นใจ|จะจากไป/i.test(q)) return "อาจสังเกตได้จากอ่อนแรงมากขึ้น กินได้น้อย หายใจเปลี่ยน ทีมดูแลจะคอยบอกและช่วยเตรียมใจ";
    if (/ประคับประคอง|รักษาโรค/i.test(q)) return "การรักษาโรคอาจไม่ได้ผลอีกต่อไป แต่การดูแลประคับประคองคือการดูแลให้คุณสบายที่สุด ทั้งด้านร่างกายและจิตใจ เพื่อคุณภาพชีวิตที่ดีที่สุดในเวลาที่เหลือ";
    return (
      <span>
        ขออภัย คำถามนี้เฉพาะเจาะจงกว่าที่ผู้ช่วยออฟไลน์ตอบได้ 🙏 
        <br />
        หากต้องการข้อมูลเพิ่มเติมจาก ChatGPT {" "}
        <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">
        คลิก
        </a>
      </span>
    );
    
  }

  const send = () => {
    if (!input.trim()) return;
    const user = { role: "user", text: input.trim() };
    const bot = { role: "assistant", text: getAnswer(input.trim()) };
    setMessages((m) => [...m, user, bot]);
    setInput("");
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div ref={ref} className="h-64 overflow-y-auto p-3 bg-neutral-50 dark:bg-neutral-900/60">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-2 border-t border-neutral-200 dark:border-neutral-800">
        <input
          aria-label="พิมพ์คำถาม"
          className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถาม เช่น ดูแลอาการปวดอย่างไร"
        />
        <AccessibleButton onClick={send} className="bg-blue-600 text-white border-blue-700 hover:brightness-110">
          <Bot className="w-4 h-4" /> ส่ง
        </AccessibleButton>
      </div>
      <div className="p-2 text-[11px] text-neutral-500">
        *ผู้ช่วยออฟไลน์เพื่อการให้ความรู้ ไม่แทนคำแนะนำทางการแพทย์แบบเฉพาะราย
      </div>
    </div>
  );
};

const KnowledgeSearch = () => {
  const [query, setQuery] = useState("");
  const docs = useMemo(
    () => [
      { id: 1, title: "แนวทางให้ยาแก้ปวดระดับขั้น", tags: ["ยาแก้ปวด", "opioid"], summary: "หลักการใช้ยาแก้ปวดตามขั้นบันไดของ WHO" },
      { id: 2, title: "การดูแลหายใจลำบากที่บ้าน", tags: ["หายใจ", "dyspnea"], summary: "ท่าทาง การใช้พัดลม และยา" },
      { id: 3, title: "การดูแลช่องปากผู้ป่วยติดเตียง", tags: ["ช่องปาก", "comfort"], summary: "การทำความสะอาดและให้ความชุ่มชื้น" },
      { id: 4, title: "เอกสาร DNR และ Advance Care Plan", tags: ["DNR", "ACP"], summary: "ขั้นตอนเอกสารและการสื่อสาร" },
    ],
    []
  );
  const results = useMemo(() => {
    const q = query.toLowerCase();
    return docs.filter((d) => d.title.toLowerCase().includes(q) || d.tags.join(" ").toLowerCase().includes(q));
  }, [query, docs]);

  return (
    <div>
    <div >
      </div>
      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r.id} className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{r.title}</h4>
              <AccessibleButton className="bg-blue-50 text-white-700 border-blue-200 dark:bg-blue-900/30 dark:text-white-100 dark:border-white-800">
              <a href="https://drive.google.com/drive/folders/1TO2h4480YVcI_x4UdNyyXeOukBdgS2LP?usp=sharing" 
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2 bg-white-100 dark:bg-white-800">
                <BookOpen className="w-4 h-4" /> เปิดอ่าน
                </a>
              </AccessibleButton>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">{r.summary}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {r.tags.map((t) => (
                <Badge key={t} tone="blue">#{t}</Badge>
              ))}
            </div>
          </li>
        ))}
        {results.length === 0 && (
          <li className="text-sm text-neutral-500">ไม่พบบทความที่ตรงกับคำค้น</li>
        )}
      </ul>
    </div>
  );
};

const CarePlanBuilder = ({ onPrint }) => {
  const [plan, setPlan] = useLocalStorage("carePlan", {
    patientName: "",
    hospitalNumber: "",
    allergies: "",
    preferredPlace: "บ้าน",
    religion: "",
    rituals: "",
    dnr: false,
    decisionMaker: "",
    contacts: "",
    notes: "",
  });

  const update = (k, v) => setPlan({ ...plan, [k]: v });
  return (
    <div className="space-y-4">
      <style>{`
        .input { @apply rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm w-full; }
      `}</style>
    </div>
  );
};

const ContactCard = () => (
  <div className="grid md:grid-cols-3 gap-4">
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      <h4 className="font-medium mb-2 flex items-center gap-2"><Phone className="w-4 h-4"/> โทรด่วน</h4>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">สายด่วนพยาบาลประจำทีม (ตามสิทธิ์/นโยบายหน่วยงาน)</p>
      <a href="tel:0987711921" className="inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2 bg-green-600 text-white">
        <Phone className="w-4 h-4"/> โทรตอนนี้
      </a>
    </div>
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      <h4 className="font-medium mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> นัดหมายวิดีโอ</h4>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">เลือกช่วงเวลาสะดวก ส่งลิงก์เข้าห้องที่ปลอดภัย</p>
      <a href="https://forms.gle/pDsApVeUH68kUNpBA" target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2 bg-blue-600 text-white">
        <Calendar className="w-4 h-4"/> จองเวลา
      </a>
    </div>
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      <h4 className="font-medium mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> ส่งข้อความ/ไฟล์</h4>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">ส่งคำถาม รูปอาการ หรือไฟล์เอกสาร </p>
      <a href="https://forms.gle/6M9aJoK5ismd2FMt6" className="inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2 bg-neutral-100 dark:bg-neutral-800">
        <Upload className="w-4 h-4"/> เขียนข้อความ
      </a>
    </div>
  </div>
);

const SymptomCard = ({ s }) => (
  <div className={`rounded-2xl border ${s.color} p-4 bg-white/60 dark:bg-neutral-900/60`}>
    <h4 className="font-semibold mb-2">{s.title}</h4>
    <div className="grid sm:grid-cols-3 gap-3 text-sm">
      <div>
        <div className="font-medium mb-1">ควรทำ</div>
        <ul className="list-disc pl-5 space-y-1">{s.do.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </div>
      <div>
        <div className="font-medium mb-1">หลีกเลี่ยง</div>
        <ul className="list-disc pl-5 space-y-1">{s.avoid.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </div>
      <div>
        <div className="font-medium mb-1 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-600"/> โทรหาทีมเมื่อ</div>
        <ul className="list-disc pl-5 space-y-1">{s.call.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </div>
    </div>
  </div>
);

export default function App() {
  const [lang, setLang] = useLocalStorage("lang", "th");
  const t = languages[lang];
  const [dark, setDark] = useLocalStorage("dark", false);
  const [fontScale, setFontScale] = useLocalStorage("fontScale", 1);
  const [activeStep, setActiveStep] = useState(STEPS[0].key);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * fontScale}px`;
    document.documentElement.classList.toggle("dark", dark);
  }, [fontScale, dark]);

  const printPlan = () => {
    window.print();
  };

  const stepContent = STEPS.find((s) => s.key === activeStep);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hospital className="w-6 h-6"/>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold leading-tight">{t.appTitle}</h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">{t.tagline}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <AccessibleButton onClick={() => setLang(lang === "th" ? "en" : "th")} className="bg-neutral-100 dark:bg-neutral-800">
              <Languages className="w-4 h-4"/> {lang.toUpperCase()}
            </AccessibleButton>
            <AccessibleButton onClick={() => setDark(!dark)} className="bg-neutral-100 dark:bg-neutral-800">
              {dark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
              {dark ? "โหมดสว่าง" : "โหมดมืด"}
            </AccessibleButton>
            <div className="hidden sm:flex items-center gap-1">
              <AccessibleButton onClick={() => setFontScale(Math.max(0.8, +(fontScale - 0.1).toFixed(2)))} className="bg-neutral-100 dark:bg-neutral-800"><Minus className="w-4 h-4"/></AccessibleButton>
              <Badge>{Math.round(fontScale * 100)}%</Badge>
              <AccessibleButton onClick={() => setFontScale(Math.min(1.6, +(fontScale + 0.1).toFixed(2)))} className="bg-neutral-100 dark:bg-neutral-800"><Plus className="w-4 h-4"/></AccessibleButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Hero / Quick actions */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl p-6 bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6"/>
              <h2 className="text-xl sm:text-2xl font-semibold">สำหรับผู้ดูแล</h2>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">ใช้แนวทางเป็นขั้นตอนเพื่อดูแลผู้ป่วยให้สบายที่สุด พร้อมช่องทางติดต่อทีมโรงพยาบาลตลอดเวลา</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="#checklist"><AccessibleButton className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"><ClipboardList className="w-4 h-4"/> เช็กลิสต์การดูแล</AccessibleButton></a>
              <a href="#symptoms"><AccessibleButton className="bg-neutral-100 dark:bg-neutral-800"><Stethoscope className="w-4 h-4"/> อาการและวิธีดูแล</AccessibleButton></a>
              <a href="#contact"><AccessibleButton className="bg-blue-600 text-white border-blue-700"><Phone className="w-4 h-4"/> ติดต่อทีมโรงพยาบาล</AccessibleButton></a>
              <a href="#ai"><AccessibleButton className="bg-neutral-100 dark:bg-neutral-800"><Bot className="w-4 h-4"/> ถามผู้ช่วย AI</AccessibleButton></a>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <Section id="checklist" title={t.checklist} icon={ClipboardList}>
          <div className="flex flex-col lg:flex-row gap-4">
            <aside className="lg:w-72 shrink-0">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 sticky top-24">
                <div className="text-sm font-medium mb-2">ขั้นตอน</div>
                <ol className="space-y-2">
                  {STEPS.map((s) => (
                    <li key={s.key}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm border ${activeStep === s.key ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800" : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"}`}
                        onClick={() => setActiveStep(s.key)}
                      >
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
            <div className="flex-1 space-y-4">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
                <h3 className="font-semibold mb-2">{stepContent.title}</h3>
                <ul className="space-y-2">
                  {stepContent.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5"/><span className="text-sm">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
                <h4 className="font-medium mb-2 flex items-center gap-2"><Info className="w-4 h-4"/> สัญญาณเตือน (Red Flags)</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>หอบมากขึ้นทันที/ริมฝีปากเขียว</li>
                  <li>ปวดรุนแรงไม่ทุเลาหลังให้ยาตามแผน</li>
                  <li>ซึมลงเร็ว/เรียกไม่ตื่น</li>
                  <li>อาเจียนเป็นเลือด/ถ่ายดำ</li>
                </ul>
                <div className="mt-3">
                  <a href="#contact"><AccessibleButton className="bg-amber-600 text-white border-amber-700"><AlertTriangle className="w-4 h-4"/> ติดต่อทีมทันที</AccessibleButton></a>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Symptoms */}
        <Section id="symptoms" title={t.symptoms} icon={Stethoscope}>
          <div className="grid md:grid-cols-2 gap-4">
            {SYMPTOMS.map((s) => (
              <SymptomCard key={s.key} s={s} />
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section id="contact" title={t.contactTeam} icon={Phone}>
          <ContactCard />
          <div className="mt-3 text-xs text-neutral-500">ช่องทางการติดต่อทั้งหมดมีการเข้ารหัสระหว่างส่ง (TLS) และบันทึกการติดต่อเพื่อความต่อเนื่องของการดูแล ตามนโยบายของโรงพยาบาล</div>
        </Section>

        {/* Knowledge Base */}
        <Section id="knowledge" title={t.knowledge} icon={BookOpen}>
          <KnowledgeSearch />
        </Section>

        {/* AI */}
        <Section id="ai" title={t.faqAI} icon={Bot}>
          <AIWidget />
        </Section>

        {/* Resources */}
        <Section id="resources" title="ทรัพยากรและบริการ" icon={Users}>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <h4 className="font-medium mb-1">เบอร์สำคัญ</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>สายด่วนโรงพยาบาล (พิมพ์ตามหน่วยงาน)</li>
                <li>หน่วยฉุกเฉิน 1669</li>
                <li>กลุ่มผู้ดูแลในชุมชน/LINE OA</li>
              </ul>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <h4 className="font-medium mb-1">การสนับสนุนจิตใจ</h4>
              <p>ติดต่อที่ปรึกษา/นักจิตวิทยา นัดหมายกลุ่มสนับสนุนการโศกเศร้า</p>
              </div>
            <div> 
             
            </div>
          </div>
        </Section>

        {/* Privacy */}
        <Section id="privacy" title="ความเป็นส่วนตัวและความปลอดภัย" icon={ShieldCheck}>
          <div className="text-sm space-y-2">
            <p>พอร์ทัลนี้ออกแบบตามหลักความเป็นส่วนตัวโดยการออกแบบ (Privacy by Design): การสื่อสารเข้ารหัส, การยืนยันตัวตนสองชั้น (สามารถเปิดใช้งาน), เก็บข้อมูลเท่าที่จำเป็น และบันทึกการเข้าถึง</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>สอดคล้อง PDPA (ประเทศไทย) และแนวทาง HIPAA เท่าที่ใช้ได้</li>
              <li>สิทธิในการเข้าถึง/ลบข้อมูลส่วนบุคคลตามคำร้อง</li>
              <li>บันทึกการยินยอม (Consent) ทุกครั้งที่แชร์ข้อมูล</li>
            </ul>
          </div>
        </Section>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Hospital Palliative Care — Prototype for education only.
      </footer>

      <style>{`
        @media print {
          header, #contact, #ai, #resources, #privacy, footer { display: none !important; }
          main { padding: 0; }
          section { break-inside: avoid; }
          body { background: white !important; }
        }
        .input { border-radius: 0.75rem; }
      `}</style>
    </div>
  );
}
