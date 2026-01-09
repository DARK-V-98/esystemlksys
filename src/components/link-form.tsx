"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LinkItem, Category } from "@/lib/types";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category." }),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type LinkFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (link: LinkItem) => void;
  linkToEdit: LinkItem | null;
  categories: Category[];
};

export function LinkForm({
  isOpen,
  setIsOpen,
  onSave,
  linkToEdit,
  categories,
}: LinkFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      category: "",
      tags: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (linkToEdit) {
      form.reset({
        url: linkToEdit.url,
        title: linkToEdit.title,
        description: linkToEdit.description,
        category: linkToEdit.category,
        tags: linkToEdit.tags.join(", "),
        notes: linkToEdit.notes,
      });
    } else {
      form.reset();
    }
  }, [linkToEdit, form, isOpen]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newLink: LinkItem = {
      id: linkToEdit ? linkToEdit.id : new Date().toISOString(),
      createdAt: linkToEdit ? linkToEdit.createdAt : new Date().toISOString(),
      image: linkToEdit ? linkToEdit.image : undefined,
      url: values.url,
      title: values.title,
      description: values.description || "",
      category: values.category,
      tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
      notes: values.notes || "",
    };
    onSave(newLink);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{linkToEdit ? "Edit Link" : "Add New Link"}</DialogTitle>
          <DialogDescription>
            {linkToEdit
              ? "Update the details of your saved link."
              : "Save a new link to your vault."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Awesome Design Tool" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="A short description of the link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                           <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="react, design, tutorial" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add personal notes or context..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">{linkToEdit ? "Save Changes" : "Add Link"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
