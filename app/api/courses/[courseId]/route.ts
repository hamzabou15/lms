import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";


// Method to get the video process from Mux
const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});


// PATCH methode to every time the course Updated
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;

    console.log("req", req)
    // get all data fron the req
    const values = await req.json();

    console.log("Updating course with values:", values); // Add logging

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const courseUpdated = await db.course.update({
      where: { id: courseId, userId },
      data: values,
    });

    return NextResponse.json(courseUpdated);
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {

  try {

    const { userId } = await auth()


    if (!userId) {
      return new NextResponse("Unautorized", { status: 400 })
    }

    // get the course and add chapters related to it
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
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
      return new NextResponse("Course not found", { status: 404 })
    }

    // create boucle to check all chapters related to this course and delete all muxData (video / description ) related
    for (const chapter of course.chapters) {
      console.log("Deleting Mux asset:", chapter.muxData?.assetId)
      if (chapter.muxData?.assetId) {
        video.assets.delete(chapter?.muxData?.assetId)
      }
    }

    // delete the coutrse mit ID
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId
      }
    })

    return NextResponse.json(deletedCourse)


  } catch (error) {
    console.log("DELETE COURSE ERROR", error)
    return new NextResponse('Internal server error', { status: 500 })
  }

}