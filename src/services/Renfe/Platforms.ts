import {RenfeStop} from "./RenfeStop";
import {TrainSchedule} from "./TrainSchedule";

export interface Platforms {
    origin: RenfeStop;
    destiny: RenfeStop;
    Platform1: TrainSchedule[];
    Platform2: TrainSchedule[];
    duration1?: string;
    duration2?: string;
}