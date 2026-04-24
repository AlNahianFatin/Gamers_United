"use client";

import React, { useEffect, useRef } from "react";

export default function PopUp({ topic, text, option1, option2, onConfirm, onClose }: any) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    const handleClose = () => {
        dialogRef.current?.close();
        onClose();
    };

    return (
        <dialog ref={dialogRef} className="modal" onClick={handleClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-bold text-lg">{topic}</h3>
                <p className="py-4">{text}</p>

                <div className="flex justify-end gap-4">
                    <button className="btn bg-red-400 hover:bg-red-500 text-black" onClick={() => { onConfirm(); dialogRef.current?.close(); }} > {option1} </button>

                    <button className="btn btn-outline" onClick={() => { dialogRef.current?.close(); onClose(); }} > {option2} </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop bg-transparent">
                <button onClick={() => { dialogRef.current?.close(); onClose(); }}></button>
            </form>
        </dialog>
    );
}