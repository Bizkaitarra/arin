import {KBusStop} from "./KbusStop";

export interface KBusArrivalResponse {
    stop: KBusStop;
    arrivals: KBusArrival[];
}

export interface KBusArrival {
    line: string;
    destination: string;
    secondsToArrival: number;
    timeToArrival: string;
}