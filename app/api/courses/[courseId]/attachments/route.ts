import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { Url } = await req.json();
        console.log("URL" , Url)
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const attachments = await db.attachment.create({
            data: {
                url:Url,
                name: Url?.split("/").pop(),
                courseId: params.courseId
            }
        });

        return NextResponse.json(attachments);

    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}