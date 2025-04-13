import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import CourseSidebarItem from './courseSidebarItem'


interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    },
    progressCount: number
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {

    const { userId } = await auth();

    if (!userId) {
        return redirect('/')
    }

    const purchase = await db.purchase.findUnique({
        where: {
            // the combination beteen userId and courseId in oer schema purchase
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    });

    return (
        <div className='h-full brder-r flex flex-col overflow-y-auto shadow-sm'>
            <div className='p-8 flex flex-col  border-b '>
                <h1 className='font-semibold'>
                    {course.title}
                </h1>
                {/* check purchase  and add progress*/}
            </div>
            <div className='flex flex-col w-full'>
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isComplete={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={chapter.isFree}
                    />

                ))

                }
            </div>
        </div>
    )
}

export default CourseSidebar
