import { ArrowLeftIcon, ListIcon, SaveIcon } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  CreateListLoading,
  FileUploader,
  Input,
  InputError,
  Label,
  Sphere,
} from "@/components";
import { useAppForm, useCreateList } from "@/hooks";

import {
  CreateListValidationSchema,
  type CreateListValidationSchemaType,
} from "./validation";

export const CreateList = () => {
  const navigate = useNavigate();

  const form = useAppForm<CreateListValidationSchemaType>({
    schema: CreateListValidationSchema,
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

  const setFileId = useCallback((fileId: string | null) => {
    form.setValue("fileId", fileId ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (createListMutation.isPending) {
    return <CreateListLoading />;
  }

  return (
    <div className="relative h-[calc(100vh-88px)]">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-28 right-30 h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <div className="bg-card h-full w-full p-6 shadow-md md:absolute md:top-2/5 md:left-1/2 md:h-fit md:w-[500px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl">
        <h1 className="text-center text-xl font-bold">Create List</h1>
        <form
          className="mt-8 flex flex-col gap-4"
          aria-label="create-list-form"
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
              setFileId={setFileId}
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
              <Button
                className="min-w-[120px]"
                type="submit"
                disabled={createListMutation.isPending}
              >
                <SaveIcon className="h-4 w-4" />
                Create
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
