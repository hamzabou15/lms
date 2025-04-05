
import ReactQuill from 'react-quill-new';
import "react-quill/dist/quill.snow.css";


interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}



export const Editor = ({ onChange, value }: EditorProps) => {



    return (
        <div style={{ backgroundColor: "white" }}>
            <ReactQuill value={value} onChange={onChange} />
        </div>
    );
};
