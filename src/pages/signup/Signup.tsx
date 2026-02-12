import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button, Input, InputError, PasswordInput, Sphere } from "@/components";
import { StorageKey } from "@/const";
import { useSignUp } from "@/hooks";

import {
  SignUpValidationSchema,
  type SignUpValidationSchemaType,
} from "./validation";

export const Signup = () => {
  const form = useForm<SignUpValidationSchemaType>({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signupMutation = useSignUp();

  const handleSubmit = (data: SignUpValidationSchemaType) => {
    signupMutation.mutate(data, {
      onSuccess: () => {
        localStorage.setItem(StorageKey.EMAIL, data.email);
      },
    });
  };

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-18 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <form
        className="bg-card w-full max-w-[500px] rounded-xl p-8 shadow-md"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h1 className="mb-6 text-center text-2xl font-bold">Sign up</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              {...form.register("name")}
              label="Name"
              error={!!form.formState.errors.name?.message}
              placeholder="Jane Smith"
              startIcon={<UserIcon className="h-4 w-4" />}
            />
            <InputError error={form.formState.errors.name?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <Input
              {...form.register("email")}
              label="Email"
              error={!!form.formState.errors.email?.message}
              placeholder="jane.smith@example.com"
              startIcon={<MailIcon className="h-4 w-4" />}
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
          Sign up
        </Button>
        <div className="mt-8 text-center">
          Already have an account?{" "}
          <Button type="button" variant="link" asChild className="p-0">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};
