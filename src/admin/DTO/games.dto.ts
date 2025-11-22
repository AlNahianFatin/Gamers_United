export class GamesDTO {
    id: number;
    title: string;
    developed_by: number;
    description: string;
    price: number;
    category: string[];
    image_url: string;
    trailer_url: string;
    published_at: Date;
    view_count: number;
    play_count: number;
    purchase_count: number;
}