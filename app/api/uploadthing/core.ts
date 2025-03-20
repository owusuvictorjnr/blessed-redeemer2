import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      console.log(" Checking session before upload...");
      const session = await auth();

      if (!session) {
        console.error(" UploadThing Error: User not authenticated!");
        throw new UploadThingError("Unauthorized");
      }

      console.log(" User authenticated:", session.user.id);
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(" Upload complete. File URL:", file.url);
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;



// import { createUploadthing, type FileRouter } from 'uploadthing/next'
// import { UploadThingError } from 'uploadthing/server'
// import { auth } from '@/auth'

// const f = createUploadthing()

// // FileRouter for your app, can contain multiple FileRoutes
// export const ourFileRouter = {
//   // Define as many FileRoutes as you like, each with a unique routeSlug
//   imageUploader: f({ image: { maxFileSize: '4MB' } })
//     // Set permissions and file types for this FileRoute
//     .middleware(async () => {
//       // This code runs on your server before upload
//       const session = await auth()

//       // If you throw, the user will not be able to upload
//       if (!session) throw new UploadThingError('Unauthorized')

//       // Whatever is returned here is accessible in onUploadComplete as `metadata`
//       return { userId: session?.user?.id }
//     })
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     .onUploadComplete(async ({ metadata, file }) => {
//       // This code RUNS ON YOUR SERVER after upload

//       // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
//       return { uploadedBy: metadata.userId }
//     }),
// } satisfies FileRouter

// export type OurFileRouter = typeof ourFileRouter
