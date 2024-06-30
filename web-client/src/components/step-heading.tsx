export default function StepHeading(props: { step: number; title: string }) {
  const { step, title } = props;

  return (
    <div className="flex items-center gap-5">
      {/* <div className="w-[52px] h-[52px] flex items-center justify-center border border-slate-300 rounded-full">
        <span className="text-xl font-semibold font-mono text-slate-700">
          {step}
        </span>
      </div> */}
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
    </div>
  );
}
