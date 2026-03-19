import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import defaultLogo from "@/assets/logo.jpg";
import { getSetting } from "@/lib/db";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(defaultLogo);

  useEffect(() => {
    getSetting("site_logo").then((url) => {
      if (url) setLogoSrc(url);
    });
  }, []);

  const links = [
    { label: "الرئيسية", href: "#hero" },
    { label: "خدماتنا", href: "#services" },
    { label: "أعمالنا", href: "#portfolio" },
    { label: "تواصل معنا", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoSrc} alt="إبداع للتصميم والمونتاج" className="h-12 w-12 rounded-full object-cover shadow-luxury" />
          <div>
            <h1 className="text-lg font-bold font-tajawal text-gradient-purple">إبداع</h1>
            <p className="text-xs text-muted-foreground">للتصميم والمونتاج</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-muted">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block py-3 text-foreground/80 hover:text-primary border-b border-border/50 last:border-0">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
