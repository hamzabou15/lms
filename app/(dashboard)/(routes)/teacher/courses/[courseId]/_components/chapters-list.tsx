"use client"

import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd"

import { cn } from "@/lib/utils";
import { Grip } from "lucide-react";

interface ChaptersListprops {
    items: Chapter[],
    onEdit: (id: string) => void,
    onReorder: (updateData: { id: string; position: number }[]) => void
}

const ChaptersList = ({
    items, onEdit, onReorder
}: ChaptersListprops) => {


    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    // to fix prob SRR / CSR
    useEffect(() => {
        setIsMounted(true)
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items])

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={() => { }}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps}>
                        {
                            chapters?.map((chapter, index) => (
                                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={cn("flex items-center gap-x-2 bg-slate-200 border-slate-200 text-slate-700 rounded-b-md mb-4 text-sm"
                                                , chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"

                                            )}
                                        >
                                            <div

                                                {...provided.dragHandleProps}
                                                className={cn(
                                                    "px-2 py-3 border-r border-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                    chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                                )}>
                                                    <Grip/>
                                                {/* {chapter.title} */}

                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        }
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default ChaptersList
