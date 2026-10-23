"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ClipboardPaste, Download, Link2 } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { detectPlatform } from "@/lib";

const schema = z.object({
  url: z
    .url("Please enter a valid link, starting with https://")
    .refine(
      (value) => detectPlatform(value) !== null,
      "This platform isn't supported yet",
    ),
});

type FormValues = z.infer<typeof schema>;

export const LinkForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { url: "" },
  });

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("url", text.trim(), { shouldValidate: true });
    } catch {
      toast.error("Clipboard access was blocked. Paste the link manually.");
    }
  };

  const onSubmit = (values: FormValues) => {
    // Functionality phase: call the download API here
    toast.info(`Link accepted: ${values.url}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-start"
    >
      <Input
        id="video-url"
        type="url"
        inputSize="lg"
        icon={<Link2 />}
        placeholder="Paste a video link here"
        autoComplete="off"
        aria-label="Video link"
        error={errors.url?.message}
        className="pr-28"
        endAdornment={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<ClipboardPaste />}
            onClick={onPaste}
          >
            Paste
          </Button>
        }
        {...register("url")}
      />

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        icon={<Download />}
        className="h-16 w-full sm:w-auto"
      >
        Download
      </Button>
    </form>
  );
};
