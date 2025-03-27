
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

export const loadScheduledBusesByRoute = async (codigoLinea: string, numeroRuta: string) => {
    const hoy = new Date();
    const hoyStr = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
    const hoyData = await loadScheduledBusesByDateAndRoute(codigoLinea, hoyStr, numeroRuta);
    if (!hoyData) return [];
    let results: ConsultaHorario[] = [];
    results.push(hoyData);

    if (hoyData.FechaProximoCambioHorario) {
        const [day, month, year] = hoyData.FechaProximoCambioHorario.split("/").map(Number);
        const fechaCambio = new Date(year, month - 1, day);

        if (fechaCambio > hoy) {
            const cambioData = await loadScheduledBusesByDateAndRoute(codigoLinea, hoyData.FechaProximoCambioHorario, numeroRuta);
            if (cambioData) results.push(cambioData);
        }
    }
    return results;
};

const loadScheduledBusesByDateAndRoute = async (codigoLinea: string, fecha: string, numeroRuta: string) => {
    const baseUrl = "https://apli.bizkaia.net/apps/danok/tqws/tq.asmx/GetHorario_JSON";
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