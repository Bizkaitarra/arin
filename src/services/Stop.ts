export interface Stop {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    customName?: string;
    isFavorite?: boolean;
}