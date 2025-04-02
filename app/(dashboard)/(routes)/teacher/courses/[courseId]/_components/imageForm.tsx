"use client"
import * as z from "zod";
import axios from "axios";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-uploade";


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
    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         imageUrl: initialData?.imageUrl || ""
    //     },
    // });

    // const { isSubmitting, isValid } = form.formState;


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
                        style={{ height: "180px", backgroundColor: "#e2e8f0" }}
                    >
                        <ImageIcon
                            className="h-10 w-10 text-slate-500"
                        />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 ">
                        <Image
                            alt="Upload course image"
                            fill
                            className="object-contain rounded-md"
                            src={initialData.imageUrl || ""}
                        />

                    </div>
                )
            )
            }
            {isEdeting && (
                <div>
                    <FileUpload
                        endPoint="CourseImage"
                        onChange={(url) => {
                            console.log("File uploaded URL:", url); // Debugging log
                            if (url) {
                                onSubmit({ imageUrl: url })
                            }
                        }}
                 
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 ascpect ratio recommended
                    </div>
                </div>
            )

            }
        </div>
    )
}

export default ImageForm