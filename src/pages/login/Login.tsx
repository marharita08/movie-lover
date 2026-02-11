import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button, Input, InputError, PasswordInput, Sphere } from "@/components";
import { RouterKey } from "@/const";
import { useLogin } from "@/hooks";

import {
  LoginValidationSchema,
  type LoginValidationSchemaType,
} from "./validation";

const Login = () => {
  const form = useForm<LoginValidationSchemaType>({
    resolver: zodResolver(LoginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  const handleSubmit = (data: LoginValidationSchemaType) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden bg-cover bg-center">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-28 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <form
        className="bg-card w-full max-w-[500px] rounded-xl p-8 shadow-md"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              {...form.register("email")}
              label="Email"
              error={!!form.formState.errors.email?.message}
              startIcon={<MailIcon className="h-4 w-4" />}
              placeholder="jane.smith@example.com"
            />
            <InputError error={form.formState.errors.email?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <PasswordInput
              {...form.register("password")}
              error={!!form.formState.errors.password?.message}
              placeholder="********"
            />
            <InputError error={form.formState.errors.password?.message} />
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full">
          Login
        </Button>
        <div className="mt-8 flex flex-col">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Button
              type="button"
              variant="link"
              asChild
              className="p-0 text-sm"
            >
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
          <div className="text-center">
            <Button asChild variant={"link"} className="p-0 text-sm">
              <Link to={RouterKey.RESET_PASSWORD}>Forgot password?</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export { Login };
