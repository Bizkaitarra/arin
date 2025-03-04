export interface Location {
    latitude: number;
    longitude: number;
}

const LAST_LOCATION_KEY = "lastLocation";
export const GetDefaultLocation = (): Location => {
    const defaultLocation: Location = { latitude: 43.2627, longitude: -2.9494 }; // Estación de Bailén, Bilbao

    const storedLocation = localStorage.getItem(LAST_LOCATION_KEY);

    if (storedLocation) {
        try {
            const parsedLocation: Location = JSON.parse(storedLocation);
            if (parsedLocation.latitude && parsedLocation.longitude) {
                return parsedLocation;
            }
        } catch (error) {
            console.error("Error parsing lastLocation from localStorage:", error);
        }
    }

    return defaultLocation;
};

export const SetlastLocation = (location: Location): void => {
    try {
        localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
    } catch (error) {
        console.error("Error saving lastLocation to localStorage:", error);
    }
};
