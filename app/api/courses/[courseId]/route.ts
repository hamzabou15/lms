import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
  ) {
    try {
      const { userId } = await auth();
      const { courseId } = params;
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
  
      console.log("Course updated successfully:", courseUpdated);
      return NextResponse.json(courseUpdated);
    } catch (error) {
      console.error("Error in PATCH handler:", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
