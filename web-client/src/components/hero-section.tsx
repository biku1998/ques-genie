export default function HeroSection() {
  return (
    <section className="h-[340px] w-full bg-hero-section-bg flex flex-col items-center justify-center gap-4 group bg-repeat">
      <h1 className="text-5xl font-bold">
        QuesGenie AI <span className="group-hover:animate-pulse">✨</span>
      </h1>
      <p className="text-2xl font-medium text-slate-800 max-w-[623px] text-center">
        <span className="text-blue-600">Create Questions</span> that sparks
        curiosity from anything in minutes
      </p>
    </section>
  );
}
