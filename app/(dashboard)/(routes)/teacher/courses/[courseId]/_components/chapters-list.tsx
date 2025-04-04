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
import { Grip, Pencil } from "lucide-react";
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

    // logic for Drag
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return; // Si l'utilisateur relâche l'élément en dehors de la liste, on ignore

        const reorderedChapters = [...chapters];
        const [movedItem] = reorderedChapters.splice(result.source.index, 1);
        reorderedChapters.splice(result.destination.index, 0, movedItem);

        // Mise à jour des positions
        const updatedChapters = reorderedChapters.map((chapter, index) => ({
            ...chapter,
            position: index + 1, // Position 1-based
        }));

        setChapters(updatedChapters);
        onReorder(updatedChapters.map(({ id, position }) => ({ id, position })));
    };



    return (
        <DragDropContext onDragEnd={handleDragEnd}>
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
                                            <Pencil
                                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                                onClick={() => onEdit(chapter?.id)}
                                            />
                                        </div>
                                    </div>
                                )}

                            </Draggable>
                        ))
                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default ChaptersList
