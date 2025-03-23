"use client"

import { ourFileRouter } from "@/app/api/uploadthing/core"
import { UploadDropzone } from "@/lib/uploaddthing"
import toast from "react-hot-toast";

interface FileUplodeProps {
  onChange: (url?: string) => void;
  endPoint: keyof typeof ourFileRouter;
}

const FileUplode = ({
  onChange, endPoint
}: FileUplodeProps) => {
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error.message}`)
      }}
    />
  )
}

export default FileUplode
