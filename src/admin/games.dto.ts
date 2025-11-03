export class GamesDTO {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string[];
    image_url: string;
    trailer_url: string;
    view_count: number;
    purchase_count: number;
    play_count: number;
    published_at: Date;
}