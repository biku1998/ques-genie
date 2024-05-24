import React from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, RefreshCcw, Sparkles } from "lucide-react";
import { generateMcqQuestions, generateTopics } from "./api";
import HeroSection from "./components/hero-section";
import StepHeading from "./components/step-heading";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { cn } from "./lib/utils";

const sampleTopics = [
  {
    id: 1,
    topic: "Physics",
  },
  {
    id: 2,
    topic: "Mathematics",
  },
  {
    id: 3,
    topic: "Chemistry",
  },
  {
    id: 4,
    topic: "Biology",
  },
  {
    id: 5,
    topic: "History",
  },
  {
    id: 6,
    topic: "Geography",
  },
  {
    id: 7,
    topic: "Computer Science Computer Science Computer Science",
  },
  {
    id: 8,
    topic: "General Knowledge",
  },
];

export default function App() {
  const [text, setText] = React.useState("");
  const [topics, setTopics] = React.useState<
    Array<{
      id: number;
      topic: string;
    }>
  >(sampleTopics);

  const [selectedTopicIds, setSelectedTopicIds] = React.useState<Array<number>>(
    [],
  );

  const [activeTopicId, setActiveTopicId] = React.useState<number | null>(null);

  const [perTopicQuestionsConfig, setPerTopicQuestionsConfig] = React.useState<
    Record<
      number,
      Array<{
        count: number;
        difficulty: "easy" | "medium" | "hard";
        type: "mcq" | "checkbox";
      }>
    >
  >();

  const [questions, setQuestions] = React.useState<
    Array<{
      question: string;
      options: Array<{
        id: number;
        option: string;
      }>;
      correct_option_id: number;
    }>
  >([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const generateTopicsMutation = useMutation({
    mutationFn: generateTopics,
    onSuccess: (data) => {
      setTopics(data.topics);
    },
  });

  const generateMcqQuestionsMutation = useMutation({
    mutationFn: generateMcqQuestions,
    onSuccess: (data) => {
      setQuestions(data.questions);
    },
  });

  const handleGenerateTopicsClick = () => {
    setTopics([]);
    // setSelectedTopics([]);
    generateTopicsMutation.mutate(text);
  };

  const handleGenerateMcqQuestionsClick = () => {
    // generateMcqQuestionsMutation.mutate({
    //   text,
    //   topics: selectedTopics,
    // });
  };

  const wordCount = text.trim().split(/\s+/).length;

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

            {text.length !== 0 && wordCount < 3000 ? (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 w-fit"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  At least 3000 words are required to generate topics.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
          <Button
            className="bg-gradient-to-tr from-violet-600 to to-blue-600"
            onClick={handleGenerateTopicsClick}
            disabled={wordCount < 5000 || generateTopicsMutation.isPending}
          >
            <Sparkles className="mr-2" size={20} />
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
                  key={topic.id}
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
                  {topic.topic}
                </Button>
              ))}
            </div>
            <Button
              className="bg-gradient-to-tr from-violet-600 to to-blue-600 w-fit"
              onClick={handleGenerateTopicsClick}
              // disabled={wordCount < 5000 || generateTopicsMutation.isPending}
            >
              <RefreshCcw className="mr-2" size={20} />
              Regenerate
            </Button>
          </section>
        ) : null}

        {selectedTopicIds.length !== 0 ? (
          <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
            <StepHeading step={3} title="Configure questions for each topic" />

            <div className="grid grid-cols-5 gap-4 border border-slate-200 rounded-lg">
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
                      onClick={
                        activeTopicId === topic.id
                          ? () => setActiveTopicId(null)
                          : () => setActiveTopicId(topic.id)
                      }
                    >
                      {topic.topic}
                    </Button>
                  ))}
              </div>
              <div className="col-span-3 p-4">
                <table>
                  <thead>
                    <tr>
                      <th>Count</th>
                      <th>Difficulty</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perTopicQuestionsConfig &&
                      perTopicQuestionsConfig[activeTopicId!]?.map(
                        (config, index) => (
                          <tr key={index}>
                            <td>{config.count}</td>
                            <td>{config.difficulty}</td>
                            <td>{config.type}</td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
            </div>
            <Button
              className="bg-gradient-to-tr from-violet-600 to to-blue-600"
              onClick={handleGenerateTopicsClick}
              // disabled={wordCount < 5000 || generateTopicsMutation.isPending}
            >
              <Sparkles className="mr-2" size={20} />
              Generate Questions
            </Button>
          </section>
        ) : null}
      </div>
    </main>
  );
}
