import paradas from "../data/paradas_metro.json";

async function fetchStopData(stop: string) {
    const url = `https://api.metrobilbao.eus/api/stations/${stop}?lang=es`;
    const opciones = {
        method: "GET",
        headers: {
            "Origin": "https://www.metrobilbao.eus",
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, opciones);
        if (!response.ok) throw new Error("Error al obtener datos de la estación");
        return await response.json();
    } catch (error) {
        console.error("Error al obtener datos de la estación:", error);
        return null;
    }
}

export async function fetchStopsData(stops: string[]): Promise<any[]> {
    const promises = stops.map(stop => fetchStopData(stop));
    return Promise.all(promises);
}

export const loadStops = async () => {
    try {
        // Retornar directamente el JSON importado
        return paradas;
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
        throw error; // Relanzar el error para manejarlo externamente si es necesario
    }
};