import Image from "next/image";
import Link from "next/link";


interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chapterLength: number;
    price: number;
    progress: number | null;
    category: string;

}

const CourseCard = ({
    id,
    title,
    imageUrl,
    chapterLength,
    price,
    progress,
    category,

}: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
                <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                        <Image
                         alt=""
                            fill
                            className="object-cover"
                            src={imageUrl}
                        />

                    </div>
                </div>

        </Link>
    )
}

export default CourseCard