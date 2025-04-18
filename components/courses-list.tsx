import { Category, Course } from '@prisma/client'
import React from 'react'
import CourseCard from '@/components/course-card';


type CourseWithProgressWithGategory = Course & {

    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
}

interface CoursesListProps {

    items: CourseWithProgressWithGategory[]
}
const CoursesList = ({ items }: CoursesListProps) => {
    return (
        <div>
            <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'>
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chapterLength={item.chapters.length}
                        price={item.price!}
                        progress={item.progress}
                        category={item.category?.name ?? ""}
                    />
                ))
                }
            </div>
            {
                items.length === 0 && (
                    <div className='text-center text-sm text-muted-foreground'>
                        No courses found
                    </div>
                )

            }
        </div>

    )
}

export default CoursesList
