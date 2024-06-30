import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import DiscoverQuestionStep from "../components/discover-question-step";
import GenerateTopicStep from "../components/generate-topic-step";
import Header from "../components/header";
import QuestionConfigStep from "../components/question-config-step";
import SelectTopicStep from "../components/select-topic-step";
import { useDeleteAllQuestionConfigs } from "../mutations";
import { useFetchFullSession } from "../queries";

const initialSelectedTopicIds: Record<number, true> = {};

export default function SessionPage() {
  const { id: sessionId = "" } = useParams();

  const [selectedTopicIds, setSelectedTopicIds] = React.useState<
    Record<number, true>
  >(initialSelectedTopicIds);

  const fetchFullSessionQuery = useFetchFullSession(sessionId);
  const deleteAllQuestionConfigsMutation = useDeleteAllQuestionConfigs();

  const toggleTopic = (topicId: number) => {
    setSelectedTopicIds((prev) => {
      if (prev[topicId]) {
        deleteAllQuestionConfigsMutation.mutate({ sessionId, topicId });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [topicId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [topicId]: true };
    });
  };

  return (
    <main className="flex flex-col pt-7 pb-10 items-center">
      <Header />
      <div className="w-full mt-8">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <Link to="/">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full text-slate-500"
            >
              <ArrowLeft size={18} />
            </Button>
          </Link>
          {fetchFullSessionQuery.isPending ? (
            <Skeleton className="h-8 w-72" />
          ) : null}
          {fetchFullSessionQuery.data ? (
            <h2 className="text-slate-800 font-medium">
              {fetchFullSessionQuery.data.title}
            </h2>
          ) : null}
        </div>
        {fetchFullSessionQuery.data ? (
          <div className="flex mt-12 flex-col gap-16 max-w-3xl mx-auto">
            <GenerateTopicStep />
            {fetchFullSessionQuery.data.topics.length > 0 ? (
              <SelectTopicStep
                toggleTopic={toggleTopic}
                selectedTopicIds={selectedTopicIds}
              />
            ) : null}
            {Object.keys(selectedTopicIds).length > 0 ? (
              <QuestionConfigStep selectedTopicIds={selectedTopicIds} />
            ) : null}
            <DiscoverQuestionStep />
          </div>
        ) : null}
      </div>
    </main>
  );
}
