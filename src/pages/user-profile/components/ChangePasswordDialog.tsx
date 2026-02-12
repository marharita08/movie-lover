import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  InputError,
  PasswordInput,
} from "@/components";
import { useChangePassword } from "@/hooks";

import {
  ChangePasswordValidationSchema,
  type ChangePasswordValidationSchemaType,
} from "../validation";

export const ChangePasswordDialog = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<ChangePasswordValidationSchemaType>({
    resolver: zodResolver(ChangePasswordValidationSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const changePasswordMutation = useChangePassword();

  const handleSubmit = (data: ChangePasswordValidationSchemaType) => {
    const { confirmPassword: _, ...rest } = data;
    changePasswordMutation.mutate(rest, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-sm">
          <LockIcon className="h-4 w-4" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 p-4"
        >
          <div className="flex flex-col gap-1">
            <PasswordInput
              {...form.register("password")}
              error={!!form.formState.errors.password?.message}
              placeholder="********"
            />
            <InputError error={form.formState.errors.password?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <PasswordInput
              {...form.register("confirmPassword")}
              label="Confirm Password"
              error={!!form.formState.errors.confirmPassword?.message}
              placeholder="********"
            />
            <InputError
              error={form.formState.errors.confirmPassword?.message}
            />
          </div>
          <div className="mt-4 flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="min-w-[120px]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
