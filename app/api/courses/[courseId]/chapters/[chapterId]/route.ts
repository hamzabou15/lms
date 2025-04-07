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

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = await auth();
        // check user id
        if (!userId) {
            return new NextResponse("Unautorized", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        // check if the user is the Owner of course
        if (!courseOwner) {
            return new NextResponse("Unautorized", { status: 401 })
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })

        // check if the chapter is existe
        if (!chapter) {
            return new NextResponse("Not found", { status: 404 })
        }
        // check if there is at least one video in the mux data mit the ID of the same
        //  chapter and delete the video and the muxData accociate
        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    id: params.chapterId,
                }
            })

            if (existingMuxData) {
                // delete the video from MUX
                await video.assets.delete(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                })
            }
        }

        // delete the chapter
        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        });

        // check if we have chapters mit isPublished
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        })

        // if we dont have in this case update course to unPublished
        if (!publishedChaptersInCourse) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false,
                }
            })
        }

        // return the response deleted chapter
        return NextResponse.json(deletedChapter)

    } catch (error) {
        console.log('[DELETE CHPTER]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
