import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import * as z from "zod";
import { useGetUser } from "../../auth/user-store";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

const FormSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Too short! at least 5 characters.",
    })
    .trim(),
  description: z.string().optional(),
});

export default function CreateSessionDialog() {
  const [open, setOpen] = React.useState(false);

  const user = useGetUser();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) return;

    alert(data);
  }

  const handleAddSessionClick = () => {
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-full border-2 border-dashed bg-slate-50 text-slate-300 hover:text-blue-400"
          variant="secondary"
          onClick={handleAddSessionClick}
        >
          <Plus height={54} width={54} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New session</DialogTitle>
          <DialogDescription>
            Add a new session to your account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input required type="text" placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea placeholder="description (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-8">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  //   disabled={createProjectMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full"
                // disabled={createProjectMutation.isPending}
              >
                {/* {createProjectMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {createProjectMutation.isPending
                  ? "Please wait..."
                  : "Create project"} */}
                Create session
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
