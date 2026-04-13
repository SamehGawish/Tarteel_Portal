import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function mapPersonFromDb(p) {
  return {
    id: p.id, studentNum: p.student_num,
    firstName: p.first_name, lastName: p.last_name,
    age: p.age, gender: p.gender,
    dateOfBirth: p.date_of_birth || "",
    phone: p.phone || "", email: p.email || "",
    address: p.address || { street: "", city: "", province: "", postal: "" },
    notes: p.notes || "",
    parent1First: p.parent1_first || "", parent1Last: p.parent1_last || "",
    parent1Phone: p.parent1_phone || "", parent1Email: p.parent1_email || "",
    parent2First: p.parent2_first || "", parent2Last: p.parent2_last || "",
    parent2Phone: p.parent2_phone || "", parent2Email: p.parent2_email || "",
    twoParents: p.two_parents || "yes", mainContact: p.main_contact || "parent1",
    emergencyFirst: p.emergency_first || "", emergencyLast: p.emergency_last || "",
    emergencyPhone: p.emergency_phone || "", emergencyRelationship: p.emergency_relationship || "",
    hasAllergy: p.has_allergy || false, allergyNote: p.allergy_note || "",
    photo: p.photo || null,
  };
}
function mapFamilyFromDb(f) {
  return { id: f.id, name: f.name, phone: f.phone, email: f.email, personIds: f.person_ids || [] };
}
function mapEnrollmentFromDb(e) {
  return {
    id: e.id, personId: e.person_id, program: e.program,
    level: e.level, levelName: e.level_name,
    teacherId: e.teacher_id, teacherName: e.teacher_name,
    monthlyRate: e.monthly_rate || 0, semesterTotal: e.semester_total || 0,
    amountPaid: e.amount_paid || 0, paymentType: e.payment_type,
    paymentMethod: e.payment_method, waiverType: e.waiver_type,
    discountedAmount: e.discounted_amount || 0,
    paymentHistory: e.payment_history || [],
    active: e.active, semesterLabel: e.semester_label,
  };
}
function mapPersonToDb(p) {
  return {
    id: p.id, student_num: p.studentNum,
    first_name: p.firstName, last_name: p.lastName,
    age: p.age, gender: p.gender,
    date_of_birth: p.dateOfBirth || null,
    phone: p.phone || null, email: p.email || null,
    address: p.address || null, notes: p.notes || null,
    parent1_first: p.parent1First || null, parent1_last: p.parent1Last || null,
    parent1_phone: p.parent1Phone || null, parent1_email: p.parent1Email || null,
    parent2_first: p.parent2First || null, parent2_last: p.parent2Last || null,
    parent2_phone: p.parent2Phone || null, parent2_email: p.parent2Email || null,
    two_parents: p.twoParents || null, main_contact: p.mainContact || null,
    emergency_first: p.emergencyFirst || null, emergency_last: p.emergencyLast || null,
    emergency_phone: p.emergencyPhone || null, emergency_relationship: p.emergencyRelationship || null,
    has_allergy: p.hasAllergy || false, allergy_note: p.allergyNote || null,
    photo: p.photo || null,
  };
}
function mapFamilyToDb(f) {
  return { id: f.id, name: f.name, phone: f.phone || null, email: f.email || null, person_ids: f.personIds || [] };
}
function mapEnrollmentToDb(e) {
  return {
    id: e.id, person_id: e.personId, program: e.program,
    level: e.level, level_name: e.levelName,
    teacher_id: e.teacherId, teacher_name: e.teacherName,
    monthly_rate: e.monthlyRate || 0, semester_total: e.semesterTotal || 0,
    amount_paid: e.amountPaid || 0, payment_type: e.paymentType,
    payment_method: e.paymentMethod, waiver_type: e.waiverType,
    discounted_amount: e.discountedAmount || 0,
    payment_history: e.paymentHistory || [],
    active: e.active, semester_label: e.semesterLabel,
  };
}

const LOGO_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QDsRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAC5ADAAIAAAAUAAAApJAEAAIAAAAUAAAAuJAQAAIAAAAHAAAAzJARAAIAAAAHAAAA1JASAAIAAAAHAAAA3JKQAAIAAAAEMDAwAJKRAAIAAAAEMDAwAJKSAAIAAAAEMDAwAKABAAMAAAABAAEAAKACAAQAAAABAAAB9KADAAQAAAABAAAB9AAAAAAyMDI1OjA0OjA3IDE2OjE2OjM2ADIwMjU6MDQ6MDcgMTY6MTY6MzYALTA0OjAwAAAtMDQ6MDAAAC0wNDowMAAA/9sAQwAICAgICAgQCAgQGBQUGBhAKCgoKCg8NCwsLCw8VEA8PDw8PEBUUExMTExQZGBgYGBkfHx8fHyMjIyMjIyMjIyMj/9sAQwEICAgICAgQCAgQGBUVGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgY/8AAEQgB9AH0AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAMCBAEFAAYHCAkKC//EAMMQAAEDAwIEAwQGBAcGBAgGcwECAAMRBBIhBTETIhAGQVEyFGFxIweBIJFCFaFSM7EkYjAWwXLRQ5I0ggjhU0AlYxc18JNzolBEsoPxJlQ2ZJR0wmDShKMYcOInRTdls1V1pJXDhfLTRnaA40dWZrQJChkaKCkqODk6SElKV1hZWmdoaWp3eHl6hoeIiYqQlpeYmZqgpaanqKmqsLW2t7i5usDExcbHyMnK0NTV1tfY2drg5OXm5+jp6vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAQIAAwQFBgcICQoL/8QAwxEAAgIBAwMDAgMFAgUCBASHAQACEQMQEiEEIDFBEwUwIjJRFEAGMyNhQhVxUjSBUCSRoUOxFgdiNVPw0SVgwUThcvEXgmM2cCZFVJInotIICQoYGRooKSo3ODk6RkdISUpVVldYWVpkZWZnaGlqc3R1dnd4eXqAg4SFhoeIiYqQk5SVlpeYmZqgo6SlpqeoqaqwsrO0tba3uLm6wMLDxMXGx8jJytDT1NXW19jZ2uDi4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APv+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";

const PROGRAMS = { juniors: "Tarteel Juniors", brothers: "Tarteel Brothers", sisters: "Tarteel Sisters" };
const PROGRAM_KEYS = ["juniors", "brothers", "sisters"];
const JUNIOR_LEVELS = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
const PAYMENT_METHODS = ["Cash", "Debit/Credit Card", "IRM Online"];
const WAIVER_TYPES = ["Scholarship", "Arrangement"];
const RELATIONSHIPS = ["Father", "Mother", "Spouse", "Sibling", "Grandparent", "Uncle/Aunt", "Other"];
const SEMESTER_MONTHS_DEFAULT = 5;
const SCHOOL_NAME = "Tarteel Ottawa Quran Institute";
const SCHOOL_ADDRESS = "251 Northwestern Ave, Ottawa, ON, K1Y 0M1";
const DEFAULT_SEMESTER_LABEL = "Fall " + new Date().getFullYear();
const DEFAULT_JUNIOR_TEACHERS = [{ id: "j1", name: "Ustadh Ibrahim Al-Sayed", levels: [0, 1] }, { id: "j2", name: "Ustadha Fatima Noor", levels: [1, 2] }, { id: "j3", name: "Ustadh Khalid Mansour", levels: [2, 3] }, { id: "j4", name: "Ustadha Maryam Hasan", levels: [3, 4] }, { id: "j5", name: "Ustadh Yusuf Al-Rashid", levels: [0, 2, 4] }];
const DEFAULT_ADULT_TEACHERS = { brothers: [{ id: "b1", name: "Sh. Saad", monthlyRate: 50 }, { id: "b2", name: "Sh. Abu Kudus", monthlyRate: 100 }, { id: "b3", name: "Ust. Abdullah", monthlyRate: 50 }], sisters: [{ id: "s1", name: "Ust. Reham", monthlyRate: 50 }, { id: "s2", name: "Ust. Asmaa", monthlyRate: 50 }, { id: "s3", name: "Ust. Masa", monthlyRate: 100 }, { id: "s4", name: "Ust. Kauthar", monthlyRate: 100 }, { id: "s5", name: "Ust. Karima", monthlyRate: 100 }] };
const DEFAULT_ADULT_LEVELS = { brothers: ["Beginners", "Intermediate", "Advanced"], sisters: ["Beginners", "Intermediate", "Advanced"] };
const STORAGE_KEYS = { semesterLabel: "tarteel:semester-label", semesterMonths: "tarteel:semester-months", juniorTeachers: "tarteel:junior-teachers", adultTeachers: "tarteel:adult-teachers", adultLevels: "tarteel:adult-levels" };
const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "enroll", icon: "＋", label: "Enroll" },
  { id: "families", icon: "👨‍👩‍👧", label: "Families" },
  { id: "lookup", icon: "🔍", label: "Lookup" },
  { id: "teachers", icon: "🎓", label: "Teachers" },
  { id: "mailing", icon: "📧", label: "Mailing" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getJuniorBaseRate(n) { if (n === 1) return 210; if (n === 2) return 190; if (n === 3) return 170; return 150; }
function readStoredJson(key, fallback) { try { const r = window.localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; } }
function readStoredString(key, fallback) { try { return window.localStorage.getItem(key) || fallback; } catch { return fallback; } }
function readStoredNumber(key, fallback) { try { const r = window.localStorage.getItem(key); const p = parseInt(r || "", 10); return Number.isFinite(p) ? p : fallback; } catch { return fallback; } }
function mapTeacherFromDb(t) { return { id: t.id, name: t.name, levels: Array.isArray(t.levels) ? t.levels.map(Number) : [], monthlyRate: Number(t.monthly_rate || 0) }; }
function escapeHtml(v) { return String(v || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
function buildTeacherState(rows) { return { juniors: rows.filter(t => t.program === "juniors").map(mapTeacherFromDb), adults: { brothers: rows.filter(t => t.program === "brothers").map(mapTeacherFromDb), sisters: rows.filter(t => t.program === "sisters").map(mapTeacherFromDb) } }; }
function buildAdultLevelsState(rows) { const g = { brothers: [], sisters: [] }; rows.slice().sort((a, b) => (a.position ?? 0) - (b.position ?? 0)).forEach(r => { if (r.program === "brothers" || r.program === "sisters") g[r.program].push(r.label); }); return g; }
function calcFamilyBilling(family, persons, enrollments, semMonths) {
  const memberIds = family.personIds || [];
  const active = enrollments.filter(e => memberIds.includes(e.personId) && e.active);
  const juniors = active.filter(e => e.program === "juniors");
  const juniorRate = getJuniorBaseRate(juniors.length);
  const lineItems = [];
  juniors.forEach(e => { const p = persons.find(x => x.id === e.personId); const effectiveTotal = e.paymentType === "discounted" ? Math.round((e.discountedAmount || e.semesterTotal || 0) * 100) / 100 : juniorRate; lineItems.push({ enrollmentId: e.id, personId: e.personId, name: p ? `${p.firstName} ${p.lastName}` : "-", program: "juniors", total: effectiveTotal }); });
  const totalOwed = lineItems.reduce((a, l) => a + l.total, 0);
  const totalPaid = active.reduce((a, e) => isEnrollmentEffectivelyPaid(e) ? a + (e.semesterTotal || 0) : a + (e.amountPaid || 0), 0);
  return { lineItems, totalOwed, totalPaid, balance: Math.round((totalOwed - totalPaid) * 100) / 100 };
}
function isEnrollmentEffectivelyPaid(e) { if (!e) return false; if (e.paymentType === "full" || e.paymentType === "waived" || e.paymentType === "discounted") return true; if (e.paymentType === "instalment") return (e.paymentHistory || []).some(h => h.type === "instalment" && h.method === "IRM Online"); return false; }
function enrollBalance(e) { return isEnrollmentEffectivelyPaid(e) ? 0 : Math.max(0, (e.semesterTotal || 0) - (e.amountPaid || 0)); }
function cleanPhone(v) { return (v || "").replace(/\D/g, "").slice(0, 10); }
function sanitizeMoneyInput(v) { const c = (v || "").replace(/[^\d.]/g, ""); const [w = "", ...r] = c.split("."); return r.length ? `${w}.${r.join("").slice(0, 2)}` : w; }
function validEmail(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function fmtPhone(v) { const d = (v || "").replace(/\D/g, ""); if (d.length < 4) return d; if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`; return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`; }
function today() { return new Date().toLocaleDateString("en-CA"); }
function fmtDate(d) { if (!d) return "-"; try { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); } catch { return d; } }

// ─── DOB helpers ──────────────────────────────────────────────────────────────
function calcAgeFromDob(dob) {
  if (!dob) return null;
  try {
    const birth = new Date(dob + "T12:00:00");
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : null;
  } catch { return null; }
}
function fmtDob(d) { return fmtDate(d); }

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
let studentCounter = 1000;
function nextStudentNum() { studentCounter++; return "T-" + studentCounter; }
const receiptCounterMap = {};
function nextReceiptNum(person) { const phone = person ? (person.age >= 18 ? (person.phone || "") : (person.parent1Phone || person.parent2Phone || person.phone || "")) : ""; const digits = phone.replace(/\D/g, ""); const last4 = digits.length >= 4 ? digits.slice(-4) : digits.padStart(4, "0"); receiptCounterMap[last4] = (receiptCounterMap[last4] || 0) + 1; return `${last4}-${receiptCounterMap[last4]}`; }
function useIsMobile() { const [m, setM] = useState(window.innerWidth < 768); useEffect(() => { const fn = () => setM(window.innerWidth < 768); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []); return m; }

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function handleLogin() {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    if (e) { setError("Invalid email or password. Please try again."); setLoading(false); }
  }
  return (
    <div style={{ minHeight: "100vh", background: "#f8f6f1", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Red Hat Display', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ background: "#fff", borderRadius: 16, padding: "44px 40px", width: 420, maxWidth: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src={LOGO_URL} alt="Tarteel" style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 12, marginBottom: 14 }} />
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a6b3a" }}>Tarteel Portal</div>
          <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>Ottawa Quran Institute</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.7 }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} type="email" placeholder="your@email.com" autoFocus style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 15, fontFamily: "inherit", background: "#fafafa", color: "#1a1a1a", outline: "none" }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.7 }}>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} type="password" placeholder="••••••••" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 15, fontFamily: "inherit", background: "#fafafa", color: "#1a1a1a", outline: "none" }} />
        </div>
        {error && <div style={{ background: "#fdecea", color: "#c0392b", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16, fontWeight: 500 }}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#aaa" : "#1a6b3a", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 20 }}>Access is restricted to authorized staff only.</div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function AddressInput({ value, onChange }) {
  const [raw, setRaw] = useState((value && value.street) || ""); const [hits, setHits] = useState([]); const [loading, setLoading] = useState(false); const timer = useRef(null); const abort = useRef(null); const lastQuery = useRef("");
  function search(q) { if (!q || q.length < 3) { setHits([]); return; } lastQuery.current = q; if (abort.current) { try { abort.current.abort(); } catch { } } abort.current = new AbortController(); setLoading(true); fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&bbox=-141,41.7,-52.6,83.1&lang=en`, { signal: abort.current.signal }).then(r => r.json()).then(data => { setHits((data.features || []).filter(f => f.properties && f.properties.countrycode === "CA")); setLoading(false); }).catch(e => { if (e.name !== "AbortError") setHits([]); setLoading(false); }); }
  function pick(h) { const p = h.properties || {}; const road = p.street || p.name || ""; let hn = p.housenumber || ""; if (!hn) { const m = lastQuery.current.match(/^(\d+[A-Za-z]?)\s/); if (m) hn = m[1]; } const sf = [hn, road].filter(Boolean).join(" ") || lastQuery.current.split(",")[0].trim(); setRaw(sf); setHits([]); onChange({ street: sf, city: p.city || p.town || p.village || p.hamlet || p.municipality || p.county || "", province: p.state || "", postal: (p.postcode || "").toUpperCase() }); }
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input value={raw} onChange={e => { const v = e.target.value; setRaw(v); onChange({ ...(value || {}), street: v }); clearTimeout(timer.current); timer.current = setTimeout(() => search(v), 420); }} onBlur={() => setTimeout(() => setHits([]), 180)} placeholder="e.g. 123 Main Street, Ottawa" style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 15, fontFamily: "inherit", background: "#fafafa", color: "#1a1a1a" }} />
        {loading && <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#aaa" }}>...</span>}
      </div>
      {hits.length > 0 && <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1.5px solid #1a6b3a", borderTop: "none", borderRadius: "0 0 10px 10px", zIndex: 400, maxHeight: 260, overflowY: "auto", boxShadow: "0 8px 28px rgba(0,0,0,0.13)" }}>{hits.map((h, i) => { const p = h.properties || {}; const road = p.street || p.name || ""; let hn = p.housenumber || ""; if (!hn) { const m = lastQuery.current.match(/^(\d+[A-Za-z]?)\s/); if (m) hn = m[1]; } const sl = [hn, road].filter(Boolean).join(" ") || road || "-"; const cl = [p.city || p.town || p.village, p.state, p.postcode].filter(Boolean).join(", "); return <div key={i} onMouseDown={e => { e.preventDefault(); pick(h); }} style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer", borderBottom: "1px solid #f0ede6" }} onMouseEnter={e => e.currentTarget.style.background = "#f0faf4"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}><div style={{ fontWeight: 600 }}>{sl}</div><div style={{ color: "#999", fontSize: 12 }}>{cl}</div></div>; })}</div>}
    </div>
  );
}
function PhoneInput({ value, onChange, placeholder }) { const [err, setErr] = useState(""); return <div><input value={fmtPhone(value)} onChange={e => { const c = cleanPhone(e.target.value); onChange(c); setErr(c && c.length < 10 ? "Must be 10 digits" : ""); }} placeholder={placeholder || "(613) 000-0000"} style={{ width: "100%", padding: "10px 13px", border: `1.5px solid ${err ? "#e74c3c" : "#ddd"}`, borderRadius: 8, fontSize: 15, fontFamily: "inherit", background: "#fafafa", color: "#1a1a1a" }} />{err && <div style={{ fontSize: 11, color: "#e74c3c", marginTop: 2 }}>{err}</div>}</div>; }
function EmailInput({ value, onChange, placeholder }) { const [err, setErr] = useState(""); return <div><input value={value} type="email" onChange={e => { onChange(e.target.value); setErr(e.target.value && !validEmail(e.target.value) ? "Invalid email" : ""); }} placeholder={placeholder || "email@example.com"} style={{ width: "100%", padding: "10px 13px", border: `1.5px solid ${err ? "#e74c3c" : "#ddd"}`, borderRadius: 8, fontSize: 15, fontFamily: "inherit", background: "#fafafa", color: "#1a1a1a" }} />{err && <div style={{ fontSize: 11, color: "#e74c3c", marginTop: 2 }}>{err}</div>}</div>; }
function MoneyInput({ value, onChange, placeholder, autoFocus = false }) { return <input type="text" inputMode="decimal" value={value} onChange={e => onChange(sanitizeMoneyInput(e.target.value))} placeholder={placeholder} autoFocus={autoFocus} style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 15, fontFamily: "inherit", background: "#fafafa", color: "#1a1a1a" }} />; }

function ReceiptView({ person, enrollment, payment, receiptNum, semesterLabel, onClose }) {
  const bal = enrollBalance(enrollment); const isCredit = bal < 0;
  function doEmail() {
    const re = person && person.age >= 18 ? (person.email || "") : (person && (person.parent1Email || person.parent2Email || ""));
    const rn = person && person.age >= 18 ? `${person.firstName} ${person.lastName}` : (person && person.parent1First ? `${person.parent1First} ${person.parent1Last || ""}` : "Parent");
    const subject = `Tarteel Receipt #${receiptNum} - ${person ? `${person.firstName} ${person.lastName}` : ""}`;
    const body = [`Dear ${rn},`, "", "Please find your payment receipt below.", "", SCHOOL_NAME, SCHOOL_ADDRESS, "", `Receipt #${receiptNum}`, `Issued: ${fmtDate(today())}`, "", `Student #: ${(person && person.studentNum) || "-"}`, `Student: ${person ? `${person.firstName} ${person.lastName}` : "-"}`, person && person.dateOfBirth ? `Date of Birth: ${fmtDob(person.dateOfBirth)}` : "", `Program: ${PROGRAMS[enrollment.program] || ""}`, `Teacher: ${enrollment.teacherName || "-"}`, `Semester: ${semesterLabel}`, `Payment Date: ${fmtDate(payment && payment.date)}`, `Method: ${(payment && payment.method) || "-"}`, `Amount Paid: $${Number((payment && payment.amount) || 0).toFixed(2)}`, (payment && payment.note) ? `Note: ${payment.note}` : "", "", `Semester Total: $${(enrollment.semesterTotal || 0).toFixed(2)}`, `Balance: $${Math.abs(bal).toFixed(2)}${isCredit ? " (credit)" : ""}`, "", SCHOOL_NAME, SCHOOL_ADDRESS, "tarteel.ca", "", "Jazakum Allahu Khairan"].filter(l => l !== undefined).join("\n");
    window.location.href = `mailto:${re}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  const rows = [["Student #", (person && person.studentNum) || "-"], ["Student", person ? `${person.firstName} ${person.lastName}` : "-"]];
  if (person && person.dateOfBirth) rows.push(["Date of Birth", fmtDob(person.dateOfBirth)]);
  rows.push(...[["Program", PROGRAMS[enrollment.program] || ""], ["Teacher", enrollment.teacherName || "-"], ["Level", enrollment.levelName || "-"], ["Semester", semesterLabel], ["Payment Date", fmtDate(payment && payment.date)], ["Method", (payment && payment.method) || "-"], ["Amount Paid", `$${Number((payment && payment.amount) || 0).toFixed(2)}`]]);
  if (payment && payment.note) rows.push(["Note", payment.note]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 16 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 14, width: 600, maxWidth: "98vw", maxHeight: "94vh", overflowY: "auto", padding: "28px 24px", boxShadow: "0 24px 64px rgba(0,0,0,0.25)", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "3px solid #1a6b3a", paddingBottom: 14, marginBottom: 20 }}>
          <img src={LOGO_URL} alt="Tarteel" style={{ width: 54, height: 54, objectFit: "contain" }} />
          <div><div style={{ fontSize: 18, fontWeight: 700, color: "#1a6b3a" }}>TARTEEL</div><div style={{ fontSize: 11, color: "#888" }}>Ottawa Quran Institute</div><div style={{ fontSize: 11, color: "#aaa" }}>{SCHOOL_ADDRESS}</div></div>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, textAlign: "center", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Payment Receipt</div>
        <div style={{ fontSize: 12, color: "#aaa", textAlign: "center", marginBottom: 20 }}>{`Receipt #${receiptNum} — Issued ${fmtDate(today())}`}</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
          <tbody>
            {rows.map((row, i) => <tr key={i}><td style={{ padding: "7px 8px", fontSize: 12, color: "#888", width: "44%", borderBottom: "1px solid #f0ede6" }}>{row[0]}</td><td style={{ padding: "7px 8px", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #f0ede6" }}>{row[1]}</td></tr>)}
            <tr><td style={{ padding: "10px 8px", fontSize: 14, fontWeight: 700, borderTop: "2px solid #1a6b3a" }}>Semester Total</td><td style={{ padding: "10px 8px", fontSize: 14, fontWeight: 700, borderTop: "2px solid #1a6b3a" }}>{`$${(enrollment.semesterTotal || 0).toFixed(2)}`}</td></tr>
            <tr><td style={{ padding: "7px 8px", fontSize: 14, fontWeight: 700 }}>Balance</td><td style={{ padding: "7px 8px" }}><span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: bal > 0 ? "#fdecea" : "#e8f5ee", color: bal > 0 ? "#c0392b" : "#1a6b3a" }}>{`$${Math.abs(bal).toFixed(2)}${isCredit ? " (credit)" : ""}`}</span></td></tr>
          </tbody>
        </table>
        <div style={{ textAlign: "center", fontSize: 10, color: "#ccc", borderTop: "1px solid #eee", paddingTop: 12, marginBottom: 18 }}>{`${SCHOOL_NAME} — tarteel.ca`}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn bp" style={{ fontSize: 13, padding: "9px 18px" }} onClick={() => window.print()}>Print / PDF</button>
          <button className="btn bo" style={{ fontSize: 13, padding: "9px 18px" }} onClick={doEmail}>Email</button>
          <button className="btn bg" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const INIT_FORM = { mode: "new", searchQuery: "", matchSuggestions: [], editingEnrollId: null, linkedPersonId: null, firstName: "", lastName: "", age: "", dateOfBirth: "", gender: "", phone: "", email: "", address: { street: "", city: "", province: "", postal: "" }, notes: "", parent1First: "", parent1Last: "", parent1Phone: "", parent1Email: "", parent2First: "", parent2Last: "", parent2Phone: "", parent2Email: "", twoParents: "yes", mainContact: "parent1", emergencyFirst: "", emergencyLast: "", emergencyPhone: "", emergencyRelationship: "", hasAllergy: "", allergyNote: "", photo: null, familyId: null, program: "juniors", level: "", levelName: "", teacherId: "", teacherName: "", monthlyRate: 0, paymentType: "full", paymentMethod: "Cash", paymentDate: today(), paymentNote: "", waiverType: "Scholarship", discountedAmount: "", instalmentPaid: "", instalmentMethod: "Cash", instalmentDate: today() };

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() { await supabase.auth.signOut(); setSession(null); }

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [view, setView] = useState("dashboard");
  const [activeProg, setActiveProg] = useState("juniors");
  const [persons, setPersons] = useState([]);
  const [families, setFamilies] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [semesterLabel, setSemesterLabel] = useState(() => readStoredString(STORAGE_KEYS.semesterLabel, DEFAULT_SEMESTER_LABEL));
  const [semesterMonths, setSemesterMonths] = useState(() => readStoredNumber(STORAGE_KEYS.semesterMonths, SEMESTER_MONTHS_DEFAULT));
  const [juniorTeachers, setJuniorTeachers] = useState(() => readStoredJson(STORAGE_KEYS.juniorTeachers, DEFAULT_JUNIOR_TEACHERS));
  const [adultTeachers, setAdultTeachers] = useState(() => readStoredJson(STORAGE_KEYS.adultTeachers, DEFAULT_ADULT_TEACHERS));
  const [adultLevels, setAdultLevels] = useState(() => readStoredJson(STORAGE_KEYS.adultLevels, DEFAULT_ADULT_LEVELS));
  const [form, setForm] = useState(INIT_FORM);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [editPaymentModal, setEditPaymentModal] = useState(null);
  const [editPaymentForm, setEditPaymentForm] = useState({ amount: "", date: "", method: "Cash", note: "" });
  const [instalment, setInstalment] = useState({ amount: "", method: "Cash", date: today(), note: "" });
  const [customBal, setCustomBal] = useState("");
  const [receiptModal, setReceiptModal] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [teacherForm, setTeacherForm] = useState({ program: "juniors", name: "", levels: [], monthlyRate: "" });
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherMsg, setTeacherMsg] = useState("");
  const [newLevelInput, setNewLevelInput] = useState({ brothers: "", sisters: "" });
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupProgramFilter, setLookupProgramFilter] = useState("");
  const [lookupLevelFilter, setLookupLevelFilter] = useState("");
  const [lookupGenderFilter, setLookupGenderFilter] = useState("");
  const [lookupTeacherFilter, setLookupTeacherFilter] = useState("");
  const [lookupResults, setLookupResults] = useState([]);
  const videoRef = useRef(null); const streamRef = useRef(null);

  useEffect(() => {
    if (!session) return;
    async function loadData() {
      setLoading(true); setDbError(null);
      try {
        const [{ data: p, error: pe }, { data: f, error: fe }, { data: e, error: ee }] = await Promise.all([supabase.from("persons").select("*").order("created_at", { ascending: true }), supabase.from("families").select("*").order("created_at", { ascending: true }), supabase.from("enrollments").select("*").order("created_at", { ascending: true })]);
        if (pe) throw pe; if (fe) throw fe; if (ee) throw ee;
        setPersons((p || []).map(mapPersonFromDb)); setFamilies((f || []).map(mapFamilyFromDb)); setEnrollments((e || []).map(mapEnrollmentFromDb));
        const nums = (p || []).map(x => parseInt((x.student_num || "").replace("T-", ""))).filter(n => !isNaN(n));
        if (nums.length) studentCounter = Math.max(...nums);
        const [{ data: tRows, error: tErr }, { data: lRows, error: lErr }] = await Promise.all([supabase.from("teachers").select("*").order("created_at", { ascending: true }), supabase.from("program_levels").select("*").order("position", { ascending: true })]);
        if (!tErr) { const ts = buildTeacherState(tRows || []); setJuniorTeachers(ts.juniors); setAdultTeachers(ts.adults); }
        if (!lErr) setAdultLevels(buildAdultLevelsState(lRows || []));
      } catch (err) { setDbError("Could not connect to database. Check your Supabase credentials."); }
      setLoading(false);
    }
    loadData();
  }, [session]);

  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.semesterLabel, semesterLabel); }, [semesterLabel]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.semesterMonths, String(semesterMonths)); }, [semesterMonths]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.juniorTeachers, JSON.stringify(juniorTeachers)); }, [juniorTeachers]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.adultTeachers, JSON.stringify(adultTeachers)); }, [adultTeachers]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.adultLevels, JSON.stringify(adultLevels)); }, [adultLevels]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const age = parseInt(form.age) || 0;
  const isMinor = age > 0 && age < 18;
  const isAdult = age >= 18;
  const isJunior = form.program === "juniors";
  const editingEnrollment = form.editingEnrollId ? enrollments.find(e => e.id === form.editingEnrollId) : null;
  const editingPaymentCount = editingEnrollment ? (editingEnrollment.paymentHistory || []).length : 0;
  const currentAdultTeachers = adultTeachers[form.program] || [];
  const eligibleTeachers = isJunior && form.level !== "" ? juniorTeachers.filter(t => t.levels.includes(parseInt(form.level))) : isJunior ? [] : currentAdultTeachers;

  // Auto-fill age from DOB when DOB is entered
  function handleDobChange(dob) {
    f("dateOfBirth", dob);
    if (dob) {
      const calculatedAge = calcAgeFromDob(dob);
      if (calculatedAge !== null) f("age", String(calculatedAge));
    }
  }

  useEffect(() => {
    if (form.editingEnrollId || form.linkedPersonId) return;
    if (form.program !== "juniors") { f("matchSuggestions", []); return; }
    const rawQ = [form.parent1Phone, form.parent1Email, form.parent2Phone, form.parent2Email].filter(v => v && v.length > 5);
    if (!rawQ.length) { f("matchSuggestions", []); return; }
    const queries = rawQ.map(s => s.replace(/\D/g, "") || s.toLowerCase());
    f("matchSuggestions", persons.filter(p => { if (p.id === form.personId) return false; const fields = [p.parent1Phone, p.parent1Email, p.parent2Phone, p.parent2Email].filter(Boolean).map(s => s.replace(/\D/g, "") || s.toLowerCase()); return fields.some(fld => queries.some(q => q.length > 4 && fld.includes(q))); }).slice(0, 3));
  }, [form.parent1Phone, form.parent1Email, form.parent2Phone, form.parent2Email, form.program]);

  function linkPerson(p) { const fam = families.find(fm => fm.personIds && fm.personIds.includes(p.id)); setForm(prev => ({ ...prev, linkedPersonId: null, familyId: fam ? fam.id : null, parent1First: prev.parent1First || p.parent1First || "", parent1Last: prev.parent1Last || p.parent1Last || "", parent1Phone: prev.parent1Phone || p.parent1Phone || "", parent1Email: prev.parent1Email || p.parent1Email || "", parent2First: prev.parent2First || p.parent2First || "", parent2Last: prev.parent2Last || p.parent2Last || "", parent2Phone: prev.parent2Phone || p.parent2Phone || "", parent2Email: prev.parent2Email || p.parent2Email || "", address: prev.address && prev.address.street ? prev.address : (p.address || { street: "", city: "", province: "", postal: "" }), matchSuggestions: [] })); }
  function autoFill(p) { const fam = families.find(fm => fm.personIds && fm.personIds.includes(p.id)); setForm(prev => ({ ...prev, linkedPersonId: p.id, familyId: fam ? fam.id : null, firstName: p.firstName, lastName: p.lastName, age: String(p.age), dateOfBirth: p.dateOfBirth || "", gender: p.gender || "", phone: p.phone || "", email: p.email || "", address: p.address || { street: "", city: "", province: "", postal: "" }, notes: p.notes || "", parent1First: p.parent1First || "", parent1Last: p.parent1Last || "", parent1Phone: p.parent1Phone || "", parent1Email: p.parent1Email || "", parent2First: p.parent2First || "", parent2Last: p.parent2Last || "", parent2Phone: p.parent2Phone || "", parent2Email: p.parent2Email || "", twoParents: p.twoParents || "yes", mainContact: p.mainContact || "parent1", emergencyFirst: p.emergencyFirst || "", emergencyLast: p.emergencyLast || "", emergencyPhone: p.emergencyPhone || "", emergencyRelationship: p.emergencyRelationship || "", hasAllergy: p.hasAllergy === true ? "yes" : p.hasAllergy === false ? "no" : "", allergyNote: p.allergyNote || "", photo: p.photo || null, matchSuggestions: [] })); }
  function handleSearch(q) { f("searchQuery", q); if (!q.trim()) { f("matchSuggestions", []); return; } const ql = q.toLowerCase(); f("matchSuggestions", persons.filter(p => (p.firstName + " " + p.lastName).toLowerCase().includes(ql) || (p.parent1First + " " + p.parent1Last).toLowerCase().includes(ql) || (p.parent2First + " " + p.parent2Last).toLowerCase().includes(ql)).slice(0, 6)); }

  function getEnrollmentLookupLevelValue(e) { if (!e) return ""; if (e.program === "juniors") return `juniors:${e.level}`; return `${e.program}:${e.levelName || ""}`; }
  function getEnrollmentLookupLabel(e) { return `${PROGRAMS[e.program]} · ${e.program === "juniors" ? (JUNIOR_LEVELS[e.level] || "-") : (e.levelName || "-")}${e.teacherName ? ` · ${e.teacherName}` : ""}`; }
  function runLookup(query, pf, lf, gf, tf) {
    const ql = (query || "").toLowerCase().replace(/[\s\-(). ]/g, "");
    if (!ql && !pf && !lf && !gf && !tf) { setLookupResults([]); return; }
    setLookupResults(persons.filter(p => {
      const pes = enrollments.filter(e => e.personId === p.id && e.active);
      if (pf && !pes.some(e => e.program === pf)) return false;
      if (lf && !pes.some(e => getEnrollmentLookupLevelValue(e) === lf)) return false;
      if (gf && p.gender !== gf) return false;
      if (tf && !pes.some(e => e.teacherId === tf)) return false;
      if (!ql) return true;
      const fields = [p.phone, p.email, p.parent1Phone, p.parent1Email, p.parent2Phone, p.parent2Email, p.firstName + p.lastName, p.parent1First + p.parent1Last, p.parent2First + p.parent2Last].map(x => (x || "").toLowerCase().replace(/[\s\-(). ]/g, ""));
      return fields.some(fd => fd.includes(ql));
    }));
  }
  function handleLookup(q) { setLookupQuery(q); runLookup(q, lookupProgramFilter, lookupLevelFilter, lookupGenderFilter, lookupTeacherFilter); }
  function handleLookupProgramFilter(pf) { setLookupProgramFilter(pf); const nl = pf === lookupProgramFilter ? lookupLevelFilter : ""; const nt = pf === lookupProgramFilter ? lookupTeacherFilter : ""; if (pf !== lookupProgramFilter) { setLookupLevelFilter(""); setLookupTeacherFilter(""); } runLookup(lookupQuery, pf, nl, lookupGenderFilter, nt); }
  function handleLookupLevelFilter(lf) { setLookupLevelFilter(lf); runLookup(lookupQuery, lookupProgramFilter, lf, lookupGenderFilter, lookupTeacherFilter); }
  function handleLookupGenderFilter(gf) { setLookupGenderFilter(gf); runLookup(lookupQuery, lookupProgramFilter, lookupLevelFilter, gf, lookupTeacherFilter); }
  function handleLookupTeacherFilter(tf) { setLookupTeacherFilter(tf); runLookup(lookupQuery, lookupProgramFilter, lookupLevelFilter, lookupGenderFilter, tf); }

  function printLookupResults() {
    const popup = window.open("", "_blank", "width=960,height=1200"); if (!popup) { alert("Please allow pop-ups to print."); return; }
    const filters = [lookupQuery ? `Search: ${lookupQuery}` : null, lookupProgramFilter ? `Program: ${PROGRAMS[lookupProgramFilter]}` : null, lookupGenderFilter ? `Gender: ${lookupGenderFilter}` : null].filter(Boolean);
    const cards = lookupResults.map(person => {
      const pes = enrollments.filter(e => e.personId === person.id && e.active);
      return `<section class="card"><div class="title">${escapeHtml(`${person.firstName} ${person.lastName}`)} <span class="student-num">${escapeHtml(person.studentNum || "-")}</span></div><div class="meta">${escapeHtml(`${person.gender || "-"} · Age ${person.age || "-"}${person.dateOfBirth ? " · DOB: " + fmtDob(person.dateOfBirth) : ""}`)}</div><div class="meta">${escapeHtml(person.phone ? fmtPhone(person.phone) : "")}</div><div class="meta">${escapeHtml(person.email || "")}</div>${(person.parent1Phone || person.parent1Email) ? `<div class="meta">${escapeHtml(`${[person.parent1First, person.parent1Last].filter(Boolean).join(" ")}${person.parent1Phone ? ` · ${fmtPhone(person.parent1Phone)}` : ""}${person.parent1Email ? ` · ${person.parent1Email}` : ""}`)}</div>` : ""}<div class="enrollments">${pes.map(e => `<div class="tag">${escapeHtml(getEnrollmentLookupLabel(e))}</div>`).join("")}</div></section>`;
    }).join("");
    popup.document.write(`<!doctype html><html><head><title>Lookup Results</title><meta charset="utf-8"/><style>body{font-family:Arial,sans-serif;margin:32px;color:#222}h1{margin:0 0 6px;font-size:28px}.sub{color:#666;margin-bottom:18px}.filters{margin:0 0 22px;padding:12px 14px;background:#f7f5ef;border-radius:10px;font-size:14px}.count{font-weight:700;margin-bottom:18px}.card{border:1px solid #ddd;border-radius:12px;padding:16px;margin-bottom:12px;break-inside:avoid}.title{font-size:18px;font-weight:700;margin-bottom:6px}.student-num{font-size:12px;font-weight:700;color:#666;margin-left:8px}.meta{font-size:13px;color:#666;margin-bottom:4px}.enrollments{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}.tag{font-size:12px;padding:4px 8px;background:#eef6f1;border-radius:999px;color:#1a6b3a}@media print{body{margin:20px}}</style></head><body><h1>Lookup Results</h1><div class="sub">${escapeHtml(fmtDate(today()))}</div><div class="filters">${escapeHtml(filters.length ? filters.join(" | ") : "No filters applied")}</div><div class="count">${lookupResults.length} ${lookupResults.length === 1 ? "student" : "students"} found</div>${cards || "<div>No results.</div>"}<script>window.onload=()=>window.print();<\/script></body></html>`);
    popup.document.close();
  }

  function openEditEnrollment(enrollment) {
    const person = persons.find(p => p.id === enrollment.personId); if (!person) return;
    const firstPayment = (enrollment.paymentHistory || [])[0];
    setForm({ ...INIT_FORM, mode: "existing", editingEnrollId: enrollment.id, linkedPersonId: person.id, firstName: person.firstName, lastName: person.lastName, age: String(person.age), dateOfBirth: person.dateOfBirth || "", gender: person.gender || "", phone: person.phone || "", email: person.email || "", address: person.address || { street: "", city: "", province: "", postal: "" }, notes: person.notes || "", parent1First: person.parent1First || "", parent1Last: person.parent1Last || "", parent1Phone: person.parent1Phone || "", parent1Email: person.parent1Email || "", parent2First: person.parent2First || "", parent2Last: person.parent2Last || "", parent2Phone: person.parent2Phone || "", parent2Email: person.parent2Email || "", twoParents: person.twoParents || "yes", mainContact: person.mainContact || "parent1", emergencyFirst: person.emergencyFirst || "", emergencyLast: person.emergencyLast || "", emergencyPhone: person.emergencyPhone || "", emergencyRelationship: person.emergencyRelationship || "", hasAllergy: person.hasAllergy === true ? "yes" : person.hasAllergy === false ? "no" : "", allergyNote: person.allergyNote || "", photo: person.photo || null, program: enrollment.program, level: String(enrollment.level != null ? enrollment.level : ""), levelName: enrollment.levelName || "", teacherId: enrollment.teacherId, teacherName: enrollment.teacherName, monthlyRate: enrollment.monthlyRate || 0, paymentType: enrollment.paymentType, paymentMethod: enrollment.paymentMethod || firstPayment?.method || "Cash", waiverType: enrollment.waiverType || "Scholarship", discountedAmount: enrollment.discountedAmount ? String(enrollment.discountedAmount) : "", instalmentMethod: firstPayment?.method || "Cash" });
    setView("enroll");
  }
  function startCamera() { navigator.mediaDevices.getUserMedia({ video: true }).then(s => { streamRef.current = s; if (videoRef.current) videoRef.current.srcObject = s; setCameraActive(true); }).catch(() => alert("Camera unavailable.")); }
  function capturePhoto() { const c = document.createElement("canvas"); c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight; c.getContext("2d").drawImage(videoRef.current, 0, 0); f("photo", c.toDataURL("image/jpeg")); stopCamera(); }
  function stopCamera() { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); setCameraActive(false); }

  function validate() {
    if (!form.firstName || !form.lastName || !form.age) return "Student name and age are required.";
    if (!form.gender) return "Please select a gender.";
    if (form.program === "brothers" && form.gender !== "Male") return "Tarteel Brothers is for male students only.";
    if (form.program === "sisters" && form.gender !== "Female") return "Tarteel Sisters is for female students only.";
    if ((form.program === "brothers" || form.program === "sisters") && parseInt(form.age) < 18) return "Brothers and Sisters programs are for adults (18+).";
    if (form.program === "juniors") { const a = parseInt(form.age); if (a < 6) return "Juniors must be at least 6 years old."; }
    if (form.hasAllergy === "") return "Please answer the medical/allergy question.";
    if (isAdult) { if (!form.phone) return "Phone is required for adult students."; if (form.phone.length < 10) return "Phone must be 10 digits."; if (!form.email) return "Email is required."; if (!validEmail(form.email)) return "Please enter a valid email."; }
    if (isMinor) { if (!form.parent1First || !form.parent1Last) return "Parent 1 name is required."; if (!form.parent1Phone && !form.parent1Email) return "Parent 1 phone or email is required."; if (form.parent1Phone && form.parent1Phone.length < 10) return "Parent 1 phone must be 10 digits."; if (form.twoParents === "no" && (!form.emergencyFirst || !form.emergencyLast)) return "Emergency contact name required."; }
    if (!form.teacherId) return "Please select a teacher.";
    if (isJunior && form.level === "") return "Please select a level.";
    return null;
  }

  async function submitEnrollment() {
    const err = validate(); if (err) { alert(err); return; }
    setSaving(true);
    try {
      const personId = form.editingEnrollId ? (persons.find(p => p.id === form.linkedPersonId) ? form.linkedPersonId : uid()) : (form.linkedPersonId || uid());
      const personData = { id: personId, studentNum: (persons.find(p => p.id === personId) || {}).studentNum || nextStudentNum(), firstName: form.firstName, lastName: form.lastName, age: parseInt(form.age), dateOfBirth: form.dateOfBirth || null, gender: form.gender, phone: form.phone, email: form.email, address: form.address, notes: form.notes, parent1First: form.parent1First, parent1Last: form.parent1Last, parent1Phone: form.parent1Phone, parent1Email: form.parent1Email, parent2First: form.parent2First, parent2Last: form.parent2Last, parent2Phone: form.parent2Phone, parent2Email: form.parent2Email, twoParents: form.twoParents, mainContact: isAdult ? "self" : form.mainContact, emergencyFirst: form.emergencyFirst, emergencyLast: form.emergencyLast, emergencyPhone: form.emergencyPhone, emergencyRelationship: form.emergencyRelationship, hasAllergy: form.hasAllergy === "yes", allergyNote: form.allergyNote, photo: form.photo };
      const { error: personErr } = await supabase.from("persons").upsert(mapPersonToDb(personData));
      if (personErr) throw personErr;
      setPersons(prev => { const idx = prev.findIndex(p => p.id === personId); if (idx >= 0) { const u = prev.slice(); u[idx] = personData; return u; } return [...prev, personData]; });

      if (form.program === "juniors") {
        const famPhone = form.parent1Phone || form.parent2Phone || ""; const famEmail = form.parent1Email || form.parent2Email || "";
        const famName = [form.parent1First, form.parent1Last].filter(Boolean).join(" ") || `${form.firstName}'s Family`;
        let familyId = form.familyId; let familyData;
        const existingFamily = families.find(fm => fm.id === familyId || (famPhone && fm.phone && fm.phone === famPhone) || (famEmail && fm.email && fm.email === famEmail));
        if (existingFamily) { familyId = existingFamily.id; familyData = { ...existingFamily, personIds: [...new Set([...(existingFamily.personIds || []), personId])] }; }
        else { familyId = uid(); familyData = { id: familyId, name: famName, phone: famPhone, email: famEmail, personIds: [personId] }; }
        setFamilies(prev => { const idx = prev.findIndex(fm => fm.id === familyId); if (idx >= 0) { const u = prev.slice(); u[idx] = familyData; return u; } return [...prev, familyData]; });
        const { error: familyErr } = await supabase.from("families").upsert(mapFamilyToDb(familyData));
        if (familyErr) throw familyErr;
      }

      if (form.editingEnrollId) {
        const updatedEnroll = enrollments.find(e => e.id === form.editingEnrollId);
        if (updatedEnroll) {
          let paymentHistory = updatedEnroll.paymentHistory || []; let paymentMethod = updatedEnroll.paymentMethod;
          if (updatedEnroll.paymentType === "full" || updatedEnroll.paymentType === "discounted") { paymentMethod = form.paymentMethod; paymentHistory = paymentHistory.map((h, i) => i === 0 ? { ...h, method: form.paymentMethod } : h); }
          else if ((updatedEnroll.paymentType === "instalment" || updatedEnroll.paymentType === "partial") && paymentHistory.length <= 1) { paymentMethod = form.instalmentMethod; paymentHistory = paymentHistory.map((h, i) => i === 0 ? { ...h, method: form.instalmentMethod } : h); }
          const newE = { ...updatedEnroll, teacherId: form.teacherId, teacherName: form.teacherName, level: form.level, levelName: form.levelName, monthlyRate: form.monthlyRate || 0, paymentMethod, paymentHistory };
          const { error: eErr } = await supabase.from("enrollments").upsert(mapEnrollmentToDb(newE));
          if (eErr) throw eErr;
          setEnrollments(prev => prev.map(e => e.id === form.editingEnrollId ? newE : e));
        }
        setForm(INIT_FORM); setView("dashboard"); setSaving(false); return;
      }

      const initPaid = Math.round((parseFloat(form.instalmentPaid) || 0) * 100) / 100;
      const discAmt = Math.round((parseFloat(form.discountedAmount) || 0) * 100) / 100;
      const baseSemTotal = isJunior ? getJuniorBaseRate(1) : (form.monthlyRate || 0) * semesterMonths;
      const semTotal = form.paymentType === "discounted" ? discAmt : baseSemTotal;
      const isIrmInstallment = form.paymentType === "instalment" && form.instalmentMethod === "IRM Online";
      const amountPaid = (form.paymentType === "full" || form.paymentType === "waived" || form.paymentType === "discounted") ? semTotal : (form.paymentType === "instalment" || form.paymentType === "partial") ? initPaid : 0;
      const effectiveAmountPaid = isIrmInstallment ? semTotal : amountPaid;
      const history = [];
      if (form.paymentType === "full") history.push({ id: uid(), date: form.paymentDate, amount: semTotal, method: form.paymentMethod, note: form.paymentNote || "Paid in Full", type: "full" });
      else if (form.paymentType === "discounted" && discAmt > 0) history.push({ id: uid(), date: form.paymentDate, amount: discAmt, method: form.paymentMethod, note: form.paymentNote || "Discounted total paid", type: "discounted" });
      else if ((form.paymentType === "instalment" || form.paymentType === "partial") && initPaid > 0) history.push({ id: uid(), date: form.instalmentDate, amount: initPaid, method: form.instalmentMethod, note: form.paymentNote || (form.paymentType === "partial" ? "Partial payment" : "Initial instalment"), type: form.paymentType });
      else if (form.paymentType === "waived") history.push({ id: uid(), date: form.paymentDate, amount: 0, method: "-", note: form.paymentNote || `Waived — ${form.waiverType}`, type: "waived" });
      const enrollData = { id: uid(), personId, program: form.program, level: form.level, levelName: form.levelName, teacherId: form.teacherId, teacherName: form.teacherName, monthlyRate: form.monthlyRate || 0, semesterTotal: semTotal, amountPaid: effectiveAmountPaid, paymentType: form.paymentType, paymentMethod: form.paymentMethod, waiverType: form.waiverType, discountedAmount: discAmt, paymentHistory: history, active: true, semesterLabel };
      const { error: enrollErr } = await supabase.from("enrollments").upsert(mapEnrollmentToDb(enrollData));
      if (enrollErr) throw enrollErr;
      setEnrollments(prev => [...prev, enrollData]);
      setForm(INIT_FORM); setView("dashboard");
    } catch (err) { alert("Error saving: " + (err.message || JSON.stringify(err))); }
    setSaving(false);
  }

  async function addPayment() {
    const amt = Math.round(parseFloat(instalment.amount) * 100) / 100; if (!amt || amt <= 0) { alert("Enter a valid amount."); return; }
    setSaving(true);
    const entry = { id: uid(), date: instalment.date, amount: amt, method: instalment.method, note: instalment.note, type: "instalment" };
    let updatedEnroll = null;
    const newEnrollments = enrollments.map(e => { if (e.id !== paymentModal.enrollmentId) return e; const irmPaid = e.paymentType === "instalment" && instalment.method === "IRM Online"; const rawPaid = irmPaid ? (e.semesterTotal || 0) : customBal !== "" ? (e.semesterTotal - parseFloat(customBal)) : (e.amountPaid || 0) + amt; updatedEnroll = { ...e, amountPaid: Math.round(rawPaid * 100) / 100, paymentHistory: [...(e.paymentHistory || []), entry] }; return updatedEnroll; });
    try { if (updatedEnroll) { const { error } = await supabase.from("enrollments").upsert(mapEnrollmentToDb(updatedEnroll)); if (error) throw error; setEnrollments(newEnrollments); const person = persons.find(p => p.id === updatedEnroll.personId); setReceiptModal({ person, enrollment: updatedEnroll, payment: entry, receiptNum: nextReceiptNum(person) }); } } catch (err) { alert("Error saving payment: " + (err.message || JSON.stringify(err))); }
    setInstalment({ amount: "", method: "Cash", date: today(), note: "" }); setCustomBal(""); setPaymentModal(null); setSaving(false);
  }

  function openEditPayment(enrollmentId, payment) { setEditPaymentModal({ enrollmentId, paymentId: payment.id }); setEditPaymentForm({ amount: String(payment.amount), date: payment.date, method: payment.method, note: payment.note || "" }); }
  async function saveEditedPayment() {
    const newAmt = Math.round(parseFloat(editPaymentForm.amount) * 100) / 100; if (isNaN(newAmt) || newAmt < 0) { alert("Enter a valid amount."); return; }
    setSaving(true); let updatedEnroll = null;
    const newEnrollments = enrollments.map(e => { if (e.id !== editPaymentModal.enrollmentId) return e; const newHistory = (e.paymentHistory || []).map(h => h.id !== editPaymentModal.paymentId ? h : { ...h, amount: newAmt, date: editPaymentForm.date, method: editPaymentForm.method, note: editPaymentForm.note }); const discPay = e.paymentType === "discounted" ? newHistory.find(h => h.type === "discounted") : null; const newSemTotal = discPay ? Math.round((discPay.amount || 0) * 100) / 100 : e.semesterTotal; const irmPaid = e.paymentType === "instalment" && newHistory.some(h => h.type === "instalment" && h.method === "IRM Online"); const newAmtPaid = (e.paymentType === "full" || e.paymentType === "waived" || e.paymentType === "discounted" || irmPaid) ? newSemTotal : Math.round(newHistory.reduce((a, h) => a + (h.amount || 0), 0) * 100) / 100; updatedEnroll = { ...e, paymentHistory: newHistory, semesterTotal: newSemTotal, discountedAmount: discPay ? newSemTotal : e.discountedAmount, amountPaid: newAmtPaid }; return updatedEnroll; });
    try { if (updatedEnroll) { const { error } = await supabase.from("enrollments").upsert(mapEnrollmentToDb(updatedEnroll)); if (error) throw error; } setEnrollments(newEnrollments); } catch (err) { alert("Error saving: " + (err.message || JSON.stringify(err))); }
    setEditPaymentModal(null); setSaving(false);
  }
  async function deletePayment(enrollmentId, paymentId) {
    if (!window.confirm("Delete this payment entry?")) return; setSaving(true); let updatedEnroll = null;
    const newEnrollments = enrollments.map(e => { if (e.id !== enrollmentId) return e; const newHistory = (e.paymentHistory || []).filter(h => h.id !== paymentId); const newAmtPaid = (e.paymentType === "full" || e.paymentType === "waived") ? e.semesterTotal : Math.round(newHistory.reduce((a, h) => a + (h.amount || 0), 0) * 100) / 100; updatedEnroll = { ...e, paymentHistory: newHistory, amountPaid: newAmtPaid }; return updatedEnroll; });
    try { if (updatedEnroll) { const { error } = await supabase.from("enrollments").upsert(mapEnrollmentToDb(updatedEnroll)); if (error) throw error; } setEnrollments(newEnrollments); } catch (err) { alert("Error deleting: " + (err.message || JSON.stringify(err))); }
    setSaving(false);
  }
  async function deleteEnrollment(enrollmentId) {
    if (!window.confirm("Delete this enrollment? This cannot be undone.")) return; setSaving(true);
    try {
      const enroll = enrollments.find(e => e.id === enrollmentId); if (!enroll) return;
      const { error: eErr } = await supabase.from("enrollments").delete().eq("id", enrollmentId); if (eErr) throw eErr;
      const newEnrollments = enrollments.filter(e => e.id !== enrollmentId); setEnrollments(newEnrollments);
      if (!newEnrollments.some(e => e.personId === enroll.personId)) {
        const { error: pErr } = await supabase.from("persons").delete().eq("id", enroll.personId); if (pErr) throw pErr;
        setPersons(prev => prev.filter(p => p.id !== enroll.personId));
        if (enroll.program === "juniors") {
          const fam = families.find(fm => fm.personIds && fm.personIds.includes(enroll.personId));
          if (fam) { const newIds = fam.personIds.filter(id => id !== enroll.personId); if (!newIds.length) { await supabase.from("families").delete().eq("id", fam.id); setFamilies(prev => prev.filter(f => f.id !== fam.id)); } else { const upFam = { ...fam, personIds: newIds }; await supabase.from("families").upsert(mapFamilyToDb(upFam)); setFamilies(prev => prev.map(f => f.id === fam.id ? upFam : f)); } }
        }
      }
    } catch (err) { alert("Error deleting: " + (err.message || JSON.stringify(err))); }
    setSaving(false);
  }

  function issueReceiptFor(enrollment, payment) { const person = persons.find(p => p.id === enrollment.personId); setReceiptModal({ person, enrollment, payment, receiptNum: nextReceiptNum(person) }); }

  async function persistAdultLevels(program, nextLevels) { await supabase.from("program_levels").delete().eq("program", program); if (!nextLevels.length) return; await supabase.from("program_levels").insert(nextLevels.map((label, index) => ({ program, label, position: index }))); }
  async function saveTeacher() {
    if (!teacherForm.name.trim()) { setTeacherMsg("Name required."); return; }
    if (teacherForm.program === "juniors" && !teacherForm.levels.length) { setTeacherMsg("Assign at least one level."); return; }
    if (teacherForm.program !== "juniors" && !teacherForm.monthlyRate) { setTeacherMsg("Monthly rate required."); return; }
    setSaving(true);
    const t = { id: editingTeacherId || uid(), name: teacherForm.name, levels: teacherForm.levels, monthlyRate: parseFloat(teacherForm.monthlyRate) || 0 };
    try {
      const { error } = await supabase.from("teachers").upsert({ id: t.id, program: teacherForm.program, name: t.name, levels: teacherForm.program === "juniors" ? t.levels : [], monthly_rate: teacherForm.program === "juniors" ? null : t.monthlyRate });
      if (error) throw error;
      if (teacherForm.program === "juniors") setJuniorTeachers(p => editingTeacherId ? p.map(x => x.id === editingTeacherId ? t : x) : [...p, t]);
      else setAdultTeachers(p => ({ ...p, [teacherForm.program]: editingTeacherId ? (p[teacherForm.program] || []).map(x => x.id === editingTeacherId ? t : x) : [...(p[teacherForm.program] || []), t] }));
      setTeacherMsg(editingTeacherId ? "Updated" : "Added"); setTeacherForm({ program: "juniors", name: "", levels: [], monthlyRate: "" }); setEditingTeacherId(null);
    } catch { setTeacherMsg("Could not save teacher."); }
    setSaving(false); setTimeout(() => setTeacherMsg(""), 2500);
  }
  async function deleteTeacher(program, teacherId) {
    if (!window.confirm("Remove?")) return; setSaving(true);
    try { await supabase.from("teachers").delete().eq("id", teacherId); if (program === "juniors") setJuniorTeachers(p => p.filter(x => x.id !== teacherId)); else setAdultTeachers(p => ({ ...p, [program]: p[program].filter(x => x.id !== teacherId) })); }
    catch { setTeacherMsg("Could not delete teacher."); setTimeout(() => setTeacherMsg(""), 2500); }
    setSaving(false);
  }
  async function addAdultLevel(program) {
    const label = (newLevelInput[program] || "").trim(); if (!label) return;
    const current = adultLevels[program] || []; if (current.includes(label)) { setTeacherMsg("Level already exists."); setTimeout(() => setTeacherMsg(""), 2500); return; }
    const nextLevels = [...current, label]; setSaving(true);
    try { await persistAdultLevels(program, nextLevels); setAdultLevels(p => ({ ...p, [program]: nextLevels })); setNewLevelInput(p => ({ ...p, [program]: "" })); }
    catch { setTeacherMsg("Could not save levels."); setTimeout(() => setTeacherMsg(""), 2500); }
    setSaving(false);
  }
  async function deleteAdultLevel(program, label) {
    const nextLevels = (adultLevels[program] || []).filter(l => l !== label); setSaving(true);
    try { await persistAdultLevels(program, nextLevels); setAdultLevels(p => ({ ...p, [program]: nextLevels })); }
    catch { setTeacherMsg("Could not delete level."); setTimeout(() => setTeacherMsg(""), 2500); }
    setSaving(false);
  }

  const progEnrollments = prog => enrollments.filter(e => e.program === prog && e.active);
  const totalOutstanding = families.reduce((a, fam) => a + Math.max(0, calcFamilyBilling(fam, persons, enrollments, semesterMonths).balance), 0);

  if (authLoading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f8f6f1" }}><div style={{ textAlign: "center" }}><img src={LOGO_URL} alt="Tarteel" style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 10, opacity: 0.85 }} /><div style={{ marginTop: 14, fontSize: 16, color: "#aaa" }}>Loading...</div></div></div>;
  if (!session) return <LoginScreen />;
  if (loading) return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Red Hat Display', sans-serif", background: "#f8f6f1", gap: 16 }}><img src={LOGO_URL} alt="Tarteel" style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 12 }} /><div style={{ fontSize: 20, fontWeight: 700, color: "#1a6b3a" }}>Loading Tarteel Portal...</div></div>;
  if (dbError) return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Red Hat Display', sans-serif", background: "#f8f6f1", gap: 14, padding: 24, textAlign: "center" }}><div style={{ fontSize: 40 }}>⚠️</div><div style={{ fontSize: 20, fontWeight: 700, color: "#c0392b" }}>Database Error</div><div style={{ fontSize: 14, color: "#888", maxWidth: 420 }}>{dbError}</div><button style={{ marginTop: 12, padding: "10px 24px", background: "#1a6b3a", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, cursor: "pointer" }} onClick={() => window.location.reload()}>Retry</button></div>;

  const CSS = `
    *{box-sizing:border-box;margin:0;padding:0}
    :root{--g:#1a6b3a;--gold:#b8922a;--red:#c0392b;--blue:#2c5fe0;--bro:#1a3a6b;--sis:#6b1a4a;--border:#e8e4dc}
    html,body,#root{width:100%;min-height:100vh}
    .btn{cursor:pointer;border:none;border-radius:6px;font-family:inherit;transition:all .17s;font-size:14px;padding:9px 20px;font-weight:600}
    .bp{background:var(--g);color:#fff}.bp:hover{background:#145530}.bp:disabled{opacity:.6;cursor:not-allowed}
    .bo{background:transparent;border:1.5px solid var(--g);color:var(--g)}.bo:hover{background:var(--g);color:#fff}
    .bg{background:transparent;border:1.5px solid #ccc;color:#777;padding:7px 14px;font-size:13px}.bg:hover{border-color:var(--g);color:var(--g)}
    .bd{background:transparent;border:1.5px solid #e74c3c;color:#e74c3c;padding:6px 12px;font-size:12px}.bd:hover{background:#e74c3c;color:#fff}
    .bgold{background:var(--gold);color:#fff;padding:6px 14px;font-size:13px}.bgold:hover{background:#9a7a22}
    .bsm{padding:5px 12px;font-size:12px}.bxs{padding:4px 9px;font-size:11px}
    .card{background:#fff;border-radius:12px;box-shadow:0 2px 14px rgba(0,0,0,.055);padding:20px}
    .fg label{display:block;font-size:11px;font-weight:700;color:#888;margin-bottom:5px;text-transform:uppercase;letter-spacing:.7px}
    .fg input,.fg select,.fg textarea{width:100%;padding:10px 13px;border:1.5px solid #ddd;border-radius:8px;font-size:15px;font-family:inherit;background:#fafafa;transition:border .14s;color:#1a1a1a}
    .fg input:focus,.fg select:focus,.fg textarea:focus{outline:none;border-color:var(--g);background:#fff}
    .sec{font-size:10.5px;font-weight:700;color:var(--g);text-transform:uppercase;letter-spacing:2.2px;margin-bottom:14px;padding-bottom:8px;border-bottom:2px solid #e8f5ee}
    .bgg{background:#e8f5ee;color:var(--g);padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:700;display:inline-block}
    .brr{background:#fdecea;color:var(--red);padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:700;display:inline-block}
    .bgld{background:#fef5e4;color:var(--gold);padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:700;display:inline-block}
    .bgry{background:#f0f0f0;color:#888;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:700;display:inline-block}
    .nav{cursor:pointer;padding:10px 14px;border-radius:8px;font-size:14px;display:flex;align-items:center;gap:9px;transition:all .14s;color:#777;font-weight:500}
    .nav:hover{background:#e8f5ee;color:var(--g)}.nav.on{background:var(--g);color:#fff}
    .pnav{cursor:pointer;padding:7px 11px;border-radius:7px;font-size:13px;display:flex;justify-content:space-between;align-items:center;transition:all .14s}
    .pnav:hover{background:#f0f0f0}
    .tbl{width:100%;border-collapse:collapse}
    .tbl th{padding:8px 10px;text-align:left;font-size:10.5px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;background:#fafaf8;white-space:nowrap}
    .tbl td{padding:9px 10px;border-top:1px solid #f0ede6;font-size:13px;vertical-align:middle}
    .tbl tr:hover td{background:#f5fdf8}
    @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}.fade{animation:fi .2s ease}
    .mbg{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:999;padding:12px}
    .modal{background:#fff;border-radius:16px;padding:24px;width:500px;max-width:98vw;box-shadow:0 20px 60px rgba(0,0,0,.22);max-height:92vh;overflow-y:auto}
    .ptab{padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .17s;border:1.5px solid #ddd;color:#666;flex:1;text-align:center}
    .ptab:hover{border-color:var(--g);color:var(--g)}.ptab.on{color:#fff;border-color:transparent}
    .ptab.juniors.on{background:var(--g)}.ptab.brothers.on{background:var(--bro)}.ptab.sisters.on{background:var(--sis)}
    .ropt{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:14px;padding:9px 14px;border:1.5px solid #ddd;border-radius:8px;transition:all .15s;user-select:none}
    .ropt.on{border-color:var(--g);background:#f0faf4;color:var(--g);font-weight:600}
    .mc-box{border:2px solid #ddd;border-radius:10px;padding:11px 14px;cursor:pointer;transition:all .15s;user-select:none}.mc-box.on{border-color:var(--g);background:#f0faf4}
    .lchip{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1.5px solid #ddd;cursor:pointer;font-size:13px;font-weight:700;transition:all .15s}
    .lchip.on{background:var(--g);color:#fff;border-color:var(--g)}.lchip:hover:not(.on){border-color:var(--g);color:var(--g)}
    .r2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .mc{border:1.5px solid var(--gold);background:#fef9f0;border-radius:10px;padding:11px 14px;cursor:pointer;transition:background .15s;margin-bottom:6px}.mc:hover{background:#fef3e0}
    .hr{display:flex;align-items:center;border-bottom:1px solid #f5f2ec;padding:7px 0}.hr:last-child{border-bottom:none}
    .fr{cursor:pointer;padding:15px 18px;transition:background .14s;border-left:4px solid transparent}
    .fr.open{border-left:4px solid var(--g);background:#f8fdf9}.fr:hover:not(.open){background:#fafaf8}
    .pj{background:#e8f5ee;color:var(--g);padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block}
    .pb{background:#e8eeff;color:var(--bro);padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block}
    .ps{background:#fce8f5;color:var(--sis);padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block}
    .sn{background:#f0f0f0;color:#666;padding:2px 7px;border-radius:6px;font-size:11px;font-weight:700;font-family:monospace;display:inline-block}
    .lt{display:inline-flex;align-items:center;gap:5px;background:#e8f5ee;color:var(--g);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;margin:3px}
    .lt button{background:none;border:none;color:#888;cursor:pointer;font-size:13px;padding:0;line-height:1}
    input[type=checkbox]{width:16px;height:16px;accent-color:var(--g);cursor:pointer}
    @media(max-width:767px){.r2{grid-template-columns:1fr}.r3{grid-template-columns:1fr 1fr}.tbl th,.tbl td{padding:7px 7px;font-size:12px}.card{padding:14px}}
  `;

  const ppill = prog => prog === "juniors" ? "pj" : prog === "brothers" ? "pb" : "ps";
  const ptypeLabel = pt => pt === "full" ? "Paid Full" : pt === "partial" ? "Partially Paid" : pt === "instalment" ? "Instalment" : pt === "discounted" ? "Discounted" : "Waived";

  const SavingBanner = () => saving ? <div style={{ position: "fixed", bottom: isMobile ? 60 : 16, right: 16, background: "#1a6b3a", color: "#fff", padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, zIndex: 2000, boxShadow: "0 4px 16px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", opacity: 0.7, display: "inline-block" }} />Saving...</div> : null;
  const LogoutBtn = () => <div onClick={handleLogout} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 8, color: "#e74c3c", fontSize: 13, fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.background = "#fdecea"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><span>🚪</span> Sign Out</div>;

  const Sidebar = () => (
    <aside style={{ width: 220, background: "#fff", borderRight: "1px solid var(--border)", padding: "18px 10px", display: "flex", flexDirection: "column", gap: 3, position: "sticky", top: 0, height: "100vh", flexShrink: 0, overflowY: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={LOGO_URL} alt="Tarteel" style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 8 }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--g)", marginTop: 6 }}>TARTEEL</div>
        <div style={{ fontSize: 9.5, color: "#bbb", letterSpacing: 1.5, textTransform: "uppercase" }}>Ottawa Quran Institute</div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{session.user.email}</div>
      </div>
      {NAV_ITEMS.map(n => <div key={n.id} className={`nav${view === n.id ? " on" : ""}`} onClick={() => { setView(n.id); if (n.id !== "enroll") setForm(INIT_FORM); }}><span>{n.icon}</span>{n.label}</div>)}
      <div style={{ marginTop: 14, borderTop: "1px solid #f0ede6", paddingTop: 12 }}>
        <div style={{ fontSize: 10, color: "#ccc", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, paddingLeft: 4 }}>Programs</div>
        {[{ id: "juniors", label: "Tarteel Juniors", color: "var(--g)" }, { id: "brothers", label: "Brothers", color: "var(--bro)" }, { id: "sisters", label: "Sisters", color: "var(--sis)" }].map(p => <div key={p.id} className="pnav" style={{ color: activeProg === p.id && view === "dashboard" ? p.color : "#666" }} onClick={() => { setActiveProg(p.id); setView("dashboard"); }}><span style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />{p.label}</span><span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{progEnrollments(p.id).length}</span></div>)}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #f0ede6" }}>
        <div style={{ fontSize: 10.5, color: "#ccc", textAlign: "center", marginBottom: 8 }}>{semesterLabel}</div>
        <LogoutBtn />
      </div>
    </aside>
  );

  const BottomNav = () => <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid var(--border)", display: "flex", zIndex: 900, boxShadow: "0 -2px 12px rgba(0,0,0,.08)" }}>{NAV_ITEMS.map(n => <div key={n.id} onClick={() => { setView(n.id); if (n.id !== "enroll") setForm(INIT_FORM); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 4px 10px", cursor: "pointer", color: view === n.id ? "var(--g)" : "#aaa", borderTop: view === n.id ? "2.5px solid var(--g)" : "2.5px solid transparent", transition: "all .15s", minWidth: 0 }}><span style={{ fontSize: 18, lineHeight: 1 }}>{n.icon}</span><span style={{ fontSize: 9.5, fontWeight: view === n.id ? 700 : 500, marginTop: 3 }}>{n.label}</span></div>)}</nav>;
  const MobileHeader = () => <header style={{ position: "sticky", top: 0, zIndex: 800, background: "#fff", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 8px rgba(0,0,0,.06)" }}><img src={LOGO_URL} alt="Tarteel" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 6 }} /><div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--g)", lineHeight: 1.2 }}>TARTEEL</div><div style={{ fontSize: 9, color: "#bbb", letterSpacing: 1, textTransform: "uppercase" }}>Ottawa Quran Institute</div></div><div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}><div style={{ fontSize: 10, color: "#bbb" }}>{semesterLabel}</div><div onClick={handleLogout} style={{ cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#e74c3c", padding: "5px 10px", border: "1px solid #fcc", borderRadius: 6 }}>Sign Out</div></div></header>;

  // ─── DOB field component (reused in enroll form) ──────────────────────────
  const DobField = () => (
    <div className="fg">
      <label>Date of Birth (optional)</label>
      <input type="date" value={form.dateOfBirth || ""} onChange={e => handleDobChange(e.target.value)}
        max={today()}
        style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 15, fontFamily: "inherit", background: "#fafafa", color: "#1a1a1a" }} />
      {form.dateOfBirth && <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>{`Age auto-filled: ${calcAgeFromDob(form.dateOfBirth)}`}</div>}
    </div>
  );

  function renderMain() {
    const pad = isMobile ? "14px 14px 90px" : "28px 32px";

    if (view === "dashboard") return (
      <div className="fade" style={{ padding: pad }}>
        <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, marginBottom: 2 }}>Dashboard</h1>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>{semesterLabel}</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: isMobile ? 10 : 14, marginBottom: 14 }}>
          {[{ label: "Juniors", val: progEnrollments("juniors").length, color: "var(--g)", prog: "juniors" }, { label: "Brothers", val: progEnrollments("brothers").length, color: "var(--bro)", prog: "brothers" }, { label: "Sisters", val: progEnrollments("sisters").length, color: "var(--sis)", prog: "sisters" }, { label: "Families", val: families.length, color: "#555", prog: null }].map(s => <div key={s.label} className="card" style={{ borderTop: `4px solid ${s.color}`, padding: isMobile ? 12 : 16, cursor: s.prog ? "pointer" : "default" }} onClick={() => { if (s.prog) setActiveProg(s.prog); }}><div style={{ fontSize: 11, color: "#bbb", marginBottom: 3 }}>{s.label}</div><div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: s.color }}>{s.val}</div></div>)}
        </div>
        <div className="card" style={{ borderTop: "4px solid var(--red)", padding: isMobile ? 12 : 16, display: "inline-block", minWidth: 160, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#bbb", marginBottom: 3 }}>Outstanding Balance</div>
          <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: "var(--red)" }}>{`$${totalOutstanding.toFixed(2)}`}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>{PROGRAM_KEYS.map(pk => <div key={pk} className={`ptab ${pk}${activeProg === pk ? " on" : ""}`} onClick={() => setActiveProg(pk)}>{isMobile ? pk.charAt(0).toUpperCase() + pk.slice(1) : PROGRAMS[pk]}</div>)}</div>
        {progEnrollments(activeProg).length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "32px 16px", color: "#ccc" }}>
            <div style={{ fontSize: 14, marginBottom: 10 }}>{`No students in ${PROGRAMS[activeProg]} yet`}</div>
            <button className="btn bp" onClick={() => { setForm({ ...INIT_FORM, program: activeProg }); setView("enroll"); }}>Enroll First Student</button>
          </div>
        ) : (
          <div className="card" style={{ overflowX: "auto" }}>
            <div className="sec">{`${PROGRAMS[activeProg]} — ${progEnrollments(activeProg).length} students`}</div>
            <table className="tbl" style={{ minWidth: isMobile ? 500 : "auto" }}>
              <thead><tr><th>#</th><th>Name</th><th>G</th><th>Age</th><th>DOB</th><th>Level</th><th>Payment</th><th>Bal.</th><th></th></tr></thead>
              <tbody>
                {progEnrollments(activeProg).map(e => {
                  const person = persons.find(p => p.id === e.personId); if (!person) return null;
                  const bal = enrollBalance(e); const lastPay = e.paymentHistory && e.paymentHistory[e.paymentHistory.length - 1];
                  return (
                    <tr key={e.id}>
                      <td><span className="sn">{person.studentNum || "-"}</span></td>
                      <td><div style={{ display: "flex", alignItems: "center", gap: 6 }}>{person.photo ? <img src={person.photo} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--g)", flexShrink: 0 }} /> : null}<div><div style={{ fontWeight: 600, fontSize: 13 }}>{`${person.firstName} ${person.lastName}`}</div>{person.hasAllergy && <span style={{ fontSize: 9, background: "#fdecea", color: "#e74c3c", padding: "1px 4px", borderRadius: 3 }}>Allergy</span>}</div></div></td>
                      <td style={{ fontSize: 11 }}>{person.gender === "Female" ? "F" : "M"}</td>
                      <td>{person.age}</td>
                      <td style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>{person.dateOfBirth ? fmtDob(person.dateOfBirth) : <span style={{ color: "#ccc" }}>—</span>}</td>
                      <td style={{ fontSize: 12 }}>{activeProg === "juniors" ? (JUNIOR_LEVELS[e.level] || "-") : (e.levelName || "-")}</td>
                      <td><span className={e.paymentType === "full" ? "bgg" : e.paymentType === "waived" ? "bgld" : "bgry"} style={{ fontSize: 10 }}>{ptypeLabel(e.paymentType)}</span>{lastPay && <div style={{ fontSize: 10, color: "#bbb" }}>{fmtDate(lastPay.date)}</div>}</td>
                      <td><span className={bal > 0 ? "brr" : "bgg"} style={{ fontSize: 11 }}>{`$${bal.toFixed(2)}`}</span></td>
                      <td><div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}><button className="btn bg bxs" onClick={() => openEditEnrollment(e)}>Edit</button>{["instalment", "partial", "discounted"].includes(e.paymentType) && bal > 0 && <button className="btn bgold bxs" onClick={() => setPaymentModal({ enrollmentId: e.id })}>+Pay</button>}{lastPay && <button className="btn bo bxs" onClick={() => issueReceiptFor(e, lastPay)}>Rec.</button>}<button className="btn bd bxs" onClick={() => deleteEnrollment(e.id)}>Del</button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );

    if (view === "enroll") return (
      <div className="fade" style={{ padding: pad, maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, marginBottom: 4 }}>{form.editingEnrollId ? "Edit Enrollment" : "Enroll Student"}</h1>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>{form.editingEnrollId ? "Update student details" : "Register for any Tarteel program"}</p>
        {!form.editingEnrollId && <div className="card" style={{ marginBottom: 14 }}><div className="sec">Program</div><div style={{ display: "flex", gap: 8 }}>{PROGRAM_KEYS.map(pk => <div key={pk} className={`ptab ${pk}${form.program === pk ? " on" : ""}`} onClick={() => { f("program", pk); f("teacherId", ""); f("level", ""); f("levelName", ""); if (pk === "brothers") f("gender", "Male"); if (pk === "sisters") f("gender", "Female"); }}>{PROGRAMS[pk]}</div>)}</div></div>}
        {!form.editingEnrollId && <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>{[{ v: "new", label: "New Person" }, { v: "existing", label: "Existing Person" }].map(m => <div key={m.v} className={`ptab juniors${form.mode === m.v ? " on" : ""}`} onClick={() => { f("mode", m.v); f("searchQuery", ""); f("matchSuggestions", []); f("linkedPersonId", null); }}>{m.label}</div>)}</div>}
        {form.mode === "existing" && !form.editingEnrollId && <div className="card" style={{ marginBottom: 14 }}><div className="sec">Search Person</div><div className="fg"><label>Name</label><input value={form.searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Type any name..." autoFocus /></div>{form.matchSuggestions && form.matchSuggestions.length > 0 && <div style={{ marginTop: 10 }}>{form.matchSuggestions.map(p => <div key={p.id} className="mc" onClick={() => autoFill(p)}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="sn">{p.studentNum}</span><span style={{ fontWeight: 700 }}>{`${p.firstName} ${p.lastName}`}</span><span style={{ fontSize: 12, color: "#aaa" }}>{`Age ${p.age}${p.dateOfBirth ? " · " + fmtDob(p.dateOfBirth) : ""}`}</span></div></div>)}</div>}</div>}
        {form.mode === "new" && !form.editingEnrollId && form.matchSuggestions && form.matchSuggestions.length > 0 && <div style={{ background: "#fef9f0", border: "1.5px solid var(--gold)", borderRadius: 10, padding: 14, marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Existing Family Match — link sibling?</div>{form.matchSuggestions.map(p => <div key={p.id} className="mc" onClick={() => linkPerson(p)}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="sn">{p.studentNum}</span><span style={{ fontWeight: 700 }}>{`${p.firstName} ${p.lastName}`}</span><span style={{ fontSize: 12, color: "#aaa" }}>{`Age ${p.age}`}</span></div></div>)}</div>}

        <div className="card" style={{ marginBottom: 14 }}>
          <div className="sec">Student Information</div>
          <div className="r2" style={{ marginBottom: 12 }}>
            <div className="fg"><label>First Name *</label><input value={form.firstName} onChange={e => f("firstName", e.target.value)} placeholder="e.g. Ahmed" /></div>
            <div className="fg"><label>Last Name *</label><input value={form.lastName} onChange={e => f("lastName", e.target.value)} placeholder="e.g. Al-Hassan" /></div>
          </div>
          {/* ── DOB row — auto-fills age ── */}
          <div className="r2" style={{ marginBottom: 12 }}>
            <DobField />
            <div className="fg">
              <label>Age * {form.dateOfBirth ? <span style={{ color: "#aaa", fontSize: 10, fontWeight: 400 }}>(auto-filled)</span> : ""}</label>
              <input type="number" min={form.program === "juniors" ? 6 : 18} max={99} value={form.age} onChange={e => f("age", e.target.value)} placeholder={form.program === "juniors" ? "Age 6+" : "Age 18+"} />
            </div>
          </div>
          <div className="fg" style={{ marginBottom: 12 }}>
            <label>Gender *</label>
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>{["Male", "Female"].map(g => { const blocked = (form.program === "brothers" && g === "Female") || (form.program === "sisters" && g === "Male"); return <div key={g} className={`ropt${form.gender === g ? " on" : ""}`} style={{ flex: 1, justifyContent: "center", opacity: blocked ? 0.3 : 1, cursor: blocked ? "not-allowed" : "pointer" }} onClick={() => { if (!blocked) f("gender", g); }}>{g}</div>; })}
            </div>
          </div>
          <div className="fg" style={{ marginBottom: 10 }}><label>Address (optional)</label><AddressInput value={form.address} onChange={addr => f("address", addr)} /></div>
          {form.address && (form.address.city || form.address.province) && <div className="r3" style={{ marginBottom: 12 }}><div className="fg"><label>City</label><input value={form.address.city || ""} onChange={e => f("address", { ...form.address, city: e.target.value })} /></div><div className="fg"><label>Province</label><input value={form.address.province || ""} onChange={e => f("address", { ...form.address, province: e.target.value })} /></div><div className="fg"><label>Postal</label><input value={form.address.postal || ""} onChange={e => f("address", { ...form.address, postal: e.target.value })} /></div></div>}
          {isAdult && <div style={{ background: "#f0f4ff", border: "1px solid #b7c9f5", borderRadius: 10, padding: 14 }}><div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--blue)", marginBottom: 10 }}>PERSONAL CONTACT (18+)</div><div className="r2"><div className="fg"><label>Phone *</label><PhoneInput value={form.phone} onChange={v => f("phone", v)} /></div><div className="fg"><label>Email *</label><EmailInput value={form.email} onChange={v => f("email", v)} /></div></div></div>}
          {isMinor && (
            <div style={{ background: "#f0faf4", border: "1px solid #b7e4cc", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--g)", marginBottom: 12 }}>PARENT / GUARDIAN</div>
              <div style={{ marginBottom: 12 }}><div style={{ fontSize: 14, marginBottom: 8, fontWeight: 500 }}>Both parents available?</div><div style={{ display: "flex", gap: 8 }}>{[{ v: "yes", label: "Yes" }, { v: "no", label: "One parent only" }].map(o => <div key={o.v} className={`ropt${form.twoParents === o.v ? " on" : ""}`} onClick={() => f("twoParents", o.v)}>{o.label}</div>)}</div></div>
              {["parent1", form.twoParents === "yes" ? "parent2" : null].filter(Boolean).map(which => <div key={which} style={{ background: "#f8f6f1", borderRadius: 10, padding: 12, marginBottom: 10 }}><div style={{ fontSize: 10.5, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>{`Parent ${which === "parent1" ? "1 *" : "2"}`}</div><div className="r2" style={{ marginBottom: 10 }}><div className="fg"><label>First Name</label><input value={form[which + "First"]} onChange={e => f(which + "First", e.target.value)} /></div><div className="fg"><label>Last Name</label><input value={form[which + "Last"]} onChange={e => f(which + "Last", e.target.value)} /></div></div><div className="r2"><div className="fg"><label>Phone</label><PhoneInput value={form[which + "Phone"]} onChange={v => f(which + "Phone", v)} /></div><div className="fg"><label>Email</label><EmailInput value={form[which + "Email"]} onChange={v => f(which + "Email", v)} /></div></div></div>)}
              {form.twoParents === "yes" && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--g)", textTransform: "uppercase", marginBottom: 8 }}>Main Contact</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[{ v: "parent1", label: [form.parent1First, form.parent1Last].filter(Boolean).join(" ") || "Parent 1", sub: fmtPhone(form.parent1Phone) || form.parent1Email || "-" }, { v: "parent2", label: [form.parent2First, form.parent2Last].filter(Boolean).join(" ") || "Parent 2", sub: fmtPhone(form.parent2Phone) || form.parent2Email || "-" }].map(o => <div key={o.v} className={`mc-box${form.mainContact === o.v ? " on" : ""}`} style={{ flex: 1, minWidth: 140 }} onClick={() => f("mainContact", o.v)}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={form.mainContact === o.v} readOnly /><div><div style={{ fontWeight: 600, fontSize: 13 }}>{o.label}</div><div style={{ fontSize: 11, color: "#aaa" }}>{o.sub}</div></div></div></div>)}</div></div>}
              {form.twoParents === "no" && <div style={{ background: "#fff8e8", border: "1.5px solid #f0d080", borderRadius: 10, padding: 12, marginTop: 10 }}><div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>Emergency Contact Required</div><div className="r2" style={{ marginBottom: 10 }}><div className="fg"><label>First Name *</label><input value={form.emergencyFirst} onChange={e => f("emergencyFirst", e.target.value)} /></div><div className="fg"><label>Last Name *</label><input value={form.emergencyLast} onChange={e => f("emergencyLast", e.target.value)} /></div></div><div className="r2"><div className="fg"><label>Phone</label><PhoneInput value={form.emergencyPhone} onChange={v => f("emergencyPhone", v)} /></div><div className="fg"><label>Relationship</label><select value={form.emergencyRelationship} onChange={e => f("emergencyRelationship", e.target.value)}><option value="">Select...</option>{RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}</select></div></div></div>}
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: 14 }}><div className="sec">Medical / Allergy</div><div style={{ fontSize: 14, marginBottom: 10 }}>Any allergies or medical conditions?</div><div style={{ display: "flex", gap: 8, marginBottom: form.hasAllergy === "yes" ? 12 : 0 }}>{["yes", "no"].map(o => <div key={o} className={`ropt${form.hasAllergy === o ? " on" : ""}`} onClick={() => f("hasAllergy", o)}>{o === "yes" ? "Yes" : "No"}</div>)}</div>{form.hasAllergy === "yes" && <div className="fg"><label>Describe</label><textarea rows={2} value={form.allergyNote} onChange={e => f("allergyNote", e.target.value)} placeholder="e.g. Peanut allergy, EpiPen required..." /></div>}</div>
        <div className="card" style={{ marginBottom: 14 }}><div className="sec">Notes (optional)</div><div className="fg"><label>Internal notes</label><textarea rows={2} value={form.notes} onChange={e => f("notes", e.target.value)} placeholder="e.g. Needs extra support" /></div></div>
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="sec">Photo</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {form.photo ? <img src={form.photo} style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--g)" }} /> : <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{form.gender === "Female" ? "F" : "M"}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{!cameraActive && <button className="btn bo bsm" onClick={startCamera}>Camera</button>}{cameraActive && <button className="btn bp bsm" onClick={capturePhoto}>Capture</button>}{cameraActive && <button className="btn bg bsm" onClick={stopCamera}>Cancel</button>}{form.photo && !cameraActive && <button className="btn bg bsm" onClick={() => f("photo", null)}>Remove</button>}</div>
          </div>
          {cameraActive && <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: 200, borderRadius: 8, marginTop: 10, objectFit: "cover" }} />}
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div className="sec">Class Assignment</div>
          {isJunior && <div className="fg" style={{ marginBottom: 12 }}><label>Level *</label><select value={form.level} onChange={e => { f("level", e.target.value); f("levelName", JUNIOR_LEVELS[e.target.value] || ""); f("teacherId", ""); }}><option value="">Select level...</option>{JUNIOR_LEVELS.map((l, i) => <option key={i} value={i}>{l}</option>)}</select></div>}
          {!isJunior && <div className="fg" style={{ marginBottom: 12 }}><label>Level</label><select value={form.levelName} onChange={e => { f("levelName", e.target.value); f("level", e.target.value); }}><option value="">Select level...</option>{(adultLevels[form.program] || []).map(l => <option key={l}>{l}</option>)}</select></div>}
          <div className="fg"><label>Teacher *</label><select value={form.teacherId} onChange={e => { const t = eligibleTeachers.find(x => x.id === e.target.value); f("teacherId", e.target.value); f("teacherName", t ? t.name : ""); f("monthlyRate", t ? (t.monthlyRate || 0) : 0); }} disabled={isJunior && form.level === ""}><option value="">{isJunior && form.level === "" ? "Select level first" : "Select teacher..."}</option>{eligibleTeachers.map(t => <option key={t.id} value={t.id}>{t.name + (t.monthlyRate ? ` — $${t.monthlyRate}/mo` : "")}</option>)}</select></div>
          {form.teacherId && !isJunior && form.monthlyRate > 0 && <div style={{ marginTop: 8, padding: "8px 12px", background: "#f0faf4", borderRadius: 8, fontSize: 13 }}>{`Monthly: $${form.monthlyRate} — Semester (${semesterMonths} mo): $${form.monthlyRate * semesterMonths}`}</div>}
        </div>

        <div className="card" style={{ marginBottom: 22 }}>
          <div className="sec">Payment</div>
          {!form.editingEnrollId ? (
            <>
              <div className="r2" style={{ marginBottom: 12 }}><div className="fg"><label>Type *</label><select value={form.paymentType} onChange={e => f("paymentType", e.target.value)}><option value="full">Paid in Full</option><option value="partial">Partially Paid</option><option value="instalment">Instalments</option><option value="discounted">Discounted</option><option value="waived">Waived</option></select></div>{(form.paymentType === "full" || form.paymentType === "discounted") && <div className="fg"><label>Date</label><input type="date" value={form.paymentDate} onChange={e => f("paymentDate", e.target.value)} /></div>}</div>
              {form.paymentType === "full" && <div className="r2"><div className="fg"><label>Method</label><select value={form.paymentMethod} onChange={e => f("paymentMethod", e.target.value)}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select></div><div className="fg"><label>Note</label><input value={form.paymentNote} onChange={e => f("paymentNote", e.target.value)} placeholder="Optional" /></div></div>}
              {form.paymentType === "discounted" && <div><div className="r2" style={{ marginBottom: 10 }}><div className="fg"><label>Amount ($)</label><MoneyInput value={form.discountedAmount} onChange={v => f("discountedAmount", v)} /></div><div className="fg"><label>Method</label><select value={form.paymentMethod} onChange={e => f("paymentMethod", e.target.value)}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select></div></div></div>}
              {(form.paymentType === "instalment" || form.paymentType === "partial") && <div style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>{form.paymentType === "partial" ? "Amount paid so far" : "Initial payment today"}</div><div className="r2" style={{ marginBottom: 8 }}><div className="fg"><label>Amount ($)</label><MoneyInput value={form.instalmentPaid} onChange={v => f("instalmentPaid", v)} /></div><div className="fg"><label>Date</label><input type="date" value={form.instalmentDate} onChange={e => f("instalmentDate", e.target.value)} /></div></div><div className="fg"><label>Method</label><select value={form.instalmentMethod} onChange={e => f("instalmentMethod", e.target.value)}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select></div></div>}
              {form.paymentType === "waived" && <div className="fg"><label>Reason</label><select value={form.waiverType} onChange={e => f("waiverType", e.target.value)}>{WAIVER_TYPES.map(w => <option key={w}>{w}</option>)}</select></div>}
            </>
          ) : (
            <>
              <div style={{ background: "#f8f6f1", borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 13 }}><strong>Payment Type:</strong> {ptypeLabel(form.paymentType)}</div>
              {(form.paymentType === "full" || form.paymentType === "discounted") && <div className="fg"><label>Payment Method</label><select value={form.paymentMethod} onChange={e => f("paymentMethod", e.target.value)}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select></div>}
              {(form.paymentType === "instalment" || form.paymentType === "partial") && editingPaymentCount <= 1 && <div className="fg"><label>{editingPaymentCount === 0 ? "Payment Method" : "Initial Payment Method"}</label><select value={form.instalmentMethod} onChange={e => f("instalmentMethod", e.target.value)}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select></div>}
              {(form.paymentType === "instalment" || form.paymentType === "partial") && editingPaymentCount > 1 && <div style={{ background: "#f8f6f1", borderRadius: 10, padding: 12, fontSize: 13, color: "#777" }}>Multiple payments recorded. Use Families view to edit individual payment methods.</div>}
              {form.paymentType === "waived" && <div style={{ background: "#f8f6f1", borderRadius: 10, padding: 12, fontSize: 13 }}><strong>Reason:</strong> {form.waiverType || "-"}</div>}
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn bp" onClick={submitEnrollment} disabled={saving}>{saving ? "Saving..." : form.editingEnrollId ? "Save Changes" : "Enroll Student"}</button>
          <button className="btn bg" onClick={() => { setForm(INIT_FORM); setView("dashboard"); }}>Cancel</button>
        </div>
      </div>
    );

    if (view === "families") return (
      <div className="fade" style={{ padding: pad }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, marginBottom: 4 }}>Families</h1>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 14 }}>{`${families.length} ${families.length === 1 ? "family" : "families"} — Tarteel Juniors`}</p>
        {families.length === 0 ? <div className="card" style={{ textAlign: "center", padding: 40, color: "#ccc" }}>No families yet.</div>
          : families.map(fam => {
            const billing = calcFamilyBilling(fam, persons, enrollments, semesterMonths); const isOpen = selectedFamilyId === fam.id; const isCredit = billing.balance < 0;
            return (
              <div key={fam.id} style={{ marginBottom: 8 }}>
                <div className={`card fr${isOpen ? " open" : ""}`} onClick={() => setSelectedFamilyId(isOpen ? null : fam.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👨‍👩‍👧</div>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{fam.name || "-"}</div><div style={{ fontSize: 12, color: "#999", display: "flex", gap: 10, flexWrap: "wrap" }}>{fam.phone && <span>📞 {fmtPhone(fam.phone)}</span>}{fam.email && <span>✉️ {fam.email}</span>}</div></div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}><span className={isCredit ? "bgld" : billing.balance > 0 ? "brr" : "bgg"} style={{ fontSize: 12 }}>{isCredit ? `Credit $${Math.abs(billing.balance).toFixed(2)}` : `$${billing.balance.toFixed(2)}`}</span><div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>{`${(fam.personIds && fam.personIds.length) || 0} children`}</div></div>
                    <div style={{ fontSize: 16, color: "#ccc", transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "none", flexShrink: 0 }}>{">"}</div>
                  </div>
                </div>
                {isOpen && (
                  <div className="fade" style={{ background: "#fff", border: "1px solid #e8f5ee", borderTop: "none", borderRadius: "0 0 12px 12px", padding: 16, marginTop: -4 }}>
                    <div style={{ background: "#f8f6f1", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                      <div className="sec" style={{ marginBottom: 8 }}>Family Billing</div>
                      {billing.lineItems.map((li, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "1px solid #eee" }}><span>{li.name}</span><strong>{`$${li.total.toFixed(2)}`}</strong></div>)}
                      {billing.lineItems.length > 1 && <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{`Family discount applied — ${billing.lineItems.length} children`}</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontWeight: 700, fontSize: 13 }}><span>Total Owed</span><span>{`$${billing.totalOwed.toFixed(2)}`}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginTop: 2 }}><span>Total Paid</span><span>{`$${billing.totalPaid.toFixed(2)}`}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontWeight: 700, fontSize: 14 }}><span>{isCredit ? "Credit" : "Balance"}</span><span style={{ color: isCredit ? "var(--gold)" : billing.balance > 0 ? "var(--red)" : "var(--g)" }}>{isCredit ? `+$${Math.abs(billing.balance).toFixed(2)}` : `$${billing.balance.toFixed(2)}`}</span></div>
                    </div>
                    {(fam.personIds || []).map(pid => {
                      const person = persons.find(p => p.id === pid); if (!person) return null;
                      const pes = enrollments.filter(e => e.personId === pid && e.active);
                      return (
                        <div key={pid} style={{ border: "1px solid #f0ede6", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            {person.photo ? <img src={person.photo} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} /> : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{person.gender === "Female" ? "F" : "M"}</div>}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}><span className="sn">{person.studentNum}</span><span style={{ fontWeight: 700, fontSize: 13 }}>{`${person.firstName} ${person.lastName}`}</span><span style={{ fontSize: 11, color: "#aaa" }}>{`Age ${person.age}`}</span>{person.dateOfBirth && <span style={{ fontSize: 10, color: "#bbb" }}>{`DOB: ${fmtDob(person.dateOfBirth)}`}</span>}</div>
                              {person.hasAllergy && <span style={{ fontSize: 10, color: "var(--red)" }}>{`Allergy: ${person.allergyNote || "on file"}`}</span>}
                              {person.notes && <div style={{ fontSize: 11, color: "#aaa" }}>{person.notes}</div>}
                            </div>
                          </div>
                          {pes.map(e => {
                            const eBal = enrollBalance(e);
                            return (
                              <div key={e.id} style={{ background: "#fafaf8", borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
                                  <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}><span className="pj">Juniors</span><span style={{ fontSize: 12 }}>{JUNIOR_LEVELS[e.level] || ""}</span><span style={{ fontSize: 12 }}>{e.teacherName}</span></div>
                                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}><span className={eBal > 0 ? "brr" : "bgg"} style={{ fontSize: 11 }}>{`$${eBal.toFixed(2)}`}</span><button className="btn bg bxs" onClick={() => openEditEnrollment(e)}>Edit</button>{["instalment", "partial", "discounted"].includes(e.paymentType) && eBal > 0 && <button className="btn bgold bxs" onClick={() => setPaymentModal({ enrollmentId: e.id })}>+Pay</button>}<button className="btn bd bxs" onClick={() => deleteEnrollment(e.id)}>Del</button></div>
                                </div>
                                {e.paymentHistory && e.paymentHistory.map((h, hi) => (
                                  <div key={hi} className="hr">
                                    <div style={{ width: 88, fontSize: 10, color: "#aaa", flexShrink: 0 }}>{fmtDate(h.date)}</div>
                                    <div style={{ flex: 1, fontSize: 11 }}><span style={{ fontWeight: 600, color: "var(--g)" }}>{h.amount > 0 ? `$${h.amount.toFixed(2)}` : "-"}</span><span style={{ color: "#bbb", marginLeft: 5 }}>{h.method}</span>{h.note && <span style={{ color: "#aaa", marginLeft: 5 }}>{h.note}</span>}</div>
                                    <button className="btn bo bxs" onClick={() => issueReceiptFor(e, h)}>Rec</button>
                                    <button className="btn bg bxs" onClick={() => openEditPayment(e.id, h)}>Edit</button>
                                    <button className="btn bd bxs" onClick={() => deletePayment(e.id, h.id)}>X</button>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    );

    if (view === "lookup") return (
      <div className="fade" style={{ padding: pad, maxWidth: 700 }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, marginBottom: 4 }}>Lookup</h1>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>Search by name, phone, or email</p>
        {(() => {
          const teacherOptions = (lookupProgramFilter === "juniors" ? juniorTeachers : lookupProgramFilter === "brothers" ? (adultTeachers.brothers || []) : lookupProgramFilter === "sisters" ? (adultTeachers.sisters || []) : [...juniorTeachers, ...(adultTeachers.brothers || []), ...(adultTeachers.sisters || [])]).map(t => ({ value: t.id, label: t.name })).sort((a, b) => a.label.localeCompare(b.label));
          const levelOptions = lookupProgramFilter === "juniors" ? JUNIOR_LEVELS.map((label, i) => ({ value: `juniors:${i}`, label })) : (lookupProgramFilter === "brothers" || lookupProgramFilter === "sisters") ? (adultLevels[lookupProgramFilter] || []).map(label => ({ value: `${lookupProgramFilter}:${label}`, label })) : [];
          const hasInput = Boolean(lookupQuery || lookupProgramFilter || lookupLevelFilter || lookupGenderFilter || lookupTeacherFilter);
          return (
            <>
              <div className="card" style={{ marginBottom: 14 }}>
                <div className="fg" style={{ marginBottom: 12 }}><label>Name, Phone, or Email</label><input value={lookupQuery} onChange={e => handleLookup(e.target.value)} placeholder="e.g. Ahmed or 6131234567" autoFocus style={{ fontSize: 16 }} /></div>
                <div className="r2" style={{ marginBottom: 12 }}>
                  <div className="fg"><label>Program</label><select value={lookupProgramFilter} onChange={e => handleLookupProgramFilter(e.target.value)}><option value="">All programs</option>{PROGRAM_KEYS.map(pk => <option key={pk} value={pk}>{PROGRAMS[pk]}</option>)}</select></div>
                  <div className="fg"><label>Level</label><select value={lookupLevelFilter} onChange={e => handleLookupLevelFilter(e.target.value)} disabled={!lookupProgramFilter}><option value="">{lookupProgramFilter ? "All levels" : "Select program first"}</option>{levelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                </div>
                <div className="r2">
                  <div className="fg"><label>Gender</label><select value={lookupGenderFilter} onChange={e => handleLookupGenderFilter(e.target.value)}><option value="">All genders</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                  <div className="fg"><label>Teacher</label><select value={lookupTeacherFilter} onChange={e => handleLookupTeacherFilter(e.target.value)}><option value="">All teachers</option>{teacherOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                </div>
                {hasInput && <div style={{ marginTop: 10, fontSize: 12, color: "#888", fontWeight: 600 }}>{`${lookupResults.length} ${lookupResults.length === 1 ? "student" : "students"} found`}</div>}
                {lookupResults.length > 0 && <div style={{ marginTop: 10 }}><button className="btn bo bsm" onClick={printLookupResults}>Print / Save PDF</button></div>}
                {hasInput && !lookupResults.length && <div style={{ marginTop: 10, fontSize: 13, color: "#bbb" }}>No results.</div>}
              </div>
              {lookupResults.map(person => {
                const fam = families.find(fm => fm.personIds && fm.personIds.includes(person.id));
                const pes = enrollments.filter(e => e.personId === person.id && e.active);
                return (
                  <div key={person.id} className="card" style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                      {person.photo ? <img src={person.photo} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--g)", flexShrink: 0 }} /> : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{person.gender === "Female" ? "F" : "M"}</div>}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}><span className="sn">{person.studentNum}</span><span style={{ fontSize: 16, fontWeight: 700 }}>{`${person.firstName} ${person.lastName}`}</span></div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{`${person.gender} · Age ${person.age}${person.dateOfBirth ? " · DOB: " + fmtDob(person.dateOfBirth) : ""}`}</div>
                        {person.phone && <div style={{ fontSize: 12 }}>{fmtPhone(person.phone)}</div>}
                        {person.parent1Phone && <div style={{ fontSize: 12 }}>{`${[person.parent1First, person.parent1Last].filter(Boolean).join(" ")}: ${fmtPhone(person.parent1Phone)}`}</div>}
                        {person.hasAllergy && <span style={{ fontSize: 10, background: "#fdecea", color: "#e74c3c", padding: "1px 5px", borderRadius: 4 }}>{person.allergyNote || "Allergy"}</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>{pes.map(e => <span key={e.id} className={ppill(e.program)}>{`${PROGRAMS[e.program]} · ${e.program === "juniors" ? (JUNIOR_LEVELS[e.level] || "-") : (e.levelName || "-")}`}</span>)}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{fam && <button className="btn bo bsm" onClick={() => { setSelectedFamilyId(fam.id); setView("families"); }}>View Family</button>}{pes.map(e => <button key={e.id} className="btn bg bsm" onClick={() => openEditEnrollment(e)}>{`Edit ${PROGRAMS[e.program]}`}</button>)}</div>
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>
    );

    if (view === "teachers") return (
      <div className="fade" style={{ padding: pad }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, marginBottom: 4 }}>Teachers</h1>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>Manage teachers and levels</p>
        <div style={{ display: isMobile ? "block" : "grid", gridTemplateColumns: "1fr 300px", gap: 18 }}>
          <div>
            {["brothers", "sisters"].map(prog => <div key={prog} className="card" style={{ marginBottom: 14, borderTop: `3px solid ${prog === "brothers" ? "var(--bro)" : "var(--sis)"}` }}><div className="sec">{`${PROGRAMS[prog]} — Levels`}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>{(adultLevels[prog] || []).map((l, i) => <span key={i} className="lt">{l}<button onClick={() => deleteAdultLevel(prog, l)}>x</button></span>)}{!(adultLevels[prog] && adultLevels[prog].length) && <span style={{ fontSize: 12, color: "#bbb" }}>No levels yet</span>}</div><div style={{ display: "flex", gap: 7 }}><input value={newLevelInput[prog] || ""} onChange={e => setNewLevelInput(p => ({ ...p, [prog]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") addAdultLevel(prog); }} placeholder="New level name..." style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }} /><button className="btn bp bsm" onClick={() => addAdultLevel(prog)}>+ Add</button></div></div>)}
            {[{ prog: "juniors", tList: juniorTeachers, color: "var(--g)" }, { prog: "brothers", tList: adultTeachers.brothers || [], color: "var(--bro)" }, { prog: "sisters", tList: adultTeachers.sisters || [], color: "var(--sis)" }].map(item => <div key={item.prog} className="card" style={{ marginBottom: 12, borderTop: `3px solid ${item.color}` }}><div className="sec">{`${PROGRAMS[item.prog]} — Teachers`}</div>{!item.tList.length ? <div style={{ color: "#ccc", fontSize: 13 }}>No teachers yet.</div> : <div style={{ overflowX: "auto" }}><table className="tbl" style={{ minWidth: 320 }}><thead><tr><th>Name</th><th>{item.prog === "juniors" ? "Levels" : "Rate"}</th><th>Students</th><th></th></tr></thead><tbody>{item.tList.map(t => { const cnt = enrollments.filter(e => e.teacherId === t.id && e.active).length; return <tr key={t.id}><td style={{ fontWeight: 600 }}>{t.name}</td><td>{item.prog === "juniors" ? <div style={{ display: "flex", gap: 3 }}>{(t.levels || []).sort((a, b) => a - b).map(li => <span key={li} className="bgg" style={{ fontSize: 10 }}>{JUNIOR_LEVELS[li]}</span>)}</div> : <span className="bgry">{`$${t.monthlyRate}/mo`}</span>}</td><td><span className="bgry">{cnt}</span></td><td><div style={{ display: "flex", gap: 4 }}><button className="btn bg bsm" onClick={() => { setTeacherForm({ program: item.prog, name: t.name, levels: t.levels || [], monthlyRate: t.monthlyRate || "" }); setEditingTeacherId(t.id); }}>Edit</button><button className="btn bd bsm" onClick={() => deleteTeacher(item.prog, t.id)}>X</button></div></td></tr>; })}</tbody></table></div>}</div>)}
          </div>
          <div className="card" style={{ position: isMobile ? "static" : "sticky", top: 20, marginTop: isMobile ? 14 : 0 }}>
            <div className="sec">{editingTeacherId ? "Edit Teacher" : "Add Teacher"}</div>
            <div className="fg" style={{ marginBottom: 12 }}><label>Program</label><select value={teacherForm.program} onChange={e => setTeacherForm(p => ({ ...p, program: e.target.value, levels: [], monthlyRate: "" }))}>{PROGRAM_KEYS.map(pk => <option key={pk} value={pk}>{PROGRAMS[pk]}</option>)}</select></div>
            <div className="fg" style={{ marginBottom: 12 }}><label>Full Name *</label><input value={teacherForm.name} onChange={e => setTeacherForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Ust. Abdullah" /></div>
            {teacherForm.program === "juniors" ? <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 7 }}>Assign Levels *</div><div style={{ display: "flex", gap: 7 }}>{JUNIOR_LEVELS.map((l, i) => <div key={i} className={`lchip${teacherForm.levels.includes(i) ? " on" : ""}`} onClick={() => setTeacherForm(p => ({ ...p, levels: p.levels.includes(i) ? p.levels.filter(x => x !== i) : [...p.levels, i] }))} title={l}>{i + 1}</div>)}</div></div>
              : <div className="fg" style={{ marginBottom: 12 }}><label>Monthly Rate ($) *</label><input type="number" value={teacherForm.monthlyRate} onChange={e => setTeacherForm(p => ({ ...p, monthlyRate: e.target.value }))} placeholder="e.g. 50 or 100" /></div>}
            {teacherMsg && <div style={{ fontSize: 13, color: "var(--g)", background: "#f0faf4", padding: "7px 12px", borderRadius: 8, marginBottom: 10, fontWeight: 600 }}>{teacherMsg}</div>}
            <div style={{ display: "flex", gap: 7 }}><button className="btn bp" onClick={saveTeacher}>{editingTeacherId ? "Save" : "Add Teacher"}</button>{editingTeacherId && <button className="btn bg" onClick={() => { setTeacherForm({ program: "juniors", name: "", levels: [], monthlyRate: "" }); setEditingTeacherId(null); setTeacherMsg(""); }}>Cancel</button>}</div>
          </div>
        </div>
      </div>
    );

    if (view === "mailing") {
      const emailMap = {};
      persons.forEach(p => { const progEnrolls = enrollments.filter(e => e.personId === p.id && e.active); const progLabels = progEnrolls.map(e => PROGRAMS[e.program]).join(", "); if (p.email) emailMap[p.email] = emailMap[p.email] || { name: `${p.firstName} ${p.lastName}`, role: "Student", programs: progLabels }; if (p.parent1Email) emailMap[p.parent1Email] = emailMap[p.parent1Email] || { name: ([p.parent1First, p.parent1Last].filter(Boolean).join(" ")) || `${p.firstName} Parent`, role: "Parent", programs: progLabels }; if (p.parent2Email) emailMap[p.parent2Email] = emailMap[p.parent2Email] || { name: ([p.parent2First, p.parent2Last].filter(Boolean).join(" ")) || `${p.firstName} Parent 2`, role: "Parent", programs: progLabels }; });
      const entries = Object.entries(emailMap); const allEmails = entries.map(e => e[0]).join(", ");
      return (
        <div className="fade" style={{ padding: pad }}>
          <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, marginBottom: 4 }}>Mailing List</h1>
          <p style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>{`${entries.length} email addresses on file`}</p>
          {entries.length === 0 ? <div className="card" style={{ textAlign: "center", padding: 40, color: "#ccc" }}>No emails yet.</div>
            : <div><div className="card" style={{ marginBottom: 14 }}><div className="sec">All Emails</div><textarea readOnly value={allEmails} rows={3} onClick={e => { e.target.select(); document.execCommand("copy"); }} style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 12, fontFamily: "monospace", background: "#fafafa", cursor: "pointer", resize: "none", color: "#1a1a1a" }} /><div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Click to copy all</div><a href={`mailto:?bcc=${encodeURIComponent(allEmails)}`} style={{ display: "inline-block", marginTop: 8, padding: "8px 16px", background: "var(--g)", color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Open in Mail App (BCC All)</a></div><div className="card" style={{ overflowX: "auto" }}><div className="sec">All Contacts</div><table className="tbl" style={{ minWidth: 320 }}><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{entries.map((entry, i) => { const email = entry[0]; const info = entry[1]; return <tr key={email}><td style={{ color: "#bbb", fontSize: 11 }}>{i + 1}</td><td style={{ fontWeight: 600 }}>{info.name || "-"}</td><td><a href={`mailto:${email}`} style={{ color: "var(--g)", textDecoration: "none", fontSize: 12 }}>{email}</a></td><td><span className="bgry" style={{ fontSize: 10 }}>{info.role}</span></td></tr>; })}</tbody></table></div></div>}
        </div>
      );
    }

    if (view === "settings") return (
      <div className="fade" style={{ padding: pad, maxWidth: 520 }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 20 }}>Configure semester and school info</p>
        <div className="card" style={{ marginBottom: 14 }}><div className="sec">Current Semester</div><div className="fg" style={{ marginBottom: 12 }}><label>Semester Name</label><input value={semesterLabel} onChange={e => setSemesterLabel(e.target.value)} placeholder="e.g. Fall 2025 or Winter 2026" /></div><div className="fg"><label>Semester Length (months)</label><input type="number" min={1} max={12} value={semesterMonths} onChange={e => setSemesterMonths(parseInt(e.target.value) || 5)} /></div></div>
        <div className="card" style={{ marginBottom: 14 }}><div className="sec">Database</div><div style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>Connected to Supabase</div><div style={{ fontSize: 12, color: "#bbb" }}>{`${persons.length} persons · ${families.length} families · ${enrollments.length} enrollments`}</div></div>
        <div className="card"><div className="sec">Account</div><div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Signed in as <strong>{session.user.email}</strong></div><button className="btn bd bsm" onClick={handleLogout}>Sign Out</button></div>
      </div>
    );

    return null;
  }

  return (
    <div style={{ fontFamily: "'Red Hat Display', sans-serif", background: "#f8f6f1", minHeight: "100vh", width: "100%" }}>
      <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <SavingBanner />
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}><MobileHeader /><div style={{ flex: 1, overflowY: "auto" }}>{renderMain()}</div><BottomNav /></div>
      ) : (
        <div style={{ display: "flex", minHeight: "100vh" }}><Sidebar /><main style={{ flex: 1, overflowY: "auto" }}>{renderMain()}</main></div>
      )}

      {paymentModal && (() => { const enroll = enrollments.find(e => e.id === paymentModal.enrollmentId); const person = enroll ? persons.find(p => p.id === enroll.personId) : null; const bal = enroll ? enrollBalance(enroll) : 0; if (!enroll || !person) return null; return <div className="mbg" onClick={() => setPaymentModal(null)}><div className="modal fade" onClick={e => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><h2 style={{ fontSize: 19, fontWeight: 700 }}>Record Payment</h2><button className="btn" onClick={() => setPaymentModal(null)} style={{ fontSize: 20, color: "#bbb", padding: "0 6px" }}>x</button></div><div style={{ background: "#f8f6f1", borderRadius: 10, padding: 12, marginBottom: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}><span className="sn">{person.studentNum}</span><span style={{ fontWeight: 700 }}>{`${person.firstName} ${person.lastName}`}</span></div><div style={{ fontSize: 12, color: "#888" }}>{`${PROGRAMS[enroll.program]} — ${enroll.teacherName}`}</div><div style={{ fontSize: 13, marginTop: 3 }}>{"Balance: "}<span style={{ color: "var(--red)", fontWeight: 700 }}>{`$${bal.toFixed(2)}`}</span></div></div><div className="r2" style={{ marginBottom: 12 }}><div className="fg"><label>Amount ($) *</label><MoneyInput value={instalment.amount} onChange={v => setInstalment(p => ({ ...p, amount: v }))} placeholder={`Up to $${bal.toFixed(2)}`} autoFocus /></div><div className="fg"><label>Date *</label><input type="date" value={instalment.date} onChange={e => setInstalment(p => ({ ...p, date: e.target.value }))} /></div></div><div className="fg" style={{ marginBottom: 12 }}><label>Method</label><select value={instalment.method} onChange={e => setInstalment(p => ({ ...p, method: e.target.value }))}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select></div><div className="fg" style={{ marginBottom: 12 }}><label>Note</label><input value={instalment.note} onChange={e => setInstalment(p => ({ ...p, note: e.target.value }))} placeholder="Optional" /></div><div style={{ background: "#fef5e4", border: "1px solid #f0d080", borderRadius: 8, padding: 10, marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", marginBottom: 6 }}>Override Balance (optional)</div><div className="fg"><label>Custom balance ($)</label><MoneyInput value={customBal} onChange={setCustomBal} placeholder={`Auto: $${Math.max(0, bal - (parseFloat(instalment.amount) || 0)).toFixed(2)}`} /></div></div><div style={{ display: "flex", gap: 8 }}><button className="btn bp" onClick={addPayment} disabled={saving}>{saving ? "Saving..." : "Confirm & Receipt"}</button><button className="btn bg" onClick={() => { setPaymentModal(null); setCustomBal(""); }}>Cancel</button></div></div></div>; })()}

      {editPaymentModal && (() => { const enroll = enrollments.find(e => e.id === editPaymentModal.enrollmentId); const person = enroll ? persons.find(p => p.id === enroll.personId) : null; if (!enroll || !person) return null; return <div className="mbg" onClick={() => setEditPaymentModal(null)}><div className="modal fade" onClick={e => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><h2 style={{ fontSize: 19, fontWeight: 700 }}>Edit Payment</h2><button className="btn" onClick={() => setEditPaymentModal(null)} style={{ fontSize: 20, color: "#bbb", padding: "0 6px" }}>x</button></div><div style={{ background: "#f8f6f1", borderRadius: 10, padding: 10, marginBottom: 14, fontSize: 13 }}><span className="sn" style={{ marginRight: 7 }}>{person.studentNum}</span><strong>{`${person.firstName} ${person.lastName}`}</strong></div><div className="r2" style={{ marginBottom: 12 }}><div className="fg"><label>Amount ($)</label><MoneyInput value={editPaymentForm.amount} onChange={v => setEditPaymentForm(p => ({ ...p, amount: v }))} autoFocus /></div><div className="fg"><label>Date</label><input type="date" value={editPaymentForm.date} onChange={e => setEditPaymentForm(p => ({ ...p, date: e.target.value }))} /></div></div><div className="fg" style={{ marginBottom: 12 }}><label>Method</label><select value={editPaymentForm.method} onChange={e => setEditPaymentForm(p => ({ ...p, method: e.target.value }))}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select></div><div className="fg" style={{ marginBottom: 16 }}><label>Note</label><input value={editPaymentForm.note} onChange={e => setEditPaymentForm(p => ({ ...p, note: e.target.value }))} placeholder="Optional" /></div><div style={{ display: "flex", gap: 8 }}><button className="btn bp" onClick={saveEditedPayment} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button><button className="btn bg" onClick={() => setEditPaymentModal(null)}>Cancel</button></div></div></div>; })()}

      {receiptModal && <ReceiptView person={receiptModal.person} enrollment={receiptModal.enrollment} payment={receiptModal.payment} receiptNum={receiptModal.receiptNum} semesterLabel={semesterLabel} onClose={() => setReceiptModal(null)} />}
    </div>
  );
}
