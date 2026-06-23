import {FareItem} from "./FareItem";

export interface FareCategory {
    type: string;
    order: number;
    items: FareItem[];
}