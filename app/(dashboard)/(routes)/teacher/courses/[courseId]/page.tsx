import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { LayoutDashboard } from 'lucide-react';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/imageForm';

const CourseIdPage = async ({ params }:
    { params: { courseId: string } }
) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect('/')
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        }
    });

    const requiredFiles = [
        course?.title,
        course?.description,
        course?.imageUrl,
        course?.price,
        course?.categoryId
    ]

    const totalFields = requiredFiles.length;
    // return number of fields completed 
    const completedFields = requiredFiles.filter(Boolean).length;

    const completionText = `(${completedFields} / ${totalFields})`

    if (!course) {
        return redirect('/')
    }
    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>
                        Course Setup
                    </h1>
                    <span className='text-sm text-slate-700'>
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 '>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className='text-xl'>
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course?.id}
                    />
                    <DescriptionForm
                        initialData={{ description: course?.description ?? "" }}
                        courseId={course?.id}
                    />
                        <ImageForm
                        initialData={course}
                        courseId={course?.id}
                    />
                </div>
            </div>
        </div>
    )
}

export default CourseIdPage
