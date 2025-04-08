import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { File, LayoutDashboard, ListChecks } from 'lucide-react';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/imageForm';
import CategoryForm from './_components/category-form';
import PriceForm from './_components/price-form';
import AttachmentsForm from './_components/attachments-form';
import ChaptersForm from './_components/chapters-form';
import CourseActions from './_components/course-Actions';

const CourseIdPage = async ({ params }:
    { params: { courseId: string } }
) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect('/')
    }

    const course = await db.course.findUnique({
        where: {
            id: params?.courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "asc"
                }

            }

        }
    });

    const requiredFiles = [
        course?.title,
        course?.description,
        course?.imageUrl,
        course?.price,
        course?.categoryId,
        course?.chapters?.some(Chapter => Chapter?.isPublished)
    ]

    const totalFields = requiredFiles.length;
    // return number of fields completed 
    const completedFields = requiredFiles.filter(Boolean).length;

    const completionText = `(${completedFields} / ${totalFields})`


    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        }
    });

    // if don't have the course ith the ID  / return to the ("/")
    if (!course) {
        return redirect('/')
    }

    const isComplete = requiredFiles.every(Boolean)


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
                <CourseActions
                    courseId={params?.courseId}
                    disabled={!isComplete}
                    isPublished={course?.isPublished}
                />
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
                    <CategoryForm
                        initialData={course}
                        courseId={course?.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />
                </div>
                <div className='space-y-6'>
                    <div >
                        <div className='flex items-center gap-x-2'>
                            <IconBadge
                                icon={ListChecks}
                            />
                            <h2 className='text-xl'>Course Chapters</h2>
                        </div>
                        <ChaptersForm
                            initialData={course}
                            courseId={course?.id}
                        />
                    </div>
                    <PriceForm
                        courseId={course.id}
                        initialData={{
                            price: course.price ?? 0
                        }} />
                    <div className='flex items-center gap-x-2'>
                        <IconBadge
                            icon={File}
                        />
                        <h2 className='text-xl'>Resources & Attachments </h2>

                    </div>
                    <AttachmentsForm
                        initialData={course}
                        courseId={course?.id}
                    />

                </div>
            </div>
        </div>
    )
}

export default CourseIdPage
