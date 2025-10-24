import paradas from "../../data/paradas_euskotren.json";
import {Display} from "../MetroBilbao/Display";
const EUSKOTREN_STORAGE_KEY = 'euskotren_selected_stops';

export interface EuskotrenStop {
    Code: string;
    Name: string;
    Lines: string[];
    IsFavorite?: boolean;
    Platform1: string[];
    Platform2: string[];
}

export interface EuskotrenTrain {
    Wagons: number;
    Estimated: number;
    Direction: string;
    Time: string;
    TimeRounded: string;
    Duration: number;
    Transfer: boolean;
}

export interface EuskotrenStopTrains {
    Display: Display;
    Platform1: EuskotrenTrain[];
    Platform2: EuskotrenTrain[];
    isRoute: boolean;
    duration?: number;
    duration2?: number;
}

export function getEuskotrenStops(favoritesFirsts: Boolean = false): EuskotrenStop[] {
    const savedStops = localStorage.getItem(EUSKOTREN_STORAGE_KEY);
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

export function getSavedEuskotrenDisplays(): Display[] {
    const favoriteIdsData = localStorage.getItem(EUSKOTREN_STORAGE_KEY);
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

export function addEuskotrenDisplay(display: Display): void {
    const savedDisplays = localStorage.getItem(EUSKOTREN_STORAGE_KEY);
    let favoriteIds: string[] = [];
    if (savedDisplays) {
        favoriteIds = JSON.parse(savedDisplays);
    }
    const displayId = display.destination ? `${display.origin.Code} - ${display.destination.Code}` : display.origin.Code;
    favoriteIds.push(displayId);
    localStorage.setItem(EUSKOTREN_STORAGE_KEY, JSON.stringify(favoriteIds));
}

export function removeEuskotrenDisplay(display: Display): void {
    const savedDisplays = localStorage.getItem(EUSKOTREN_STORAGE_KEY);
    let favoriteIds: string[] = [];
    if (savedDisplays) {
        favoriteIds = JSON.parse(savedDisplays);
    }
    const displayId = display.destination ? `${display.origin.Code} - ${display.destination.Code}` : display.origin.Code;
    favoriteIds = favoriteIds.filter(id => id !== displayId);
    localStorage.setItem(EUSKOTREN_STORAGE_KEY, JSON.stringify(favoriteIds));
}

export function saveEuskotrenDisplays(displays: Display[]): void {
    const displayIds = displays.map(display => {
        if (display.destination) {
            return `${display.origin.Code} - ${display.destination.Code}`;
        }
        return display.origin.Code;
    });
    localStorage.setItem(EUSKOTREN_STORAGE_KEY, JSON.stringify(displayIds));
}



export function saveEuskotrenStops(stations: EuskotrenStop[]): void {
    const selectedStops = stations.filter(station => station.IsFavorite);
    const stationIds = selectedStops.map((stop) => stop.Code);
    localStorage.setItem(EUSKOTREN_STORAGE_KEY, JSON.stringify(stationIds));
}

export function addEuskotrenRoute(route: string): void {
    const savedStops = localStorage.getItem(EUSKOTREN_STORAGE_KEY);
    let favoriteIds: string[] = [];
    if (savedStops) {
        favoriteIds = JSON.parse(savedStops);
    }
    favoriteIds.push(route);
    console.log(favoriteIds);
    localStorage.setItem(EUSKOTREN_STORAGE_KEY, JSON.stringify(favoriteIds));
}