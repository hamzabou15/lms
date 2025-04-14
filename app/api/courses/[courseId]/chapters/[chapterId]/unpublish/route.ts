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
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });

        if (!chapter) {
            return new NextResponse("Chapter doesn't exist", { status: 404 });
        }

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            },
        });

        if (!chapter.isPublished) {
            // We're trying to publish it now
            if (!muxData || !chapter.description || !chapter.title || !chapter.videoUrl) {
                return new NextResponse("Missing required fields", { status: 400 });
            }
        }

        const updatedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: !chapter.isPublished,
            },
        });

        return NextResponse.json(updatedChapter);
    } catch (error) {
        console.error("PROBLEM UPDATING CHAPTER:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

