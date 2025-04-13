"use client"

import { cn } from "@/lib/utils";
import { CheckCircle, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
    id: string;
    label: string;
    isComplete: boolean;
    courseId: string;
    isLocked: boolean
}

const CourseSidebarItem = ({
    id,
    label,
    isComplete,
    courseId,
    isLocked

}: CourseSidebarItemProps) => {


    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : (
        isComplete ? CheckCircle : PlayCircle
    )


    const Isactive = pathname?.includes(id);


    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    }

    return (
        <button className={cn(
            "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20"
        )}>
            <div>
                <Icon
                />
                {label}
            </div>
        </button>
    )
}

export default CourseSidebarItem