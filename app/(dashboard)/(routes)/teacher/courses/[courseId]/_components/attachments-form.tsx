"use client"
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import FileUpload from "@/components/file-uploade";

// 0 - definition of schema validation ith ZOD
const formSchema = z.object({

    Url: z.string().min(1),
})

interface AttachmentsFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
};

// component
const AttachmentsForm = ({
    initialData, courseId
}: AttachmentsFormProps) => {

    const [isEdeting, setIsEdeting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const onDelete = async (id: string) => {
        try {

            setDeletingId(id);
            await axios.delete(`api/courses/${courseId}/attachments/${id}`);
            toast.success("attatchment deleted")
            router.refresh()

        } catch (error) {
            console.log("ERROR", error)
            toast.error('Something went wrong ! ')
        } finally {
            setDeletingId(null)
        }
    }

    const router = useRouter();


    // 2 - handle of submition of Form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success('Course Updated');
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
                Course Attachments
                <Button variant={"ghost"} onClick={toggleEdit} className="cursor-pointer " >
                    {isEdeting && (
                        <span>Cancel</span>
                    )}
                    {!isEdeting && initialData?.attachments.length === 0 && (
                        <>
                            <PlusCircle
                                className="h-4 w-4 mr-2"
                            />
                            Add an Attachments

                        </>

                    )}
                </Button>
            </div>
            {!isEdeting && (
                <>
                    {initialData?.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData?.attachments?.length > 0 && (
                        <div className="space-y-2">
                            {initialData?.attachments?.map((attachment) => (
                                <div key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100
                                        border-sky-200 border text-sky-700 rounded-md
                                    "
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div className="ml-auto">
                                            <Loader2
                                                className="h-4 w-4 animate-spin"
                                            />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button className="ml-auto hover:opacity-75 transition cursor-pointer" onClick={() => onDelete(attachment.id)}>
                                            <X className="h-4 w-4" />
                                        </button>

                                    )}
                                </div>
                            ))}
                        </div>
                    )

                    }
                </>
            )}
            {isEdeting && (
                <div>
                    <FileUpload
                        endPoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ Url: url })
                            }
                        }}

                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete the course
                    </div>
                </div>
            )

            }
        </div>
    )
}

export default AttachmentsForm