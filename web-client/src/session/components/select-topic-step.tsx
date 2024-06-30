import { useParams } from "react-router-dom";
import { Sparkles, Trash } from "lucide-react";
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
import { useDeleteAllTopics } from "../mutations";
import { useFetchFullSession } from "../queries";

type SelectTopicStepProps = {
  toggleTopic: (topicId: number) => void;
  selectedTopicIds: Record<number, true>;
};

export default function SelectTopicStep(props: SelectTopicStepProps) {
  const { id: sessionId = "" } = useParams();
  const { toggleTopic, selectedTopicIds } = props;

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const fetchFullSessionQuery = useFetchFullSession(sessionId);
  const deleteAllTopicsMutation = useDeleteAllTopics();

  const handleDeleteAllTopicsClick = () => {
    openConfirmationDialog({
      title: "Delete all topics",
      content: <p>Are you sure you want to delete all generated topics?</p>,
      onConfirm: () => {
        deleteAllTopicsMutation.mutate(sessionId);
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
      </div>
      {fetchFullSessionQuery.data.topics.length > 0 ? (
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            className="bg-gradient-to-tr from-violet-600 to to-blue-600"
          >
            <Sparkles className="mr-2" size={20} />
            Generate more topics
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-red-100 text-red-600 hover:text-red-600 hover:bg-red-100"
                  onClick={handleDeleteAllTopicsClick}
                >
                  <Trash size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete all generated topics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : null}
    </section>
  );
}
