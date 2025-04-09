import { Loader } from "lucide-react";


interface LoadingProps {

    title: string;

}

const Loading = ({ title }: LoadingProps) => {
    return (
        <div className="fixed top-0 left-0 bg-slate-100/50 w-full h-full flex items-center justify-center z-50 gap-3">
            <Loader
                className="w-8 h-8 animate-spin"
            />
            <span>
                {title} ...
            </span>
        </div>
    )
}

export default Loading
