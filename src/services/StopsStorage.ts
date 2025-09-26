import {Stop} from "./Stop";
import {Display} from "./Display";

export abstract class StopsStorage {

    constructor(
        protected key: string,
        protected renameKey: string
    ) {
    }

    protected abstract allStops(): Stop[];

    public getSavedStationIds(): string[] {
        const savedStops = localStorage.getItem(this.key);
        if (savedStops) {
            return JSON.parse(savedStops);
        }
        return [];
    }

    public getStations(favoritesFirsts: boolean = false): Stop[] {
        const renamedStops = this.renamedStopIds()
        const favoriteIds = this.favoriteStopIds();
        console.log('renamed stops', favoriteIds);
        const stops = this.allStops().map(stop => ({
            ...stop,
            customName: renamedStops[stop.id] || stop.name,
            isFavorite: favoriteIds.includes(stop.id),
        }));


        if (!favoritesFirsts) {
            return stops;
        }

        const favoriteStops = stops.filter(parada => parada.isFavorite);
        const nonFavoriteStops = stops.filter(parada => !parada.isFavorite);

        const sortedFavoriteStops = favoriteStops.sort((a, b) => {
            return favoriteIds.indexOf(a.id) - favoriteIds.indexOf(b.id);
        });

        return [...sortedFavoriteStops, ...nonFavoriteStops];
    }

    getStationById(id: string): Stop | undefined {
        const stops = this.allStops();
        const stop = stops.find(stop => stop.id === id);
        if (stop) {
            const renamedStops = this.renamedStopIds();
            return {
                ...stop,
                customName: renamedStops[stop.id] || stop.name,
                isFavorite: this.favoriteStopIds().includes(stop.id),
            };
        }
        return undefined;
    }

    private renamedStopIds() {
        const renamedStopsRaw = localStorage.getItem(this.renameKey);
        if (renamedStopsRaw) {
            try {
                return JSON.parse(renamedStopsRaw);
            } catch (error) {
            }
        }
        return [];
    }

    private favoriteStopIds(): string[] {
        const savedStops = localStorage.getItem(this.key);
        if (savedStops) {
            try {
                return JSON.parse(savedStops);
            } catch (error) {
                console.log(error);
            }
        }
        return [];
    }

    public saveStationIds(stationIds: string[]): void {
        localStorage.setItem(this.key, JSON.stringify(stationIds));
    }

    public saveRenamedStation(station: Stop): void {
        const renamedStopsRaw = localStorage.getItem(this.renameKey);
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
        renamedStops[station.id] = station.customName || station.name;
        localStorage.setItem(this.renameKey, JSON.stringify(renamedStops));
    }

    public addStop(stop: Stop): void {
        const savedDisplays = localStorage.getItem(this.key);
        let favoriteIds: string[] = [];
        if (savedDisplays) {
            favoriteIds = JSON.parse(savedDisplays);
        }
        favoriteIds.push(stop.id);
        localStorage.setItem(this.key, JSON.stringify(favoriteIds));
    }

    public removeStop(stop: Stop): void {
        const savedDisplays = localStorage.getItem(this.key);
        let favoriteIds: string[] = [];
        if (savedDisplays) {
            favoriteIds = JSON.parse(savedDisplays);
        }
        const stopId = stop.id;
        favoriteIds = favoriteIds.filter(id => id !== stopId);
        localStorage.setItem(this.key, JSON.stringify(favoriteIds));
    }

    public addRoute(route: string): void {
        const savedStops = localStorage.getItem(this.key);
        let favoriteIds: string[] = [];
        if (savedStops) {
            favoriteIds = JSON.parse(savedStops);
        }
        favoriteIds.push(route);
        localStorage.setItem(this.key, JSON.stringify(favoriteIds));
    }

    public getSavedDisplays(): Display[] {
        const favoriteIdsData = localStorage.getItem(this.key);
        if (!favoriteIdsData) return [];
        let favoriteIds: string[] = JSON.parse(favoriteIdsData);
        return favoriteIds.map((stop) => {
            const [originCode, destinationCode] = stop.split(" - ");
            const origin = this.allStops().find(p => p.id === originCode);
            if (!destinationCode) {
                return {origin}
            }
            const destination = destinationCode ? this.allStops().find(p => p.id === destinationCode) : undefined;
            return {
                origin,
                destination
            };
        });
    }


    public saveDisplays(displays: Display[]) {
        const displayIds = displays.map(display => {
            if (display.destination) {
                return `${display.origin.id} - ${display.destination.id}`;
            }
            return display.origin.id;
        });
        localStorage.setItem(this.key, JSON.stringify(displayIds));
    }
}