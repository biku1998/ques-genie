import { useParams } from "react-router-dom";
import _omit from "lodash/omit";
import { Sparkles, SquareDashedMousePointer, Trash } from "lucide-react";
import StepHeading from "../../components/step-heading";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { cn } from "../../lib/utils";
import { useConfirmationDialog } from "../../zustand-stores";
import { useDeleteTopics } from "../mutations";
import { useFetchFullSession } from "../queries";

type SelectTopicStepProps = {
  toggleTopic: (topicId: number) => void;
  selectedTopicIds: Record<number, true>;
  setSelectedTopicIds: React.Dispatch<
    React.SetStateAction<Record<number, true>>
  >;
};

export default function SelectTopicStep(props: SelectTopicStepProps) {
  const { id: sessionId = "" } = useParams();
  const { toggleTopic, selectedTopicIds, setSelectedTopicIds } = props;

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const fetchFullSessionQuery = useFetchFullSession(sessionId);
  const deleteTopicsMutation = useDeleteTopics({
    onSuccess: (deletedTopicIds) => {
      setSelectedTopicIds((prev) => _omit(prev, deletedTopicIds));
    },
  });

  const handleDeleteTopicsClick = () => {
    openConfirmationDialog({
      title: "Delete topics",
      content: <p>Are you sure you want to delete the selected topics?</p>,
      onConfirm: () => {
        deleteTopicsMutation.mutate({
          sessionId,
          topicIds: Object.keys(selectedTopicIds).map(Number),
        });
        closeConfirmationDialog();
      },
      onCancel: () => {
        closeConfirmationDialog();
      },
      confirmButtonText: "Delete",
      twoFactorConfirm: true,
      twoFactorConfirmText: "delete",
    });
  };

  const handleSelectAllTopicsClick = () => {
    if (!fetchFullSessionQuery.data) return;
    setSelectedTopicIds(
      fetchFullSessionQuery.data.topics.reduce(
        (acc, topic) => ({ ...acc, [topic.id]: true }),
        {},
      ),
    );
  };

  if (fetchFullSessionQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (fetchFullSessionQuery.isError) {
    return <div>Error fetching session</div>;
  }

  return (
    <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
      <StepHeading
        step={1}
        title="Select topics you want to create questions from"
      />
      <div className="flex items-center flex-wrap gap-x-3 gap-y-3">
        {fetchFullSessionQuery.data.topics.map((topic) => (
          <Button
            size="sm"
            key={`topic-${topic.id}`}
            className={cn(
              "font-normal",
              selectedTopicIds[topic.id]
                ? "bg-blue-50 border border-blue-600 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                : "",
            )}
            variant={selectedTopicIds[topic.id] ? "default" : "outline"}
            onClick={() => {
              toggleTopic(topic.id);
            }}
          >
            {topic.text}
          </Button>
        ))}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-700"
                onClick={handleSelectAllTopicsClick}
              >
                <SquareDashedMousePointer size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select all topics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {fetchFullSessionQuery.data.topics.length > 0 ? (
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-tr from-violet-600 to to-blue-600">
            <Sparkles className="mr-2" size={20} />
            Generate more topics
          </Button>
          {Object.keys(selectedTopicIds).length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-red-100 text-red-600 hover:text-red-600 hover:bg-red-100 animate-in slide-in-from-left-2"
                    onClick={handleDeleteTopicsClick}
                  >
                    <Trash size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete selected topics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
