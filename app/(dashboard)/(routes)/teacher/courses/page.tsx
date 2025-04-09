import { columns } from '@/app/payments/columns'
import { DataTable } from '@/app/payments/data-table'
import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import Link from 'next/link'
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
            <Link href={"/teacher/create"}>
                <Button className='cursor-pointer'>
                    New Course
                </Button>
            </Link>
            <DataTable
                columns={columns}
                data={courseData}
            />
        </div>
    )
}

export default CoursesPage
