const STORAGE_KEY = 'bizkaibus_selected_stops';
const RENAME_KEY = 'bizkaibus_renamed_stops';

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
    CUSTOM_NAME?: string;
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

export function getStations(favoritesFirsts: boolean = false): Parada[] {
    // Cargamos el mapping de nombres renombrados
    const renamedStopsRaw = localStorage.getItem(RENAME_KEY);
    let renamedStops: { [id: string]: string } = {};
    if (renamedStopsRaw) {
        try {
            renamedStops = JSON.parse(renamedStopsRaw);
        } catch (error) {
            console.error("Error al parsear bizkaibus_renamed_stops:", error);
        }
    }

    // Actualizamos cada parada: si existe un nombre renombrado, se asigna a CUSTOM_NAME;
    // en caso contrario se utiliza DENOMINACION.
    const paradasActualizadas = paradas.map(parada => ({
        ...parada,
        CUSTOM_NAME: renamedStops[parada.PARADA] || parada.DENOMINACION
    }));

    // Cargamos las paradas favoritas
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (!savedStops) return paradasActualizadas;

    try {
        const favoriteIds: string[] = JSON.parse(savedStops);
        const stopsWithFavoriteFlag = paradasActualizadas.map(parada => ({
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
        return paradasActualizadas;
    }
}

export function saveStationIds(stationIds: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stationIds));
}

export function saveRenamedStation(station: Parada): void {
    // Cargamos el mapping actual de nombres renombrados
    const renamedStopsRaw = localStorage.getItem(RENAME_KEY);
    let renamedStops: { [id: string]: string } = {};
    if (renamedStopsRaw) {
        try {
            renamedStops = JSON.parse(renamedStopsRaw);
        } catch (error) {
            console.error("Error al parsear bizkaibus_renamed_stops:", error);
        }
    }
    // Se actualiza o agrega el nuevo nombre: si station.CUSTOM_NAME está definido se utiliza,
    // en caso contrario se usa station.DENOMINACION
    renamedStops[station.PARADA] = station.CUSTOM_NAME || station.DENOMINACION;
    localStorage.setItem(RENAME_KEY, JSON.stringify(renamedStops));
}