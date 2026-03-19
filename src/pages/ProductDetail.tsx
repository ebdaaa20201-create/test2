import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchWorks, incrementStat, type Work } from "@/lib/db";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", details: "" });
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorks().then((works) => {
      const found = works.find((w) => w.id === Number(id));
      setWork(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
          <button onClick={() => navigate("/")} className="gradient-purple text-primary-foreground px-6 py-3 rounded-lg font-bold">
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const images = work.images?.length ? work.images : [work.image];

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `✨ طلب خدمة: ${work.title} ✨%0A%0Aالاسم: ${form.name}%0Aالجوال: ${form.phone}%0Aالتفاصيل: ${form.details}`;
    window.open(`https://wa.me/966504281823?text=${message}`, "_blank");
    incrementStat("total_requests").catch(console.error);
  };

  return (
    <div className="min-h-screen">
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowRight size={20} />
            <span className="font-medium">العودة للمعرض</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative rounded-2xl overflow-hidden shadow-luxury mb-4">
                <img src={images[currentImage]} alt={work.title} className="w-full h-[400px] object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage((p) => (p + 1) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-card transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setCurrentImage((p) => (p - 1 + images.length) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-card transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImage === i ? "border-primary shadow-luxury" : "border-border opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium gradient-gold text-foreground mb-4">
                {work.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black font-tajawal text-gradient-purple mb-6">{work.title}</h1>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {work.description || "تصميم احترافي بجودة عالية ينفذ حسب متطلبات العميل مع إمكانية التعديل."}
              </p>

              <div className="bg-muted/50 rounded-xl p-6 border border-border mb-8 space-y-4">
                <h3 className="font-bold font-tajawal text-lg mb-2">تفاصيل المشروع</h3>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">العميل</span>
                  <span className="font-bold">{work.client || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">مدة التنفيذ</span>
                  <span className="font-bold">{work.duration || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الأدوات المستخدمة</span>
                  <span className="font-bold">{work.tools || "—"}</span>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-luxury border border-border">
                <h3 className="font-bold font-tajawal text-lg mb-4 text-gradient-purple">اطلب خدمة مشابهة</h3>
                <form onSubmit={handleOrder} className="space-y-4">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم الكامل" className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none transition-all" />
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="رقم الجوال" dir="ltr" className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none transition-all" />
                  <textarea required rows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="تفاصيل طلبك..." className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none transition-all resize-none" />
                  <button type="submit" className="w-full py-3 gradient-purple text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2">
                    <MessageCircle size={20} />
                    أرسل عبر واتساب
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
