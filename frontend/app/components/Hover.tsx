"use client";

export default function Hover({ children, name }: any) {
    return (
        <div className="tooltip">
            <div className="tooltip-content">
                <div className="animate-bounce text-orange-400 -rotate-10 text-2xl font-black">{children}</div>
            </div>
            <button className="btn">Hover me</button>
        </div>
    );
}