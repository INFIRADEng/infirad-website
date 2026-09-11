import { Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-primary/10 bg-white py-16">
      <div className="container mx-auto grid gap-12 px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr]">
        <div>
          <img src="/logo_ar_en_T.PNG" alt="INFIRAD / انفِراد" className="h-12 w-auto object-contain" />
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-foreground/70">
            <span className="ar-content">شركة سعودية للذكاء الاصطناعي التطبيقي، تبني وكلاء متخصصين وأنظمة عمل ذكية للمهام المهنية والتقنية المعقدة.</span>
            <span className="en-content">A Saudi applied-AI company building specialized agents and intelligent work systems for complex professional and technical tasks.</span>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-primary"><span className="ar-content">تواصل</span><span className="en-content">Contact</span></h2>
          <div className="mt-5 grid gap-4 text-lg text-foreground/70">
            <a href="mailto:info@infiradeng.com" className="flex items-center gap-3 hover:text-primary"><Mail className="h-5 w-5" /> info@infiradeng.com</a>
            <a href="https://wa.me/966530151525" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary"><MessageCircle className="h-5 w-5" /><span className="phone-number">+966 530 151 525</span></a>
            <a href="https://www.linkedin.com/company/infirad/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary"><Linkedin className="h-5 w-5" /> LinkedIn</a>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-primary"><span className="ar-content">المقر</span><span className="en-content">Location</span></h2>
          <p className="mt-5 flex items-start gap-3 text-lg leading-relaxed text-foreground/70"><MapPin className="mt-1 h-5 w-5 shrink-0" /><span><span className="ar-content">الرياض، المملكة العربية السعودية</span><span className="en-content">Riyadh, Saudi Arabia</span></span></p>
        </div>
      </div>
      <div className="container mx-auto mt-14 flex flex-col gap-2 border-t border-primary/10 px-6 pt-7 text-base font-bold text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 INFIRAD</span>
        <span><span className="ar-content">من الفكرة إلى اليقين</span><span className="en-content">From Idea to Certainty</span></span>
      </div>
    </footer>
  );
}
