import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWorks, type Work } from "@/lib/db";

const categories = ["الكل", "هوية", "تصميم", "مونتاج"];

const Portfolio = () => {
  const [filter, setFilter] = useState("الكل");
  const [works, setWorks] = useState<Work[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorks().then(setWorks).catch(console.error);
  }, []);

  const filtered = filter === "الكل" ? works : works.filter((w) => w.category === filter);

  return (
    <section id="portfolio" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black font-tajawal text-gradient-purple mb-4">أعمالنا</h2>
          <div className="w-24 h-1 gradient-gold mx-auto rounded-full" />
        </motion.div>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === cat
                  ? "gradient-purple text-primary-foreground shadow-luxury"
                  : "bg-muted text-muted-foreground hover:bg-primary/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((work) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative rounded-xl overflow-hidden shadow-luxury cursor-pointer"
                onClick={() => navigate(`/product/${work.id}`)}
              >
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div>
                    <h3 className="text-primary-foreground font-bold text-lg">{work.title}</h3>
                    <span className="text-sm" style={{ color: "hsl(var(--gold))" }}>{work.category}</span>
                  </div>
                  <Eye className="absolute top-4 left-4 text-primary-foreground" size={24} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
