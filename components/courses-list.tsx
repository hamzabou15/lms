import { Category, Course } from '@prisma/client'
import React from 'react'


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
            {items.map((item) => (
                <div key={item.id}>
                    {item.title}
                </div>
            ))

            }
        </div>
    )
}

export default CoursesList
