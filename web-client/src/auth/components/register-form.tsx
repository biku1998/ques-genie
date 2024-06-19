import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { AuthSuccessResponse, useRegister } from "../api";

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{4,}$/,
      "Password must contain an upper case letter, a lower case letter, a number, and a special character",
    ),
});

type RegisterFormProps = {
  onRegister: (resp: AuthSuccessResponse) => void;
};

export default function RegisterForm(props: RegisterFormProps) {
  const { onRegister } = props;

  const registerMutation = useRegister({
    onSuccess: onRegister,
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    registerMutation.mutate(data);
  }

  return (
    <section className="flex flex-col items-center gap-4">
      <Form {...form}>
        <form
          className="flex flex-col items-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-5 w-[360px]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="email"
                      placeholder="john@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={registerMutation.isPending}
              type="submit"
              className="w-full mt-2 animate-in slide-in-from-bottom-2"
            >
              {registerMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {registerMutation.isPending ? "Please wait..." : "Register"}
            </Button>
          </div>
        </form>
      </Form>

      <span className="text-sm text-zinc-500">
        Already have an account?{"  "}
        <Link to="/auth/login" className="text-primary hover:underline">
          Login
        </Link>
      </span>
    </section>
  );
}
