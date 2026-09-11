import { Bot, ChartNoAxesCombined, Cog, Network, Route, ScanSearch } from 'lucide-react';

const paths = [
  {
    number: '01',
    icon: Bot,
    arEyebrow: 'الوكلاء المتخصصون والأتمتة',
    enEyebrow: 'Specialized agents & automation',
    arTitle: 'أنظمة ذكية تعمل داخل المهنة',
    enTitle: 'Intelligent systems that work inside the profession',
    arText: 'نحوّل المعرفة والإجراءات والأدوات المتفرقة إلى وكلاء ينفّذون مهاماً مركبة، ويوثقون ما فعلوه، ويعملون ضمن صلاحيات واضحة.',
    enText: 'We turn fragmented knowledge, procedures, and tools into agents that execute complex tasks, document their work, and operate within clear permissions.',
    arItems: ['بحث ومراجعة موثّقان', 'أتمتة سير العمل', 'فرق متعددة الوكلاء', 'تقارير وتحليلات دورية'],
    enItems: ['Referenced research & review', 'Workflow automation', 'Multi-agent teams', 'Recurring reports & analysis'],
    arStart: 'نقطة البداية: مهمة واحدة متكررة أو معقدة.',
    enStart: 'Start with one repetitive or complex task.',
    featured: true,
  },
  {
    number: '02',
    icon: Cog,
    arEyebrow: 'الهندسة والمحاكاة والبحث والتطوير',
    enEyebrow: 'Engineering, simulation & R&D',
    arTitle: 'عمق هندسي يختبر القرار قبل التنفيذ',
    enTitle: 'Engineering depth that tests the decision before execution',
    arText: 'نحوّل السؤال الفني إلى نموذج قابل للفحص، نقارن البدائل، ونغلق الدراسة باستنتاج واضح يدعم التطوير أو إعادة التصميم.',
    enText: 'We turn the technical question into an examinable model, compare alternatives, and close the study with a clear conclusion for development or redesign.',
    arItems: ['تصميم العمليات', 'محاكاة الأنظمة', 'CFD والتحليل الحراري', 'مراجعة وتحسين مستقلان'],
    enItems: ['Process design', 'System simulation', 'CFD & thermal analysis', 'Independent review & optimization'],
    arStart: 'نقطة البداية: سؤال فني يجب إغلاقه.',
    enStart: 'Start with a technical question that must be closed.',
  },
  {
    number: '03',
    icon: Route,
    arEyebrow: 'انسياب لمحاكاة الحركة المرورية',
    enEyebrow: 'INSYAB traffic simulation',
    arTitle: 'قرار مروري يُختبر قبل أن يُنفّذ',
    enTitle: 'A traffic decision tested before it is built',
    arText: 'نمثل الشبكة كما تعمل اليوم، نختبر أثر المشروع أو الإغلاق أو التحويلة عليها، ثم نقارن البدائل بالمقاييس نفسها.',
    enText: 'We model the network as it works today, test the impact of a project, closure, or diversion, and compare alternatives on the same measures.',
    arItems: ['الطرق والتقاطعات', 'الإغلاقات والتحويلات', 'تشخيص الاختناقات', 'أثر المشروع على الشبكة'],
    enItems: ['Roads & intersections', 'Closures & diversions', 'Bottleneck diagnosis', 'Network-wide project impact'],
    arStart: 'نقطة البداية: قرار مروري قبل التنفيذ.',
    enStart: 'Start with a traffic decision before implementation.',
  },
];

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="relative overflow-hidden bg-accent py-24 lg:py-32">
      <div className="technical-grid absolute inset-0 opacity-40" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="eyebrow mx-auto border-primary/15 bg-white text-primary">
            <span className="eyebrow-dot" />
            <span className="ar-content">مجالات العمل</span>
            <span className="en-content">Where we work</span>
          </div>
          <h2 className="mt-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="ar-content">ثلاثة مسارات مستقلة. منهج واحد منضبط.</span>
            <span className="en-content">Three independent paths. One disciplined method.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-foreground/65">
            <span className="ar-content">كل مسار يُقدّم كخدمة مستقلة بحسب مشكلة العميل، وتجمعها قدرة انفِراد على تحويل التعقيد إلى عمل قابل للفحص.</span>
            <span className="en-content">Each path is offered independently around the client&apos;s problem. They share INFIRAD&apos;s ability to turn complexity into examinable work.</span>
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <article
                key={path.number}
                className={`service-path flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-7 sm:p-8 ${
                  path.featured
                    ? 'border-primary bg-primary text-white shadow-2xl'
                    : 'border-primary/10 bg-white text-foreground shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${path.featured ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-base font-bold tracking-[0.2em] ${path.featured ? 'text-secondary' : 'text-primary/55'}`}>{path.number}</span>
                </div>

                <p className={`mt-8 text-base font-bold leading-relaxed sm:text-lg ${path.featured ? 'text-secondary' : 'text-primary/65'}`}>
                  <span className="ar-content">{path.arEyebrow}</span>
                  <span className="en-content">{path.enEyebrow}</span>
                </p>
                <h3 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
                  <span className="ar-content">{path.arTitle}</span>
                  <span className="en-content">{path.enTitle}</span>
                </h3>
                <p className={`mt-5 text-xl leading-relaxed ${path.featured ? 'text-white/75' : 'text-foreground/70'}`}>
                  <span className="ar-content">{path.arText}</span>
                  <span className="en-content">{path.enText}</span>
                </p>

                <ul className="mt-7 grid gap-3 border-t border-current/10 pt-6">
                  {path.arItems.map((item, itemIndex) => (
                    <li key={path.enItems[itemIndex]} className="flex items-start gap-3 text-lg font-bold leading-relaxed">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${path.featured ? 'bg-secondary' : 'bg-primary'}`} />
                      <span className="ar-content">{item}</span>
                      <span className="en-content">{path.enItems[itemIndex]}</span>
                    </li>
                  ))}
                </ul>

                <div className={`mt-auto pt-8 text-base font-bold leading-relaxed sm:text-lg ${path.featured ? 'text-secondary' : 'text-primary'}`}>
                  <span className="ar-content">{path.arStart}</span>
                  <span className="en-content">{path.enStart}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-primary/10 bg-white p-6 sm:grid-cols-3 sm:p-8">
          <div className="flex items-center gap-3">
            <Network className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-lg font-bold text-foreground/75"><span className="ar-content">تكامل مع الأنظمة القائمة</span><span className="en-content">Integration with existing systems</span></span>
          </div>
          <div className="flex items-center gap-3">
            <ScanSearch className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-lg font-bold text-foreground/75"><span className="ar-content">قياس قبل التوسع</span><span className="en-content">Measured before scaling</span></span>
          </div>
          <div className="flex items-center gap-3">
            <ChartNoAxesCombined className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-lg font-bold text-foreground/75"><span className="ar-content">نتائج تدعم القرار</span><span className="en-content">Results that support decisions</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
