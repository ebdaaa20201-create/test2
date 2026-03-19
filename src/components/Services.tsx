import { motion } from "framer-motion";
import { Palette, Film, Image, FileText, Megaphone, PenTool } from "lucide-react";

const services = [
  { icon: Palette, title: "تصميم الهوية البصرية", desc: "شعارات وهويات تجارية متكاملة تعكس رؤيتك" },
  { icon: Film, title: "المونتاج المرئي", desc: "مونتاج فيديوهات احترافي بأحدث التقنيات" },
  { icon: Image, title: "تصميم السوشيال ميديا", desc: "تصاميم جذابة لمنصات التواصل الاجتماعي" },
  { icon: FileText, title: "تصميم المطبوعات", desc: "بروشورات وكروت وملفات تعريفية احترافية" },
  { icon: Megaphone, title: "الإعلانات المرئية", desc: "موشن جرافيك وإعلانات فيديو مؤثرة" },
  { icon: PenTool, title: "تصميم UI/UX", desc: "تصميم واجهات مستخدم عصرية وسهلة الاستخدام" },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black font-tajawal text-gradient-purple mb-4">خدماتنا</h2>
          <div className="w-24 h-1 gradient-gold mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-card rounded-xl p-8 shadow-luxury border border-border hover:border-primary/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-xl gradient-purple flex items-center justify-center mb-6 group-hover:glow-purple transition-all">
                <service.icon className="text-primary-foreground" size={28} />
              </div>
              <h3 className="text-xl font-bold font-tajawal mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
