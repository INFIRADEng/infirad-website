import { ArrowLeft, ArrowRight, CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const stages = [
  {
    number: '01',
    arTitle: 'نحدد مهمة قابلة للقياس',
    enTitle: 'Define a measurable task',
    arText: 'نختار عملاً واضح المدخلات والمخرجات، ونحدد معيار النجاح والحدود ونقاط الموافقة.',
    enText: 'We choose a task with clear inputs and outputs, then define success, boundaries, and approval points.',
  },
  {
    number: '02',
    arTitle: 'نبني تطبيقاً محدوداً',
    enTitle: 'Build a bounded implementation',
    arText: 'نطبّق النظام على نطاق يمكن مراجعته، ونقارن أداءه بالطريقة الحالية قبل أي توسع.',
    enText: 'We implement within a reviewable scope and compare it with the current method before scaling.',
  },
  {
    number: '03',
    arTitle: 'نتوسع بما تثبته النتائج',
    enTitle: 'Scale what the evidence supports',
    arText: 'نربط مزيداً من الأدوات والمهام فقط عندما تثبت الجودة والجدوى التشغيلية.',
    enText: 'We connect more tools and tasks only when quality and operational value are demonstrated.',
  },
];

export default function EngagementSection() {
  const { isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section id="engagement" className="relative overflow-hidden bg-primary py-24 text-white lg:py-32">
      <div className="technical-grid absolute inset-0 opacity-15" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <div className="eyebrow border-white/20 bg-white/7 text-white">
              <span className="eyebrow-dot" />
              <span className="ar-content">طريقة البدء</span>
              <span className="en-content">How to begin</span>
            </div>
            <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="ar-content">ابدأ بمهمة، ثم توسّع بالدليل.</span>
              <span className="en-content">Start with a task. Scale with evidence.</span>
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-white/65">
              <span className="ar-content">يمكن أن يبدأ التعاون بدراسة أو نموذج أو وكيل محدود. القيمة تُقاس قبل أن يتحول الحل إلى منظومة أوسع.</span>
              <span className="en-content">An engagement may begin with a study, model, or bounded agent. Value is measured before the solution becomes a wider system.</span>
            </p>

            <div className="mt-8 flex items-start gap-3 border-s-2 border-secondary ps-5 text-base font-bold leading-relaxed text-secondary sm:text-lg">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
              <span className="ar-content">الوكيل ينفّذ ويوثّق؛ القرار المهني والمسؤولية يبقيان لأهل الاختصاص.</span>
              <span className="en-content">The agent executes and documents; professional judgment and responsibility remain with qualified experts.</span>
            </div>
          </div>

          <div className="grid gap-4">
            {stages.map((stage) => (
              <article key={stage.number} className="group grid gap-4 rounded-2xl border border-white/12 bg-white/5 p-6 transition-colors hover:bg-white/9 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7">
                <span className="text-sm font-bold tracking-[0.2em] text-secondary">{stage.number}</span>
                <div>
                  <h3 className="text-2xl font-bold">
                    <span className="ar-content">{stage.arTitle}</span>
                    <span className="en-content">{stage.enTitle}</span>
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-white/60 sm:text-lg">
                    <span className="ar-content">{stage.arText}</span>
                    <span className="en-content">{stage.enText}</span>
                  </p>
                </div>
                <Arrow className="hidden h-5 w-5 text-white/25 transition-transform group-hover:-translate-x-1 sm:block ltr:group-hover:translate-x-1" />
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-8 rounded-[1.75rem] bg-white p-7 text-primary shadow-2xl sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              <span className="ar-content">من الفكرة إلى اليقين</span>
              <span className="en-content">From Idea to Certainty</span>
            </p>
            <h3 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              <span className="ar-content">لديك مهمة مهنية أو قرار فني لا تكفيه الأدوات العامة؟</span>
              <span className="en-content">Have a professional task or technical decision that general tools cannot handle?</span>
            </h3>
          </div>
          <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:justify-end">
            <Button asChild size="lg" className="min-h-13 flex-1 gap-2 bg-primary px-5 text-base font-bold text-white hover:bg-primary/90 lg:flex-none">
              <a href="https://wa.me/966530151525" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                <span className="ar-content">واتساب</span>
                <span className="en-content">WhatsApp</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-13 flex-1 gap-2 border-primary/20 px-5 text-base font-bold text-primary hover:bg-accent lg:flex-none">
              <a href="mailto:info@infiradeng.com">
                <Mail className="h-5 w-5" />
                <span className="ar-content">البريد الإلكتروني</span>
                <span className="en-content">Email</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
