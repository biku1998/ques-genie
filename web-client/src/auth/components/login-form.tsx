import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
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
import { AuthSuccessResponse, useLogin } from "../api";

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string({ required_error: "Password is required" }),
});

type LoginFormProps = {
  onLogin: (resp: AuthSuccessResponse) => void;
};

export default function LoginForm(props: LoginFormProps) {
  const { onLogin } = props;

  const loginMutation = useLogin({
    onSuccess: onLogin,
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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    loginMutation.mutate(data);
  };

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
            {loginMutation.error ? (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-bottom-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>
                  Invalid credentials. Please try again.
                </AlertDescription>
              </Alert>
            ) : null}
            <Button
              disabled={loginMutation.isPending}
              type="submit"
              className="w-full mt-2 animate-in slide-in-from-bottom-2"
            >
              {loginMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {loginMutation.isPending ? "Please wait..." : "Login"}
            </Button>
          </div>
        </form>
      </Form>

      <span className="text-sm text-zinc-500">
        New user?{"  "}
        <Link to="/auth/register" className="text-primary hover:underline">
          Register
        </Link>
      </span>
    </section>
  );
}
