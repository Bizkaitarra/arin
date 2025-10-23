
import paradas from "../data/paradas_renfe.json";
import {RenfeStop} from "./Renfe/RenfeStop";

const STORAGE_KEY = 'Renfe_selected_stops';

export function getRenfeStops(favoritesFirsts: boolean = false): RenfeStop[] {
    const savedStops = localStorage.getItem(STORAGE_KEY);

    if (!savedStops) {
        const stopsWithFavoriteFlag = paradas.map(parada => ({
            ...parada,
            isFavorite: false,
        }));
        return stopsWithFavoriteFlag;
    }

    try {
        let favoriteIds: string[] = JSON.parse(savedStops);
        //Exclude routes, only stops
        favoriteIds = favoriteIds.filter(id => !id.includes('-'));

        const stopsWithFavoriteFlag = paradas.map(parada => ({
            ...parada,
            isFavorite: favoriteIds.includes(parada.id),
        }));

        if (!favoritesFirsts) {
            return stopsWithFavoriteFlag;
        }

        const favoriteStops = stopsWithFavoriteFlag.filter(parada => parada.isFavorite);
        const nonFavoriteStops = stopsWithFavoriteFlag.filter(parada => !parada.isFavorite);

        const sortedFavoriteStops = favoriteStops.sort((a, b) => {
            return favoriteIds.indexOf(a.id) - favoriteIds.indexOf(b.id);
        });

        return [...sortedFavoriteStops, ...nonFavoriteStops];

    } catch (error) {
        console.error('Error loading renfe stops from localStorage:', error);
        return [];
    }
}

export function addRenfeRoute(route: string): void {
    const savedStops = localStorage.getItem(STORAGE_KEY);
    let favoriteIds: string[] = [];
    if (savedStops) {
        favoriteIds = JSON.parse(savedStops);
    }
    favoriteIds.push(route);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
}
