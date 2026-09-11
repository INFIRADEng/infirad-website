const phases = [
  {
    number: '01',
    arTitle: 'نفهم العمل',
    enTitle: 'Understand the work',
    arText: 'نرسم المدخلات والخطوات ونقاط القرار، ونحدد أين توجد الخبرة وأين يتكرر الجهد.',
    enText: 'We map inputs, steps, and decision points, identifying where expertise sits and effort repeats.',
  },
  {
    number: '02',
    arTitle: 'نبني ونربط',
    enTitle: 'Build and connect',
    arText: 'نحوّل المنهج إلى تدفق قابل للتنفيذ، ونربطه بالمصادر والأدوات والأنظمة اللازمة.',
    enText: 'We turn the method into an executable flow connected to the required sources, tools, and systems.',
  },
  {
    number: '03',
    arTitle: 'نختبر ونقيس',
    enTitle: 'Test and measure',
    arText: 'نختبر الحالات الصحيحة والحرجة، ونقيس جودة المخرجات قبل منح النظام نطاقاً أوسع.',
    enText: 'We test normal and critical cases, measuring output quality before widening the system’s scope.',
  },
  {
    number: '04',
    arTitle: 'نشغّل ونحسّن',
    enTitle: 'Operate and improve',
    arText: 'نراقب الأداء وسجل القرارات، ثم نطوّر النظام بناءً على الاستخدام الفعلي والأدلة.',
    enText: 'We monitor performance and decision records, then improve the system from real use and evidence.',
  },
];

export default function MethodologySection() {
  return (
    <section id="methodology" className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <div className="eyebrow border-primary/15 bg-primary/5 text-primary">
              <span className="eyebrow-dot" />
              <span className="ar-content">منهجية انفِراد</span>
              <span className="en-content">The INFIRAD method</span>
            </div>
            <h2 className="mt-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="ar-content">من الخبرة المهنية إلى نظام يعمل.</span>
              <span className="en-content">From professional knowledge to a working system.</span>
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-foreground/65">
              <span className="ar-content">لا يبدأ العمل باختيار نموذج ذكاء اصطناعي؛ بل بفهم المهمة التي يجب أن تُنجز والمعيار الذي يثبت جودتها.</span>
              <span className="en-content">The work does not begin by choosing an AI model. It begins with the task to be completed and the standard that proves its quality.</span>
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-primary/10 bg-primary/10 sm:grid-cols-2">
            {phases.map((phase) => (
              <article key={phase.number} className="group bg-accent p-7 transition-colors duration-300 hover:bg-primary sm:p-8">
                <span className="text-sm font-bold tracking-[0.2em] text-secondary">{phase.number}</span>
                <h3 className="mt-8 text-2xl font-bold text-primary transition-colors group-hover:text-white">
                  <span className="ar-content">{phase.arTitle}</span>
                  <span className="en-content">{phase.enTitle}</span>
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-foreground/65 transition-colors group-hover:text-white/70">
                  <span className="ar-content">{phase.arText}</span>
                  <span className="en-content">{phase.enText}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
