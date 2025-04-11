import { columns } from '@/app/payments/columns'
import { DataTable } from '@/app/payments/data-table'
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import React from 'react'
import { db } from '@/lib/db';



const CoursesPage = async () => {

    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const courseData = await db.course.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className='p-6'>
            <DataTable
                columns={columns}
                data={courseData}
            />
        </div>
    )
}

export default CoursesPage
