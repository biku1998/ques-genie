import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StepHeading from "../../components/step-heading";
import { Badge } from "../../components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../../components/ui/form";
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

  React.useEffect(() => {
    if (fetchFullSessionQuery.data) {
      form.reset({
        questions: fetchFullSessionQuery.data.questions,
      });
    }
  }, [fetchFullSessionQuery.data, form]);

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      autoSave(value);
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
        <form className="flex flex-col gap-4">
          {questionsFieldArr.fields.map((questionField, idx) => (
            <div
              key={questionField.id}
              className="flex flex-col gap-4 p-4 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-normal">
                  {getTopicNameById(questionField.topicId)}
                </Badge>
                <Select
                  value={questionField.level}
                  // onValueChange={(value) =>
                  //   updateQuestionConfigMutation.mutate({
                  //     sessionId,
                  //     topicId: activeTopicId,
                  //     id: config.id,
                  //     type: value as QuestionType,
                  //   })
                  // }
                >
                  <SelectTrigger className="w-fit text-xs h-fit">
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
              </div>
              {/* <p className="text-sm font-medium">{question.text}</p> */}

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

              {/* <div className="flex flex-col gap-3">
              {question.payload.options.map((option) => (
                <div className="flex items-center"></div>
              ))}
            </div> */}
            </div>
          ))}
        </form>
      </Form>
    </section>
  );
}
