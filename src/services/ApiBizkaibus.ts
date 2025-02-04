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