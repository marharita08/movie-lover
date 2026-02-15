import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ListIcon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  AuthenticatedLayout,
  Button,
  FileUploader,
  Input,
  InputError,
  Label,
  Sphere,
} from "@/components";
import { useCreateList } from "@/hooks";

import {
  CreateListValidationSchema,
  type CreateListValidationSchemaType,
} from "./validation";

export const CreateList = () => {
  const navigate = useNavigate();

  const form = useForm<CreateListValidationSchemaType>({
    resolver: zodResolver(CreateListValidationSchema),
    defaultValues: {
      name: "",
      fileId: "",
    },
  });

  const createListMutation = useCreateList();

  const handleSubmit = (data: CreateListValidationSchemaType) => {
    createListMutation.mutate(data);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <AuthenticatedLayout>
      <div className="relative h-[calc(100vh-88px)]">
        <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
        <Sphere className="absolute top-20 left-30 h-15 w-15" />
        <Sphere className="absolute top-28 right-30 h-13 w-13" />
        <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
        <div className="bg-card absolute top-2/5 left-1/2 w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 shadow-md">
          <h1 className="text-center text-xl font-bold">Create List</h1>
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div>
              <Input
                {...form.register("name")}
                label="Name"
                error={!!form.formState.errors.name?.message}
                placeholder="My Favorite Movies"
                startIcon={<ListIcon className="h-4 w-4" />}
              />
              <InputError error={form.formState.errors.name?.message} />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">
                Upload list from IMDB
              </Label>
              <FileUploader
                validTypes={["csv"]}
                fileId={form.watch("fileId")}
                setFileId={(fileId) => form.setValue("fileId", fileId ?? "")}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <div className="flex gap-4">
                <Button
                  className="min-w-[120px]"
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back
                </Button>
                <Button className="min-w-[120px]" type="submit">
                  <SaveIcon className="h-4 w-4" />
                  Create
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
