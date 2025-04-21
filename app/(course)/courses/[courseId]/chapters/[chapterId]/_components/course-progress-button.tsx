"use client"

import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import axios from "axios"
import { CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"


interface CourseProgressButtonProps {
    chapterId: string,
    courseId: string,
    isCompleted?: boolean,
    nextChapterId?: string,
}

const CourseProgressButton = ({
    chapterId,
    courseId,
    isCompleted,
    nextChapterId
}: CourseProgressButtonProps) => {

    const Icon = isCompleted ? XCircle : CheckCircle
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const [completed, setCompleted] = useState(isCompleted ?? false);


    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !completed,
            });
            
            setCompleted(!completed);

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }

            toast.success("Chapter updated !")
            router.refresh()

        } catch {
            toast.error("Something went wrong !")
        } finally {
            setIsLoading(false)
            router.refresh()
        }
    }

    console.log("isCompleted", isCompleted)

    return (
        <Button
            type="button"
            onClick={onClick}
            variant={isCompleted ? "destructive" : "success"}
        >
            {isCompleted ? "Not completed" : "Mark as Complete"}
            <Icon
                className="h-4 w-4 ml-2"
            />
        </Button>
    )
}

export default CourseProgressButton
