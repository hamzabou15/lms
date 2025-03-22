import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            courseId: string
        }
    }
) {
    try {
        const { userId } = await auth();
        const { courseId } = params;
        const values = await req.json();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Mise à jour du cours en base de données "PRISM"
        const courseUpdated = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(courseUpdated)

    } catch (error) {
        console.log("[COURSES_ID]", error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}