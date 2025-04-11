"use client"

import Loading from "@/components/loading"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useState } from "react"
import { IconType } from "react-icons"



interface CategotyItemProps {
    label: string,
    value?: string,
    icon?: IconType
}
const CategoryItem = ({ label, value, icon: Icon }: CategotyItemProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();


    const currentCategoryId = searchParams.get('categoryId');
    const currentTitle = searchParams.get('title')

    const isSelected = currentCategoryId === value

    const [isLoading, setIsloading] = useState(false);

    const onClick = () => {
        setIsloading(true)
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
        setIsloading(false)
    }

    return (
        <>
            {isLoading
                &&
                <Loading
                    title="Loading"
                />
            }
            <button
                onClick={onClick}
                type="button"
                className={cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
                    isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"

                )}>
                {Icon && <Icon size={20} />}
                <div className="truncate">
                    {label}
                </div>
            </button>
        </>
    )
}

export default CategoryItem
