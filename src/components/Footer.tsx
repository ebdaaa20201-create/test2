import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt="إبداع" className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h3 className="text-xl font-bold font-tajawal text-gradient-purple">إبداع</h3>
              <p className="text-sm text-muted-foreground">للتصميم والمونتاج</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              <span dir="ltr">0504281823</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          جميع الحقوق محفوظة © {new Date().getFullYear()} إبداع للتصميم والمونتاج
        </div>
      </div>
    </footer>
  );
};

export default Footer;
