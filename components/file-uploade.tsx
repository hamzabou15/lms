"use client"

import { ourFileRouter } from "@/app/api/uploadthing/core"
import { UploadDropzone } from "@/lib/uploaddthing"
import toast from "react-hot-toast";
import { twMerge } from 'tailwind-merge'


interface FileUplodeProps {
  onChange: (url?: string) => void;
  endPoint: keyof typeof ourFileRouter;
}

const FileUpload = ({
  onChange, endPoint
}: FileUplodeProps) => {
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        if (!res?.[0]?.url) {
          toast.error("Upload completed but no URL received");
          return;
        }
        else {
          toast.success("File uploaded");
        }
        
        // Add slight delay for Neon to process
        setTimeout(() => onChange(res[0].url), 500);
      }}
      onUploadError={(error: Error) => {
        console.log("error" , error)
        toast.error(`${error.message}`)
      }}
      config={{ cn: twMerge }}

    />
  )
}

export default FileUpload

