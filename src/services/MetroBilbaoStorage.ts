import paradas from "../data/paradas_metro.json";
import {Display} from "./MetroBilbao/Display";
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
    Duration: number;
    Transfer: boolean;
}

export interface MetroStopTrains {
    Display: Display;
    Platform1: MetroTrain[];
    Platform2: MetroTrain[];
    isRoute: boolean;
    duration?: number;
    duration2?: number;
}

export function getMetroStops(favoritesFirsts: Boolean = false): MetroStop[] {
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (!savedStops) return paradas;

    try {
        let favoriteIds: string[] = JSON.parse(savedStops);
        //Exclude routes, only stops
        favoriteIds = favoriteIds.filter(id => !id.includes('-'));

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

export function getSavedDisplays(): Display[] {
    const favoriteIdsData = localStorage.getItem(STORAGE_KEY);
    if (!favoriteIdsData) return [];
    let favoriteIds: string[] = JSON.parse(favoriteIdsData);
    return favoriteIds.map((stop) => {
        const [originCode, destinationCode] = stop.split(" - ");
        const origin = paradas.find(p => p.Code === originCode);
        if (!destinationCode) {
            return {origin}
        }
        const destination = destinationCode ? paradas.find(p => p.Code === destinationCode) : undefined;
        return {
            origin,
            destination
        };
    });
}

export function addDisplay(display: Display): void {
    const savedDisplays = localStorage.getItem(STORAGE_KEY);
    let favoriteIds: string[] = [];
    if (savedDisplays) {
        favoriteIds = JSON.parse(savedDisplays);
    }
    const displayId = display.destination ? `${display.origin.Code} - ${display.destination.Code}` : display.origin.Code;
    favoriteIds.push(displayId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
}

export function removeDisplay(display: Display): void {
    const savedDisplays = localStorage.getItem(STORAGE_KEY);
    let favoriteIds: string[] = [];
    if (savedDisplays) {
        favoriteIds = JSON.parse(savedDisplays);
    }
    const displayId = display.destination ? `${display.origin.Code} - ${display.destination.Code}` : display.origin.Code;
    favoriteIds = favoriteIds.filter(id => id !== displayId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
}

export function saveMetroDisplays(displays: Display[]): void {
    const displayIds = displays.map(display => {
        if (display.destination) {
            return `${display.origin.Code} - ${display.destination.Code}`;
        }
        return display.origin.Code;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(displayIds));
}



export function saveMetroStops(stations: MetroStop[]): void {
    const selectedStops = stations.filter(station => station.IsFavorite);
    const stationIds = selectedStops.map((stop) => stop.Code);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stationIds));
}

export function addRoute(route: string): void {
    const savedStops = localStorage.getItem(STORAGE_KEY);
    let favoriteIds: string[] = [];
    if (savedStops) {
        favoriteIds = JSON.parse(savedStops);
    }
    favoriteIds.push(route);
    console.log(favoriteIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
}
