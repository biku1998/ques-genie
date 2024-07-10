import React from "react";
import { useParams } from "react-router-dom";
import { CircleMinus, CirclePlus, Loader2, Sparkles } from "lucide-react";
import StepHeading from "../../components/step-heading";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { cn } from "../../lib/utils";
import { QuestionLevel, QuestionType } from "../../types";
import {
  useAddQuestionConfig,
  useDeleteQuestionConfig,
  useGenerateQuestions,
  useUpdateQuestionConfig,
} from "../mutations";
import { useFetchFullSession } from "../queries";

type QuestionConfigStepProps = {
  selectedTopicIds: Record<number, true>;
};
export default function QuestionConfigStep(props: QuestionConfigStepProps) {
  const { id: sessionId = "" } = useParams();

  const { selectedTopicIds } = props;

  const [activeTopicId, setActiveTopicId] = React.useState<number | null>(null);

  const fetchFullSessionQuery = useFetchFullSession(sessionId);
  const addQuestionConfigMutation = useAddQuestionConfig();
  const updateQuestionConfigMutation = useUpdateQuestionConfig();
  const deleteQuestionConfigMutation = useDeleteQuestionConfig();
  const generateQuestionsMutation = useGenerateQuestions();

  React.useEffect(() => {
    if (!activeTopicId) return;

    if (selectedTopicIds[activeTopicId]) return;

    setActiveTopicId(null);
  }, [selectedTopicIds, activeTopicId]);

  if (fetchFullSessionQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (fetchFullSessionQuery.isError) {
    return <div>Error fetching session</div>;
  }

  const handleTopicClick = (topicId: number) => {
    setActiveTopicId(topicId);
  };

  const topics = fetchFullSessionQuery.data.topics;
  const questionConfigs = fetchFullSessionQuery.data.configs;

  return (
    <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
      <StepHeading step={1} title="Per topic question configuration" />

      <div className="grid grid-cols-7 gap-4 border border-slate-200 rounded-lg">
        <div className="col-span-2 border-r border-slate-200 p-4 flex flex-col gap-1">
          {topics
            .filter((topic) => selectedTopicIds[topic.id])
            .map((topic) => (
              <Button
                variant={activeTopicId === topic.id ? "secondary" : "ghost"}
                className={cn(
                  "text-wrap h-fit justify-start text-start animate-in slide-in-from-bottom-2",
                  activeTopicId === topic.id
                    ? ""
                    : "font-normal text-slate-600",
                )}
                onClick={() => handleTopicClick(topic.id)}
              >
                {topic.text}
              </Button>
            ))}
        </div>
        <div className="col-span-5 p-4">
          {activeTopicId !== null ? (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 *:font-normal *:text-sm *:text-slate-500 *:text-left">
                  <span className="w-[20%]">#</span>
                  <span className="w-[35%]">Difficulty</span>
                  <span className="w-[35%]">Type</span>
                  <span className="w-[10%]"></span>
                </div>
                {questionConfigs
                  ? questionConfigs[activeTopicId]
                    ? questionConfigs[activeTopicId].map((config, idx) => (
                        <div
                          className="flex items-center gap-3 animate-in slide-in-from-top-2"
                          key={idx}
                        >
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            className="w-[20%]"
                            value={config.count}
                            onChange={(e) =>
                              updateQuestionConfigMutation.mutate({
                                sessionId,
                                topicId: activeTopicId,
                                id: config.id,
                                count: parseInt(e.target.value),
                              })
                            }
                          />
                          <Select
                            value={config.level}
                            onValueChange={(value) =>
                              updateQuestionConfigMutation.mutate({
                                sessionId,
                                topicId: activeTopicId,
                                id: config.id,
                                level: value as QuestionLevel,
                              })
                            }
                          >
                            <SelectTrigger className="w-[35%]">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Difficulty</SelectLabel>
                                <SelectItem value="EASY">Easy</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HARD">Hard</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Select
                            value={config.type}
                            onValueChange={(value) =>
                              updateQuestionConfigMutation.mutate({
                                sessionId,
                                topicId: activeTopicId,
                                id: config.id,
                                type: value as QuestionType,
                              })
                            }
                          >
                            <SelectTrigger className="w-[35%]">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Type</SelectLabel>
                                <SelectItem value="RADIO">
                                  Single choice
                                </SelectItem>
                                <SelectItem value="CHECKBOX">
                                  Multi choice
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-[10%] text-slate-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() =>
                              deleteQuestionConfigMutation.mutate({
                                sessionId,
                                topicId: activeTopicId,
                                id: config.id,
                              })
                            }
                            disabled={
                              questionConfigs[activeTopicId].length === 1
                            }
                          >
                            <CircleMinus size={16} />
                          </Button>
                        </div>
                      ))
                    : null
                  : null}
              </div>
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className=" font-normal text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    addQuestionConfigMutation.mutate({
                      sessionId,
                      topicId: activeTopicId,
                      count: 1,
                      level: "MEDIUM",
                      type: "RADIO",
                    });
                  }}
                >
                  <CirclePlus size={16} className="text-blue-600 mr-2" />
                  Add
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Please select a topic from the panel in the left
            </p>
          )}
        </div>
      </div>

      {fetchFullSessionQuery.data ? (
        Object.keys(fetchFullSessionQuery.data.configs).length !== 0 ? (
          <Button
            className="bg-gradient-to-tr from-violet-600 to to-blue-600 animate-in slide-in-from-top-2"
            onClick={() => generateQuestionsMutation.mutate(sessionId)}
            disabled={generateQuestionsMutation.isPending}
          >
            {fetchFullSessionQuery.isPending ||
            generateQuestionsMutation.isPending ? (
              <Loader2 className="mr-2 animate-spin" size={20} />
            ) : (
              <Sparkles className="mr-2" size={20} />
            )}
            {generateQuestionsMutation.isPending
              ? "Generating questions..."
              : "Generate Questions"}
          </Button>
        ) : null
      ) : null}
    </section>
  );
}
