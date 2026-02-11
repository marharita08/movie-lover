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

import { DeleteAccountDialog } from "./components";
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
    updateUserMutation.mutate({ id: user?.id || "", data });
  };

  return (
    <AuthenticatedLayout>
      <div className="relative h-[calc(100vh-88px)]">
        <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
        <Sphere className="absolute top-20 left-30 h-15 w-15" />
        <Sphere className="absolute top-28 right-30 h-13 w-13" />
        <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
        <div className="bg-card absolute top-1/3 left-1/2 w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 shadow-md">
          <h1 className="text-xl font-bold">My Profile</h1>
          <form
            className="mt-4 flex flex-col gap-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex gap-2">
              <div>Email:</div>
              <div>{user?.email}</div>
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
            <div className="mt-4 flex justify-between gap-2">
              <DeleteAccountDialog />
              <div className="flex gap-2">
                <Button type="button" onClick={() => form.reset(defaultValues)}>
                  <RotateCcwIcon className="h-4 w-4" />
                  Reset
                </Button>
                <Button type="submit">
                  <SaveIcon className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
