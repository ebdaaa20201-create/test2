import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center diamond-pattern relative overflow-hidden pt-20">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block p-2 rounded-full glow-purple">
            <img
              src={logo}
              alt="إبداع للتصميم والمونتاج"
              className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black font-tajawal text-gradient-purple mb-4"
        >
          إبداع
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl md:text-2xl text-gradient-gold font-bold mb-6"
        >
          للتصميم والمونتاج
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10"
        >
          نحوّل أفكارك إلى إبداع بصري يلفت الأنظار. خبرة واحترافية في التصميم الجرافيكي والمونتاج المرئي.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#portfolio"
            className="px-8 py-4 gradient-purple text-primary-foreground rounded-lg font-bold text-lg shadow-luxury hover:opacity-90 transition-opacity"
          >
            شاهد أعمالنا
          </a>
          <a
            href="#contact"
            className="px-8 py-4 gradient-gold text-foreground rounded-lg font-bold text-lg shadow-luxury hover:opacity-90 transition-opacity"
          >
            اطلب الآن
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
