import { useForm } from "react-hook-form";
import {
  LoginValidationSchema,
  type LoginValidationSchemaType,
} from "./validation/login.validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/Input";
import InputError from "../../components/ui/InputError";
import PasswordInput from "../../components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { MailIcon } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

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
    <div className="flex justify-center items-center h-screen bg-primary-900 overflow-hidden relative">
      <form className="bg-card p-8 w-full max-w-[500px] rounded-xl shadow-md" onSubmit={form.handleSubmit(handleSubmit)}>
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              {...form.register("email")}
              label="Email"
              error={!!form.formState.errors.email?.message}
              startIcon={<MailIcon className="w-4 h-4" />}
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
        <Button type="submit" className="w-full mt-6">
          Login
        </Button>
        <div className="text-center mt-8">
          Don't have an account?{" "}
          <Button type="button" variant="link" asChild className="p-0">
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export { Login };
