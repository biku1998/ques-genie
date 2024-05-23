import React from "react";
import { useMutation } from "@tanstack/react-query";
import { generateMcqQuestions, generateTopics } from "./api";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

export default function App() {
  const [text, setText] = React.useState("");
  const [topics, setTopics] = React.useState<Array<string>>([]);
  const [selectedTopics, setSelectedTopics] = React.useState<Array<string>>([]);
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
    setText(e.target.value.trim());
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
    setSelectedTopics([]);
    generateTopicsMutation.mutate(text);
  };

  const handleGenerateMcqQuestionsClick = () => {
    generateMcqQuestionsMutation.mutate({
      text,
      topics: selectedTopics,
    });
  };

  return (
    <main className="w-screen flex flex-col items-center mx-auto py-10 max-w-xl">
      <h1 className="text-4xl font-bold">Ques Gen AI ✨</h1>
      <section className="flex flex-col gap-8 w-full mt-10">
        <Textarea
          placeholder="Enter your text here"
          rows={8}
          value={text}
          onChange={handleTextChange}
          disabled={generateTopicsMutation.isPending}
        />
        {/* show word count */}
        {text.length !== 0 ? (
          <p className="text-sm text-slate-600">
            Word count: ~{text.trim().split(/\s+/).length}
          </p>
        ) : null}
        <Button
          className="py-7 text-lg"
          onClick={handleGenerateTopicsClick}
          disabled={text.length === 0 || generateTopicsMutation.isPending}
        >
          {generateTopicsMutation.isPending
            ? "Generating Topics..."
            : "Generate Topics ✨"}
        </Button>
      </section>

      <section className="mt-12 flex flex-col gap-4">
        {topics.length !== 0 ? (
          <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-6">
            <h2 className="text-2xl font-bold">Topics</h2>
            <p className="text-sm text-slate-800">
              Total {topics.length} topics generated
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Click on the topics to select them
            </p>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-3 mt-3">
              {topics.map((topic) => (
                <Button
                  size={"sm"}
                  key={topic}
                  variant={
                    selectedTopics.includes(topic) ? "default" : "outline"
                  }
                  onClick={() => {
                    setSelectedTopics((prev) => {
                      if (prev.includes(topic)) {
                        return prev.filter((t) => t !== topic);
                      }
                      return [...prev, topic];
                    });
                  }}
                >
                  {topic}
                </Button>
              ))}
            </div>
            {selectedTopics.length !== 0 ? (
              <Button
                className="py-7 text-lg mt-7 animate-in slide-in-from-top-4 w-full"
                onClick={handleGenerateMcqQuestionsClick}
                disabled={generateMcqQuestionsMutation.isPending}
              >
                {generateMcqQuestionsMutation.isPending
                  ? "Generating MCQ Questions..."
                  : "Generate MCQ Questions ✨"}
              </Button>
            ) : null}

            {questions.length !== 0
              ? questions.map((question, index) => (
                  <div key={index} className="flex flex-col gap-4 w-full mt-10">
                    <p className="text-lg font-semibold">{question.question}</p>
                    <div className="flex flex-col gap-2">
                      {question.options.map((option) => (
                        <Button
                          key={option.id}
                          variant={
                            option.id === question.correct_option_id
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {option.option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))
              : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
