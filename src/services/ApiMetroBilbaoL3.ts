import { MetroStop, MetroTrain, MetroStopTrains } from "./MetroBilbaoStorage";
import { Display } from "./MetroBilbao/Display";
import { fetchEuskotrenData } from "./Euskotren/ApiEuskotren";

export async function getMetroBilbaoL3StopTrains(display: Display, maxTrains: number): Promise<MetroStopTrains> {
    const today = new Date();
    if (!display.origin || !display.destination) {
        return {
            Display: display,
            Platform1: [],
            Platform2: [],
            isRoute: false
        };
    }

    const platform1Trains = await fetchEuskotrenData(display.origin.Code, display.destination.Code, today, maxTrains);
    const platform2Trains = await fetchEuskotrenData(display.destination.Code, display.origin.Code, today, maxTrains);

    return {
        Display: display,
        Platform1: platform1Trains.sort((a, b) => a.Estimated - b.Estimated),
        Platform2: platform2Trains.sort((a, b) => a.Estimated - b.Estimated),
        isRoute: true
    };
}

export async function getMetroBilbaoL3DisplaysTrains(displays: Display[], maxTrains: number = 60): Promise<MetroStopTrains[]> {
    const promises = displays.map(display => getMetroBilbaoL3StopTrains(display, maxTrains));
    return Promise.all(promises);
}
