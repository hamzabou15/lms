// import { createRouteHandler } from "uploadthing/next";
// import { ourFileRouter } from "./core";

// // Debug logging
// console.log("[UploadThing] Initializing route handler at:", 
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000/api/uploadthing"
//     : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/uploadthing`);

// // app/api/uploadthing/route.ts
// export const { GET, POST } = createRouteHandler({
//   router: ourFileRouter,
//   config: {
//     callbackUrl: process.env.NODE_ENV === "development"
//       ? "http://localhost:3000/api/uploadthing"
//       // Use Vercel's provided environment variable
//       : `https://${process.env.VERCEL_URL}/api/uploadthing`,
//     logLevel: "Debug"
//   },
// });

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // Production callback URL must match exactly
    callbackUrl: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/uploadthing`
      : "http://localhost:3000/api/uploadthing",
    logLevel: "Debug",
  },
});