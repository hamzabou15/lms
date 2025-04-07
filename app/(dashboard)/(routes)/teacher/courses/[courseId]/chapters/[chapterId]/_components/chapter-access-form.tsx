"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,


} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

// 0 - definition of schema validation ith ZOD
const formSchema = z.object({

    isFree: z.boolean().default(false)
})

interface ChapterAccessFormProps {

    initialData: Chapter;
    courseId: string;
    chapterId: string;

};

// component
const ChapterAccessForm = ({
    initialData, courseId, chapterId
}: ChapterAccessFormProps) => {

    const [isEdeting, setIsEdeting] = useState(false);

    // 2 - definition of type of form 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // Boolen "!!""
            isFree: !!initialData?.isFree
        },
    });

    const { isSubmitting, isValid } = form.formState;


    const router = useRouter();


    // 3 - handle of submition of Form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success('Chapter access Updated');
            toggleEdit();

            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong ');
        }
    }

    const toggleEdit = () => {
        setIsEdeting((current) => !current);
    };


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Access
                <Button variant={"ghost"} onClick={toggleEdit} className="cursor-pointer" >
                    {isEdeting ? (
                        <span>Cancel</span>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 ml-2 mr-2" />

                            <>Edit Access</>
                        </>
                    )}
                </Button>
            </div>
            {!isEdeting && (
                <div className={cn("text-sm mt-2 ", !initialData.isFree ? "text-slate-500 italic" : "")}>
                    {initialData.isFree ?
                        < >
                            This chapter is free for preview
                        </>
                        :
                        < >
                            This chapter is not free for preview
                        </>
                    }


                </div>
            )
            }
            {isEdeting && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want to make this chapter free for preview
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isSubmitting || !isValid}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )

            }
        </div>
    )
}

export default ChapterAccessForm
