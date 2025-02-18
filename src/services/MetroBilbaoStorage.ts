import paradas from "../data/paradas_metro.json";
const STORAGE_KEY = 'metro_bilbao_selected_stops';

export interface MetroStop {
    Code: string;
    Name: string;
    Lines: string[];
    IsFavorite?: boolean;
    Platform1: string[];
    Platform2: string[];
}

export interface MetroTrain {
    Wagons: number;
    Estimated: number;
    Direction: string;
    Time: string;
    TimeRounded: string;
}

export interface MetroStopTrains {
    Station: MetroStop;
    Platform1: MetroTrain[];
    Platform2: MetroTrain[];
}

export function getMetroStops(favoritesFirsts: Boolean = false): MetroStop[] {
    const savedStops = localStorage.getItem(STORAGE_KEY);
    console.log(savedStops);
    if (!savedStops) return paradas;

    try {
        const favoriteIds: string[] = JSON.parse(savedStops);
        const stopsWithFavoriteFlag = paradas.map(parada => ({
            ...parada,
            IsFavorite: favoriteIds.includes(parada.Code),
        }));

        if (!favoritesFirsts) {
            return stopsWithFavoriteFlag;
        }

        const favoriteStops = stopsWithFavoriteFlag.filter(parada => parada.IsFavorite);
        const nonFavoriteStops = stopsWithFavoriteFlag.filter(parada => !parada.IsFavorite);

        const sortedFavoriteStops = favoriteStops.sort((a, b) => {
            return favoriteIds.indexOf(a.Code) - favoriteIds.indexOf(b.Code);
        });

        return [...sortedFavoriteStops, ...nonFavoriteStops];

    } catch (error) {
        console.error('Error al cargar paradas desde localStorage:', error);
        return [];
    }
}


export function saveMetroStops(stations: MetroStop[]): void {
    const selectedStops = stations.filter(station => station.IsFavorite);
    const stationIds = selectedStops.map((stop) => stop.Code);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stationIds));
}