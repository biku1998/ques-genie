import { ChevronRight, Dot } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import dayjs from "../../lib/dayjs";
import { SessionPayload } from "../../types";

export default function SessionCard(props: SessionPayload) {
  const {
    title,
    description,
    topics,
    questionCount,
    createdAt,
    updatedAt,
    labels,
  } = props;

  return (
    <div className="p-4 rounded-lg flex flex-col relative border max-w-[305px] group hover:border-blue-500 transition-colors duration-200 ease-in-out hover:shadow-sm">
      <h2 className="font-semibold text-slate-800 min-h-12 mb-2">{title}</h2>
      <p className="text-slate-500 text-sm">{description}</p>

      <div className="flex items-center mt-4">
        <div className="flex items-center gap-0.5">
          <span className="text-sm text-slate-800 font-medium">
            {topics.length}
          </span>
          <span className="text-xs text-slate-500">topics</span>
        </div>
        <Dot className="text-slate-300" />
        <div className="flex items-center gap-0.5">
          <span className="text-sm text-slate-800 font-medium">
            {questionCount}
          </span>
          <span className="text-xs text-slate-500">questions</span>
        </div>
      </div>
      <div className="flex items-center flex-wrap mt-4 gap-2">
        {labels.slice(0, labels.length > 3 ? 3 : labels.length).map((label) => (
          <Badge
            variant="secondary"
            className="rounded-lg font-medium"
            key={label.id}
          >
            {label.text}
          </Badge>
        ))}

        {labels.length > 3 ? (
          <Badge variant="secondary" className="rounded-lg font-medium">
            +{labels.length - 3}
          </Badge>
        ) : null}
      </div>
      <span className="mt-4 text-xs text-slate-600">
        {dayjs().to(updatedAt || createdAt)}
      </span>
      <ChevronRight
        className="absolute right-5 bottom-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform duration-200 ease-in-out"
        width={16}
        height={16}
      />
    </div>
  );
}
