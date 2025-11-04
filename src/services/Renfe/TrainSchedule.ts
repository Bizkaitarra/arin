import {RenfeStop} from "./RenfeStop";

export interface TrainSchedule {
    line: string;
    trainId: string;
    timeToGo: number;
    departure: string;
    arrival: string;
    duration: string;
    isAccessible: boolean;
    transData?: {
        transStation: RenfeStop | null;
        arrival: string;
        departure: string;
        line: string;
        timeToGo: number;
    };
}