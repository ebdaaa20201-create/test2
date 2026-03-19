import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye, MessageCircle, Image, Plus, Trash2, ArrowRight, LogOut,
  Edit3, LayoutDashboard, FolderOpen, Settings, Upload, User, Lock, ImageIcon, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchWorks, addWork as dbAddWork, updateWork as dbUpdateWork, deleteWork as dbDeleteWork,
  getStats, getSetting, setSetting, type Work
} from "@/lib/db";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "works" | "settings">("overview");
  const [visits, setVisits] = useState(0);
  const [requests, setRequests] = useState(0);
  const [works, setWorks] = useState<Work[]>([]);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [newWork, setNewWork] = useState<Partial<Work>>({
    title: "", category: "تصميم", image: "", description: "",
    images: [], client: "", duration: "", tools: ""
  });
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsAuth(true);
        // Check admin role
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();
        setIsAdmin(!!data);
      } else {
        setIsAuth(false);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setIsAuth(true);
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();
        setIsAdmin(!!data);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const [worksData, stats, logo] = await Promise.all([
        fetchWorks(), getStats(), getSetting("site_logo"),
      ]);
      setWorks(worksData);
      setVisits(stats.total_visits || 0);
      setRequests(stats.total_requests || 0);
      setLogoUrl(logo);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    if (isAuth && isAdmin) loadData();
  }, [isAuth, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError("بيانات تسجيل الدخول غير صحيحة");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuth(false);
    setIsAdmin(false);
  };

  const addWork = async () => {
    if (!newWork.title || !newWork.image) return;
    setSaving(true);
    try {
      await dbAddWork({
        title: newWork.title!, category: newWork.category || "تصميم",
        image: newWork.image!, description: newWork.description || "",
        images: newWork.images?.filter(Boolean) || [newWork.image!],
        client: newWork.client || "", duration: newWork.duration || "", tools: newWork.tools || "",
      });
      setNewWork({ title: "", category: "تصميم", image: "", description: "", images: [], client: "", duration: "", tools: "" });
      await loadData();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleUpdateWork = async () => {
    if (!editingWork) return;
    setSaving(true);
    try {
      await dbUpdateWork(editingWork.id, editingWork);
      setEditingWork(null);
      await loadData();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleDeleteWork = async (id: number) => {
    try { await dbDeleteWork(id); await loadData(); } catch (err) { console.error(err); }
  };

  const saveLogo = async () => {
    setSaving(true);
    try { await setSetting("site_logo", logoUrl); alert("تم حفظ الشعار بنجاح!"); } catch (err) { console.error(err); }
    setSaving(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuth || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center diamond-pattern">
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleLogin}
          className="bg-card rounded-2xl p-8 shadow-luxury border border-border w-full max-w-sm space-y-5"
        >
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center">
              <Lock className="text-primary-foreground" size={28} />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-tajawal text-gradient-purple text-center">لوحة التحكم</h2>

          {loginError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle size={16} />
              {loginError}
            </div>
          )}

          {isAuth && !isAdmin && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle size={16} />
              ليس لديك صلاحيات المدير
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="أدخل بريدك الإلكتروني" className="w-full pr-10 pl-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none" dir="ltr" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" className="w-full pr-10 pl-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none" dir="ltr" />
            </div>
          </div>
          <button type="submit" className="w-full py-3 gradient-purple text-primary-foreground rounded-lg font-bold text-lg">تسجيل الدخول</button>
          <button type="button" onClick={() => navigate("/")} className="w-full text-center text-sm text-muted-foreground hover:text-primary">العودة للموقع</button>
        </motion.form>
      </div>
    );
  }

  const sidebarItems = [
    { id: "overview" as const, label: "نظرة عامة", icon: LayoutDashboard },
    { id: "works" as const, label: "إدارة الأعمال", icon: FolderOpen },
    { id: "settings" as const, label: "الإعدادات", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-l border-border min-h-screen p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center">
            <LayoutDashboard className="text-primary-foreground" size={20} />
          </div>
          <h1 className="text-xl font-black font-tajawal text-gradient-purple">لوحة التحكم</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "gradient-purple text-primary-foreground shadow-luxury" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2 pt-6 border-t border-border">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <ArrowRight size={18} />
            زيارة الموقع
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold font-tajawal text-gradient-purple">لوحة التحكم</h1>
        <div className="flex gap-2">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-2 rounded-lg transition-all ${activeTab === item.id ? "gradient-purple text-primary-foreground" : "text-muted-foreground"}`}>
              <item.icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black font-tajawal mb-8 text-foreground">نظرة عامة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-luxury border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center"><Eye className="text-primary-foreground" size={24} /></div>
                  <div><p className="text-sm text-muted-foreground">إجمالي الزيارات</p><p className="text-3xl font-black text-foreground">{visits}</p></div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 shadow-luxury border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 gradient-gold rounded-2xl flex items-center justify-center"><MessageCircle className="text-foreground" size={24} /></div>
                  <div><p className="text-sm text-muted-foreground">إجمالي الطلبات</p><p className="text-3xl font-black text-foreground">{requests}</p></div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-luxury border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center"><Image className="text-primary" size={24} /></div>
                  <div><p className="text-sm text-muted-foreground">عدد الأعمال</p><p className="text-3xl font-black text-foreground">{works.length}</p></div>
                </div>
              </motion.div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-luxury border border-border">
              <h3 className="text-lg font-bold font-tajawal mb-4">آخر الأعمال</h3>
              {works.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">لا توجد أعمال بعد</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {works.slice(0, 4).map((w) => (
                    <div key={w.id} className="rounded-xl overflow-hidden border border-border">
                      <img src={w.image} alt={w.title} className="w-full h-28 object-cover" />
                      <div className="p-2"><p className="text-xs font-bold truncate">{w.title}</p><p className="text-xs text-muted-foreground">{w.category}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "works" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black font-tajawal mb-8 text-foreground">إدارة الأعمال</h2>
            <div className="bg-card rounded-2xl p-6 shadow-luxury border border-border mb-8">
              <h3 className="text-lg font-bold font-tajawal mb-6 flex items-center gap-2"><Plus size={20} className="text-primary" />إضافة عمل جديد</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input value={newWork.title} onChange={(e) => setNewWork({ ...newWork, title: e.target.value })} placeholder="عنوان العمل" className="px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" />
                <select value={newWork.category} onChange={(e) => setNewWork({ ...newWork, category: e.target.value })} className="px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none">
                  <option>تصميم</option><option>هوية</option><option>مونتاج</option>
                </select>
                <input value={newWork.image} onChange={(e) => setNewWork({ ...newWork, image: e.target.value })} placeholder="رابط الصورة الرئيسية" className="px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" dir="ltr" />
                <input value={newWork.description || ""} onChange={(e) => setNewWork({ ...newWork, description: e.target.value })} placeholder="وصف العمل" className="px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input value={newWork.client || ""} onChange={(e) => setNewWork({ ...newWork, client: e.target.value })} placeholder="اسم العميل" className="px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" />
                <input value={newWork.duration || ""} onChange={(e) => setNewWork({ ...newWork, duration: e.target.value })} placeholder="مدة التنفيذ" className="px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" />
                <input value={newWork.tools || ""} onChange={(e) => setNewWork({ ...newWork, tools: e.target.value })} placeholder="الأدوات المستخدمة" className="px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" />
              </div>
              <button onClick={addWork} disabled={saving} className="gradient-purple text-primary-foreground rounded-xl px-8 py-3 font-bold flex items-center gap-2 disabled:opacity-50">
                <Plus size={18} />{saving ? "جاري الحفظ..." : "إضافة العمل"}
              </button>
            </div>

            {editingWork && (
              <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setEditingWork(null)}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card rounded-2xl p-6 shadow-luxury border border-border w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-bold font-tajawal text-gradient-purple">تعديل العمل</h3>
                  <input value={editingWork.title} onChange={(e) => setEditingWork({ ...editingWork, title: e.target.value })} placeholder="العنوان" className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" />
                  <select value={editingWork.category} onChange={(e) => setEditingWork({ ...editingWork, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none">
                    <option>تصميم</option><option>هوية</option><option>مونتاج</option>
                  </select>
                  <input value={editingWork.image} onChange={(e) => setEditingWork({ ...editingWork, image: e.target.value })} placeholder="رابط الصورة" className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" dir="ltr" />
                  <input value={editingWork.description || ""} onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })} placeholder="الوصف" className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" />
                  <div className="grid grid-cols-3 gap-3">
                    <input value={editingWork.client || ""} onChange={(e) => setEditingWork({ ...editingWork, client: e.target.value })} placeholder="العميل" className="px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none text-sm" />
                    <input value={editingWork.duration || ""} onChange={(e) => setEditingWork({ ...editingWork, duration: e.target.value })} placeholder="المدة" className="px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none text-sm" />
                    <input value={editingWork.tools || ""} onChange={(e) => setEditingWork({ ...editingWork, tools: e.target.value })} placeholder="الأدوات" className="px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none text-sm" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleUpdateWork} disabled={saving} className="flex-1 py-3 gradient-purple text-primary-foreground rounded-xl font-bold disabled:opacity-50">{saving ? "جاري الحفظ..." : "حفظ التعديلات"}</button>
                    <button onClick={() => setEditingWork(null)} className="px-6 py-3 bg-muted rounded-xl font-bold text-muted-foreground">إلغاء</button>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="bg-card rounded-2xl p-6 shadow-luxury border border-border">
              <h3 className="text-lg font-bold font-tajawal mb-6">جميع الأعمال ({works.length})</h3>
              {works.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">لا توجد أعمال مضافة بعد. ابدأ بإضافة أول عمل!</p>
              ) : (
                <div className="space-y-3">
                  {works.map((work) => (
                    <div key={work.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-all">
                      <img src={work.image} alt={work.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground truncate">{work.title}</h4>
                        <span className="text-sm text-muted-foreground">{work.category}</span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setEditingWork(work)} className="p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-colors" title="تعديل"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteWork(work.id)} className="p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors" title="حذف"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black font-tajawal mb-8 text-foreground">الإعدادات</h2>
            <div className="bg-card rounded-2xl p-6 shadow-luxury border border-border mb-8">
              <h3 className="text-lg font-bold font-tajawal mb-6 flex items-center gap-2"><ImageIcon size={20} className="text-primary" />تغيير شعار الموقع</h3>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                  {logoUrl ? <img src={logoUrl} alt="الشعار" className="w-full h-full object-cover" /> : <Upload className="text-muted-foreground" size={28} />}
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="أدخل رابط الشعار الجديد" className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary outline-none" dir="ltr" />
                  <button onClick={saveLogo} disabled={saving} className="gradient-purple text-primary-foreground rounded-xl px-8 py-3 font-bold disabled:opacity-50">
                    {saving ? "جاري الحفظ..." : "حفظ الشعار"}
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-luxury border border-border">
              <h3 className="text-lg font-bold font-tajawal mb-4 flex items-center gap-2"><User size={20} className="text-primary" />معلومات الحساب</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
                  <span className="text-muted-foreground">البريد الإلكتروني</span>
                  <span className="font-bold text-sm" dir="ltr">{email || "—"}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
                  <span className="text-muted-foreground">الصلاحية</span>
                  <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">مدير</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
