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
import { Badge } from "@/components/ui/badge";


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
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters?.map((chapter, index) => (
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}>

                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={cn("flex items-center gap-x-2 bg-slate-200 border border-slate-200 text-slate-700 rounded-md mb-4 text-sm"
                                            , chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"

                                        )}
                                    >
                                        <div

                                            {...provided.dragHandleProps}
                                            className={cn(
                                                "px-2 py-3 border-r border-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                            )}>
                                            <Grip />
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {chapter?.isFree && (
                                                <Badge >
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge className={cn("bg-slate-500"
                                                , chapter.isPublished && "bg-sky-700"

                                            )}  >
                                                {chapter?.isPublished ? "Published" : "Draft"}
                                            </Badge>
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
