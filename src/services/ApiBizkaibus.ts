import paradas from '../data/paradas.json';
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
    message: string;
    data?: StopData;
}


async function fetchStopData(parada: Parada): Promise<BusArrivalResponse> {
    try {
        const url = `https://apli.bizkaia.net/APPS/DANOK/TQWS/TQ.ASMX/GetPasoParadaMobile_JSON?callback=%22%22&strLinea=&strParada=${parada.PARADA}`;

        const response = await fetch(url, { method: 'GET' });
        const text = await response.text();
        let cleanedText = text.replace('""(', '').replace(');', '').replace(/'/g, '"');
        const jsonData = JSON.parse(cleanedText);

        if (jsonData.STATUS === "NOINFO") {
            return { status: "NOINFO", message: "Bizkaibus no está proporcionando información para la parada " + parada.PARADA + " " +  parada.DENOMINACION };
        }

        if (jsonData.STATUS !== "OK") {
            return { status: "ERROR", message: jsonData.Error || "Error desconocido." };
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
            message: "Datos obtenidos correctamente.",
            data: { parada, arrivals },
        };
    } catch (error) {
        return { status: "ERROR", message: "Error al obtener los datos." };
    }
}


export async function fetchStopsData(stops: Parada[]): Promise<BusArrivalResponse[]> {
    const promises = stops.map(stop => fetchStopData(stop));
    return Promise.all(promises);
}

export interface ConsultaHorario {
    Linea: string;
    Descripcion: string;
    DescripcionRuta: string;
    TRTipoRuta: string;
    TRDenominacionTipoRuta: string;
    FechaConsultaHorario: string;
    FechaProximoCambioHorario?: string;
    Horario: Record<string, string>;
}

export const loadHorarios = async (codigoLinea: string): Promise<ConsultaHorario[]> => {
    const hoy = new Date();
    const hoyStr = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
    const baseUrl = "https://apli.bizkaia.net/apps/danok/tqws/tq.asmx/GetHorario_JSON";

    const fetchData = async (fecha: string, numeroRuta: string) => {
        const url = `${baseUrl}?callback=""&sCodigoLinea=${codigoLinea}&sNumeroRuta=${numeroRuta}&sFechaHorario=${encodeURIComponent(fecha)}`;
        const response = await fetch(url, { method: 'GET' });
        const text = await response.text();

        let jsonString = text.replace(/^\(\s*|\);?$/g, "").replace(/'/g, '"');
        jsonString = jsonString.replace(/^"\(|\)$/g, "");
        jsonString = jsonString.replace(/^""\(|\)$/g, "");

        console.log(jsonString);

        const jsonData = JSON.parse(jsonString);
        if (!jsonData) return null;
        if (jsonData.STATUS !== "OK") { return null; }
        const consulta = jsonData.Consulta as ConsultaHorario;
        if (!hasHorarios(consulta)) return null;
        return consulta;
    };

    let results: ConsultaHorario[] = [];
    let rutaIndex = 1;

    while (true) {
        const numeroRuta = rutaIndex.toString().padStart(3, "0");
        const hoyData = await fetchData(hoyStr, numeroRuta);
        if (!hoyData) break; // Detener si obtenemos un error

        results.push(hoyData);

        if (hoyData.FechaProximoCambioHorario) {
            const [day, month, year] = hoyData.FechaProximoCambioHorario.split("/").map(Number);
            const fechaCambio = new Date(year, month - 1, day);

            if (fechaCambio > hoy) {
                const cambioData = await fetchData(hoyData.FechaProximoCambioHorario, numeroRuta);
                if (cambioData) results.push(cambioData);
            }
        }
        rutaIndex++;
    }

    return results;
};

function hasHorarios(consultaHorario: ConsultaHorario): boolean {
    const horario = consultaHorario.Horario;

    for (const clave in horario) {
        if (clave.startsWith("HT") && clave.endsWith("C")) {
            const valor = horario[clave];
            if (valor !== "") {
                return true;
            }
        }
    }
    return false;
}

const toTitleCase = (str) => {
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