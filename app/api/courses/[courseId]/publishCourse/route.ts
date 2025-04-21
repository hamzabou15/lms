import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {

    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // get the entire course mit ID and include to it the muxData of chapters ( video / description .. )
        const course = await db.course.findUnique({
            where: {
                userId: userId,
                id: params.courseId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        if (!course) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // to verfiy if existe at least one chapter published
        const hasPublishedChapter = course.chapters.some((chapter) =>
            chapter.isPublished
        )

        if (!hasPublishedChapter || !course?.description || !course?.title || !course?.imageUrl || !course?.categoryId) {
            return new NextResponse('Missing fields', { status: 400 })
        }

        const isPublishedCourse = course.isPublished

        // check if course is ublished to retun it Unpublished
        if (isPublishedCourse) {
            const courseUnPublished = await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
            return NextResponse.json(courseUnPublished)
        }
        // check if course is unPublished to retun it Published
        else {
            const coursePublished = await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: true
                }
            })
            return NextResponse.json(coursePublished)

        }


    } catch (error) {
        console.log("COURSE PUBLISHING ERROR", error)
        return new NextResponse("Internal error", { status: 500 })
    }

}