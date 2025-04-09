"use client"

import Loading from "@/components/loading"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"


interface CourseActionsProps {
    disabled: boolean,
    courseId: string,
    isPublished: boolean
}

const CourseActions = ({ disabled, courseId, isPublished }: CourseActionsProps) => {


    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const confetti = useConfettiStore();

    const deleteCourse = async () => {

        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}`)
            router.push("/teacher/courses")
            toast.success("Course deleted !")

        } catch {
            toast.error("Something went wrong !")
        } finally {
            setIsLoading(false)
        }
    }



    const publishCourse = async () => {

        try {
            setIsLoading(true)
            await axios.patch(`/api/courses/${courseId}/publishCourse`)
            router.refresh()
            toast.success(`Course is ${!isPublished ? " published" : "unPublished"} `);
            if (isPublished) {
                confetti.onClose()

            } else {
                confetti.onOpen()
            }
        } catch (error) {
            console.log("ERROR", error)
            toast.error("Something went wrong !")
        } finally {
            setIsLoading(false)
        }

    }


    return (
        <>
            {isLoading &&

                <Loading
                    title="Deleting"
                />

            }
            <div className="flex items-center gap-x-2">
                <Button
                    onClick={publishCourse}
                    disabled={disabled || isLoading}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"

                >
                    {isPublished ? "Unpublish" : "Publish"}

                </Button>

                <ConfirmModal
                    onConfirm={deleteCourse}
                >
                    <Button
                        className="cursor-pointer"
                        size="sm"
                        disabled={isLoading}
                    >

                        <Trash />
                    </Button>
                </ConfirmModal>
            </div>
        </>
    )
}

export default CourseActions
