"use client";

export default function Hover({ tag, text }: any) {
    return (
        <div className="tooltip" data-tip={text}>
            <button className="btn">Hover me</button>
        </div>
    );
}