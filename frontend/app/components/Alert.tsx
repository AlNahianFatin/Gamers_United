export default function Alert({ text, type = "success" }: any) {
    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999]">
            <div role="alert" className={`alert alert-${type} shadow-lg text-center`}>
                <span className="w-full text-center">{text}</span>
            </div>
        </div>
    );
}