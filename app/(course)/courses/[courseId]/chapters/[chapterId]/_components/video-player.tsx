"use client"

import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import toast from "react-hot-toast";


interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}


const VideoPlayer = ({ playbackId, courseId, chapterId, nextChapterId, isLocked, completeOnEnd, title }: VideoPlayerProps) => {

    const [isReady, setIsReady] = useState(false)
    const router = useRouter()
    const confetti = useConfettiStore();


    // logic for end of video or chapter
    const onEnded = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true,
                });
            }
            if (!nextChapterId) {
                confetti.onOpen()
            }
            toast.success("Progress updated !")

            if (nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }
            router.refresh()


        } catch (error) {
            console.log("ERROR", error)
            toast.error("Something went wrong !")

        }

    }



    return (
        <div className="relative aspect-video ">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2
                        className="h-8 w-8 animate-spin text-secondary"
                    />
                </div>
            )}
            {isLocked && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary"
                >
                    <Lock
                        className="h-8 w-8"
                    />
                    <p className="text-md">
                        This chapter is locked
                    </p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(!isReady && "hidden")}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={onEnded}

                    autoPlay
                    playbackId={playbackId}
                />

            )}
        </div>
    )
}

export default VideoPlayer