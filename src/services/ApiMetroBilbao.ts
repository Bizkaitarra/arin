import {Capacitor} from "@capacitor/core";
import {MetroStop, MetroStopTrains, MetroTrain} from "./MetroBilbaoStorage";
import {IncidentsResult, MetroBilbaoResponse} from "./MetroBilbao/Incidences";
import i18next from "i18next";
import {Display} from "./MetroBilbao/Display";

async function fetchTrainData(origin: string, destination: string, maxTrains: number): Promise<MetroTrain[]> {
    try {
        const response = await fetch(`https://api.metrobilbao.eus/metro/real-time/${origin}/${destination}`);
        const data = await response.json();
        const duration = data.trip?.duration;

        console.log(duration);
        return data.trains
            .filter((train: any) => train.estimated <= maxTrains)
            .map((train: any) => ({
                Wagons: train.wagons,
                Estimated: train.estimated,
                Direction: train.direction,
                Time: train.time,
                TimeRounded: train.timeRounded,
                Duration: duration,
                Transfer: data.trip.transfer
            }));
    } catch (error) {
        console.error(`Error fetching train data for ${origin} to ${destination}:`, error);
        return [];
    }
}

async function getMetroStopTrains(display: Display, maxTrains: number): Promise<MetroStopTrains> {
    if (!display.destination) {
        const platform1Trains = await Promise.all(display.origin.Platform1.map(dest => fetchTrainData(display.origin.Code, dest, maxTrains)));
        const platform2Trains = await Promise.all(display.origin.Platform2.map(dest => fetchTrainData(display.origin.Code, dest, maxTrains)));
        return {
            Display: display,
            Platform1: platform1Trains.flat().sort((a, b) => a.Estimated - b.Estimated),
            Platform2: platform2Trains.flat().sort((a, b) => a.Estimated - b.Estimated),
            isRoute: false
        };
    }
    const platform1Trains = [await fetchTrainData(display.origin.Code, display.destination.Code, maxTrains)];
    const platform2Trains = [await fetchTrainData(display.destination.Code, display.origin.Code, maxTrains)];
    return {
        Display: display,
        Platform1: platform1Trains.flat().sort((a, b) => a.Estimated - b.Estimated),
        Platform2: platform2Trains.flat().sort((a, b) => a.Estimated - b.Estimated),
        isRoute: true
    };
}


export async function getMetroDisplaysTrains(displays: Display[], maxTrains: number = 60): Promise<MetroStopTrains[]> {
    const promises = displays.map(display => getMetroStopTrains(display, maxTrains));
    return Promise.all(promises);
}



export async function fetchMetroBilbaoIncidents(): Promise<IncidentsResult> {
    let language = i18next.language || "es"; // Idioma actual o español por defecto

    // Solo permitimos "es" y "eu", cualquier otro idioma usa "es"
    if (language !== "es" && language !== "eu") {
        language = "es";
    }

    const endpoint = language === "eu" ? "abisuak" : "avisos";
    const response = await fetch(`https://api.metrobilbao.eus/metro_page/${language}/${endpoint}`);

    if (!response.ok) {
        throw new Error("Error fetching Metro Bilbao incidents");
    }

    const data: MetroBilbaoResponse = await response.json();

    return {
        serviceIssues: [],
        installationIssues: data.configuration.incidences.installation_issue.map(incident => ({
            ...incident,
            station: { code: incident.station.code },
        })),
    };
}




export async function getBarikData(barikNumber: string) {
    const url = "https://www.ctb.eus/llamadaServicioBarik.php";
    const params = `p=IdTarjeta*${barikNumber}|vacio*vacio&metodo=consultaTitulosRecargablesAnt`;

    try {
        let response;

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://www.ctb.eus",  // Cabecera Origin
            "Referer": "https://www.ctb.eus",  // Cabecera Referer
            "Sec-Fetch-Dest": "empty",  // Cabecera Sec-Fetch-Dest
            "Sec-Fetch-Mode": "cors",   // Cabecera Sec-Fetch-Mode
            "Sec-Fetch-Site": "same-origin" // Cabecera Sec-Fetch-Site
        };

        if (Capacitor.isNativePlatform()) {
            response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: params
            });
            const data = await response.text();
            console.log(data);
            return parseBarikResponse(data);
        } else {
            response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: params
            });
            const data = await response.text();
            console.log(data);
            return parseBarikResponse(data);
        }
    } catch (error) {
        console.error("Error es:", error);
        return {
            Status: 'ERROR',
            Gizatrans: undefined,
            Creditrans: undefined
        };
    }
}



function parseBarikResponse(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const status = xmlDoc.getElementsByTagName("resultado")[0]?.textContent || "";

    let gizatrans;
    let creditrans;

    const titulosMonedero = xmlDoc.getElementsByTagName("titulosMonedero");

    for (let monedero of titulosMonedero) {
        const tipoTitulo = monedero.getElementsByTagName("TipoTitulo")[0]?.textContent || "";
        const sldMon = monedero.getElementsByTagName("SldMon")[0]?.textContent;

        if (tipoTitulo === "Monedero Gizatrans") {
            gizatrans = sldMon !== undefined ? sldMon : undefined;
        }

        if (tipoTitulo === "Monedero Creditrans") {
            creditrans = sldMon !== undefined ? sldMon : undefined;
        }
    }

    return {
        Status: status,
        Gizatrans: gizatrans,
        Creditrans: creditrans
    };
}




