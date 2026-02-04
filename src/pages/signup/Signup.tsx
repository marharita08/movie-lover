import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import InputError from "@/components/ui/InputError";
import PasswordInput from "@/components/ui/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  type SignUpValidationSchemaType,
  SignUpValidationSchema,
} from "./validation/sign-up.validation-schema";
import { MailIcon, UserIcon } from "lucide-react";
import { useSignUp } from "@/hooks/useSignUp";
import { StorageKey } from "@/const";

const Signup = () => {
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
    <div className="flex justify-center items-center h-screen bg-primary-900 overflow-hidden relative">
      <form className="bg-card p-8 w-full max-w-[500px] rounded-xl shadow-md" onSubmit={form.handleSubmit(handleSubmit)}>
        <h1 className="text-2xl font-bold mb-6 text-center">Sign up</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              {...form.register("name")}
              label="Name"
              error={!!form.formState.errors.name?.message}
              placeholder="Jane Smith"
              startIcon={<UserIcon className="w-4 h-4" />}
            />
            <InputError error={form.formState.errors.name?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <Input
              {...form.register("email")}
              label="Email"
              error={!!form.formState.errors.email?.message}
              placeholder="jane.smith@example.com"
              startIcon={<MailIcon className="w-4 h-4" />}
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
        <Button type="submit" className="w-full mt-6">
          Sign up
        </Button>
        <div className="text-center mt-8">
          Already have an account?{" "}
          <Button type="button" variant="link" asChild className="p-0">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export { Signup };
