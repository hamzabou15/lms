import { db } from "@/lib/db"
import { redirect } from "next/navigation"


const CourseIdPge = async ({
  params
}: {
  params: { courseId: string }
}) => {

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true
        },
        orderBy: {
          position: "asc"
        }
      }

    }
  })

  if (!course) {
    return redirect('/')
  }

  // to redirect directly to the first chapter
  return redirect(`/courses/${course.id}/chapters/${course.chapters?.[0].id}`)

}

export default CourseIdPge