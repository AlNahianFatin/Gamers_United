"use client";

export default function Button({ children, type = "submit" }: any) {
  return (
    <button className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
        {children}
    </button>
  );
}