// import CourseIdPage from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {

  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  return { userId };
};



// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlu 
  CourseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 }
  }).middleware(() => handleAuth())
    .onUploadComplete(() => {

    }),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {

    }),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
