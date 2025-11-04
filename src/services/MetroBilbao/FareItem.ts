import {FareRate} from "./FareRate";

export interface FareItem {
    code: string;
    name: string;
    subTitle: string;
    personal: string;
    validate: string;
    terms: string;
    where: string;
    valid: string;
    required: string;
    periodicity: number;
    img: string;
    imgSlider: string;
    moreDetails: string;
    category: string;
    rates: FareRate[][];
    limitTravel: number;
    order: number;
}