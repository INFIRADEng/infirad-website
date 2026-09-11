import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Bot,
  FileCheck2,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const scrollToPaths = () => {
    document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-shell relative min-h-screen overflow-hidden bg-primary pt-24 text-white">
      <div className="technical-grid absolute inset-0 opacity-20" />
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />

      <div className="container relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] items-center gap-12 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:py-20">
        <div className="max-w-3xl space-y-8 animate-fade-in-up">
          <div className="eyebrow border-white/20 bg-white/7 text-white">
            <span className="eyebrow-dot" />
            <span className="ar-content">ذكاء اصطناعي تطبيقي للعمل المتخصص</span>
            <span className="en-content">Applied AI for specialized work</span>
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="ar-content">
                ذكاء اصطناعي يعمل <span className="text-secondary">داخل التخصص.</span>
              </span>
              <span className="en-content">
                AI that works <span className="text-secondary">inside the discipline.</span>
              </span>
            </h1>

            <p className="max-w-2xl text-xl font-medium leading-relaxed text-white/80 md:text-2xl">
              <span className="ar-content">
                نبني وكلاء متخصصين وأنظمة عمل ذكية تنفّذ المهام المهنية والتقنية المعقدة — بمصادر الجهة وأدواتها ومنهجيتها، وتحت إشراف المختص.
              </span>
              <span className="en-content">
                We build specialized agents and intelligent work systems for complex professional and technical tasks — grounded in the organization&apos;s sources, tools, and methods, with expert oversight.
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={scrollToPaths}
              className="min-h-14 gap-3 bg-white px-6 text-lg font-bold text-primary shadow-xl transition-brutal hover:bg-secondary"
            >
              <span className="ar-content">استكشف مسارات العمل</span>
              <span className="en-content">Explore our work</span>
              <Arrow className="h-5 w-5" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-14 gap-3 border-2 border-white/25 bg-white/5 px-6 text-lg font-bold text-white backdrop-blur-sm transition-brutal hover:bg-white hover:text-primary"
            >
              <a href="https://wa.me/966530151525" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                <span className="ar-content">ناقش مهمة</span>
                <span className="en-content">Discuss a task</span>
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6 text-base font-bold leading-relaxed text-white/70 sm:text-lg">
            <span className="ar-content">وكلاء متخصصون</span>
            <span className="en-content">Specialized agents</span>
            <span aria-hidden="true" className="text-secondary">/</span>
            <span className="ar-content">هندسة ومحاكاة</span>
            <span className="en-content">Engineering &amp; simulation</span>
            <span aria-hidden="true" className="text-secondary">/</span>
            <span className="ar-content">مخرجات قابلة للمراجعة</span>
            <span className="en-content">Reviewable outputs</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl animate-fade-in lg:mx-0">
          <div className="agent-console relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#071f31]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-base font-bold uppercase tracking-[0.16em] text-secondary">
                  <span className="ar-content">من المعرفة إلى التنفيذ</span>
                  <span className="en-content">From knowledge to execution</span>
                </p>
                <p className="mt-2 text-xl font-bold leading-snug text-white">
                  <span className="ar-content">نظام عمل مهني قابل للتتبع</span>
                  <span className="en-content">A traceable professional workflow</span>
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary/30 bg-secondary/10">
                <ShieldCheck className="h-5 w-5 text-secondary" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flow-node">
                <div className="flow-icon"><BookOpenText /></div>
                <div className="min-w-0 flex-1">
                  <p className="flow-kicker">01</p>
                  <p className="flow-title">
                    <span className="ar-content">مصادر الجهة ومنهجيتها</span>
                    <span className="en-content">Organization sources &amp; methods</span>
                  </p>
                </div>
                <FileCheck2 className="h-5 w-5 text-white/35" />
              </div>

              <div className="flow-connector" />

              <div className="flow-node flow-node-active">
                <div className="flow-icon"><Bot /></div>
                <div className="min-w-0 flex-1">
                  <p className="flow-kicker">02</p>
                  <p className="flow-title">
                    <span className="ar-content">وكيل متخصص يستخدم الأدوات</span>
                    <span className="en-content">A specialist agent using real tools</span>
                  </p>
                </div>
                <Wrench className="h-5 w-5 text-secondary" />
              </div>

              <div className="flow-connector" />

              <div className="flow-node">
                <div className="flow-icon"><FileCheck2 /></div>
                <div className="min-w-0 flex-1">
                  <p className="flow-kicker">03</p>
                  <p className="flow-title">
                    <span className="ar-content">مخرج موثق يراجعه المختص</span>
                    <span className="en-content">A documented, expert-reviewed output</span>
                  </p>
                </div>
                <ShieldCheck className="h-5 w-5 text-white/35" />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-base leading-relaxed text-white/70 sm:text-lg">
              <span className="ar-content">الذكاء الاصطناعي ينفّذ ويوثّق. المسؤولية المهنية تبقى لدى أهل الاختصاص.</span>
              <span className="en-content">AI executes and documents. Professional responsibility remains with qualified experts.</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToPaths}
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/50 transition-colors hover:text-white"
        aria-label={isArabic ? 'انتقل إلى مسارات العمل' : 'Go to work paths'}
      >
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  );
}
