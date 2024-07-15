export default function StepHeading(props: { step: number; title: string }) {
  const { title } = props;

  return (
    <div className="flex items-center gap-5">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
    </div>
  );
}
