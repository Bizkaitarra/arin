import paradas from '../data/paradas.json';

async function fetchStopData(stop: string): Promise<any> {
    const url = `https://apli.bizkaia.net/APPS/DANOK/TQWS/TQ.ASMX/GetPasoParadaMobile_JSON?callback=%22%22&strLinea=&strParada=${stop}`;

    try {
        const response = await fetch(url, { method: 'GET' });
        const text = await response.text();
        let cleanedText = text.replace('""(', '').replace(');', '').replace(/'/g, '"');
        const jsonData = JSON.parse(cleanedText);
        return jsonData.Resultado;
    } catch (error) {
        console.error(`Error fetching data for stop ${stop}:`, error);
        throw error;
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