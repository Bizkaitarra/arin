import {Stop} from "../Stop";

export interface KBusStop extends Stop {
    "lines": KBusLine[]
}

export interface KBusLine {
    "lineName": string;
    "direction": string;
    "ruteName": string;
    "bus": string;
}