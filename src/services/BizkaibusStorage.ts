const STORAGE_KEY = 'bizkaibus_selected_stops';
export interface Parada {
    PROVINCIA: string;
    DESCRIPCION_PROVINCIA: string;
    MUNICIPIO: string;
    DESCRIPCION_MUNICIPIO: string;
    PARADA: string;
    DENOMINACION: string;
}
export function getSavedStationIds(): string[] {
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (savedStops) {
        return JSON.parse(savedStops);
    }
    return [];
}
export function getSavedStations(stations: Parada[]): Parada[] {
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (savedStops) {
        try {
            const stopIds: string[] = JSON.parse(savedStops);
            return stopIds
                .map((stopId) => stations.find((station) => station.PARADA === stopId))
                .filter(Boolean) as Parada[];
        } catch (error) {
            console.error('Error al cargar paradas desde localStorage:', error);
        }
    } else {
        return [];
    }
}
export function saveStationIds(stationIds: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stationIds));
}