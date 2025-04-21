import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { isCompleted } = body;

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted: isCompleted
            },
            update: {
                isCompleted: isCompleted
            }
        });

        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[CHAPTER_PROGRESS_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
