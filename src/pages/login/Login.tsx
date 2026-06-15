import { ArrowLeft, MailIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  Button,
  Input,
  InputError,
  LoginWithGoogleButton,
  PasswordInput,
  Sphere,
} from "@/components";
import { RouterKey, TranslationKey } from "@/const";
import { useAppForm, useLogin, useTranslation } from "@/hooks";

import {
  LoginValidationSchema,
  type LoginValidationSchemaType,
} from "./validation";

export const Login = () => {
  const { t } = useTranslation();
  const form = useAppForm<LoginValidationSchemaType>({
    schema: LoginValidationSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  const handleSubmit = (data: LoginValidationSchemaType) => {
    loginMutation.mutate(data);
  };

  const navigate = useNavigate();

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden bg-cover bg-center">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-17 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <main className="bg-card h-full w-full p-8 shadow-md sm:h-fit sm:w-[500px] sm:rounded-xl">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-label="login-form"
        >
          <div className="mb-6 grid grid-cols-3 items-center">
            <Button
              variant="ghost"
              className="justify-self-start p-0"
              onClick={() => navigate(-1)}
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              {t(TranslationKey.AUTH_BACK)}
            </Button>

            <h1 className="text-center text-2xl font-bold">
              {t(TranslationKey.AUTH_LOGIN)}
            </h1>

            <div />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                {...form.register("email")}
                label={t(TranslationKey.AUTH_EMAIL)}
                error={!!form.formState.errors.email?.message}
                startIcon={<MailIcon className="h-4 w-4" />}
                placeholder={t(TranslationKey.AUTH_EMAIL_PLACEHOLDER)}
              />
              <InputError error={form.formState.errors.email?.message} />
            </div>
            <div className="flex flex-col gap-1">
              <PasswordInput
                {...form.register("password")}
                label={t(TranslationKey.AUTH_PASSWORD)}
                error={!!form.formState.errors.password?.message}
                placeholder="********"
              />
              <InputError error={form.formState.errors.password?.message} />
            </div>
          </div>
          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={loginMutation.isPending}
          >
            {t(TranslationKey.AUTH_LOGIN)}
          </Button>
          <LoginWithGoogleButton
            className="mt-6"
            label={t(TranslationKey.AUTH_LOGIN_WITH_GOOGLE)}
          />
          <div className="mt-6 flex flex-col">
            <div className="text-center text-sm">
              {t(TranslationKey.AUTH_NO_ACCOUNT)}{" "}
              <Button
                type="button"
                variant="link"
                asChild
                className="p-0 text-sm"
              >
                <Link data-testid="login-signup-link" to="/signup">
                  {t(TranslationKey.AUTH_SIGNUP)}
                </Link>
              </Button>
            </div>
            <div className="text-center">
              <Button asChild variant={"link"} className="p-0 text-sm">
                <Link
                  data-testid="login-forgot-link"
                  to={RouterKey.RESET_PASSWORD}
                >
                  {t(TranslationKey.AUTH_FORGOT_PASSWORD)}
                </Link>
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
