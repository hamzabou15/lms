import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Cette fonction s'exécute lorsqu'on effectue une requête DELETE pour supprimer un attachement
export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { userId } = await auth(); // Authentification de l'utilisateur

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Vérification que l'utilisateur est le propriétaire du cours
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        // Suppression de l'attachement
        const attachment = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId
            }
        });

        return NextResponse.json(attachment); // Retourne la réponse après suppression
    } catch (error) {
        console.log("Error deleting attachment:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
