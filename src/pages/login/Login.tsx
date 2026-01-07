import { useForm } from "react-hook-form";
import {
  LoginValidationSchema,
  type LoginValidationSchemaType,
} from "./validation/login.validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/Input";
import InputError from "../../components/ui/InputError";
import PasswordInput from "../../components/ui/PasswordInput";

const Login = () => {
  const form = useForm<LoginValidationSchemaType>({
    resolver: zodResolver(LoginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div>
      <form>
        <h1>Login</h1>
        <div>
          <Input
            {...form.register("email")}
            label="Email"
            error={!!form.formState.errors.email?.message}
            isEmpty={!form.watch("email")}
          />
          <InputError error={form.formState.errors.email?.message} />
        </div>
        <div>
          <PasswordInput name="password" control={form.control} />
        </div>
      </form>
    </div>
  );
};

export { Login };
