import { BookMarked, CircleCheckBig, ScanSearch, UserRoundCheck, Wrench } from 'lucide-react';

const principles = [
  {
    icon: BookMarked,
    arTitle: 'سياق متخصص',
    enTitle: 'Domain context',
    arText: 'يعمل على مصادر الجهة وتعريفاتها ومنهجيتها، لا على معرفة عامة فقط.',
    enText: 'Built around the organization’s sources, definitions, and methods — not general knowledge alone.',
  },
  {
    icon: Wrench,
    arTitle: 'تنفيذ بالأدوات',
    enTitle: 'Tool-enabled execution',
    arText: 'يتعامل مع الملفات والبيانات والأنظمة وأدوات التخصص لإتمام العمل فعلياً.',
    enText: 'Works with files, data, systems, and professional tools to complete real tasks.',
  },
  {
    icon: ScanSearch,
    arTitle: 'مخرجات قابلة للتتبع',
    enTitle: 'Traceable outputs',
    arText: 'يوثّق المدخلات والإجراءات والمراجع كي يستطيع المختص المراجعة والتحقق.',
    enText: 'Records inputs, actions, and references so experts can review and verify the result.',
  },
  {
    icon: UserRoundCheck,
    arTitle: 'قرار بشري واضح',
    enTitle: 'Clear human authority',
    arText: 'تُحدد الصلاحيات ونقاط الموافقة، ويبقى الحكم المهني لمن يملك مسؤوليته.',
    enText: 'Permissions and approval points are defined; professional judgment stays with those accountable.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid items-start gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div className="lg:sticky lg:top-32">
            <div className="eyebrow border-primary/15 bg-primary/5 text-primary">
              <span className="eyebrow-dot" />
              <span className="ar-content">ما الذي نختلف فيه؟</span>
              <span className="en-content">What makes it different?</span>
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="ar-content">ليست نافذة محادثة أخرى.</span>
              <span className="en-content">More than another chat window.</span>
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-foreground/70">
              <span className="ar-content">
                الأدوات العامة تجيب عن الأسئلة. أما العمل المهني فيحتاج نظاماً يفهم السياق، يستخدم الأدوات، يتبع المنهج، ويترك أثراً يمكن مراجعته.
              </span>
              <span className="en-content">
                General tools answer questions. Professional work needs a system that understands context, uses tools, follows a method, and leaves a reviewable trail.
              </span>
            </p>

            <div className="mt-8 border-s-4 border-secondary bg-accent p-6">
              <p className="text-xl font-bold leading-relaxed text-primary">
                <span className="ar-content">
                  الهندسة والمحاكاة هما أعمق خبراتنا — ومنهما نأخذ الانضباط الذي نطبقه عند بناء الوكلاء لأي عمل متخصص.
                </span>
                <span className="en-content">
                  Engineering and simulation are our deepest expertise — and the source of the rigor we bring to agents for other specialized work.
                </span>
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <article key={principle.enTitle} className="principle-card group">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-base font-bold tracking-[0.2em] text-secondary">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-primary">
                    <span className="ar-content">{principle.arTitle}</span>
                    <span className="en-content">{principle.enTitle}</span>
                  </h3>
                  <p className="mt-3 text-xl leading-relaxed text-foreground/70">
                    <span className="ar-content">{principle.arText}</span>
                    <span className="en-content">{principle.enText}</span>
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-4 rounded-2xl border border-primary/10 bg-primary px-6 py-5 text-white sm:px-8">
          <CircleCheckBig className="h-6 w-6 shrink-0 text-secondary" />
          <p className="text-lg font-bold leading-relaxed sm:text-xl">
            <span className="ar-content">نبني ونختبر منهجنا داخل أعمال انفِراد نفسها قبل أن نوسّع تطبيقه.</span>
            <span className="en-content">We build and test our operating method inside INFIRAD before expanding its application.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
