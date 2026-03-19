import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, MessageCircle } from "lucide-react";
import { incrementStat } from "@/lib/db";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", service: "", details: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `✨ طلب جديد من موقع إبداع ✨%0A%0Aالاسم: ${form.name}%0Aالجوال: ${form.phone}%0Aالخدمة: ${form.service}%0Aالتفاصيل: ${form.details}`;
    window.open(`https://wa.me/966504281823?text=${message}`, "_blank");

    // Track request
    incrementStat("total_requests").catch(console.error);

    setForm({ name: "", phone: "", service: "", details: "" });
  };

  return (
    <section id="contact" className="py-24 diamond-pattern">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black font-tajawal text-gradient-purple mb-4">اطلب الآن</h2>
          <div className="w-24 h-1 gradient-gold mx-auto rounded-full mb-6" />
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Phone size={18} />
            <span className="font-bold" dir="ltr">0504281823</span>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-8 shadow-luxury border border-border space-y-6"
        >
          <div>
            <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="أدخل اسمك"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">رقم الجوال</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="05xxxxxxxx"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">نوع الخدمة</label>
            <select
              required
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="">اختر الخدمة</option>
              <option>تصميم هوية بصرية</option>
              <option>مونتاج فيديو</option>
              <option>تصميم سوشيال ميديا</option>
              <option>تصميم مطبوعات</option>
              <option>موشن جرافيك</option>
              <option>تصميم واجهات</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">تفاصيل الطلب</label>
            <textarea
              required
              rows={4}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              placeholder="اكتب تفاصيل طلبك..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 gradient-purple text-primary-foreground rounded-lg font-bold text-lg shadow-luxury hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
          >
            <MessageCircle size={22} />
            أرسل عبر واتساب
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactForm;
