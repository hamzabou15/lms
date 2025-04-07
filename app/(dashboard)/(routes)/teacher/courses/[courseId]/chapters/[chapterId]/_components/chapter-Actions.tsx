"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"


interface ChapterActionsProps {
    disabled: boolean,
    courseId: string,
    chapterId: string,
    isPublished: boolean
}

const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) => {


    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const deleteChapter = async () => {

        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            router.refresh()
            router.push(`/teacher/courses/${courseId}`)
            toast.success("Chapter deleted !")

        } catch {
            toast.error("Something went wrong !")
        } finally {
            setIsLoading(false)
        }
    }



    const publishChapter = async () => {

        try {
            setIsLoading(true)
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
            router.refresh()
            toast.success(`Chapter is ${!isPublished ? " published" : "unPublished"} `)

        } catch (error) {
            console.log("ERROR", error)
            toast.error("Something went wrong !")
        } finally {
            setIsLoading(false)
        }

    }

    console.log("disabled || isLoading", disabled, isLoading)

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={publishChapter}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
                className="cursor-pointer"

            >
                {isPublished ? "Unpublish" : "Publish"}

            </Button>

            <ConfirmModal
                onConfirm={deleteChapter}
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
    )
}

export default ChapterActions
