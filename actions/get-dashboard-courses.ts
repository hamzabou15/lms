import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client"
import { getProgress } from "./get-progress";


type CoursewithProgresswithCategory = Course & {

    category: Category;
    chapters: Chapter[];
    progress: number | null;
}

type DashboardCourses = {
    completedCourses: CoursewithProgresswithCategory[],
    coursesInProgress: CoursewithProgresswithCategory[],
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {

    try {

        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            }
                        },

                    }
                }
            }
        })

        const courses = purchasedCourses.map((purchase) => purchase.course) as CoursewithProgresswithCategory[]

        for (let course of courses) {
            const progress = await getProgress(userId, course.id)

            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100)
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100)

        return {
            completedCourses,
            coursesInProgress,
        }

    } catch (error) {
        console.log("[getDashboardCoursesError]", error)
        return {
            completedCourses: [],
            coursesInProgress: [],
        }
    }

}