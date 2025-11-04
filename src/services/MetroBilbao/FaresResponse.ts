import {FareCategory} from "./FareCategory";

export interface FaresResponse {
    title: string;
    description: string;
    configuration: {
        categorized: { [key: string]: FareCategory };
    };
}