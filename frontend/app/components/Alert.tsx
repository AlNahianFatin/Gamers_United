
type AlertProps = {
    text: string;
    type?: "success" | "error" | "warning";
};

export default function Alert({ text, type = "success" }: AlertProps) {
    const bgColor = type === "success" ? "bg-blue-600" : type === "error" ? "bg-red-500" : "bg-yellow-500";
    const borderColor = type === "success" ? "border-white" : type === "error" ? "border-black" : "border-black";
    const textColor = type === "success" ? "text-white-500" : type === "error" ? "text-black" : "text-black";
    return (
        <>
            {type === "success"}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-9999">
                <div role="alert" className={`alert alert-${type} shadow-lg text-center ${bgColor} border ${borderColor}  ${textColor}`}>
                    <span className="w-full text-center">{text}</span>
                </div>
            </div>
        </>
    );
}