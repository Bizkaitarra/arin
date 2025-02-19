import {Capacitor} from "@capacitor/core";
import {MetroStop, MetroStopTrains, MetroTrain} from "./MetroBilbaoStorage";


async function fetchTrainData(origin: string, destination: string, maxTrains: number): Promise<MetroTrain[]> {
    try {
        const response = await fetch(`https://api.metrobilbao.eus/metro/real-time/${origin}/${destination}`);
        const data = await response.json();
        return data.trains
            .filter((train: any) => train.estimated <= maxTrains)
            .map((train: any) => ({
                Wagons: train.wagons,
                Estimated: train.estimated,
                Direction: train.direction,
                Time: train.time,
                TimeRounded: train.timeRounded
            }));
    } catch (error) {
        console.error(`Error fetching train data for ${origin} to ${destination}:`, error);
        return [];
    }
}


async function getMetroStopTrains(metroStop: MetroStop, maxTrains: number): Promise<MetroStopTrains> {
    const platform1Trains = await Promise.all(metroStop.Platform1.map(dest => fetchTrainData(metroStop.Code, dest, maxTrains)));
    const platform2Trains = await Promise.all(metroStop.Platform2.map(dest => fetchTrainData(metroStop.Code, dest, maxTrains)));

    return {
        Station: metroStop,
        Platform1: platform1Trains.flat(),
        Platform2: platform2Trains.flat()
    };
}


export async function getMetroStopsTrains(stops: MetroStop[], maxTrains: number = 60): Promise<MetroStopTrains[]> {
    const promises = stops.map(stop => getMetroStopTrains(stop, maxTrains));
    return Promise.all(promises);
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




