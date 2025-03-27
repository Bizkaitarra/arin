import {Parada} from "./BizkaibusStorage";

export interface BusArrival {
    linea: string;
    ruta: string;
    e1Minutos: number;
    e1Hora: string;
    e2Minutos?: number;
    e2Hora?: string;
}

export interface StopData {
    parada: Parada;
    arrivals: BusArrival[];
}

export interface BusArrivalResponse {
    status: "OK" | "NOINFO" | "ERROR";
    data?: StopData;
    parada: Parada;
}


async function fetchStopData(parada: Parada): Promise<BusArrivalResponse> {
    try {
        const url = `https://apli.bizkaia.net/APPS/DANOK/TQWS/TQ.ASMX/GetPasoParadaMobile_JSON?callback=%22%22&strLinea=&strParada=${parada.PARADA}`;

        const response = await fetch(url, { method: 'GET' });
        const text = await response.text();
        let cleanedText = text.replace('""(', '').replace(');', '').replace(/'/g, '"');
        const jsonData = JSON.parse(cleanedText);

        if (jsonData.STATUS === "NOINFO") {
            return {
                status: "NOINFO",
                parada
            };

        }

        if (jsonData.STATUS !== "OK") {
            return { status: "ERROR", parada: parada };
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(jsonData.Resultado, 'text/xml');


        const pasosParada = xmlDoc.getElementsByTagName('PasoParada');
        const arrivals: BusArrival[] = Array.from(pasosParada).map((paso) => {
            const linea = toTitleCase(paso.getElementsByTagName('linea')[0]?.textContent) || 'N/A';
            const ruta = toTitleCase(paso.getElementsByTagName('ruta')[0]?.textContent) || 'N/A';
            const e1Minutos = parseInt(
                paso.getElementsByTagName('e1')[0]?.getElementsByTagName('minutos')[0]?.textContent || '0',
                10
            );
            const e2Minutos = parseInt(
                paso.getElementsByTagName('e2')[0]?.getElementsByTagName('minutos')[0]?.textContent || '0',
                10
            ) || undefined;

            let e2Hora = "";
            if (e2Minutos !== undefined) {
                e2Hora = calcularHora(e2Minutos);
            }
            return ({
                linea: linea,
                ruta: ruta,
                e1Minutos: e1Minutos,
                e1Hora: calcularHora(e1Minutos),
                e2Minutos: e2Minutos,
                e2Hora: e2Hora
            });
        });

        return {
            status: "OK",
            data: { parada, arrivals },
            parada
        };
    } catch (error) {
        return { status: "ERROR", parada: parada};
    }
}


export async function fetchStopsData(stops: Parada[]): Promise<BusArrivalResponse[]> {
    const promises = stops.map(stop => fetchStopData(stop));
    return Promise.all(promises);
}


const toTitleCase = (str) => {
    if (str.toUpperCase() === "UPV/EHU") {
        return "UPV/EHU";
    }
    if (str.toUpperCase() === "EHU/UPV") {
        return "EHU/UPV";
    }
    return str
        .toLowerCase()
        .split(/[\s\-.]+/) // Divide por espacios, guiones o puntos
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

// Función para calcular la hora de llegada a partir de los minutos
const calcularHora = (minutos: number): string => {
    const ahora = new Date();
    const horaLlegada = new Date(ahora.getTime() + minutos * 60000);
    return horaLlegada.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};