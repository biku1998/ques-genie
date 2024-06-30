import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { z } from "zod";
import StepHeading from "../../components/step-heading";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import { Textarea } from "../../components/ui/textarea";
import { getWordCount } from "../../lib/utils";
import { useGenerateTopics, useUpdateSessionSourceText } from "../mutations";
import { useFetchFullSession } from "../queries";

const MIN_WORD_COUNT = 200;

const FormSchema = z.object({
  sourceText: z
    .string()
    .min(
      1200,
      `At least ${MIN_WORD_COUNT} words are required to generate meaningful topics.`,
    ),
});

function GenerateTopicStep() {
  const { id: sessionId = "" } = useParams();

  const fetchFullSessionQuery = useFetchFullSession(sessionId);
  const generateTopicsMutation = useGenerateTopics();
  const updateSessionSourceTextMutation = useUpdateSessionSourceText({
    onSuccess: () => {
      generateTopicsMutation.mutate(sessionId);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceText: "",
    },
  });

  const sourceTextWatcher = form.watch("sourceText");

  React.useEffect(() => {
    if (!fetchFullSessionQuery.data) return;
    if (fetchFullSessionQuery.data.sourceText === null) return;
    form.setValue("sourceText", fetchFullSessionQuery.data.sourceText);
  }, [fetchFullSessionQuery.data, form]);

  if (fetchFullSessionQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchFullSessionQuery.isError) {
    return <div>Error fetching session</div>;
  }

  const wordCount = getWordCount(sourceTextWatcher);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updateSessionSourceTextMutation.mutate({
      id: sessionId,
      sourceText: data.sourceText,
    });
  };

  const topicCount = fetchFullSessionQuery.data
    ? fetchFullSessionQuery.data.topics.length
    : 0;

  return (
    <section className="flex flex-col gap-6">
      <StepHeading step={1} title="Add content for the magic to happen" />
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="sourceText"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="source text"
                    {...field}
                    rows={8}
                    required
                    disabled={
                      updateSessionSourceTextMutation.isPending ||
                      generateTopicsMutation.isPending ||
                      topicCount > 0
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* show word count */}
          {sourceTextWatcher.length !== 0 ? (
            <div className="rounded-lg border border-slate-200 flex w-fit animate-in slide-in-from-top-2">
              <div className="pl-2 pr-1 py-[6px] mr-1 flex items-center">
                <span className="text-xs text-slate-600"># Word</span>
              </div>

              <span className="text-xs text-slate-700 font-medium pl-2 pr-2 py-[6px] bg-slate-50 rounded-tr-lg rounded-br-lg font-mono">
                {wordCount}
              </span>
            </div>
          ) : null}

          <Button
            className="bg-gradient-to-tr from-violet-600 to to-blue-600 w-fit ml-auto"
            type="submit"
            disabled={
              updateSessionSourceTextMutation.isPending ||
              generateTopicsMutation.isPending ||
              topicCount > 0
            }
          >
            {fetchFullSessionQuery.isPending ||
            generateTopicsMutation.isPending ? (
              <Loader2 className="mr-2 animate-spin" size={20} />
            ) : (
              <Sparkles className="mr-2" size={20} />
            )}
            {updateSessionSourceTextMutation.isPending ||
            generateTopicsMutation.isPending
              ? "Generating topics..."
              : "Generate Topics"}
          </Button>
        </form>
      </Form>
    </section>
  );
}

const MemoizedGenerateTopicStep = React.memo(GenerateTopicStep);
export default MemoizedGenerateTopicStep;
