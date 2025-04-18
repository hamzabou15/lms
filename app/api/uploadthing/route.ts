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