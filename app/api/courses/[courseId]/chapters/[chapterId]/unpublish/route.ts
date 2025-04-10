import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    const { userId } = await auth();
    try {
        if (!userId) {
            return new NextResponse("Unautorized", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unautorized", { status: 401 })
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId
            }
        })

        if (!chapter) {
            return new NextResponse("Chapter dont exist", { status: 401 })
        }

        const isPublishedChapter = chapter?.isPublished

        if (isPublishedChapter) {

            if (!chapter || !muxData || !chapter.description || !chapter.title || !chapter.videoUrl) {
                return new NextResponse("Missing resuired fields", { status: 400 })
            }

        }
        const publishingChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: !isPublishedChapter
            }
        })
        return NextResponse.json(publishingChapter)

    } catch (error) {
        console.log("PROBLEME THE UPDTE", error)
        return new NextResponse('Internal Error', { status: 500 })
    }



}
