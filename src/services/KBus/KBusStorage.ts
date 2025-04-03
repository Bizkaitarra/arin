import {StopsStorage} from "../StopsStorage";
import stops from '../../data/paradas_kbus.json';
import {KBusStop} from "./KbusStop";

export class KBusStorage extends StopsStorage {
    constructor() {
        super('KBus_selected_stops', 'KBus_renamed_stops');
    }

    protected allStops(): KBusStop[] {
        return stops.map(stop => ({
            ...stop,
            latitude: parseFloat(stop.latitude),
            longitude: parseFloat(stop.longitude)
        }));
    }
}