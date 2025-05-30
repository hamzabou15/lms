// app/course/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button.tsx
"use client"
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'


interface CourseEnrollButtonProps {
    courseId: string,
    price: number
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {

        try {
            setIsLoading(true);

            const res = await axios.post(`/api/courses/${courseId}/checkout`)
            window.location.assign(res.data.url);

        } catch (error) {
            toast.error("Something went wrong !");
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <Button onClick={onClick} size={"sm"} disabled={isLoading} className='w-full md:w-auto'>
            Enroll for {formatPrice(price)}
        </Button>
    )
}

export default CourseEnrollButton