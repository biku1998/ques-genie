import React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  Circle,
  CircleDot,
  CircleMinus,
  CirclePlus,
  RefreshCcw,
  Sparkles,
  Square,
  SquareCheck,
} from "lucide-react";
import { generateQuestions, generateTopics } from "./api";
import HeroSection from "./components/hero-section";
import StepHeading from "./components/step-heading";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { cn, getWordCount } from "./lib/utils";
import {
  Question,
  QuestionConfig,
  Topic,
  QuestionLevel,
  QuestionType,
} from "./types";

// const sampleTopics = [
//   {
//     id: 1,
//     topic: "Physics",
//   },
//   {
//     id: 2,
//     topic: "Mathematics",
//   },
//   {
//     id: 3,
//     topic: "Chemistry",
//   },
//   {
//     id: 4,
//     topic: "Biology",
//   },
//   {
//     id: 5,
//     topic: "History",
//   },
//   {
//     id: 6,
//     topic: "Geography",
//   },
//   {
//     id: 7,
//     topic: "Computer Science Computer Science Computer Science",
//   },
//   {
//     id: 8,
//     topic: "General Knowledge",
//   },
// ];

// const sampleQuestions = [
//   {
//     id: 1,
//     topicId: 1,
//     type: "mcq",
//     question: "What is the capital of India?",
//     options: [
//       {
//         id: 1,
//         option: "New Delhi",
//       },
//       {
//         id: 2,
//         option: "Mumbai",
//       },
//       {
//         id: 3,
//         option: "Kolkata",
//       },
//       {
//         id: 4,
//         option: "Chennai",
//       },
//     ],
//     correct_option_id: 1,
//   },
//   {
//     id: 2,
//     topicId: 1,
//     type: "mcq",
//     question: "What is the capital of India?",
//     options: [
//       {
//         id: 1,
//         option: "New Delhi",
//       },
//       {
//         id: 2,
//         option: "Mumbai",
//       },
//       {
//         id: 3,
//         option: "Kolkata",
//       },
//       {
//         id: 4,
//         option: "Chennai",
//       },
//     ],
//     correct_option_id: 1,
//   },
//   {
//     id: 3,
//     topicId: 1,
//     type: "mcq",
//     question: "What is the capital of India?",
//     options: [
//       {
//         id: 1,
//         option: "New Delhi",
//       },
//       {
//         id: 2,
//         option: "Mumbai",
//       },
//       {
//         id: 3,
//         option: "Kolkata",
//       },
//       {
//         id: 4,
//         option: "Chennai",
//       },
//     ],
//     correct_option_id: 1,
//   },
//   {
//     id: 4,
//     topicId: 3,
//     type: "checkbox",
//     question: "What is the capital of India?",
//     options: [
//       {
//         id: 1,
//         option:
//           "New Delhi What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?",
//       },
//       {
//         id: 2,
//         option: "Mumbai",
//       },
//       {
//         id: 3,
//         option: "Kolkata",
//       },
//       {
//         id: 4,
//         option: "Chennai",
//       },
//     ],
//     correct_option_ids: [1, 4],
//   },
//   {
//     id: 5,
//     topicId: 2,
//     type: "mcq",
//     question: "What is the capital of India?",
//     options: [
//       {
//         id: 1,
//         option: "New Delhi",
//       },
//       {
//         id: 2,
//         option: "Mumbai",
//       },
//       {
//         id: 3,
//         option: "Kolkata",
//       },
//       {
//         id: 4,
//         option:
//           "New Delhi What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?What is the capital of India?",
//       },
//     ],
//     correct_option_id: 1,
//   },
// ];

const MIN_WORD_COUNT = 200;

export default function App() {
  const [text, setText] = React.useState("");
  const [topics, setTopics] = React.useState<Array<Topic>>([]);

  const [selectedTopicIds, setSelectedTopicIds] = React.useState<Array<number>>(
    [],
  );

  const [activeTopicId, setActiveTopicId] = React.useState<number | null>(null);

  const [questionConfigs, setQuestionConfigs] =
    React.useState<Record<number, Array<QuestionConfig>>>();

  const [questions, setQuestions] = React.useState<Array<Question>>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const generateTopicsMutation = useMutation({
    mutationFn: generateTopics,
    onSuccess: (data) => {
      setTopics(data);
    },
  });

  const generateQuestionsMutation = useMutation({
    mutationFn: generateQuestions,
    onSuccess: (data) => {
      setQuestions(data);
    },
  });

  const handleGenerateTopicsClick = () => {
    setTopics([]);
    setSelectedTopicIds([]);
    generateTopicsMutation.mutate(text);
  };

  const handleTopicClick = (topicId: number) => {
    setActiveTopicId(topicId);

    if (questionConfigs && questionConfigs[topicId]) {
      return;
    }
    addQuestionConfig(topicId);
  };

  const addQuestionConfig = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;

    setQuestionConfigs((prev) => {
      return {
        ...prev,
        [topicId]: [
          ...(prev?.[topicId] ?? []),
          {
            count: 1,
            level: "easy",
            type: "mcq",
            topic,
          },
        ],
      };
    });
  };

  const removeQuestionConfig = (topicId: number, idx: number) => {
    setQuestionConfigs((prev) => {
      return {
        ...prev,
        [topicId]: prev?.[topicId].filter((_, i) => i !== idx) ?? [],
      };
    });
  };

  const updateQuestionConfigCount = (
    topicId: number,
    idx: number,
    count: number,
  ) => {
    setQuestionConfigs((prev) => {
      return {
        ...prev,
        [topicId]:
          prev?.[topicId].map((config, i) =>
            i === idx ? { ...config, count: count > 10 ? 10 : count } : config,
          ) ?? [],
      };
    });
  };

  const updateQuestionConfigLevel = (
    topicId: number,
    idx: number,
    level: QuestionLevel,
  ) => {
    setQuestionConfigs((prev) => {
      return {
        ...prev,
        [topicId]:
          prev?.[topicId].map((config, i) =>
            i === idx ? { ...config, level } : config,
          ) ?? [],
      };
    });
  };

  const updateTopicQuestionConfigType = (
    topicId: number,
    idx: number,
    type: QuestionType,
  ) => {
    setQuestionConfigs((prev) => {
      return {
        ...prev,
        [topicId]:
          prev?.[topicId].map((config, i) =>
            i === idx ? { ...config, type } : config,
          ) ?? [],
      };
    });
  };

  const handleGenerateQuestionsClick = () => {
    const configs = Object.values(questionConfigs ?? {}).flatMap((c) => c);
    generateQuestionsMutation.mutate({ text, configs });
    if (questions.length !== 0) {
      setQuestions([]);
    }
  };

  const wordCount = getWordCount(text);

  return (
    <main className="flex flex-col">
      <HeroSection />
      <div className="max-w-[700px] mx-auto my-16 w-full flex flex-col gap-16">
        <section className="flex flex-col gap-6">
          <StepHeading step={1} title="Add content for the magic to happen" />
          <div className="flex flex-col gap-3">
            <Textarea
              placeholder="Enter your text here"
              rows={8}
              value={text}
              onChange={handleTextChange}
              disabled={generateTopicsMutation.isPending}
            />
            {/* show word count */}
            {text.length !== 0 ? (
              <div className="rounded-lg border border-slate-200 flex w-fit animate-in slide-in-from-top-2">
                <div className="pl-2 pr-1 py-[6px] mr-1 flex items-center">
                  <span className="text-xs text-slate-600"># Word</span>
                </div>

                <span className="text-xs text-slate-700 font-medium pl-2 pr-2 py-[6px] bg-slate-50 rounded-tr-lg rounded-br-lg font-mono">
                  {wordCount}
                </span>
              </div>
            ) : null}

            {text.length !== 0 && wordCount < MIN_WORD_COUNT ? (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 w-fit"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  At least {MIN_WORD_COUNT} words are required to generate
                  topics.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
          <Button
            className="bg-gradient-to-tr from-violet-600 to to-blue-600"
            onClick={handleGenerateTopicsClick}
            disabled={
              wordCount < MIN_WORD_COUNT || generateTopicsMutation.isPending
            }
          >
            {generateTopicsMutation.isPending ? (
              <RefreshCcw className="mr-2 animate-spin" size={20} />
            ) : (
              <Sparkles className="mr-2" size={20} />
            )}
            {generateTopicsMutation.isPending
              ? "Generating Topics..."
              : "Generate Topics"}
          </Button>
        </section>
        {topics.length !== 0 ? (
          <section className="flex flex-col gap-6">
            <StepHeading step={2} title="Select topics to generate questions" />
            <div className="flex items-center flex-wrap gap-x-3 gap-y-3">
              {topics.map((topic) => (
                <Button
                  size={"sm"}
                  key={`topic-${topic.id}`}
                  className={cn(
                    "font-normal",
                    selectedTopicIds.includes(topic.id)
                      ? "bg-blue-50 border border-blue-600 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                      : "",
                  )}
                  variant={
                    selectedTopicIds.includes(topic.id) ? "default" : "outline"
                  }
                  onClick={() => {
                    setSelectedTopicIds((prev) => {
                      if (prev.includes(topic.id)) {
                        return prev.filter((t) => t !== topic.id);
                      }
                      return [...prev, topic.id];
                    });
                  }}
                >
                  {topic.text}
                </Button>
              ))}
            </div>
            {/* <Button
              className="bg-gradient-to-tr from-violet-600 to to-blue-600 w-fit"
              onClick={handleGenerateTopicsClick}
              disabled={wordCount < 5000 || generateTopicsMutation.isPending}
            >
              <RefreshCcw className="mr-2" size={20} />
              Regenerate
            </Button> */}
          </section>
        ) : null}

        {selectedTopicIds.length !== 0 ? (
          <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
            <StepHeading step={3} title="Configure questions for each topic" />

            <div className="grid grid-cols-7 gap-4 border border-slate-200 rounded-lg">
              <div className="col-span-2 border-r border-slate-200 p-4 flex flex-col gap-1">
                {topics
                  .filter((topic) => selectedTopicIds.includes(topic.id))
                  .map((topic) => (
                    <Button
                      variant={
                        activeTopicId === topic.id ? "secondary" : "ghost"
                      }
                      className={cn(
                        "text-wrap h-fit justify-start text-start",
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
                          ? questionConfigs[activeTopicId].map(
                              (config, idx) => (
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
                                      updateQuestionConfigCount(
                                        activeTopicId,
                                        idx,
                                        parseInt(e.target.value),
                                      )
                                    }
                                  />
                                  <Select
                                    value={config.level}
                                    onValueChange={(value) =>
                                      updateQuestionConfigLevel(
                                        activeTopicId,
                                        idx,
                                        value as "easy" | "medium" | "hard",
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-[35%]">
                                      <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Difficulty</SelectLabel>
                                        <SelectItem value="easy">
                                          Easy
                                        </SelectItem>
                                        <SelectItem value="medium">
                                          Medium
                                        </SelectItem>
                                        <SelectItem value="hard">
                                          Hard
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={config.type}
                                    onValueChange={(value) =>
                                      updateTopicQuestionConfigType(
                                        activeTopicId,
                                        idx,
                                        value as "mcq" | "checkbox",
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-[35%]">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Type</SelectLabel>
                                        <SelectItem value="mcq">
                                          Single choice
                                        </SelectItem>
                                        <SelectItem value="checkbox">
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
                                      removeQuestionConfig(activeTopicId, idx)
                                    }
                                    disabled={
                                      questionConfigs[activeTopicId].length ===
                                      1
                                    }
                                  >
                                    <CircleMinus size={16} />
                                  </Button>
                                </div>
                              ),
                            )
                          : null
                        : null}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className=" font-normal text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => addQuestionConfig(activeTopicId)}
                      >
                        <CirclePlus size={16} className="text-blue-600 mr-2" />
                        Add
                      </Button>
                      {questionConfigs ? (
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">
                            {questionConfigs[activeTopicId]
                              ?.map((config) => config.count)
                              .reduce((acc, curr) => acc + curr, 0)}
                          </span>{" "}
                          questions
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-600">
                    Please select a topic
                  </p>
                )}
              </div>
            </div>
            <Button
              className="bg-gradient-to-tr from-violet-600 to to-blue-600"
              onClick={handleGenerateQuestionsClick}
              disabled={generateQuestionsMutation.isPending}
            >
              {generateQuestionsMutation.isPending ? (
                <RefreshCcw className="mr-2 animate-spin" size={20} />
              ) : (
                <Sparkles className="mr-2" size={20} />
              )}
              Generate Questions
            </Button>
          </section>
        ) : null}

        {questions.length !== 0 ? (
          <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
            <StepHeading step={4} title="Discover generated questions" />
            {topics
              .filter((topic) => questions.some((q) => q.topic.id === topic.id))
              .map((topic) => (
                <div
                  className="flex flex-col gap-3 items-start"
                  key={`topic-${topic.id}`}
                >
                  <div className="px-4 py-2 rounded-lg flex items-center justify-center border border-blue-600 bg-blue-50 text-blue-600 text-sm">
                    <span>{topic.text}</span>
                  </div>
                  {questions
                    .filter((question) => question.topic.id === topic.id)
                    .map((question) => (
                      <div
                        className="p-4 rounded-lg border border-slate-200 flex flex-col gap-3 w-full"
                        key={`question-${question.id}`}
                      >
                        <p className="text-sm font-medium">{question.text}</p>
                        {question.options.map((option) => (
                          <div
                            className="flex items-center gap-2"
                            key={`option-${option.id}`}
                          >
                            {question.type === "mcq" ? (
                              question.correctOptionId === option.id ? (
                                <CircleDot
                                  size={16}
                                  className="text-green-500 shrink-0"
                                />
                              ) : (
                                <Circle
                                  size={16}
                                  className="text-slate-400 shrink-0"
                                />
                              )
                            ) : question.correctOptionIds.includes(
                                option.id,
                              ) ? (
                              <SquareCheck
                                size={16}
                                className="text-green-500 shrink-0"
                              />
                            ) : (
                              <Square
                                size={16}
                                className="text-slate-400 shrink-0"
                              />
                            )}
                            <p
                              className={cn(
                                "text-sm",
                                question.type === "mcq"
                                  ? question.correctOptionId === option.id
                                    ? "text-green-500"
                                    : "text-slate-800"
                                  : question.correctOptionIds.includes(
                                        option.id,
                                      )
                                    ? "text-green-500"
                                    : "text-slate-800",
                              )}
                            >
                              {option.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
