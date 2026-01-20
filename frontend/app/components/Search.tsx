"use client";

export default function Search({ children, name }: any) {
    return (
        <div className="join">
            <div>
                {/* <div> */}
                    <input className="input join-item p-5" placeholder="Search" />
                <button className="btn join-item">Search</button>
                {/* </div> */}
            </div>
            <select className="select join-item">
                <option defaultValue={""}>Filter</option>
                <option>Sci-fi</option>
                <option>Drama</option>
                <option>Action</option>
            </select>
            <div className="indicator">
                {/* <span className="indicator-item badge badge-secondary">new</span> */}
            </div>
        </div>
    );
}