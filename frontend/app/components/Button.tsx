"use client";

export default function Button({ text, type = "submit" }: any) {
  return (
    <button className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded w-min-content">
        {text}
    </button>
  );
}