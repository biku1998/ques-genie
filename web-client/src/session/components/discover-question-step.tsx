import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDot, Square, SquareCheck } from "lucide-react";
import { z } from "zod";
import StepHeading from "../../components/step-heading";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../../components/ui/form";
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
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import { SessionQuestionSchema } from "../../types";
import { useUpsertQuestions } from "../mutations";
import { useFetchFullSession } from "../queries";

const FormSchema = z.object({
  questions: z.array(SessionQuestionSchema),
});

export default function DiscoverQuestionStep() {
  const { id: sessionId = "" } = useParams();

  const fetchFullSessionQuery = useFetchFullSession(sessionId);
  const upsertQuestionsMutation = useUpsertQuestions();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const autoSave = React.useCallback(
    (data: z.infer<typeof FormSchema>) => {
      upsertQuestionsMutation.mutate(data.questions);
    },
    [upsertQuestionsMutation],
  );

  const questionsFieldArr = useFieldArray({
    control: form.control,
    name: "questions",
    keyName: "id",
  });

  const questionsWatcher = form.watch("questions");

  React.useEffect(() => {
    if (fetchFullSessionQuery.data) {
      form.reset({
        questions: fetchFullSessionQuery.data.questions,
      });
    }
  }, [fetchFullSessionQuery.data, form]);

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      autoSave(value as z.infer<typeof FormSchema>);
    });

    return () => subscription.unsubscribe();
  }, [form, autoSave]);

  if (fetchFullSessionQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (fetchFullSessionQuery.isError) {
    return <div>Error fetching session</div>;
  }

  const getTopicNameById = (id: number) => {
    const topic = fetchFullSessionQuery.data.topics.find(
      (topic) => topic.id === id,
    );
    if (!topic) throw new Error("Topic not found");
    return topic.text;
  };

  return (
    <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 border-t border-dashed border-slate-300 pt-10">
      <StepHeading step={1} title="Discover questions ✨" />

      <Form {...form}>
        <form className="flex flex-col gap-8">
          {questionsFieldArr.fields.map((questionField, idx) => (
            <div
              key={questionField.id}
              className="flex flex-col gap-4 p-4 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-normal">
                  {getTopicNameById(questionField.topicId)}
                </Badge>

                <FormField
                  control={form.control}
                  name={`questions.${idx}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-fit text-xs h-fit">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Difficulty</SelectLabel>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`questions.${idx}.text`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea placeholder="Question" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 mt-4">
                {questionField.payload.options.map((option, optionIdx) => (
                  <div className="flex items-center gap-3">
                    {questionField.type === "RADIO" ? (
                      <Button
                        size="icon"
                        type="button"
                        className={cn(
                          "w-fit h-fit p-2 hover:text-emerald-500",
                          questionsWatcher[idx].type === "RADIO" &&
                            questionsWatcher[idx].payload.correctOptionId ===
                              option.id
                            ? "text-emerald-500"
                            : "text-slate-500",
                        )}
                        variant="ghost"
                        onClick={() => {
                          form.setValue(
                            `questions.${idx}.payload.correctOptionId`,
                            option.id,
                          );
                        }}
                      >
                        <CircleDot size={18} />
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        type="button"
                        className={cn(
                          "w-fit h-fit p-2 hover:text-emerald-500",
                          questionsWatcher[idx].type === "CHECKBOX" &&
                            questionsWatcher[
                              idx
                            ].payload.correctOptionIds.includes(option.id)
                            ? "text-emerald-500"
                            : "text-slate-500",
                        )}
                        variant="ghost"
                        onClick={() => {
                          if (questionsWatcher[idx].type === "RADIO") return;

                          const correctOptionIds = questionsWatcher[
                            idx
                          ].payload.correctOptionIds.includes(option.id)
                            ? questionsWatcher[
                                idx
                              ].payload.correctOptionIds.filter(
                                (id) => id !== option.id,
                              )
                            : [
                                ...questionsWatcher[idx].payload
                                  .correctOptionIds,
                                option.id,
                              ];

                          form.setValue(
                            `questions.${idx}.payload.correctOptionIds`,
                            correctOptionIds,
                          );
                        }}
                      >
                        {questionsWatcher[idx].type === "CHECKBOX" &&
                        questionsWatcher[idx].payload.correctOptionIds.includes(
                          option.id,
                        ) ? (
                          <SquareCheck size={18} />
                        ) : (
                          <Square size={18} />
                        )}
                      </Button>
                    )}
                    <FormField
                      key={option.id}
                      control={form.control}
                      name={`questions.${idx}.payload.options.${optionIdx}.text`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </form>
      </Form>
    </section>
  );
}
