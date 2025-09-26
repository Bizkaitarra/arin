import {StopsStorage} from "../StopsStorage";
import stops from '../../data/paradas_renfe.json';
import {RenfeStop} from "./RenfeStop";


export class RenfeStorage extends StopsStorage {
    constructor() {
        super('Renfe_selected_stops', 'Renfe_renamed_stops');
    }

    protected allStops(): RenfeStop[] {
        return stops.map(stop => ({
            ...stop,
            latitude: stop.latitude,
            longitude: stop.longitude
        }));
    }
}