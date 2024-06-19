import UserMenu from "./user-menu";

export default function HeroSection() {
  return (
    <section className="h-[234px] w-full bg-hero-section-bg  bg-repeat py-9">
      <div className="max-w-5xl flex flex-col gap-10 mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">QuesGenie ✨</h1>
          <UserMenu />
        </div>
        <p className="text-2xl font-medium text-slate-800 max-w-[623px] text-center mx-auto">
          <span className="text-blue-700">Create Questions</span> that sparks
          curiosity from anything in minutes ⏳
        </p>
      </div>
    </section>
  );
}
