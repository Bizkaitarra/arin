const STORAGE_KEY = 'bizkaibus_selected_stops';
import paradas from '../data/paradas.json';
export interface Parada {
    PROVINCIA: string;
    DESCRIPCION_PROVINCIA: string;
    MUNICIPIO: string;
    DESCRIPCION_MUNICIPIO: string;
    PARADA: string;
    DENOMINACION: string;
    LATITUD: string;
    LONGITUD: string;
    IS_FAVORITE?: boolean;
}
export interface Municipio
{
    PROVINCIA: string;
    DESCRIPCION_PROVINCIA: string;
    MUNICIPIO: string;
    DESCRIPCION_MUNICIPIO: string;
}
export function getSavedStationIds(): string[] {
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (savedStops) {
        return JSON.parse(savedStops);
    }
    return [];
}

export function getStations(favoritesFirsts: Boolean = false): Parada[] {
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (!savedStops) return paradas;

    try {
        const favoriteIds: string[] = JSON.parse(savedStops);

        const stopsWithFavoriteFlag = paradas.map(parada => ({
            ...parada,
            IS_FAVORITE: favoriteIds.includes(parada.PARADA),
        }));

        if (!favoritesFirsts) {
            return stopsWithFavoriteFlag;
        }

        const favoriteStops = stopsWithFavoriteFlag.filter(parada => parada.IS_FAVORITE);
        const nonFavoriteStops = stopsWithFavoriteFlag.filter(parada => !parada.IS_FAVORITE);

        const sortedFavoriteStops = favoriteStops.sort((a, b) => {
            return favoriteIds.indexOf(a.PARADA) - favoriteIds.indexOf(b.PARADA);
        });

        return [...sortedFavoriteStops, ...nonFavoriteStops];

    } catch (error) {
        console.error('Error al cargar paradas desde localStorage:', error);
        return [];
    }
}


export function saveStationIds(stationIds: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stationIds));
}