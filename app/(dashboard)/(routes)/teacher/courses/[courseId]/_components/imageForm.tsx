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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";


// 0 - definition of schema validation ith ZOD
const formSchema = z.object({

    imageUrl: z.string().min(1, {
        message: "Image is required"
    }),
})

interface ImageFormProps {

    initialData: Course;
    courseId: string;

};

// component
const ImageForm = ({
    initialData, courseId
}: ImageFormProps) => {

    const [isEdeting, setIsEdeting] = useState(false);

    // 2 - definition of type of form 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;


    const router = useRouter();


    // 3 - handle of submition of Form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success('Course description Updated');
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
                Course image
                <Button variant={"ghost"} onClick={toggleEdit} className="cursor-pointer" >
                    {isEdeting && (
                        <span>Cancel</span>
                    )}
                    {!isEdeting && !initialData.imageUrl && (
                        <>
                            <PlusCircle
                                className="h-4 w-4 mr-2"
                            />
                            Add an image

                        </>

                    )}
                    {!isEdeting && initialData.imageUrl && (

                        <>
                            <Pencil className="h-4 w-4 ml-2 mr-2" />

                            <>Edit image</>
                        </>
                    )}
                </Button>
            </div>
            {!isEdeting && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center  bg-slate-200 rounded-md "
                        style={{height:"150px"}}
                    >
                        <ImageIcon
                            className="h-10 w-10 text-slate-500"
                        />
                    </div>
                ) : (
                    ""
                )
            )
            }
            {isEdeting && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea disabled={isSubmitting}
                                            className="bg-white"
                                            placeholder="e.g 'This course is about ...'"
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

export default ImageForm
