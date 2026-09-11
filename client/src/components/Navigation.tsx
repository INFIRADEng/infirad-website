import { useEffect, useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { id: 'about', ar: 'الفرق', en: 'The difference' },
  { id: 'capabilities', ar: 'مسارات العمل', en: 'Our work' },
  { id: 'methodology', ar: 'المنهجية', en: 'Method' },
  { id: 'engagement', ar: 'ابدأ معنا', en: 'Start' },
];

export default function Navigation() {
  const { language, toggleLanguage, isArabic } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      aria-label={isArabic ? 'التنقل الرئيسي' : 'Primary navigation'}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'border-b border-primary/10 bg-white/95 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={isArabic ? 'العودة إلى أعلى الصفحة' : 'Back to top'}>
          <img
            src={isScrolled || isMobileMenuOpen ? '/logo_ar_en_T.PNG' : '/logo_ar_en_GT.PNG'}
            alt="INFIRAD / انفِراد"
            className="h-11 w-auto object-contain sm:h-12"
          />
        </button>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-base font-bold transition-colors ${
                isScrolled ? 'text-primary/75 hover:text-primary' : 'text-white/75 hover:text-white'
              }`}
            >
              <span className="ar-content">{item.ar}</span>
              <span className="en-content">{item.en}</span>
            </button>
          ))}

          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className={`min-h-10 gap-2 border-2 px-4 font-bold ${
              isScrolled
                ? 'border-primary/15 bg-white text-primary hover:bg-accent'
                : 'border-white/20 bg-white/5 text-white hover:bg-white hover:text-primary'
            }`}
          >
            <Globe className="h-4 w-4" />
            {language === 'ar' ? 'English' : 'العربية'}
          </Button>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className={`rounded-lg p-2 transition-colors lg:hidden ${
            isScrolled || isMobileMenuOpen ? 'text-primary hover:bg-accent' : 'text-white hover:bg-white/10'
          }`}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? (isArabic ? 'إغلاق القائمة' : 'Close menu') : (isArabic ? 'فتح القائمة' : 'Open menu')}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-navigation" className="border-t border-primary/10 bg-white lg:hidden">
          <div className="container mx-auto grid gap-1 px-6 py-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="rounded-lg px-3 py-3 text-start text-base font-bold text-primary hover:bg-accent"
              >
                <span className="ar-content">{item.ar}</span>
                <span className="en-content">{item.en}</span>
              </button>
            ))}
            <Button onClick={toggleLanguage} variant="outline" className="mt-3 min-h-12 gap-2 border-primary/15 font-bold text-primary">
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
