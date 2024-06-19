import React from "react";
import { FileSearch } from "lucide-react";
import { cn } from "../lib/utils";

type NothingProps = {
  title: string;
  subText: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
};
export default function Nothing(props: NothingProps) {
  const { title, subText, content = null, icon = null } = props;

  return (
    <section className="flex flex-col my-auto h-full items-center py-40 animate-in slide-in-from-bottom-2 mx-auto w-[480px] bg-[url('/src/assets/bg-pattern-small.svg')]">
      <div className="w-16 h-16 bg-purple-50 p-[9px] rounded-full">
        <div className="w-[46px] h-[46px] p-[11px] bg-purple-100 rounded-full text-purple-600 *:h-6 *:w-6 flex items-center justify-center">
          {icon ? icon : <FileSearch />}
        </div>
      </div>
      <h2 className="mt-5 text-xl font-bold text-zinc-800">{title}</h2>
      <p className={cn("mt-2 text-sm text-zinc-500", content ? "mb-5" : "")}>
        {subText}
      </p>
      {content}
    </section>
  );
}
