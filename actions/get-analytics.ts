import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchasewithCourse = Purchase & {
    course: Course;
}


const groupByCourse = (purchases: PurchasewithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purchase.course.price || 0;
    });
    return grouped;
}


export async function getAnalytics(userId: string) {

    try {

        const purchased = await db.purchase.findMany({
            where: {
                course: {
                    userId: userId,
                }
            },
            include: {
                course: true
            }
        })

        const groupedEarnings = groupByCourse(purchased);

        const data = Object.entries(groupedEarnings).map(([courseTitle, totalRevenue]) => ({
            name: courseTitle,
            total: totalRevenue
        }))

        const totalRevenue = data.reduce((acc, item) => acc + item.total, 0)
        const totalSales = purchased.length;

        return {
            data,
            totalRevenue,
            totalSales
        }


    } catch (error) {
        console.log("[getAnalyticsError]", error)
        return {
            data: [],
            totalRevenue: 0
        }
    }

}