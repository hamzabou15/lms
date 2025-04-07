"use client";

import ReactQuill from 'react-quill-new';


import "react-quill/dist/quill.bubble.css";


interface PreveiwProps {
    value: string;
}


export const Preveiw = ({
    value
}: PreveiwProps) => {



    return (
        <ReactQuill
            theme="bubble"
            value={value}
            readOnly
        />
    )

}
