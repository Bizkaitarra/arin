import {KBusStop} from "./KbusStop";
import {KBusArrival, KBusArrivalResponse} from "./KBusArrivalResponse";


async function fetchStopData(stop: KBusStop): Promise<KBusArrivalResponse> {
    try {
        const url = `https://www.kbus.eus/getNodeTime.php?node=${stop.id}`;
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            return {
                stop,
                arrivals: []
            };
        }

        const data = await response.json();

        const arrivals: KBusArrival[] = data.map((item: any) => ({
            line: item.linea
                .toLowerCase()
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            destination: item.vh_first.direccion,
            secondsToArrival: item.vh_first.tiempo,
            timeToArrival : calcularHora(item.vh_first.tiempo)
        }));

        return {
            stop,
            arrivals,
        };
    } catch (error) {
        console.error("Error fetching stop data:", error);
        return {
            stop,
            arrivals: []
        };
    }
}

export async function fetchStopsData(stops: KBusStop[]): Promise<KBusArrivalResponse[]> {
    try {
        return await Promise.all(stops.map(stop => fetchStopData(stop)));
    } catch (error) {
        console.error("Error fetching stops data:", error);
        return stops.map(stop => ({ stop, arrivals: [] }));
    }
}

const calcularHora = (segundos: number): string => {
    const ahora = new Date();
    const horaLlegada = new Date(ahora.getTime() + segundos * 1000);
    return horaLlegada.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};



