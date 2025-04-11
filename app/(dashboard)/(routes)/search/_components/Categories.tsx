"use client"

import { Category } from "@prisma/client"
import { IconType } from "react-icons";

interface CategoriesProps {
    items: Category[];

}

import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode

} from "react-icons/fc"
import CategoryItem from "./category-item";


const iconMap: Record<Category["name"], IconType> = {
    "Music": FcMusic,
    "Photography": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Accounting": FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    "Filming": FcFilmReel,
    "Enginnering": FcEngineering,
}

const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    label={item.name}
                    icon={iconMap[item.name]}
                    key={item.id}
                    value={item.id}
                />

            ))}
        </div>
    )
}

export default Categories
