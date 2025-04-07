import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";


const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});



export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }

) {
    try {

        const { userId } = await auth();
        console.log(userId , "userId");
        const { isPublished, ...values } = await req.json()
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



        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values,
                isPublished
            }
        })

        if (values.videoUrl) {
            const existingData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });
            if (existingData) {
                await video.assets.delete(existingData?.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingData.id
                    }
                });
            }

            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: 'public',
                test: false,
            });

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })
        }

        return NextResponse.json(chapter)

    } catch (error) {
        console.log("[COURSES_CHPTER_ID]", error);
        return new NextResponse("Internl error", { status: 500 })
    }
}