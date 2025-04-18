"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage

} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader, Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Chapter, Course } from "@prisma/client";
import ChaptersList from "./chapters-list";


// 0 - definition of schema validation ith ZOD
const formSchema = z.object({
    title: z.string().min(1),
})

interface ChaptersFormProps {

    initialData: Course & { chapters: Chapter[] }
    courseId: string;

};

// component
const ChaptersForm = ({
    initialData, courseId
}: ChaptersFormProps) => {

    const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false)

    // 2 - definition of type of form 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });

    const { isSubmitting, isValid } = form.formState;


    const router = useRouter();

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    };

    console.log(initialData, "initialData?.chapters")


    // 3 - handle of submition of Form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success('Course chapter Created');
            toggleCreating();
            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong ');
        }
    }

    // function for reorder list of chapter related mit backend (chapters/reorder)
    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            });
            toast.success('Chapters reordred');
            router.refresh();
        } catch {
            toast.error('Something went wrong ');
        }
        finally {
            setIsUpdating(false)
        }
    }

    const [isLoading, setIsLoading] = useState(false);
    // function to edit an specific chapter 
    const onEdit = async (id: string) => {
        try {
            setIsLoading(true)

            await  router.push(`/teacher/courses/${courseId}/chapters/${id}`)

        } catch (error) {
            console.log("error", error)
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <>
            {
                isLoading &&
                <div className="fixed top-0 left-0 h-full z-50 w-full bg-gray-200/30
                    flex items-center justify-center
                ">
                    <Loader className=" h-8 w-8 animate-spin" />

                </div>
            }

            <div className=" relative mt-6 border bg-slate-100 rounded-md p-4" >
                {isUpdating && (
                    <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                        <Loader2
                            className="animate-spin h-6 w-6 text-sky-700"
                        />
                    </div>
                )

                }
                <div className="font-medium flex items-center justify-between">
                    Course Chapters
                    <Button variant={"ghost"} onClick={toggleCreating} className="cursor-pointer" >
                        {isCreating ? (
                            <span>Cancel</span>
                        ) : (
                            <>
                                <PlusCircle className="h-4 w-4 ml-2 mr-2" />

                                <>Add chapter</>
                            </>
                        )}
                    </Button>
                </div>

                {
                    isCreating && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 mt-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input disabled={isSubmitting}
                                                    className="bg-white"
                                                    placeholder="e.g 'Introduction to the course.'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-x-2">
                                    <Button
                                        disabled={isSubmitting || !isValid}
                                        type="submit"
                                    >
                                        Create
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )

                }
                {
                    !isCreating && (
                        <div className={cn(
                            "text-sm mt-2",
                            !initialData?.chapters?.length && "text-slate-500 italic"
                        )}>
                            {!initialData?.chapters?.length && "No Chapters"}

                        </div>
                    )
                }
                <ChaptersList
                    onEdit={onEdit}
                    onReorder={onReorder}
                    items={initialData?.chapters || []}
                />
                {
                    !isCreating && (
                        <div className="text-xs text-muted-foreground mt-4">
                            Drag and drop to reorder the chapters
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default ChaptersForm
