import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/966504281823"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg animate-float"
      style={{ backgroundColor: "#25D366" }}
      aria-label="تواصل واتساب"
    >
      <MessageCircle className="text-primary-foreground" size={28} />
    </a>
  );
};

export default WhatsAppButton;
