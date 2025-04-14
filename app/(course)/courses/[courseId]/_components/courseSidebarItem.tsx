"use client"

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
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

    const Icon = !isLocked ? Lock : (
        isComplete ? CheckCircle : PlayCircle
    )


    const Isactive = pathname?.includes(id);


    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20"
                , Isactive && "text-slate-600 bg-slate-400/20"
            )}>
            <div className="flex items-center gap-x-2 p-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-slate-500",
                        Isactive && "text-slate-700",
                        isComplete && "text-emerald-700"
                    )}


                />
                {label}
            </div>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
                Isactive && "opacity-100",
                isComplete && "border-emerald-700"
            )}>

            </div>
        </button>
    )
}

export default CourseSidebarItem