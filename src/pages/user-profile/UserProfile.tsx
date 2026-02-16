import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcwIcon, SaveIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  AuthenticatedLayout,
  Button,
  Input,
  InputError,
  Sphere,
} from "@/components";
import { useCurrentUser, useUpdateUser } from "@/hooks";

import { ChangePasswordDialog, DeleteAccountDialog } from "./components";
import {
  UpdateUserValidationSchema,
  type UpdateUserValidationSchemaType,
} from "./validation";

export const UserProfile = () => {
  const { data: user } = useCurrentUser();

  const defaultValues = useMemo(
    () => ({
      name: user?.name || "",
    }),
    [user],
  );

  const form = useForm<UpdateUserValidationSchemaType>({
    resolver: zodResolver(UpdateUserValidationSchema),
    defaultValues,
  });

  const updateUserMutation = useUpdateUser();

  const handleSubmit = (data: UpdateUserValidationSchemaType) => {
    updateUserMutation.mutate(data);
  };

  return (
    <AuthenticatedLayout>
      <div className="relative h-[calc(100vh-88px)]">
        <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
        <Sphere className="absolute top-20 left-30 h-15 w-15" />
        <Sphere className="absolute top-28 right-30 h-13 w-13" />
        <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
        <div className="bg-card h-full w-full p-6 shadow-md md:absolute md:top-2/5 md:left-1/2 md:h-fit md:w-[500px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl">
          <h1 className="text-center text-xl font-bold">My Profile</h1>
          <form
            className="mt-8 flex flex-col gap-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex gap-2">
              <div>Email:</div>
              <div className="font-medium">{user?.email}</div>
            </div>
            <div>
              <Input
                {...form.register("name")}
                label="Name"
                error={!!form.formState.errors.name?.message}
                placeholder="Jane Smith"
                startIcon={<UserIcon className="h-4 w-4" />}
              />
              <InputError error={form.formState.errors.name?.message} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <div className="flex gap-4">
                <Button
                  className="min-w-[120px]"
                  type="button"
                  variant={"outline"}
                  onClick={() => form.reset(defaultValues)}
                >
                  <RotateCcwIcon className="h-4 w-4" />
                  Reset
                </Button>
                <Button className="min-w-[120px]" type="submit">
                  <SaveIcon className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-8 flex justify-center gap-4">
            <DeleteAccountDialog />
            <ChangePasswordDialog />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
