"use client"
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import FileUpload from "@/components/file-uploade";
import MuxPlayer from "@mux/mux-player-react";

// 0 - definition of schema validation ith ZOD
const formSchema = z.object({

    videoUrl: z.string().min(1)
})

interface ChapterVideoFormProps {
    initialData: Chapter & {
        muxData?: MuxData | null
    };
    courseId: string;
    chapterId: string;
};

// component of ChapterVideoForm
const ChapterVideoForm = ({
    initialData, courseId, chapterId
}: ChapterVideoFormProps) => {

    const [isEdeting, setIsEdeting] = useState(false);

    const router = useRouter();


    // 2 - handle of submition of Form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success('Chapter Updated');
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
                    {!isEdeting && !initialData.videoUrl && (
                        <>
                            <PlusCircle
                                className="h-4 w-4 mr-2"
                            />
                            Add an video

                        </>

                    )}
                    {!isEdeting && initialData.videoUrl && (

                        <>
                            <Pencil className="h-4 w-4 ml-2 mr-2" />

                            <>Edit video</>
                        </>
                    )}
                </Button>
            </div>
            {!isEdeting && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center  bg-slate-200 rounded-md "
                        style={{ height: "180px", backgroundColor: "#e2e8f0" }}
                    >
                        <VideoIcon
                            className="h-10 w-10 text-slate-500"
                        />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 ">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />

                    </div>
                )
            )
            }
            {isEdeting && (
                <div> 
                    <FileUpload
                        endPoint="chapterVideo"
                        onChange={(url) => {
                            console.log("File uploaded URL:", url); // Debugging log
                            if (url) {
                                onSubmit({ videoUrl: url })
                            }
                        }}

                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chpter&apos;s video
                    </div>
                </div>
            )

            }
            {initialData?.videoUrl && !isEdeting && (
                <div className="text-xs text-muted-foreground mt-2">
                    Video can take a few minutes to process, Refresh the page if video does not appear
                </div>
            )}
        </div>
    )
}

export default ChapterVideoForm