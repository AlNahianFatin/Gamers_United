import Link from "next/link";

type Category = {
    id: number;
    name: string;
    description: string;
};

type Developer = {
    id: number;
    username: string;
    image: string | null;
    NID: string;
    phone: string;
    created_at: string;
};

type Game = {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    trailer: string;
    game: string;
    published_at: string;
    view_count: number;
    play_count: number;
    purchase_count: number;
    categories: Category[];
    developer: Developer;
};

type PaginatedGames = {
    data: Game[];
    total: number;
    page: number;
    lastPage: number;
};

async function getGames(page: number): Promise<PaginatedGames> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getBestsellerGames?page=${page}`, {
            cache: "no-store",
        });

        if (!res.ok)
            throw new Error("Failed to fetch");

        return res.json();
    }
    catch (error) {
        console.error(error);
        return { data: [], total: 0, page: 1, lastPage: 1, };
    }
}

export default async function GetBestsellers({ page }: { page: number }) {
    const result = await getGames(page);

    const games = result.data;
    const totalPages = result.lastPage;

    if (!games.length) {
        return <p className="text-center mt-10">Error fetching data</p>;
    }

    return (
        <>
            <div className="flex flex-wrap gap-15 justify-center p-6">
                {games.map((item: Game, index: number) => (
                    <div key={item.id} className="card bg-base-100 w-60 shadow-md">
                        <Link href={`/game/${item.id}`}>
                            <div className="relative h-56 w-full overflow-hidden">
                                <img src={`${process.env.NEXT_PUBLIC_API_URL}/getGamePicByID/${item.id}`} alt={item.title} className="h-full w-full object-contain" />
                            </div>

                            <div className="card-body">
                                <h2 className="card-title"> {item.title}
                                    <div className="badge badge-secondary ml-2"> #{index + 1} </div>
                                </h2>

                                <p>{item.description}</p>

                                <div className="flex items-center gap-2 text-sm">
                                    <img src="/coloreddeveloper.png" alt="Developer" style={{ width: "30px", height: "auto" }} />
                                    <span> <strong> {item.developer.username} </strong> </span>
                                </div>

                                <p className="text-sm"> ${item.price} </p>

                                {/* <p className="text-sm"> <strong>Sold:</strong> {item.purchase_count} </p> */}

                                <div className="card-actions justify-end flex-wrap"> {item.categories.map((cat) => (
                                    <div key={cat.id} className="badge badge-outline"> {cat.name} </div>
                                ))}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-3 mb-10">
                {page > 1 && <Link href={`/bestsellers?page=${page - 1}`}>Prev</Link>}
                {Array.from({ length: totalPages }, (_, i) => (
                    <Link key={i} href={`/bestsellers?page=${i + 1}`}
                    className={`px-4 py-2 border ${page === i + 1 ? "bg-black text-white" : ""}`}>
                        {i + 1}
                    </Link>
                ))}
                {page < totalPages && <Link href={`/bestsellers?page=${page + 1}`}>Next</Link>}
            </div>
        </>
    );
}