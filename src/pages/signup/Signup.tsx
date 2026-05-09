import { ArrowLeft, MailIcon, UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  Button,
  Input,
  InputError,
  LoginWithGoogleButton,
  PasswordInput,
  Sphere,
} from "@/components";
import { RouterKey, StorageKey, TranslationKey } from "@/const";
import { useAppForm, useSignUp, useTranslation } from "@/hooks";
import { useLanguageStore } from "@/store/language.store";

import {
  SignUpValidationSchema,
  type SignUpValidationSchemaType,
} from "./validation";

export const Signup = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const form = useAppForm<SignUpValidationSchemaType>({
    schema: SignUpValidationSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      language,
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

  const navigate = useNavigate();

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-12 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <main className="bg-card h-full w-full p-8 shadow-md sm:h-fit sm:w-[500px] sm:rounded-xl">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-label="signup-form"
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
              {t(TranslationKey.AUTH_SIGNUP)}
            </h1>

            <div />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                {...form.register("name")}
                label={t(TranslationKey.AUTH_NAME)}
                error={!!form.formState.errors.name?.message}
                placeholder={t(TranslationKey.AUTH_NAME_PLACEHOLDER)}
                startIcon={<UserIcon className="h-4 w-4" />}
              />
              <InputError error={form.formState.errors.name?.message} />
            </div>
            <div className="flex flex-col gap-1">
              <Input
                {...form.register("email")}
                label={t(TranslationKey.AUTH_EMAIL)}
                error={!!form.formState.errors.email?.message}
                placeholder={t(TranslationKey.AUTH_EMAIL_PLACEHOLDER)}
                startIcon={<MailIcon className="h-4 w-4" />}
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
            disabled={signupMutation.isPending}
          >
            {t(TranslationKey.AUTH_SIGNUP)}
          </Button>
          <LoginWithGoogleButton
            className="mt-6"
            label={t(TranslationKey.AUTH_SIGNUP_WITH_GOOGLE)}
          />
          <div className="mt-8 text-center">
            {t(TranslationKey.AUTH_ALREADY_HAVE_ACCOUNT)}{" "}
            <Button type="button" variant="link" asChild className="p-0">
              <Link to={RouterKey.LOGIN}>{t(TranslationKey.AUTH_LOGIN)}</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
