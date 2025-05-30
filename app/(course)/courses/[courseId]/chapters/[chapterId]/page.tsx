import { getChapter } from "@/actions/get-chapter"
import Banner from "@/components/banner"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import VideoPlayer from "./_components/video-player"
import CourseEnrollButton from "./_components/course-enroll-button"
import { Separator } from "@/components/ui/separator"
import { Preveiw } from "@/components/preview"
import { File } from "lucide-react"
import CourseProgressButton from "./_components/course-progress-button"

const ChapterIdPage = async ({
    params
}: {
    params: {
        courseId: string,
        chapterId: string
    }
}) => {

    const { userId } = await auth()

    if (!userId) {
        return redirect("/")
    }



    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase
    } = await getChapter({

        chapterId: params.chapterId,
        courseId: params.courseId,
        userId: userId

    });

    if (!chapter || !course) {
        return redirect('/')
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted


    // if (!muxData?.playbackId && !isLocked) {
    //     console.error("❌ playbackId is missing for unlocked chapter", {
    //         chapterId: params.chapterId,
    //         muxData
    //     });
    //     return redirect("/"); // ou afficher un message d'erreur
    // }

    
    console.log("userProgress" , userProgress)

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    label="You already completed this chapter."
                    variant="success"
                />
            )}
            {isLocked && (
                <Banner
                    label="You need to purchase this course to see this chapter."
                    variant="warning"
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId || ""}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}

                    />
                </div>
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold mb-2">
                        {chapter.title}
                    </h2>
                    {purchase ? (
                        <CourseProgressButton
                            chapterId={params.chapterId}
                            courseId={params.courseId}
                            nextChapterId={nextChapter?.id || ""}
                            isCompleted={userProgress?.isCompleted}
                        />
                    ) : (
                        <CourseEnrollButton
                            courseId={params.courseId}
                            price={course.price || 0}
                        />
                    )}
                </div>
                <Separator />
                <div>
                    <Preveiw
                        value={chapter.description!}
                    />
                </div>
                {!!attachments.length && (
                    <>
                        <div>
                            {attachments.map((item) => (
                                <a key={item.id} href={item.url} target="_blank"
                                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hove:underline"
                                >
                                    <File />
                                    <p className="line-clamp-1">
                                        {item.name}
                                    </p>

                                </a>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ChapterIdPage
